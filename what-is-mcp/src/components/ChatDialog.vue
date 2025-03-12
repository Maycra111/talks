<template>
  <div class="chat-dialog">
    <slot />
  </div>
</template>

<style scoped>
.chat-dialog {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 100%;
  background-color: rgba(245, 245, 247, 0.4);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

:global(.dark) .chat-dialog {
  background-color: rgba(30, 32, 35, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
