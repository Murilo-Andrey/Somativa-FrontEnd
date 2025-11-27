<template>
  <div id="app">
    <!-- Header aparece em todas as páginas, menos na de Login -->
    <header
      v-if="$route.name !== 'Login'"
      class="header text-white shadow-lg sticky top-0 z-30"
    >
      <div
        class="w-full max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between"
      >
        <h1 class="text-2xl font-bold">SMPM — Manutenção</h1>
        <nav class="flex items-center gap-6">
          <router-link
            to="/"
            class="hover:text-gray-200 transition-colors"
            active-class="underline font-semibold"
          >
            Dashboard
          </router-link>

          <router-link
            to="/maintenances"
            class="hover:text-gray-200 transition-colors"
            active-class="underline font-semibold"
          >
            Manutenções
          </router-link>

          <router-link
            to="/calendar"
            class="hover:text-gray-200 transition-colors"
            active-class="underline font-semibold"
          >
            Calendário
          </router-link>

          <!-- Link visível só para admin -->
          <router-link
            v-if="isAdmin"
            to="/admin"
            class="hover:text-gray-200 transition-colors"
            active-class="underline font-semibold"
          >
            Admin
          </router-link>

          <button
            @click="toggleTheme"
            class="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
          >
            {{ isDark ? 'Claro' : 'Escuro' }}
          </button>

          <button
            @click="logout"
            class="px-4 py-2 bg-purple-700 rounded-lg hover:bg-purple-800 transition-all font-semibold"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>

    <main class="min-h-screen">
      <div class="w-full max-w-screen-xl mx-auto px-4 py-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDark: localStorage.getItem('theme') === 'dark'
    }
  },
  computed: {
    // só controla se mostra o link "Admin"
    isAdmin() {
      return localStorage.getItem('role') === 'admin'
    }
  },
  mounted() {
    // aplica o tema salvo no <html>
    if (this.isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark

      if (this.isDark) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    },
    logout() {
      if (confirm('Deseja realmente sair?')) {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        this.$router.push('/login')
      }
    }
  }
}
</script>
