<template>
  <div class="page">
    <h2 class="title">SMPM — Manutenção</h2>

    <div class="card stats-card mb-6">
      <button class="btn btn-primary" @click="goToNew">
        Nova Manutenção
      </button>

      <!-- mini formulário de nova máquina -->
      <div class="new-machine">
        <h3 class="nm-title">Cadastrar nova máquina</h3>
        <div class="nm-row">
          <input
            v-model="newMachine.name"
            type="text"
            class="input"
            placeholder="Nome da máquina"
          />
          <input
            v-model="newMachine.sector"
            type="text"
            class="input"
            placeholder="Setor (opcional)"
          />
          <button class="btn btn-secondary" @click="createMachine">
            Salvar máquina
          </button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="filters">
          <input
            v-model="search"
            type="text"
            placeholder="Pesquisar..."
            class="input"
            @keyup.enter="applyFilter"
          />

          <select v-model="statusFilter" class="input select">
            <option value="">Todos</option>
            <option value="programada">Programada</option>
            <option value="realizada">Realizada</option>
            <option value="manutencao">Manutenção</option>
          </select>

          <button class="btn btn-secondary" @click="applyFilter">
            Filtrar
          </button>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Máquina</th>
            <th>Título</th>
            <th>Data</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in maintenances" :key="m.id">
            <td>{{ m.machine_name }}</td>
            <td>{{ m.title }}</td>
            <td>{{ formatDate(m.scheduled_at) }}</td>
            <td>
              <span :class="['status-pill', statusClass(m.status)]">
                {{ m.status }}
              </span>
            </td>
            <td>
              <button class="link" @click="view(m.id)">Ver</button>
              <button class="link link-danger" @click="remove(m.id)">
                Excluir
              </button>
            </td>
          </tr>
          <tr v-if="maintenances.length === 0">
            <td colspan="5" class="empty">Nenhuma manutenção encontrada</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

export default {
  setup() {
    const router = useRouter()
    const maintenances = ref([])
    const search = ref('')
    const statusFilter = ref('')
    const loading = ref(false)

    const newMachine = ref({
      name: '',
      sector: ''
    })

    const refreshIntervalId = ref(null) // guarda o ID do setInterval

    const loadMaintenances = async () => {
      loading.value = true
      try {
        const params = {}
        if (statusFilter.value) params.status = statusFilter.value
        if (search.value) params.q = search.value

        const res = await api.listMaintenances(params)
        maintenances.value = res.data
      } catch (e) {
        console.error('Erro ao carregar manutenções', e)
      } finally {
        loading.value = false
      }
    }

    const applyFilter = () => {
      loadMaintenances()
    }

    const goToNew = () => {
      router.push('/maintenances/new')
    }

    const view = id => {
      router.push(`/maintenances/${id}`)
    }

    const remove = async id => {
      if (!confirm('Deseja realmente excluir esta manutenção?')) return
      try {
        await api.deleteMaintenance(id)
        await loadMaintenances() // já atualiza logo após excluir
      } catch (e) {
        console.error('Erro ao excluir manutenção', e)
      }
    }

    const createMachine = async () => {
      if (!newMachine.value.name) {
        alert('Informe pelo menos o nome da máquina.')
        return
      }
      try {
        await api.createMachine({
          name: newMachine.value.name,
          sector: newMachine.value.sector,
          status: 'operacional'
        })
        alert('Máquina cadastrada com sucesso!')
        newMachine.value.name = ''
        newMachine.value.sector = ''
        // se você quiser, pode recarregar máquinas em outros lugares aqui
      } catch (e) {
        console.error('Erro ao criar máquina', e)
        alert('Erro ao criar máquina.')
      }
    }

    const formatDate = iso => {
      if (!iso) return ''
      return iso.replace('T', ' ').replace('.000Z', '')
    }

    const statusClass = status => {
      if (status === 'programada') return 'status-programada'
      if (status === 'realizada') return 'status-realizada'
      if (status === 'manutencao') return 'status-manutencao'
      return ''
    }

    onMounted(() => {
      // carrega imediatamente
      loadMaintenances()

      // auto‑refresh a cada 10 segundos
      refreshIntervalId.value = setInterval(loadMaintenances, 10000)
    })

    onUnmounted(() => {
      // limpa o intervalo quando sair da tela
      if (refreshIntervalId.value) {
        clearInterval(refreshIntervalId.value)
      }
    })

    return {
      maintenances,
      search,
      statusFilter,
      applyFilter,
      goToNew,
      view,
      remove,
      formatDate,
      statusClass,
      loading,
      newMachine,
      createMachine
    }
  }
}
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

/* bloco com botão + nova máquina */
.stats-card {
  max-width: 1100px;
  margin: 0 auto 1rem;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.new-machine {
  flex: 1;
}

.nm-title {
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.nm-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.card {
  max-width: 1100px;
  margin: 0 auto;
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--card-shadow);
}

.card-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.75rem;
}

.filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input {
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  border: 1px solid #ddd;
  min-width: 180px;
}

.select {
  min-width: 120px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
}

.table th,
.table td {
  padding: 0.5rem 0.4rem;
  text-align: left;
  border-bottom: 1px solid #f1f1f1;
  font-size: 0.9rem;
}

.status-pill {
  padding: 0.1rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
}

.status-programada {
  color: #c05621;
  background: #fffaf0;
}

.status-realizada {
  color: #15803d;
  background: #ecfdf3;
}

.status-manutencao {
  color: #b91c1c;
  background: #fef2f2;
}

.link {
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  font-size: 0.85rem;
  margin-right: 0.4rem;
}

.link-danger {
  color: #dc2626;
}

.empty {
  text-align: center;
  color: #888;
  padding: 1rem 0;
}
</style>
