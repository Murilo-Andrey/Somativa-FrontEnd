<template>
  <div class="page">
    <h2 class="title">Administração — Usuários</h2>

    <div class="card">
      <h3 class="section-title">Criar novo usuário</h3>

      <form @submit.prevent="createUser" class="form">
        <input
          v-model="form.username"
          type="email"
          class="input"
          placeholder="E-mail Gmail (ou admin)"
          required
        />
        <input
          v-model="form.password"
          type="password"
          class="input"
          placeholder="Senha"
          required
        />
        <select v-model="form.role" class="input" required>
          <option disabled value="">Selecione o perfil</option>
          <option value="admin">Admin</option>
          <option value="user">Usuário</option>
        </select>

        <button class="btn btn-primary" type="submit">Salvar usuário</button>
      </form>
    </div>

    <div class="card" v-if="users.length">
      <h3 class="section-title">Usuários cadastrados</h3>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuário</th>
            <th>Perfil</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.id }}</td>
            <td>{{ u.username }}</td>
            <td>{{ u.role }}</td>
            <td>
              <button
                class="link link-danger"
                @click="removeUser(u.id)"
              >
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'

const router = useRouter()

const users = ref([])
const form = ref({
  username: '',
  password: '',
  role: ''
})

const loadUsers = async () => {
  try {
    const res = await api.listUsers()
    users.value = res.data
  } catch (e) {
    console.error('Erro ao carregar usuários', e)
    if (e.response && e.response.status === 403) {
      alert('Acesso restrito a administradores.')
      router.push('/')
    }
  }
}

const createUser = async () => {
  try {
    // validação simples: se não for admin, precisa ser gmail
    if (
      form.value.role !== 'admin' &&
      !form.value.username.endsWith('@gmail.com')
    ) {
      alert('Usuários não-admin devem usar um e-mail Gmail.')
      return
    }

    await api.createUser(form.value)
    alert('Usuário criado com sucesso!')
    form.value = { username: '', password: '', role: '' }
    await loadUsers() // refresh automático
  } catch (e) {
    console.error('Erro ao criar usuário', e)
    alert(e?.response?.data?.error || 'Erro ao criar usuário.')
  }
}

const removeUser = async id => {
  if (!confirm('Deseja realmente excluir este usuário?')) return
  try {
    await api.deleteUser(id)
    await loadUsers() // refresh automático
  } catch (e) {
    console.error('Erro ao excluir usuário', e)
    alert(e?.response?.data?.error || 'Erro ao excluir usuário.')
  }
}

onMounted(() => {
  loadUsers()
})
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

.card {
  max-width: 800px;
  margin: 0 auto 1rem;
  padding: 1.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 0.95rem;
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

.link {
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  font-size: 0.85rem;
}

.link-danger {
  color: #dc2626;
}
</style>
