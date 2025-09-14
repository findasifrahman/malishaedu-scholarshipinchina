<template>
  <v-app>
    <AppNavbar />
    <v-main>
      <router-view />
    </v-main>
    <AppFooter />
  </v-app>
</template>

<script setup>
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<style>
html {
  scroll-behavior: smooth;
}

.v-application {
  font-family: 'Roboto', sans-serif !important;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #068b76;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #056b5a;
}

/* Custom button styles */
.v-btn--variant-elevated {
  box-shadow: 0 4px 8px rgba(6, 139, 118, 0.3);
}

.v-btn--variant-elevated:hover {
  box-shadow: 0 6px 12px rgba(6, 139, 118, 0.4);
}

/* Custom card styles */
.v-card--variant-elevated {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.v-card--variant-elevated:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
}

/* Text styles */
.text-uppercase {
  text-transform: uppercase !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px !important;
}

/* Animation classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>
