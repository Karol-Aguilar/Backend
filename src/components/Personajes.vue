<!-- filepath: c:/Users/karol/Desktop/Tarea/tarea/src/components/Personajes.vue -->
<template>
  <div class="container mt-5">
    <h2 class="mb-4">Personajes</h2>
    <button class="btn btn-primary mb-3" @click="showCreateModal = true">Agregar Personaje</button>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Foto</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="personaje in personajes" :key="personaje.id">
          <td>{{ personaje.id }}</td>
          <td>{{ personaje.nombre }}</td>
          <td><img :src="personaje.foto" alt="Foto" class="img-thumbnail" style="width: 100px;"></td>
          <td>
            <button class="btn btn-warning btn-sm" @click="editPersonaje(personaje)">Editar</button>
            <button class="btn btn-danger btn-sm" @click="deletePersonaje(personaje.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para crear/editar personaje -->
    <div v-if="showCreateModal || showEditModal" class="modal" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ showCreateModal ? 'Agregar Personaje' : 'Editar Personaje' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="showCreateModal ? createPersonaje() : updatePersonaje()">
              <div class="mb-3">
                <label for="nombre" class="form-label">Nombre:</label>
                <input type="text" id="nombre" v-model="form.nombre" class="form-control" required />
              </div>
              <div class="mb-3">
                <label for="foto" class="form-label">Foto URL:</label>
                <input type="text" id="foto" v-model="form.foto" class="form-control" required />
              </div>
              <button type="submit" class="btn btn-primary">{{ showCreateModal ? 'Agregar' : 'Actualizar' }}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      personajes: [],
      form: {
        nombre: '',
        foto: ''
      },
      showCreateModal: false,
      showEditModal: false,
      editId: null
    };
  },
  methods: {
    async fetchPersonajes() {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3020/personajes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      this.personajes = await response.json();
    },
    async createPersonaje() {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3020/personajes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(this.form)
      });
      const newPersonaje = await response.json();
      this.personajes.push(newPersonaje);
      this.closeModal();
    },
    async updatePersonaje() {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3020/personajes/${this.editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(this.form)
      });
      const updatedPersonaje = await response.json();
      const index = this.personajes.findIndex(p => p.id === this.editId);
      this.$set(this.personajes, index, updatedPersonaje);
      this.closeModal();
    },
    async deletePersonaje(id) {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3020/personajes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      this.personajes = this.personajes.filter(p => p.id !== id);
    },
    editPersonaje(personaje) {
      this.form = { ...personaje };
      this.editId = personaje.id;
      this.showEditModal = true;
    },
    closeModal() {
      this.showCreateModal = false;
      this.showEditModal = false;
      this.form = { nombre: '', foto: '' };
      this.editId = null;
    }
  },
  mounted() {
    this.fetchPersonajes();
  }
};
</script>

<style scoped>
.modal {
  display: block;
  background: rgba(0, 0, 0, 0.5);
}
</style>