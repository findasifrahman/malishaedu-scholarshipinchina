<template>
  <footer class="custom-footer">
    <!-- Beautiful background with gradient -->
    <div class="footer-background">
      <div class="footer-gradient"></div>
      <div class="footer-pattern">
        <svg viewBox="0 0 1200 400" xmlns="http://www.w3.org/2000/svg" class="footer-svg">
          <defs>
            <linearGradient id="footerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#068b76;stop-opacity:0.1" />
              <stop offset="50%" style="stop-color:#068b76;stop-opacity:0.05" />
              <stop offset="100%" style="stop-color:#068b76;stop-opacity:0.02" />
            </linearGradient>
            <pattern id="footerPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#068b76" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width="1200" height="400" fill="url(#footerGradient)"/>
          <rect width="1200" height="400" fill="url(#footerPattern)"/>
          
          <!-- Decorative elements -->
          <g opacity="0.06">
            <circle cx="100" cy="100" r="30" fill="#068b76"/>
            <circle cx="300" cy="150" r="20" fill="#068b76"/>
            <circle cx="500" cy="80" r="25" fill="#068b76"/>
            <circle cx="700" cy="120" r="35" fill="#068b76"/>
            <circle cx="900" cy="90" r="28" fill="#068b76"/>
            <circle cx="1100" cy="140" r="22" fill="#068b76"/>
            <circle cx="200" cy="250" r="15" fill="#068b76"/>
            <circle cx="600" cy="280" r="18" fill="#068b76"/>
            <circle cx="1000" cy="250" r="20" fill="#068b76"/>
          </g>
        </svg>
      </div>
    </div>
    
    <v-container class="footer-content">
      <v-row>
        <!-- Company Info -->
        <v-col cols="12" md="4">
          <div class="company-section">
            <div class="d-flex align-center mb-4">
              <v-img
                src="/malisha-logo.png"
                alt="MalishaEdu"
                height="50"
                width="50"
                class="mr-3 logo"
              />
              <div>
                <h3 class="text-h5 font-weight-bold text-white mb-1">MalishaEdu</h3>
                <p class="text-subtitle-2 text-primary-lighten-2">Global Scholarship Platform</p>
              </div>
            </div>
            <p class="text-body-1 text-white mb-4 company-description">
              MalishaEdu aims to help international students find all self-finance & scholarship programs in Chinese universities easily and safely.
            </p>
            <!-- Social Icons -->
            <div class="social-icons">
              <v-btn
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.url"
                target="_blank"
                icon
                variant="elevated"
                color="primary"
                size="small"
                class="social-btn"
              >
                <v-icon color="white">{{ social.icon }}</v-icon>
              </v-btn>
            </div>
          </div>
        </v-col>

        <!-- Quick Links -->
        <v-col cols="12" sm="6" md="2">
          <div class="links-section">
            <h4 class="section-title">Quick Links</h4>
            <v-list density="compact" color="transparent" class="links-list">
              <v-list-item
                v-for="link in quickLinks"
                :key="link.name"
                :to="link.to"
                class="px-0 link-item"
              >
                <v-list-item-title class="link-text">
                  {{ link.label }}
                </v-list-item-title>
                <template v-slot:prepend>
                  <v-icon size="small" color="primary" class="mr-2">mdi-chevron-right</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </div>
        </v-col>

        <!-- Support -->
        <v-col cols="12" sm="6" md="2">
          <div class="links-section">
            <h4 class="section-title">Support</h4>
            <v-list density="compact" color="transparent" class="links-list">
              <v-list-item
                v-for="link in supportLinks"
                :key="link.name"
                :to="link.to"
                class="px-0 link-item"
              >
                <v-list-item-title class="link-text">
                  {{ link.label }}
                </v-list-item-title>
                <template v-slot:prepend>
                  <v-icon size="small" color="primary" class="mr-2">mdi-chevron-right</v-icon>
                </template>
              </v-list-item>
            </v-list>
          </div>
        </v-col>

        <!-- Contact Info -->
        <v-col cols="12" md="4">
          <div class="contact-section">
            <h4 class="section-title">Contact Us</h4>
            <div class="contact-info">
              <div class="contact-item">
                <v-icon class="contact-icon" size="small">mdi-email</v-icon>
                <span class="contact-text">info@malishaedu.com</span>
              </div>
              <div class="contact-item">
                <v-icon class="contact-icon" size="small">mdi-phone</v-icon>
                <span class="contact-text">+86 123 4567 8900</span>
              </div>
              <div class="contact-item">
                <v-icon class="contact-icon" size="small">mdi-map-marker</v-icon>
                <span class="contact-text">Beijing, China</span>
              </div>
            </div>
            
            <!-- Newsletter Signup -->
            <div class="newsletter-section">
              <h5 class="newsletter-title">Stay Updated</h5>
              <p class="newsletter-description">
                Subscribe to get updates on new scholarships and programs.
              </p>
              <v-form @submit.prevent="subscribeNewsletter" class="newsletter-form">
                <v-text-field
                  v-model="email"
                  placeholder="Enter your email"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="newsletter-input"
                  color="primary"
                  bg-color="white"
                />
                <v-btn
                  type="submit"
                  color="primary"
                  variant="elevated"
                  size="small"
                  block
                  :loading="subscribing"
                  class="newsletter-btn"
                >
                  <v-icon class="mr-1">mdi-send</v-icon>
                  Subscribe
                </v-btn>
              </v-form>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Divider -->
      <v-divider class="footer-divider" />

      <!-- Copyright -->
      <v-row align="center" justify="space-between" class="copyright-section">
        <v-col cols="12" md="6">
          <p class="copyright-text">
            © {{ currentYear }} MalishaEdu Global Scholarship Platform. All rights reserved.
          </p>
        </v-col>
        <v-col cols="12" md="6" class="text-md-right">
          <div class="legal-links">
            <v-btn
              v-for="link in legalLinks"
              :key="link.name"
              :to="link.to"
              variant="text"
              size="small"
              class="legal-link"
            >
              {{ link.label }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const email = ref('')
const subscribing = ref(false)

const currentYear = computed(() => new Date().getFullYear())

const socialLinks = [
  { name: 'linkedin', icon: 'mdi-linkedin', url: 'https://linkedin.com/company/malishaedu' },
  { name: 'facebook', icon: 'mdi-facebook', url: 'https://facebook.com/malishaedu' },
  { name: 'youtube', icon: 'mdi-youtube', url: 'https://youtube.com/malishaedu' },
  { name: 'twitter', icon: 'mdi-twitter', url: 'https://twitter.com/malishaedu' }
]

const quickLinks = [
  { name: 'Home', label: 'Home', to: '/' },
  { name: 'Scholarship', label: 'Scholarship', to: '/scholarship' },
  { name: 'Universities', label: 'Universities', to: '/universities' },
  { name: 'Programs', label: 'Programs', to: '/programs' }
]

const supportLinks = [
  { name: 'Help', label: 'Help Center', to: '/help' },
  { name: 'Contact', label: 'Contact Us', to: '/contact' },
  { name: 'FAQ', label: 'FAQ', to: '/faq' },
  { name: 'About', label: 'About Us', to: '/about' }
]

const legalLinks = [
  { name: 'Privacy', label: 'Privacy Policy', to: '/privacy' },
  { name: 'Terms', label: 'Terms of Service', to: '/terms' },
  { name: 'Cookies', label: 'Cookie Policy', to: '/cookies' }
]

const subscribeNewsletter = async () => {
  if (!email.value) {
    toast.error('Please enter your email address')
    return
  }

  subscribing.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Successfully subscribed to newsletter!')
    email.value = ''
  } catch (error) {
    toast.error('Failed to subscribe. Please try again.')
  } finally {
    subscribing.value = false
  }
}
</script>

<style scoped>
.custom-footer {
  position: relative;
  background: linear-gradient(135deg, #0f1419 0%, #1a2332 25%, #2d3748 50%, #1a2332 75%, #0f1419 100%);
  color: white;
  margin-top: auto;
  overflow: hidden;
}

.footer-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.footer-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(6, 139, 118, 0.12) 0%,
    rgba(6, 139, 118, 0.08) 25%,
    rgba(6, 139, 118, 0.04) 50%,
    rgba(6, 139, 118, 0.08) 75%,
    rgba(6, 139, 118, 0.12) 100%
  );
}

.footer-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.footer-svg {
  width: 100%;
  height: 100%;
  opacity: 0.15;
}

.footer-content {
  position: relative;
  z-index: 1;
  padding: 60px 0 30px;
}

/* Company Section */
.company-section {
  padding: 20px 0;
}

.logo {
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(6, 139, 118, 0.3);
}

.company-description {
  line-height: 1.6;
  opacity: 0.9;
}

.social-icons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.social-btn {
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(6, 139, 118, 0.3);
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(6, 139, 118, 0.4);
}

/* Links Sections */
.links-section {
  padding: 20px 0;
}

.section-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 20px;
  position: relative;
  padding-bottom: 10px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #068b76, #0a9b85);
  border-radius: 2px;
}

.links-list {
  background: transparent !important;
}

.link-item {
  margin-bottom: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.link-item:hover {
  background: rgba(6, 139, 118, 0.1) !important;
  transform: translateX(5px);
}

.link-text {
  color: rgba(255, 255, 255, 0.8) !important;
  font-weight: 400;
  transition: color 0.3s ease;
}

.link-item:hover .link-text {
  color: white !important;
}

/* Contact Section */
.contact-section {
  padding: 20px 0;
}

.contact-info {
  margin-bottom: 30px;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px 0;
}

.contact-icon {
  color: #068b76;
  margin-right: 12px;
  width: 20px;
  text-align: center;
}

.contact-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  line-height: 1.4;
}

/* Newsletter Section */
.newsletter-section {
  background: rgba(255, 255, 255, 0.05);
  padding: 25px;
  border-radius: 15px;
  border: 1px solid rgba(6, 139, 118, 0.2);
  backdrop-filter: blur(10px);
}

.newsletter-title {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.newsletter-description {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin-bottom: 20px;
  line-height: 1.5;
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.newsletter-input {
  background: white;
  border-radius: 8px;
}

.newsletter-btn {
  border-radius: 8px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.5px;
}

/* Footer Divider */
.footer-divider {
  margin: 40px 0 30px;
  border-color: rgba(6, 139, 118, 0.3) !important;
}

/* Copyright Section */
.copyright-section {
  padding: 20px 0;
}

.copyright-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0;
}

.legal-links {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.legal-link {
  color: rgba(255, 255, 255, 0.7) !important;
  font-size: 0.85rem;
  text-transform: none;
  letter-spacing: 0.3px;
  transition: color 0.3s ease;
}

.legal-link:hover {
  color: white !important;
}

/* Responsive Design */
@media (max-width: 960px) {
  .footer-content {
    padding: 40px 0 20px;
  }
  
  .company-section,
  .links-section,
  .contact-section {
    padding: 15px 0;
    text-align: center;
  }
  
  .social-icons {
    justify-content: center;
  }
  
  .legal-links {
    justify-content: center;
    margin-top: 15px;
  }
  
  .copyright-section {
    text-align: center;
  }
}

@media (max-width: 600px) {
  .footer-content {
    padding: 30px 0 15px;
  }
  
  .section-title {
    font-size: 1.1rem;
    margin-bottom: 15px;
  }
  
  .newsletter-section {
    padding: 20px;
  }
  
  .social-icons {
    gap: 8px;
  }
  
  .legal-links {
    gap: 4px;
  }
  
  .legal-link {
    font-size: 0.8rem;
  }
}

/* Animation for hover effects */
@keyframes slideIn {
  from {
    transform: translateX(-10px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.link-item:hover {
  animation: slideIn 0.3s ease;
}

/* Custom scrollbar for footer content if needed */
.custom-footer ::-webkit-scrollbar {
  width: 6px;
}

.custom-footer ::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.custom-footer ::-webkit-scrollbar-thumb {
  background: #068b76;
  border-radius: 3px;
}

.custom-footer ::-webkit-scrollbar-thumb:hover {
  background: #0a9b85;
}
</style>
