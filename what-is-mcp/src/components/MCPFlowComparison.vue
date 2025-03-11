<script setup>
import { ref } from 'vue'

const showTraditional = ref(true)
const showMCP = ref(false)

function toggleView() {
  showTraditional.value = !showTraditional.value
  showMCP.value = !showMCP.value
}
</script>

<template>
  <div class="border rounded-lg overflow-hidden shadow-md bg-white dark:bg-gray-800">
    <div class="bg-gray-100 dark:bg-gray-700 px-3 py-1 border-b flex justify-between items-center">
      <div class="font-medium text-sm">
        AI能力扩展对比
      </div>
      <button
        class="px-2 py-0.5 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
        @click="toggleView"
      >
        {{ showTraditional ? '查看MCP方式' : '查看传统方式' }}
      </button>
    </div>

    <div class="p-2">
      <transition name="fade" mode="out-in">
        <div v-if="showTraditional" key="traditional" class="space-y-2">
          <h3 class="font-semibold text-sm">
            传统方式：每个平台一套集成
          </h3>

          <div class="flex flex-col items-center">
            <div class="w-full flex justify-between mb-3">
              <div class="text-center p-1 bg-blue-100 dark:bg-blue-800 rounded-lg w-24">
                <div class="i-carbon-application mb-0.5 text-xl mx-auto" />
                <div class="text-xs">
                  ChatGPT
                </div>
              </div>

              <div class="text-center p-1 bg-purple-100 dark:bg-purple-800 rounded-lg w-24">
                <div class="i-carbon-application mb-0.5 text-xl mx-auto" />
                <div class="text-xs">
                  Claude
                </div>
              </div>

              <div class="text-center p-1 bg-green-100 dark:bg-green-800 rounded-lg w-24">
                <div class="i-carbon-application mb-0.5 text-xl mx-auto" />
                <div class="text-xs">
                  其他AI应用
                </div>
              </div>
            </div>

            <div class="w-full grid grid-cols-3 gap-2">
              <div class="flex flex-col items-center">
                <div class="h-12 border-l-2 border-dashed border-gray-400" />
                <div class="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg w-full text-center">
                  <div class="text-xs">
                    ChatGPT插件 + Function
                  </div>
                </div>
              </div>

              <div class="flex flex-col items-center">
                <div class="h-12 border-l-2 border-dashed border-gray-400" />
                <div class="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg w-full text-center">
                  <div class="text-xs">
                    自己写 Function
                  </div>
                </div>
              </div>

              <div class="flex flex-col items-center">
                <div class="h-12 border-l-2 border-dashed border-gray-400" />
                <div class="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg w-full text-center">
                  <div class="text-xs">
                    自己写 Function
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-3 p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-800 dark:text-amber-200 w-full text-center">
              <div class="i-carbon-warning-alt inline-block mr-1" />
              <span class="text-xs">每个平台需要单独开发和维护</span>
            </div>
          </div>
        </div>

        <div v-else key="mcp" class="space-y-2">
          <h3 class="font-semibold text-sm">
            MCP方式：一次开发，处处运行
          </h3>

          <div class="flex flex-col items-center">
            <div class="w-full flex justify-between mb-3">
              <div class="text-center p-1 bg-blue-100 dark:bg-blue-800 rounded-lg w-24">
                <div class="i-carbon-application mb-0.5 text-xl mx-auto" />
                <div class="text-xs">
                  支持MCP的应用1
                </div>
              </div>

              <div class="text-center p-1 bg-purple-100 dark:bg-purple-800 rounded-lg w-24">
                <div class="i-carbon-application mb-0.5 text-xl mx-auto" />
                <div class="text-xs">
                  支持MCP的应用2
                </div>
              </div>

              <div class="text-center p-1 bg-green-100 dark:bg-green-800 rounded-lg w-24">
                <div class="i-carbon-application mb-0.5 text-xl mx-auto" />
                <div class="text-xs">
                  支持MCP的应用3
                </div>
              </div>
            </div>

            <div class="w-full flex items-center justify-center">
              <div class="h-10 w-full border-y-2 border-dashed border-gray-400" />
            </div>

            <div class="p-1.5 bg-green-100 dark:bg-green-800 rounded-lg w-full text-center">
              <div class="font-medium text-xs">
                MCP 标准协议
              </div>
              <div class="text-xs opacity-75">
                统一的服务器-客户端通信标准
              </div>
            </div>

            <div class="h-10 w-full border-l-2 border-dashed border-gray-400 flex items-center justify-center">
              <div class="i-carbon-connection text-xl" />
            </div>

            <div class="w-full grid grid-cols-3 gap-2">
              <div class="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                <div class="text-xs">
                  MCP服务器1
                </div>
              </div>

              <div class="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                <div class="text-xs">
                  MCP服务器2
                </div>
              </div>

              <div class="p-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                <div class="text-xs">
                  MCP服务器3
                </div>
              </div>
            </div>

            <div class="mt-3 p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-800 dark:text-green-200 w-full text-center">
              <div class="i-carbon-checkmark-outline inline-block mr-1" />
              <span class="text-xs">一次开发，连接所有支持MCP的应用</span>
            </div>
          </div>
        </div>
      </transition>
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
</style>
