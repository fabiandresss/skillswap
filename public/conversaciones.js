const params = new URLSearchParams(window.location.search);
const currentUserId = params.get('userId');
const list = document.getElementById('conversationList');

fetch(`/api/chat/conversations/${currentUserId}`)
  .then(res => res.json())
  .then(async data => {
    for (const conv of data.conversations) {
      // Obtener el nombre del otro usuario
      const resUser = await fetch(`/api/users/profile/${conv.withUserId}`);
      const userData = await resUser.json();

      const time = conv.timestamp
        ? new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : "";

      const item = document.createElement('a');
      item.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
      item.href = `/chat.html?conversationId=${conv.conversationId}&userId=${currentUserId}`;
      item.innerHTML = `
        <div>
          <strong>${userData.user.name}</strong><br>
          <small>${conv.lastMessage}</small>
        </div>
        <small class="text-muted">${time}</small>
      `;
      list.appendChild(item);
    }
  });
