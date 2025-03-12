<script setup>
defineProps({
  leftTitle: {
    type: String,
    default: '代码 A',
  },
  rightTitle: {
    type: String,
    default: '代码 B',
  },
  leftIcon: {
    type: String,
    default: '',
  },
  rightIcon: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="code-comparison">
    <div class="code-column">
      <div class="code-title">
        <div v-if="leftIcon" :class="leftIcon" class="title-icon" />
        <span>{{ leftTitle }}</span>
      </div>
      <div class="code-content">
        <slot name="left" />
      </div>
    </div>
    <div class="code-divider">
      <div class="divider-line" />
    </div>
    <div class="code-column">
      <div class="code-title">
        <div v-if="rightIcon" :class="rightIcon" class="title-icon" />
        <span>{{ rightTitle }}</span>
      </div>
      <div class="code-content">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-comparison {
  display: flex;
  width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid rgba(125, 125, 125, 0.2);
}

.code-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.code-title {
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.5rem;
  background-color: rgba(125, 125, 125, 0.1);
  border-bottom: 1px solid rgba(125, 125, 125, 0.2);
  display: flex;
  align-items: center;
}

.title-icon {
  margin-right: 0.35rem;
}

.code-content {
  flex: 1;
  overflow: auto;
  font-size: 0.75rem;
}

.code-content :deep(pre) {
  margin: 0;
  border-radius: 0;
  height: 100%;
}

.code-divider {
  display: flex;
  align-items: center;
  width: 1px;
  background-color: rgba(125, 125, 125, 0.2);
  position: relative;
}

.divider-line {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(125, 125, 125, 0.2);
}
</style>
