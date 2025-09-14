<template>
  <div class="university-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular
        color="primary"
        size="64"
        indeterminate
      />
      <p class="text-h6 mt-4">Loading university details...</p>
    </div>

    <!-- University Content -->
    <div v-else-if="university">
      <!-- Hero Section -->
      <section class="hero-section">
        <v-img
          :src="university.banner_image_url || '/university-banner.jpg'"
          alt="University Banner"
          height="400"
          cover
        >
          <div class="hero-overlay">
            <v-container class="fill-height d-flex align-center">
              <v-row>
                <v-col cols="12" md="8">
                  <div class="d-flex align-center mb-4">
                    <v-avatar size="80" class="mr-4">
                      <v-img
                        v-if="university.logo_url"
                        :src="university.logo_url"
                        :alt="university.name"
                      />
                      <v-icon v-else size="40" color="white">mdi-school</v-icon>
                    </v-avatar>
                    <div>
                      <h1 class="text-h3 text-md-h2 font-weight-bold text-white mb-2">
                        {{ university.name }}
                      </h1>
                      <p class="text-h6 text-white opacity-90">
                        {{ university.city_name }}, {{ university.city_province }}
                      </p>
                    </div>
                  </div>
                  <div class="d-flex flex-wrap gap-2">
                    <v-chip
                      v-if="university.is_featured"
                      color="primary"
                      variant="flat"
                    >
                      Featured
                    </v-chip>
                    <v-chip
                      :color="getTypeColor(university.type)"
                      variant="flat"
                    >
                      {{ getTypeLabel(university.type) }}
                    </v-chip>
                    <v-chip
                      v-if="university.ranking"
                      color="white"
                      variant="flat"
                    >
                      Ranking #{{ university.ranking }}
                    </v-chip>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-img>
      </section>

      <!-- University Information -->
      <section class="py-8">
        <v-container>
          <v-row>
            <!-- Main Content -->
            <v-col cols="12" lg="8">
              <!-- About Section -->
              <v-card class="mb-6" elevation="2">
                <v-card-title class="text-h5 font-weight-bold">
                  About {{ university.name }}
                </v-card-title>
                <v-card-text>
                  <p class="text-body-1 mb-4">
                    {{ university.about || university.description || 'No description available.' }}
                  </p>
                  
                  <!-- University Details -->
                  <v-row class="mt-4">
                    <v-col cols="12" sm="6">
                      <div class="detail-item">
                        <v-icon class="mr-2" color="primary">mdi-web</v-icon>
                        <span class="text-body-2">
                          <strong>Website:</strong>
                          <a
                            v-if="university.website"
                            :href="university.website"
                            target="_blank"
                            class="text-primary text-decoration-none ml-1"
                          >
                            {{ university.website }}
                          </a>
                          <span v-else class="text-grey">Not available</span>
                        </span>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="detail-item">
                        <v-icon class="mr-2" color="primary">mdi-phone</v-icon>
                        <span class="text-body-2">
                          <strong>Phone:</strong>
                          {{ university.phone || 'Not available' }}
                        </span>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="detail-item">
                        <v-icon class="mr-2" color="primary">mdi-email</v-icon>
                        <span class="text-body-2">
                          <strong>Email:</strong>
                          {{ university.email || 'Not available' }}
                        </span>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <div class="detail-item">
                        <v-icon class="mr-2" color="primary">mdi-map-marker</v-icon>
                        <span class="text-body-2">
                          <strong>Address:</strong>
                          {{ university.address || 'Not available' }}
                        </span>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <!-- YouTube Video -->
              <v-card v-if="university.youtube_video_id" class="mb-6" elevation="2">
                <v-card-title class="text-h5 font-weight-bold">
                  University Video
                </v-card-title>
                <v-card-text>
                  <div class="video-container">
                    <iframe
                      :src="`https://www.youtube.com/embed/${university.youtube_video_id}`"
                      title="University Video"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    />
                  </div>
                </v-card-text>
              </v-card>

              <!-- Programs Section -->
              <v-card id="programs-section" class="mb-6" elevation="2">
                <v-card-title class="text-h5 font-weight-bold">
                  Available Programs
                </v-card-title>
                <v-card-text>
                  <div v-if="programsLoading" class="text-center py-8">
                    <v-progress-circular
                      color="primary"
                      size="48"
                      indeterminate
                    />
                    <p class="text-body-1 mt-4">Loading programs...</p>
                  </div>

                  <div v-else-if="programs.length === 0" class="text-center py-8">
                    <v-icon size="64" color="grey">mdi-book-open-page-variant</v-icon>
                    <h3 class="text-h6 mt-4">No programs available</h3>
                    <p class="text-body-2 text-grey-darken-1">
                      Check back later for program information
                    </p>
                  </div>

                  <v-row v-else>
                    <v-col
                      v-for="program in programs"
                      :key="program.id"
                      cols="12"
                      md="6"
                      lg="4"
                    >
                      <v-card
                        class="program-card h-100"
                        elevation="2"
                        @click="() => goToProgram(program.id)"
                      >
                        <v-card-text class="pa-4">
                          <div class="d-flex justify-space-between align-start mb-3">
                            <h3 class="text-h6 font-weight-medium">
                              {{ program.name }}
                            </h3>
                            <v-chip
                              :color="getDegreeColor(program.degree_level)"
                              size="small"
                              variant="flat"
                            >
                              {{ getDegreeLabel(program.degree_level) }}
                            </v-chip>
                          </div>

      

                          <div class="program-details">
                            <div class="d-flex justify-space-between align-center mb-2">
                              <span class="text-caption text-grey-darken-1">Language</span>
                              <v-chip
                                :color="getLanguageColor(program.language)"
                                size="x-small"
                                variant="outlined"
                              >
                                {{ getLanguageLabel(program.language) }}
                              </v-chip>
                            </div>
                            
                            <div v-if="program.duration_years" class="d-flex justify-space-between align-center mb-2">
                              <span class="text-caption text-grey-darken-1">Duration</span>
                              <span class="text-caption font-weight-medium">{{ program.duration_years }} years</span>
                            </div>

                            <div v-if="program.tuition_fee" class="d-flex justify-space-between align-center mb-2">
                              <span class="text-caption text-grey-darken-1">Tuition Fee</span>
                              <span class="text-caption font-weight-medium">¥{{ program.tuition_fee.toLocaleString() }}</span>
                            </div>

                            <div v-if="program.scholarship_type && program.scholarship_type !== 'none'" class="d-flex justify-space-between align-center">
                              <span class="text-caption text-grey-darken-1">Scholarship</span>
                              <v-chip
                                :color="getScholarshipColor(program.scholarship_type)"
                                size="x-small"
                                variant="flat"
                              >
                                {{ getScholarshipLabel(program.scholarship_type) }}
                              </v-chip>
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
                </v-card-text>
              </v-card>

              <!-- Image Gallery Carousel -->
              <v-card v-if="university.images && university.images.length > 0" class="mb-6" elevation="2">
                <v-card-title class="text-h5 font-weight-bold">
                  Photo Gallery
                </v-card-title>
                <v-card-text>
                  <!-- Full-width sliding gallery -->
                  <div class="gallery-carousel">
                    <v-carousel
                      v-model="currentSlide"
                      height="400"
                      show-arrows="hover"
                      hide-delimiters
                      cycle
                      :interval="5000"
                      class="gallery-carousel-container"
                    >
                      <v-carousel-item
                        v-for="(image, index) in university.images"
                        :key="image.id"
                        :src="image.image_url"
                        cover
                        @click="openImageDialog(index)"
                      >
                        <div class="carousel-overlay">
                          <div class="carousel-content">
                            <h3 class="text-h5 font-weight-bold text-white mb-2">
                              {{ university.name }}
                            </h3>
                            <p class="text-body-1 text-white">
                              {{ image.alt_text || 'University photo' }}
                            </p>
                            <v-btn
                              color="white"
                              variant="elevated"
                              class="mt-4"
                              @click.stop="openImageDialog(index)"
                            >
                              <v-icon left>mdi-magnify-plus</v-icon>
                              View Full Size
                            </v-btn>
                          </div>
                        </div>
                      </v-carousel-item>
                    </v-carousel>
                    
                    <!-- Gallery thumbnails -->
                    <div class="gallery-thumbnails mt-4">
                      <v-row no-gutters>
                        <v-col
                          v-for="(image, index) in university.images.slice(0, 8)"
                          :key="`thumb-${image.id}-${index}`"
                          cols="3"
                          sm="2"
                          md="1"
                          class="pa-1"
                        >
                          <v-img
                            :src="image.image_url"
                            height="60"
                            cover
                            class="thumbnail-image"
                            :class="{ 'thumbnail-active': currentSlide === index }"
                            @click="currentSlide = index"
                          />
                        </v-col>
                        <v-col
                          v-if="university.images.length > 8"
                          cols="3"
                          sm="2"
                          md="1"
                          class="pa-1 d-flex align-center justify-center"
                        >
                          <v-btn
                            color="primary"
                            variant="outlined"
                            size="small"
                            @click="openImageDialog(0)"
                          >
                            +{{ university.images.length - 8 }}
                          </v-btn>
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Sidebar -->
            <v-col cols="12" lg="4">
              <!-- Quick Actions -->
              <v-card class="mb-6" elevation="2">
                <v-card-title class="text-h6 font-weight-bold">
                  Quick Actions
                </v-card-title>
                <v-card-text>
                  <v-btn
                    color="primary"
                    variant="elevated"
                    block
                    size="large"
                    class="mb-3"
                    @click="scrollToPrograms"
                  >
                    <v-icon class="mr-2">mdi-school</v-icon>
                    View Programs
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="outlined"
                    block
                    size="large"
                    class="mb-3"
                    @click="handleApplyNow"
                  >
                    <v-icon class="mr-2">mdi-application</v-icon>
                    Apply Now
                  </v-btn>
                  <v-btn
                    v-if="university.website"
                    :href="university.website"
                    target="_blank"
                    color="secondary"
                    variant="outlined"
                    block
                    size="large"
                  >
                    <v-icon class="mr-2">mdi-web</v-icon>
                    Visit Website
                  </v-btn>
                </v-card-text>
              </v-card>

              <!-- University Stats -->
              <v-card class="mb-6" elevation="2">
                <v-card-title class="text-h6 font-weight-bold">
                  University Information
                </v-card-title>
                <v-card-text>
                  <div class="stat-item">
                    <span class="text-body-2 text-grey-darken-1">Type</span>
                    <v-chip
                      :color="getTypeColor(university.type)"
                      size="small"
                      variant="flat"
                    >
                      {{ getTypeLabel(university.type) }}
                    </v-chip>
                  </div>
                  <div v-if="university.ranking" class="stat-item">
                    <span class="text-body-2 text-grey-darken-1">Ranking</span>
                    <span class="text-body-2 font-weight-medium">#{{ university.ranking }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="text-body-2 text-grey-darken-1">Location</span>
                    <span class="text-body-2 font-weight-medium">
                      {{ university.city_name }}, {{ university.city_province }}
                    </span>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Contact Information -->
              <v-card elevation="2">
                <v-card-title class="text-h6 font-weight-bold">
                  Contact Information
                </v-card-title>
                <v-card-text>
                  <div v-if="university.phone" class="contact-item">
                    <v-icon class="mr-2" color="primary">mdi-phone</v-icon>
                    <span class="text-body-2">{{ university.phone }}</span>
                  </div>
                  <div v-if="university.email" class="contact-item">
                    <v-icon class="mr-2" color="primary">mdi-email</v-icon>
                    <span class="text-body-2">{{ university.email }}</span>
                  </div>
                  <div v-if="university.address" class="contact-item">
                    <v-icon class="mr-2" color="primary">mdi-map-marker</v-icon>
                    <span class="text-body-2">{{ university.address }}</span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-12">
      <v-icon size="64" color="grey">mdi-school</v-icon>
      <h3 class="text-h5 mt-4">University not found</h3>
      <p class="text-body-1 text-grey-darken-1">
        The university you're looking for doesn't exist or has been removed.
      </p>
      <v-btn
        to="/universities"
        color="primary"
        variant="elevated"
        class="mt-4"
      >
        Browse Universities
      </v-btn>
    </div>

    <!-- Image Dialog -->
    <v-dialog
      v-model="imageDialog"
      max-width="800"
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>University Gallery</span>
          <v-btn
            icon
            variant="text"
            @click="imageDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-img
            v-if="selectedImage"
            :src="selectedImage.image_url"
            :alt="selectedImage.alt_text || 'University image'"
            height="500"
            cover
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const university = ref(null)
const loading = ref(true)
const imageDialog = ref(false)
const selectedImage = ref(null)

// Programs
const programs = ref([])
const programsLoading = ref(false)

// Gallery carousel
const currentSlide = ref(0)

const fetchUniversity = async () => {
  try {
    const response = await api.get(`/universities/${route.params.id}`)
    university.value = response.data.university
    // Fetch programs after university is loaded
    if (university.value) {
      await fetchPrograms()
    }
  } catch (error) {
    console.error('Failed to fetch university:', error)
    university.value = null
  } finally {
    loading.value = false
  }
}

const fetchPrograms = async () => {
  if (!university.value) return
  
  programsLoading.value = true
  try {
    const response = await api.get(`/programs?university_id=${university.value.id}`)
    programs.value = response.data.programs || []
  } catch (error) {
    console.error('Failed to fetch programs:', error)
    programs.value = []
  } finally {
    programsLoading.value = false
  }
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

// Program helper functions
const getDegreeColor = (degree) => {
  switch (degree) {
    case 'bachelor': return 'primary'
    case 'master': return 'secondary'
    case 'phd': return 'success'
    case 'language': return 'info'
    case 'preparatory': return 'warning'
    default: return 'grey'
  }
}

const getDegreeLabel = (degree) => {
  switch (degree) {
    case 'bachelor': return 'Bachelor'
    case 'master': return 'Master'
    case 'phd': return 'PhD'
    case 'language': return 'Language'
    case 'preparatory': return 'Preparatory'
    default: return degree
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
    default: return type
  }
}

const goToProgram = (programId) => {
  // Navigate to program detail page
  window.location.href = `/program/${programId}`
}

const openImageDialog = (index) => {
  selectedImage.value = university.value.images[index]
  imageDialog.value = true
}

const scrollToPrograms = () => {
  const programsSection = document.getElementById('programs-section')
  if (programsSection) {
    programsSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
}

const handleApplyNow = () => {
  if (authStore.isAuthenticated) {
    // User is logged in, go to account/profile page
    router.push('/profile')
  } else {
    // User is not logged in, go to sign in page
    router.push('/signin')
  }
}

onMounted(() => {
  fetchUniversity()
})
</script>

<style scoped>
.university-detail-page {
  min-height: 100vh;
  background-color: #fafafa;
}

.hero-section {
  margin-top: -80px;
  padding-top: 80px;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(6, 139, 118, 0.8) 0%,
    rgba(6, 139, 118, 0.6) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

.opacity-90 {
  opacity: 0.9;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.video-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.gallery-image {
  cursor: pointer;
  transition: transform 0.3s ease;
  border-radius: 8px;
}

.gallery-image:hover {
  transform: scale(1.05);
}

.v-card {
  border-radius: 12px;
}

/* Program card styles */
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

/* Gallery Carousel Styles */
.gallery-carousel {
  width: 100%;
}

.gallery-carousel-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(6, 139, 118, 0.8) 0%,
    rgba(6, 139, 118, 0.6) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-overlay:hover {
  background: linear-gradient(
    135deg,
    rgba(6, 139, 118, 0.9) 0%,
    rgba(6, 139, 118, 0.7) 50%,
    rgba(0, 0, 0, 0.5) 100%
  );
}

.carousel-content {
  text-align: center;
  padding: 2rem;
  max-width: 600px;
}

.gallery-thumbnails {
  padding: 0 1rem;
}

.thumbnail-image {
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px solid transparent;
  opacity: 0.7;
}

.thumbnail-image:hover {
  opacity: 1;
  transform: scale(1.05);
}

.thumbnail-active {
  border-color: #068b76 !important;
  opacity: 1 !important;
  transform: scale(1.05);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .carousel-content {
    padding: 1rem;
  }
  
  .carousel-content h3 {
    font-size: 1.5rem !important;
  }
  
  .carousel-content p {
    font-size: 0.9rem !important;
  }
}
</style>
