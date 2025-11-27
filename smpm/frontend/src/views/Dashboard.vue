<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <KpiCard title="Máquinas" :value="kpis.totalMachines" />
    <KpiCard title="Programadas" :value="kpis.scheduled" />
    <KpiCard title="Realizadas" :value="kpis.performed" />

    <div class="md:col-span-3 mt-4">
      <h2 class="text-xl font-semibold mb-2">Últimas manutenções</h2>
      <MaintenanceTable :maintenances="maintenances" @filter="onFilter" />
    </div>

    <!-- Gráfico de resumo ao final da página -->
    <div class="md:col-span-3 mt-6">
      <h2 class="text-xl font-semibold mb-2">
        Resumo de manutenções por status
      </h2>

      <div class="card p-4">
        <p class="text-sm text-gray-500 mb-3">
          Distribuição das manutenções cadastradas por tipo de status.
        </p>

        <div class="chart-row">
          <div class="chart-label">
            Programadas ({{ totalProgramadas }})
          </div>
          <div class="chart-bar-bg">
            <div
              class="chart-bar chart-bar-programada"
              :style="{ width: barWidth(totalProgramadas) }"
            ></div>
          </div>
        </div>

        <div class="chart-row">
          <div class="chart-label">
            Realizadas ({{ totalRealizadas }})
          </div>
          <div class="chart-bar-bg">
            <div
              class="chart-bar chart-bar-realizada"
              :style="{ width: barWidth(totalRealizadas) }"
            ></div>
          </div>
        </div>

        <div class="chart-row">
          <div class="chart-label">
            Manutenção ({{ totalManutencao }})
          </div>
          <div class="chart-bar-bg">
            <div
              class="chart-bar chart-bar-manutencao"
              :style="{ width: barWidth(totalManutencao) }"
            ></div>
          </div>
        </div>

        <p class="text-xs text-gray-400 mt-3">
          Total de manutenções: {{ totalManutencoes }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useMainStore } from '../store'
import { onMounted, computed } from 'vue'
import KpiCard from '../components/KpiCard.vue'
import MaintenanceTable from '../components/MaintenanceTable.vue'

export default {
  components: { KpiCard, MaintenanceTable },
  setup() {
    const store = useMainStore()

    const loadData = async (params) => {
      await store.fetchMachines()
      await store.fetchMaintenances(params)
    }

    onMounted(async () => {
      await loadData()
    })

    const onFilter = async (params) => {
      await store.fetchMaintenances(params)
    }

    // Cálculos para o gráfico
    const totalProgramadas = computed(
      () =>
        store.maintenances.filter(m => m.status === 'programada').length
    )

    const totalRealizadas = computed(
      () =>
        store.maintenances.filter(m => m.status === 'realizada').length
    )

    const totalManutencao = computed(
      () =>
        store.maintenances.filter(m => m.status === 'manutencao').length
    )

    const totalManutencoes = computed(() => store.maintenances.length)

    const maxValue = computed(() =>
      Math.max(
        totalProgramadas.value,
        totalRealizadas.value,
        totalManutencao.value,
        1
      )
    )

    const barWidth = (value) =>
      `${Math.round((value / maxValue.value) * 100)}%`

    return {
      kpis: store.kpis,
      maintenances: store.maintenances,
      onFilter,
      totalProgramadas,
      totalRealizadas,
      totalManutencao,
      totalManutencoes,
      barWidth
    }
  }
}
</script>

<style scoped>
.card {
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--card-shadow);
}

/* Gráfico simples em barras horizontais */
.chart-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.chart-label {
  width: 160px;
  font-size: 0.875rem;
}

.chart-bar-bg {
  flex: 1;
  height: 10px;
  border-radius: 999px;
  background: #e5e7eb;
  overflow: hidden;
}

.chart-bar {
  height: 100%;
  border-radius: 999px;
}

.chart-bar-programada {
  background: #f97316;
}

.chart-bar-realizada {
  background: #16a34a;
}

.chart-bar-manutencao {
  background: #dc2626;
}

.dark .chart-bar-bg {
  background: #1f2933;
}
</style>
