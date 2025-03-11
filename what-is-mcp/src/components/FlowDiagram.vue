<script setup lang="ts">
import type { PropType } from 'vue'
import { onMounted, ref } from 'vue'

const props = defineProps({
  steps: {
    type: Array as PropType<{ label: string }[]>,
    default: () => [],
  },
  direction: {
    type: String,
    default: 'horizontal', // 'horizontal' or 'vertical'
  },
  animated: {
    type: Boolean,
    default: true,
  },
  autoAnimate: {
    type: Boolean,
    default: false,
  },
})

const currentStep = ref(-1)
const animationInterval = ref<NodeJS.Timeout | null>(null)

function nextStep() {
  if (currentStep.value < props.steps.length - 1) {
    currentStep.value++
  }
  else if (props.animated) {
    // 动画结束，重置
    setTimeout(() => {
      currentStep.value = -1
    }, 2000)
  }
}

function resetAnimation() {
  currentStep.value = -1
  if (animationInterval.value) {
    clearInterval(animationInterval.value)
    animationInterval.value = null
  }
}

function startAnimation() {
  resetAnimation()
  currentStep.value = 0

  if (props.animated) {
    animationInterval.value = setInterval(() => {
      nextStep()
    }, 1500)
  }
}

onMounted(() => {
  if (props.autoAnimate && props.animated) {
    setTimeout(startAnimation, 1000)
  }
})
</script>

<template>
  <div
    :class="[{ 'flow-vertical': direction === 'vertical' }]"
    class="relative my-6 p-4 flow-diagram"
  >
    <div v-if="animated" class="controls absolute top-0 right-0">
      <button
        v-if="!animationInterval"
        class="px-2 py-1 bg-blue-500 text-white rounded text-xs"
        @click="startAnimation"
      >
        播放
      </button>
      <button
        v-else
        class="px-2 py-1 bg-gray-500 text-white rounded text-xs"
        @click="resetAnimation"
      >
        重置
      </button>
    </div>

    <div
      :class="[
        direction === 'vertical' ? 'flex-col' : 'flex-row',
      ]"
      class="flex items-center justify-start flow-container"
    >
      <template v-for="(step, index) in steps" :key="index">
        <!-- 步骤元素 -->
        <div
          :class="[
            { active: currentStep >= index || !animated },
            { 'prev-active': currentStep > index },
            { 'current-active': currentStep === index },
          ]"
          class="
            p-4 shadow-sm rounded-lg bg-gray-100 dark:bg-gray-800
            transition-all duration-500 transform
            border border-gray-200 dark:border-gray-700
           step-box relative"
          :style="{
            opacity: !animated || currentStep >= index ? 1 : 0.5,
            transform: currentStep === index ? 'scale(1.05)' : 'scale(1)',
          }"
        >
          <div class="step-number absolute -top-3 -left-3 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
            {{ index + 1 }}
          </div>
          <div class="step-content">
            <slot :name="`step-${index}`">
              {{ step.label || `步骤 ${index + 1}` }}
            </slot>
          </div>
        </div>

        <!-- 连接箭头 (除了最后一个元素外) -->
        <div
          v-if="index < steps.length - 1"
          :class="[
            direction === 'vertical' ? 'my-2' : 'mx-2',
            { active: currentStep > index || !animated },
          ]"
          class="flex items-center justify-center transition-all duration-500 step-arrow"
        >
          <div v-if="direction === 'horizontal'" class="arrow-h">
            <div class="h-0.5 w-12 bg-blue-500 relative">
              <div class="absolute -right-2 -top-1 text-blue-500">
                ▶
              </div>
            </div>
          </div>
          <div v-else class="arrow-v">
            <div class="w-0.5 h-8 bg-blue-500 relative">
              <div class="absolute -bottom-2 -left-1 text-blue-500 transform rotate-90">
                ▶
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.step-box.active {
  @apply bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800;
}
.step-box.prev-active {
  @apply bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800;
}
.step-box.current-active {
  @apply bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 shadow-md;
}
.step-arrow.active .arrow-h div,
.step-arrow.active .arrow-v div {
  @apply bg-green-500;
}
.step-arrow.active .arrow-h div div,
.step-arrow.active .arrow-v div div {
  @apply text-green-500;
}

/* 垂直模式的特定样式 */
.flow-vertical .step-box {
  @apply w-full;
}
</style>
