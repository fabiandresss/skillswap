const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Método para que el usuario se registre
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validación básica para el registro
        if (!name || name.trim().length < 2) {
            return res.status(400).json({ message: 'El nombre es obligatorio y debe tener al menos 2 caracteres'});
        }

        if (!email || !email.includes('@' || email.length < 5)) {
            return res.status(400).json({ message: 'El correo electrónico es obligatorio y debe tener un formato válido'});
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'La contraseña es obligatoria y debe tener al menos 6 caracteres'});
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

        if (skillsHave && !Array.isArray(skillsHave)) {
            return res.status(400).json({ message: 'Las habilidades que tienes deben ser un arreglo' });
        }

        if (skillsWant && !Array.isArray(skillsWant)) {
            return res.status(400).json({ message: 'Las habilidades que quieres deben ser un arreglo' });
        }

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

router.put('/profile/:id/info', async (req, res) => {
    try {
        const { bio, interests, whyLearn, whatTeach } = req.body;
        const userId = req.params.id;

        if (bio && bio.length > 300) {
            return res.status(400).json({ message: 'La bio no puede tener más de 300 caracteres' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado'});
        }

        if (bio!== undefined) user.bio = bio;
        if (interests !== undefined) user.interests = interests;
        if (whyLearn !== undefined) user.whyLearn = whyLearn;
        if (whatTeach !== undefined) user.whatTeach = whatTeach;

        await user.save();

        res.status(200).json({
            message: '¡Perfil actualizada correctamente!',
            user: {
                id: user._id,
                bio: user.bio,
                interests: user.interests,
                whyLearn: user.whyLearn,
                whatTeach: user.whatTeach
                }
        });
    } catch (error) {
        console.error('Error al actualizar perfil: ', error);
        res.status(500).json({ message: 'Error del servidor: ', error: error.message });
    }
});

router.get('/explore/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const users = await User.find({ _id: {$ne: userId }}).select('-password');

        res.status(200).json({
            message: 'Usuarios encontrados',
            users
        });
    }  catch (error) {
            console.error('Error al buscar usuarios: ', error);
            res.status(500).json({ message: 'Error del servidor: ', error: error.message });
        }
});
module.exports = router;
