import { defineStore } from 'pinia'
import api from '../services/api'

export const useMainStore = defineStore('main', {
  state: () => ({ machines: [], maintenances: [], kpis: { totalMachines: 0, scheduled: 0, performed: 0 } }),
  actions: {
    async fetchMachines() {
      const res = await api.listMachines();
      this.machines = res.data;
      this.kpis.totalMachines = this.machines.length;
    },
    async fetchMaintenances(params = {}) {
      const res = await api.listMaintenances(params);
      this.maintenances = res.data;
      this.kpis.scheduled = this.maintenances.filter(m => m.status === 'programada').length;
      this.kpis.performed = this.maintenances.filter(m => m.status === 'realizada').length;
    }
  }
});
