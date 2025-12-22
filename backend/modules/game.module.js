export async function saveGameCustomization(req, reply) {
    const { tableBg, ballColor, paddleColor } = req.body;
    const userId = req.user.id_user;
    const db = req.server.db;

    try {
        const existingSetting = db.prepare('SELECT * FROM game_settings WHERE userId = ?').get(userId);

        if (existingSetting) {
            db.prepare('UPDATE game_settings SET tableBg = ?, ballColor = ?, paddleColor = ? WHERE userId = ?')
              .run(tableBg, ballColor, paddleColor, userId);
        } else {
            db.prepare('INSERT INTO game_settings (userId, tableBg, ballColor, paddleColor) VALUES (?, ?, ?, ?)')
              .run(userId, tableBg, ballColor, paddleColor);
        }

        reply.send({ success: true, message: 'Game customization saved successfully.' });
    } catch (error) {
        console.error('Error saving game customization:', error);
        reply.status(500).send({ success: false, message: 'Failed to save game customization.' });
    }
}

export async function getGameCustomization(req, reply) {
    const userId = req.user.id_user;
    const db = req.server.db;

    try {
        const settings = db.prepare('SELECT * FROM game_settings WHERE userId = ?').get(userId);

        if (settings) {
            reply.send(settings);
        } else {
            reply.send({ tableBg: null, ballColor: null, paddleColor: null });
        }
    } catch (error) {
        console.error('Error getting game customization:', error);
        reply.status(500).send({ success: false, message: 'Failed to get game customization.' });
    }
}