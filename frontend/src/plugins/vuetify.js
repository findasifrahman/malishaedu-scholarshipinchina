import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

const malishaTheme = {
  dark: false,
  colors: {
    primary: '#068b76',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    background: '#FAFAFA',
    surface: '#FFFFFF',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-surface': '#000000',
    'on-background': '#000000'
  }
}

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: 'malishaTheme',
    themes: {
      malishaTheme
    }
  },
  defaults: {
    VBtn: {
      style: 'text-transform: none; font-weight: 500;',
      rounded: 'lg'
    },
    VCard: {
      rounded: 'lg'
    },
    VTextField: {
      rounded: 'lg',
      variant: 'outlined'
    },
    VSelect: {
      rounded: 'lg',
      variant: 'outlined'
    }
  }
})
