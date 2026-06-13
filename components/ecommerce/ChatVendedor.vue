<template>
  <Transition name="chat-slide">
    <div v-if="isOpen" class="chat-floating-window">
      <!-- Chat Header -->
      <div class="chat-header">
        <div class="header-info">
          <div class="seller-avatar">{{ sellerName ? sellerName.charAt(0).toUpperCase() : 'C' }}</div>
          <div class="header-text">
            <span class="seller-name">{{ sellerName || 'Vendedor' }}</span>
            <span class="seller-status">
              <span class="status-dot"></span> En línea
            </span>
          </div>
        </div>
        <button class="btn-close" @click="closeChat" aria-label="Cerrar chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Context: Product Info -->
      <div v-if="productName" class="chat-context">
        <span class="context-label">Consultando sobre:</span>
        <span class="context-product">{{ productName }}</span>
      </div>

      <!-- Messages Area -->
      <div class="chat-messages" ref="messagesContainer">
        <div 
          v-for="(msg, index) in messages" 
          :key="index"
          class="message-wrapper"
          :class="msg.sender === 'user' ? 'message-right' : 'message-left'"
        >
          <div class="message-bubble" :class="msg.sender === 'user' ? 'bubble-user' : 'bubble-seller'">
            {{ msg.text }}
          </div>
          <span class="message-time">{{ msg.time }}</span>
        </div>
        
        <!-- Typing indicator -->
        <div v-if="isTyping" class="message-wrapper message-left">
          <div class="message-bubble bubble-seller typing-indicator">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input-area">
        <input 
          v-model="newMessage" 
          type="text" 
          class="chat-input" 
          placeholder="Escribe un mensaje..."
          @keyup.enter="sendMessage"
        />
        <button 
          class="btn-send" 
          @click="sendMessage"
          :disabled="!newMessage.trim() || isTyping"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { Client } from '@stomp/stompjs';
import { useAuthStore } from '~/stores/auth';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  sellerName: {
    type: String,
    default: ''
  },
  productName: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:isOpen']);

const closeChat = () => {
  emit('update:isOpen', false);
};

interface Message {
  sender: 'user' | 'seller';
  text: string;
  time: string;
}

const messages = ref<Message[]>([
  {
    sender: 'seller',
    text: '¡Hola! Gracias por tu interés. Estoy conectado para ayudarte.',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
]);

const newMessage = ref('');
const isTyping = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);

const stompClient = ref<Client | null>(null);
const isConnected = ref(false);

const authStore = useAuthStore();

const connect = () => {
  if (typeof window === 'undefined') return; // Protección SSR
  
  console.log('[Chat] Intentando conectar WebSocket...');
  
  const client = new Client({
    brokerURL: 'ws://localhost:8080/ws-chat',
    connectHeaders: {
      Authorization: authStore.token ? `Bearer ${authStore.token}` : ''
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: (str) => {
      console.log('[STOMP]', str);
    }
  });

  client.onConnect = () => {
    console.log('[Chat] ✅ Conectado exitosamente');
    isConnected.value = true;
    client.subscribe('/topic/messages/public', (message) => {
      if (message.body) {
        const msg = JSON.parse(message.body);
        if (msg.sender !== 'user') {
          messages.value.push({
            sender: 'seller',
            text: msg.text,
            time: msg.time
          });
          scrollToBottom();
        }
      }
    });
  };

  client.onStompError = (frame) => {
    console.error('[Chat] ❌ STOMP Error:', frame.headers['message'], frame.body);
  };

  client.onWebSocketError = (event) => {
    console.error('[Chat] ❌ WebSocket Error:', event);
  };

  client.onWebSocketClose = (event) => {
    console.log('[Chat] 🔌 WebSocket cerrado:', event);
    isConnected.value = false;
  };

  client.activate();
  stompClient.value = client;
};

onMounted(() => {
  connect();
});

onUnmounted(() => {
  if (stompClient.value) {
    stompClient.value.deactivate();
  }
});

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !isConnected.value) return;

  const text = newMessage.value.trim();

  // Add user message to UI immediately
  messages.value.push({
    sender: 'user',
    text: text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  // Enviar al backend vía WebSocket
  if (stompClient.value && stompClient.value.connected) {
    stompClient.value.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ sender: 'user', text: text })
    });
  }

  newMessage.value = '';
  scrollToBottom();
};

// Scroll to bottom when opened
watch(() => props.isOpen, (val) => {
  if (val) {
    scrollToBottom();
  }
});
</script>

<style scoped>
.chat-floating-window {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 360px;
  height: 500px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 9999;
  overflow: hidden;
  border: 1px solid var(--cp-border-light);
  font-family: var(--font-body);
}

.chat-header {
  background: #2b3a32; /* Un verde oscuro elegante para combinar con el sage */
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.seller-avatar {
  width: 36px;
  height: 36px;
  background: #a38d70;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
}

.header-text {
  display: flex;
  flex-direction: column;
}

.seller-name {
  font-weight: 800;
  font-size: 0.95rem;
  color: #ffffff;
}

.seller-status {
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ffffff;
  opacity: 0.8;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #4ade80;
  border-radius: 50%;
}

.btn-close {
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity var(--t-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  z-index: 10;
}

.btn-close svg {
  stroke: #ffffff;
}

.btn-close:hover {
  opacity: 1;
}

.chat-context {
  background: var(--cp-cream-card);
  padding: 8px 16px;
  font-size: 0.8rem;
  border-bottom: 1px solid var(--cp-border-light);
  display: flex;
  flex-direction: column;
}

.context-label {
  color: var(--cp-text-muted);
  font-weight: 600;
  font-size: 0.7rem;
  text-transform: uppercase;
}

.context-product {
  color: var(--cp-text-dark);
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #fdfcfb;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 85%;
}

.message-right {
  align-self: flex-end;
  align-items: flex-end;
}

.message-left {
  align-self: flex-start;
  align-items: flex-start;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 0.9rem;
  line-height: 1.4;
  word-wrap: break-word;
}

.bubble-seller {
  background: white;
  color: var(--cp-text-dark);
  border: 1px solid var(--cp-border-light);
  border-bottom-left-radius: 4px;
}

.bubble-user {
  background: var(--cp-sage);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-time {
  font-size: 0.65rem;
  color: var(--cp-text-faint);
  margin-top: 4px;
  padding: 0 4px;
}

.chat-input-area {
  padding: 12px 16px;
  background: white;
  border-top: 1px solid var(--cp-border-light);
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-input {
  flex: 1;
  border: 1px solid var(--cp-border-mid);
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color var(--t-fast);
}

.chat-input:focus {
  border-color: var(--cp-sage);
}

.btn-send {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--cp-sage);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity var(--t-fast);
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-send:hover:not(:disabled) {
  opacity: 0.9;
}

/* Typing Indicator Animation */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: var(--cp-text-muted);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Slide Animation */
.chat-slide-enter-active,
.chat-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.chat-slide-enter-from,
.chat-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

@media (max-width: 480px) {
  .chat-floating-window {
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100dvh; /* Soporte para la barra de navegación móvil */
    height: 100vh;
    border-radius: 0;
    border: none;
  }
}
</style>
