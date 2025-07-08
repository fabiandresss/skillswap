const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware base
app.use(express.json());

app.use(express.static('public'));

// Importar rutas
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);


// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola SkillSwap!');
});

// Conectar a MongoDB y luego iniciar el servidor
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conectado a MongoDB');
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ Error al conectar a MongoDB:', err.message);
});
