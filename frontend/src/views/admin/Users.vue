<template>
  <div class="admin-users">
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">Manage Users</h1>
    </div>

    <!-- Filters -->
    <v-card class="mb-6" elevation="2">
      <v-card-title class="text-h6 font-weight-bold">
        <v-icon class="mr-2" color="primary">mdi-filter</v-icon>
        Filters
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.email"
              label="Search by Email"
              prepend-inner-icon="mdi-email"
              variant="outlined"
              density="compact"
              clearable
              @input="debouncedSearch"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="filters.name"
              label="Search by Name"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              density="compact"
              clearable
              @input="debouncedSearch"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="filters.role"
              label="Filter by Role"
              :items="roleOptions"
              variant="outlined"
              density="compact"
              clearable
              @update:model-value="fetchUsers"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="filters.dateFrom"
              label="Registration Date From"
              type="date"
              variant="outlined"
              density="compact"
              @update:model-value="fetchUsers"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="filters.dateTo"
              label="Registration Date To"
              type="date"
              variant="outlined"
              density="compact"
              @update:model-value="fetchUsers"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn
              color="primary"
              variant="outlined"
              @click="clearFilters"
            >
              <v-icon class="mr-2">mdi-refresh</v-icon>
              Clear Filters
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Users Table -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="users"
        :loading="loading"
        :items-per-page="itemsPerPage"
        :server-items-length="totalUsers"
        @update:page="onPageChange"
        @update:items-per-page="onItemsPerPageChange"
        class="elevation-0"
      >
        <template v-slot:item.role="{ item }">
          <v-chip
            :color="item.role === 'admin' ? 'error' : 'primary'"
            size="small"
            variant="flat"
          >
            {{ item.role === 'admin' ? 'Admin' : 'Student' }}
          </v-chip>
        </template>

        <template v-slot:item.is_verified="{ item }">
          <v-chip
            :color="item.is_verified ? 'success' : 'warning'"
            size="small"
            variant="flat"
          >
            {{ item.is_verified ? 'Verified' : 'Pending' }}
          </v-chip>
        </template>

        <template v-slot:item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            color="primary"
            variant="outlined"
            size="small"
            @click="viewUserDetails(item)"
            class="mr-2"
          >
            <v-icon class="mr-1">mdi-eye</v-icon>
            Details
          </v-btn>
          <v-btn
            icon
            variant="text"
            size="small"
            @click="editUser(item)"
            class="mr-1"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="item.role !== 'admin'"
            icon
            variant="text"
            size="small"
            color="error"
            @click="deleteUser(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- User Details Modal (Reused from AdminDashboard) -->
    <v-dialog v-model="showUserDetailsModal" max-width="800px">
      <v-card>
        <v-card-title class="text-h5 font-weight-bold">
          <v-icon class="mr-2" color="primary">mdi-account-details</v-icon>
          Student Details
        </v-card-title>
        <v-card-text>
          <div v-if="selectedUser" class="user-details">
            <!-- Basic Information -->
            <v-row class="mb-4">
              <v-col cols="12">
                <h3 class="text-h6 font-weight-bold mb-3">
                  <v-icon class="mr-2">mdi-account</v-icon>
                  Basic Information
                </h3>
                <v-card variant="outlined" class="pa-4">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <p><strong>Name:</strong> {{ selectedUser.first_name }} {{ selectedUser.last_name }}</p>
                      <p><strong>Email:</strong> {{ selectedUser.email }}</p>
                      <p><strong>Phone:</strong> {{ selectedUser.phone || 'Not provided' }}</p>
                      <p><strong>Nationality:</strong> {{ selectedUser.nationality || 'Not provided' }}</p>
                      <p><strong>Username:</strong> {{ selectedUser.username || 'Not provided' }}</p>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <p><strong>Date of Birth:</strong> {{ selectedUser.date_of_birth ? formatDate(selectedUser.date_of_birth) : 'Not provided' }}</p>
                      <p><strong>Passport Number:</strong> {{ selectedUser.passport_number || 'Not provided' }}</p>
                      <p><strong>Role:</strong> {{ selectedUser.role }}</p>
                      <p><strong>Verified:</strong> {{ selectedUser.is_verified ? 'Yes' : 'No' }}</p>
                      <p><strong>Registered:</strong> {{ formatDate(selectedUser.created_at) }}</p>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>

            <!-- Address Information -->
            <v-row class="mb-4" v-if="selectedUser.address || selectedUser.city">
              <v-col cols="12">
                <h3 class="text-h6 font-weight-bold mb-3">
                  <v-icon class="mr-2">mdi-map-marker</v-icon>
                  Address Information
                </h3>
                <v-card variant="outlined" class="pa-4">
                  <p><strong>Address:</strong> {{ selectedUser.address || 'Not provided' }}</p>
                  <p><strong>City:</strong> {{ selectedUser.city || 'Not provided' }}</p>
                </v-card>
              </v-col>
            </v-row>

            <!-- Documents Uploaded -->
            <v-row class="mb-4">
              <v-col cols="12">
                <h3 class="text-h6 font-weight-bold mb-3">
                  <v-icon class="mr-2">mdi-file-document</v-icon>
                  Documents Uploaded
                </h3>
                <v-card variant="outlined" class="pa-4">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <div class="d-flex align-center mb-2">
                        <v-icon :color="selectedUser.profile_image_url ? 'success' : 'grey'" class="mr-2">mdi-account</v-icon>
                        <span>Profile Image: {{ selectedUser.profile_image_url ? 'Uploaded' : 'Not uploaded' }}</span>
                      </div>
                      <div class="d-flex align-center mb-2">
                        <v-icon :color="selectedUser.passport_image_url ? 'success' : 'grey'" class="mr-2">mdi-passport</v-icon>
                        <span>Passport Photo: {{ selectedUser.passport_image_url ? 'Uploaded' : 'Not uploaded' }}</span>
                      </div>
                      <div class="d-flex align-center mb-2">
                        <v-icon :color="selectedUser.passport_scanned_url ? 'success' : 'grey'" class="mr-2">mdi-file-document</v-icon>
                        <span>Passport Scanned: {{ selectedUser.passport_scanned_url ? 'Uploaded' : 'Not uploaded' }}</span>
                      </div>
                      <div class="d-flex align-center mb-2">
                        <v-icon :color="selectedUser.academic_transcripts_url ? 'success' : 'grey'" class="mr-2">mdi-school</v-icon>
                        <span>Academic Transcripts: {{ selectedUser.academic_transcripts_url ? 'Uploaded' : 'Not uploaded' }}</span>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="d-flex align-center mb-2">
                        <v-icon :color="selectedUser.highest_degree_diploma_url ? 'success' : 'grey'" class="mr-2">mdi-certificate</v-icon>
                        <span>Highest Degree Diploma: {{ selectedUser.highest_degree_diploma_url ? 'Uploaded' : 'Not uploaded' }}</span>
                      </div>
                      <div class="d-flex align-center mb-2">
                        <v-icon :color="selectedUser.physical_examination_form_url ? 'success' : 'grey'" class="mr-2">mdi-hospital</v-icon>
                        <span>Physical Examination Form: {{ selectedUser.physical_examination_form_url ? 'Uploaded' : 'Not uploaded' }}</span>
                      </div>
                      <div class="d-flex align-center mb-2">
                        <v-icon :color="selectedUser.police_clearance_url ? 'success' : 'grey'" class="mr-2">mdi-shield-check</v-icon>
                        <span>Police Clearance: {{ selectedUser.police_clearance_url ? 'Uploaded' : 'Not uploaded' }}</span>
                      </div>
                      <div class="d-flex align-center mb-2">
                        <v-icon :color="selectedUser.chinese_language_certificate_url ? 'success' : 'grey'" class="mr-2">mdi-translate</v-icon>
                        <span>Chinese Language Certificate: {{ selectedUser.chinese_language_certificate_url ? 'Uploaded' : 'Not uploaded' }}</span>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <div class="d-flex align-center mb-2">
                        <v-icon :color="selectedUser.application_form_url ? 'success' : 'grey'" class="mr-2">mdi-file-edit</v-icon>
                        <span>Application Form: {{ selectedUser.application_form_url ? 'Uploaded' : 'Not uploaded' }}</span>
                      </div>
                      <div class="d-flex align-center mb-2">
                        <v-icon :color="selectedUser.recommendation_letter_1_url ? 'success' : 'grey'" class="mr-2">mdi-email</v-icon>
                        <span>Recommendation Letter 1: {{ selectedUser.recommendation_letter_1_url ? 'Uploaded' : 'Not uploaded' }}</span>
                      </div>
                      <div class="d-flex align-center mb-2">
                        <v-icon :color="selectedUser.recommendation_letter_2_url ? 'success' : 'grey'" class="mr-2">mdi-email</v-icon>
                        <span>Recommendation Letter 2: {{ selectedUser.recommendation_letter_2_url ? 'Uploaded' : 'Not uploaded' }}</span>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="d-flex align-center mb-2">
                        <v-icon :color="selectedUser.guarantee_letter_url ? 'success' : 'grey'" class="mr-2">mdi-file-check</v-icon>
                        <span>Guarantee Letter: {{ selectedUser.guarantee_letter_url ? 'Uploaded' : 'Not uploaded' }}</span>
                      </div>
                      <div class="d-flex align-center mb-2">
                        <v-icon :color="selectedUser.residence_permit_url ? 'success' : 'grey'" class="mr-2">mdi-home</v-icon>
                        <span>Residence Permit: {{ selectedUser.residence_permit_url ? 'Uploaded' : 'Not uploaded' }}</span>
                      </div>
                      <div class="d-flex align-center mb-2">
                        <v-icon :color="selectedUser.study_certificate_china_url ? 'success' : 'grey'" class="mr-2">mdi-school</v-icon>
                        <span>Study Certificate China: {{ selectedUser.study_certificate_china_url ? 'Uploaded' : 'Not uploaded' }}</span>
                      </div>
                    </v-col>
                  </v-row>
                  <v-row v-if="selectedUser.others_1_url || selectedUser.others_2_url">
                    <v-col cols="12" sm="6">
                      <div class="d-flex align-center mb-2">
                        <v-icon :color="selectedUser.others_1_url ? 'success' : 'grey'" class="mr-2">mdi-file-plus</v-icon>
                        <span>Other Document 1: {{ selectedUser.others_1_url ? 'Uploaded' : 'Not uploaded' }}</span>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="d-flex align-center mb-2">
                        <v-icon :color="selectedUser.others_2_url ? 'success' : 'grey'" class="mr-2">mdi-file-plus</v-icon>
                        <span>Other Document 2: {{ selectedUser.others_2_url ? 'Uploaded' : 'Not uploaded' }}</span>
                      </div>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>

            <!-- Applied Programs -->
            <v-row class="mb-4">
              <v-col cols="12">
                <h3 class="text-h6 font-weight-bold mb-3">
                  <v-icon class="mr-2">mdi-school</v-icon>
                  Applied Programs ({{ userPrograms.length }})
                </h3>
                <v-card variant="outlined" class="pa-4">
                  <div v-if="userPrograms.length > 0">
                    <v-list>
                      <v-list-item
                        v-for="program in userPrograms"
                        :key="program.id"
                        class="mb-2"
                      >
                        <template v-slot:prepend>
                          <v-icon color="primary">mdi-book</v-icon>
                        </template>
                        <v-list-item-title class="font-weight-medium">
                          {{ program.program_name?.name || 'Unknown Program' }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ program.university?.name || 'Unknown University' }} - 
                          {{ program.degree_level }} ({{ program.language }})
                        </v-list-item-subtitle>
                        <template v-slot:append>
                          <v-chip 
                            :color="program.status === 'applied' ? 'primary' : 'success'"
                            size="small"
                          >
                            {{ program.status }}
                          </v-chip>
                        </template>
                      </v-list-item>
                    </v-list>
                  </div>
                  <div v-else class="text-center py-4">
                    <v-icon size="48" color="grey" class="mb-2">mdi-school-off</v-icon>
                    <p class="text-grey">No programs applied yet</p>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showUserDetailsModal = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import api from '@/services/api'

const loading = ref(false)
const users = ref([])
const totalUsers = ref(0)
const currentPage = ref(1)
const itemsPerPage = ref(20)

// User details modal
const showUserDetailsModal = ref(false)
const selectedUser = ref(null)
const userPrograms = ref([])

// Filters
const filters = reactive({
  email: '',
  name: '',
  role: '',
  dateFrom: '',
  dateTo: ''
})

const roleOptions = [
  { title: 'Student', value: 'student' },
  { title: 'Admin', value: 'admin' }
]

const headers = [
  { title: 'Name', key: 'first_name' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Verified', key: 'is_verified' },
  { title: 'Registered', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Debounced search
let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchUsers()
  }, 500)
}

const fetchUsers = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: currentPage.value,
      limit: itemsPerPage.value
    })

    // Add filters
    if (filters.email) params.append('email', filters.email)
    if (filters.name) params.append('name', filters.name)
    if (filters.role) params.append('role', filters.role)
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom)
    if (filters.dateTo) params.append('dateTo', filters.dateTo)

    const response = await api.get(`/admin/users?${params.toString()}`)
    users.value = response.data.users
    totalUsers.value = response.data.total
  } catch (error) {
    console.error('Failed to fetch users:', error)
    users.value = []
    totalUsers.value = 0
  } finally {
    loading.value = false
  }
}

const onPageChange = (page) => {
  currentPage.value = page
  fetchUsers()
}

const onItemsPerPageChange = (itemsPerPageValue) => {
  itemsPerPage.value = itemsPerPageValue
  currentPage.value = 1
  fetchUsers()
}

const clearFilters = () => {
  filters.email = ''
  filters.name = ''
  filters.role = ''
  filters.dateFrom = ''
  filters.dateTo = ''
  currentPage.value = 1
  fetchUsers()
}

const viewUserDetails = async (user) => {
  try {
    selectedUser.value = user
    showUserDetailsModal.value = true
    
    // Fetch user's applied programs
    const response = await api.get(`/admin/users/${user.id}/programs`)
    userPrograms.value = response.data.programs || []
  } catch (error) {
    console.error('Failed to fetch user details:', error)
    userPrograms.value = []
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const editUser = (user) => {
  // TODO: Implement edit user dialog
  console.log('Edit user:', user)
}

const deleteUser = async (user) => {
  if (confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) {
    try {
      await api.delete(`/admin/users/${user.id}`)
      fetchUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.admin-users {
  padding: 24px 0;
}
</style>
