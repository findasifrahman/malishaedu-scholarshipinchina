<template>
  <div class="forgot-password-page">
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
                Reset Password
              </h1>
              <p class="text-body-1 text-grey-darken-1">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>

            <!-- Reset Form -->
            <v-form
              ref="formRef"
              v-model="valid"
              @submit.prevent="handleResetPassword"
            >
              <v-text-field
                v-model="form.email"
                label="Email Address"
                type="email"
                variant="outlined"
                :rules="emailRules"
                prepend-inner-icon="mdi-email"
                class="mb-6"
                required
              />

              <v-btn
                type="submit"
                color="primary"
                variant="elevated"
                size="large"
                block
                :loading="loading"
                class="mb-4"
              >
                Send Reset Link
              </v-btn>
            </v-form>

            <!-- Back to Sign In -->
            <div class="text-center">
              <span class="text-body-2 text-grey-darken-1">
                Remember your password?
              </span>
              <router-link
                to="/signin"
                class="text-decoration-none text-primary ml-1 font-weight-medium"
              >
                Sign In
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
import { useToast } from 'vue-toastification'
import api from '@/services/api'

const router = useRouter()
const toast = useToast()

const formRef = ref(null)
const valid = ref(false)
const loading = ref(false)

const form = reactive({
  email: ''
})

const emailRules = [
  v => !!v || 'Email is required',
  v => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(v) || 'Please enter a valid email address'
  }
]

const handleResetPassword = async () => {
  // Validate form first
  if (!valid.value) {
    toast.error('Please enter a valid email address')
    return
  }

  // Additional email format validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(form.email)) {
    toast.error('Please enter a valid email address')
    return
  }

  loading.value = true
  try {
    console.log('Sending password reset request for:', form.email)
    const response = await api.post('/auth/forgot-password', { email: form.email })
    console.log('Password reset response:', response.data)
    
    toast.success('Password reset link sent to your email!')
    router.push('/signin')
  } catch (error) {
    console.error('Password reset error:', error)
    console.error('Error response:', error.response?.data)
    
    if (error.response?.data?.error) {
      toast.error(error.response.data.error)
    } else {
      toast.error('Failed to send reset link. Please try again.')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.forgot-password-page {
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

