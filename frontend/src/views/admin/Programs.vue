<template>
  <div class="admin-programs">
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">Manage Programs</h1>
      <v-btn
        color="primary"
        variant="elevated"
        @click="openCreateDialog"
      >
        <v-icon class="mr-2">mdi-plus</v-icon>
        Add Program
      </v-btn>
    </div>

    <!-- Filters -->
    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.search"
              label="Search programs"
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              clearable
              @input="debouncedSearch"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filters.university_id"
              label="University"
              variant="outlined"
              :items="universities"
              item-title="name"
              item-value="id"
              clearable
              @update:model-value="fetchPrograms"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filters.degree_level"
              label="Degree Level"
              variant="outlined"
              :items="degreeLevels"
              item-title="label"
              item-value="value"
              clearable
              @update:model-value="fetchPrograms"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filters.language"
              label="Language"
              variant="outlined"
              :items="languages"
              item-title="label"
              item-value="value"
              clearable
              @update:model-value="fetchPrograms"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filters.scholarship_type"
              label="Scholarship"
              variant="outlined"
              :items="scholarshipTypes"
              item-title="label"
              item-value="value"
              clearable
              @update:model-value="fetchPrograms"
            />
          </v-col>
          <v-col cols="12" md="1">
            <v-btn
              color="primary"
              variant="elevated"
              block
              @click="clearFilters"
            >
              Clear
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Programs Table -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="programs"
        :loading="loading"
        class="elevation-0"
        :items-per-page="10"
      >
        <template v-slot:item.university_name="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" class="mr-3">
              <v-icon color="primary">mdi-school</v-icon>
            </v-avatar>
            <div>
              <div class="text-body-2 font-weight-medium">{{ item.university_name }}</div>
              <div class="text-caption text-grey-darken-1">{{ item.city_name }}</div>
            </div>
          </div>
        </template>

        <template v-slot:item.scholarship_type="{ item }">
          <v-chip
            :color="getScholarshipColor(item.scholarship_type)"
            size="small"
            variant="flat"
          >
            {{ getScholarshipLabel(item.scholarship_type) }}
          </v-chip>
        </template>

        <template v-slot:item.degree_level="{ item }">
          <v-chip
            :color="getDegreeColor(item.degree_level)"
            size="small"
            variant="outlined"
          >
            {{ getDegreeLabel(item.degree_level) }}
          </v-chip>
        </template>

        <template v-slot:item.tuition_fee="{ item }">
          <span v-if="item.tuition_fee" class="font-weight-medium">
            ¥{{ formatNumber(item.tuition_fee) }}
          </span>
          <span v-else class="text-grey-darken-1">Not specified</span>
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
          <div class="d-flex gap-2">
            <v-btn
              icon
              variant="text"
              size="small"
              color="primary"
              @click="editProgram(item)"
            >
              <v-icon>mdi-pencil</v-icon>
              <v-tooltip activator="parent" location="top">Edit Program</v-tooltip>
            </v-btn>
            <v-btn
              icon
              variant="text"
              size="small"
              color="error"
              @click="deleteProgram(item)"
            >
              <v-icon>mdi-delete</v-icon>
              <v-tooltip activator="parent" location="top">Delete Program</v-tooltip>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit Program Dialog -->
    <v-dialog
      v-model="dialog"
      max-width="900"
      scrollable
      persistent
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5 font-weight-bold">
            {{ isEditing ? 'Edit Program' : 'Add New Program' }}
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
          <!-- Validation Errors -->
          <v-alert
            v-if="validationErrors.length > 0"
            type="error"
            variant="tonal"
            class="mb-4"
            closable
            @click:close="validationErrors = []"
          >
            <div class="text-subtitle-2 font-weight-bold mb-2">Please fix the following errors:</div>
            <ul class="mb-0">
              <li v-for="error in validationErrors" :key="error" class="text-body-2">
                {{ error }}
              </li>
            </ul>
          </v-alert>

          <v-form ref="form" v-model="formValid">
            <v-row>
              <!-- Basic Information -->
              <v-col cols="12">
                <h3 class="text-h6 font-weight-bold mb-4">Basic Information</h3>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.university_id"
                  :items="universities"
                  item-title="name"
                  item-value="id"
                  label="University *"
                  variant="outlined"
                  :rules="[v => !!v || 'University is required']"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.program_name_id"
                  :items="programNames"
                  item-title="name"
                  item-value="id"
                  label="Program Name *"
                  variant="outlined"
                  :rules="[v => !!v || 'Program name is required']"
                  required
                  @update:model-value="onProgramNameChange"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.english_name"
                  label="English Name"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.degree_level"
                  :items="degreeLevels"
                  item-title="label"
                  item-value="value"
                  label="Degree Level *"
                  variant="outlined"
                  :rules="[v => !!v || 'Degree level is required']"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.language"
                  :items="languages"
                  item-title="label"
                  item-value="value"
                  label="Language *"
                  variant="outlined"
                  :rules="[v => !!v || 'Language is required']"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.intake_season"
                  :items="intakeSeasons"
                  item-title="label"
                  item-value="value"
                  label="Intake Season"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="formData.description"
                  label="Description"
                  variant="outlined"
                  rows="3"
                />
              </v-col>

              <!-- Duration & Fees -->
              <v-col cols="12">
                <h3 class="text-h6 font-weight-bold mb-4 mt-6">Duration & Fees</h3>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="formData.duration_years"
                  label="Duration (Years)"
                  variant="outlined"
                  type="number"
                  min="0"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="formData.duration_months"
                  label="Duration (Months)"
                  variant="outlined"
                  type="number"
                  min="0"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="formData.tuition_fee"
                  label="Tuition Fee (¥)"
                  variant="outlined"
                  type="number"
                  min="0"
                  step="0.01"
                  hint="Enter 0 if tuition is covered by scholarship"
                  persistent-hint
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="formData.accommodation_fee"
                  label="Accommodation Fee (¥)"
                  variant="outlined"
                  type="number"
                  min="0"
                  step="0.01"
                  hint="Enter 0 if accommodation is provided free"
                  persistent-hint
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="formData.accommodation_cost_unit"
                  :items="accommodationCostUnits"
                  item-title="label"
                  item-value="value"
                  label="Accommodation Cost Unit"
                  variant="outlined"
                  hint="Unit for accommodation cost calculation"
                  persistent-hint
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-select
                  v-model="formData.tuition_fee_unit"
                  :items="tuitionFeeUnits"
                  item-title="label"
                  item-value="value"
                  label="Tuition Fee Unit"
                  variant="outlined"
                  hint="Unit for tuition fee calculation"
                  persistent-hint
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="formData.no_of_semesters_per_year"
                  label="Number of Semesters per Year"
                  variant="outlined"
                  type="number"
                  min="1"
                  max="4"
                  hint="Number of semesters per academic year"
                  persistent-hint
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="formData.scholarship_amount"
                  label="Scholarship Amount (¥)"
                  variant="outlined"
                  type="number"
                  min="0"
                  step="0.01"
                  hint="Amount provided by scholarship (if any)"
                  persistent-hint
                />
              </v-col>

              <!-- Scholarship Information -->
              <v-col cols="12">
                <h3 class="text-h6 font-weight-bold mb-4 mt-6">Scholarship Information</h3>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.scholarship_type"
                  :items="scholarshipTypes"
                  item-title="label"
                  item-value="value"
                  label="Scholarship Type"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.application_deadline"
                  label="Application Deadline"
                  variant="outlined"
                  type="date"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.intake_date"
                  label="Intake Date"
                  variant="outlined"
                  type="date"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="formData.scholarship_description"
                  label="Scholarship Description"
                  variant="outlined"
                  rows="3"
                />
              </v-col>

              <!-- Requirements -->
              <v-col cols="12">
                <h3 class="text-h6 font-weight-bold mb-4 mt-6">Requirements</h3>
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="formData.min_age"
                  label="Minimum Age"
                  variant="outlined"
                  type="number"
                  min="0"
                  hint="Leave empty if no minimum age requirement"
                  persistent-hint
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="formData.max_age"
                  label="Maximum Age"
                  variant="outlined"
                  type="number"
                  min="0"
                  hint="Leave empty if no maximum age limit"
                  persistent-hint
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="formData.min_gpa"
                  label="Minimum GPA"
                  variant="outlined"
                  type="number"
                  min="0"
                  max="4"
                  step="0.01"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="formData.min_ielts_score"
                  label="Minimum IELTS Score"
                  variant="outlined"
                  type="number"
                  min="0"
                  max="9"
                  step="0.5"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="formData.min_toefl_score"
                  label="Minimum TOEFL Score"
                  variant="outlined"
                  type="number"
                  min="0"
                  max="120"
                  step="1"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-text-field
                  v-model.number="formData.min_hsk_level"
                  label="Minimum HSK Level"
                  variant="outlined"
                  type="number"
                  min="1"
                  max="6"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="formData.additional_requirements"
                  label="Additional Requirements"
                  variant="outlined"
                  rows="3"
                />
              </v-col>

              <!-- Additional Program Information -->
              <v-col cols="12">
                <h3 class="text-h6 font-weight-bold mb-4 mt-6">Additional Program Information</h3>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.program_id"
                  label="Program ID *"
                  variant="outlined"
                  :rules="[
                    v => !!v || 'Program ID is required',
                    v => v.length >= 2 || 'Program ID must be at least 2 characters long'
                  ]"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.scholarship_category"
                  label="Scholarship Category"
                  variant="outlined"
                />
              </v-col>


              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="formData.service_fee"
                  label="Service Fee (¥)"
                  variant="outlined"
                  type="number"
                  min="0"
                  step="0.01"
                  hint="Administrative service fee (default: 0)"
                  persistent-hint
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="formData.application_fee"
                  label="Application Fee (¥)"
                  variant="outlined"
                  type="number"
                  min="0"
                  step="0.01"
                  hint="Application processing fee (default: 0)"
                  persistent-hint
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.teaching_language"
                  :items="teachingLanguages"
                  item-title="label"
                  item-value="value"
                  label="Teaching Language *"
                  variant="outlined"
                  :rules="[v => !!v || 'Teaching language is required']"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.program_field"
                  label="Program Field *"
                  variant="outlined"
                  :rules="[
                    v => !!v || 'Program field is required',
                    v => v.length >= 2 || 'Program field must be at least 2 characters long'
                  ]"
                  required
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="formData.scholarship_duration"
                  label="Scholarship Duration (Years)"
                  variant="outlined"
                  type="number"
                  min="0"
                  step="0.1"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-switch
                  v-model="formData.accept_students_who_come_to_china"
                  label="Accept Students Who Come to China *"
                  color="primary"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="formData.scholarship_policy"
                  label="Scholarship Policy"
                  variant="outlined"
                  rows="3"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="formData.acceptable_student_location"
                  label="Acceptable Student's Current Location"
                  variant="outlined"
                  rows="2"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="formData.application_documents"
                  label="Application Documents *"
                  variant="outlined"
                  rows="4"
                  :rules="[
                    v => !!v || 'Application documents are required',
                    v => v.length >= 5 || 'Application documents must be at least 5 characters long'
                  ]"
                  required
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="formData.special_notes"
                  label="Special Notes"
                  variant="outlined"
                  rows="3"
                />
              </v-col>

              <!-- Settings -->
              <v-col cols="12">
                <h3 class="text-h6 font-weight-bold mb-4 mt-6">Settings</h3>
              </v-col>

              <v-col cols="12" md="6">
                <v-switch
                  v-model="formData.accepts_minors"
                  label="Accepts Minors"
                  color="primary"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-switch
                  v-model="formData.is_featured"
                  label="Featured Program"
                  color="primary"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-switch
                  v-model="formData.is_active"
                  label="Active Program"
                  color="primary"
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
            @click="saveProgram"
          >
            {{ isEditing ? 'Update Program' : 'Create Program' }}
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
const programs = ref([])
const universities = ref([])
const programNames = ref([])
const dialog = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const formValid = ref(false)
const form = ref(null)
const validationErrors = ref([])

// Filters
const filters = reactive({
  search: '',
  university_id: null,
  degree_level: null,
  language: null,
  scholarship_type: null
})

let searchTimeout = null

// Form data
const formData = reactive({
  university_id: null,
  program_name_id: null,
  name: '',
  english_name: '',
  description: '',
  degree_level: '',
  language: '',
  duration_years: null,
  duration_months: null,
  tuition_fee: null,
  accommodation_fee: null,
  scholarship_amount: null,
  scholarship_type: 'none',
  scholarship_description: '',
  application_deadline: '',
  intake_date: '',
  intake_season: '',
  accepts_minors: false,
  min_age: null,
  max_age: null,
  min_gpa: null,
  min_ielts_score: null,
  min_toefl_score: null,
  min_hsk_level: null,
  additional_requirements: '',
  is_featured: false,
  is_active: true,
  
  // New additional fields
  program_id: '',
  scholarship_category: '',
  tuition_fee_unit: 'year',
  accommodation_cost_unit: 'year',
  no_of_semesters_per_year: 2,
  service_fee: 0,
  application_fee: 0,
  teaching_language: 'english',
  program_field: '',
  scholarship_duration: null,
  scholarship_policy: '',
  accept_students_who_come_to_china: true,
  acceptable_student_location: '',
  application_documents: '',
  special_notes: ''
})

const headers = [
  { title: 'Program Name', key: 'name', sortable: true },
  { title: 'University', key: 'university_name', sortable: true },
  { title: 'Degree Level', key: 'degree_level', sortable: true },
  { title: 'Language', key: 'language', sortable: true },
  { title: 'Scholarship', key: 'scholarship_type', sortable: true },
  { title: 'Tuition Fee (¥)', key: 'tuition_fee', sortable: true },
  { title: 'Status', key: 'is_active', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '120px' }
]

// Dropdown options
const degreeLevels = [
  { label: 'Bachelor', value: 'bachelor' },
  { label: 'Master', value: 'master' },
  { label: 'PhD', value: 'phd' },
  { label: 'Language', value: 'language' },
  { label: 'Preparatory', value: 'preparatory' }
]

const languages = [
  { label: 'Chinese', value: 'chinese' },
  { label: 'English', value: 'english' },
  { label: 'Bilingual', value: 'bilingual' }
]

const intakeSeasons = [
  { label: 'Spring', value: 'spring' },
  { label: 'Autumn', value: 'autumn' },
  { label: 'Summer', value: 'summer' },
  { label: 'Winter', value: 'winter' }
]

const teachingLanguages = [
  { label: 'Chinese', value: 'chinese' },
  { label: 'English', value: 'english' }
]

const tuitionFeeUnits = [
  { label: 'Per Semester', value: 'semester' },
  { label: 'Per Year', value: 'year' }
]

const accommodationCostUnits = [
  { label: 'Per Day', value: 'day' },
  { label: 'Per Month', value: 'month' },
  { label: 'Per Semester', value: 'semester' },
  { label: 'Per Year', value: 'year' }
]

const scholarshipTypes = [
  { label: 'None', value: 'none' },
  { label: 'Partial', value: 'partial' },
  { label: 'Full', value: 'full' }
]

const fetchPrograms = async () => {
  loading.value = true
  try {
    const params = { ...filters }
    
    // Remove empty filters
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key]
      }
    })
    
    const response = await api.get('/admin/programs', { params })
    programs.value = response.data.programs
  } catch (error) {
    console.error('Failed to fetch programs:', error)
    programs.value = []
  } finally {
    loading.value = false
  }
}

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchPrograms()
  }, 500)
}

const clearFilters = () => {
  filters.search = ''
  filters.university_id = null
  filters.degree_level = null
  filters.language = null
  filters.scholarship_type = null
  fetchPrograms()
}

const fetchUniversities = async () => {
  try {
    const response = await api.get('/admin/universities')
    universities.value = response.data.universities
  } catch (error) {
    console.error('Failed to fetch universities:', error)
    universities.value = []
  }
}

const fetchProgramNames = async () => {
  try {
    const response = await api.get('/admin/program-names')
    programNames.value = response.data.programNames
  } catch (error) {
    console.error('Failed to fetch program names:', error)
    programNames.value = []
  }
}

const getScholarshipColor = (type) => {
  switch (type) {
    case 'full': return 'success'
    case 'partial': return 'warning'
    default: return 'grey'
  }
}

const getScholarshipLabel = (type) => {
  switch (type) {
    case 'full': return 'Full'
    case 'partial': return 'Partial'
    default: return 'Self-Financed'
  }
}

const getDegreeColor = (level) => {
  switch (level) {
    case 'bachelor': return 'primary'
    case 'master': return 'secondary'
    case 'phd': return 'success'
    case 'language': return 'info'
    default: return 'grey'
  }
}

const getDegreeLabel = (level) => {
  switch (level) {
    case 'bachelor': return 'Bachelor'
    case 'master': return 'Master'
    case 'phd': return 'PhD'
    case 'language': return 'Language'
    case 'preparatory': return 'Preparatory'
    default: return level
  }
}

const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const resetForm = () => {
  Object.keys(formData).forEach(key => {
    if (typeof formData[key] === 'boolean') {
      if (key === 'is_active' || key === 'accept_students_who_come_to_china') {
        formData[key] = true
      } else {
        formData[key] = false
      }
    } else if (key === 'scholarship_type') {
      formData[key] = 'none'
    } else if (key === 'teaching_language') {
      formData[key] = 'english'
    } else if (key === 'tuition_fee_unit') {
      formData[key] = 'year'
    } else if (key === 'accommodation_cost_unit') {
      formData[key] = 'year'
    } else if (key === 'no_of_semesters_per_year') {
      formData[key] = 2
    } else if (key === 'service_fee' || key === 'application_fee') {
      formData[key] = 0
    } else if (typeof formData[key] === 'string') {
      formData[key] = ''
    } else {
      formData[key] = null
    }
  })
  if (form.value) {
    form.value.resetValidation()
  }
}

const onProgramNameChange = (programNameId) => {
  const selectedProgramName = programNames.value.find(pn => pn.id === programNameId)
  if (selectedProgramName) {
    formData.name = selectedProgramName.name
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  resetForm()
  validationErrors.value = []
  dialog.value = true
}

const editProgram = (program) => {
  isEditing.value = true
  resetForm()
  validationErrors.value = []
  
  // Populate form with program data
  Object.keys(formData).forEach(key => {
    if (program[key] !== undefined && program[key] !== null) {
      formData[key] = program[key]
    }
  })
  
  // Format dates for input fields
  if (program.application_deadline) {
    formData.application_deadline = program.application_deadline.split('T')[0]
  }
  if (program.intake_date) {
    formData.intake_date = program.intake_date.split('T')[0]
  }
  
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  resetForm()
  validationErrors.value = []
}

const saveProgram = async () => {
  if (!form.value.validate()) return
  
  saving.value = true
  try {
    const data = { ...formData }
    
    // Set default values for fee fields
    const feeFields = ['tuition_fee', 'accommodation_fee', 'service_fee', 'application_fee']
    feeFields.forEach(field => {
      if (data[field] === '' || data[field] === undefined || data[field] === null) {
        data[field] = 0
      }
    })
    
    // Convert empty strings to null for optional fields
    const optionalFields = [
      'program_name_id', 'english_name', 'description', 'duration_years', 'duration_months',
      'scholarship_amount', 'scholarship_description', 'application_deadline', 'intake_date', 'intake_season',
      'min_age', 'max_age', 'min_gpa', 'min_ielts_score', 'min_toefl_score', 'min_hsk_level',
      'additional_requirements', 'scholarship_category', 'scholarship_duration',
      'scholarship_policy', 'acceptable_student_location', 'special_notes'
    ]
    
    optionalFields.forEach(field => {
      if (data[field] === '' || data[field] === undefined) {
        data[field] = null
      }
    })
    
    if (isEditing.value) {
      // Update existing program
      const programId = programs.value.find(p => p.name === formData.name && p.university_id === formData.university_id)?.id
      if (programId) {
        await api.put(`/programs/${programId}`, data)
      }
    } else {
      // Create new program
      await api.post('/programs', data)
    }
    
    await fetchPrograms()
    closeDialog()
  } catch (error) {
    console.error('Failed to save program:', error)
    validationErrors.value = []
    
    if (error.response?.data?.details) {
      // Handle validation errors
      validationErrors.value = error.response.data.details
    } else if (error.response?.data?.error) {
      // Handle other errors
      validationErrors.value = [error.response.data.error]
    } else if (error.response?.data?.message) {
      // Handle program ID uniqueness error
      validationErrors.value = [error.response.data.message]
    } else {
      validationErrors.value = ['Failed to save program. Please try again.']
    }
  } finally {
    saving.value = false
  }
}

const deleteProgram = async (program) => {
  if (confirm(`Are you sure you want to delete ${program.name}?`)) {
    try {
      await api.delete(`/programs/${program.id}`)
      await fetchPrograms()
    } catch (error) {
      console.error('Failed to delete program:', error)
      alert('Failed to delete program. Please try again.')
    }
  }
}

onMounted(() => {
  fetchPrograms()
  fetchUniversities()
  fetchProgramNames()
})
</script>

<style scoped>
.admin-programs {
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

.v-select :deep(.v-field) {
  border-radius: 8px;
}

.v-chip {
  border-radius: 16px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .admin-programs {
    padding: 16px 0;
  }
  
  .v-card-title {
    font-size: 1.25rem !important;
  }
}
</style>
