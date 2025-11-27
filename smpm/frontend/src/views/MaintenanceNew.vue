<template>
  <div class="page">
    <h2 class="title">SMPM — Nova Manutenção</h2>

    <div v-if="loading" class="loading">Carregando...</div>

    <div v-else class="container">
      <MaintenanceForm
        :machines="machines"
        @created="goBack"
        @cancel="goBack"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import MaintenanceForm from '../components/MaintenanceForm.vue'

const router = useRouter()
const machines = ref([])
const loading = ref(true)

const loadMachines = async () => {
  try {
    const res = await api.listMachines()
    machines.value = res.data
  } catch (e) {
    console.error('Erro ao carregar máquinas para o formulário:', e)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/maintenances')
}

onMounted(loadMachines)
</script>

<style scoped>
.page {
  padding: 2rem 0;
}

.title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.loading {
  text-align: center;
  margin-top: 2rem;
  font-weight: 500;
}
</style>
