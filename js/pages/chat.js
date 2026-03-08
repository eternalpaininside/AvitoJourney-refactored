export function initChatPage() {
  const chatsList = document.getElementById('chatsList');
  const chatHeader = document.getElementById('chatHeader');
  const chatMessages = document.getElementById('chatMessages');
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendMessageBtn');

  if (!chatsList || !chatHeader || !chatMessages || !messageInput || !sendBtn) return;

  const chats = [
    { id: 1, name: 'Константин', messages: [{ from: 'seller', text: 'Здравствуйте! Чем помочь?' }] },
    { id: 2, name: 'Анна', messages: [{ from: 'seller', text: 'Добрый день!' }] },
  ];

  let activeChat = chats[0];

  function renderChats() {
    chatsList.innerHTML = '';
    chats.forEach((c) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'chat-item';
      item.textContent = c.name;
      item.addEventListener('click', () => {
        activeChat = c;
        renderActive();
      });
      chatsList.appendChild(item);
    });
  }

  function renderActive() {
    chatHeader.textContent = activeChat.name;
    chatMessages.innerHTML = '';
    activeChat.messages.forEach((m) => {
      const div = document.createElement('div');
      div.className = `chat-message ${m.from === 'me' ? 'me' : 'seller'}`;
      div.textContent = m.text;
      chatMessages.appendChild(div);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function send() {
    const text = messageInput.value.trim();
    if (!text) return;
    activeChat.messages.push({ from: 'me', text });
    messageInput.value = '';
    renderActive();
  }

  sendBtn.addEventListener('click', send);
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') send();
  });

  renderChats();
  renderActive();
}
