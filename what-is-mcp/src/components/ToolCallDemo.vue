<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  toolName: {
    type: String,
    default: '天气查询',
  },
  autoPlay: {
    type: Boolean,
    default: false,
  },
  delay: {
    type: Number,
    default: 1000,
  },
  className: {
    type: String,
    default: '',
  },
})

const userMessage = ref('请查询北京今天的天气')
const loading = ref(false)
const showResult = ref(false)
const toolCalled = ref(false)
const toolResult = ref(false)
const aiResponse = ref(false)

function startDemo() {
  reset()
  loading.value = true

  setTimeout(() => {
    toolCalled.value = true

    setTimeout(() => {
      toolResult.value = true

      setTimeout(() => {
        aiResponse.value = true
        loading.value = false
      }, props.delay)
    }, props.delay)
  }, props.delay)
}

function reset() {
  loading.value = false
  showResult.value = false
  toolCalled.value = false
  toolResult.value = false
  aiResponse.value = false
}

onMounted(() => {
  if (props.autoPlay) {
    startDemo()
  }
})
</script>

<template>
  <div :class="`border rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800 max-w-full ${className}`">
    <div class="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b flex justify-between items-center">
      <div class="font-medium">
        {{ toolName }} 工具调用演示
      </div>
      <button
        class="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
        @click="startDemo"
      >
        {{ loading ? '处理中...' : '演示' }}
      </button>
    </div>

    <div class="p-4">
      <!-- 用户消息 -->
      <div class="flex mb-3">
        <div class="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300">
          <div class="i-carbon-user text-lg" />
        </div>
        <div class="ml-3 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg max-w-[80%]">
          {{ userMessage }}
        </div>
      </div>

      <!-- AI思考中 -->
      <div v-if="loading && !toolCalled" class="flex mb-3">
        <div class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
          <div class="i-carbon-bot text-lg" />
        </div>
        <div class="ml-3 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg max-w-[80%]">
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
            <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 150ms" />
            <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 300ms" />
          </div>
        </div>
      </div>

      <!-- 工具调用 -->
      <div v-if="toolCalled" class="flex mb-3">
        <div class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
          <div class="i-carbon-bot text-lg" />
        </div>
        <div class="ml-3 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg max-w-[80%]">
          我需要查询天气信息，让我调用
          <div class="mt-1 bg-gray-800 text-green-300 p-2 rounded font-mono text-sm overflow-x-auto">
            <div>action: getWeather</div>
            <div>parameters: { "city": "北京", "date": "2025-03-08" }</div>
          </div>
        </div>
      </div>

      <!-- 工具结果 -->
      <div v-if="toolResult" class="flex mb-3">
        <div class="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
          <div class="i-carbon-tool-kit text-lg" />
        </div>
        <div class="ml-3 bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg max-w-[80%]">
          <div class="font-bold text-purple-700 dark:text-purple-300 mb-1">
            工具结果:
          </div>
          <div class="bg-gray-800 text-purple-300 p-2 rounded font-mono text-sm overflow-x-auto">
            {
            "temperature": "26°C",
            "condition": "晴天",
            "humidity": "45%",
            "wind": "东北风3级"
            }
          </div>
        </div>
      </div>

      <!-- AI回复 -->
      <div v-if="aiResponse" class="flex mb-3">
        <div class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
          <div class="i-carbon-bot text-lg" />
        </div>
        <div class="ml-3 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg max-w-[80%]">
          北京今天是晴天，气温26°C，湿度45%，东北风3级。是个不错的天气，适合户外活动！
        </div>
      </div>
    </div>
  </div>
</template>
