<template>
  <div class="scholarship-page">
    <!-- Page Header -->
    <section class="page-header py-12 bg-primary">
      <v-container>
        <div class="text-center">
          <h1 class="text-h3 text-md-h2 font-weight-bold text-white mb-4 text-uppercase">
            Scholarship Search
          </h1>
          <p class="text-h6 text-white opacity-90 max-width-600 mx-auto">
            Find the perfect scholarship program that matches your academic goals and financial needs
          </p>
        </div>
      </v-container>
    </section>

    <!-- Advanced Filters -->
    <section class="filters-section py-8 bg-grey-lighten-5">
      <v-container>
        <v-card class="pa-6" elevation="2">
          <h3 class="text-h5 font-weight-bold mb-6">Advanced Search Filters</h3>
          
          <v-row>
            <!-- Degree Level -->
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filters.degree_level"
                label="Degree Level"
                variant="outlined"
                :items="degreeLevels"
                item-title="label"
                item-value="value"
                clearable
                @update:model-value="searchPrograms"
              />
            </v-col>

            <!-- Language -->
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filters.language"
                label="Language"
                variant="outlined"
                :items="languages"
                item-title="label"
                item-value="value"
                clearable
                @update:model-value="searchPrograms"
              />
            </v-col>

            <!-- Scholarship Type -->
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filters.scholarship_type"
                label="Scholarship Type"
                variant="outlined"
                :items="scholarshipTypes"
                item-title="label"
                item-value="value"
                clearable
                @update:model-value="searchPrograms"
              />
            </v-col>

            <!-- Intake Season -->
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filters.intake_season"
                label="Intake Season"
                variant="outlined"
                :items="intakeSeasons"
                item-title="label"
                item-value="value"
                clearable
                @update:model-value="searchPrograms"
              />
            </v-col>

            <!-- City -->
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filters.city_id"
                label="City"
                variant="outlined"
                :items="cities"
                item-title="name"
                item-value="id"
                clearable
                @update:model-value="searchPrograms"
              />
            </v-col>

            <!-- University -->
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filters.university_id"
                label="University"
                variant="outlined"
                :items="universities"
                item-title="name"
                item-value="id"
                clearable
                @update:model-value="searchPrograms"
              />
            </v-col>

            <!-- Accepts Minors -->
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filters.accepts_minors"
                label="Accepts Minors"
                variant="outlined"
                :items="acceptsMinorsOptions"
                item-title="label"
                item-value="value"
                clearable
                @update:model-value="searchPrograms"
              />
            </v-col>

            <!-- Keyword Search -->
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model="filters.search"
                label="Keyword Search"
                variant="outlined"
                prepend-inner-icon="mdi-magnify"
                clearable
                @input="debouncedSearch"
              />
            </v-col>
          </v-row>

          <div class="d-flex justify-space-between align-center mt-6">
            <v-btn
              color="primary"
              variant="elevated"
              @click="searchPrograms"
            >
              <v-icon class="mr-2">mdi-magnify</v-icon>
              Search Scholarships
            </v-btn>
            <v-btn
              color="secondary"
              variant="outlined"
              @click="clearFilters"
            >
              Clear All Filters
            </v-btn>
          </div>
        </v-card>
      </v-container>
    </section>

    <!-- Results Section -->
    <section class="results-section py-8">
      <v-container>
        <!-- Results Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h2 class="text-h5 font-weight-bold">
              Scholarship Programs
            </h2>
            <p class="text-body-2 text-grey-darken-1">
              {{ totalResults }} programs found
            </p>
          </div>
          <v-select
            v-model="sortBy"
            label="Sort by"
            variant="outlined"
            :items="sortOptions"
            item-title="label"
            item-value="value"
            style="max-width: 200px"
            @update:model-value="searchPrograms"
          />
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <v-progress-circular
            color="primary"
            size="64"
            indeterminate
          />
          <p class="text-h6 mt-4">Searching scholarships...</p>
        </div>

        <!-- No Results -->
        <div v-else-if="programs.length === 0" class="text-center py-12">
          <v-icon size="64" color="grey">mdi-school</v-icon>
          <h3 class="text-h5 mt-4">No scholarships found</h3>
          <p class="text-body-1 text-grey-darken-1">
            Try adjusting your search criteria or clear the filters
          </p>
          <v-btn
            color="primary"
            variant="elevated"
            class="mt-4"
            @click="clearFilters"
          >
            Clear Filters
          </v-btn>
        </div>

        <!-- Results Table -->
        <v-card v-else elevation="2">
          <v-data-table
            :headers="headers"
            :items="programs"
            :loading="loading"
            class="scholarship-table"
            @click:row="(event, { item }) => goToProgram(item.id)"
          >
            <!-- University Column -->
            <template v-slot:item.university_name="{ item }">
              <div class="d-flex align-center">
                <v-avatar size="32" class="mr-3">
                  <v-img
                    v-if="item.university_logo"
                    :src="item.university_logo"
                    :alt="item.university_name"
                  />
                  <v-icon v-else color="primary">mdi-school</v-icon>
                </v-avatar>
                <div>
                  <div class="text-body-2 font-weight-medium">
                    {{ item.university_name }}
                  </div>
                  <div class="text-caption text-grey-darken-1">
                    {{ item.city_name }}
                  </div>
                </div>
              </div>
            </template>

            <!-- Program Name Column -->
            <template v-slot:item.name="{ item }">
              <div>
                <div class="text-body-2 font-weight-medium">
                  {{ item.name }}
                </div>
                <div class="text-caption text-grey-darken-1">
                  {{ getDegreeLabel(item.degree_level) }}
                </div>
              </div>
            </template>

            <!-- Scholarship Type Column -->
            <template v-slot:item.scholarship_type="{ item }">
              <v-chip
                :color="getScholarshipColor(item.scholarship_type)"
                size="small"
                variant="flat"
              >
                {{ getScholarshipLabel(item.scholarship_type) }}
              </v-chip>
            </template>

            <!-- Language Column -->
            <template v-slot:item.language="{ item }">
              <v-chip
                :color="getLanguageColor(item.language)"
                size="small"
                variant="outlined"
              >
                {{ getLanguageLabel(item.language) }}
              </v-chip>
            </template>

            <!-- Tuition Fee Column -->
            <template v-slot:item.tuition_fee="{ item }">
              <div v-if="item.tuition_fee" class="text-body-2 text-success">
                ¥{{ formatNumber(item.tuition_fee) }}
              </div>
              <div v-else class="text-caption text-grey">
                Not specified
              </div>
            </template>

            <!-- Application Deadline Column -->
            <template v-slot:item.application_deadline="{ item }">
              <div v-if="item.application_deadline" class="text-body-2 text-error">
                {{ formatDate(item.application_deadline) }}
              </div>
              <div v-else class="text-caption text-grey">
                Not specified
              </div>
            </template>

            <!-- Actions Column -->
            <template v-slot:item.actions="{ item }">
              <v-btn
                color="primary"
                variant="outlined"
                size="small"
                @click.stop="goToProgram(item.id)"
              >
                View Details
              </v-btn>
            </template>
          </v-data-table>
        </v-card>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="text-center mt-8">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            color="primary"
            @update:model-value="searchPrograms"
          />
        </div>
      </v-container>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const programs = ref([])
const cities = ref([])
const universities = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(1)
const totalResults = ref(0)
const sortBy = ref('created_at')

const filters = reactive({
  degree_level: null,
  language: null,
  scholarship_type: null,
  intake_season: null,
  city_id: null,
  university_id: null,
  accepts_minors: null,
  search: ''
})

const degreeLevels = [
  { label: 'Bachelor', value: 'bachelor' },
  { label: 'Master', value: 'master' },
  { label: 'PhD', value: 'phd' },
  { label: 'Language Program', value: 'language' },
  { label: 'Preparatory', value: 'preparatory' }
]

const languages = [
  { label: 'Chinese', value: 'chinese' },
  { label: 'English', value: 'english' },
  { label: 'Bilingual', value: 'bilingual' }
]

const scholarshipTypes = [
  { label: 'Full Scholarship', value: 'full' },
  { label: 'Partial Scholarship', value: 'partial' },
  { label: 'Self-Financed', value: 'none' }
]

const intakeSeasons = [
  { label: 'Spring', value: 'spring' },
  { label: 'Autumn', value: 'autumn' },
  { label: 'Summer', value: 'summer' },
  { label: 'Winter', value: 'winter' }
]

const acceptsMinorsOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false }
]

const sortOptions = [
  { label: 'Newest First', value: 'created_at' },
  { label: 'Oldest First', value: 'created_at_asc' },
  { label: 'University Name', value: 'university_name' },
  { label: 'Program Name', value: 'name' }
]

const headers = [
  { title: 'University', key: 'university_name', sortable: false },
  { title: 'Program', key: 'name', sortable: false },
  { title: 'Scholarship', key: 'scholarship_type', sortable: false },
  { title: 'Language', key: 'language', sortable: false },
  { title: 'Tuition Fee', key: 'tuition_fee', sortable: false },
  { title: 'Deadline', key: 'application_deadline', sortable: false },
  { title: 'Actions', key: 'actions', sortable: false }
]

let searchTimeout = null

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    searchPrograms()
  }, 500)
}

const searchPrograms = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: 20,
      sort: sortBy.value,
      ...filters
    }

    // Remove empty filters
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key]
      }
    })

    const response = await api.get('/programs', { params })
    programs.value = response.data.programs
    totalPages.value = response.data.totalPages
    totalResults.value = response.data.total
  } catch (error) {
    console.error('Failed to search programs:', error)
    // Fallback data for demo
    programs.value = [
      {
        id: 1,
        name: 'Computer Science',
        university_name: 'Tsinghua University',
        university_logo: null,
        city_name: 'Beijing',
        degree_level: 'master',
        language: 'english',
        scholarship_type: 'full',
        tuition_fee: 30000,
        application_deadline: '2024-03-15'
      },
      {
        id: 2,
        name: 'International Business',
        university_name: 'Peking University',
        university_logo: null,
        city_name: 'Beijing',
        degree_level: 'bachelor',
        language: 'bilingual',
        scholarship_type: 'partial',
        tuition_fee: 25000,
        application_deadline: '2024-04-30'
      }
    ]
    totalPages.value = 1
    totalResults.value = programs.value.length
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

const fetchUniversities = async () => {
  try {
    const response = await api.get('/universities?limit=100')
    universities.value = response.data.universities
  } catch (error) {
    console.error('Failed to fetch universities:', error)
  }
}

const clearFilters = () => {
  Object.keys(filters).forEach(key => {
    filters[key] = null
  })
  filters.search = ''
  currentPage.value = 1
  searchPrograms()
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

const getLanguageColor = (language) => {
  switch (language) {
    case 'chinese': return 'primary'
    case 'english': return 'secondary'
    case 'bilingual': return 'success'
    default: return 'grey'
  }
}

const getLanguageLabel = (language) => {
  switch (language) {
    case 'chinese': return 'Chinese'
    case 'english': return 'English'
    case 'bilingual': return 'Bilingual'
    default: return language
  }
}

const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}


const goToProgram = (programId) => {
  router.push(`/program/${programId}`)
}

onMounted(() => {
  searchPrograms()
  fetchCities()
  fetchUniversities()
})
</script>

<style scoped>
.scholarship-page {
  min-height: 100vh;
  background-color: #fafafa;
}

.page-header {
  margin-top: -80px;
  padding-top: 80px;
}

.opacity-90 {
  opacity: 0.9;
}

.max-width-600 {
  max-width: 600px;
}

.scholarship-table {
  cursor: pointer;
}

.scholarship-table tbody tr:hover {
  background-color: rgba(6, 139, 118, 0.04);
}

.v-card {
  border-radius: 12px;
}

.v-data-table {
  border-radius: 12px;
}
</style>
