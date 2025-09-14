<template>
  <div class="signin-page">
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card
            class="pa-8"
            elevation="8"
            rounded="xl"
          >
            <!-- Logo and Title -->
            <div class="text-center mb-8">
              <v-avatar
                size="60"
                color="primary"
                class="mb-4"
              >
                <span class="text-h4 font-weight-bold text-white">M</span>
              </v-avatar>
              <h1 class="text-h4 font-weight-bold text-primary mb-2">
                Welcome Back
              </h1>
              <p class="text-body-1 text-grey-darken-1">
                Sign in to your account
              </p>
            </div>

            <!-- Sign In Form -->
            <v-form
              ref="form"
              v-model="valid"
              @submit.prevent="handleSignIn"
            >
              <v-text-field
                v-model="signInForm.email"
                label="Email Address"
                type="email"
                variant="outlined"
                :rules="emailRules"
                prepend-inner-icon="mdi-email"
                class="mb-4"
                required
              />

              <v-text-field
                v-model="signInForm.password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                :rules="passwordRules"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                class="mb-4"
                required
              />

              <div class="d-flex justify-space-between align-center mb-6">
                <v-checkbox
                  v-model="signInForm.rememberMe"
                  label="Remember me"
                  color="primary"
                  hide-details
                />
                <router-link
                  to="/forgot-password"
                  class="text-decoration-none text-primary"
                >
                  Reset via Email
                </router-link>
              </div>

              <v-btn
                type="submit"
                color="primary"
                variant="elevated"
                size="large"
                block
                :loading="authStore.loading"
                class="mb-4"
              >
                Sign In
              </v-btn>
            </v-form>


            <!-- Sign Up Link -->
            <div class="text-center">
              <span class="text-body-2 text-grey-darken-1">
                Don't have an account?
              </span>
              <router-link
                to="/signup"
                class="text-decoration-none text-primary ml-1 font-weight-medium"
              >
                Sign Up
              </router-link>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const form = ref(null)
const valid = ref(false)
const showPassword = ref(false)

const signInForm = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const emailRules = [
  v => !!v || 'Email is required',
  v => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(v) || 'Please enter a valid email address'
  }
]

const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 1 || 'Password is required'
]

const handleSignIn = async () => {
  // Validate form first
  if (!valid.value) {
    toast.error('Please fill in all required fields correctly')
    return
  }

  // Additional email format validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(signInForm.email)) {
    toast.error('Please enter a valid email address')
    return
  }

  // Check if password is provided
  if (!signInForm.password.trim()) {
    toast.error('Password is required')
    return
  }

  try {
    // Remove rememberMe from the data sent to backend
    const { rememberMe, ...loginData } = signInForm
    console.log('Attempting login with data:', loginData)
    const result = await authStore.login(loginData)
    console.log('Login result:', result)
    if (result.success) {
      toast.success('Welcome back!')
      
      // Redirect based on user role
      if (authStore.user?.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    }
  } catch (error) {
    console.error('Sign in error:', error)
    console.error('Error response:', error.response)
    toast.error('An unexpected error occurred. Please try again.')
  }
}

</script>

<style scoped>
.signin-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #068b76 0%, #056b5a 100%);
  padding-top: 80px; /* Account for navbar */
}

.v-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.v-btn--variant-elevated {
  box-shadow: 0 4px 12px rgba(6, 139, 118, 0.3);
}

.v-btn--variant-elevated:hover {
  box-shadow: 0 6px 16px rgba(6, 139, 118, 0.4);
}
</style>
