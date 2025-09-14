<template>
  <div class="not-found-page">
    <v-container class="fill-height d-flex align-center justify-center">
      <div class="text-center">
        <v-icon size="120" color="primary" class="mb-6">mdi-school</v-icon>
        <h1 class="text-h2 text-md-h1 font-weight-bold text-primary mb-4">
          404
        </h1>
        <h2 class="text-h4 text-md-h3 font-weight-medium mb-4">
          Page Not Found
        </h2>
        <p class="text-h6 text-grey-darken-1 mb-8 max-width-500 mx-auto">
          The page you're looking for doesn't exist or has been moved to a different location.
        </p>
        <div class="d-flex flex-column flex-md-row justify-center gap-4">
          <v-btn
            to="/"
            color="primary"
            variant="elevated"
            size="large"
            class="px-8"
          >
            <v-icon class="mr-2">mdi-home</v-icon>
            Go Home
          </v-btn>
          <v-btn
            to="/scholarship"
            color="primary"
            variant="outlined"
            size="large"
            class="px-8"
          >
            <v-icon class="mr-2">mdi-school</v-icon>
            Browse Scholarships
          </v-btn>
        </div>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8f5e8 100%);
}

.max-width-500 {
  max-width: 500px;
}
</style>
