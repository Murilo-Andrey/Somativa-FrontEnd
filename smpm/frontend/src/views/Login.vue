<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="card p-8 bg-white dark:bg-gray-800 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center dark:text-white">Login</h2>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2 dark:text-gray-200">
            E-mail (Gmail) ou admin
          </label>
          <input
            v-model="form.username"
            type="text"
            required
            class="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="seuemail@gmail.com ou admin"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium mb-2 dark:text-gray-200">
            Senha
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Digite sua senha"
          />
        </div>

        <div
          v-if="error"
          class="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm"
        >
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-cyan-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <span v-if="loading">Entrando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      loading: false,
      error: null
    }
  },

  methods: {
    async handleLogin() {
      this.loading = true
      this.error = null

      try {
        // validação simples no front:
        if (
          this.form.username !== 'admin' &&
          !this.form.username.endsWith('@gmail.com')
        ) {
          this.loading = false
          this.error = 'Para usuários comuns, use um e-mail Gmail.'
          return
        }

        const response = await api.login(this.form)

        const token = response.data.token
        const user = response.data.user

        if (!token) {
          throw new Error('Token não recebido')
        }

        localStorage.setItem('token', token)
        if (user && user.role) {
          localStorage.setItem('role', user.role)
        } else {
          localStorage.removeItem('role')
        }

        const redirect = this.$route.query.redirect || '/'
        this.$router.push(redirect)
      } catch (error) {
        console.error('Erro no login:', error)
        this.error = error.response?.data?.error || 'Usuário ou senha inválidos'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
