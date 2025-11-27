<template>
  <div class="page">
    <h2 class="page-title">SMPM — Manutenção</h2>

    <div class="card calendar-card fade-in">
      <div class="calendar-header">
        <div>
          <h3 class="calendar-title">Calendário de Manutenções</h3>
          <p class="calendar-subtitle">
            Visualize rapidamente as manutenções programadas ao longo do mês.
          </p>
        </div>

        <div class="legend">
          <span class="legend-item">
            <span class="legend-dot legend-programada"></span>
            Programada
          </span>
          <span class="legend-item">
            <span class="legend-dot legend-realizada"></span>
            Realizada
          </span>
          <span class="legend-item">
            <span class="legend-dot legend-manutencao"></span>
            Manutenção
          </span>
        </div>
      </div>

      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import api from '../services/api'

const calendarOptions = ref({
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  locale: 'pt-br',
  height: 'auto',
  firstDay: 0, // domingo
  headerToolbar: {
    left: 'today',
    center: 'title',
    right: 'prev,next'
  },
  buttonText: {
    today: 'Hoje'
  },
  dayMaxEventRows: 3,
  eventDisplay: 'block',
  eventTimeFormat: {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  },
  events: [],
  eventClassNames: arg => {
    const status = arg.event.extendedProps.status
    if (status === 'realizada') return ['event-realizada']
    if (status === 'manutencao') return ['event-manutencao']
    return ['event-programada']
  }
})

let refreshTimer = null

const loadEvents = async () => {
  try {
    const res = await api.listMaintenances()
    calendarOptions.value.events = res.data.map(m => ({
      id: m.id,
      title: `${m.machine_name}: ${m.title}`,
      start: m.scheduled_at,
      extendedProps: {
        status: m.status
      }
    }))
  } catch (e) {
    console.error('Erro ao carregar manutenções para o calendário:', e)
  }
}

onMounted(async () => {
  await loadEvents()
  // auto‑refresh a cada 10 segundos
  refreshTimer = setInterval(loadEvents, 10000)
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>

<style scoped>
.page {
  padding: 2rem 0;
}

.page-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
}

.calendar-card {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem 1.75rem 1.75rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.calendar-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.calendar-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
}

/* Legenda */
.legend {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: #6b7280;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.legend-programada {
  background-color: #f97316;
}

.legend-realizada {
  background-color: #16a34a;
}

.legend-manutencao {
  background-color: #ef4444;
}

/* =======================
   Estilização FullCalendar
   ======================= */

.calendar-card :deep(.fc) {
  font-family: inherit;
  border: none;
  font-size: 0.85rem;
}

.calendar-card :deep(.fc-scrollgrid) {
  border: none;
}

.calendar-card :deep(.fc-toolbar) {
  margin-bottom: 1rem;
}

.calendar-card :deep(.fc-toolbar-title) {
  font-size: 1.1rem;
  font-weight: 600;
}

.calendar-card :deep(.fc-button) {
  border-radius: 999px;
  border: none;
  padding: 0.25rem 0.8rem;
  font-size: 0.8rem;
  text-transform: capitalize;
  background: #6b7280;
}

.calendar-card :deep(.fc-button-primary:not(:disabled).fc-button-active),
.calendar-card :deep(.fc-button-primary:not(:disabled):active) {
  background: #4f46e5;
}

.calendar-card :deep(.fc-button-primary:focus),
.calendar-card :deep(.fc-button-primary:active) {
  box-shadow: none;
}

.calendar-card :deep(.fc-day-today) {
  background-color: #fefce8;
}

.calendar-card :deep(.fc-daygrid-day-number) {
  font-size: 0.8rem;
}

/* ================================
   VISIBILIDADE MELHORADA DOS EVENTOS
   ================================ */

.calendar-card :deep(.fc-event) {
  border: none !important;
  border-radius: 6px !important;
  padding: 4px 6px !important;
  font-size: 0.75rem !important;
  font-weight: 600;
  white-space: normal !important;
  overflow: visible !important;
  opacity: 1 !important;
}

/* Programada (laranja) */
.calendar-card :deep(.event-programada) {
  background-color: #f97316 !important;
  color: #ffffff !important;
  box-shadow: 0 2px 4px rgba(249, 115, 22, 0.35);
}

/* Realizada (verde) */
.calendar-card :deep(.event-realizada) {
  background-color: #16a34a !important;
  color: #ffffff !important;
  box-shadow: 0 2px 4px rgba(22, 163, 74, 0.4);
}

/* Manutenção (vermelho) */
.calendar-card :deep(.event-manutencao) {
  background-color: #dc2626 !important;
  color: #ffffff !important;
  box-shadow: 0 2px 4px rgba(220, 38, 38, 0.45);
}

/* Dark mode */
.dark .calendar-subtitle {
  color: #9ca3af;
}

.dark .legend-item {
  color: #9ca3af;
}

.dark .calendar-card :deep(.fc-day-today) {
  background-color: rgba(250, 204, 21, 0.08);
}

.dark .calendar-card :deep(.event-programada),
.dark .calendar-card :deep(.event-realizada),
.dark .calendar-card :deep(.event-manutencao) {
  filter: brightness(1.15);
}
</style>
