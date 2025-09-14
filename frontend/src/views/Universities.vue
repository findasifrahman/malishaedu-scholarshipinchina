<template>
  <div class="universities-page">
    <!-- Page Header -->
    <section class="page-header py-12 bg-primary">
      <v-container>
        <div class="text-center">
          <h1 class="text-h3 text-md-h2 font-weight-bold text-white mb-4 text-uppercase">
            Universities
          </h1>
          <p class="text-h6 text-white opacity-90 max-width-600 mx-auto">
            Discover top Chinese universities offering world-class education and scholarship opportunities
          </p>
        </div>
      </v-container>
    </section>

    <!-- Filters and Search -->
    <section class="filters-section py-8 bg-grey-lighten-5">
      <v-container>
        <v-card class="pa-6" elevation="2">
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="filters.search"
                label="Search universities"
                variant="outlined"
                prepend-inner-icon="mdi-magnify"
                clearable
                @input="debouncedSearch"
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
                @update:model-value="fetchUniversities"
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
                @update:model-value="fetchUniversities"
              />
            </v-col>
            <v-col cols="12" md="2">
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

    <!-- Universities Grid -->
    <section class="universities-section py-8">
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
              <v-card class="university-card loading" elevation="2">
                <v-skeleton-loader
                  type="image"
                  height="200"
                  class="mb-4"
                />
                <v-card-text class="pa-4">
                  <div class="d-flex align-center mb-3">
                    <v-skeleton-loader
                      type="avatar"
                      width="40"
                      height="40"
                      class="mr-3"
                    />
                    <div class="flex-grow-1">
                      <v-skeleton-loader
                        type="heading"
                        width="80%"
                        class="mb-1"
                      />
                      <v-skeleton-loader
                        type="text"
                        width="60%"
                      />
                    </div>
                  </div>
                  <v-skeleton-loader
                    type="paragraph"
                    class="mb-4"
                  />
                  <div class="university-stats">
                    <v-skeleton-loader
                      type="text"
                      width="40%"
                      class="mb-2"
                    />
                    <v-skeleton-loader
                      type="text"
                      width="30%"
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

        <div v-else-if="universities.length === 0" class="text-center py-12">
          <v-icon size="64" color="grey">mdi-school</v-icon>
          <h3 class="text-h5 mt-4">No universities found</h3>
          <p class="text-body-1 text-grey-darken-1">
            Try adjusting your search criteria
          </p>
        </div>

        <v-row v-else>
          <v-col
            v-for="university in universities"
            :key="university.id"
            cols="12"
            sm="6"
            lg="4"
            xl="4"
          >
            <v-card
              class="university-card h-100"
              elevation="2"
              @click="goToUniversity(university.id)"
            >
              <v-img
                :src="university.banner_image_url || '/university-banner.jpg'"
                height="200"
                cover
                class="d-flex align-center justify-center"
                loading="lazy"
                :alt="`${university.name} banner`"
              >
                <div v-if="university.is_featured" class="featured-badge">
                  <v-chip color="primary" size="small" variant="flat">
                    Featured
                  </v-chip>
                </div>
              </v-img>

              <v-card-text class="pa-4">
                <div class="d-flex align-center mb-3">
                  <v-avatar size="40" class="mr-3">
                    <v-img
                      v-if="university.logo_url"
                      :src="university.logo_url"
                      :alt="`${university.name} logo`"
                      loading="lazy"
                    />
                    <v-icon v-else color="primary">mdi-school</v-icon>
                  </v-avatar>
                  <div>
                    <h3 class="text-h6 font-weight-medium mb-1">
                      {{ university.name }}
                    </h3>
                    <p class="text-caption text-grey-darken-1">
                      {{ university.city_name }}, {{ university.city_province }}
                    </p>
                  </div>
                </div>

                <p class="text-body-2 text-grey-darken-1 mb-4 line-clamp-3">
                  {{ university.description || 'No description available' }}
                </p>

                <div class="university-stats">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-caption text-grey-darken-1">Type</span>
                    <v-chip
                      :color="getTypeColor(university.type)"
                      size="x-small"
                      variant="outlined"
                    >
                      {{ getTypeLabel(university.type) }}
                    </v-chip>
                  </div>
                  <div v-if="university.ranking" class="d-flex justify-space-between align-center">
                    <span class="text-caption text-grey-darken-1">Ranking</span>
                    <span class="text-caption font-weight-medium">#{{ university.ranking }}</span>
                  </div>
                </div>
              </v-card-text>

              <v-card-actions class="pa-4 pt-0">
                <v-btn
                  color="primary"
                  variant="elevated"
                  block
                  @click.stop="goToUniversity(university.id)"
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
            @update:model-value="fetchUniversities"
          />
          <div class="mt-2 text-caption text-grey-darken-1">
            Showing {{ universities.length }} of {{ totalUniversities }} universities • Page {{ currentPage }} of {{ totalPages }}
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

const universities = ref([])
const cities = ref([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const totalUniversities = ref(0)


const filters = reactive({
  search: '',
  city_id: null,
  is_featured: null
})

const featuredOptions = [
  { label: 'Featured Only', value: true },
  { label: 'All Universities', value: false }
]

let searchTimeout = null

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchUniversities()
  }, 500)
}

const fetchUniversities = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      limit: 6, // Show 6 universities per page
      ...filters
    }

    // Remove empty filters
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '') {
        delete params[key]
      }
    })

    const response = await api.get('/universities', { params })
    universities.value = response.data.universities
    totalPages.value = response.data.totalPages
    totalUniversities.value = response.data.total || 0
  } catch (error) {
    console.error('Failed to fetch universities:', error)
    // Fallback data for demo
    universities.value = [
      {
        id: 1,
        name: 'Tsinghua University',
        description: 'A leading research university in China, known for its excellence in science, technology, and engineering.',
        city_name: 'Beijing',
        city_province: 'Beijing',
        type: 'public',
        ranking: 1,
        is_featured: true,
        logo_url: null,
        banner_image_url: null
      },
      {
        id: 2,
        name: 'Peking University',
        description: 'One of China\'s most prestigious universities, renowned for its comprehensive academic programs.',
        city_name: 'Beijing',
        city_province: 'Beijing',
        type: 'public',
        ranking: 2,
        is_featured: true,
        logo_url: null,
        banner_image_url: null
      }
    ]
    totalPages.value = 1
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
    // Fallback data
    cities.value = [
      { id: 1, name: 'Beijing' },
      { id: 2, name: 'Shanghai' },
      { id: 3, name: 'Guangzhou' },
      { id: 4, name: 'Shenzhen' }
    ]
  }
}

const clearFilters = () => {
  filters.search = ''
  filters.city_id = null
  filters.is_featured = null
  currentPage.value = 1
  fetchUniversities()
}

const getTypeColor = (type) => {
  switch (type) {
    case 'public': return 'primary'
    case 'private': return 'secondary'
    case 'international': return 'success'
    default: return 'grey'
  }
}

const getTypeLabel = (type) => {
  switch (type) {
    case 'public': return 'Public'
    case 'private': return 'Private'
    case 'international': return 'International'
    default: return type
  }
}

const goToUniversity = (id) => {
  router.push(`/university/${id}`)
}


onMounted(() => {
  fetchUniversities()
  fetchCities()
})
</script>

<style scoped>
.universities-page {
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

.university-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.university-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.featured-badge {
  position: absolute;
  top: 12px;
  right: 12px;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.university-stats {
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
.university-card {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.university-card.loading {
  opacity: 0.7;
}

/* Optimize scroll performance */
.universities-section {
  contain: layout style paint;
}

</style>
