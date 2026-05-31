// useSqliteAuthState.js
// import Database from '@mmmbuto/better-sqlite3-termux';
//;import Database from 'better-sqlite3';
import initSqlJs from 'sql.js'
import fs from 'fs';
import { BufferJSON, initAuthCreds, proto } from 'baileys';
import { makeCacheableSignalKeyStore } from 'baileys';

const useSqliteAuthState = async (filename = 'session.db', sessionId = 'default') => {
    const db = new Database(filename);

    // Create tables
    db.exec(`
        CREATE TABLE IF NOT EXISTS auth (
            sessionId TEXT PRIMARY KEY,
            creds TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS keys (
            id TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
    `);

    // Prepared statements
    const getCredsStmt = db.prepare('SELECT creds FROM auth WHERE sessionId = ?');
    const saveCredsStmt = db.prepare('INSERT OR REPLACE INTO auth (sessionId, creds) VALUES (?, ?)');
    const getKeyStmt = db.prepare('SELECT value FROM keys WHERE id = ?');
    const saveKeyStmt = db.prepare('INSERT OR REPLACE INTO keys (id, value) VALUES (?, ?)');
    const deleteKeyStmt = db.prepare('DELETE FROM keys WHERE id = ?');
    const deleteSessionStmt = db.prepare('DELETE FROM auth WHERE sessionId = ?');
    const deleteKeysStmt = db.prepare('DELETE FROM keys WHERE id LIKE ?');

    // Load or initialize credentials
    let creds = getCredsStmt.get(sessionId)?.creds;
    if (creds) {
        creds = JSON.parse(creds, BufferJSON.reviver);
    } else {
        creds = initAuthCreds();
        saveCredsStmt.run(sessionId, JSON.stringify(creds, BufferJSON.replacer));
    }

    const state = {
        creds,
        keys: makeCacheableSignalKeyStore({
            get: async (type, ids) => {
                const data = {};
                for (const id of ids) {
                    const keyId = `${sessionId}:${type}-${id}`;
                    const row = getKeyStmt.get(keyId);

                    if (row?.value) {
                        let value = JSON.parse(row.value, BufferJSON.reviver);

                        // Special handling for app-state-sync-key
                        if (type === 'app-state-sync-key' && value) {
                            value = proto.Message.AppStateSyncKeyData.fromObject(value);
                        }

                        data[id] = value;
                    }
                }
                return data;
            },

            set: async (data) => {
                for (const category in data) {
                    for (const id in data[category]) {
                        const keyId = `${sessionId}:${category}-${id}`;
                        const value = data[category][id];

                        if (value) {
                            saveKeyStmt.run(keyId, JSON.stringify(value, BufferJSON.replacer));
                        } else {
                            deleteKeyStmt.run(keyId);
                        }
                    }
                }
            }
        })
    };

    const saveCreds = async () => {
        saveCredsStmt.run(sessionId, JSON.stringify(state.creds, BufferJSON.replacer));
    };

    const removeCreds = async () => {
        deleteSessionStmt.run(sessionId);
        deleteKeysStmt.run(`${sessionId}:%`);
        console.log(`✅ Session '${sessionId}' cleared`);
    };

    return { state, saveCreds, removeCreds, db };
};


/**

	Sql.js auth state 

**/
const useSqlJsAuthState = async (filename = 'session.db', sessionId = 'default') => {
    const SQL = await initSqlJs();

    let db;

    // Load existing database
    if (fs.existsSync(filename)) {
        const fileBuffer = fs.readFileSync(filename);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
    }

    /**
     * Persist database to disk
     */
    const saveDatabase = () => {
		// write to a temp file first
		const tempFile = `${filename}.tmp`
        const data = db.export();
		fs.writeFileSync(tempFile, Buffer.from(data));
        fs.renameSync(tempFile, filename);
    };

    /**
     * Create tables
     */
    db.run(`
        CREATE TABLE IF NOT EXISTS auth (
            sessionId TEXT PRIMARY KEY,
            creds TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS keys (
            id TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
    `);
    saveDatabase();

    /**
     * Auth helpers
     */
    const getCreds = () => {
        const result = db.exec(`
            SELECT creds
            FROM auth
            WHERE sessionId = ?
            `, [sessionId]
        );

        if (!result.length) {
            return null;
        }

        return result[0].values[0][0];
    };

    const saveCredsToDB = creds => {
        db.run(`
            INSERT OR REPLACE INTO auth
            (sessionId, creds)
            VALUES (?, ?)
            `, [ sessionId, JSON.stringify(creds, BufferJSON.replacer) ]
        );

        saveDatabase();
    };

    const getKey = keyId => {
        const result = db.exec(`
            SELECT value
            FROM keys
            WHERE id = ?
            `, [ keyId ]
        );

        if (!result.length) {
        	return null;
        }

        return result[0].values[0][0];
    };

    const saveKey = ( keyId, value ) => {
        db.run(`
            INSERT OR REPLACE INTO keys
            (id, value)
            VALUES (?, ?)
            `, [ keyId, JSON.stringify(value, BufferJSON.replacer) ]
        );
    };

    const deleteKey = keyId => {
        db.run(`
            DELETE FROM keys
            WHERE id = ?
            `, [ keyId ]
        );
    };

    /**
     * Load credentials
     */
    let creds = getCreds();

    if (creds) {
        creds = JSON.parse(creds, BufferJSON.reviver);
    } else {
        creds = initAuthCreds();
        saveCredsToDB(creds);
    }

    const state = {
        creds,

        keys: makeCacheableSignalKeyStore({
            get: async ( type, ids ) => {
                const data = {};

                for (const id of ids) {
                    const keyId = `${sessionId}:${type}-${id}`;

                    const row = getKey(keyId);

                    if (!row) {
                        continue;
                    }

                    let value = JSON.parse(row, BufferJSON.reviver);

                    if (type === 'app-state-sync-key' && value) {
                        value = proto.Message.AppStateSyncKeyData.fromObject(value);
                    }
                    data[id] = value;
                }

                return data;
            },

            set: async data => {
                let changed = false;
				
                for (const category in data) {
                    for (const id in data[category]) {
                        const keyId = `${sessionId}:${category}-${id}`;
                        const value = data[category][id];
                        if (value) {
                            saveKey(keyId, value);
                        } else {
                            deleteKey(keyId);
                        }
                        changed = true;
                    }
                }

                if (changed) {
                    saveDatabase();
                }
            }
        })
    };

    const saveCreds = async () => {
        saveCredsToDB(state.creds);
    };

    const removeCreds = async () => {
        db.run(`
            DELETE FROM auth
            WHERE sessionId = ?
            `, [ sessionId ]
        );

        db.run(`
            DELETE FROM keys
            WHERE id LIKE ?
            `, [ `${sessionId}:%` ]
        );

        saveDatabase();

        console.log(`✅ Session '${sessionId}' cleared`);
    };

    return { state, saveCreds, removeCreds, db };
};

export default useSqlJsAuthState;
// export useSqliteAuthState;