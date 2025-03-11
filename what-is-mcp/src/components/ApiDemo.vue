<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps({
  apiName: { type: String, default: 'ChatGPT API' },
  requestDelay: { type: Number, default: 1000 },
  responseDelay: { type: Number, default: 2000 },
  autoPlay: { type: Boolean, default: false },
})

const isPlaying = ref(false)
const step = ref(0)
const showRequestData = ref(false)
const showResponseData = ref(false)

function startDemo() {
  if (isPlaying.value)
    return

  // 重置状态
  showRequestData.value = false
  showResponseData.value = false

  isPlaying.value = true
  step.value = 1

  // 显示请求数据
  setTimeout(() => {
    showRequestData.value = true

    // 发送请求
    setTimeout(() => {
      step.value = 2

      // 处理中
      setTimeout(() => {
        // 显示响应数据
        showResponseData.value = true

        // 完成响应
        setTimeout(() => {
          step.value = 3

          // 展示完成状态一段时间后重置
          setTimeout(() => {
            isPlaying.value = false
            step.value = 0
          }, 3000)
        }, props.responseDelay / 2)
      }, props.responseDelay / 2)
    }, props.requestDelay)
  }, 500)
}

onMounted(() => {
  if (props.autoPlay) {
    setTimeout(startDemo, 1000)
  }
})
</script>

<template>
  <div class="api-demo-container border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md">
    <!-- 头部 -->
    <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1.5 flex justify-between items-center">
      <div class="flex items-center">
        <div class="i-carbon-api mr-1 text-base" />
        <div class="font-medium text-sm">
          {{ apiName }}
        </div>
      </div>
      <button
        v-if="!isPlaying"
        class="px-2 py-0.5 bg-white text-blue-600 rounded text-xs font-medium
               shadow-sm hover:bg-blue-50 transition-all duration-300 flex items-center"
        @click="startDemo"
      >
        <div class="i-carbon-play-filled mr-1 text-xs" />
        演示
      </button>
      <div v-else class="text-white flex items-center text-xs">
        <div class="i-carbon-circle-dash animate-spin mr-1" />
        <span>处理中</span>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="p-2">
      <!-- 流程示意图 -->
      <div class="relative h-48 mb-1">
        <!-- 客户端和服务端盒子 -->
        <div
          class="absolute left-0 top-0 w-5/12 p-2 rounded-lg border bg-blue-50
                 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
        >
          <div class="text-xs font-medium flex items-center text-blue-700 dark:text-blue-300">
            <div class="i-carbon-application mr-1 text-xs" />
            客户端应用
          </div>

          <!-- 请求数据 -->
          <div
            v-if="showRequestData"
            class="mt-1 p-1 bg-white dark:bg-gray-900 rounded border border-blue-200
                   dark:border-blue-800 text-xs font-mono overflow-hidden transition-all duration-500"
            :class="step >= 2 ? 'opacity-50' : 'opacity-100'"
          >
            <pre class="text-[10px] text-left overflow-x-auto max-h-36"><code>{
  "model": "gpt-3.5-turbo",
  "messages": [
    {"role": "user", "content": "介绍一下自己"}
  ]
}</code></pre>
          </div>
        </div>

        <div
          class="absolute right-0 top-0 w-5/12 p-2 rounded-lg border bg-purple-50
                 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
        >
          <div class="text-xs font-medium flex items-center text-purple-700 dark:text-purple-300">
            <div class="i-carbon-cloud mr-1 text-xs" />
            {{ apiName }} 服务端
          </div>

          <!-- 响应数据 -->
          <div
            v-if="showResponseData"
            class="mt-1 p-1 bg-white dark:bg-gray-900 rounded border border-purple-200
                   dark:border-purple-800 text-xs font-mono overflow-hidden animate-fadeIn"
          >
            <pre class="text-[10px] text-left overflow-x-auto max-h-36"><code>{
  "id": "chatcmpl-123",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "你好！我是AI助手..."
    }
  }]
}</code></pre>
          </div>
        </div>

        <!-- 连接线和箭头 -->
        <div class="absolute left-1/2 top-0 bottom-0 -ml-0.5 border-l border-dashed border-gray-300 dark:border-gray-600" />

        <!-- 请求箭头 -->
        <div
          v-if="step >= 1"
          class="request-arrow absolute top-10 flex items-center animate-slideRight"
          :class="{ 'w-[45%]': step === 1, 'w-[42%] opacity-50': step >= 2 }"
          style="left: 38%;"
        >
          <div class="h-0.5 w-full bg-amber-500 rounded" />
          <div class="absolute -right-1 w-1.5 h-1.5 bg-amber-500 transform rotate-45" />
          <div class="absolute left-1/2 -top-4 -translate-x-1/2 text-amber-600 dark:text-amber-400 text-[10px]">
            请求
          </div>
        </div>

        <!-- 中间处理指示器 -->
        <div
          v-if="step >= 2"
          class="absolute left-1/2 top-20 -translate-x-1/2 flex flex-col items-center"
        >
          <div class="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <div class="i-carbon-machine-learning-model text-indigo-500 text-sm" :class="{ 'animate-pulse': step === 2 }" />
          </div>
          <div class="text-[10px] text-indigo-600 dark:text-indigo-400">
            AI处理中
          </div>
          <div v-if="step === 2" class="mt-0.5">
            <div class="flex space-x-0.5">
              <div class="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0ms" />
              <div class="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 150ms" />
              <div class="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 300ms" />
            </div>
          </div>
        </div>

        <!-- 响应箭头 -->
        <div
          v-if="step >= 2"
          class="response-arrow absolute top-32 flex items-center"
          :class="{ 'w-[42%] animate-slideLeft': step === 2, 'w-[45%]': step >= 3 }"
          style="right: 38%;"
        >
          <div class="h-0.5 w-full bg-green-500 rounded" />
          <div class="absolute -left-1 w-1.5 h-1.5 bg-green-500 transform -rotate-45" />
          <div class="absolute left-1/2 -top-4 -translate-x-1/2 text-green-600 dark:text-green-400 text-[10px]">
            响应
          </div>
        </div>

        <!-- 完成状态 -->
        <div
          v-if="step >= 3"
          class="absolute bottom-0 left-0 right-0 text-center bg-green-100 dark:bg-green-900/20
                 text-green-800 dark:text-green-200 py-1 rounded animate-fadeIn"
        >
          <div class="flex items-center justify-center text-xs">
            <div class="i-carbon-checkmark-outline mr-1" />
            <span>API调用完成 ({{ ((props.requestDelay + props.responseDelay) / 1000).toFixed(1) }}秒)</span>
          </div>
        </div>
      </div>

      <!-- 流程说明 -->
      <div class="grid grid-cols-3 gap-2 mt-1">
        <div
          class="py-1 px-2 rounded text-center border text-xs"
          :class="[
            step === 1 ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
            : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800',
          ]"
        >
          <div class="font-medium">
            1. 发送
          </div>
        </div>
        <div
          class="py-1 px-2 rounded text-center border text-xs"
          :class="[
            step === 2 ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800'
            : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800',
          ]"
        >
          <div class="font-medium">
            2. 处理
          </div>
        </div>
        <div
          class="py-1 px-2 rounded text-center border text-xs"
          :class="[
            step === 3 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800',
          ]"
        >
          <div class="font-medium">
            3. 接收
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slideRight {
  animation: slideRight 0.8s ease-out forwards;
}

.animate-slideLeft {
  animation: slideLeft 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideRight {
  from {
    width: 0;
  }
  to {
    width: 45%;
  }
}

@keyframes slideLeft {
  from {
    width: 0;
  }
  to {
    width: 42%;
  }
}
</style>
