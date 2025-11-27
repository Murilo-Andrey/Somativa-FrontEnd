<template>
  <div class="card">
    <h2 class="title">Nova Manutenção</h2>

    <form @submit.prevent="submit">
      <label class="label">Máquina</label>
      <select v-model="form.machine_id" required class="input">
        <option disabled value="">Selecione uma máquina</option>
        <option v-for="m in machines" :key="m.id" :value="m.id">
          {{ m.name }}
        </option>
      </select>

      <label class="label">Título</label>
      <input v-model="form.title" required type="text" class="input" />

      <label class="label">Descrição</label>
      <textarea
        v-model="form.description"
        rows="3"
        required
        class="input textarea"
      ></textarea>

      <label class="label">Data / Hora</label>
      <input
        v-model="formDateTime"
        type="datetime-local"
        required
        class="input"
        :min="minDateTime"
      />

      <div class="actions">
        <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
          Cancelar
        </button>
        <button type="submit" class="btn btn-primary">
          Salvar
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'MaintenanceForm',
  props: {
    machines: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      form: {
        machine_id: '',
        title: '',
        description: '',
        scheduled_at: '' // valor final enviado para a API
      },
      formDateTime: '', // ligado ao input datetime-local
      minDateTime: ''   // data mínima permitida (agora)
    }
  },
  created() {
    // define o mínimo do datetime-local como o momento atual (no fuso local)
    const now = new Date()
    const tzOffset = now.getTimezoneOffset() * 60000
    const localISO = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16)
    this.minDateTime = localISO
  },
  methods: {
    async submit() {
      // se não tiver data, nem tenta
      if (!this.formDateTime) {
        alert('Selecione uma data e hora.')
        return
      }

      // validação de data passada no frontend
      const chosen = new Date(this.formDateTime)
      const now = new Date()

      if (chosen < now) {
        alert('Você não pode agendar uma manutenção para uma data que já passou.')
        return
      }

      // converte de "YYYY-MM-DDTHH:mm" para "YYYY-MM-DD HH:mm:00"
      const [date, time] = this.formDateTime.split('T')
      this.form.scheduled_at = `${date} ${time}:00`

      try {
        await api.createMaintenance(this.form)
        this.$emit('created')
        this.$emit('cancel')
      } catch (e) {
        console.error(e)
        alert(e?.response?.data?.error || 'Erro ao salvar manutenção.')
      }
    }
  }
}
</script>

<style scoped>
.card {
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 0.9rem;
  font-size: 0.95rem;
}

.textarea {
  resize: vertical;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn {
  border: none;
  border-radius: 999px;
  padding: 0.45rem 1.2rem;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary {
  background: #22c55e;
  color: #fff;
}

.btn-secondary {
  background: #e5e7eb;
  color: #111827;
}
</style>
