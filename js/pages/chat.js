const CHAT_STORAGE_KEY = 'travel_chat_data_v2';

function getInitialChats() {
  const now = Date.now();

  return [
    {
      id: 'chat-demo-1',
      productId: 'demo-forest',
      sellerName: 'Константин',
      productTitle: 'Тропа в лес',
      avatar: '🧑‍💼',
      unreadCount: 1,
      messages: [
        {
          id: crypto.randomUUID(),
          author: 'seller',
          authorName: 'Константин',
          text: 'Здравствуйте! Вас интересует прогулка по маршруту?',
          time: new Date(now - 1000 * 60 * 10).toISOString()
        }
      ]
    },
    {
      id: 'chat-demo-2',
      productId: 'demo-astana',
      sellerName: 'Анна',
      productTitle: 'Поездка в Астану',
      avatar: '👩‍💼',
      unreadCount: 0,
      messages: [
        {
          id: crypto.randomUUID(),
          author: 'seller',
          authorName: 'Анна',
          text: 'Добрый день! Могу подсказать детали по бронированию.',
          time: new Date(now - 1000 * 60 * 60 * 24).toISOString()
        }
      ]
    }
  ];
}

function loadChats() {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);

    if (!raw) {
      const initialChats = getInitialChats();
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(initialChats));
      return initialChats;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : getInitialChats();
  } catch (error) {
    console.error('Ошибка чтения чатов:', error);
    return getInitialChats();
  }
}

function saveChats(chats) {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text ?? '';
  return div.innerHTML;
}

function getLastMessage(chat) {
  if (!chat.messages || chat.messages.length === 0) return 'Нет сообщений';
  return chat.messages[chat.messages.length - 1].text;
}

function getLastMessageTime(chat) {
  if (!chat.messages || chat.messages.length === 0) return '';
  return chat.messages[chat.messages.length - 1].time;
}

function isToday(date) {
  const now = new Date();
  return date.getDate() === now.getDate()
    && date.getMonth() === now.getMonth()
    && date.getFullYear() === now.getFullYear();
}

function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return date.getDate() === yesterday.getDate()
    && date.getMonth() === yesterday.getMonth()
    && date.getFullYear() === yesterday.getFullYear();
}

function formatChatListTime(isoString) {
  if (!isoString) return '';

  const date = new Date(isoString);

  if (isToday(date)) {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (isYesterday(date)) {
    return 'Вчера';
  }

  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit'
  });
}

function formatMessageTime(isoString) {
  const date = new Date(isoString);

  if (isToday(date)) {
    return `Сегодня, ${date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  }

  if (isYesterday(date)) {
    return `Вчера, ${date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  }

  return `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })}`;
}

function createChatId(productId, sellerName) {
  const safeSeller = (sellerName || 'seller')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\wа-яё-]/gi, '');

  return `chat-${productId}-${safeSeller}`;
}

function ensureChatFromUrl(chats) {
  const params = new URLSearchParams(window.location.search);

  const chatId = params.get('chatId');
  const productId = params.get('productId');
  const productTitle = params.get('productTitle');
  const sellerName = params.get('sellerName');
  const avatar = params.get('avatar') || '🧑‍💼';

  if (chatId) {
    const existingByChatId = chats.find(chat => chat.id === chatId);
    if (existingByChatId) return existingByChatId.id;
  }

  if (!productId || !productTitle || !sellerName) {
    return chats[0]?.id ?? null;
  }

  const generatedChatId = createChatId(productId, sellerName);

  const existingChat = chats.find(
    chat => chat.productId === productId && chat.sellerName === sellerName
  );

  if (existingChat) {
    return existingChat.id;
  }

  const newChat = {
    id: generatedChatId,
    productId,
    sellerName,
    productTitle,
    avatar,
    unreadCount: 0,
    messages: [
      {
        id: crypto.randomUUID(),
        author: 'seller',
        authorName: sellerName,
        text: `Здравствуйте! Вы открыли чат по товару "${productTitle}". Чем могу помочь?`,
        time: new Date().toISOString()
      }
    ]
  };

  chats.unshift(newChat);
  saveChats(chats);

  return newChat.id;
}

export function initChatPage() {
  const chatsList = document.getElementById('chatsList');
  const chatHeader = document.getElementById('chatHeader');
  const chatMessages = document.getElementById('chatMessages');
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendMessageBtn');
  const chatSearchInput = document.getElementById('chatSearchInput');

  if (!chatsList || !chatHeader || !chatMessages || !messageInput || !sendBtn) return;

  let chats = loadChats();
  let activeChatId = ensureChatFromUrl(chats) || chats[0]?.id || null;
  let searchQuery = '';

  function sortChatsByLastMessage() {
    chats.sort((a, b) => {
      const timeA = getLastMessageTime(a) || '';
      const timeB = getLastMessageTime(b) || '';
      return new Date(timeB) - new Date(timeA);
    });
  }

  function getFilteredChats() {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return chats;

    return chats.filter(chat => {
      const seller = (chat.sellerName || '').toLowerCase();
      const product = (chat.productTitle || '').toLowerCase();
      const preview = getLastMessage(chat).toLowerCase();

      return seller.includes(query) || product.includes(query) || preview.includes(query);
    });
  }

  function getActiveChat() {
    return chats.find(chat => chat.id === activeChatId) || null;
  }

  function updateUrl(chat) {
    if (!chat) return;

    const params = new URLSearchParams();
    params.set('chatId', chat.id);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }

  function renderChats() {
    const filteredChats = getFilteredChats();

    chatsList.innerHTML = '';

    if (filteredChats.length === 0) {
      chatsList.innerHTML = `
        <div class="chat-list-empty">
          Ничего не найдено
        </div>
      `;
      return;
    }

    filteredChats.forEach(chat => {
      const lastMessageTime = getLastMessageTime(chat);

      const item = document.createElement('button');
      item.type = 'button';
      item.className = `chat-row ${chat.id === activeChatId ? 'active' : ''}`;

      item.innerHTML = `
        <div class="chat-row-avatar">${escapeHtml(chat.avatar)}</div>
        <div class="chat-row-body">
          <div class="chat-row-top">
            <div class="chat-row-name">${escapeHtml(chat.sellerName)}</div>
            <div class="chat-row-time">${formatChatListTime(lastMessageTime)}</div>
          </div>

          <div class="chat-row-product">${escapeHtml(chat.productTitle)}</div>

          <div class="chat-row-bottom">
            <div class="chat-row-preview">${escapeHtml(getLastMessage(chat))}</div>
            ${chat.unreadCount > 0 ? `<div class="chat-row-unread">${chat.unreadCount}</div>` : ''}
          </div>
        </div>
      `;

      item.addEventListener('click', () => {
        activeChatId = chat.id;
        chat.unreadCount = 0;
        saveChats(chats);
        renderChats();
        renderActiveChat();
      });

      chatsList.appendChild(item);
    });
  }

  function renderActiveChat() {
    const activeChat = getActiveChat();

    if (!activeChat) {
      chatHeader.innerHTML = '<div class="chat-header-empty">Чат не выбран</div>';
      chatMessages.innerHTML = '';
      return;
    }

    updateUrl(activeChat);

    chatHeader.innerHTML = `
      <div class="chat-header-inner">
        <div class="chat-header-avatar">${escapeHtml(activeChat.avatar)}</div>
        <div class="chat-header-meta">
          <div class="chat-header-name">${escapeHtml(activeChat.sellerName)}</div>
          <div class="chat-header-product">${escapeHtml(activeChat.productTitle)}</div>
        </div>
      </div>
    `;

    chatMessages.innerHTML = '';

    activeChat.messages.forEach(message => {
      const messageEl = document.createElement('div');
      messageEl.className = `chat-bubble ${message.author === 'me' ? 'me' : 'seller'}`;

      messageEl.innerHTML = `
        <div class="chat-bubble-author">
          ${message.author === 'me' ? 'Вы' : escapeHtml(message.authorName)}
        </div>
        <div class="chat-bubble-text">${escapeHtml(message.text)}</div>
        <div class="chat-bubble-time">${formatMessageTime(message.time)}</div>
      `;

      chatMessages.appendChild(messageEl);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function sendMessage() {
    const text = messageInput.value.trim();
    const activeChat = getActiveChat();

    if (!text || !activeChat) return;

    activeChat.messages.push({
      id: crypto.randomUUID(),
      author: 'me',
      authorName: 'Вы',
      text,
      time: new Date().toISOString()
    });

    sortChatsByLastMessage();
    saveChats(chats);
    messageInput.value = '';
    renderChats();
    renderActiveChat();

    setTimeout(() => {
      const currentChat = chats.find(chat => chat.id === activeChat.id);
      if (!currentChat) return;

      currentChat.messages.push({
        id: crypto.randomUUID(),
        author: 'seller',
        authorName: currentChat.sellerName,
        text: 'Спасибо за сообщение! Скоро отвечу более подробно.',
        time: new Date().toISOString()
      });

      if (currentChat.id !== activeChatId) {
        currentChat.unreadCount = (currentChat.unreadCount || 0) + 1;
      }

      sortChatsByLastMessage();
      saveChats(chats);
      renderChats();
      renderActiveChat();
    }, 900);
  }

  sendBtn.addEventListener('click', sendMessage);

  messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  });

  if (chatSearchInput) {
    chatSearchInput.addEventListener('input', () => {
      searchQuery = chatSearchInput.value;
      renderChats();
    });
  }

  sortChatsByLastMessage();
  renderChats();
  renderActiveChat();
}