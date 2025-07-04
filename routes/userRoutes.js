const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'El email ya está registrado '})
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: 'Usuario creado correctamente' });
    } catch (error) {
        console.error('Error al registrar usuario: ', error);
        res.status(500).json({ message: 'Error del servidor: ', error: error.message});
    }
});

module.exports = router;
