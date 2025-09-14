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
        class="d-md-none"
        icon
        @click="drawer = !drawer"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-container>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="right"
      width="280"
    >
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.name"
          :to="item.to"
          @click="drawer = false"
        >
          <v-list-item-title>{{ item.label }}</v-list-item-title>
        </v-list-item>

        <v-divider class="my-2" />

        <template v-if="!authStore.isAuthenticated">
          <v-list-item to="/signin" @click="drawer = false">
            <v-list-item-title>Sign In</v-list-item-title>
          </v-list-item>
          <v-list-item to="/signup" @click="drawer = false">
            <v-list-item-title>Sign Up</v-list-item-title>
          </v-list-item>
        </template>
        <template v-else>
          <v-list-item
            v-if="authStore.isAdmin"
            to="/admin"
            @click="drawer = false"
          >
            <v-list-item-title>Admin Panel</v-list-item-title>
          </v-list-item>
          <v-list-item to="/profile" @click="drawer = false">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item @click="authStore.logout(); drawer = false">
            <v-list-item-title>Sign Out</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const drawer = ref(false)

const menuItems = [
  { name: 'Home', label: 'Home', to: '/' },
  { name: 'Scholarship', label: 'Scholarship', to: '/scholarship' },
  { name: 'Universities', label: 'Universities', to: '/universities' },
  { name: 'Programs', label: 'Programs', to: '/programs' }
]
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
</style>
