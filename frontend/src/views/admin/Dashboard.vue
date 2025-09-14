<template>
  <div class="admin-dashboard-content">
    <h1 class="text-h4 font-weight-bold mb-6">Admin Dashboard</h1>
    
    <!-- Statistics Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-icon size="40" color="primary" class="mr-4">mdi-account-group</v-icon>
            <div>
              <h3 class="text-h4 font-weight-bold">{{ stats.totals?.totalUsers || 0 }}</h3>
              <p class="text-body-2 text-grey-darken-1">Total Students</p>
            </div>
          </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-icon size="40" color="secondary" class="mr-4">mdi-school</v-icon>
            <div>
              <h3 class="text-h4 font-weight-bold">{{ stats.totals?.totalUniversities || 0 }}</h3>
              <p class="text-body-2 text-grey-darken-1">Universities</p>
            </div>
          </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-icon size="40" color="success" class="mr-4">mdi-book</v-icon>
            <div>
              <h3 class="text-h4 font-weight-bold">{{ stats.totals?.totalPrograms || 0 }}</h3>
              <p class="text-body-2 text-grey-darken-1">Programs</p>
            </div>
          </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-icon size="40" color="info" class="mr-4">mdi-city</v-icon>
            <div>
              <h3 class="text-h4 font-weight-bold">{{ stats.totals?.totalCities || 0 }}</h3>
              <p class="text-body-2 text-grey-darken-1">Cities</p>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Most Applied Program & University Statistics -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center mb-3">
            <v-icon size="40" color="primary" class="mr-3">mdi-trophy</v-icon>
            <h3 class="text-h6 font-weight-bold">Most Applied Program</h3>
          </div>
          <p class="text-caption text-grey-darken-1 mb-3">Today & Yesterday</p>
          <div v-if="mostAppliedProgram">
            <div class="mb-2">
              <h4 class="text-h5 font-weight-bold text-primary">{{ mostAppliedProgram.count }}</h4>
              <p class="text-body-2 text-grey-darken-1 mb-1">Applications</p>
            </div>
            <div class="mb-2">
              <p class="text-body-1 font-weight-medium">{{ mostAppliedProgram.program_name }}</p>
              <p class="text-body-2 text-grey-darken-1">Program ID: {{ mostAppliedProgram.program_id }}</p>
            </div>
            <div>
              <p class="text-body-2">
                <v-icon size="16" class="mr-1">mdi-school</v-icon>
                {{ mostAppliedProgram.university_name }}
              </p>
            </div>
          </div>
          <div v-else class="text-center py-4">
            <v-icon size="48" color="grey" class="mb-2">mdi-school-off</v-icon>
            <p class="text-grey">No applications yet</p>
          </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <div class="d-flex align-center mb-3">
            <v-icon size="40" color="success" class="mr-3">mdi-school</v-icon>
            <h3 class="text-h6 font-weight-bold">Most Applied University</h3>
          </div>
          <p class="text-caption text-grey-darken-1 mb-3">Today & Yesterday</p>
          <div v-if="mostAppliedUniversity">
            <div class="mb-2">
              <h4 class="text-h5 font-weight-bold text-success">{{ mostAppliedUniversity.count }}</h4>
              <p class="text-body-2 text-grey-darken-1 mb-1">Applications</p>
            </div>
            <div class="mb-2">
              <p class="text-body-1 font-weight-medium">{{ mostAppliedUniversity.university_name }}</p>
            </div>
            <div>
              <p class="text-body-2">
                <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
                {{ mostAppliedUniversity.city }}
              </p>
            </div>
          </div>
          <div v-else class="text-center py-4">
            <v-icon size="48" color="grey" class="mb-2">mdi-school-off</v-icon>
            <p class="text-grey">No applications yet</p>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- User Registration Statistics -->
    <v-card class="mb-6" elevation="2">
      <v-card-title class="text-h6 font-weight-bold">
        <v-icon class="mr-2" color="primary">mdi-chart-line</v-icon>
        Student Registration Statistics
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-card 
              class="stat-card today-card" 
              elevation="1"
              :class="{ 'active-filter': activeFilter === 'today' }"
              @click="filterUsers('today')"
              style="cursor: pointer;"
            >
              <div class="text-center pa-4">
                <v-icon size="48" color="primary" class="mb-2">mdi-calendar-today</v-icon>
                <h3 class="text-h4 font-weight-bold text-primary">{{ stats.userStats?.today || 0 }}</h3>
                <p class="text-body-2 text-grey-darken-1">Today</p>
                <v-chip 
                  v-if="activeFilter === 'today'" 
                  color="primary" 
                  size="small" 
                  class="mt-2"
                >
                  Active Filter
                </v-chip>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card 
              class="stat-card yesterday-card" 
              elevation="1"
              :class="{ 'active-filter': activeFilter === 'yesterday' }"
              @click="filterUsers('yesterday')"
              style="cursor: pointer;"
            >
              <div class="text-center pa-4">
                <v-icon size="48" color="secondary" class="mb-2">mdi-calendar-minus</v-icon>
                <h3 class="text-h4 font-weight-bold text-secondary">{{ stats.userStats?.yesterday || 0 }}</h3>
                <p class="text-body-2 text-grey-darken-1">Yesterday</p>
                <v-chip 
                  v-if="activeFilter === 'yesterday'" 
                  color="secondary" 
                  size="small" 
                  class="mt-2"
                >
                  Active Filter
                </v-chip>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card 
              class="stat-card week-card" 
              elevation="1"
              :class="{ 'active-filter': activeFilter === 'lastWeek' }"
              @click="filterUsers('lastWeek')"
              style="cursor: pointer;"
            >
              <div class="text-center pa-4">
                <v-icon size="48" color="success" class="mb-2">mdi-calendar-week</v-icon>
                <h3 class="text-h4 font-weight-bold text-success">{{ stats.userStats?.lastWeek || 0 }}</h3>
                <p class="text-body-2 text-grey-darken-1">Last Week</p>
                <v-chip 
                  v-if="activeFilter === 'lastWeek'" 
                  color="success" 
                  size="small" 
                  class="mt-2"
                >
                  Active Filter
                </v-chip>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card 
              class="stat-card month-card" 
              elevation="1"
              :class="{ 'active-filter': activeFilter === 'thisMonth' }"
              @click="filterUsers('thisMonth')"
              style="cursor: pointer;"
            >
              <div class="text-center pa-4">
                <v-icon size="48" color="info" class="mb-2">mdi-calendar-month</v-icon>
                <h3 class="text-h4 font-weight-bold text-info">{{ stats.userStats?.thisMonth || 0 }}</h3>
                <p class="text-body-2 text-grey-darken-1">This Month</p>
                <v-chip 
                  v-if="activeFilter === 'thisMonth'" 
                  color="info" 
                  size="small" 
                  class="mt-2"
                >
                  Active Filter
                </v-chip>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Recent Users -->
    <v-card class="mb-6" elevation="2">
      <v-card-title class="text-h6 font-weight-bold">
        <v-icon class="mr-2" color="primary">mdi-account-group</v-icon>
        Recent User Registrations
        <v-spacer />
        <div v-if="activeFilter" class="d-flex align-center">
          <v-chip 
            :color="getFilterColor(activeFilter)" 
            size="small" 
            class="mr-2"
          >
            <v-icon class="mr-1">{{ getFilterIcon(activeFilter) }}</v-icon>
            {{ getFilterLabel(activeFilter) }}
          </v-chip>
          <v-btn
            color="grey"
            variant="outlined"
            size="small"
            @click="clearFilter"
          >
            <v-icon class="mr-1">mdi-close</v-icon>
            Clear Filter
          </v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="userHeaders"
          :items="filteredUsers"
          :loading="loading"
          class="elevation-0"
          :items-per-page="20"
        >
          <template v-slot:item.created_at="{ item }">
            {{ formatDate(item.created_at) }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              color="primary"
              variant="outlined"
              size="small"
              @click="viewUserDetails(item)"
            >
              <v-icon class="mr-1">mdi-eye</v-icon>
              Details
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Quick Actions -->
  

    <!-- Add University Dialog -->
    <v-dialog v-model="showAddUniversityDialog" max-width="600px">
      <v-card>
        <v-card-title>Add New University</v-card-title>
        <v-card-text>
          <v-form ref="universityFormRef" v-model="universityFormValid">
            <v-text-field
              v-model="universityForm.name"
              label="University Name"
              :rules="[v => !!v || 'Name is required']"
              required
            />
            <v-text-field
              v-model="universityForm.english_name"
              label="English Name"
            />
            <v-textarea
              v-model="universityForm.description"
              label="Description"
            />
            <v-text-field
              v-model="universityForm.website"
              label="Website URL"
            />
            <v-text-field
              v-model="universityForm.address"
              label="Address"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showAddUniversityDialog = false">Cancel</v-btn>
          <v-btn 
            color="primary" 
            @click="addUniversity"
            :loading="addingUniversity"
            :disabled="!universityFormValid"
          >
            Add University
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Program Dialog -->
    <v-dialog v-model="showAddProgramDialog" max-width="600px">
      <v-card>
        <v-card-title>Add New Program</v-card-title>
        <v-card-text>
          <v-form ref="programFormRef" v-model="programFormValid">
            <v-text-field
              v-model="programForm.name"
              label="Program Name"
              :rules="[v => !!v || 'Name is required']"
              required
            />
            <v-text-field
              v-model="programForm.english_name"
              label="English Name"
            />
            <v-select
              v-model="programForm.degree_level"
              label="Degree Level"
              :items="['bachelor', 'master', 'phd', 'language', 'preparatory']"
              :rules="[v => !!v || 'Degree level is required']"
              required
            />
            <v-select
              v-model="programForm.language"
              label="Language"
              :items="['chinese', 'english', 'bilingual']"
              :rules="[v => !!v || 'Language is required']"
              required
            />
            <v-text-field
              v-model="programForm.tuition_fee"
              label="Tuition Fee"
              type="number"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showAddProgramDialog = false">Cancel</v-btn>
          <v-btn 
            color="primary" 
            @click="addProgram"
            :loading="addingProgram"
            :disabled="!programFormValid"
          >
            Add Program
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add City Dialog -->
    <v-dialog v-model="showAddCityDialog" max-width="600px">
      <v-card>
        <v-card-title>Add New City</v-card-title>
        <v-card-text>
          <v-form ref="cityFormRef" v-model="cityFormValid">
            <v-text-field
              v-model="cityForm.name"
              label="City Name"
              :rules="[v => !!v || 'Name is required']"
              required
            />
            <v-text-field
              v-model="cityForm.province"
              label="Province"
              :rules="[v => !!v || 'Province is required']"
              required
            />
            <v-textarea
              v-model="cityForm.description"
              label="Description"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showAddCityDialog = false">Cancel</v-btn>
          <v-btn 
            color="primary" 
            @click="addCity"
            :loading="addingCity"
            :disabled="!cityFormValid"
          >
            Add City
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- User Details Modal -->
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
            <v-row class="mb-4">
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
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import api from '@/services/api'

const toast = useToast()
const loading = ref(true)
const stats = ref({
  totals: {
    totalUsers: 0,
    totalUniversities: 0,
    totalPrograms: 0,
    totalCities: 0
  },
  userStats: {
    today: 0,
    yesterday: 0,
    thisWeek: 0,
    thisMonth: 0
  }
})
const recentUsers = ref([])
const filteredUsers = ref([])
const activeFilter = ref(null)
const mostAppliedProgram = ref(null)
const mostAppliedUniversity = ref(null)

// User details modal
const showUserDetailsModal = ref(false)
const selectedUser = ref(null)
const userPrograms = ref([])

// Dialog states
const showAddUniversityDialog = ref(false)
const showAddProgramDialog = ref(false)
const showAddCityDialog = ref(false)

// Form states
const universityFormValid = ref(false)
const programFormValid = ref(false)
const cityFormValid = ref(false)

const addingUniversity = ref(false)
const addingProgram = ref(false)
const addingCity = ref(false)

// Form data
const universityForm = reactive({
  name: '',
  english_name: '',
  description: '',
  website: '',
  address: ''
})

const programForm = reactive({
  name: '',
  english_name: '',
  degree_level: '',
  language: '',
  tuition_fee: ''
})

const cityForm = reactive({
  name: '',
  province: '',
  description: ''
})

const userHeaders = [
  { title: 'Name', key: 'first_name' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Registered', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const fetchDashboardData = async () => {
  try {
    const response = await api.get('/admin/dashboard')
    stats.value = response.data
    recentUsers.value = response.data.recentUsers.slice(0, 20) // Limit to 20 entries
    filteredUsers.value = [...recentUsers.value] // Initialize filtered users
    mostAppliedProgram.value = response.data.mostAppliedProgram
    mostAppliedUniversity.value = response.data.mostAppliedUniversity
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    toast.error('Failed to load dashboard data')
  } finally {
    loading.value = false
  }
}

const filterUsers = (filterType) => {
  activeFilter.value = filterType
  
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  // Last week: from 7 days ago to 1 day ago
  const lastWeekStart = new Date(today)
  lastWeekStart.setDate(today.getDate() - 7)
  const lastWeekEnd = new Date(today)
  lastWeekEnd.setDate(today.getDate() - 1)
  
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  
  filteredUsers.value = recentUsers.value.filter(user => {
    const userDate = new Date(user.created_at)
    
    switch (filterType) {
      case 'today':
        return userDate.toDateString() === today.toDateString()
      case 'yesterday':
        return userDate.toDateString() === yesterday.toDateString()
      case 'lastWeek':
        return userDate >= lastWeekStart && userDate <= lastWeekEnd
      case 'thisMonth':
        return userDate >= startOfMonth
      default:
        return true
    }
  })
}

const clearFilter = () => {
  activeFilter.value = null
  filteredUsers.value = [...recentUsers.value]
}

const getFilterColor = (filterType) => {
  switch (filterType) {
    case 'today': return 'primary'
    case 'yesterday': return 'secondary'
    case 'lastWeek': return 'success'
    case 'thisMonth': return 'info'
    default: return 'grey'
  }
}

const getFilterIcon = (filterType) => {
  switch (filterType) {
    case 'today': return 'mdi-calendar-today'
    case 'yesterday': return 'mdi-calendar-minus'
    case 'lastWeek': return 'mdi-calendar-week'
    case 'thisMonth': return 'mdi-calendar-month'
    default: return 'mdi-filter'
  }
}

const getFilterLabel = (filterType) => {
  switch (filterType) {
    case 'today': return 'Today'
    case 'yesterday': return 'Yesterday'
    case 'lastWeek': return 'Last Week'
    case 'thisMonth': return 'This Month'
    default: return 'Filter'
  }
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
    toast.error('Failed to load user details')
    userPrograms.value = []
  }
}

const addUniversity = async () => {
  addingUniversity.value = true
  try {
    await api.post('/admin/universities', universityForm)
    toast.success('University added successfully!')
    showAddUniversityDialog.value = false
    resetUniversityForm()
    fetchDashboardData() // Refresh stats
  } catch (error) {
    console.error('Failed to add university:', error)
    toast.error('Failed to add university')
  } finally {
    addingUniversity.value = false
  }
}

const addProgram = async () => {
  addingProgram.value = true
  try {
    await api.post('/admin/programs', programForm)
    toast.success('Program added successfully!')
    showAddProgramDialog.value = false
    resetProgramForm()
    fetchDashboardData() // Refresh stats
  } catch (error) {
    console.error('Failed to add program:', error)
    toast.error('Failed to add program')
  } finally {
    addingProgram.value = false
  }
}

const addCity = async () => {
  addingCity.value = true
  try {
    await api.post('/admin/cities', cityForm)
    toast.success('City added successfully!')
    showAddCityDialog.value = false
    resetCityForm()
    fetchDashboardData() // Refresh stats
  } catch (error) {
    console.error('Failed to add city:', error)
    toast.error('Failed to add city')
  } finally {
    addingCity.value = false
  }
}

const resetUniversityForm = () => {
  Object.assign(universityForm, {
    name: '',
    english_name: '',
    description: '',
    website: '',
    address: ''
  })
}

const resetProgramForm = () => {
  Object.assign(programForm, {
    name: '',
    english_name: '',
    degree_level: '',
    language: '',
    tuition_fee: ''
  })
}

const resetCityForm = () => {
  Object.assign(cityForm, {
    name: '',
    province: '',
    description: ''
  })
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.admin-dashboard-content {
  padding: 24px 0;
}

.stat-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-card.active-filter {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.today-card:hover,
.today-card.active-filter {
  border-color: rgb(var(--v-theme-primary));
}

.yesterday-card:hover,
.yesterday-card.active-filter {
  border-color: rgb(var(--v-theme-secondary));
}

.week-card:hover,
.week-card.active-filter {
  border-color: rgb(var(--v-theme-success));
}

.month-card:hover,
.month-card.active-filter {
  border-color: rgb(var(--v-theme-info));
}

.user-details .v-card {
  margin-bottom: 16px;
}

.user-details .v-card:last-child {
  margin-bottom: 0;
}
</style>
