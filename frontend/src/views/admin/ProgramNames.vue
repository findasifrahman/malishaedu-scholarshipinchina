<template>
  <div class="admin-program-names">
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">Manage Program Names</h1>
      <v-btn
        color="primary"
        variant="elevated"
        @click="openCreateDialog"
      >
        <v-icon class="mr-2">mdi-plus</v-icon>
        Add Program Name
      </v-btn>
    </div>

    <!-- Program Names Table -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="programNames"
        :loading="loading"
        class="elevation-0"
      >

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            variant="text"
            size="small"
            @click="editProgramName(item)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            variant="text"
            size="small"
            color="error"
            @click="deleteProgramName(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit Program Name Dialog -->
    <v-dialog
      v-model="dialog"
      max-width="600"
      persistent
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5 font-weight-bold">
            {{ isEditing ? 'Edit Program Name' : 'Add New Program Name' }}
          </span>
          <v-btn
            icon
            variant="text"
            @click="closeDialog"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form ref="form" v-model="formValid">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.name"
                  label="Program Name *"
                  variant="outlined"
                  :rules="[v => !!v || 'Program name is required', v => v.length >= 2 || 'Name must be at least 2 characters']"
                  required
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            variant="text"
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :loading="saving"
            :disabled="!formValid"
            @click="saveProgramName"
          >
            {{ isEditing ? 'Update Program Name' : 'Create Program Name' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/services/api'

const loading = ref(false)
const programNames = ref([])
const dialog = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const formValid = ref(false)
const form = ref(null)

// Form data
const formData = reactive({
  id: null,
  name: ''
})

const headers = [
  { title: 'Program Name', key: 'name' },
  { title: 'Actions', key: 'actions', sortable: false }
]


const fetchProgramNames = async () => {
  loading.value = true
  try {
    const response = await api.get('/admin/program-names')
    programNames.value = response.data.programNames
  } catch (error) {
    console.error('Failed to fetch program names:', error)
    programNames.value = []
  } finally {
    loading.value = false
  }
}


const resetForm = () => {
  formData.id = null
  formData.name = ''
  if (form.value) {
    form.value.resetValidation()
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  resetForm()
  dialog.value = true
}

const editProgramName = (programName) => {
  isEditing.value = true
  resetForm()
  
  // Store the original program name data for editing
  formData.id = programName.id
  formData.name = programName.name
  
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  resetForm()
}

const saveProgramName = async () => {
  if (!form.value.validate()) return
  
  saving.value = true
  try {
    const data = { ...formData }
    
    // Convert empty strings to null for optional fields
    Object.keys(data).forEach(key => {
      if (data[key] === '' || data[key] === undefined) {
        data[key] = null
      }
    })
    
    if (isEditing.value) {
      // Update existing program name
      await api.put(`/admin/program-names/${formData.id}`, data)
    } else {
      // Create new program name - remove id field for creation
      const { id, ...createData } = data
      await api.post('/admin/program-names', createData)
    }
    
    await fetchProgramNames()
    closeDialog()
    
    // Show success message
    const action = isEditing.value ? 'updated' : 'created'
    alert(`Program name ${action} successfully!`)
  } catch (error) {
    console.error('Failed to save program name:', error)
    if (error.response?.data?.error) {
      alert(`Error: ${error.response.data.error}`)
    } else {
      alert('Failed to save program name. Please try again.')
    }
  } finally {
    saving.value = false
  }
}

const deleteProgramName = async (programName) => {
  if (confirm(`Are you sure you want to delete "${programName.name}"?`)) {
    try {
      await api.delete(`/admin/program-names/${programName.id}`)
      await fetchProgramNames()
    } catch (error) {
      console.error('Failed to delete program name:', error)
      alert('Failed to delete program name. Please try again.')
    }
  }
}

onMounted(() => {
  fetchProgramNames()
})
</script>

<style scoped>
.admin-program-names {
  padding: 24px 0;
}

.v-card {
  border-radius: 12px;
}
</style>
