<script setup lang="ts">
import type { PropType } from 'vue'
import { ref } from 'vue'

const props = defineProps({
  features: {
    type: Array as PropType<{ id: string, name: string }[]>,
    default: () => [],
  },
  technologies: {
    type: Array as PropType<{ id: string, name: string }[]>,
    default: () => [],
  },
  highlights: {
    type: Object as PropType<Record<string, string>>,
    default: () => ({}),
  },
})

const currentHighlight = ref('')

function setHighlight(tech: string, feature: string) {
  currentHighlight.value = `${tech}-${feature}`
}

function clearHighlight() {
  currentHighlight.value = ''
}

function isHighlighted(tech: string, feature: string) {
  return currentHighlight.value === `${tech}-${feature}`
}

function getCellClass(tech: string, feature: string) {
  const key = `${tech}-${feature}`
  const baseClass = 'p-2 border transition-all duration-300'

  if (isHighlighted(tech, feature)) {
    return `${baseClass} bg-amber-100 dark:bg-amber-800 shadow-inner`
  }

  if (props.highlights[key] === 'positive') {
    return `${baseClass} bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300`
  }

  if (props.highlights[key] === 'negative') {
    return `${baseClass} bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300`
  }

  if (props.highlights[key] === 'neutral') {
    return `${baseClass} bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300`
  }

  return baseClass
}
</script>

<template>
  <div class="comparison-table-container my-4">
    <table class="w-full text-sm border-collapse" border="~">
      <thead>
        <tr>
          <th class="p-2 border bg-gray-100 dark:bg-gray-800" />
          <th
            v-for="tech in technologies"
            :key="tech.id"
            class="p-2 border text-center bg-gray-100 dark:bg-gray-800 font-bold"
          >
            {{ tech.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="feature in features" :key="feature.id">
          <td class="p-2 border font-medium">
            {{ feature.name }}
          </td>
          <td
            v-for="tech in technologies"
            :key="`${tech.id}-${feature.id}`"
            :class="getCellClass(tech.id, feature.id)"
            @mouseenter="setHighlight(tech.id, feature.id)"
            @mouseleave="clearHighlight()"
          >
            <slot :name="`${tech.id}-${feature.id}`">
              <!-- 默认内容 -->
              <div class="text-center">
                -
              </div>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
