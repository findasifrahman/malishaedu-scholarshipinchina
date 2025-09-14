<template>
  <section class="py-16 bg-grey-lighten-5">
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8" class="text-center">
          <v-card
            color="primary"
            variant="elevated"
            class="pa-8"
            rounded="xl"
          >
            <h2 class="text-h3 text-md-h2 font-weight-bold text-white mb-4 text-uppercase">
              Ready to Start Your Journey?
            </h2>
            <p class="text-h6 text-white opacity-90 mb-6">
              Join thousands of international students who have found their dream education in China through MalishaEdu.
            </p>
            <div class="d-flex flex-column flex-md-row justify-center gap-4">
              <v-btn
                to="/signup"
                color="white"
                variant="elevated"
                size="x-large"
                class="text-h6 px-8"
              >
                Get Started Today
              </v-btn>
              <v-btn
                to="/scholarship"
                color="white"
                variant="outlined"
                size="x-large"
                class="text-h6 px-8"
              >
                Browse Scholarships
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped>
.opacity-90 {
  opacity: 0.9;
}

.v-card {
  box-shadow: 0 8px 32px rgba(6, 139, 118, 0.3);
}

.v-btn--variant-elevated {
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

.v-btn--variant-elevated:hover {
  box-shadow: 0 6px 16px rgba(255, 255, 255, 0.4);
}
</style>
