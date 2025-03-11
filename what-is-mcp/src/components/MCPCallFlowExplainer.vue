<script setup>
import { ref, watch } from 'vue'

const currentStep = ref(0)
const totalSteps = 10
const logHistory = ref([])

// 序列图参与者
const actors = ['用户', '聊天客户端', 'MCP服务器', 'AI']

// 步骤数据
const steps = [
  {
    title: '1A. 客户端连接MCP',
    description: '聊天客户端连接到配置好的MCP服务器',
    from: '聊天客户端',
    to: 'MCP服务器',
    message: '建立连接',
    log: '客户端初始化时自动连接到配置好的MCP服务器地址，建立WebSocket连接。',
  },
  {
    title: '1B. 获取工具列表',
    description: '客户端向MCP服务器请求可用工具',
    from: '聊天客户端',
    to: 'MCP服务器',
    message: '请提供可用工具',
    log: '客户端发送listTools请求，MCP服务器接收到请求并开始查询可用工具列表。',
  },
  {
    title: '2. 返回工具信息',
    description: 'MCP服务器提供工具参数和说明',
    from: 'MCP服务器',
    to: '聊天客户端',
    message: '工具详情和参数格式',
    log: 'MCP服务器返回JSON格式的工具列表，包含每个工具的名称、描述、参数格式和返回值类型。',
  },
  {
    title: '3. 转换为AI格式',
    description: '客户端将工具信息转换为AI可识别的Function Call格式',
    from: '聊天客户端',
    to: 'AI',
    message: '这些是可用工具',
    log: '客户端将MCP工具信息转换为OpenAI Function Calling格式，并在与AI对话时提供这些工具定义。',
  },
  {
    title: '4A. 用户提问',
    description: '用户向客户端提出问题',
    from: '用户',
    to: '聊天客户端',
    message: '查询北京天气',
    log: '用户在聊天界面输入问题，客户端接收到用户输入并准备处理。',
  },
  {
    title: '4B. 转发到AI',
    description: '客户端将用户问题转发给AI',
    from: '聊天客户端',
    to: 'AI',
    message: '用户问:查询北京天气',
    log: '客户端将用户问题及可用工具定义一起发送给AI模型，等待AI处理。',
  },
  {
    title: '5A. AI决定使用工具',
    description: 'AI决定使用工具并告知客户端',
    from: 'AI',
    to: '聊天客户端',
    message: '我需要使用check_weather(北京)',
    log: 'AI分析用户问题后决定调用check_weather工具，生成标准格式的工具调用请求。',
  },
  {
    title: '5B. 客户端调用MCP',
    description: '客户端将AI的请求转为MCP调用',
    from: '聊天客户端',
    to: 'MCP服务器',
    message: '执行:check_weather(北京)',
    log: '客户端将AI的function_call解析为MCP请求格式，通过WebSocket发送给MCP服务器。',
  },
  {
    title: '6A. 返回工具结果',
    description: 'MCP服务器将结果返回给客户端',
    from: 'MCP服务器',
    to: '聊天客户端',
    message: '北京:晴,25°C',
    log: 'MCP服务器执行工具调用(可能查询外部API或本地服务)，将结果以JSON格式返回给客户端。',
  },
  {
    title: '6B. 转发结果给AI',
    description: '客户端将工具执行结果提供给AI',
    from: '聊天客户端',
    to: 'AI',
    message: '工具返回:北京:晴,25°C',
    log: '客户端将MCP返回的结果格式化后作为function_call的返回值发送给AI，以便AI生成最终回复。',
  },
  {
    title: '7. AI生成回复',
    description: 'AI根据工具结果生成回复',
    from: 'AI',
    to: '聊天客户端',
    message: '北京今天天气晴朗,温度25°C',
    log: 'AI根据工具返回的数据生成人性化的回复，并发送给客户端。',
  },
  {
    title: '8. 显示给用户',
    description: '客户端将AI的回复显示给用户',
    from: '聊天客户端',
    to: '用户',
    message: '北京今天天气晴朗,温度25°C',
    log: '客户端接收到AI的回复，在聊天界面呈现给用户，完成一次完整的交互流程。',
  },
]

// 角色图标和颜色
const roleInfo = {
  用户: { icon: 'i-carbon-user-avatar', color: 'bg-blue-50 dark:bg-blue-950', text: 'text-blue-600 dark:text-blue-300', borderColor: 'border-blue-300' },
  聊天客户端: { icon: 'i-carbon-application-web', color: 'bg-purple-50 dark:bg-purple-950', text: 'text-purple-600 dark:text-purple-300', borderColor: 'border-purple-300' },
  MCP服务器: { icon: 'i-carbon-cloud-service-management', color: 'bg-green-50 dark:bg-green-950', text: 'text-green-600 dark:text-green-300', borderColor: 'border-green-300' },
  AI: { icon: 'i-carbon-machine-learning-model', color: 'bg-amber-50 dark:bg-amber-950', text: 'text-amber-600 dark:text-amber-300', borderColor: 'border-amber-300' },
}

// 监听步骤变化，添加日志到历史记录
watch(currentStep, (newStep) => {
  if (steps[newStep] && !logHistory.value.some(log => log.step === newStep)) {
    logHistory.value.push({
      step: newStep,
      title: steps[newStep].title,
      message: steps[newStep].message,
      log: steps[newStep].log,
      timestamp: new Date().toLocaleTimeString(),
    })
  }
})

function nextStep() {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
  else {
    currentStep.value = 0
    logHistory.value = [] // 重置日志历史
  }
}

// 计算序列图的各个位置
function getActorPosition(actor) {
  const index = actors.indexOf(actor)
  const width = 100 / actors.length
  return index * width + width / 2
}

// 确定箭头方向
function isRightDirection(from, to) {
  return actors.indexOf(from) < actors.indexOf(to)
}

// 为初始步骤添加日志
watch(() => logHistory.value.length, (newLength) => {
  if (newLength === 0 && steps[currentStep.value]) {
    logHistory.value.push({
      step: currentStep.value,
      title: steps[currentStep.value].title,
      message: steps[currentStep.value].message,
      log: steps[currentStep.value].log,
      timestamp: new Date().toLocaleTimeString(),
    })
  }
}, { immediate: true })
</script>

<template>
  <div class="border rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 w-full">
    <!-- 标题栏 -->
    <div class="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 border-b flex justify-between items-center text-white">
      <div class="font-medium flex items-center space-x-2">
        <div class="i-carbon-flow text-xl" />
        <span>MCP调用流程 - {{ steps[currentStep].title }}</span>
      </div>
      <button
        class="px-3 py-1 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md text-sm font-medium flex items-center space-x-1 transition-all transform hover:scale-105"
        @click="nextStep"
      >
        <span>下一步</span>
        <div class="i-carbon-arrow-right text-sm" />
      </button>
    </div>

    <!-- 主体内容区 - 左右布局 -->
    <div class="flex h-[400px]">
      <!-- 左侧序列图 -->
      <div class="p-4 overflow-hidden flex-1 border-r relative">
        <!-- 背景网格 -->
        <div class="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 opacity-50" />

        <!-- 参与者行 -->
        <div class="flex w-full h-20 mb-4 relative">
          <div
            v-for="actor in actors"
            :key="actor"
            class="flex-1 flex flex-col items-center"
          >
            <div
              class="h-12 w-12 rounded-full flex items-center justify-center mb-2 shadow-md border-2 transform transition-transform hover:scale-110"
              :class="[roleInfo[actor].color, roleInfo[actor].borderColor]"
            >
              <div class="text-xl" :class="[roleInfo[actor].icon, roleInfo[actor].text]" />
            </div>
            <div class="text-xs font-medium px-2 py-1 rounded-full" :class="roleInfo[actor].color">
              {{ actor }}
            </div>
          </div>
        </div>

        <!-- 生命线和消息 -->
        <div class="relative h-[280px] w-full">
          <!-- 生命线 -->
          <div
            v-for="actor in actors"
            :key="`line-${actor}`"
            class="absolute top-0 bottom-0 w-px"
            :class="actor === steps[currentStep].from || actor === steps[currentStep].to ? 'bg-blue-400 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'"
            :style="`left: calc(${getActorPosition(actor)}% - 0.5px)`"
          />

          <!-- 当前步骤的消息 -->
          <div class="absolute w-full top-[40%]">
            <!-- 动画流线 -->
            <div
              class="absolute h-1 bg-gradient-to-r from-blue-300 via-blue-500 to-purple-500 rounded-full shadow-sm animate-pulse"
              :style="`
                left: calc(${getActorPosition(steps[currentStep].from)}%);
                width: calc(${Math.abs(getActorPosition(steps[currentStep].to) - getActorPosition(steps[currentStep].from))}%);
                ${!isRightDirection(steps[currentStep].from, steps[currentStep].to) ? 'transform: translateX(-100%); background: linear-gradient(to left, #93c5fd, #3b82f6, #8b5cf6);' : ''}
                top: 12px;
              `"
            />

            <!-- 发送方节点(箭头起点) -->
            <div
              class="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              :style="`
                left: calc(${getActorPosition(steps[currentStep].from)}%);
                top: 12px;
              `"
            >
              <div
                class="h-8 w-8 rounded-full flex items-center justify-center pulse-animation border-2 shadow-lg"
                :class="[roleInfo[steps[currentStep].from].color, roleInfo[steps[currentStep].from].borderColor]"
              >
                <div :class="[roleInfo[steps[currentStep].from].icon, roleInfo[steps[currentStep].from].text]" />
              </div>
            </div>

            <!-- 接收方节点(箭头终点) -->
            <div
              class="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              :style="`
                left: calc(${getActorPosition(steps[currentStep].to)}%);
                top: 12px;
              `"
            >
              <div
                class="relative h-9 w-9 flex items-center justify-center"
              >
                <!-- 箭头背景 -->
                <div
                  class="absolute inset-0 transform z-20 t-[5px]"
                  :class="isRightDirection(steps[currentStep].from, steps[currentStep].to) ? '-rotate-180' : 'rotate-0'"
                >
                  <div class="w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[16px] border-blue-500 transform -translate-x-1 animate-bounce-x" />
                </div>

                <!-- 图标容器 -->
                <div
                  class="h-7 w-7 rounded-full flex items-center justify-center z-10 shadow-lg border-2"
                  :class="[roleInfo[steps[currentStep].to].color, roleInfo[steps[currentStep].to].borderColor]"
                >
                  <div :class="[roleInfo[steps[currentStep].to].icon, roleInfo[steps[currentStep].to].text]" />
                </div>
              </div>
            </div>

            <!-- 消息文本 -->
            <div
              class="absolute text-sm px-4 py-2 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 rounded-lg shadow-md transform transition-all hover:scale-105"
              :style="`
                left: calc(${(getActorPosition(steps[currentStep].from) + getActorPosition(steps[currentStep].to)) / 2}% - 75px);
                top: -60px;
                z-index: 30;
                min-width: 150px;
                text-align: center;
              `"
            >
              <div class="font-medium text-blue-600 dark:text-blue-300">
                {{ steps[currentStep].message }}
              </div>
            </div>
          </div>

          <!-- 步骤描述 -->
          <div class="absolute w-full bottom-10 left-0 text-center">
            <div class="inline-block px-5 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg shadow-md border border-blue-100 dark:border-blue-800">
              <div class="text-sm font-medium text-blue-800 dark:text-blue-200">
                {{ steps[currentStep].description }}
              </div>
            </div>
          </div>
        </div>

        <!-- 步骤指示器 -->
        <div class="flex justify-center space-x-2 mt-4">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="w-2 h-2 rounded-full cursor-pointer transition-all hover:scale-125"
            :class="index === currentStep ? 'bg-blue-500 shadow-md' : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'"
            :title="step.title"
            @click="currentStep = index"
          />
        </div>
      </div>

      <!-- 右侧日志区域 -->
      <div class="w-[380px] p-3 overflow-hidden flex flex-col bg-gray-50 dark:bg-gray-850">
        <div class="flex items-center justify-between mb-3 px-1">
          <div class="flex items-center space-x-2">
            <div class="i-carbon-list text-blue-500 dark:text-blue-400 text-lg" />
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              通信日志记录
            </div>
          </div>
          <div class="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
            {{ logHistory.length }} 条记录
          </div>
        </div>

        <!-- 日志列表 -->
        <div class="flex-1 border rounded-lg bg-white dark:bg-gray-800 overflow-auto shadow-inner">
          <div
            v-for="(log, index) in logHistory"
            :key="index"
            class="p-3 border-b last:border-b-0 transition-colors"
            :class="log.step === currentStep ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-750'"
          >
            <div class="flex justify-between items-center mb-1.5">
              <div class="font-medium text-sm text-blue-700 dark:text-blue-300">
                {{ log.title }}
              </div>
              <div class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400">
                {{ log.timestamp }}
              </div>
            </div>
            <div class="flex items-center text-xs text-blue-600 dark:text-blue-300 mb-2 bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded">
              <div class="i-carbon-arrow-right inline-block mr-1.5" />
              {{ log.message }}
            </div>
            <div class="font-mono text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-1 p-2 border-l-2 border-gray-200 dark:border-gray-700">
              {{ log.log }}
            </div>
          </div>
          <div v-if="logHistory.length === 0" class="p-4 text-center">
            <div class="i-carbon-information text-blue-300 text-2xl mx-auto mb-2" />
            <div class="text-sm text-gray-500">
              暂无日志记录
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 发送方脉冲动画 */
.pulse-animation {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

/* 箭头动画 */
@keyframes bounce-x {
  0%,
  100% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(-3px) translateY(0);
  }
}

.animate-bounce-x {
  animation: bounce-x 1s infinite;
}
</style>
