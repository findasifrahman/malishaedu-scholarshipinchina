<template>
  <div class="admin-cities">
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold text-primary">MANAGE CITIES</h1>
      <v-btn
        color="primary"
        variant="elevated"
        size="large"
        @click="openCreateDialog"
      >
        <v-icon class="mr-2">mdi-plus</v-icon>
        Add City
      </v-btn>
    </div>

    <!-- Cities Table -->
    <v-card elevation="2" class="rounded-lg">
      <v-data-table
        :headers="headers"
        :items="cities"
        :loading="loading"
        class="elevation-0"
        :items-per-page="10"
      >
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center">
            <v-icon class="mr-2 text-primary">mdi-map-marker</v-icon>
            <span class="font-weight-medium">{{ item.name }}</span>
          </div>
        </template>
        
        <template v-slot:item.province="{ item }">
          <v-chip
            color="primary"
            variant="outlined"
            size="small"
          >
            {{ item.province }}
          </v-chip>
        </template>
        
        <template v-slot:item.description="{ item }">
          <span class="text-body-2 text-grey-darken-1">
            {{ item.description || 'No description' }}
          </span>
        </template>
        
        <template v-slot:item.actions="{ item }">
          <div class="d-flex gap-2">
            <v-btn
              icon
              variant="text"
              size="small"
              color="primary"
              @click="editCity(item)"
            >
              <v-icon>mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="top">Edit City</v-tooltip>
            </v-btn>
            <v-btn
              icon
              variant="text"
              size="small"
              color="error"
              @click="deleteCity(item)"
            >
              <v-icon>mdi-delete</v-icon>
              <v-tooltip activator="parent" location="top">Delete City</v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit City Dialog -->
    <v-dialog
      v-model="dialog"
      max-width="600px"
      persistent
    >
      <v-card class="rounded-lg">
        <v-card-title class="text-h5 font-weight-bold text-primary pa-6 pb-4">
          <v-icon class="mr-2">{{ isEditing ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
          {{ isEditing ? 'Edit City' : 'Add New City' }}
        </v-card-title>
        
        <v-card-text class="pa-6 pt-0">
          <v-form ref="form" v-model="formValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.name"
                  label="City Name"
                  variant="outlined"
                  :rules="nameRules"
                  required
                  prepend-inner-icon="mdi-city"
                />
              </v-col>
              
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.province"
                  label="Province"
                  variant="outlined"
                  :rules="provinceRules"
                  required
                  prepend-inner-icon="mdi-map"
                />
              </v-col>
              
              <v-col cols="12">
                <v-textarea
                  v-model="formData.description"
                  label="Description"
                  variant="outlined"
                  rows="3"
                  prepend-inner-icon="mdi-text"
                  placeholder="Enter a brief description of the city..."
                />
              </v-col>
              
              <v-col cols="12">
                <v-text-field
                  v-model="formData.image_url"
                  label="Image URL"
                  variant="outlined"
                  prepend-inner-icon="mdi-image"
                  placeholder="https://example.com/city-image.jpg"
                  :rules="imageUrlRules"
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
            @click="saveCity"
          >
            <v-icon class="mr-2">{{ isEditing ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
            {{ isEditing ? 'Update City' : 'Create City' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog
      v-model="deleteDialog"
      max-width="400px"
    >
      <v-card class="rounded-lg">
        <v-card-title class="text-h6 font-weight-bold text-error">
          <v-icon class="mr-2">mdi-delete-alert</v-icon>
          Confirm Delete
        </v-card-title>
        
        <v-card-text class="pa-6 pt-4">
          <p class="text-body-1">
            Are you sure you want to delete <strong>{{ cityToDelete?.name }}</strong>?
          </p>
          <p class="text-body-2 text-grey-darken-1 mt-2">
            This action cannot be undone.
          </p>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            variant="text"
            @click="deleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            :loading="deleting"
            @click="confirmDelete"
          >
            <v-icon class="mr-2">mdi-delete</v-icon>
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/services/api'

const toast = useToast()

// State
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const cities = ref([])
const dialog = ref(false)
const deleteDialog = ref(false)
const isEditing = ref(false)
const formValid = ref(false)
const cityToDelete = ref(null)

// Form data
const formData = reactive({
  name: '',
  province: '',
  description: '',
  image_url: ''
})

// Form validation rules
const nameRules = [
  v => !!v || 'City name is required',
  v => (v && v.length >= 2) || 'City name must be at least 2 characters',
  v => (v && v.length <= 100) || 'City name must be less than 100 characters'
]

const provinceRules = [
  v => !!v || 'Province is required',
  v => (v && v.length >= 2) || 'Province must be at least 2 characters',
  v => (v && v.length <= 100) || 'Province must be less than 100 characters'
]

const imageUrlRules = [
  v => !v || v === '' || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v) || 'Please enter a valid image URL'
]

// Table headers
const headers = [
  { title: 'City Name', key: 'name', sortable: true },
  { title: 'Province', key: 'province', sortable: true },
  { title: 'Description', key: 'description', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false, width: '120px' }
]

// Methods
const fetchCities = async () => {
  loading.value = true
  try {
    const response = await api.get('/cities')
    cities.value = response.data.cities
  } catch (error) {
    console.error('Failed to fetch cities:', error)
    toast.error('Failed to fetch cities')
    cities.value = []
  } finally {
    loading.value = false
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  resetForm()
  dialog.value = true
}

const editCity = (city) => {
  isEditing.value = true
  formData.name = city.name
  formData.province = city.province
  formData.description = city.description || ''
  formData.image_url = city.image_url || ''
  formData.id = city.id
  dialog.value = true
}

const resetForm = () => {
  formData.name = ''
  formData.province = ''
  formData.description = ''
  formData.image_url = ''
  delete formData.id
}

const closeDialog = () => {
  dialog.value = false
  resetForm()
}

const saveCity = async () => {
  if (!formValid.value) return
  
  saving.value = true
  try {
    const cityData = {
      name: formData.name.trim(),
      province: formData.province.trim(),
      description: formData.description.trim() || '',
      image_url: formData.image_url.trim() || ''
    }

    if (isEditing.value) {
      await api.put(`/cities/${formData.id}`, cityData)
      toast.success('City updated successfully!')
    } else {
      await api.post('/cities', cityData)
      toast.success('City created successfully!')
    }
    
    closeDialog()
    fetchCities()
  } catch (error) {
    console.error('Failed to save city:', error)
    if (error.response?.data?.details) {
      toast.error(`Validation error: ${error.response.data.details.join(', ')}`)
    } else {
      toast.error('Failed to save city. Please try again.')
    }
  } finally {
    saving.value = false
  }
}

const deleteCity = (city) => {
  cityToDelete.value = city
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!cityToDelete.value) return
  
  deleting.value = true
  try {
    await api.delete(`/cities/${cityToDelete.value.id}`)
    toast.success('City deleted successfully!')
    deleteDialog.value = false
    cityToDelete.value = null
    fetchCities()
  } catch (error) {
    console.error('Failed to delete city:', error)
    toast.error('Failed to delete city. Please try again.')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchCities()
})
</script>

<style scoped>
.admin-cities {
  padding: 24px 0;
  background-color: #fafafa;
  min-height: 100vh;
}

.rounded-lg {
  border-radius: 12px;
}

.gap-2 {
  gap: 8px;
}

.v-data-table {
  background: transparent;
}

.v-data-table :deep(.v-data-table__wrapper) {
  border-radius: 12px;
}

.v-card {
  border-radius: 12px;
}

.v-btn {
  border-radius: 8px;
}

.v-text-field :deep(.v-field) {
  border-radius: 8px;
}

.v-textarea :deep(.v-field) {
  border-radius: 8px;
}

/* Custom styling for better UX */
.v-dialog :deep(.v-card-title) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.v-chip {
  border-radius: 16px;
}

/* Loading states */
.v-progress-circular {
  margin: 0 auto;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .admin-cities {
    padding: 16px 0;
  }
  
  .v-card-title {
    font-size: 1.25rem !important;
  }
}
</style>
