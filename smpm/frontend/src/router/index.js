import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Maintenances from '../views/Maintenances.vue'
import MaintenanceDetails from '../views/MaintenanceDetails.vue'
import MaintenanceNew from '../views/MaintenanceNew.vue'
import Login from '../views/Login.vue'
import CalendarView from '../views/Calendar.vue'
import AdminUsers from '../views/AdminUsers.vue' // ⬅️ NOVO

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },

  { path: '/maintenances', name: 'Maintenances', component: Maintenances },

  // ⚠️ ROTA DE NOVA MANUTENÇÃO — vem ANTES de /maintenances/:id
  { path: '/maintenances/new', name: 'MaintenanceNew', component: MaintenanceNew },

  { path: '/maintenances/:id', name: 'MaintenanceDetails', component: MaintenanceDetails, props: true },

  { path: '/login', name: 'Login', component: Login },
  { path: '/calendar', name: 'Calendar', component: CalendarView },

  // Rota de administração (apenas admin visualiza o link no header)
  { path: '/admin', name: 'AdminUsers', component: AdminUsers }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
