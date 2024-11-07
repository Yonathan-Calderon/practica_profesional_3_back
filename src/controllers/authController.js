const db = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const SECRET_KEY = 'admin';

exports.login = (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).send(err.message);
            }
            if (!isMatch) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }

            // Token
            const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token });
        });
    });
};
