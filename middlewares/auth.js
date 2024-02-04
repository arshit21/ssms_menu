require('dotenv').config();

function checkPassword(req, res, next) {

    const providedPassword = req.body['password'];
    const expectedPassword = process.env.PASSWORD;
    if (providedPassword === expectedPassword) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized access' });
    }
}

module.exports = checkPassword;
