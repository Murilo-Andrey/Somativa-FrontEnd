// src/services/api.js
import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:4000/api'
})

// pega token do localStorage, se tiver
http.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default {
  // AUTH
  login(data) {
    return http.post('/auth/login', data)
  },

  // MACHINES
  listMachines(params = {}) {
    return http.get('/machines', { params })
  },

  createMachine(data) {
    return http.post('/machines', data)
  },

  // MAINTENANCES
  listMaintenances(params = {}) {
    // aceita params (status, q, etc)
    return http.get('/maintenances', { params })
  },

  getMaintenance(id) {
    return http.get(`/maintenances/${id}`)
  },

  createMaintenance(data) {
    return http.post('/maintenances', data)
  },

  updateMaintenance(id, data) {
    return http.put(`/maintenances/${id}`, data)
  },

  deleteMaintenance(id) {
    return http.delete(`/maintenances/${id}`)
  },

  // USERS (ADMIN)
  listUsers() {
    return http.get('/users')
  },

  createUser(data) {
    return http.post('/users', data)
  },

  deleteUser(id) {
    return http.delete(`/users/${id}`)
  }
}
