<template>
  <section class="hero-section">
    <!-- Dynamic Background with Multiple Layers -->
    <div class="hero-background">
      <!-- Animated gradient background -->
      <div class="hero-gradient-animated"></div>
      
      <!-- Water Flow Effect -->
      <div class="water-flow">
        <div class="water-wave wave-1"></div>
        <div class="water-wave wave-2"></div>
        <div class="water-wave wave-3"></div>
        <div class="water-stream stream-1"></div>
        <div class="water-stream stream-2"></div>
        <div class="water-stream stream-3"></div>
        <div class="water-bubbles">
          <div class="bubble" v-for="n in 30" :key="n"></div>
        </div>
      </div>
      
      <!-- Floating geometric shapes -->
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
        <div class="shape shape-6"></div>
      </div>
      
      <!-- Rotating text elements -->
      <div class="rotating-text">
        <div class="rotating-word" v-for="(word, index) in rotatingWords" :key="index" :style="{ '--delay': index * 0.5 + 's' }">
          {{ word }}
        </div>
      </div>
      
      <!-- Particle system -->
      <div class="particles">
        <div class="particle" v-for="n in 50" :key="n" :style="{ '--delay': Math.random() * 5 + 's', '--duration': 3 + Math.random() * 4 + 's' }"></div>
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="hero-overlay">
      <v-container class="fill-height d-flex align-center">
        <v-row justify="center" align="center">
          <v-col cols="12" lg="6" class="text-center text-lg-left">
            <div class="hero-content">
              <!-- Animated title with typewriter effect -->
              <h1 class="hero-title">
                <span class="title-line-1">Global</span>
                <span class="title-line-2">Scholarship</span>
                <span class="title-line-3">Platform</span>
              </h1>
              
              <!-- Dynamic subtitle with color changes -->
              <p class="hero-subtitle">
                <span class="subtitle-text">MalishaEdu aims to help international students find all</span>
                <span class="highlight-text">self-finance & scholarship programs</span>
                <span class="subtitle-text">in Chinese universities easily and safely.</span>
              </p>
              
              <!-- Enhanced CTA buttons -->
              <div class="hero-actions">
                <v-btn
                  to="/scholarship"
                  color="primary"
                  variant="elevated"
                  size="x-large"
                  class="cta-btn primary-btn"
                >
                  <v-icon class="mr-2">mdi-school</v-icon>
                  Find Scholarships
                  <div class="btn-shine"></div>
                </v-btn>
                <v-btn
                  to="/universities"
                  color="white"
                  variant="outlined"
                  size="x-large"
                  class="cta-btn secondary-btn"
                >
                  <v-icon class="mr-2">mdi-domain</v-icon>
                  Browse Universities
                  <div class="btn-shine"></div>
                </v-btn>
                <v-btn
                  href="tel:+8612345678900"
                  color="success"
                  variant="elevated"
                  size="x-large"
                  class="cta-btn call-btn"
                >
                  <v-icon class="mr-2">mdi-phone</v-icon>
                  Call Us: +86 123 4567 8900
                  <div class="btn-shine"></div>
                </v-btn>
              </div>
            </div>
          </v-col>
          
          <!-- Enhanced stats section -->
          <v-col cols="12" lg="6" class="d-none d-lg-flex justify-end align-center">
            <div class="hero-stats-enhanced">
              <div class="stat-card-enhanced" v-for="(stat, index) in stats" :key="index" :style="{ '--delay': index * 0.2 + 's' }">
                <div class="stat-icon">
                  <v-icon :color="stat.color" size="40">{{ stat.icon }}</v-icon>
              </div>
                <div class="stat-number-enhanced">{{ stat.number }}</div>
                <div class="stat-label-enhanced">{{ stat.label }}</div>
                <div class="stat-description">{{ stat.description }}</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Enhanced Social Icons -->
    <div class="social-icons-enhanced">
      <v-container>
        <div class="d-flex justify-center">
          <v-btn
            v-for="(social, index) in socialLinks"
            :key="social.name"
            :href="social.url"
            target="_blank"
            icon
            variant="elevated"
            :color="social.color"
            size="large"
            class="social-btn-enhanced"
            :style="{ '--delay': index * 0.1 + 's' }"
          >
            <v-icon size="24">{{ social.icon }}</v-icon>
            <div class="social-tooltip">{{ social.name }}</div>
          </v-btn>
        </div>
      </v-container>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Rotating words for background animation
const rotatingWords = ref(['Education', 'Scholarship', 'Dream', 'Success', 'Future', 'Opportunity'])

// Enhanced stats data
const stats = ref([
  {
    number: '500+',
    label: 'Universities',
    description: 'Partner institutions',
    icon: 'mdi-school',
    color: 'primary'
  },
  {
    number: '2000+',
    label: 'Programs',
    description: 'Available courses',
    icon: 'mdi-book-open-page-variant',
    color: 'success'
  },
  {
    number: '50K+',
    label: 'Students',
    description: 'Successfully placed',
    icon: 'mdi-account-group',
    color: 'info'
  }
])

// Enhanced social links with colors
const socialLinks = ref([
  { name: 'LinkedIn', icon: 'mdi-linkedin', url: 'https://linkedin.com/company/malishaedu', color: 'white' },
  { name: 'Facebook', icon: 'mdi-facebook', url: 'https://facebook.com/malishaedu', color: 'white' },
  { name: 'YouTube', icon: 'mdi-youtube', url: 'https://youtube.com/malishaedu', color: 'white' },
  { name: 'Twitter', icon: 'mdi-twitter', url: 'https://twitter.com/malishaedu', color: 'white' }
])

// Auto-rotate words
onMounted(() => {
  setInterval(() => {
    const firstWord = rotatingWords.value.shift()
    rotatingWords.value.push(firstWord)
  }, 3000)
})
</script>

<style scoped>
/* Main Hero Section */
.hero-section {
  position: relative;
  margin-top: -80px;
  padding-top: 80px;
  min-height: 85vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding-bottom: 2rem;
}

/* Dynamic Background */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

/* Animated Gradient Background */
.hero-gradient-animated {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    #068b76 0%,
    #0a9b85 25%,
    #056b5a 50%,
    #068b76 75%,
    #0a9b85 100%
  );
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
}

/* Water Flow Effect */
.water-flow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 2;
}

.water-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(90deg, 
    rgba(6, 139, 118, 0.1) 0%,
    rgba(10, 155, 133, 0.2) 25%,
    rgba(5, 107, 90, 0.15) 50%,
    rgba(10, 155, 133, 0.2) 75%,
    rgba(6, 139, 118, 0.1) 100%
  );
  border-radius: 50% 50% 0 0;
  animation: waveFlow 6s ease-in-out infinite;
}

.wave-1 {
  animation-delay: 0s;
  height: 80px;
}

.wave-2 {
  animation-delay: 2s;
  height: 120px;
  opacity: 0.7;
}

.wave-3 {
  animation-delay: 4s;
  height: 100px;
  opacity: 0.5;
}

.water-stream {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom,
    transparent 0%,
    rgba(10, 155, 133, 0.3) 20%,
    rgba(6, 139, 118, 0.4) 50%,
    rgba(10, 155, 133, 0.3) 80%,
    transparent 100%
  );
  animation: streamFlow 4s linear infinite;
}

.stream-1 {
  left: 20%;
  animation-delay: 0s;
}

.stream-2 {
  left: 50%;
  animation-delay: 1.5s;
}

.stream-3 {
  left: 80%;
  animation-delay: 3s;
}

.water-bubbles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.bubble {
  position: absolute;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 70%, transparent 100%);
  border-radius: 50%;
  animation: bubbleFloat 8s linear infinite;
}

.bubble:nth-child(odd) {
  width: 8px;
  height: 8px;
  left: 10%;
  animation-delay: 0s;
}

.bubble:nth-child(even) {
  width: 12px;
  height: 12px;
  left: 60%;
  animation-delay: 2s;
}

.bubble:nth-child(3n) {
  width: 6px;
  height: 6px;
  left: 30%;
  animation-delay: 4s;
}

.bubble:nth-child(4n) {
  width: 10px;
  height: 10px;
  left: 80%;
  animation-delay: 1s;
}

.bubble:nth-child(5n) {
  width: 14px;
  height: 14px;
  left: 40%;
  animation-delay: 3s;
}

/* Floating Geometric Shapes */
.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, #ffffff, #068b76);
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  background: linear-gradient(45deg, #ffffff, #0a9b85);
  top: 60%;
  right: 15%;
  animation-delay: 1s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #ffffff, #056b5a);
  top: 30%;
  right: 30%;
  animation-delay: 2s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  background: linear-gradient(45deg, #ffffff, #068b76);
  bottom: 20%;
  left: 20%;
  animation-delay: 3s;
}

.shape-5 {
  width: 70px;
  height: 70px;
  background: linear-gradient(45deg, #ffffff, #0a9b85);
  top: 10%;
  right: 50%;
  animation-delay: 4s;
}

.shape-6 {
  width: 90px;
  height: 90px;
  background: linear-gradient(45deg, #ffffff, #056b5a);
  bottom: 40%;
  right: 10%;
  animation-delay: 5s;
}

/* Rotating Text Elements */
.rotating-text {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  pointer-events: none;
}

.rotating-word {
  position: absolute;
  font-size: 4rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.05);
  text-transform: uppercase;
  letter-spacing: 2px;
  animation: rotateText 20s linear infinite;
  animation-delay: var(--delay);
}

.rotating-word:nth-child(1) { top: 10%; left: 5%; }
.rotating-word:nth-child(2) { top: 20%; right: 10%; }
.rotating-word:nth-child(3) { top: 50%; left: 8%; }
.rotating-word:nth-child(4) { top: 70%; right: 15%; }
.rotating-word:nth-child(5) { top: 30%; left: 50%; }
.rotating-word:nth-child(6) { top: 80%; left: 30%; }

/* Particle System */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 4;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particleFloat linear infinite;
  animation-delay: var(--delay);
  animation-duration: var(--duration);
}

/* Hero Overlay */
.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(6, 139, 118, 0.9) 0%,
    rgba(6, 139, 118, 0.8) 50%,
    rgba(6, 139, 118, 0.7) 100%
  );
  z-index: 5;
}

/* Hero Content */
.hero-content {
  position: relative;
  z-index: 6;
}

/* Enhanced Title */
.hero-title {
  font-size: 4rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.title-line-1 {
  display: block;
  color: #ffffff;
  animation: slideInLeft 1s ease-out;
}

.title-line-2 {
  display: block;
  background: linear-gradient(45deg, #ffffff, #0a9b85);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: slideInLeft 1s ease-out 0.3s both;
}

.title-line-3 {
  display: block;
  color: #ffffff;
  animation: slideInLeft 1s ease-out 0.6s both;
}

/* Enhanced Subtitle */
.hero-subtitle {
  font-size: 1.5rem;
  line-height: 1.6;
  margin-bottom: 3rem;
  color: rgba(255, 255, 255, 0.9);
  animation: fadeInUp 1s ease-out 0.9s both;
}

.highlight-text {
  color: #ffffff;
  font-weight: 700;
  background: linear-gradient(45deg, #ffffff, #0a9b85);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Enhanced CTA Buttons */
.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 4rem;
  animation: fadeInUp 1s ease-out 1.2s both;
}

.cta-btn {
  position: relative;
  overflow: hidden;
  border-radius: 50px !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
  transition: all 0.3s ease !important;
}

.cta-btn:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.cta-btn:hover .btn-shine {
  left: 100%;
}

.primary-btn {
  background: linear-gradient(45deg, #068b76, #0a9b85) !important;
  box-shadow: 0 8px 25px rgba(6, 139, 118, 0.4) !important;
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px) !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
}

.call-btn {
  background: linear-gradient(45deg, #4CAF50, #66BB6A) !important;
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4) !important;
  animation: pulse 2s infinite;
}

.call-btn:hover {
  background: linear-gradient(45deg, #66BB6A, #4CAF50) !important;
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.5) !important;
  animation: none;
}

/* Enhanced Stats */
.hero-stats-enhanced {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 350px;
  margin-right: 2rem;
}

.stat-card-enhanced {
  text-align: center;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  animation: slideInRight 1s ease-out var(--delay) both;
}

.stat-card-enhanced:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  margin-bottom: 1rem;
}

.stat-number-enhanced {
  font-size: 3rem;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #ffffff, #0a9b85);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label-enhanced {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.stat-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Enhanced Social Icons */
.social-icons-enhanced {
  position: absolute;
  bottom: 1rem;
  left: 0;
  right: 0;
  z-index: 7;
}

.social-btn-enhanced {
  position: relative;
  margin: 0 0.5rem !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.3s ease !important;
  animation: bounceIn 1s ease-out var(--delay) both;
}

.social-btn-enhanced:hover {
  transform: translateY(-5px) !important;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2) !important;
}

.social-tooltip {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.social-btn-enhanced:hover .social-tooltip {
  opacity: 1;
}

/* Animations */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes rotateText {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes particleFloat {
  0% {
    transform: translateY(100vh) translateX(0px);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(100px);
    opacity: 0;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
  }
  50% {
    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.6), 0 0 0 10px rgba(76, 175, 80, 0.1);
  }
  100% {
    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
  }
}

@keyframes waveFlow {
  0% {
    transform: translateX(-100%) scaleY(1);
    opacity: 0.3;
  }
  50% {
    transform: translateX(0%) scaleY(1.2);
    opacity: 0.6;
  }
  100% {
    transform: translateX(100%) scaleY(1);
    opacity: 0.3;
  }
}

@keyframes streamFlow {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}

@keyframes bubbleFloat {
  0% {
    transform: translateY(100vh) translateX(0px);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-100px) translateX(20px);
    opacity: 0;
  }
}

/* Responsive Design */
@media (max-width: 1264px) {
  .hero-stats-enhanced {
    flex-direction: row;
    justify-content: space-around;
    padding: 2rem 1rem;
    max-width: 100%;
  }
  
  .stat-card-enhanced {
    flex: 1;
    margin: 0 0.5rem;
    padding: 1.2rem;
  }
  
  .stat-number-enhanced {
    font-size: 2.5rem;
  }
  
  .stat-label-enhanced {
    font-size: 1rem;
  }
  
  .stat-description {
    font-size: 0.8rem;
  }
}

@media (max-width: 960px) {
  .hero-section {
    margin-top: -64px;
    padding-top: 64px;
    min-height: 75vh;
  }
  
  .hero-title {
    font-size: 3rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-stats-enhanced {
    display: none;
  }
  
  .social-icons-enhanced {
    bottom: 0.5rem;
    left: 0;
    right: 0;
  }
  
  .hero-actions {
    margin-bottom: 3rem;
  }
  
  .rotating-word {
    font-size: 2.5rem;
  }
}

@media (max-width: 600px) {
  .hero-section {
    margin-top: -56px;
    padding-top: 56px;
    min-height: 65vh;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .stat-number-enhanced {
    font-size: 2rem;
  }
  
  .rotating-word {
    font-size: 2rem;
  }
  
  .hero-actions {
    gap: 1rem;
    margin-bottom: 2.5rem;
  }
  
  .cta-btn {
    font-size: 0.9rem !important;
    padding: 0.8rem 1.5rem !important;
  }
  
  .call-btn {
    font-size: 0.8rem !important;
    padding: 0.7rem 1.2rem !important;
  }
}
</style>
