const params = new URLSearchParams(window.location.search);
const conversationId = params.get('conversationId');
const currentUserId = params.get('userId');
const messagesContainer = document.getElementById('messages');

let lastMessageCount = 0;

function scrollToBottom() {
  const isNearBottom =
    messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight <= 150;

  if (force || isNearBottom) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

function loadMessages() {
  fetch(`/api/chat/messages/${conversationId}`)
    .then(res => res.json())
    .then(data => {
      if (data.messages.length === lastMessageCount) return;
      const isNearBottom =
        messagesContainer.scrollHeight - messagesContainer.scrollTop - messagesContainer.clientHeight < 150;

      lastMessageCount = data.messages.length;
      messagesContainer.innerHTML = "";

      let shouldNotify = false;

      data.messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = `message ${msg.sender === currentUserId ? 'mine' : 'theirs'}`;

        // Formatear hora
        let hora = "";
        try {
          const fecha = new Date(msg.timestamp);
          if (!isNaN(fecha.getTime())) {
            hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
        } catch (e) {
          console.warn("Fecha inválida:", msg.timestamp);
        }

        div.innerHTML = `${msg.text}<span class="timestamp">${hora}</span>`;
        messagesContainer.appendChild(div);

        if (!isNearBottom && msg.sender !== currentUserId) {
          shouldNotify = true;
        }
      });

      scrollToBottom();

      // Mostrar alerta visual
      if (shouldNotify) {
        const aviso = document.createElement('div');
        aviso.className = 'alert alert-info text-center';
        aviso.innerText = 'Nuevo mensaje abajo ⬇️';
        messagesContainer.appendChild(aviso);
      }
    });
}


document.getElementById('sendBtn').addEventListener('click', () => {
  const text = document.getElementById('messageInput').value.trim();
  if (!text) return;

  fetch('/api/chat/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversationId,
      senderId: currentUserId,
      text
    })
  }).then(() => {
    document.getElementById('messageInput').value = '';
    loadMessages();
    scrollToBottom(true);
  });
});

loadMessages();
setInterval(loadMessages, 3000);

// Emojis

const emojiBtn = document.getElementById('emojiBtn');
const emojiPicker = document.getElementById('emojiPicker');

emojiBtn.addEventListener('click', () => {
  emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
});

emojiPicker.addEventListener('emoji-click', event => {
  messageInput.value += event.detail.unicode;
  emojiPicker.style.display = 'none';
});


