<template>
  <div class="admin-dashboard">
    <v-container fluid>
      <v-row>
        <!-- Sidebar -->
        <v-col cols="12" md="3">
          <v-card class="pa-4" elevation="2">
            <h3 class="text-h6 font-weight-bold mb-4">Admin Panel</h3>
            <v-list>
              <v-list-item
                v-for="item in menuItems"
                :key="item.name"
                :to="item.to"
                :active="isActive(item.to)"
                class="mb-2"
              >
                <template v-slot:prepend>
                  <v-icon>{{ item.icon }}</v-icon>
                </template>
                <v-list-item-title>{{ item.label }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" md="9">
          <router-view />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const menuItems = [
  { name: 'Dashboard', label: 'Dashboard', icon: 'mdi-view-dashboard', to: '/admin' },
  { name: 'AdminUniversities', label: 'Universities', icon: 'mdi-school', to: '/admin/universities' },
  { name: 'AdminPrograms', label: 'Programs', icon: 'mdi-book', to: '/admin/programs' },
  { name: 'AdminProgramNames', label: 'Program Names', icon: 'mdi-format-list-bulleted', to: '/admin/program-names' },
  { name: 'AdminUsers', label: 'Users', icon: 'mdi-account-group', to: '/admin/users' },
  { name: 'AdminCities', label: 'Cities', icon: 'mdi-city', to: '/admin/cities' }
]

const isActive = (path) => {
  return route.path === path
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background-color: #fafafa;
  padding-top: 80px;
}

.v-list-item--active {
  background-color: rgba(6, 139, 118, 0.1);
  color: #068b76;
}
</style>
