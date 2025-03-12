<script setup>
import { computed } from 'vue'

const props = defineProps({
  role: {
    type: String,
    default: 'user',
    validator: value => ['boss', 'employee', 'system', 'user'].includes(value),
  },
  name: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'normal',
    validator: value => ['normal', 'highlight', 'warning', 'success', 'error'].includes(value),
  },
  showAvatar: {
    type: Boolean,
    default: true,
  },
  showName: {
    type: Boolean,
    default: false,
  },
})

const roleNames = {
  boss: '老板',
  employee: '牛马',
  system: '系统',
  user: '用户',
}

const displayName = computed(() => {
  return props.name || roleNames[props.role] || '未知'
})

const isEmployee = computed(() => props.role === 'employee')
</script>

<template>
  <div class="chat-message" :class="[`role-${role}`, `type-${type}`, isEmployee ? 'employee-message' : 'other-message']">
    <div class="message-container">
      <!-- 非员工消息（左侧） -->
      <template v-if="!isEmployee">
        <div v-if="showAvatar" class="avatar" :class="[`avatar-${role}`]">
          <span class="avatar-text">{{ displayName.substring(0, 2) }}</span>
        </div>
        <div class="message-content left-aligned">
          <div v-if="showName" class="sender-name">
            {{ displayName }}
          </div>
          <div class="message-bubble">
            <slot />
          </div>
        </div>
      </template>

      <!-- 员工消息（右侧） -->
      <template v-else>
        <div class="message-content right-aligned">
          <div v-if="showName" class="sender-name text-right">
            {{ displayName }}
          </div>
          <div class="message-bubble employee-bubble">
            <slot />
          </div>
        </div>
        <div v-if="showAvatar" class="avatar avatar-employee">
          <span class="avatar-text">{{ displayName.substring(0, 2) }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.chat-message {
  display: flex;
  margin-bottom: 0.75rem;
  width: 100%;
}

.message-container {
  display: flex;
  align-items: flex-start;
  max-width: 100%;
  width: 100%;
  padding: 0 0.25rem;
}

.employee-message .message-container {
  justify-content: flex-end;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  flex-shrink: 0;
  font-weight: bold;
  font-size: 0.9rem;
}

.employee-message .avatar {
  margin-right: 0;
  margin-left: 0.75rem;
}

.avatar-text {
  opacity: 0.9;
}

.avatar-boss {
  background-color: #fff;
  color: #000;
}

.avatar-employee {
  background-color: #fff;
  color: #000;
}

.avatar-system {
  background-color: rgba(107, 114, 128, 0.2);
  color: rgb(107, 114, 128);
}

.message-content {
  flex: 1;
  min-width: 0;
  max-width: 80%;
}

.left-aligned {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.right-aligned {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.sender-name {
  font-size: 0.7rem;
  margin-bottom: 0.25rem;
  opacity: 0.7;
  padding: 0 0.5rem;
}

.message-bubble {
  padding: 0.8rem 1rem;
  border-radius: 1.2rem;
  background-color: white;
  display: inline-block;
  max-width: 100%;
  font-size: 0.95rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  word-break: break-word;
  line-height: 1.4;
}

.employee-bubble {
  background-color: #0f0;
  color: #000;
  border-top-right-radius: 0.3rem;
}

.role-boss .message-bubble {
  border-top-left-radius: 0.3rem;
}

.type-highlight .message-bubble {
  background-color: rgba(139, 92, 246, 0.15);
  color: rgb(67, 56, 202);
}

.type-warning .message-bubble {
  /* background-color: rgba(245, 158, 11, 0.15);
  color: rgb(180, 83, 9);
  border-left: 3px solid rgb(245, 158, 11); */
}

.type-success .message-bubble {
  background-color: rgba(16, 185, 129, 0.15);
  color: rgb(6, 95, 70);
}

.type-error .message-bubble {
  background-color: rgba(239, 68, 68, 0.15);
  color: rgb(153, 27, 27);
  border-left: 3px solid rgb(239, 68, 68);
}

/* 深色模式调整 */
:global(.dark) .message-bubble {
  background-color: rgba(45, 55, 72, 0.8);
  color: rgba(255, 255, 255, 0.9);
}

:global(.dark) .employee-bubble {
  background-color: rgba(30, 64, 175, 0.3);
  color: rgba(255, 255, 255, 0.9);
}

:global(.dark) .type-warning .message-bubble {
  background-color: rgba(245, 158, 11, 0.2);
  color: rgba(255, 237, 213, 0.95);
}

:global(.dark) .type-highlight .message-bubble {
  background-color: rgba(139, 92, 246, 0.2);
  color: rgba(237, 233, 254, 0.95);
}

:global(.dark) .type-success .message-bubble {
  background-color: rgba(16, 185, 129, 0.2);
  color: rgba(209, 250, 229, 0.95);
}

:global(.dark) .type-error .message-bubble {
  background-color: rgba(239, 68, 68, 0.2);
  color: rgba(254, 226, 226, 0.95);
}
</style>
