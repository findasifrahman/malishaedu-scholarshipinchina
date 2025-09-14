<template>
  <section class="py-16">
    <v-container>
      <div class="text-center mb-12">
        <h2 class="text-h3 text-md-h2 font-weight-bold text-primary mb-4 text-uppercase">
          Hot Programs
        </h2>
        <p class="text-h6 text-grey-darken-1 max-width-600 mx-auto">
          Explore the most popular scholarship programs and academic opportunities
        </p>
      </div>

      <!-- Program Tabs -->
      <v-tabs
        v-model="activeTab"
        color="primary"
        align-tabs="center"
        class="mb-8"
      >
        <v-tab
          v-for="tab in programTabs"
          :key="tab.value"
          :value="tab.value"
          class="text-h6"
        >
          <v-icon class="mr-2">{{ tab.icon }}</v-icon>
          {{ tab.label }}
        </v-tab>
      </v-tabs>

      <!-- Program Content -->
      <v-window v-model="activeTab">
        <v-window-item
          v-for="tab in programTabs"
          :key="tab.value"
          :value="tab.value"
        >
          <v-row>
            <v-col
              v-for="program in getProgramsByTab(tab.value)"
              :key="program.id"
              cols="12"
              sm="6"
              lg="4"
            >
              <v-card
                class="program-card h-100"
                elevation="2"
                @click="() => goToProgram(program.id)"
              >
                <v-img
                  :src="program.university_logo || '/university-placeholder.png'"
                  height="120"
                  cover
                  class="d-flex align-center justify-center"
                >
                  <div v-if="!program.university_logo" class="text-center">
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
                    <div v-if="program.tuition_fee" class="d-flex align-center">
                      <v-icon size="16" class="mr-2 text-grey-darken-1">mdi-currency-cny</v-icon>
                      <span class="text-caption">¥{{ formatNumber(program.tuition_fee) }}/year</span>
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
        </v-window-item>
      </v-window>

      <!-- View All Programs Button -->
      <div class="text-center mt-8">
        <v-btn
          to="/programs"
          color="primary"
          variant="elevated"
          size="large"
          class="px-8"
        >
          View All Programs
        </v-btn>
      </div>
    </v-container>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const activeTab = ref('full_scholarship')
const programs = ref([])
const loading = ref(true)

const programTabs = [
  { value: 'full_scholarship', label: 'Full Scholarship', icon: 'mdi-trophy' },
  { value: 'issp', label: 'ISSP', icon: 'mdi-school' },
  { value: 'hot_majors', label: 'Hot Majors', icon: 'mdi-trending-up' },
  { value: 'chinese_language', label: 'Chinese Language', icon: 'mdi-translate' }
]

const getProgramsByTab = (tabValue) => {
  switch (tabValue) {
    case 'full_scholarship':
      return programs.value.filter(p => p.scholarship_type === 'full')
    case 'issp':
      return programs.value.filter(p => p.name.toLowerCase().includes('issp'))
    case 'hot_majors':
      return programs.value.filter(p => p.is_featured)
    case 'chinese_language':
      return programs.value.filter(p => p.degree_level === 'language')
    default:
      return programs.value.slice(0, 6)
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

const goToProgram = (id) => {
  router.push(`/program/${id}`)
}

const fetchPrograms = async () => {
  try {
    const response = await api.get('/programs/featured')
    programs.value = response.data.programs
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
        is_featured: true
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
        is_featured: true
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
        is_featured: true
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
        is_featured: true
      },
      {
        id: 5,
        name: 'Medicine',
        university_name: 'Zhejiang University',
        university_logo: null,
        city_name: 'Hangzhou',
        degree_level: 'master',
        language: 'chinese',
        scholarship_type: 'partial',
        tuition_fee: 40000,
        is_featured: true
      },
      {
        id: 6,
        name: 'ISSP Program',
        university_name: 'Nanjing University',
        university_logo: null,
        city_name: 'Nanjing',
        degree_level: 'bachelor',
        language: 'english',
        scholarship_type: 'full',
        tuition_fee: 20000,
        is_featured: true
      }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPrograms()
})
</script>

<style scoped>
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

.max-width-600 {
  max-width: 600px;
}

.v-tabs {
  border-bottom: 2px solid rgba(6, 139, 118, 0.1);
}

.v-tab {
  text-transform: none !important;
  font-weight: 500;
}

.v-tab--selected {
  color: #068b76 !important;
}
</style>
