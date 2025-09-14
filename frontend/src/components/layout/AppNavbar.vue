<template>
  <v-app-bar
    color="white"
    elevation="2"
    height="80"
    class="px-4"
  >
    <v-container class="d-flex align-center">
      <!-- Logo -->
      <router-link to="/" class="text-decoration-none d-flex align-center">
        <v-avatar
          size="50"
          color="primary"
          class="mr-3"
        >
          <span class="text-h6 font-weight-bold text-white">M</span>
        </v-avatar>
        <div class="d-flex flex-column">
          <span class="text-h6 font-weight-bold text-primary">MalishaEdu</span>
          <span class="text-caption text-grey-darken-1">Global Scholarship Platform</span>
        </div>
      </router-link>

      <v-spacer />

      <!-- Desktop Navigation -->
      <v-toolbar-items class="d-none d-md-flex align-center">
        <v-btn
          v-for="item in menuItems"
          :key="item.name"
          :to="item.to"
          variant="text"
          class="text-body-1 font-weight-medium mx-2"
          :class="[
            { 'text-primary': $route.name === item.name },
            { 'scholarship-highlight': item.name === 'Scholarship' }
          ]"
        >
          {{ item.label }}
        </v-btn>
      </v-toolbar-items>

      <!-- Auth Buttons -->
      <div class="d-none d-md-flex align-center ml-4">
        <template v-if="!authStore.isAuthenticated">
          <v-btn
            to="/signin"
            variant="text"
            class="mr-2"
          >
            Sign In
          </v-btn>
          <v-btn
            to="/signup"
            color="primary"
            variant="elevated"
          >
            Sign Up
          </v-btn>
        </template>
        <template v-else>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                class="d-flex align-center"
              >
                <v-avatar size="32" class="mr-2">
                  <v-img
                    v-if="authStore.user?.profile_image_url"
                    :src="authStore.user.profile_image_url"
                    :alt="authStore.user.first_name"
                  />
                  <v-icon v-else>mdi-account</v-icon>
                </v-avatar>
                {{ authStore.user?.first_name }}
                <v-icon class="ml-1">mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-if="authStore.isAdmin"
                to="/admin"
                prepend-icon="mdi-view-dashboard"
              >
                Admin Panel
              </v-list-item>
              <v-list-item
                to="/profile"
                prepend-icon="mdi-account"
              >
                Profile
              </v-list-item>
              <v-divider />
              <v-list-item
                @click="authStore.logout()"
                prepend-icon="mdi-logout"
              >
                Sign Out
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </div>

      <!-- Mobile Menu Button -->
      <v-btn
        class="d-md-none mobile-menu-btn"
        icon
        @click="toggleDrawer"
        :color="drawer ? 'primary' : 'default'"
        :disabled="false"
      >
        <v-icon>{{ drawer ? 'mdi-close' : 'mdi-menu' }}</v-icon>
      </v-btn>
      
      <!-- Debug info (remove in production) -->
      <div v-if="drawer" class="d-md-none text-caption text-primary ml-2">
        Open
      </div>
    </v-container>
  </v-app-bar>

  <!-- Custom Mobile Navigation Drawer -->
  <div v-if="drawer" class="custom-drawer-overlay" @click="closeDrawer"></div>
  <div v-if="drawer" class="custom-drawer">
    <!-- Header -->
    <div class="drawer-header">
      <div class="drawer-logo">
        <v-avatar size="40" color="primary" class="mr-3">
          <span class="text-h6 font-weight-bold text-white">M</span>
        </v-avatar>
        <div>
          <span class="text-h6 font-weight-bold text-white">MalishaEdu</span>
          <div class="text-caption text-white opacity-80">Global Scholarship Platform</div>
        </div>
      </div>
      <v-btn
        icon
        @click="closeDrawer"
        color="white"
        size="small"
        class="close-btn"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <!-- Navigation Items -->
    <div class="drawer-content">
      <!-- Main Navigation -->
      <div class="nav-section">
        <div class="section-title">MalishaEdu</div>
        <div
          v-for="item in menuItems"
          :key="item.name"
          @click="handleMenuClick(item)"
          class="nav-item"
          :class="{ 'nav-item-active': $route.name === item.name }"
        >
          <v-icon :color="getItemIconColor(item.name)" class="nav-icon">{{ getItemIcon(item.name) }}</v-icon>
          <span class="nav-label">{{ item.label }}</span>
        </div>
      </div>

      <!-- Auth Section -->
      <div class="nav-section">
        <div class="section-title">Account</div>
        <template v-if="!authStore.isAuthenticated">
          <div @click="handleAuthClick('/signin')" class="nav-item auth-item">
            <v-icon color="info" class="nav-icon">mdi-login</v-icon>
            <span class="nav-label">Sign In</span>
          </div>
          <div @click="handleAuthClick('/signup')" class="nav-item auth-item signup-item">
            <v-icon color="success" class="nav-icon">mdi-account-plus</v-icon>
            <span class="nav-label">Sign Up</span>
          </div>
        </template>
        <template v-else>
          <div
            v-if="authStore.isAdmin"
            @click="handleAuthClick('/admin')"
            class="nav-item auth-item admin-item"
          >
            <v-icon color="warning" class="nav-icon">mdi-view-dashboard</v-icon>
            <span class="nav-label">Admin Panel</span>
          </div>
          <div @click="handleAuthClick('/profile')" class="nav-item auth-item">
            <v-icon color="primary" class="nav-icon">mdi-account</v-icon>
            <span class="nav-label">Profile</span>
          </div>
          <div @click="handleLogout" class="nav-item auth-item logout-item">
            <v-icon color="error" class="nav-icon">mdi-logout</v-icon>
            <span class="nav-label">Sign Out</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const drawer = ref(false)

const menuItems = [
  { name: 'Home', label: 'Home', to: '/' },
  { name: 'Scholarship', label: 'Scholarship', to: '/scholarship' },
  { name: 'Universities', label: 'Universities', to: '/universities' },
  { name: 'Programs', label: 'Programs', to: '/programs' }
]

const toggleDrawer = () => {
  console.log('Toggle clicked, current drawer state:', drawer.value)
  drawer.value = !drawer.value
  console.log('Drawer toggled to:', drawer.value)
  
  // Force reactivity update
  setTimeout(() => {
    console.log('Drawer state after timeout:', drawer.value)
  }, 100)
}

// Close drawer when route changes
const closeDrawer = () => {
  drawer.value = false
}

// Handle menu item clicks
const handleMenuClick = (item) => {
  console.log('Menu item clicked:', item.label, 'Route:', item.to)
  if (item.to) {
    router.push(item.to)
  }
  closeDrawer()
}

// Handle auth item clicks
const handleAuthClick = (route) => {
  console.log('Auth item clicked, navigating to:', route)
  router.push(route)
  closeDrawer()
}

// Handle logout
const handleLogout = () => {
  console.log('Logout clicked')
  authStore.logout()
  closeDrawer()
}

// Close drawer on escape key
const handleEscape = (event) => {
  if (event.key === 'Escape' && drawer.value) {
    drawer.value = false
  }
}

// Get icon for menu item
const getItemIcon = (itemName) => {
  const icons = {
    'Home': 'mdi-home',
    'Scholarship': 'mdi-school',
    'Universities': 'mdi-domain',
    'Programs': 'mdi-book-open-page-variant'
  }
  return icons[itemName] || 'mdi-circle'
}

// Get icon color for menu item
const getItemIconColor = (itemName) => {
  const colors = {
    'Home': 'primary',
    'Scholarship': 'success',
    'Universities': 'info',
    'Programs': 'warning'
  }
  return colors[itemName] || 'grey'
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.v-app-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.v-btn--variant-text:hover {
  background-color: rgba(6, 139, 118, 0.1);
}

.scholarship-highlight {
  background: linear-gradient(135deg, #068b76, #0a9b85) !important;
  color: white !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 8px rgba(6, 139, 118, 0.3) !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  position: relative !important;
  overflow: hidden !important;
}

.scholarship-highlight::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.scholarship-highlight:hover::before {
  left: 100%;
}

.scholarship-highlight:hover {
  background: linear-gradient(135deg, #0a9b85, #068b76) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 12px rgba(6, 139, 118, 0.4) !important;
}

.scholarship-highlight:active {
  transform: translateY(0) !important;
}

/* Mobile menu button */
.mobile-menu-btn {
  z-index: 1001 !important;
}

/* Custom Drawer Styles */
.custom-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

.custom-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  background: white;
  z-index: 1000;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  animation: slideInRight 0.3s ease;
  display: flex;
  flex-direction: column;
}

/* Drawer Header */
.drawer-header {
  background: linear-gradient(135deg, #068b76 0%, #0a9b85 100%);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.drawer-logo {
  display: flex;
  align-items: center;
}

.drawer-logo .text-primary {
  color: white !important;
}

.drawer-logo .text-grey-darken-1 {
  color: rgba(255, 255, 255, 0.8) !important;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
}

/* Drawer Content */
.drawer-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

/* Navigation Items */
.nav-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  margin: 8px 0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  border: 1px solid transparent;
}

.nav-item:hover {
  background: rgba(6, 139, 118, 0.08);
  transform: translateX(8px);
  border-color: rgba(6, 139, 118, 0.2);
}

.nav-item-active {
  background: linear-gradient(135deg, rgba(6, 139, 118, 0.12) 0%, rgba(10, 155, 133, 0.12) 100%);
  border-left: 4px solid #068b76;
  color: #068b76;
}

.nav-icon {
  margin-right: 16px;
  font-size: 24px;
}

.nav-label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.nav-item-active .nav-label {
  color: #068b76;
  font-weight: 600;
}

/* Auth Items */
.auth-item {
  background: rgba(248, 249, 250, 0.8);
}

.signup-item {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(76, 175, 80, 0.12) 100%);
}

.signup-item:hover {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.2) 100%);
}

.admin-item {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.08) 0%, rgba(255, 193, 7, 0.12) 100%);
}

.admin-item:hover {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.15) 0%, rgba(255, 193, 7, 0.2) 100%);
}

.logout-item {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.08) 0%, rgba(244, 67, 54, 0.12) 100%);
}

.logout-item:hover {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.15) 0%, rgba(244, 67, 54, 0.2) 100%);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Responsive */
@media (max-width: 959px) {
  .mobile-menu-btn {
    display: flex !important;
  }
}

@media (max-width: 600px) {
  .custom-drawer {
    width: 100%;
  }
}
</style>
