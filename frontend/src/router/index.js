import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/universities',
    name: 'Universities',
    component: () => import('@/views/Universities.vue')
  },
  {
    path: '/university/:id',
    name: 'UniversityDetail',
    component: () => import('@/views/UniversityDetail.vue'),
    props: true
  },
  {
    path: '/programs',
    name: 'Programs',
    component: () => import('@/views/Programs.vue')
  },
  {
    path: '/program/:id',
    name: 'ProgramDetail',
    component: () => import('@/views/ProgramDetail.vue'),
    props: true
  },
  {
    path: '/scholarship',
    name: 'Scholarship',
    component: () => import('@/views/Scholarship.vue')
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import('@/views/auth/SignIn.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('@/views/auth/SignUp.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPassword.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/auth/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'universities',
        name: 'AdminUniversities',
        component: () => import('@/views/admin/Universities.vue')
      },
      {
        path: 'programs',
        name: 'AdminPrograms',
        component: () => import('@/views/admin/Programs.vue')
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/Users.vue')
      },
      {
        path: 'cities',
        name: 'AdminCities',
        component: () => import('@/views/admin/Cities.vue')
      },
      {
        path: 'program-names',
        name: 'AdminProgramNames',
        component: () => import('@/views/admin/ProgramNames.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/signin')
    return
  }
  
  // Check if route requires admin access
  if (to.meta.requiresAdmin && (!authStore.isAuthenticated || authStore.user?.role !== 'admin')) {
    next('/')
    return
  }
  
  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
    return
  }
  
  next()
})

export default router
