// useSqliteAuthState.js
import Database from 'better-sqlite3';
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
                    const keyId = `\( {sessionId}: \){type}-${id}`;
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
                        const keyId = `\( {sessionId}: \){category}-${id}`;
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

export default useSqliteAuthState;