<template>
  <div class="programs-page">
    <!-- Page Header -->
    <section class="page-header py-12 bg-primary">
      <v-container>
        <div class="text-center">
          <h1 class="text-h3 text-md-h2 font-weight-bold text-white mb-4 text-uppercase">
            Academic Programs
          </h1>
          <p class="text-h6 text-white opacity-90 max-width-600 mx-auto">
            Explore diverse academic programs offered by top Chinese universities with scholarship opportunities
          </p>
        </div>
      </v-container>
    </section>

    <!-- Quick Filters -->
    <section class="filters-section py-8 bg-grey-lighten-5">
      <v-container>
        <v-card class="pa-6" elevation="2">
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
                v-model="filters.degree_level"
                label="Degree"
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
            <v-col cols="12" md="1">
              <v-btn
                color="primary"
                variant="elevated"
                size="large"
                block
                @click="clearFilters"
              >
                Clear
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </section>

    <!-- Programs Grid -->
    <section class="programs-section py-8">
      <v-container>
        <div v-if="loading" class="py-8">
          <v-row>
            <v-col
              v-for="n in 6"
              :key="n"
              cols="12"
              sm="6"
              lg="4"
              xl="4"
            >
              <v-card class="program-card loading" elevation="2">
                <v-skeleton-loader
                  type="image"
                  height="120"
                  class="mb-4"
                />
                <v-card-text class="pa-4">
                  <div class="d-flex align-center mb-2">
                    <v-skeleton-loader
                      type="chip"
                      width="80"
                      height="24"
                      class="mr-2"
                    />
                    <v-skeleton-loader
                      type="chip"
                      width="60"
                      height="24"
                    />
                  </div>
                  <v-skeleton-loader
                    type="heading"
                    width="70%"
                    class="mb-2"
                  />
                  <v-skeleton-loader
                    type="text"
                    width="90%"
                    class="mb-3"
                  />
                  <div class="program-details">
                    <v-skeleton-loader
                      type="text"
                      width="60%"
                      class="mb-1"
                    />
                    <v-skeleton-loader
                      type="text"
                      width="50%"
                      class="mb-1"
                    />
                    <v-skeleton-loader
                      type="text"
                      width="40%"
                      class="mb-1"
                    />
                    <v-skeleton-loader
                      type="text"
                      width="80%"
                    />
                  </div>
                </v-card-text>
                <v-card-actions class="pa-4 pt-0">
                  <v-skeleton-loader
                    type="button"
                    width="100%"
                  />
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div v-else-if="programs.length === 0" class="text-center py-12">
          <v-icon size="64" color="grey">mdi-school</v-icon>
          <h3 class="text-h5 mt-4">No programs found</h3>
          <p class="text-body-1 text-grey-darken-1">
            Try adjusting your search criteria
          </p>
        </div>

        <v-row v-else>
          <v-col
            v-for="program in programs"
            :key="program.id"
            cols="12"
            sm="6"
            lg="4"
            xl="4"
          >
            <v-card
              class="program-card h-100"
              elevation="2"
              @click="() => goToProgram(program.id)"
            >
              <v-img
                :src="program.university_banner || '/university-banner-placeholder.png'"
                height="120"
                cover
                class="d-flex align-center justify-center"
                loading="lazy"
                :alt="`${program.university_name} banner`"
              >
                <div v-if="!program.university_banner" class="text-center">
                  <v-icon size="48" color="primary">mdi-school</v-icon>
                </div>
              </v-img>
              
              <v-card-text class="pa-4">
                <div class="d-flex align-center mb-2">
                  <v-chip
                    :color="getScholarshipColor(program.scholarship_type)"
                    size="small"
                    variant="flat"
                    class="mr-2"
                  >
                    {{ getScholarshipLabel(program.scholarship_type) }}
                  </v-chip>
                  <v-chip
                    :color="getDegreeColor(program.degree_level)"
                    size="small"
                    variant="outlined"
                  >
                    {{ getDegreeLabel(program.degree_level) }}
                  </v-chip>
                </div>
                
                <h4 class="text-h6 font-weight-medium mb-2">
                  {{ program.name }}
                </h4>
                
                <p class="text-body-2 text-grey-darken-1 mb-3">
                  {{ program.university_name }}
                </p>
                
                <div class="program-details">
                  <div class="d-flex align-center mb-1">
                    <v-icon size="16" class="mr-2 text-grey-darken-1">mdi-map-marker</v-icon>
                    <span class="text-caption">{{ program.city_name }}</span>
                  </div>
                  <div class="d-flex align-center mb-1">
                    <v-icon size="16" class="mr-2 text-grey-darken-1">mdi-translate</v-icon>
                    <span class="text-caption">{{ getLanguageLabel(program.language) }}</span>
                  </div>
                  <div v-if="program.tuition_fee" class="d-flex align-center mb-1">
                    <v-icon size="16" class="mr-2 text-success">mdi-currency-cny</v-icon>
                    <span class="text-caption text-success">¥{{ formatNumber(program.tuition_fee) }}/year</span>
                  </div>
                  <div v-if="program.application_deadline" class="d-flex align-center">
                    <v-icon size="16" class="mr-2 text-error">mdi-calendar-alert</v-icon>
                    <span class="text-caption text-error">Deadline: {{ formatDate(program.application_deadline) }}</span>
                  </div>
                </div>
              </v-card-text>
              
              <v-card-actions class="pa-4 pt-0">
                <v-btn
                  color="primary"
                  variant="elevated"
                  block
                  @click.stop="goToProgram(program.id)"
                >
                  View Details
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="text-center mt-8">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
            color="primary"
            size="large"
            @update:model-value="fetchPrograms"
          />
          <div class="mt-2 text-caption text-grey-darken-1">
            Showing {{ programs.length }} of {{ totalPrograms }} programs • Page {{ currentPage }} of {{ totalPages }}
          </div>
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
const universities = ref([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const totalPrograms = ref(0)

const filters = reactive({
  search: '',
  degree_level: null,
  language: null,
  scholarship_type: null,
  university_id: null
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

let searchTimeout = null

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchPrograms()
  }, 500)
}

const fetchPrograms = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: 6, // Show 6 programs per page
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
    totalPrograms.value = response.data.total || 0
  } catch (error) {
    console.error('Failed to fetch programs:', error)
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
      },
      {
        id: 3,
        name: 'Chinese Language Program',
        university_name: 'Fudan University',
        university_logo: null,
        city_name: 'Shanghai',
        degree_level: 'language',
        language: 'chinese',
        scholarship_type: 'full',
        tuition_fee: 15000,
        application_deadline: '2024-02-28'
      },
      {
        id: 4,
        name: 'Engineering',
        university_name: 'Shanghai Jiao Tong University',
        university_logo: null,
        city_name: 'Shanghai',
        degree_level: 'phd',
        language: 'english',
        scholarship_type: 'full',
        tuition_fee: 35000,
        application_deadline: '2024-05-15'
      }
    ]
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

const fetchUniversities = async () => {
  try {
    const response = await api.get('/universities?limit=50')
    universities.value = response.data.universities
  } catch (error) {
    console.error('Failed to fetch universities:', error)
    // Fallback data
    universities.value = [
      { id: 1, name: 'Tsinghua University' },
      { id: 2, name: 'Peking University' },
      { id: 3, name: 'Fudan University' },
      { id: 4, name: 'Shanghai Jiao Tong University' }
    ]
  }
}

const clearFilters = () => {
  filters.search = ''
  filters.degree_level = null
  filters.language = null
  filters.scholarship_type = null
  filters.university_id = null
  currentPage.value = 1
  fetchPrograms()
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
    case 'full': return 'Full Scholarship'
    case 'partial': return 'Partial Scholarship'
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


const goToProgram = (id) => {
  router.push(`/program/${id}`)
}

onMounted(() => {
  fetchPrograms()
  fetchUniversities()
})
</script>

<style scoped>
.programs-page {
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

.program-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.program-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.program-details {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 12px;
  margin-top: 12px;
}

.v-card {
  border-radius: 12px;
}

/* Optimize image loading */
.v-img {
  background-color: #f5f5f5;
}

/* Smooth transitions for lazy loading */
.program-card {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.program-card.loading {
  opacity: 0.7;
}

/* Optimize scroll performance */
.programs-section {
  contain: layout style paint;
}
</style>
