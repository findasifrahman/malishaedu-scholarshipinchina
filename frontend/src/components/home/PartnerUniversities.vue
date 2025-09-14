<template>
  <section class="py-16 bg-grey-lighten-5">
    <v-container>
      <div class="text-center mb-12">
        <h2 class="text-h3 text-md-h2 font-weight-bold text-primary mb-4 text-uppercase">
          Partner Universities
        </h2>
        <p class="text-h6 text-grey-darken-1 max-width-600 mx-auto">
          Discover top Chinese universities offering world-class education and scholarship opportunities
        </p>
      </div>

      <!-- University Carousel -->
      <div class="position-relative">
        <v-carousel
          v-model="currentSlide"
          :show-arrows="false"
          hide-delimiters
          height="auto"
          class="university-carousel"
        >
          <v-carousel-item
            v-for="(slide, index) in universitySlides"
            :key="index"
          >
            <v-row>
              <v-col
                v-for="university in slide"
                :key="university.id"
                cols="6"
                sm="4"
                md="3"
                class="d-flex"
              >
                <v-card
                  class="university-card flex-grow-1"
                  elevation="2"
                  @click="goToUniversity(university.id)"
                >
                  <v-img
                    :src="university.logo_url || '/university-placeholder.png'"
                    :alt="university.name"
                    height="120"
                    
                    class="d-flex align-center justify-center"
                  >
                    <div v-if="!university.logo_url" class="text-center">
                      <v-icon size="48" color="primary">mdi-school</v-icon>
                      <p class="text-caption mt-2">{{ university.name }}</p>
                    </div>
                  </v-img>
                  <v-card-text class="text-center pa-3">
                    <h4 class="text-subtitle-1 font-weight-medium mb-1">
                      {{ university.name }}
                    </h4>
                    <p class="text-caption text-grey-darken-1 mb-2">
                      {{ university.city_name }}, {{ university.city_province }}
                    </p>
                    <v-chip
                      v-if="university.is_featured"
                      color="primary"
                      size="small"
                      variant="flat"
                    >
                      Featured
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-carousel-item>
        </v-carousel>

        <!-- Navigation Buttons -->
        <v-btn
          icon
          variant="elevated"
          color="primary"
          size="large"
          class="carousel-nav carousel-nav-prev"
          @click="previousSlide"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn
          icon
          variant="elevated"
          color="primary"
          size="large"
          class="carousel-nav carousel-nav-next"
          @click="nextSlide"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <!-- View All Button -->
      <div class="text-center mt-8">
        <v-btn
          to="/universities"
          color="primary"
          variant="elevated"
          size="large"
          class="px-8"
        >
          View All Universities
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
const currentSlide = ref(0)
const universities = ref([])
const loading = ref(true)

const universitiesPerSlide = 8 // 2 rows × 4 per page

const universitySlides = computed(() => {
  const slides = []
  for (let i = 0; i < universities.value.length; i += universitiesPerSlide) {
    slides.push(universities.value.slice(i, i + universitiesPerSlide))
  }
  return slides
})

const fetchUniversities = async () => {
  try {
    const response = await api.get('/universities?limit=24&is_featured=true')
    universities.value = response.data.universities
  } catch (error) {
    console.error('Failed to fetch universities:', error)
    // Fallback data for demo
    universities.value = [
      {
        id: 1,
        name: 'Tsinghua University',
        city_name: 'Beijing',
        city_province: 'Beijing',
        logo_url: null,
        is_featured: true
      },
      {
        id: 2,
        name: 'Peking University',
        city_name: 'Beijing',
        city_province: 'Beijing',
        logo_url: null,
        is_featured: true
      },
      {
        id: 3,
        name: 'Fudan University',
        city_name: 'Shanghai',
        city_province: 'Shanghai',
        logo_url: null,
        is_featured: true
      },
      {
        id: 4,
        name: 'Shanghai Jiao Tong University',
        city_name: 'Shanghai',
        city_province: 'Shanghai',
        logo_url: null,
        is_featured: true
      },
      {
        id: 5,
        name: 'Zhejiang University',
        city_name: 'Hangzhou',
        city_province: 'Zhejiang',
        logo_url: null,
        is_featured: true
      },
      {
        id: 6,
        name: 'Nanjing University',
        city_name: 'Nanjing',
        city_province: 'Jiangsu',
        logo_url: null,
        is_featured: true
      },
      {
        id: 7,
        name: 'University of Science and Technology of China',
        city_name: 'Hefei',
        city_province: 'Anhui',
        logo_url: null,
        is_featured: true
      },
      {
        id: 8,
        name: 'Sun Yat-sen University',
        city_name: 'Guangzhou',
        city_province: 'Guangdong',
        logo_url: null,
        is_featured: true
      }
    ]
  } finally {
    loading.value = false
  }
}

const previousSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  } else {
    currentSlide.value = universitySlides.value.length - 1
  }
}

const nextSlide = () => {
  if (currentSlide.value < universitySlides.value.length - 1) {
    currentSlide.value++
  } else {
    currentSlide.value = 0
  }
}

const goToUniversity = (id) => {
  router.push(`/university/${id}`)
}

onMounted(() => {
  fetchUniversities()
})
</script>

<style scoped>
.university-carousel {
  border-radius: 12px;
  overflow: hidden;
}

.university-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
}

.university-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.carousel-nav-prev {
  left: -20px;
}

.carousel-nav-next {
  right: -20px;
}

.max-width-600 {
  max-width: 600px;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .carousel-nav {
    display: none;
  }
}

@media (max-width: 600px) {
  .university-card {
    margin-bottom: 16px;
  }
}
</style>
