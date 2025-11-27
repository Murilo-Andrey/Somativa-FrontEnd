<template>
  <div class="card p-4 bg-white">
    <div class="mb-2 flex gap-2">
      <input v-model="q" placeholder="Pesquisar..." class="border p-2 rounded flex-1"/>
      <select v-model="status" class="border p-2 rounded">
        <option value="">Todos</option>
        <option value="programada">Programada</option>
        <option value="realizada">Realizada</option>
        <option value="cancelada">Cancelada</option>
      </select>
      <button @click="search" class="btn bg-brand text-white">Filtrar</button>
    </div>
    <table class="w-full text-left">
      <thead>
        <tr class="text-xs text-gray-500">
          <th class="py-2">Máquina</th>
          <th class="py-2">Título</th>
          <th class="py-2">Data</th>
          <th class="py-2">Status</th>
          <th class="py-2">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in maint" :key="m.id" class="border-t">
          <td class="py-2">{{ m.machine_name }}</td>
          <td>{{ m.title }}</td>
          <td>{{ formatDate(m.scheduled_at) }}</td>
          <td><span :class="statusClass(m.status)">{{ m.status }}</span></td>
          <td>
            <router-link :to="`/maintenances/${m.id}`" class="text-accent mr-2">Ver</router-link>
            <button @click="confirmDelete(m.id)" class="btn btn-danger">Excluir</button>
          </td>
        </tr>
        <tr v-if="(maint || []).length === 0">
          <td colspan="5" class="py-4 text-center text-gray-500">Nenhuma manutenção encontrada</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['maintenances'],
  data() { return { q: '', status: '' } },
  computed: { maint() { return this.maintenances || []; } },
  methods: {
    formatDate(d) { if (!d) return '-'; return new Date(d).toLocaleString(); },
    statusClass(s) { if (s === 'programada') return 'text-yellow-600'; if (s === 'realizada') return 'text-green-600'; return 'text-red-600'; },
    search() { this.$emit('filter', { q: this.q, status: this.status }); },
    confirmDelete(id) {
      if (confirm('Tem certeza que deseja excluir esta manutenção?')) {
        this.$emit('delete', id);
      }
    }
  }
}
</script>
