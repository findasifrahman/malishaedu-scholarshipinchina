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

  <!-- Mobile Navigation Drawer (Outside app-bar) -->
  <v-navigation-drawer
    v-model="drawer"
    temporary
    location="right"
    width="300"
    class="mobile-drawer"
    overlay-opacity="0.3"
    overlay-color="black"
  >
      <!-- Header Section -->
      <div class="drawer-header">
        <div class="drawer-logo">
          <v-avatar size="40" color="primary" class="mr-3">
            <span class="text-h6 font-weight-bold text-white">M</span>
          </v-avatar>
          <div>
            <span class="text-h6 font-weight-bold text-primary">MalishaEdu</span>
            <div class="text-caption text-grey-darken-1">Global Scholarship Platform</div>
          </div>
        </div>
      </div>

      <!-- Navigation Items -->
      <div class="simple-menu">
        <!-- Main Navigation -->
        <div class="menu-group">
          <button
            v-for="item in menuItems"
            :key="item.name"
            @click="handleMenuClick(item)"
            class="menu-button"
            :class="{ 'menu-button-active': $route.name === item.name }"
          >
            <v-icon :color="getItemIconColor(item.name)" class="menu-icon">{{ getItemIcon(item.name) }}</v-icon>
            <span class="menu-label">{{ item.label }}</span>
          </button>
        </div>

        <hr class="menu-divider" />

        <!-- Auth Section -->
        <div class="menu-group">
          <template v-if="!authStore.isAuthenticated">
            <button @click="handleAuthClick('/signin')" class="menu-button auth-button">
              <v-icon color="info" class="menu-icon">mdi-login</v-icon>
              <span class="menu-label">Sign In</span>
            </button>
            <button @click="handleAuthClick('/signup')" class="menu-button auth-button signup-button">
              <v-icon color="success" class="menu-icon">mdi-account-plus</v-icon>
              <span class="menu-label">Sign Up</span>
            </button>
          </template>
          <template v-else>
            <button
              v-if="authStore.isAdmin"
              @click="handleAuthClick('/admin')"
              class="menu-button auth-button admin-button"
            >
              <v-icon color="warning" class="menu-icon">mdi-view-dashboard</v-icon>
              <span class="menu-label">Admin Panel</span>
            </button>
            <button @click="handleAuthClick('/profile')" class="menu-button auth-button">
              <v-icon color="primary" class="menu-icon">mdi-account</v-icon>
              <span class="menu-label">Profile</span>
            </button>
            <button @click="handleLogout" class="menu-button auth-button logout-button">
              <v-icon color="error" class="menu-icon">mdi-logout</v-icon>
              <span class="menu-label">Sign Out</span>
            </button>
          </template>
        </div>
      </div>
    </v-navigation-drawer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
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
  // Navigate first, then close drawer
  if (item.to) {
    window.location.href = item.to
  }
  // Close drawer after a short delay
  setTimeout(() => {
    closeDrawer()
  }, 200)
}

// Handle auth item clicks
const handleAuthClick = (route) => {
  console.log('Auth item clicked, navigating to:', route)
  // Navigate first, then close drawer
  window.location.href = route
  // Close drawer after a short delay
  setTimeout(() => {
    closeDrawer()
  }, 200)
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

/* Mobile menu styles */
.mobile-menu-btn {
  z-index: 1001 !important;
}

.mobile-drawer {
  z-index: 1000 !important;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15) !important;
}

/* Drawer Header */
.drawer-header {
  background: linear-gradient(135deg, #068b76 0%, #0a9b85 100%);
  padding: 20px 16px;
  margin-bottom: 8px;
}

.drawer-logo {
  display: flex;
  align-items: center;
  color: white;
}

.drawer-logo .text-primary {
  color: white !important;
}

.drawer-logo .text-grey-darken-1 {
  color: rgba(255, 255, 255, 0.8) !important;
}

/* Override any Vuetify drawer fading */
.v-navigation-drawer {
  opacity: 1 !important;
  pointer-events: auto !important;
}

.v-navigation-drawer .v-list {
  opacity: 1 !important;
  pointer-events: auto !important;
}

.v-navigation-drawer * {
  opacity: 1 !important;
  pointer-events: auto !important;
}

/* Simple Menu */
.simple-menu {
  padding: 20px;
}

.menu-group {
  margin-bottom: 20px;
}

.menu-button {
  display: flex !important;
  align-items: center !important;
  width: 100% !important;
  padding: 16px 20px !important;
  margin: 8px 0 !important;
  border: none !important;
  border-radius: 12px !important;
  background: rgba(255, 255, 255, 0.95) !important;
  color: #2c3e50 !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  text-align: left !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  position: relative !important;
  z-index: 10 !important;
}

.menu-button:hover {
  background: rgba(6, 139, 118, 0.1);
  transform: translateX(8px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.menu-button:active {
  background: rgba(6, 139, 118, 0.2);
  transform: translateX(4px);
}

.menu-button-active {
  background: linear-gradient(135deg, rgba(6, 139, 118, 0.15) 0%, rgba(10, 155, 133, 0.15) 100%);
  border-left: 4px solid #068b76;
}

.menu-icon {
  margin-right: 16px !important;
  font-size: 24px !important;
  opacity: 1 !important;
  pointer-events: none !important;
}

.menu-label {
  flex: 1;
}

/* Auth Buttons */
.auth-button {
  background: rgba(255, 255, 255, 0.9);
}

.signup-button {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.2) 100%);
}

.admin-button {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.2) 100%);
}

.logout-button {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.2) 100%);
}

.menu-divider {
  border: none;
  height: 1px;
  background: rgba(6, 139, 118, 0.2);
  margin: 20px 0;
}

/* Divider */
.drawer-divider {
  border-color: rgba(6, 139, 118, 0.2) !important;
  margin: 16px 0 !important;
}

/* Auth Section */
.drawer-auth-section {
  margin-top: 8px;
}

/* Ensure mobile menu is visible and positioned correctly */
@media (max-width: 959px) {
  .mobile-menu-btn {
    display: flex !important;
  }
  
  .mobile-drawer {
    z-index: 1000 !important;
  }
}

/* Animation for drawer items */
.drawer-item {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
