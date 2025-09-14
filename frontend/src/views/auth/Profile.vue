<template>
  <div class="profile-page">
    <v-container class="py-8">
      <v-row>
        <!-- Profile Sidebar -->
        <v-col cols="12" md="4">
          <v-card class="pa-6" elevation="2">
            <div class="text-center">
              <v-avatar size="120" class="mb-4">
                <v-img
                  v-if="authStore.user?.profile_image_url"
                  :src="authStore.user.profile_image_url"
                  :alt="authStore.user.first_name"
                />
                <v-icon v-else size="60" color="primary">mdi-account</v-icon>
              </v-avatar>
              
              <h3 class="text-h5 font-weight-bold mb-2">
                {{ authStore.user?.first_name }} {{ authStore.user?.last_name }}
              </h3>
              
              <p class="text-body-2 text-grey-darken-1 mb-4">
                {{ authStore.user?.email }}
              </p>
              
              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                @click="uploadProfileImage"
              >
                <v-icon class="mr-2">mdi-camera</v-icon>
                Change Photo
              </v-btn>
            </div>
            
            <v-divider class="my-6" />
            
            <!-- Profile Stats -->
            <div class="profile-stats">
              <div class="d-flex justify-space-between align-center mb-3">
                <span class="text-body-2">Member Since</span>
                <span class="text-body-2 font-weight-medium">
                  {{ formatDate(authStore.user?.created_at) }}
                </span>
              </div>
              <div class="d-flex justify-space-between align-center mb-3">
                <span class="text-body-2">Applications</span>
                <span class="text-body-2 font-weight-medium">{{ appliedPrograms.length }}</span>
              </div>
              <div class="d-flex justify-space-between align-center">
                <span class="text-body-2">Profile Complete</span>
                <v-progress-linear
                  :model-value="profileCompletion"
                  color="primary"
                  height="8"
                  rounded
                />
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- Profile Content -->
        <v-col cols="12" md="8">
          <v-card class="pa-6" elevation="2">
            <v-tabs
              v-model="activeTab"
              color="primary"
              class="mb-6"
            >
              <v-tab value="personal">
                <v-icon class="mr-2">mdi-account</v-icon>
                Personal Info
              </v-tab>
              <v-tab value="programs">
                <v-icon class="mr-2">mdi-school</v-icon>
                Programs
              </v-tab>
              <v-tab value="documents">
                <v-icon class="mr-2">mdi-file-document</v-icon>
                Documents
              </v-tab>
              <v-tab value="security">
                <v-icon class="mr-2">mdi-lock</v-icon>
                Security
              </v-tab>
            </v-tabs>

            <v-window v-model="activeTab">
              <!-- Personal Information Tab -->
              <v-window-item value="personal">
            <v-form
              ref="personalFormRef"
              v-model="personalFormValid"
              @submit.prevent="updatePersonalInfo"
            >
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="personalForm.first_name"
                        label="First Name"
                        variant="outlined"
                        :rules="nameRules"
                        required
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="personalForm.last_name"
                        label="Last Name"
                        variant="outlined"
                        :rules="nameRules"
                        required
                      />
                    </v-col>
                  </v-row>

                  <v-text-field
                    v-model="personalForm.email"
                    label="Email Address"
                    type="email"
                    variant="outlined"
                    :rules="emailRules"
                    readonly
                    class="mb-4"
                  />

                  <v-text-field
                    v-model="personalForm.phone"
                    label="Phone Number"
                    type="tel"
                    variant="outlined"
                    class="mb-4"
                  />

                  <v-select
                    v-model="personalForm.nationality"
                    label="Nationality"
                    variant="outlined"
                    :items="nationalities"
                    class="mb-4"
                    clearable
                  />

                  <v-text-field
                    v-model="personalForm.date_of_birth"
                    label="Date of Birth"
                    type="date"
                    variant="outlined"
                    :rules="dateOfBirthRules"
                    class="mb-4"
                    hint="Please enter a valid date"
                    persistent-hint
                  />

                  <v-text-field
                    v-model="personalForm.passport_number"
                    label="Passport Number"
                    variant="outlined"
                    :rules="passportNumberRules"
                    class="mb-4"
                    hint="Please enter your passport number"
                    persistent-hint
                  />

                  <v-text-field
                    v-model="personalForm.address"
                    label="Full Address"
                    variant="outlined"
                    :rules="addressRules"
                    class="mb-4"
                    hint="Please enter your complete address"
                    persistent-hint
                  />

                  <v-text-field
                    v-model="personalForm.city"
                    label="City"
                    variant="outlined"
                    :rules="cityRules"
                    class="mb-4"
                    hint="Please enter your current city"
                    persistent-hint
                  />



                  <v-btn
                    type="submit"
                    color="primary"
                    variant="elevated"
                    :loading="authStore.loading"
                  >
                    Update Personal Info
                  </v-btn>
                </v-form>
              </v-window-item>

              <!-- Programs Tab -->
              <v-window-item value="programs">
                <div class="mb-6">
                  <div class="d-flex justify-space-between align-center mb-4">
                    <h4 class="text-h6 font-weight-medium">Applied Programs</h4>
                    <v-btn
                      color="primary"
                      variant="elevated"
                      @click="openAddProgramDialog"
                    >
                      <v-icon class="mr-2">mdi-plus</v-icon>
                      Add Program
                    </v-btn>
                  </div>
                  
                  <p class="text-body-2 text-grey-darken-1 mb-6">
                    Manage your program applications. You can apply to multiple programs and track your applications here.
                  </p>

                  <!-- Applied Programs List -->
                  <div v-if="appliedPrograms.length > 0" class="programs-grid">
                    <v-card
                      v-for="application in appliedPrograms"
                      :key="application.id"
                      variant="outlined"
                      class="pa-4 mb-4 program-card"
                    >
                      <div class="d-flex justify-space-between align-start">
                        <div class="flex-grow-1">
                          <div class="d-flex align-center mb-2">
                            <v-icon icon="mdi-school" class="mr-2" color="primary"></v-icon>
                            <h5 class="text-subtitle-1 font-weight-medium">{{ application.program_name }}</h5>
                          </div>
                          <p class="text-body-2 text-grey-darken-1 mb-1">
                            <strong>University:</strong> {{ application.university_name }}
                          </p>
                          <p class="text-body-2 text-grey-darken-1 mb-1">
                            <strong>Location:</strong> {{ application.city_name }}, {{ application.city_province }}
                          </p>
                          <p class="text-body-2 text-grey-darken-1 mb-1">
                            <strong>Degree Level:</strong> {{ application.degree_level }}
                          </p>
                          <p class="text-body-2 text-grey-darken-1 mb-1">
                            <strong>Language:</strong> {{ application.language }}
                          </p>
                          <p class="text-body-2 text-grey-darken-1 mb-1">
                            <strong>Applied Scholarship:</strong> {{ getScholarshipLabel(application.scholarship_type) }}
                          </p>
                          <p class="text-body-2 text-grey-darken-1 mb-2">
                            <strong>Applied:</strong> {{ formatDate(application.created_at) }}
                          </p>
                        </div>
                        <div class="text-center">
                          <v-btn
                            color="error"
                            variant="outlined"
                            size="small"
                            @click="removeProgram(application.program_id)"
                          >
                            <v-icon icon="mdi-delete" size="small"></v-icon>
                            Remove
                          </v-btn>
                        </div>
                      </div>
                    </v-card>
                  </div>

                  <!-- Empty State -->
                  <v-card v-else variant="outlined" class="pa-8 text-center">
                    <v-icon icon="mdi-school-outline" size="64" color="grey" class="mb-4"></v-icon>
                    <h5 class="text-h6 font-weight-medium mb-2">No Programs Applied</h5>
                    <p class="text-body-2 text-grey-darken-1 mb-4">
                      You haven't applied to any programs yet. Click "Add Program" to get started.
                    </p>
                    <v-btn
                      color="primary"
                      variant="elevated"
                      @click="openAddProgramDialog"
                    >
                      <v-icon class="mr-2">mdi-plus</v-icon>
                      Add Your First Program
                    </v-btn>
                  </v-card>
                </div>

                <!-- Add Program Dialog -->
                <v-dialog v-model="addProgramDialog" max-width="600px" persistent>
                  <v-card class="rounded-lg">
                    <v-card-title class="text-h5 font-weight-bold text-primary pa-6 pb-4">
                      <v-icon class="mr-2">mdi-plus</v-icon>
                      Add Program Application
                    </v-card-title>
                    <v-card-text class="pa-6 pt-0">
                      <!-- Debug info -->
                      <div v-if="programOptions.length === 0 && !loadingPrograms && !addProgramForm.program_id" class="mb-4 pa-3 bg-warning-lighten-5 rounded">
                        <p class="text-caption text-warning-darken-1 mb-2">
                          <v-icon icon="mdi-information" size="small" class="mr-1"></v-icon>
                          No programs loaded. Check console for errors.
                        </p>
                        <div class="d-flex gap-2">
                          <v-btn size="small" color="warning" variant="outlined" @click="fetchPrograms()">
                            <v-icon icon="mdi-refresh" size="small" class="mr-1"></v-icon>
                            Retry Load Programs
                          </v-btn>
                          <v-btn size="small" color="info" variant="outlined" @click="fetchPrograms('Computer')">
                            <v-icon icon="mdi-test-tube" size="small" class="mr-1"></v-icon>
                            Test Search
                          </v-btn>
                        </div>
                      </div>
                      
                      <v-form ref="addProgramFormRef" v-model="addProgramFormValid">
                        <!-- Program Selection with Search -->
                        <v-autocomplete
                          v-model="addProgramForm.program_id"
                          :items="programOptions"
                          item-title="program_id"
                          item-value="id"
                          label="Search Program ID"
                          variant="outlined"
                          :rules="programIdRules"
                          required
                          prepend-inner-icon="mdi-magnify"
                          hint="Type program ID, program name, or university name to search"
                          persistent-hint
                          clearable
                          :loading="loadingPrograms"
                          @update:search="searchPrograms"
                          :menu-props="{ maxHeight: '300' }"
                          hide-selected
                          no-data-text="No programs found. Try a different search term."
                        >
                          <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props">
                              <template v-slot:prepend>
                                <v-icon icon="mdi-school" color="primary"></v-icon>
                              </template>
                              <v-list-item-title>{{ item.raw.program_id }}</v-list-item-title>
                              <v-list-item-subtitle>
                                {{ item.raw.program_name }} • {{ item.raw.university_name }} • {{ item.raw.scholarship_type }}
                              </v-list-item-subtitle>
                            </v-list-item>
                          </template>
                        </v-autocomplete>
                        
                        <!-- Selected Program Details -->
                        <v-card v-if="selectedProgram" variant="outlined" class="mt-4 pa-4">
                          <h6 class="text-subtitle-1 font-weight-medium mb-2">Selected Program Details</h6>
                          <div class="d-flex flex-column gap-2">
                            <div><strong>Program ID:</strong> {{ selectedProgram.program_id }}</div>
                            <div><strong>Program Name:</strong> {{ selectedProgram.program_name }}</div>
                            <div><strong>University:</strong> {{ selectedProgram.university_name }}</div>
                            <div><strong>Location:</strong> {{ selectedProgram.city_name }}</div>
                            <div><strong>Degree Level:</strong> {{ selectedProgram.degree_level }}</div>
                            <div><strong>Language:</strong> {{ selectedProgram.language }}</div>
                            <div><strong>Program Scholarship:</strong> {{ selectedProgram.scholarship_type }}</div>
                          </div>
                        </v-card>
                        
                        <!-- Scholarship Type Selection -->
                        <v-select
                          v-model="addProgramForm.scholarship_type"
                          :items="scholarshipTypes"
                          item-title="label"
                          item-value="value"
                          label="Scholarship Type *"
                          variant="outlined"
                          :rules="scholarshipTypeRules"
                          required
                          prepend-inner-icon="mdi-school"
                          hint="Select the type of scholarship you are applying for"
                          persistent-hint
                          class="mt-4"
                        />
                      </v-form>
                    </v-card-text>
                    <v-card-actions class="pa-6 pt-0">
                      <v-spacer />
                      <v-btn variant="text" @click="closeAddProgramDialog">Cancel</v-btn>
                      <v-btn
                        color="primary"
                        variant="elevated"
                        :loading="addingProgram"
                        :disabled="!addProgramFormValid"
                        @click="addProgram"
                      >
                        <v-icon class="mr-2">mdi-plus</v-icon>
                        Add Program
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-window-item>

              <!-- Documents Tab -->
              <v-window-item value="documents">
                <div class="mb-6">
                  <h4 class="text-h6 font-weight-medium mb-4">Upload Documents</h4>
                  <p class="text-body-2 text-grey-darken-1 mb-6">
                    Upload scanned color copies of all required documents. All documents are optional but recommended for a complete application.
                  </p>
                  
                  <!-- Document Upload Cards -->
                  <div class="documents-grid">
                    <v-card
                      v-for="doc in documentTypes"
                      :key="doc.type"
                      variant="outlined"
                      class="pa-4 mb-4 document-card"
                    >
                    <div class="d-flex align-center justify-space-between">
                        <div class="flex-grow-1">
                          <div class="d-flex align-center mb-2">
                            <v-icon :icon="doc.icon" class="mr-2" color="primary"></v-icon>
                            <h5 class="text-subtitle-1 font-weight-medium">{{ doc.title }}</h5>
                          </div>
                          <p class="text-body-2 text-grey-darken-1 mb-2">
                            {{ doc.description }}
                          </p>
                          <div v-if="authStore.user?.[doc.field]" class="d-flex align-center">
                            <v-icon icon="mdi-check-circle" color="success" class="mr-1" size="small"></v-icon>
                            <span class="text-caption text-success">Document uploaded</span>
                            <v-btn
                              color="error"
                              variant="text"
                              size="small"
                              class="ml-2"
                              @click="removeDocument(doc.type)"
                            >
                              <v-icon icon="mdi-delete" size="small"></v-icon>
                              Remove
                            </v-btn>
                          </div>
                      </div>
                      <div class="text-center">
                        <v-avatar
                            v-if="authStore.user?.[doc.field]"
                            size="60"
                          class="mb-2"
                        >
                          <v-img
                              :src="authStore.user[doc.field]"
                              :alt="doc.title"
                          />
                        </v-avatar>
                        <v-icon
                          v-else
                            :icon="doc.icon"
                          size="40"
                          color="grey"
                          class="mb-2"
                          />
                        <v-btn
                            v-if="!authStore.user?.[doc.field]"
                          color="primary"
                          variant="outlined"
                          size="small"
                            @click="uploadDocument(doc.type)"
                        >
                          Upload
                        </v-btn>
                      </div>
                    </div>
                  </v-card>
                      </div>
                </div>
              </v-window-item>

              <!-- Security Tab -->
              <v-window-item value="security">
                <v-form
                  ref="securityFormRef"
                  v-model="securityFormValid"
                  @submit.prevent="changePassword"
                >
                  <h4 class="text-h6 font-weight-medium mb-4">Change Password</h4>
                  
                  <v-text-field
                    v-model="securityForm.current_password"
                    label="Current Password"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    variant="outlined"
                    :rules="passwordRules"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showCurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showCurrentPassword = !showCurrentPassword"
                    class="mb-4"
                    required
                  />

                  <v-text-field
                    v-model="securityForm.new_password"
                    label="New Password"
                    :type="showNewPassword ? 'text' : 'password'"
                    variant="outlined"
                    :rules="newPasswordRules"
                    prepend-inner-icon="mdi-lock-plus"
                    :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showNewPassword = !showNewPassword"
                    class="mb-4"
                    required
                  />

                  <v-text-field
                    v-model="securityForm.confirm_password"
                    label="Confirm New Password"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    variant="outlined"
                    :rules="confirmPasswordRules"
                    prepend-inner-icon="mdi-lock-check"
                    :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showConfirmPassword = !showConfirmPassword"
                    class="mb-6"
                    required
                  />

                  <v-btn
                    type="submit"
                    color="primary"
                    variant="elevated"
                    :loading="authStore.loading"
                  >
                    Change Password
                  </v-btn>
                </v-form>
              </v-window-item>
            </v-window>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const activeTab = ref('personal')
const personalFormRef = ref(null)
const securityFormRef = ref(null)
const personalFormValid = ref(false)
const securityFormValid = ref(false)

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const personalForm = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  nationality: '',
  date_of_birth: '',
  passport_number: '',
  address: '',
  city: ''
})

const securityForm = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const nationalities = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia',
  'Austria', 'Azerbaijan', 'Bangladesh', 'Belarus', 'Belgium', 'Brazil',
  'Bulgaria', 'Cambodia', 'Canada', 'Chile', 'China', 'Colombia', 'Croatia',
  'Czech Republic', 'Denmark', 'Egypt', 'Estonia', 'Finland', 'France',
  'Georgia', 'Germany', 'Ghana', 'Greece', 'Hungary', 'Iceland', 'India',
  'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan',
  'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Lebanon', 'Lithuania',
  'Luxembourg', 'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand',
  'Nigeria', 'Norway', 'Pakistan', 'Philippines', 'Poland', 'Portugal',
  'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'Slovakia', 'Slovenia',
  'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland',
  'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Vietnam', 'Other'
]

const programs = ref([])
const programOptions = ref([])
const appliedPrograms = ref([])
const addProgramDialog = ref(false)
const addProgramFormRef = ref(null)
const addProgramFormValid = ref(false)
const addingProgram = ref(false)
const loadingPrograms = ref(false)
const searchTimeout = ref(null)
const searchQuery = ref('')

const addProgramForm = reactive({
  program_id: null,
  scholarship_type: 'none'
})

const scholarshipTypes = [
  { label: 'No Scholarship', value: 'none' },
  { label: 'Partial Scholarship', value: 'partial' },
  { label: '50% Scholarship', value: '50_percent' },
  { label: 'Full Scholarship', value: 'full' }
]

const programIdRules = [
  v => !!v || 'Please select a program'
]

const scholarshipTypeRules = [
  v => !!v || 'Please select a scholarship type'
]

const documentTypes = [
  {
    type: 'passport-scanned',
    title: 'Passport (Scanned Copy)',
    description: 'Upload a clear scanned color copy of your passport',
    icon: 'mdi-passport',
    field: 'passport_scanned_url'
  },
  {
    type: 'passport-photo',
    title: 'Passport Size Photo',
    description: 'Upload your passport size photograph',
    icon: 'mdi-account',
    field: 'passport_photo_url'
  },
  {
    type: 'academic-transcripts',
    title: 'Academic Transcripts',
    description: 'Upload scanned color copies of your academic transcripts',
    icon: 'mdi-school',
    field: 'academic_transcripts_url'
  },
  {
    type: 'highest-degree-diploma',
    title: 'Highest Degree Diploma',
    description: 'Upload scanned color copy of your highest degree diploma',
    icon: 'mdi-certificate',
    field: 'highest_degree_diploma_url'
  },
  {
    type: 'physical-examination-form',
    title: 'Foreigner Physical Examination Form',
    description: 'Upload the completed physical examination form',
    icon: 'mdi-medical-bag',
    field: 'physical_examination_form_url'
  },
  {
    type: 'police-clearance',
    title: 'Police Clearance',
    description: 'Upload scanned color copy of police clearance certificate',
    icon: 'mdi-shield-check',
    field: 'police_clearance_url'
  },
  {
    type: 'chinese-language-certificate',
    title: 'Chinese Language Proficiency Certificate',
    description: 'Upload your Chinese language proficiency certificate',
    icon: 'mdi-translate',
    field: 'chinese_language_certificate_url'
  },
  {
    type: 'application-form',
    title: 'Application Form',
    description: 'Upload the completed application form',
    icon: 'mdi-file-document-edit',
    field: 'application_form_url'
  },
  {
    type: 'recommendation-letter-1',
    title: 'Letter of Recommendation 1',
    description: 'Upload the first letter of recommendation',
    icon: 'mdi-file-document-multiple',
    field: 'recommendation_letter_1_url'
  },
  {
    type: 'recommendation-letter-2',
    title: 'Letter of Recommendation 2',
    description: 'Upload the second letter of recommendation',
    icon: 'mdi-file-document-multiple',
    field: 'recommendation_letter_2_url'
  },
  {
    type: 'guarantee-letter',
    title: 'Guarantee Letter (Under 18)',
    description: 'Upload guarantee letter for applicants under 18 years old',
    icon: 'mdi-file-document-check',
    field: 'guarantee_letter_url'
  },
  {
    type: 'residence-permit',
    title: 'Residence Permit',
    description: 'Upload your residence permit document',
    icon: 'mdi-card-account-details',
    field: 'residence_permit_url'
  },
  {
    type: 'study-certificate-china',
    title: 'Study Certificate in China',
    description: 'Upload study certificate if you have studied in China before',
    icon: 'mdi-school-outline',
    field: 'study_certificate_china_url'
  },
  {
    type: 'others-1',
    title: 'Other Document 1',
    description: 'Upload any other relevant document',
    icon: 'mdi-file-plus',
    field: 'others_1_url'
  },
  {
    type: 'others-2',
    title: 'Other Document 2',
    description: 'Upload any other relevant document',
    icon: 'mdi-file-plus',
    field: 'others_2_url'
  }
]

const nameRules = [
  v => !!v || 'Name is required',
  v => v.length >= 2 || 'Name must be at least 2 characters'
]

const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const passwordRules = [
  v => !!v || 'Password is required'
]

const newPasswordRules = [
  v => !!v || 'New password is required',
  v => v.length >= 6 || 'Password must be at least 6 characters'
]

const confirmPasswordRules = [
  v => !!v || 'Please confirm your password',
  v => v === securityForm.new_password || 'Passwords do not match'
]

const dateOfBirthRules = [
  v => {
    if (!v) return 'Please enter your date of birth'
    const date = new Date(v)
    if (isNaN(date.getTime())) return 'Please enter a valid date'
    const today = new Date()
    if (date > today) return 'Date of birth cannot be in the future'
    const age = today.getFullYear() - date.getFullYear()
    if (age > 100) return 'Please enter a valid date of birth'
    return true
  }
]

const passportNumberRules = [
  v => {
    if (!v || v.trim() === '') return 'Please enter your passport number'
    if (v.trim().length < 5) return 'Passport number must be at least 5 characters'
    return true
  }
]

const addressRules = [
  v => {
    if (!v || v.trim() === '') return 'Please enter your full address'
    if (v.trim().length < 10) return 'Address must be at least 10 characters'
    return true
  }
]

const cityRules = [
  v => {
    if (!v || v.trim() === '') return 'Please enter your city'
    if (v.trim().length < 2) return 'City name must be at least 2 characters'
    return true
  }
]

const profileCompletion = computed(() => {
  if (!authStore.user) return 0
  
  const fields = [
    authStore.user.first_name,
    authStore.user.last_name,
    authStore.user.phone,
    authStore.user.nationality,
    authStore.user.date_of_birth,
    authStore.user.passport_number,
    authStore.user.address,
    authStore.user.city,
    authStore.user.profile_image_url,
    authStore.user.passport_image_url
  ]
  
  const completedFields = fields.filter(field => field && field.toString().trim() !== '').length
  return Math.round((completedFields / fields.length) * 100)
})

const selectedProgram = computed(() => {
  if (!addProgramForm.program_id) return null
  return programOptions.value.find(program => program.id === addProgramForm.program_id)
})

// Watch for changes in program options to ensure pre-selected program is available
watch(programOptions, (newOptions) => {
  if (addProgramForm.program_id && newOptions.length > 0) {
    const selectedProgramExists = newOptions.find(p => p.id === addProgramForm.program_id)
    if (!selectedProgramExists) {
      console.log('Pre-selected program not found in options, but keeping selection for now')
      // Don't clear the selection immediately, as it might be added later
      // The program could be added via redirect or URL parameters
    }
  }
}, { deep: true })

// Watch for dialog opening to ensure pre-selected program is properly displayed
watch(addProgramDialog, (isOpen) => {
  if (isOpen && addProgramForm.program_id) {
    console.log('Dialog opened with pre-selected program:', addProgramForm.program_id)
    // Force reactivity update
    nextTick(() => {
      const selectedProgram = programOptions.value.find(p => p.id === addProgramForm.program_id)
      if (selectedProgram) {
        console.log('Pre-selected program found:', selectedProgram.program_id)
      } else {
        console.log('Pre-selected program not found in options, fetching programs...')
        // If the pre-selected program is not in options, fetch programs
        fetchPrograms('')
      }
    })
  }
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getScholarshipLabel = (type) => {
  switch (type) {
    case 'full': return 'Full Scholarship'
    case 'partial': return 'Partial Scholarship'
    case '50_percent': return '50% Scholarship'
    case 'none': return 'No Scholarship'
    default: return 'Not specified'
  }
}

const updatePersonalInfo = async () => {
  if (!personalFormValid.value) return

  // Remove email from the form data since it's not allowed to be updated
  const { email, ...updateData } = personalForm
  const result = await authStore.updateProfile(updateData)
  if (result.success) {
    toast.success('Personal information updated successfully!')
  }
}

const changePassword = async () => {
  if (!securityFormValid.value) return

  const result = await authStore.changePassword({
    current_password: securityForm.current_password,
    new_password: securityForm.new_password
  })
  
  if (result.success) {
    // Clear form
    securityForm.current_password = ''
    securityForm.new_password = ''
    securityForm.confirm_password = ''
    
    // Show success message
    toast.success('Password changed successfully! Please log in again.')
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      authStore.logout()
      // The logout will automatically redirect to login page
    }, 1500)
  }
}

const uploadProfileImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (512KB = 512 * 1024 bytes)
      const maxSize = 512 * 1024 // 512KB
      if (file.size > maxSize) {
        toast.error(`Profile image size must not exceed 512KB. Your file is ${(file.size / 1024).toFixed(1)}KB.`)
        return
      }
      
      await authStore.uploadProfileImage(file)
    }
  }
  input.click()
}

const uploadPassport = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (512KB = 512 * 1024 bytes)
      const maxSize = 512 * 1024 // 512KB
      if (file.size > maxSize) {
        toast.error(`File size must not exceed 512KB. Your file is ${(file.size / 1024).toFixed(1)}KB.`)
        return
      }
      
      await authStore.uploadPassport(file)
    }
  }
  input.click()
}

const uploadDocument = async (documentType) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*,.pdf'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (512KB = 512 * 1024 bytes)
      const maxSize = 512 * 1024 // 512KB
      if (file.size > maxSize) {
        toast.error(`File size must not exceed 512KB. Your file is ${(file.size / 1024).toFixed(1)}KB.`)
        return
      }
      
      try {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await api.post(`/uploads/${documentType}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        if (response.data.fileUrl) {
          // Refresh user data to update the UI
          await authStore.initAuth()
          toast.success(`${documentType.replace('-', ' ')} uploaded successfully!`)
        }
      } catch (error) {
        console.error('Upload error:', error)
        if (error.response?.data?.error) {
          toast.error(error.response.data.error)
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message)
        } else {
          toast.error('Failed to upload document. Please try again.')
        }
      }
    }
  }
  input.click()
}

const removeDocument = async (documentType) => {
  try {
    await api.delete(`/uploads/document/${documentType}`)
    // Refresh user data to update the UI
    await authStore.initAuth()
    toast.success('Document removed successfully!')
  } catch (error) {
    console.error('Remove error:', error)
    if (error.response?.data?.error) {
      toast.error(error.response.data.error)
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else {
      toast.error('Failed to remove document. Please try again.')
    }
  }
}

const fetchPrograms = async (search = '') => {
  try {
    loadingPrograms.value = true
    const params = { limit: 100 }
    if (search && typeof search === 'string' && search.trim()) {
      params.search = search.trim()
    }
    
    console.log('Fetching programs with params:', params) // Debug log
    
    // Try direct API call first
    const response = await api.get('/programs', { params })
    console.log('Programs API response:', response.data) // Debug log
    
    const fetchedPrograms = response.data.programs || []
    console.log('Fetched programs:', fetchedPrograms) // Debug log
    
    // Transform programs for the dropdown (even if empty)
    const newProgramOptions = fetchedPrograms.map(program => ({
      id: program.id,
      program_id: program.program_id,
      program_name: program.name,
      university_name: program.university_name,
      city_name: program.city_name,
      degree_level: program.degree_level,
      language: program.language,
      scholarship_type: program.scholarship_type
    }))
    
    // Merge with existing options to preserve pre-selected programs
    const existingOptions = programOptions.value.filter(option => 
      !newProgramOptions.find(newOption => newOption.id === option.id)
    )
    programOptions.value = [...existingOptions, ...newProgramOptions]
    
    console.log('Program options:', programOptions.value) // Debug log
    
    programs.value = fetchedPrograms
  } catch (error) {
    console.error('Failed to fetch programs:', error)
    console.error('Error details:', error.response?.data)
    toast.error('Failed to load programs. Please try again.')
    
    // Only clear options if there's no pre-selected program
    if (!addProgramForm.program_id) {
      programOptions.value = []
    }
    programs.value = []
  } finally {
    loadingPrograms.value = false
  }
}

const searchPrograms = (searchValue) => {
  console.log('Search triggered with value:', searchValue) // Debug log
  
  // Skip search if the value looks like a selected item (contains parentheses or is a program ID)
  if (searchValue && typeof searchValue === 'string') {
    // Skip if it looks like a selected item with parentheses
    if (searchValue.includes('(') && searchValue.includes(')')) {
      console.log('Skipping search for selected item:', searchValue)
      return
    }
    
    // Skip if it's just a program ID (like PROG-1, PROG-2, etc.)
    if (/^PROG-\d+$/.test(searchValue.trim())) {
      console.log('Skipping search for program ID:', searchValue)
      return
    }
  }
  
  // Ensure searchValue is a string
  const searchTerm = typeof searchValue === 'string' ? searchValue : String(searchValue || '')
  
  // Don't search for very short terms
  if (searchTerm.trim().length < 2) {
    console.log('Skipping search for short term:', searchTerm)
    // If no search term and we have a pre-selected program, ensure it's in options
    if (addProgramForm.program_id && programOptions.value.length === 0) {
      console.log('No search term, but have pre-selected program, fetching programs...')
      fetchPrograms('')
    }
    return
  }
  
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    console.log('Executing search for:', searchTerm) // Debug log
    fetchPrograms(searchTerm)
  }, 300) // Debounce search by 300ms
}

const fetchAppliedPrograms = async () => {
  try {
    const response = await api.get('/student-programs/my-applications')
    appliedPrograms.value = response.data.applications || []
  } catch (error) {
    console.error('Failed to fetch applied programs:', error)
  }
}

const openAddProgramDialog = async () => {
  addProgramDialog.value = true
  
  // Only clear the form if no program is pre-selected
  if (!addProgramForm.program_id) {
    addProgramForm.program_id = null
    searchQuery.value = ''
    // Load initial programs
    console.log('Opening add program dialog, fetching programs...')
    
    // Clear previous search results
    programOptions.value = []
    
    // Load initial programs without search
    await fetchPrograms('')
  } else {
    console.log('Opening add program dialog with pre-selected program:', addProgramForm.program_id)
    
    // Ensure the pre-selected program is in the options
    const selectedProgram = programOptions.value.find(p => p.id === addProgramForm.program_id)
    if (!selectedProgram) {
      console.log('Pre-selected program not found in options, fetching programs...')
      // If the pre-selected program is not in options, fetch programs
      await fetchPrograms('')
    }
  }
}

const closeAddProgramDialog = () => {
  addProgramDialog.value = false
  
  // Only clear the form if it wasn't pre-selected from a redirect
  // Check if there's a redirect in progress
  const hasRedirect = localStorage.getItem('redirectAfterLogin') || 
                     (route.query.tab === 'programs' && route.query.programId)
  
  if (!hasRedirect) {
    addProgramForm.program_id = null
    addProgramForm.scholarship_type = 'none'
    searchQuery.value = ''
  }
}

const addProgram = async () => {
  if (!addProgramFormValid.value) return
  
  addingProgram.value = true
  try {
    await api.post('/student-programs/apply', {
      program_id: addProgramForm.program_id,
      scholarship_type: addProgramForm.scholarship_type
    })
    
    toast.success('Program application submitted successfully!')
    closeAddProgramDialog()
    await fetchAppliedPrograms()
  } catch (error) {
    console.error('Add program error:', error)
    if (error.response?.data?.error) {
      toast.error(error.response.data.error)
    } else {
      toast.error('Failed to apply to program. Please try again.')
    }
  } finally {
    addingProgram.value = false
  }
}

const removeProgram = async (programId) => {
  try {
    await api.delete(`/student-programs/remove/${programId}`)
    toast.success('Program application removed successfully!')
    await fetchAppliedPrograms()
  } catch (error) {
    console.error('Remove program error:', error)
    toast.error('Failed to remove program application. Please try again.')
  }
}

const handleRedirectAfterLogin = async () => {
  // Check for redirect data in localStorage (from ProgramDetail page)
  const redirectData = localStorage.getItem('redirectAfterLogin')
  if (redirectData) {
    try {
      const data = JSON.parse(redirectData)
      if (data.route === '/profile' && data.tab === 'programs') {
        // Clear the redirect data
        localStorage.removeItem('redirectAfterLogin')
        
        // Switch to programs tab
        activeTab.value = 'programs'
        
        // Pre-fill the program form with the program data
        if (data.programData) {
          // Add the program to options first
          const programOption = {
            id: data.programId,
            program_id: data.programData.program_id,
            program_name: data.programData.program_name,
            university_name: data.programData.university_name,
            city_name: data.programData.city_name,
            degree_level: data.programData.degree_level,
            language: data.programData.language,
            scholarship_type: data.programData.scholarship_type
          }
          
          // Add to program options if not already present
          const existingProgram = programOptions.value.find(p => p.id === data.programId)
          if (!existingProgram) {
            programOptions.value.push(programOption)
          }
          
          // Set the selected program
          addProgramForm.program_id = data.programId
          
          // Ensure the program is in options even if it was cleared
          console.log('Pre-selected program added to options:', programOption)
          
          // Open the add program dialog
          setTimeout(() => {
            openAddProgramDialog()
          }, 500)
        }
      }
    } catch (error) {
      console.error('Error parsing redirect data:', error)
      localStorage.removeItem('redirectAfterLogin')
    }
  }
  
  // Check for URL query parameters (direct navigation)
  if (route.query.tab === 'programs' && route.query.programId) {
    activeTab.value = 'programs'
    
    if (route.query.programData) {
      try {
        const programData = JSON.parse(route.query.programData)
        const programId = parseInt(route.query.programId)
        
        // Add the program to options first
        const programOption = {
          id: programId,
          program_id: programData.program_id,
          program_name: programData.program_name,
          university_name: programData.university_name,
          city_name: programData.city_name,
          degree_level: programData.degree_level,
          language: programData.language,
          scholarship_type: programData.scholarship_type
        }
        
        // Add to program options if not already present
        const existingProgram = programOptions.value.find(p => p.id === programId)
        if (!existingProgram) {
          programOptions.value.push(programOption)
        }
        
        // Set the selected program
        addProgramForm.program_id = programId
        
        // Ensure the program is in options even if it was cleared
        console.log('Pre-selected program added to options from URL:', programOption)
        
        // Open the add program dialog
        setTimeout(() => {
          openAddProgramDialog()
        }, 500)
        
        // Clear the query parameters
        router.replace({ path: '/profile' })
      } catch (error) {
        console.error('Error parsing program data from URL:', error)
      }
    }
  }
}

onMounted(async () => {
  // Fetch applied programs
  await fetchAppliedPrograms()
  
  // Populate form with current user data
  if (authStore.user) {
    Object.assign(personalForm, {
      first_name: authStore.user.first_name || '',
      last_name: authStore.user.last_name || '',
      email: authStore.user.email || '',
      phone: authStore.user.phone || '',
      nationality: authStore.user.nationality || '',
      date_of_birth: authStore.user.date_of_birth || '',
      passport_number: authStore.user.passport_number || '',
      address: authStore.user.address || '',
      city: authStore.user.city || ''
    })
  }
  
  // Handle redirect after login
  handleRedirectAfterLogin()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #fafafa;
}

.profile-stats {
  padding: 16px 0;
}

.v-card {
  border-radius: 12px;
}

.v-tabs {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.v-tab {
  text-transform: none !important;
  font-weight: 500;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px;
}

.document-card {
  transition: all 0.3s ease;
}

.document-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 16px;
}

.program-card {
  transition: all 0.3s ease;
}

.program-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .documents-grid {
    grid-template-columns: 1fr;
  }
  
  .programs-grid {
    grid-template-columns: 1fr;
  }
}
</style>
