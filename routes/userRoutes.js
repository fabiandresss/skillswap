const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Método para que el usuario se registre
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validación básica para el registro
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Validación por si ya existe en email dentro de la BD
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'El email ya está registrado '})
        }

        // Crear un nuevo usuario y guardarlo con método .save()
        const newUser = new User({ name, email, password });
        await newUser.save();

        res.status(201).json({ message: 'Usuario creado correctamente' });
    } catch (error) {
        console.error('Error al registrar usuario: ', error);
        res.status(500).json({ message: 'Error del servidor: ', error: error.message});
    }
});

// Método para que el usuario registrado inicie sesión
router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'El usuario no existe o no tiene contraseña' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        res.status(200).json({
            message: 'Usuario autenticado correctamente',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error al iniciar sesión: ', error);
        res.status(500).json({ message: 'Error del servidor: ', error: error.message });
    }
});

// Método para obtener a un usuario según su id
router.get ('/profile/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'El usuario no existe' });
        }

        res.status(200).json({
            message: '¡Perfil cargado correctamente!',
            user
        });
    } catch (error) {
        console.error('Error al cargar perfil: ', error);
        res.status(500).json({ message: 'Error del servidor: ', error: error.message });
    }
});

// Método para que el usuario pueda actualizar y agregar sus habilidades que sabe y las que quiere
router.put('/profile/:id/skills', async (req, res) => {
    try {
        const { skillsHave, skillsWant } = req.body;
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado'});
        }

        if (skillsHave) user.skillsHave = skillsHave;
        if (skillsWant) user.skillsWant = skillsWant;

        await user.save();

        res.status(200).json({
            message: '¡Habilidades actualizadas correctamente!',
            user: {
                id: user._id,
                name: user.name,
                skillsHave: user.skillsHave,
                skillsWant: user.skillsWant
            }
        });
    } catch (error) {
        console.error('Error al actualizar habilidades: ', error);
        res.status(500).json({ message: 'Error del servidor: ', error: error.message });
    }
});

module.exports = router;
