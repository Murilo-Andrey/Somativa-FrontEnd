<template>
  <div class="card p-4 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-200">
    <div class="text-sm text-gray-500 dark:text-gray-400 font-medium">
      {{ title }}
    </div>
    <div class="text-3xl font-bold mt-2 dark:text-white">
      {{ formatValue(value) }}
    </div>
    <div v-if="subtitle" class="text-xs text-gray-400 dark:text-gray-500 mt-1">
      {{ subtitle }}
    </div>
  </div>
</template>

<script>
export default { 
  props: { 
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: 0
    },
    subtitle: {
      type: String,
      default: ''
    }
  },
  
  methods: {
    formatValue(val) {
      if (val === null || val === undefined) return '0'
      return val
    }
  }
}
</script>