<script setup>
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: '',
  },
})

const isOpen = ref(false)

function openPopover() {
  isOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closePopover() {
  isOpen.value = false
  document.body.style.overflow = ''
}
</script>

<template>
  <div class="popover-code">
    <!-- 触发区域 -->
    <div
      class="code-trigger"
      :class="{ 'has-title': title }"
      @click="openPopover"
    >
      <div v-if="title" class="code-title">
        {{ title }}
        <div class="expand-icon">
          <div class="i-carbon-maximize text-xs" />
        </div>
      </div>
      <slot />
      <div v-if="!title" class="expand-hint">
        <div class="i-carbon-maximize text-xs mr-1" />
        <span>点击放大</span>
      </div>
    </div>

    <!-- 弹出层 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isOpen" class="code-popover-overlay" @click="closePopover">
          <div class="code-popover-container" @click.stop>
            <div class="code-popover-header">
              <div class="code-popover-title">
                {{ title || '代码查看器' }}
              </div>
              <button class="close-button" @click="closePopover">
                <div class="i-carbon-close" />
              </button>
            </div>
            <div class="code-popover-content">
              <slot />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.popover-code {
  position: relative;
}

.code-trigger {
  cursor: pointer;
  position: relative;
  border: 1px solid rgba(125, 125, 125, 0.2);
  border-radius: 0.25rem;
  overflow: hidden;
}

.code-trigger:hover {
  border-color: rgba(125, 125, 125, 0.4);
}

.code-title {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  background-color: rgba(125, 125, 125, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.expand-icon {
  opacity: 0.6;
}

.expand-hint {
  position: absolute;
  bottom: 0.25rem;
  right: 0.25rem;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 4px;
  padding: 0.15rem 0.3rem;
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  opacity: 0.7;
}

.has-title:hover .expand-icon {
  opacity: 1;
}

.code-trigger:hover .expand-hint {
  opacity: 1;
}

/* 弹出层样式 */
.code-popover-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.code-popover-container {
  background-color: var(--slidev-theme-background, white);
  border-radius: 0.5rem;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}

.code-popover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(125, 125, 125, 0.2);
}

.code-popover-title {
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: currentColor;
  opacity: 0.6;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-button:hover {
  opacity: 1;
  background-color: rgba(125, 125, 125, 0.1);
}

.code-popover-content {
  overflow-y: auto;
  padding: 1rem;
  flex: 1;
}

.code-popover-content :deep(pre) {
  margin: 0;
  max-height: none;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
