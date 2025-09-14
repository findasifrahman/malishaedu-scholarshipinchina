<template>
  <section class="py-16 bg-primary">
    <v-container>
      <!-- Loading State -->
      <div v-if="loading" class="text-center">
        <v-progress-circular
          indeterminate
          color="white"
          size="64"
          class="mb-4"
        />
        <p class="text-h6 text-white opacity-90">Loading statistics...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center">
        <v-icon size="64" color="white" class="mb-4">mdi-alert-circle</v-icon>
        <p class="text-h6 text-white opacity-90 mb-4">{{ error }}</p>
        <v-btn
          color="white"
          variant="outlined"
          @click="fetchStatistics"
        >
          <v-icon class="mr-2">mdi-refresh</v-icon>
          Retry
        </v-btn>
      </div>

      <!-- Statistics Content -->
      <v-row v-else>
        <v-col
          v-for="stat in statistics"
          :key="stat.label"
          cols="6"
          md="3"
          class="text-center"
        >
          <div class="stat-item">
            <div class="stat-number">
              <span class="text-h2 text-md-h1 font-weight-bold text-white">{{ stat.value }}</span>
              <span class="text-h2 text-md-h1 font-weight-bold text-white">+</span>
            </div>
            <p class="text-h6 text-white opacity-90 mt-2">
              {{ stat.label }}
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

// Animation for numbers when they load
const animateNumbers = () => {
  // Simple fade-in animation for the numbers
  const numbers = document.querySelectorAll('.stat-number span:first-child')
  numbers.forEach((num, index) => {
    setTimeout(() => {
      num.style.opacity = '1'
      num.style.transform = 'translateY(0)'
    }, index * 200)
  })
}

const statistics = ref([
  { label: 'Partner Universities', value: 0 },
  { label: 'Scholarship Programs', value: 0 },
  { label: 'Successful Applications', value: 0 },
  { label: 'Happy Students', value: 0 }
])

const loading = ref(true)
const error = ref(null)

const fetchStatistics = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await api.get('/statistics')
    
    if (response.data.success) {
      const data = response.data.data
      statistics.value = [
        { label: 'Partner Universities', value: data.partnerUniversities || 0 },
        { label: 'Scholarship Programs', value: data.scholarshipPrograms || 0 },
        { label: 'Successful Applications', value: data.successfulApplications || 0 },
        { label: 'Happy Students', value: data.happyStudents || 0 }
      ]
      
      // Animate numbers after data is loaded
      setTimeout(() => {
        animateNumbers()
      }, 100)
    } else {
      throw new Error('API returned unsuccessful response')
    }
  } catch (err) {
    console.error('Failed to fetch statistics:', err)
    console.error('Error details:', err.response?.data)
    
    // Show error state if API fails
    error.value = 'Failed to load statistics. Please check your connection.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStatistics()
})
</script>

<style scoped>
.stat-item {
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  margin: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.stat-number {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  min-height: 80px;
  align-items: center;
}

.stat-number span:first-child {
  font-size: 3rem !important;
  font-weight: 700 !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-out;
}

.stat-number span:last-child {
  font-size: 3rem !important;
  font-weight: 700 !important;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.6s ease-out;
}

.opacity-90 {
  opacity: 0.9;
}

/* Animation for numbers */
.stat-number span {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .stat-item {
    margin: 5px;
    padding: 15px;
  }
  
  .stat-number span:first-child,
  .stat-number span:last-child {
    font-size: 2.5rem !important;
  }
}

@media (max-width: 600px) {
  .stat-number span:first-child,
  .stat-number span:last-child {
    font-size: 2rem !important;
  }
}
</style>
