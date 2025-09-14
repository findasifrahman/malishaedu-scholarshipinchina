<template>
  <div class="signup-page">
    <v-container class="fill-height">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="10" md="8" lg="6">
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
                Join MalishaEdu
              </h1>
              <p class="text-body-1 text-grey-darken-1">
                Create your account to start your scholarship journey
              </p>
            </div>

            <!-- Sign Up Form -->
            <v-form
              ref="formRef"
              v-model="valid"
              @submit.prevent="handleSignUp"
            >
              <!-- Username -->
              <v-text-field
                v-model="form.username"
                label="Username"
                variant="outlined"
                :rules="usernameRules"
                prepend-inner-icon="mdi-account"
                class="mb-4"
                required
              />

              <!-- First Name and Last Name -->
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="form.first_name"
                    label="First Name (Optional)"
                    variant="outlined"
                    prepend-inner-icon="mdi-account"
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="form.last_name"
                    label="Last Name (Optional)"
                    variant="outlined"
                    prepend-inner-icon="mdi-account"
                  />
                </v-col>
              </v-row>

              <!-- City Field -->
              <v-text-field
                v-model="form.city"
                label="City (Optional)"
                variant="outlined"
                prepend-inner-icon="mdi-city"
                class="mb-4"
              />

              <!-- Email with verification -->
              <v-text-field
                v-model="form.email"
                label="Email Address"
                type="email"
                variant="outlined"
                :rules="emailRules"
                prepend-inner-icon="mdi-email"
                class="mb-2"
                required
              />

              <!-- Get Code Button -->
              <v-btn
                v-if="!emailCodeSent"
                @click="sendVerificationCode"
                :loading="sendingCode"
                :disabled="!form.email || !isValidEmail(form.email) || countdown > 0"
                color="primary"
                variant="outlined"
                size="small"
                class="mb-4"
              >
                {{ countdown > 0 ? `Get Code (${countdown}s)` : 'Get Code' }}
              </v-btn>

              <!-- Email Code Input -->
              <v-text-field
                v-if="emailCodeSent"
                v-model="form.email_code"
                label="Email Verification Code"
                variant="outlined"
                :rules="emailCodeRules"
                prepend-inner-icon="mdi-email-check"
                class="mb-2"
                maxlength="6"
                required
                :disabled="emailVerified"
              >
                <template v-slot:append>
                  <v-btn
                    v-if="!emailVerified"
                    @click="verifyEmailCode"
                    :loading="verifyingCode"
                    :disabled="!form.email_code || form.email_code.length !== 6"
                    color="success"
                    variant="text"
                    size="small"
                  >
                    Verify
                  </v-btn>
                  <v-btn
                    v-else
                    color="success"
                    variant="text"
                    size="small"
                    disabled
                  >
                    ✓ Verified
                  </v-btn>
                </template>
              </v-text-field>

              <!-- Resend Button -->
              <v-btn
                v-if="emailCodeSent && !emailVerified"
                @click="sendVerificationCode"
                :loading="sendingCode"
                :disabled="countdown > 0"
                color="primary"
                variant="outlined"
                size="small"
                class="mb-4"
              >
                {{ countdown > 0 ? `Resend Code (${countdown}s)` : 'Resend Code' }}
              </v-btn>

              <!-- Password -->
              <v-text-field
                v-model="form.password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                :rules="passwordRules"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                class="mb-2"
                required
              />
              
              <!-- Password Strength Indicator -->
              <div v-if="form.password" class="mb-4">
                <div class="text-caption text-grey-darken-1 mb-2">Password Requirements:</div>
                <div class="d-flex flex-column gap-1">
                  <div class="d-flex align-center">
                    <v-icon 
                      :color="form.password.length >= 8 ? 'success' : 'grey'" 
                      size="small"
                      class="mr-2"
                    >
                      {{ form.password.length >= 8 ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                    </v-icon>
                    <span :class="form.password.length >= 8 ? 'text-success' : 'text-grey'">
                      At least 8 characters
                    </span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon 
                      :color="/[a-z]/.test(form.password) ? 'success' : 'grey'" 
                      size="small"
                      class="mr-2"
                    >
                      {{ /[a-z]/.test(form.password) ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                    </v-icon>
                    <span :class="/[a-z]/.test(form.password) ? 'text-success' : 'text-grey'">
                      One lowercase letter
                    </span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon 
                      :color="/[A-Z]/.test(form.password) ? 'success' : 'grey'" 
                      size="small"
                      class="mr-2"
                    >
                      {{ /[A-Z]/.test(form.password) ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                    </v-icon>
                    <span :class="/[A-Z]/.test(form.password) ? 'text-success' : 'text-grey'">
                      One uppercase letter
                    </span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon 
                      :color="/\d/.test(form.password) ? 'success' : 'grey'" 
                      size="small"
                      class="mr-2"
                    >
                      {{ /\d/.test(form.password) ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                    </v-icon>
                    <span :class="/\d/.test(form.password) ? 'text-success' : 'text-grey'">
                      One number
                    </span>
                  </div>
                </div>
              </div>

              <!-- Confirm Password -->
              <v-text-field
                v-model="form.confirm_password"
                label="Confirm Password"
                :type="showConfirmPassword ? 'text' : 'password'"
                variant="outlined"
                :rules="confirmPasswordRules"
                prepend-inner-icon="mdi-lock-check"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                class="mb-4"
                required
              />

              <!-- Phone -->
              <v-text-field
                v-model="form.phone"
                label="Phone Number (Optional)"
                type="tel"
                variant="outlined"
                prepend-inner-icon="mdi-phone"
                class="mb-4"
              />

              <!-- Nationality Dropdown -->
              <v-autocomplete
                v-model="form.nationality"
                :items="countries"
                label="Select Your Nationality (Optional)"
                variant="outlined"
                prepend-inner-icon="mdi-flag"
                class="mb-4"
                clearable
              />

              <!-- Terms Agreement -->
              <v-checkbox
                v-model="form.agreeToTerms"
                color="primary"
                class="mb-4"
                required
              >
                <template v-slot:label>
                  <span class="text-body-2">
                    I agree to the
                    <router-link to="/terms" class="text-primary text-decoration-none">
                      Terms of Service
                    </router-link>
                    and
                    <router-link to="/privacy" class="text-primary text-decoration-none">
                      Privacy Policy
                    </router-link>
                  </span>
                </template>
              </v-checkbox>

              <!-- Submit Button -->
              <v-btn
                type="submit"
                color="primary"
                variant="elevated"
                size="large"
                block
                :loading="authStore.loading"
                :disabled="!emailVerified"
                class="mb-4"
              >
                Create Account
              </v-btn>
            </v-form>

            <!-- Sign In Link -->
            <div class="text-center">
              <span class="text-body-2 text-grey-darken-1">
                Already a Registered User?
              </span>
              <router-link
                to="/signin"
                class="text-decoration-none text-primary ml-1 font-weight-medium"
              >
                Log in
              </router-link>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import api from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const formRef = ref(null)
const valid = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const emailCodeSent = ref(false)
const emailVerified = ref(false)
const sendingCode = ref(false)
const verifyingCode = ref(false)
const countdown = ref(0)
let countdownTimer = null

const form = reactive({
  username: '',
  first_name: '',
  last_name: '',
  city: '',
  email: '',
  email_code: '',
  password: '',
  confirm_password: '',
  phone: '',
  nationality: '',
  agreeToTerms: false
})

const cities = ref([])
const countries = ref([
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia',
  'Austria', 'Azerbaijan', 'Bangladesh', 'Belarus', 'Belgium', 'Brazil',
  'Bulgaria', 'Cambodia', 'Canada', 'Chile', 'China', 'Colombia', 'Croatia',
  'Czech Republic', 'Denmark', 'Egypt', 'Estonia', 'Finland', 'France',
  'Georgia', 'Germany', 'Ghana', 'Greece', 'Hungary', 'Iceland', 'India',
  'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan',
  'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Lebanon', 'Lithuania',
  'Luxembourg', 'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand',
  'Nigeria', 'Norway', 'Pakistan', 'Philippines', 'Poland', 'Portugal',
  'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'Slovakia', 'Slovenia',
  'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland',
  'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Vietnam', 'Other'
])

const usernameRules = [
  v => !!v || 'Username is required',
  v => v.length >= 3 || 'Username must be at least 3 characters',
  v => v.length <= 30 || 'Username must be less than 30 characters',
  v => /^[a-zA-Z0-9_]+$/.test(v) || 'Username can only contain letters, numbers, and underscores'
]

const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const emailCodeRules = [
  v => !!v || 'Email verification code is required',
  v => v.length === 6 || 'Code must be 6 digits',
  v => /^\d{6}$/.test(v) || 'Code must contain only numbers'
]

const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 8 || 'Password must be at least 8 characters',
  v => /[a-z]/.test(v) || 'Password must contain at least one lowercase letter',
  v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
  v => /\d/.test(v) || 'Password must contain at least one number'
]

const confirmPasswordRules = [
  v => !!v || 'Please confirm your password',
  v => v === form.password || 'Passwords do not match'
]

const nationalityRules = [
  v => !!v || 'Nationality is required'
]

const cityRules = [
  v => !!v || 'City is required',
  v => v.length >= 2 || 'City must be at least 2 characters'
]

const nameRules = [
  v => !!v || 'Name is required',
  v => v.length >= 2 || 'Name must be at least 2 characters'
]

const isValidEmail = (email) => {
  return /.+@.+\..+/.test(email)
}

const startCountdown = (seconds) => {
  countdown.value = seconds
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

const clearCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  countdown.value = 0
}

const sendVerificationCode = async () => {
  if (!isValidEmail(form.email)) {
    toast.error('Please enter a valid email address')
    return
  }

  try {
    sendingCode.value = true
    const response = await api.post('/auth/send-verification-code', {
      email: form.email
    })
    
    emailCodeSent.value = true
    emailVerified.value = false // Reset verification status
    startCountdown(120) // Start 120 second countdown
    toast.success('Verification code sent to your email')
  } catch (error) {
    console.error('Error sending verification code:', error)
    toast.error(error.response?.data?.error || 'Failed to send verification code')
  } finally {
    sendingCode.value = false
  }
}

const verifyEmailCode = async () => {
  if (!form.email_code || form.email_code.length !== 6) {
    toast.error('Please enter a valid 6-digit verification code')
    return
  }

  try {
    verifyingCode.value = true
    const response = await api.post('/auth/verify-email-code', {
      email: form.email,
      code: form.email_code
    })
    
    emailVerified.value = true
    clearCountdown()
    toast.success('Email verified successfully!')
  } catch (error) {
    console.error('Error verifying email code:', error)
    toast.error(error.response?.data?.error || 'Invalid verification code')
  } finally {
    verifyingCode.value = false
  }
}

const handleSignUp = async () => {
  if (!valid.value) return

  if (!form.agreeToTerms) {
    toast.error('Please agree to the Terms of Service and Privacy Policy')
    return
  }

  if (!emailVerified.value) {
    toast.error('Please verify your email first')
    return
  }

  try {
    const { agreeToTerms, ...userData } = form
    console.log('Submitting user data:', userData)
    const result = await authStore.register(userData)
    
    if (result.success) {
      toast.success('Account created successfully!')
      
      // Redirect based on user role (though signup creates students by default)
      if (authStore.user?.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    }
  } catch (error) {
    console.error('Registration error:', error)
    console.error('Error response:', error.response?.data)
    toast.error(error.response?.data?.error || 'Registration failed')
  }
}

onMounted(() => {
  // No need to load cities anymore since it's a text field
})

onUnmounted(() => {
  clearCountdown()
})
</script>

<style scoped>
.signup-page {
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