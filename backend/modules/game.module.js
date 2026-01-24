export async function saveGameCustomization(req, reply) {

    const { tableBg, ballColor, paddleColor, aiDifficulty, winningScore } = req.body;
    const userId = req.user.id_user;
    const db = req.server.db;

    
    if (!tableBg || !ballColor || !paddleColor) {
        return reply.code(400).send({
            success: false,
            message: 'Missing required fields: tableBg, ballColor, and paddleColor are required'
        });
    }









    
    
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
    if (!hexColorRegex.test(tableBg) || !hexColorRegex.test(ballColor) || !hexColorRegex.test(paddleColor)) {
        return reply.code(400).send({
            success: false,
            message: 'Invalid color format. Colors must be in hex format (e.g., #FF0000)'
        });
    }

    
    if (aiDifficulty && !['easy', 'medium', 'hard'].includes(aiDifficulty)) {
        return reply.code(400).send({
            success: false,
            message: 'Invalid aiDifficulty. Must be one of: easy, medium, hard'
        });
    }

    
    if (winningScore && ![5, 10].includes(winningScore)) {
        return reply.code(400).send({
            success: false,
            message: 'Invalid winningScore. Must be either 5 or 10'
        });
    }

    
    const userExists = db.prepare('SELECT id_user FROM users WHERE id_user = ?').get(userId);
    if (!userExists) {
        return reply.code(404).send({
            success: false,
            message: 'User not found'
        });
    }

    try {
        const existingSetting = db.prepare('SELECT * FROM game_settings WHERE userId = ?').get(userId);

        if (existingSetting) {
            db.prepare('UPDATE game_settings SET tableBg = ?, ballColor = ?, paddleColor = ?, aiDifficulty = ?, winningScore = ? WHERE userId = ?')
              .run(tableBg, ballColor, paddleColor, aiDifficulty || null, winningScore || 5, userId);
        } else {
            db.prepare('INSERT INTO game_settings (userId, tableBg, ballColor, paddleColor, aiDifficulty, winningScore) VALUES (?, ?, ?, ?, ?, ?)')
              .run(userId, tableBg, ballColor, paddleColor, aiDifficulty || null, winningScore || 5);
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
            reply.send({ tableBg: null, ballColor: null, paddleColor: null, aiDifficulty: null, winningScore: 5 });
        }
    } catch (error) {
        console.error('Error getting game customization:', error);
        reply.status(500).send({ success: false, message: 'Failed to get game customization.' });
    }
}