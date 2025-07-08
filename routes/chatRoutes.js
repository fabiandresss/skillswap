const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');


router.post('/conversation', async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = new Conversation({ participants: [senderId, receiverId]});
            await conversation.save();
        }

        res.status(200).json({ message: 'Conversación encontrada o creada', conversation});
    } catch (error) {
        res.status(500).json({ message: 'Error al crear conversación', error: error.message});
    }
});

router.post('/message', async (req, res) => {
  const { conversationId, senderId, text } = req.body;

  try {
    const message = new Message({ conversationId, sender: senderId, text });
    await message.save();

    res.status(201).json({ message: 'Mensaje enviado', messageData: message });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar mensaje', error: error.message });
  }
});

router.get('/messages/:conversationId', async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId }).sort({ timestamp: 1 });
    res.status(200).json({ message: 'Mensajes cargados', messages });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener mensajes', error: error.message });
  }
});

router.get('/conversations/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const conversations = await Conversation.find({ participants: userId });
    res.status(200).json({ message: 'Conversaciones encontradas', conversations });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener conversaciones', error: error.message });
  }
});

module.exports = router;