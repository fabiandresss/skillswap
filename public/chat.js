const params = new URLSearchParams(window.location.search);
const conversationId = params.get('conversationId');
const currentUserId = params.get('userId');
const messagesContainer = document.getElementById('messages');

let lastMessageCount = 0;

function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function loadMessages() {
  fetch(`/api/chat/messages/${conversationId}`)
    .then(res => res.json())
    .then(data => {
      if (data.messages.length === lastMessageCount) return;
      lastMessageCount = data.messages.length;

      messagesContainer.innerHTML = "";
      data.messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = `message ${msg.sender === currentUserId ? 'mine' : 'theirs'}`;

        let hora = "(sin hora)";

        console.log("Mensaje:", msg.text);
        console.log("Timestamp recibido:", msg.timestamp);

            try {
                const fecha = new Date(msg.timestamp);
                if (!isNaN(fecha.getTime())) {
                    hora = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                } else {
                    console.warn("Fecha inválida:", msg.timestamp);
                }
            } catch (e) {
                console.warn("Error al procesar timestamp:", msg.timestamp);
            }


        div.innerHTML = `${msg.text}<span class="timestamp">${hora}</span>`;
        messagesContainer.appendChild(div);
      });

      scrollToBottom();
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
  });
});

loadMessages();
setInterval(loadMessages, 3000);


