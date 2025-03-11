<script setup lang="ts">
import { ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: '代码比较',
  },
  leftTitle: {
    type: String,
    default: '手动方式',
  },
  rightTitle: {
    type: String,
    default: 'SDK方式',
  },
  leftLanguage: {
    type: String,
    default: 'javascript',
  },
  rightLanguage: {
    type: String,
    default: 'javascript',
  },
})

const activeTab = ref('left')
const showMobile = ref(window.innerWidth < 768)

window.addEventListener('resize', () => {
  showMobile.value = window.innerWidth < 768
})
</script>

<template>
  <div class="code-comparison border rounded-lg overflow-hidden">
    <!-- 标题部分 -->
    <div class="comparison-header bg-gray-100 dark:bg-gray-800 p-2 border-b flex items-center justify-between">
      <div class="font-bold">
        {{ title }}
      </div>

      <!-- 移动端标签切换 -->
      <div v-if="showMobile" class="tabs flex">
        <button
          class="px-3 py-1 text-sm rounded-l" :class="[
            activeTab === 'left'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
          ]"
          @click="activeTab = 'left'"
        >
          {{ leftTitle }}
        </button>
        <button
          class="px-3 py-1 text-sm rounded-r" :class="[
            activeTab === 'right'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
          ]"
          @click="activeTab = 'right'"
        >
          {{ rightTitle }}
        </button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="comparison-content">
      <!-- 桌面端 -->
      <div v-if="!showMobile" class="desktop-view hidden md:flex">
        <div class="left-side w-1/2 border-r">
          <div class="code-title p-2 bg-gray-50 dark:bg-gray-900 border-b font-medium text-sm">
            {{ leftTitle }}
          </div>
          <div class="code-content">
            <slot name="left" />
          </div>
        </div>
        <div class="right-side w-1/2">
          <div class="code-title p-2 bg-gray-50 dark:bg-gray-900 border-b font-medium text-sm">
            {{ rightTitle }}
          </div>
          <div class="code-content">
            <slot name="right" />
          </div>
        </div>
      </div>

      <!-- 移动端 -->
      <div v-if="showMobile" class="mobile-view md:hidden">
        <div v-show="activeTab === 'left'" class="left-side">
          <div class="code-content">
            <slot name="left" />
          </div>
        </div>
        <div v-show="activeTab === 'right'" class="right-side">
          <div class="code-content">
            <slot name="right" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
