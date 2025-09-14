<template>
  <div class="admin-universities">
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">Manage Universities</h1>
      <v-btn
        color="primary"
        variant="elevated"
        @click="openCreateDialog"
      >
        <v-icon class="mr-2">mdi-plus</v-icon>
        Add University
      </v-btn>
    </div>

    <!-- Filters -->
    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.search"
              label="Search universities"
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.city_id"
              label="City"
              variant="outlined"
              :items="cities"
              item-title="name"
              item-value="id"
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.is_featured"
              label="Featured"
              variant="outlined"
              :items="featuredOptions"
              item-title="label"
              item-value="value"
              clearable
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              color="primary"
              variant="elevated"
              block
              @click="fetchUniversities"
            >
              Search
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Universities Table -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="universities"
        :loading="loading"
        class="elevation-0"
      >
        <template v-slot:item.logo_url="{ item }">
          <v-avatar size="40">
            <v-img
              v-if="item.logo_url"
              :src="item.logo_url"
              :alt="item.name"
            />
            <v-icon v-else color="primary">mdi-school</v-icon>
          </v-avatar>
        </template>

        <template v-slot:item.is_featured="{ item }">
          <v-chip
            :color="item.is_featured ? 'success' : 'grey'"
            size="small"
            variant="flat"
          >
            {{ item.is_featured ? 'Featured' : 'Regular' }}
          </v-chip>
        </template>

        <template v-slot:item.is_active="{ item }">
          <v-chip
            :color="item.is_active ? 'success' : 'error'"
            size="small"
            variant="flat"
          >
            {{ item.is_active ? 'Active' : 'Inactive' }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            variant="text"
            size="small"
            @click="editUniversity(item)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            variant="text"
            size="small"
            color="primary"
            @click="manageImages(item)"
          >
            <v-icon>mdi-image-multiple</v-icon>
          </v-btn>
          <v-btn
            icon
            variant="text"
            size="small"
            color="error"
            @click="deleteUniversity(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog
      v-model="dialog"
      max-width="800"
      scrollable
    >
      <v-card>
        <v-card-title>
          {{ isEditing ? 'Edit University' : 'Add University' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="formValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.name"
                  label="University Name *"
                  variant="outlined"
                  :rules="nameRules"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.english_name"
                  label="English Name"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.city_id"
                  label="City"
                  variant="outlined"
                  :items="cities"
                  item-title="name"
                  item-value="id"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.ranking"
                  label="Ranking"
                  variant="outlined"
                  type="number"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.type"
                  label="Type"
                  variant="outlined"
                  :items="typeOptions"
                  item-title="label"
                  item-value="value"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.website"
                  label="Website"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.phone"
                  label="Phone Number (Optional)"
                  variant="outlined"
                  hint="Contact phone number"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.email"
                  label="Email (Optional)"
                  variant="outlined"
                  type="email"
                  hint="Contact email address"
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model="form.address"
              label="Address (Optional)"
              variant="outlined"
              hint="University address"
            />

            <v-textarea
              v-model="form.description"
              label="Description"
              variant="outlined"
              rows="3"
            />

            <v-textarea
              v-model="form.about"
              label="About (Optional)"
              variant="outlined"
              rows="4"
              hint="Detailed information about the university"
            />

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.logo_url"
                  label="Logo URL (Optional)"
                  variant="outlined"
                  hint="Direct URL to university logo"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.banner_image_url"
                  label="Banner Image URL (Optional)"
                  variant="outlined"
                  hint="Direct URL to banner image"
                />
              </v-col>
            </v-row>

            <v-text-field
              v-model="form.youtube_video_id"
              label="YouTube Video (Optional)"
              variant="outlined"
              hint="YouTube URL or video ID (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ)"
            />

            <v-row>
              <v-col cols="12" md="6">
                <v-checkbox
                  v-model="form.is_featured"
                  label="Featured University *"
                  :rules="[v => v !== null || 'Featured status is required']"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-checkbox
                  v-model="form.is_active"
                  label="Active University"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :loading="saving"
            @click="saveUniversity"
          >
            {{ isEditing ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Image Management Dialog -->
    <v-dialog
      v-model="imageDialog"
      max-width="900"
      scrollable
    >
      <v-card>
        <v-card-title>
          Manage Images - {{ selectedUniversity?.name }}
        </v-card-title>
        <v-card-text>
          <!-- Upload New Image -->
          <v-card class="mb-4" variant="outlined">
            <v-card-title class="text-h6">Upload New Image</v-card-title>
            <v-card-text>
              <v-file-input
                v-model="newImageFile"
                label="Select Image (Max 1MB)"
                variant="outlined"
                accept="image/*"
                prepend-icon="mdi-camera"
                :rules="fileRules"
                @change="handleFileSelect"
              />
              <v-text-field
                v-model="newImageAlt"
                label="Alt Text (Optional)"
                variant="outlined"
                class="mt-2"
              />
              <v-row class="mt-2">
                <v-col cols="6">
                  <v-text-field
                    v-model="newImageSortOrder"
                    label="Sort Order"
                    variant="outlined"
                    type="number"
                  />
                </v-col>
                <v-col cols="6">
                  <v-checkbox
                    v-model="newImageFeatured"
                    label="Featured Image"
                  />
                </v-col>
              </v-row>
              <v-btn
                color="primary"
                variant="elevated"
                :loading="uploadingImage"
                :disabled="!newImageFile"
                @click="uploadImage"
              >
                Upload Image
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- Existing Images -->
          <v-card variant="outlined">
            <v-card-title class="text-h6">Existing Images</v-card-title>
            <v-card-text>
              <div v-if="universityImages.length === 0" class="text-center py-4">
                <v-icon size="48" color="grey">mdi-image-off</v-icon>
                <p class="text-body-1 mt-2">No images uploaded yet</p>
              </div>
              <v-row v-else>
                <v-col
                  v-for="image in universityImages"
                  :key="image.id"
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-card variant="outlined">
                    <v-img
                      :src="image.image_url"
                      height="150"
                      cover
                    />
                    <v-card-text class="pa-2">
                      <div class="d-flex justify-space-between align-center">
                        <v-chip
                          v-if="image.is_featured"
                          color="primary"
                          size="small"
                          variant="flat"
                        >
                          Featured
                        </v-chip>
                        <span class="text-caption">Order: {{ image.sort_order }}</span>
                      </div>
                      <p class="text-caption mt-1">{{ image.alt_text || 'No alt text' }}</p>
                    </v-card-text>
                    <v-card-actions class="pa-2">
                      <v-btn
                        size="small"
                        variant="text"
                        @click="editImage(image)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        size="small"
                        variant="text"
                        color="error"
                        @click="deleteImage(image)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="imageDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Image Dialog -->
    <v-dialog
      v-model="editImageDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title>Edit Image</v-card-title>
        <v-card-text>
          <v-form ref="editImageFormRef" v-model="editImageFormValid">
            <v-text-field
              v-model="editImageForm.alt_text"
              label="Alt Text"
              variant="outlined"
            />
            <v-text-field
              v-model="editImageForm.sort_order"
              label="Sort Order"
              variant="outlined"
              type="number"
            />
            <v-checkbox
              v-model="editImageForm.is_featured"
              label="Featured Image"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            variant="text"
            @click="editImageDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            :loading="updatingImage"
            @click="updateImage"
          >
            Update
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
const saving = ref(false)
const dialog = ref(false)
const isEditing = ref(false)
const formValid = ref(false)
const formRef = ref(null)

// Image management
const imageDialog = ref(false)
const editImageDialog = ref(false)
const uploadingImage = ref(false)
const updatingImage = ref(false)
const editImageFormValid = ref(false)
const editImageFormRef = ref(null)

const universities = ref([])
const cities = ref([])
const universityImages = ref([])
const selectedUniversity = ref(null)

const filters = reactive({
  search: '',
  city_id: null,
  is_featured: null
})

const form = reactive({
  name: '',
  english_name: '',
  description: '',
  about: '',
  website: '',
  phone: '',
  email: '',
  address: '',
  city_id: null,
  ranking: null,
  type: 'public',
  is_featured: false,
  is_active: true,
  logo_url: '',
  banner_image_url: '',
  youtube_video_id: ''
})

// Image upload form
const newImageFile = ref(null)
const newImageAlt = ref('')
const newImageSortOrder = ref(0)
const newImageFeatured = ref(false)

// Edit image form
const editImageForm = reactive({
  id: null,
  alt_text: '',
  sort_order: 0,
  is_featured: false
})

const headers = [
  { title: 'Logo', key: 'logo_url', sortable: false },
  { title: 'Name', key: 'name' },
  { title: 'City', key: 'city_name' },
  { title: 'Type', key: 'type' },
  { title: 'Phone', key: 'phone' },
  { title: 'Email', key: 'email' },
  { title: 'Featured', key: 'is_featured' },
  { title: 'Active', key: 'is_active' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const featuredOptions = [
  { label: 'Featured Only', value: true },
  { label: 'Regular Only', value: false }
]

const typeOptions = [
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
  { label: 'International', value: 'international' }
]

const nameRules = [
  v => !!v || 'Name is required',
  v => v.length >= 2 || 'Name must be at least 2 characters'
]

const fileRules = [
  v => !v || v.size < 1024 * 1024 || 'File size must be less than 1MB'
]

const fetchUniversities = async () => {
  loading.value = true
  try {
    const params = { ...filters }
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key]
      }
    })

    const response = await api.get('/admin/universities', { params })
    universities.value = response.data.universities
  } catch (error) {
    console.error('Failed to fetch universities:', error)
    universities.value = []
  } finally {
    loading.value = false
  }
}

const fetchCities = async () => {
  try {
    const response = await api.get('/cities')
    cities.value = response.data.cities
  } catch (error) {
    console.error('Failed to fetch cities:', error)
  }
}

const fetchUniversityImages = async (universityId) => {
  try {
    const response = await api.get(`/universities/${universityId}/images`)
    universityImages.value = response.data.images
  } catch (error) {
    console.error('Failed to fetch university images:', error)
    universityImages.value = []
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  resetForm()
  dialog.value = true
}

const editUniversity = (university) => {
  isEditing.value = true
  Object.assign(form, university)
  dialog.value = true
}

const resetForm = () => {
  Object.assign(form, {
    name: '',
    english_name: '',
    description: '',
    about: '',
    website: '',
    phone: '',
    email: '',
    address: '',
    city_id: null,
    ranking: null,
    type: 'public',
    is_featured: false,
    is_active: true,
    logo_url: '',
    banner_image_url: '',
    youtube_video_id: ''
  })
}

const saveUniversity = async () => {
  if (!formValid.value) return

  saving.value = true
  try {
    // Process form data and handle empty strings
    const formData = { ...form }
    
    // Convert empty strings to empty strings (not null) for optional fields
    const optionalFields = ['english_name', 'description', 'about', 'website', 'phone', 'email', 'address', 'logo_url', 'banner_image_url', 'youtube_video_id']
    optionalFields.forEach(field => {
      if (formData[field] === null || formData[field] === undefined) {
        formData[field] = ''
      }
    })
    
    // Ensure ranking is a number
    if (formData.ranking) {
      formData.ranking = parseInt(formData.ranking)
    }
    if (formData.city_id) {
      formData.city_id = parseInt(formData.city_id)
    }

    if (isEditing.value) {
      await api.put(`/universities/${form.id}`, formData)
    } else {
      await api.post('/universities', formData)
    }
    dialog.value = false
    fetchUniversities()
  } catch (error) {
    console.error('Failed to save university:', error)
    
    // Show detailed error message
    if (error.response?.data?.details) {
      const errorMessages = error.response.data.details.join('\n')
      alert(`Validation Error:\n${errorMessages}`)
    } else if (error.response?.data?.error) {
      alert(`Error: ${error.response.data.error}`)
    } else {
      alert('Failed to save university. Please check the form and try again.')
    }
  } finally {
    saving.value = false
  }
}

const deleteUniversity = async (university) => {
  if (confirm(`Are you sure you want to delete ${university.name}?`)) {
    try {
      await api.delete(`/universities/${university.id}`)
      fetchUniversities()
    } catch (error) {
      console.error('Failed to delete university:', error)
    }
  }
}

// Image management functions
const manageImages = async (university) => {
  selectedUniversity.value = university
  await fetchUniversityImages(university.id)
  imageDialog.value = true
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Check file size
    if (file.size > 1024 * 1024) {
      alert('File size must be less than 1MB')
      newImageFile.value = null
      return
    }
    newImageFile.value = file
  }
}

const uploadImage = async () => {
  if (!newImageFile.value || !selectedUniversity.value) return

  uploadingImage.value = true
  try {
    const formData = new FormData()
    formData.append('image', newImageFile.value)

    // Upload to R2
    const uploadResponse = await api.post('/uploads/university-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // Add image to university
    const imageData = {
      image_url: uploadResponse.data.imageUrl,
      alt_text: newImageAlt.value,
      sort_order: newImageSortOrder.value,
      is_featured: newImageFeatured.value
    }

    await api.post(`/universities/${selectedUniversity.value.id}/images`, imageData)

    // Reset form
    newImageFile.value = null
    newImageAlt.value = ''
    newImageSortOrder.value = 0
    newImageFeatured.value = false

    // Refresh images
    await fetchUniversityImages(selectedUniversity.value.id)
  } catch (error) {
    console.error('Failed to upload image:', error)
    if (error.response?.data?.error) {
      alert(`Upload failed: ${error.response.data.error}`)
    } else {
      alert('Failed to upload image. Please try again.')
    }
  } finally {
    uploadingImage.value = false
  }
}

const editImage = (image) => {
  Object.assign(editImageForm, image)
  editImageDialog.value = true
}

const updateImage = async () => {
  if (!editImageFormValid.value) return

  updatingImage.value = true
  try {
    await api.put(`/universities/images/${editImageForm.id}`, {
      alt_text: editImageForm.alt_text,
      sort_order: editImageForm.sort_order,
      is_featured: editImageForm.is_featured
    })

    editImageDialog.value = false
    await fetchUniversityImages(selectedUniversity.value.id)
  } catch (error) {
    console.error('Failed to update image:', error)
  } finally {
    updatingImage.value = false
  }
}

const deleteImage = async (image) => {
  if (confirm('Are you sure you want to delete this image?')) {
    try {
      await api.delete(`/universities/images/${image.id}`)
      await fetchUniversityImages(selectedUniversity.value.id)
    } catch (error) {
      console.error('Failed to delete image:', error)
    }
  }
}

onMounted(() => {
  fetchUniversities()
  fetchCities()
})
</script>

<style scoped>
.admin-universities {
  padding: 24px 0;
}
</style>
