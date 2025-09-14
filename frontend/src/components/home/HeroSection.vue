<template>
  <section class="hero-section">
    <!-- Beautiful gradient background -->
    <div class="hero-background">
      <div class="hero-gradient"></div>
      <div class="hero-svg-illustration">
        <svg viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg" class="hero-svg">
          <!-- Background elements -->
          <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#068b76;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#0a9b85;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#056b5a;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.2" />
              <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.1" />
            </linearGradient>
            <linearGradient id="studentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.9" />
              <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.7" />
            </linearGradient>
            <radialGradient id="sunGradient" cx="50%" cy="30%" r="50%">
              <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.3" />
            </radialGradient>
          </defs>
          
          <!-- Sky background -->
          <rect width="1200" height="600" fill="url(#skyGradient)"/>
          
          <!-- Floating clouds -->
          <g opacity="0.3">
            <ellipse cx="200" cy="80" rx="60" ry="25" fill="white"/>
            <ellipse cx="220" cy="70" rx="40" ry="20" fill="white"/>
            <ellipse cx="180" cy="75" rx="35" ry="18" fill="white"/>
            
            <ellipse cx="900" cy="60" rx="70" ry="30" fill="white"/>
            <ellipse cx="920" cy="50" rx="45" ry="22" fill="white"/>
            <ellipse cx="880" cy="55" rx="40" ry="20" fill="white"/>
          </g>
          
          <!-- Sun -->
          <circle cx="1000" cy="120" r="40" fill="url(#sunGradient)"/>
          
          <!-- University buildings (Chinese architecture style) -->
          <g opacity="0.4">
            <!-- Building 1 -->
            <rect x="100" y="300" width="120" height="200" fill="url(#buildingGradient)" rx="5"/>
            <rect x="110" y="280" width="100" height="30" fill="url(#buildingGradient)" rx="5"/>
            <rect x="130" y="250" width="60" height="40" fill="url(#buildingGradient)" rx="5"/>
            <rect x="140" y="220" width="40" height="40" fill="url(#buildingGradient)" rx="5"/>
            
            <!-- Building 2 -->
            <rect x="250" y="280" width="100" height="220" fill="url(#buildingGradient)" rx="5"/>
            <rect x="260" y="260" width="80" height="30" fill="url(#buildingGradient)" rx="5"/>
            <rect x="270" y="230" width="60" height="40" fill="url(#buildingGradient)" rx="5"/>
            
            <!-- Building 3 (Tower) -->
            <rect x="400" y="320" width="80" height="180" fill="url(#buildingGradient)" rx="5"/>
            <rect x="410" y="300" width="60" height="30" fill="url(#buildingGradient)" rx="5"/>
            <rect x="420" y="270" width="40" height="40" fill="url(#buildingGradient)" rx="5"/>
            <rect x="430" y="240" width="20" height="40" fill="url(#buildingGradient)" rx="5"/>
          </g>
          
          <!-- Chinese characters floating -->
          <g opacity="0.2" transform="translate(0, -50)">
            <text x="150" y="200" font-family="serif" font-size="24" fill="white">学</text>
            <text x="300" y="180" font-family="serif" font-size="28" fill="white">习</text>
            <text x="500" y="190" font-family="serif" font-size="22" fill="white">梦</text>
            <text x="700" y="210" font-family="serif" font-size="26" fill="white">想</text>
          </g>
          
          <!-- Students with graduation caps -->
          <g opacity="0.8">
            <!-- Student 1 -->
            <g transform="translate(600, 350)">
              <circle cx="0" cy="-15" r="12" fill="url(#studentGradient)"/>
              <rect x="-8" y="-5" width="16" height="20" fill="url(#studentGradient)" rx="3"/>
              <rect x="-6" y="-25" width="12" height="10" fill="#068b76" rx="2"/>
              <rect x="-4" y="-35" width="8" height="10" fill="#068b76" rx="1"/>
              <rect x="-2" y="-40" width="4" height="5" fill="white"/>
            </g>
            
            <!-- Student 2 -->
            <g transform="translate(750, 380)">
              <circle cx="0" cy="-15" r="12" fill="url(#studentGradient)"/>
              <rect x="-8" y="-5" width="16" height="20" fill="url(#studentGradient)" rx="3"/>
              <rect x="-6" y="-25" width="12" height="10" fill="#068b76" rx="2"/>
              <rect x="-4" y="-35" width="8" height="10" fill="#068b76" rx="1"/>
              <rect x="-2" y="-40" width="4" height="5" fill="white"/>
            </g>
            
            <!-- Student 3 -->
            <g transform="translate(900, 360)">
              <circle cx="0" cy="-15" r="12" fill="url(#studentGradient)"/>
              <rect x="-8" y="-5" width="16" height="20" fill="url(#studentGradient)" rx="3"/>
              <rect x="-6" y="-25" width="12" height="10" fill="#068b76" rx="2"/>
              <rect x="-4" y="-35" width="8" height="10" fill="#068b76" rx="1"/>
              <rect x="-2" y="-40" width="4" height="5" fill="white"/>
            </g>
          </g>
          
          <!-- Scholarship symbols (stars and certificates) -->
          <g opacity="0.6">
            <!-- Stars -->
            <g fill="white">
              <polygon points="300,150 305,165 320,165 308,175 313,190 300,180 287,190 292,175 280,165 295,165" fill="white"/>
              <polygon points="450,120 455,135 470,135 458,145 463,160 450,150 437,160 442,145 430,135 445,135" fill="white"/>
              <polygon points="800,140 805,155 820,155 808,165 813,180 800,170 787,180 792,165 780,155 795,155" fill="white"/>
            </g>
            
            <!-- Certificates -->
            <g transform="translate(350, 200)">
              <rect x="0" y="0" width="30" height="40" fill="white" opacity="0.8" rx="2"/>
              <rect x="2" y="2" width="26" height="36" fill="none" stroke="#068b76" stroke-width="1" rx="1"/>
              <text x="15" y="20" font-family="serif" font-size="8" fill="#068b76" text-anchor="middle">奖</text>
              <text x="15" y="30" font-family="serif" font-size="8" fill="#068b76" text-anchor="middle">学</text>
            </g>
            
            <g transform="translate(650, 180)">
              <rect x="0" y="0" width="30" height="40" fill="white" opacity="0.8" rx="2"/>
              <rect x="2" y="2" width="26" height="36" fill="none" stroke="#068b76" stroke-width="1" rx="1"/>
              <text x="15" y="20" font-family="serif" font-size="8" fill="#068b76" text-anchor="middle">证</text>
              <text x="15" y="30" font-family="serif" font-size="8" fill="#068b76" text-anchor="middle">书</text>
            </g>
          </g>
          
          <!-- Globe/World map element -->
          <g transform="translate(1000, 300)">
            <circle cx="0" cy="0" r="60" fill="none" stroke="white" stroke-width="2" opacity="0.4"/>
            <circle cx="0" cy="0" r="45" fill="none" stroke="white" stroke-width="1" opacity="0.3"/>
            <circle cx="0" cy="0" r="30" fill="none" stroke="white" stroke-width="1" opacity="0.2"/>
            <!-- Simple world map lines -->
            <path d="M-40,-10 Q-20,-20 0,-10 Q20,-5 40,-10" stroke="white" stroke-width="1" fill="none" opacity="0.3"/>
            <path d="M-40,0 Q-20,10 0,0 Q20,5 40,0" stroke="white" stroke-width="1" fill="none" opacity="0.3"/>
            <path d="M-40,10 Q-20,20 0,10 Q20,15 40,10" stroke="white" stroke-width="1" fill="none" opacity="0.3"/>
          </g>
          
          <!-- Floating books and scrolls -->
          <g opacity="0.5">
            <rect x="200" y="400" width="15" height="20" fill="white" rx="2" transform="rotate(-15 207.5 410)"/>
            <rect x="800" y="420" width="15" height="20" fill="white" rx="2" transform="rotate(20 807.5 430)"/>
            <rect x="950" y="380" width="15" height="20" fill="white" rx="2" transform="rotate(-10 957.5 390)"/>
          </g>
        </svg>
      </div>
    </div>
    
    <div class="hero-overlay">
      <v-container class="fill-height d-flex align-center">
        <v-row justify="center" align="center">
          <v-col cols="12" lg="6" class="text-center text-lg-left">
            <div class="hero-content">
              <h1 class="text-h2 text-lg-h1 font-weight-bold text-white mb-6 text-uppercase">
                Global Scholarship Platform
              </h1>
              <p class="text-h6 text-lg-h5 text-white mb-8 opacity-90">
                MalishaEdu aims to help international students find all self-finance & scholarship programs in Chinese universities easily and safely.
              </p>
              <div class="d-flex flex-column flex-lg-row justify-lg-start justify-center gap-4">
                <v-btn
                  to="/scholarship"
                  color="primary"
                  variant="elevated"
                  size="x-large"
                  class="text-h6 px-8 hero-btn"
                >
                  <v-icon class="mr-2">mdi-school</v-icon>
                  Find Scholarships
                </v-btn>
                <v-btn
                  to="/universities"
                  color="white"
                  variant="outlined"
                  size="x-large"
                  class="text-h6 px-8 hero-btn"
                >
                  <v-icon class="mr-2">mdi-domain</v-icon>
                  Browse Universities
                </v-btn>
              </div>
            </div>
          </v-col>
          <v-col cols="12" lg="6" class="d-none d-lg-flex justify-center align-center">
            <div class="hero-stats">
              <div class="stat-card">
                <div class="stat-number">500+</div>
                <div class="stat-label">Universities</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">2000+</div>
                <div class="stat-label">Programs</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">50K+</div>
                <div class="stat-label">Students</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Social Icons -->
    <div class="social-icons">
      <v-container>
        <div class="d-flex justify-center">
          <v-btn
            v-for="social in socialLinks"
            :key="social.name"
            :href="social.url"
            target="_blank"
            icon
            variant="elevated"
            color="white"
            size="large"
            class="mx-2 social-btn"
          >
            <v-icon size="24">{{ social.icon }}</v-icon>
          </v-btn>
        </div>
      </v-container>
    </div>
  </section>
</template>

<script setup>
const socialLinks = [
  { name: 'linkedin', icon: 'mdi-linkedin', url: 'https://linkedin.com/company/malishaedu' },
  { name: 'facebook', icon: 'mdi-facebook', url: 'https://facebook.com/malishaedu' },
  { name: 'youtube', icon: 'mdi-youtube', url: 'https://youtube.com/malishaedu' },
  { name: 'twitter', icon: 'mdi-twitter', url: 'https://twitter.com/malishaedu' }
]
</script>

<style scoped>
.hero-section {
  position: relative;
  margin-top: -80px; /* Offset app bar height */
  padding-top: 80px;
  min-height: 600px;
  overflow: hidden;
}

.hero-background {
  position: relative;
  width: 100%;
  height: 600px;
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(6, 139, 118, 0.9) 0%,
    rgba(6, 139, 118, 0.8) 30%,
    rgba(6, 139, 118, 0.7) 70%,
    rgba(6, 139, 118, 0.9) 100%
  );
  z-index: 1;
}

.hero-svg-illustration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.hero-svg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(6, 139, 118, 0.95) 0%,
    rgba(6, 139, 118, 0.85) 50%,
    rgba(6, 139, 118, 0.7) 100%
  );
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
}

.hero-btn {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.hero-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-card {
  text-align: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.social-icons {
  position: absolute;
  bottom: -30px;
  left: 0;
  right: 0;
  z-index: 4;
}

.social-btn {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.hero-svg-illustration {
  animation: float 6s ease-in-out infinite;
}

/* Responsive adjustments */
@media (max-width: 1264px) {
  .hero-stats {
    flex-direction: row;
    justify-content: space-around;
    padding: 30px 20px;
  }
  
  .stat-card {
    flex: 1;
    margin: 0 10px;
  }
  
  .stat-number {
    font-size: 2rem;
  }
}

@media (max-width: 960px) {
  .hero-section {
    margin-top: -64px;
    padding-top: 64px;
  }
  
  .hero-background {
    height: 500px;
  }
  
  .hero-overlay {
    background: linear-gradient(
      135deg,
      rgba(6, 139, 118, 0.95) 0%,
      rgba(6, 139, 118, 0.9) 100%
    );
  }
  
  .hero-stats {
    display: none;
  }
  
  .social-icons {
    bottom: -20px;
  }
  
  .social-btn {
    margin: 0 4px !important;
  }
}

@media (max-width: 600px) {
  .hero-section {
    margin-top: -56px;
    padding-top: 56px;
  }
  
  .hero-background {
    height: 450px;
  }
  
  .stat-number {
    font-size: 1.8rem;
  }
  
  .stat-label {
    font-size: 0.9rem;
  }
}
</style>
