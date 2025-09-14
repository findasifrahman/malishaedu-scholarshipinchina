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

    <!-- Statistics Cards Section -->
    <section class="stats-section py-8 bg-grey-lighten-4">
      <v-container>
        <h2 class="text-h5 font-weight-bold mb-6 text-center">Scholarship Insights</h2>
        <v-row>
          <!-- Recently Added Program Card -->
          <v-col cols="12" md="4">
            <v-card class="stats-card recent-card" elevation="4">
              <div class="card-header">
                <v-icon color="primary" size="32" class="header-icon">mdi-clock-outline</v-icon>
                <div class="header-text">
                  <h3 class="text-h6 font-weight-bold">Recently Added</h3>
                  <p class="text-caption text-grey">Latest Program</p>
                </div>
              </div>
              <v-card-text class="card-content">
                <div v-if="recentProgram" class="text-center">
                  <v-icon color="primary" size="48" class="mb-3">mdi-school</v-icon>
                  <div class="text-h6 font-weight-bold mb-2">{{ recentProgram.name }}</div>
                  <div class="d-flex align-center justify-center mb-2">
                    <v-icon color="grey" size="16" class="mr-1">mdi-domain</v-icon>
                    <span class="text-body-2 text-grey-darken-1">{{ recentProgram.university_name }}</span>
                  </div>
                  <div class="d-flex align-center justify-center mb-3">
                    <v-icon color="grey" size="16" class="mr-1">mdi-map-marker</v-icon>
                    <span class="text-caption text-grey">{{ recentProgram.city_name }}</span>
                  </div>
                  <v-chip 
                    :color="getScholarshipColor(recentProgram.scholarship_type)" 
                    size="small" 
                    class="font-weight-bold"
                  >
                    <v-icon size="16" class="mr-1">mdi-trophy</v-icon>
                    {{ getScholarshipLabel(recentProgram.scholarship_type) }}
                  </v-chip>
                </div>
                <div v-else class="text-center text-grey">
                  <v-icon size="64" color="grey">mdi-school-off</v-icon>
                  <p class="mt-2 text-body-2">No recent programs</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Most Applied Program Card -->
          <v-col cols="12" md="4">
            <v-card class="stats-card applied-card" elevation="4">
              <div class="card-header">
                <v-icon color="success" size="32" class="header-icon">mdi-trending-up</v-icon>
                <div class="header-text">
                  <h3 class="text-h6 font-weight-bold">Most Applied Program</h3>
                  <p class="text-caption text-grey">This Week</p>
                </div>
              </div>
              <v-card-text class="card-content">
                <div v-if="mostAppliedProgram" class="text-center">
                  <v-icon color="success" size="48" class="mb-3">mdi-chart-line-variant</v-icon>
                  <div class="text-h6 font-weight-bold mb-2">{{ mostAppliedProgram.name }}</div>
                  <div class="d-flex align-center justify-center mb-2">
                    <v-icon color="grey" size="16" class="mr-1">mdi-domain</v-icon>
                    <span class="text-body-2 text-grey-darken-1">{{ mostAppliedProgram.university_name }}</span>
                  </div>
                  <div class="d-flex align-center justify-center mb-3">
                    <v-icon color="grey" size="16" class="mr-1">mdi-map-marker</v-icon>
                    <span class="text-caption text-grey">{{ mostAppliedProgram.city_name }}</span>
                  </div>
                  <div class="mt-3">
                    <v-chip color="success" size="large" class="font-weight-bold">
                      <v-icon size="20" class="mr-2">mdi-account-group</v-icon>
                      {{ mostAppliedProgram.application_count }} Students Applied
                    </v-chip>
                  </div>
                </div>
                <div v-else class="text-center text-grey">
                  <v-icon size="64" color="grey">mdi-chart-line-variant</v-icon>
                  <p class="mt-2 text-body-2">No applications this week</p>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Student Registration Chart Card -->
          <v-col cols="12" md="4">
            <v-card class="stats-card chart-card" elevation="4">
              <div class="card-header">
                <v-icon color="info" size="32" class="header-icon">mdi-chart-bar</v-icon>
                <div class="header-text">
                  <h3 class="text-h6 font-weight-bold">Weekly Registrations</h3>
                  <p class="text-caption text-grey">Last 7 Days</p>
                </div>
              </div>
              <v-card-text class="card-content">
                <div class="registration-chart">
                  <div 
                    v-for="(day, index) in weeklyRegistrations" 
                    :key="index"
                    class="chart-bar"
                    :class="`day-${index}`"
                    :style="{ height: getBarHeight(day.count) + '%' }"
                    :title="`${day.day}: ${day.count} registrations`"
                  >
                    <div class="bar-value">{{ day.count }}</div>
                  </div>
                </div>
                <div class="chart-labels mt-2">
                  <span v-for="day in weeklyRegistrations" :key="day.day" class="chart-label">
                    {{ day.day }}
                  </span>
                </div>
                <div class="mt-3 text-center">
                  <v-chip color="info" size="small" class="font-weight-bold">
                    <v-icon size="16" class="mr-1">mdi-account-plus</v-icon>
                    Total: {{ getTotalRegistrations() }} Students
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
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

// Statistics data
const recentProgram = ref(null)
const mostAppliedProgram = ref(null)
const weeklyRegistrations = ref([])

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

// Statistics methods
const fetchRecentProgram = async () => {
  try {
    const response = await api.get('/programs?limit=1&sort=created_at_desc')
    if (response.data.programs.length > 0) {
      recentProgram.value = response.data.programs[0]
    }
  } catch (error) {
    console.error('Failed to fetch recent program:', error)
    // Fallback data
    recentProgram.value = {
      name: 'Computer Science',
      university_name: 'Tsinghua University',
      city_name: 'Beijing',
      scholarship_type: 'full'
    }
  }
}

const fetchMostAppliedProgram = async () => {
  try {
    const response = await api.get('/statistics/most-applied-program')
    mostAppliedProgram.value = response.data
  } catch (error) {
    console.error('Failed to fetch most applied program:', error)
    // Fallback data
    mostAppliedProgram.value = {
      name: 'International Business',
      university_name: 'Peking University',
      city_name: 'Beijing',
      application_count: 15
    }
  }
}

const fetchWeeklyRegistrations = async () => {
  try {
    const response = await api.get('/statistics/weekly-registrations')
    weeklyRegistrations.value = response.data
  } catch (error) {
    console.error('Failed to fetch weekly registrations:', error)
    // Fallback data - last 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    weeklyRegistrations.value = days.map(day => ({
      day,
      count: Math.floor(Math.random() * 20) + 5
    }))
  }
}

const getBarHeight = (count) => {
  if (!weeklyRegistrations.value.length) return 0
  const maxCount = Math.max(...weeklyRegistrations.value.map(d => d.count))
  return maxCount > 0 ? (count / maxCount) * 100 : 0
}

const getTotalRegistrations = () => {
  return weeklyRegistrations.value.reduce((total, day) => total + day.count, 0)
}

onMounted(() => {
  searchPrograms()
  fetchCities()
  fetchUniversities()
  fetchRecentProgram()
  fetchMostAppliedProgram()
  fetchWeeklyRegistrations()
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

/* Statistics Cards Styles */
.stats-card {
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 16px !important;
  overflow: hidden;
  position: relative;
}

.stats-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15) !important;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 20px 20px 0 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.header-icon {
  margin-right: 12px;
  padding: 8px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-text h3 {
  margin: 0;
  line-height: 1.2;
}

.header-text p {
  margin: 0;
  margin-top: 2px;
}

.card-content {
  padding: 20px !important;
}

/* Card-specific styles */
.recent-card {
  background: linear-gradient(135deg, #f8f9ff, #ffffff);
}

.recent-card .header-icon {
  background: linear-gradient(135deg, #068b76, #0a9b85);
  color: white !important;
}

.applied-card {
  background: linear-gradient(135deg, #f0fff4, #ffffff);
}

.applied-card .header-icon {
  background: linear-gradient(135deg, #4caf50, #66bb6a);
  color: white !important;
}

.chart-card {
  background: linear-gradient(135deg, #f0f8ff, #ffffff);
}

.chart-card .header-icon {
  background: linear-gradient(135deg, #2196f3, #42a5f5);
  color: white !important;
}

/* Registration Chart Styles */
.registration-chart {
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 120px;
  padding: 0 8px;
  margin-bottom: 8px;
}

.chart-bar {
  flex: 1;
  margin: 0 2px;
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
}

/* Different colors for each day */
.day-0 {
  background: linear-gradient(to top, #ff6b6b, #ff8e8e);
}

.day-1 {
  background: linear-gradient(to top, #4ecdc4, #6ed5cd);
}

.day-2 {
  background: linear-gradient(to top, #45b7d1, #6bc5d8);
}

.day-3 {
  background: linear-gradient(to top, #96ceb4, #a8d5c0);
}

.day-4 {
  background: linear-gradient(to top, #feca57, #fed976);
}

.day-5 {
  background: linear-gradient(to top, #ff9ff3, #ffb3f3);
}

.day-6 {
  background: linear-gradient(to top, #54a0ff, #74b0ff);
}

.chart-bar:hover {
  transform: scaleY(1.05);
  filter: brightness(1.1);
}

.bar-value {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
}

.chart-label {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .stats-card {
    margin-bottom: 16px;
  }
  
  .registration-chart {
    height: 100px;
  }
  
  .bar-value {
    font-size: 10px;
    top: -18px;
  }
}
</style>
