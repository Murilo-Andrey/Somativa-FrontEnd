<template>
  <div>
    <div v-if="loading">Carregando...</div>
    <div v-else-if="error">Manutenção não encontrada.</div>
    <div v-else class="card p-4 bg-white">
      <h2 class="text-xl font-semibold">{{ item.title }}</h2>
      <p class="text-sm text-gray-500">Máquina: {{ item.machine_name }}</p>
      <p class="mt-2">{{ item.description }}</p>
      <p class="mt-2">Agendada: {{ item.scheduled_at }}</p>
      <p class="mt-2">Status: {{ item.status }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const item = ref(null)
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  try {
    const id = route.params.id
    const res = await api.getMaintenance(id)
    item.value = res.data
  } catch (e) {
    console.error('Erro ao carregar manutenção:', e)
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>
