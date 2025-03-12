<script setup>
import ChatDialog from './ChatDialog.vue'
import ChatMessage from './ChatMessage.vue'

defineProps({
  messages: {
    type: Array,
    default: () => [],
  },
  initialVisible: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <div class="boss-employee-chat">
    <ChatDialog>
      <template v-for="(message, index) in messages" :key="index">
        <div v-click>
          <ChatMessage :role="message.role" :type="message.type">
            {{ message.content }}
          </ChatMessage>
        </div>
      </template>
    </ChatDialog>
  </div>
</template>

<style scoped>
.boss-employee-chat {
  padding: 0.5rem;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 100%;
}
</style>
