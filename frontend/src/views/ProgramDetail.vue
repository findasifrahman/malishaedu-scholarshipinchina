<template>
  <div class="program-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <v-progress-circular
        color="primary"
        size="64"
        indeterminate
      />
      <p class="text-h6 mt-4">Loading program details...</p>
    </div>

    <!-- Program Content -->
    <div v-else-if="program && !isApplicationDeadlinePassed(program)">
      <!-- Hero Section -->
      <section class="hero-section">
        <v-container class="py-8">
          <v-row>
            <v-col cols="12" lg="8">
              <div class="d-flex align-center mb-4">
                <v-avatar size="60" class="mr-4">
                  <v-img
                    v-if="program.university_logo"
                    :src="program.university_logo"
                    :alt="program.university_name"
                  />
                  <v-icon v-else size="30" color="primary">mdi-school</v-icon>
                </v-avatar>
                <div>
                  <h1 class="text-h4 text-md-h3 font-weight-bold text-primary mb-2">
                    {{ program.name }}
                  </h1>
                  <p class="text-h6 text-grey-darken-1">
                    {{ program.university_name }} • {{ program.city_name }}
                  </p>
                </div>
              </div>
              
              <div class="d-flex flex-wrap gap-2 mb-6">
                <v-chip
                  :color="getScholarshipColor(program.scholarship_type)"
                  size="large"
                  variant="flat"
                >
                  {{ getScholarshipLabel(program.scholarship_type) }}
                </v-chip>
                <v-chip
                  :color="getDegreeColor(program.degree_level)"
                  size="large"
                  variant="outlined"
                >
                  {{ getDegreeLabel(program.degree_level) }}
                </v-chip>
                <v-chip
                  :color="getLanguageColor(program.language)"
                  size="large"
                  variant="outlined"
                >
                  {{ getLanguageLabel(program.language) }}
                </v-chip>
                <v-chip
                  v-if="program.program_id"
                  color="info"
                  size="large"
                  variant="outlined"
                >
                  ID: {{ program.program_id }}
                </v-chip>
                <v-chip
                  v-if="program.teaching_language"
                  :color="getTeachingLanguageColor(program.teaching_language)"
                  size="large"
                  variant="outlined"
                >
                  {{ getTeachingLanguageLabel(program.teaching_language) }}
                </v-chip>
              </div>

              <!-- Program Description in Hero -->
              <div v-if="program.description" class="hero-description mb-6">
                <h3 class="text-h6 font-weight-medium text-grey-darken-1 mb-3 d-flex align-center">
                  <v-icon class="mr-2" size="small" color="primary">mdi-text</v-icon>
                  About This Program
                </h3>
                <div class="hero-description-content">
                  <p class="text-body-2 text-grey-darken-2">
                    {{ program.description }}
                  </p>
                </div>
              </div>
            </v-col>
            
            <v-col cols="12" lg="4">
              <v-card class="pa-4" elevation="2">
                <h3 class="text-h6 font-weight-bold mb-4 d-flex align-center">
                  <v-icon class="mr-2" color="primary">mdi-information</v-icon>
                  Quick Info
                </h3>
                <div class="info-item">
                  <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                    <v-icon class="mr-1" size="small" color="info">mdi-clock</v-icon>
                    Duration
                  </span>
                  <span class="text-body-2 font-weight-medium">
                    {{ getDuration(program) }}
                  </span>
                </div>
                <div v-if="program.tuition_fee" class="info-item">
                  <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                    <v-icon class="mr-1" size="small" color="primary">mdi-school</v-icon>
                    Tuition Fee
                  </span>
                  <span class="text-body-2 font-weight-medium text-success">
                    ¥{{ formatNumber(program.tuition_fee) }}/{{ getTuitionUnitLabel(program.tuition_fee_unit) }}
                  </span>
                </div>
                <div v-if="program.application_fee" class="info-item">
                  <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                    <v-icon class="mr-1" size="small" color="warning">mdi-file-document-edit</v-icon>
                    Application Fee
                  </span>
                  <span class="text-body-2 font-weight-medium">
                    ¥{{ formatNumber(program.application_fee) }}
                  </span>
                </div>
                <div v-if="program.application_deadline" class="info-item">
                  <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                    <v-icon class="mr-1" size="small" color="error">mdi-calendar-alert</v-icon>
                    Application Deadline
                  </span>
                  <span class="text-body-2 font-weight-medium text-error">
                    {{ formatDate(program.application_deadline) }}
                  </span>
                </div>
                <div v-if="program.intake_date" class="info-item">
                  <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                    <v-icon class="mr-1" size="small" color="success">mdi-calendar</v-icon>
                    Intake Date
                  </span>
                  <span class="text-body-2 font-weight-medium text-success">
                    {{ formatDate(program.intake_date) }}
                  </span>
                </div>
                <div v-if="program.program_field" class="info-item">
                  <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                    <v-icon class="mr-1" size="small" color="secondary">mdi-book-open</v-icon>
                    Program Field
                  </span>
                  <span class="text-body-2 font-weight-medium">
                    {{ program.program_field }}
                  </span>
                </div>
                <div v-if="program.service_fee" class="info-item">
                  <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                    <v-icon class="mr-1" size="small" color="warning">mdi-cog</v-icon>
                    Service Fee
                  </span>
                  <span class="text-body-2 font-weight-medium">
                    ¥{{ formatNumber(program.service_fee) }}
                  </span>
                </div>
                <div v-if="program.no_of_semesters_per_year" class="info-item">
                  <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                    <v-icon class="mr-1" size="small" color="info">mdi-calendar-multiple</v-icon>
                    Semesters per Year
                  </span>
                  <span class="text-body-2 font-weight-medium">
                    {{ program.no_of_semesters_per_year }}
                  </span>
                </div>
                <div v-if="program.scholarship_type !== 'none'" class="info-item">
                  <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                    <v-icon class="mr-1" size="small" color="success">mdi-gift</v-icon>
                    Scholarship Available
                  </span>
                  <v-chip
                    :color="getScholarshipColor(program.scholarship_type)"
                    size="small"
                    variant="flat"
                  >
                    {{ getScholarshipLabel(program.scholarship_type) }}
                  </v-chip>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Program Details -->
      <section class="py-8">
        <v-container>
          <v-row>
            <!-- Main Content -->
            <v-col cols="12" lg="8">

              <!-- Scholarship Details -->
              <v-card v-if="program.scholarship_type !== 'none'" class="mb-6" elevation="2">
                <v-card-title class="text-h5 font-weight-bold">
                  Scholarship Information
                </v-card-title>
                <v-card-text>
                  <div class="scholarship-details">
                    <div class="d-flex justify-space-between align-center mb-3">
                      <span class="text-body-2 text-grey-darken-1">Scholarship Type</span>
                      <v-chip
                        :color="getScholarshipColor(program.scholarship_type)"
                        variant="flat"
                      >
                        {{ getScholarshipLabel(program.scholarship_type) }}
                      </v-chip>
                    </div>
                    <div v-if="program.scholarship_amount" class="d-flex justify-space-between align-center mb-3">
                      <span class="text-body-2 text-grey-darken-1">Scholarship Amount</span>
                      <span class="text-body-2 font-weight-medium">
                        ¥{{ formatNumber(program.scholarship_amount) }}/year
                      </span>
                    </div>
                    <div v-if="program.scholarship_description">
                      <p class="text-body-2">
                        {{ program.scholarship_description }}
                      </p>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Program Requirements -->
              <v-card v-if="program.requirements && program.requirements.length > 0" class="mb-6" elevation="2">
                <v-card-title class="text-h5 font-weight-bold">
                  Program Requirements
                </v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item
                      v-for="requirement in program.requirements"
                      :key="requirement.id"
                      class="px-0"
                    >
                      <template v-slot:prepend>
                        <v-icon
                          :color="requirement.is_required ? 'error' : 'grey'"
                          size="small"
                        >
                          {{ requirement.is_required ? 'mdi-check-circle' : 'mdi-information' }}
                        </v-icon>
                      </template>
                      <v-list-item-title class="text-body-2">
                        {{ requirement.title }}
                      </v-list-item-title>
                      <v-list-item-subtitle v-if="requirement.description" class="text-caption">
                        {{ requirement.description }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>


              <!-- Application Information with Tabs -->
              <v-card v-if="hasApplicationInfo(program)" class="mb-6" elevation="2">
                <v-card-title class="text-h5 font-weight-bold d-flex align-center">
                  <v-icon class="mr-2" color="warning">mdi-file-document-multiple</v-icon>
                  Application Information
                </v-card-title>
                
                <v-card-text class="pa-0">
                  <v-tabs
                    v-model="applicationTab"
                    color="primary"
                    align-tabs="start"
                    class="mb-4"
                  >
                    <v-tab value="eligibility">
                      <v-icon class="mr-2" size="small">mdi-account-check</v-icon>
                      Eligibility
                    </v-tab>
                    <v-tab value="documents">
                      <v-icon class="mr-2" size="small">mdi-file-document</v-icon>
                      Application Documents
                    </v-tab>
                    <v-tab value="scholarship">
                      <v-icon class="mr-2" size="small">mdi-gift-outline</v-icon>
                      Scholarship Policy
                    </v-tab>
                  </v-tabs>

                  <v-window v-model="applicationTab">
                    <!-- Eligibility Tab -->
                    <v-window-item value="eligibility">
                      <div class="pa-4">
                        <v-row>
                          <v-col cols="12" sm="6">
                            <div class="info-item">
                              <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                                <v-icon class="mr-1" size="small" color="primary">mdi-calendar-range</v-icon>
                                Age Range
                              </span>
                              <span class="text-body-2 font-weight-medium">
                                {{ getAgeRange(program) }}
                              </span>
                            </div>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <div class="info-item">
                              <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                                <v-icon class="mr-1" size="small" color="success">mdi-school</v-icon>
                                Minimum GPA
                              </span>
                              <span class="text-body-2 font-weight-medium">
                                {{ program.min_gpa || 'Not specified' }}
                              </span>
                            </div>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <div class="info-item">
                              <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                                <v-icon class="mr-1" size="small" color="secondary">mdi-translate</v-icon>
                                Language Requirements
                              </span>
                              <span class="text-body-2 font-weight-medium">
                                {{ getLanguageRequirements(program) }}
                              </span>
                            </div>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <div class="info-item">
                              <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                                <v-icon class="mr-1" size="small" color="warning">mdi-earth</v-icon>
                                Accepts Students Coming to China
                              </span>
                              <v-chip
                                :color="program.accept_students_who_come_to_china ? 'success' : 'error'"
                                size="small"
                                variant="flat"
                              >
                                {{ program.accept_students_who_come_to_china ? 'Yes' : 'No' }}
                              </v-chip>
                            </div>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <div class="info-item">
                              <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                                <v-icon class="mr-1" size="small" color="info">mdi-account-group</v-icon>
                                Accepts Minors
                              </span>
                              <v-chip
                                :color="program.accepts_minors ? 'success' : 'error'"
                                size="small"
                                variant="flat"
                              >
                                {{ program.accepts_minors ? 'Yes' : 'No' }}
                              </v-chip>
                            </div>
                          </v-col>
                          <v-col cols="12" sm="6" v-if="program.acceptable_student_location">
                            <div class="info-item">
                              <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                                <v-icon class="mr-1" size="small" color="info">mdi-map-marker</v-icon>
                                Acceptable Student Locations
                              </span>
                              <span class="text-body-2 font-weight-medium">
                                {{ program.acceptable_student_location }}
                              </span>
                            </div>
                          </v-col>
                        </v-row>
                        
                        <div v-if="program.additional_requirements" class="mt-4">
                          <h4 class="text-subtitle-1 font-weight-medium mb-2 d-flex align-center">
                            <v-icon class="mr-2" size="small" color="warning">mdi-information</v-icon>
                            Additional Requirements
                          </h4>
                          <p class="text-body-2">{{ program.additional_requirements }}</p>
                        </div>
                      </div>
                    </v-window-item>

                    <!-- Application Documents Tab -->
                    <v-window-item value="documents">
                      <div class="pa-4">
                        <div v-if="program.application_documents">
                          <h4 class="text-subtitle-1 font-weight-medium mb-3 d-flex align-center">
                            <v-icon class="mr-2" size="small" color="primary">mdi-file-document</v-icon>
                            Required Application Documents
                          </h4>
                          <v-list class="bg-grey-lighten-5 rounded">
                            <v-list-item
                              v-for="(document, index) in getDocumentList(program.application_documents)"
                              :key="index"
                              class="px-4"
                            >
                              <template v-slot:prepend>
                                <v-icon color="primary" size="small">mdi-file-document-outline</v-icon>
                              </template>
                              <v-list-item-title class="text-body-2">
                                {{ document }}
                              </v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </div>
                        <div v-else class="text-center py-8">
                          <v-icon size="48" color="grey">mdi-file-document-off</v-icon>
                          <p class="text-body-1 text-grey-darken-1 mt-2">No application documents specified</p>
                        </div>
                      </div>
                    </v-window-item>

                    <!-- Scholarship Policy Tab -->
                    <v-window-item value="scholarship">
                      <div class="pa-4">
                        <div v-if="program.scholarship_policy">
                          <h4 class="text-subtitle-1 font-weight-medium mb-3 d-flex align-center">
                            <v-icon class="mr-2" size="small" color="success">mdi-gift-outline</v-icon>
                            Scholarship Policy
                          </h4>
                          <div class="bg-grey-lighten-5 pa-4 rounded">
                            <p class="text-body-2">{{ program.scholarship_policy }}</p>
                          </div>
                        </div>
                        
                        <div v-if="program.scholarship_duration" class="mt-4">
                          <h4 class="text-subtitle-1 font-weight-medium mb-2 d-flex align-center">
                            <v-icon class="mr-2" size="small" color="success">mdi-clock-outline</v-icon>
                            Scholarship Duration
                          </h4>
                          <p class="text-body-2">{{ program.scholarship_duration }} years</p>
                        </div>
                        
                        <div v-if="program.special_notes" class="mt-4">
                          <h4 class="text-subtitle-1 font-weight-medium mb-2 d-flex align-center">
                            <v-icon class="mr-2" size="small" color="warning">mdi-information</v-icon>
                            Special Notes
                          </h4>
                          <div class="bg-warning-lighten-5 pa-4 rounded">
                            <p class="text-body-2">{{ program.special_notes }}</p>
                          </div>
                        </div>
                        
                        <div v-if="!program.scholarship_policy && !program.scholarship_duration && !program.special_notes" class="text-center py-8">
                          <v-icon size="48" color="grey">mdi-gift-off</v-icon>
                          <p class="text-body-1 text-grey-darken-1 mt-2">No scholarship information available</p>
                        </div>
                      </div>
                    </v-window-item>
                  </v-window>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Sidebar -->
            <v-col cols="12" lg="4">
              <!-- Application Actions -->
              <v-card class="mb-6" elevation="2">
                <v-card-title class="text-h6 font-weight-bold">
                  Apply Now
                </v-card-title>
                <v-card-text>
                  <v-btn
                    color="primary"
                    variant="elevated"
                    size="large"
                    block
                    class="mb-3"
                    @click="startApplication"
                  >
                    <v-icon class="mr-2">mdi-application</v-icon>
                    Start Application
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="outlined"
                    size="large"
                    block
                    class="mb-3"
                    @click="saveProgram"
                  >
                    <v-icon class="mr-2">mdi-bookmark</v-icon>
                    Save Program
                  </v-btn>
                  <v-btn
                    :to="`/university/${program.university_id}`"
                    color="secondary"
                    variant="outlined"
                    size="large"
                    block
                  >
                    <v-icon class="mr-2">mdi-school</v-icon>
                    View University
                  </v-btn>
                </v-card-text>
              </v-card>

              <!-- Cost Breakdown -->
              <v-card v-if="hasCostInfo(program)" class="mb-6" elevation="2">
                <v-card-title class="text-h6 font-weight-bold d-flex align-center">
                  <v-icon class="mr-2" color="primary">mdi-calculator</v-icon>
                  Cost Breakdown
                </v-card-title>
                <v-card-text>
                  <div v-if="program.application_fee" class="cost-item">
                    <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                      <v-icon class="mr-1" size="small" color="info">mdi-file-document-edit</v-icon>
                      Application Fee
                    </span>
                    <span class="text-body-2 font-weight-medium">
                      ¥{{ formatNumber(program.application_fee) }}
                    </span>
                  </div>
                  <div v-if="program.tuition_fee" class="cost-item">
                    <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                      <v-icon class="mr-1" size="small" color="primary">mdi-school</v-icon>
                      Tuition Fee
                    </span>
                    <span class="text-body-2 font-weight-medium text-success">
                      ¥{{ formatNumber(program.tuition_fee) }}/{{ getTuitionUnitLabel(program.tuition_fee_unit) }}
                    </span>
                  </div>
                  <div v-if="program.accommodation_fee" class="cost-item">
                    <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                      <v-icon class="mr-1" size="small" color="secondary">mdi-home</v-icon>
                      Accommodation Fee
                    </span>
                    <span class="text-body-2 font-weight-medium">
                      ¥{{ formatNumber(program.accommodation_fee) }}/{{ getAccommodationUnitLabel(program.accommodation_cost_unit) }}
                    </span>
                  </div>
                  <div v-if="program.service_fee" class="cost-item">
                    <span class="text-body-2 text-grey-darken-1 d-flex align-center">
                      <v-icon class="mr-1" size="small" color="warning">mdi-cog</v-icon>
                      Service Fee
                    </span>
                    <span class="text-body-2 font-weight-medium">
                      ¥{{ formatNumber(program.service_fee) }}
                    </span>
                  </div>
                  
                  <v-divider class="my-3" />
                  
                  <!-- Scholarship Information -->
                  <div v-if="program.scholarship_amount && program.scholarship_type !== 'none'" class="cost-item mb-2">
                    <span class="text-body-2 text-success d-flex align-center">
                      <v-icon class="mr-1" size="small" color="success">mdi-gift</v-icon>
                      Scholarship Amount
                    </span>
                    <span class="text-body-2 font-weight-medium text-success">
                      -¥{{ formatNumber(program.scholarship_amount) }}/year
                    </span>
                  </div>
                  
                  <v-divider class="my-3" />
                  
                  <div class="cost-item">
                    <span class="text-body-2 font-weight-bold text-primary">Total Program Cost</span>
                    <span class="text-body-2 font-weight-bold text-primary">
                      ¥{{ formatNumber(getTotalCost(program)) }}
                    </span>
                  </div>
                  
                  <div class="mt-3 pa-3 bg-grey-lighten-5 rounded">
                    <div class="text-caption text-grey-darken-1 mb-1">
                      <v-icon class="mr-1" size="small">mdi-information</v-icon>
                      Cost Breakdown Details:
                    </div>
                    <div v-if="program.tuition_fee" class="text-caption text-success">
                      • Tuition: ¥{{ formatNumber(program.tuition_fee) }}/{{ program.tuition_fee_unit === 'semester' ? 'semester' : 'year' }} × {{ program.no_of_semesters_per_year || 2 }} semesters/year × {{ getCostBreakdown(program).totalDurationYears }} years = ¥{{ formatNumber(program.tuition_fee * (program.tuition_fee_unit === 'semester' ? (program.no_of_semesters_per_year || 2) * parseFloat(getCostBreakdown(program).totalDurationYears) : parseFloat(getCostBreakdown(program).totalDurationYears))) }}
                    </div>
                    <div v-if="program.accommodation_fee" class="text-caption text-grey-darken-1">
                      • Accommodation: ¥{{ formatNumber(program.accommodation_fee) }}/{{ getAccommodationUnitLabel(program.accommodation_cost_unit) }} × {{ getCostBreakdown(program).totalDurationYears }} years = ¥{{ formatNumber(calculateAccommodationCost(program)) }}
                    </div>
                    <div v-if="program.service_fee" class="text-caption text-grey-darken-1">
                      • Service Fee: ¥{{ formatNumber(program.service_fee) }} (one-time)
                    </div>
                    <div v-if="program.application_fee" class="text-caption text-grey-darken-1">
                      • Application Fee: ¥{{ formatNumber(program.application_fee) }} (non-refundable, one-time)
                    </div>
                    <div v-if="program.scholarship_amount" class="text-caption text-success">
                      • Scholarship Deduction: -¥{{ formatNumber(program.scholarship_amount) }}
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Important Dates -->
              <v-card v-if="hasImportantDates(program)" elevation="2">
                <v-card-title class="text-h6 font-weight-bold">
                  Important Dates
                </v-card-title>
                <v-card-text>
                  <div v-if="program.application_deadline" class="date-item">
                    <v-icon class="mr-2" color="error">mdi-calendar-alert</v-icon>
                    <div>
                      <div class="text-body-2 font-weight-medium">Application Deadline</div>
                      <div class="text-caption text-error">
                        {{ formatDate(program.application_deadline) }}
                      </div>
                    </div>
                  </div>
                  <div v-if="program.intake_date" class="date-item">
                    <v-icon class="mr-2" color="success">mdi-calendar</v-icon>
                    <div>
                      <div class="text-body-2 font-weight-medium">Intake Date</div>
                      <div class="text-caption text-success">
                        {{ formatDate(program.intake_date) }}
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>
    </div>

    <!-- Application Deadline Passed -->
    <div v-else-if="program && isApplicationDeadlinePassed(program)" class="text-center py-12">
      <v-icon size="64" color="error">mdi-calendar-alert</v-icon>
      <h3 class="text-h5 mt-4 text-error">Application Deadline Passed</h3>
      <p class="text-body-1 text-grey-darken-1">
        The application deadline for this program has already passed.
      </p>
      <v-btn
        to="/programs"
        color="primary"
        variant="elevated"
        class="mt-4"
      >
        Browse Other Programs
      </v-btn>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-12">
      <v-icon size="64" color="grey">mdi-school</v-icon>
      <h3 class="text-h5 mt-4">Program not found</h3>
      <p class="text-body-1 text-grey-darken-1">
        The program you're looking for doesn't exist or has been removed.
      </p>
      <v-btn
        to="/programs"
        color="primary"
        variant="elevated"
        class="mt-4"
      >
        Browse Programs
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const program = ref(null)
const loading = ref(true)
const applicationTab = ref('eligibility')

const fetchProgram = async () => {
  try {
    const response = await api.get(`/programs/${route.params.id}`)
    program.value = response.data.program
  } catch (error) {
    console.error('Failed to fetch program:', error)
    program.value = null
  } finally {
    loading.value = false
  }
}

const isApplicationDeadlinePassed = (program) => {
  if (!program.application_deadline) return false
  const deadline = new Date(program.application_deadline)
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison
  return deadline < today
}

const getScholarshipColor = (type) => {
  switch (type) {
    case 'full': return 'success'
    case 'partial': return 'warning'
    default: return 'grey'
  }
}

const getScholarshipLabel = (type) => {
  switch (type) {
    case 'full': return 'Full Scholarship'
    case 'partial': return 'Partial Scholarship'
    default: return 'Self-Financed'
  }
}

const getDegreeColor = (level) => {
  switch (level) {
    case 'bachelor': return 'primary'
    case 'master': return 'secondary'
    case 'phd': return 'success'
    case 'language': return 'info'
    default: return 'grey'
  }
}

const getDegreeLabel = (level) => {
  switch (level) {
    case 'bachelor': return 'Bachelor'
    case 'master': return 'Master'
    case 'phd': return 'PhD'
    case 'language': return 'Language'
    case 'preparatory': return 'Preparatory'
    default: return level
  }
}

const getLanguageColor = (language) => {
  switch (language) {
    case 'chinese': return 'primary'
    case 'english': return 'secondary'
    case 'bilingual': return 'success'
    default: return 'grey'
  }
}

const getLanguageLabel = (language) => {
  switch (language) {
    case 'chinese': return 'Chinese'
    case 'english': return 'English'
    case 'bilingual': return 'Bilingual'
    default: return language
  }
}

const getTeachingLanguageColor = (language) => {
  switch (language) {
    case 'chinese': return 'primary'
    case 'english': return 'secondary'
    default: return 'grey'
  }
}

const getTeachingLanguageLabel = (language) => {
  switch (language) {
    case 'chinese': return 'Chinese Teaching'
    case 'english': return 'English Teaching'
    default: return language
  }
}

const getTuitionUnitLabel = (unit) => {
  switch (unit) {
    case 'semester': return 'semester'
    case 'year': return 'year'
    default: return 'year'
  }
}

const getAccommodationUnitLabel = (unit) => {
  switch (unit) {
    case 'day': return 'day'
    case 'month': return 'month'
    case 'semester': return 'semester'
    case 'year': return 'year'
    default: return 'year'
  }
}

const getDuration = (program) => {
  if (program.duration_years) {
    return `${program.duration_years} year${program.duration_years > 1 ? 's' : ''}`
  } else if (program.duration_months) {
    return `${program.duration_months} month${program.duration_months > 1 ? 's' : ''}`
  }
  return 'Not specified'
}

const getAgeRange = (program) => {
  if (program.min_age && program.max_age) {
    return `${program.min_age} - ${program.max_age} years`
  } else if (program.min_age) {
    return `${program.min_age}+ years`
  } else if (program.max_age) {
    return `Up to ${program.max_age} years`
  }
  return 'Not specified'
}

const getLanguageRequirements = (program) => {
  const requirements = []
  if (program.min_ielts_score) {
    requirements.push(`IELTS ${program.min_ielts_score}+`)
  }
  if (program.min_toefl_score) {
    requirements.push(`TOEFL ${program.min_toefl_score}+`)
  }
  if (program.min_hsk_level) {
    requirements.push(`HSK Level ${program.min_hsk_level}+`)
  }
  return requirements.length > 0 ? requirements.join(', ') : 'Not specified'
}

const hasCostInfo = (program) => {
  return program.tuition_fee || program.accommodation_fee || program.service_fee || program.application_fee
}

const getTotalCost = (program) => {
  try {
    // Calculate total duration in years (including months)
    const durationYears = parseFloat(program.duration_years) || 0
    const durationMonths = parseFloat(program.duration_months) || 0
    const totalDurationYears = durationYears + (durationMonths / 12)
    
    // Calculate tuition cost
    let tuitionCost = 0
    const tuitionFee = parseFloat(program.tuition_fee) || 0
    if (tuitionFee > 0) {
      const tuitionFeeUnit = program.tuition_fee_unit || 'year'
      const semestersPerYear = parseInt(program.no_of_semesters_per_year) || 2
      
      if (tuitionFeeUnit === 'semester') {
        // Tuition per semester * semesters per year * total duration
        tuitionCost = tuitionFee * semestersPerYear * totalDurationYears
      } else {
        // Tuition per year * total duration
        tuitionCost = tuitionFee * totalDurationYears
      }
    }
    
    // Calculate accommodation cost
    let accommodationCost = 0
    const accommodationFee = parseFloat(program.accommodation_fee) || 0
    if (accommodationFee > 0) {
      const accommodationUnit = program.accommodation_cost_unit || 'year'
      const semestersPerYear = parseInt(program.no_of_semesters_per_year) || 2
      
      switch (accommodationUnit) {
        case 'day':
          const totalDurationDays = totalDurationYears * 365
          accommodationCost = accommodationFee * totalDurationDays
          break
        case 'month':
          const totalDurationMonths = totalDurationYears * 12
          accommodationCost = accommodationFee * totalDurationMonths
          break
        case 'semester':
          const totalSemesters = semestersPerYear * totalDurationYears
          accommodationCost = accommodationFee * totalSemesters
          break
        case 'year':
        default:
          accommodationCost = accommodationFee * totalDurationYears
          break
      }
    }
    
    // Service fee (one-time)
    const serviceFee = parseFloat(program.service_fee) || 0
    
    // Application fee (non-refundable, one-time)
    const applicationFee = parseFloat(program.application_fee) || 0
    
    // Scholarship amount (deduction)
    const scholarshipAmount = parseFloat(program.scholarship_amount) || 0
    
    // Total cost calculation
    const totalCost = tuitionCost + accommodationCost + serviceFee + applicationFee - scholarshipAmount
    
    // Debug logging
    console.log('Cost Calculation Debug:', {
      durationYears,
      durationMonths,
      totalDurationYears,
      tuitionFee,
      tuitionCost,
      accommodationFee,
      accommodationCost,
      serviceFee,
      applicationFee,
      scholarshipAmount,
      totalCost
    })
    
    // Ensure we return a valid number
    return isNaN(totalCost) ? 0 : Math.max(0, totalCost)
  } catch (error) {
    console.error('Error calculating total cost:', error)
    return 0
  }
}

const getCostBreakdown = (program) => {
  try {
    const durationYears = parseFloat(program.duration_years) || 0
    const durationMonths = parseFloat(program.duration_months) || 0
    const totalDurationYears = durationYears + (durationMonths / 12)
    
    const tuitionFee = parseFloat(program.tuition_fee) || 0
    const accommodationFee = parseFloat(program.accommodation_fee) || 0
    const serviceFee = parseFloat(program.service_fee) || 0
    const applicationFee = parseFloat(program.application_fee) || 0
    const scholarshipAmount = parseFloat(program.scholarship_amount) || 0
    
    return {
      totalDurationYears: totalDurationYears.toFixed(1),
      tuitionFee,
      accommodationFee,
      serviceFee,
      applicationFee,
      scholarshipAmount,
      accommodationUnit: program.accommodation_cost_unit || 'year',
      tuitionFeeUnit: program.tuition_fee_unit || 'year'
    }
  } catch (error) {
    console.error('Error getting cost breakdown:', error)
    return {}
  }
}

const calculateAccommodationCost = (program) => {
  try {
    const accommodationFee = parseFloat(program.accommodation_fee) || 0
    if (accommodationFee === 0) return 0
    
    const durationYears = parseFloat(program.duration_years) || 0
    const durationMonths = parseFloat(program.duration_months) || 0
    const totalDurationYears = durationYears + (durationMonths / 12)
    const accommodationUnit = program.accommodation_cost_unit || 'year'
    const semestersPerYear = parseInt(program.no_of_semesters_per_year) || 2
    
    switch (accommodationUnit) {
      case 'day':
        return accommodationFee * (totalDurationYears * 365)
      case 'month':
        return accommodationFee * (totalDurationYears * 12)
      case 'semester':
        return accommodationFee * (semestersPerYear * totalDurationYears)
      case 'year':
      default:
        return accommodationFee * totalDurationYears
    }
  } catch (error) {
    console.error('Error calculating accommodation cost:', error)
    return 0
  }
}

const hasImportantDates = (program) => {
  return program.application_deadline || program.intake_date
}

const hasApplicationInfo = (program) => {
  return program.application_documents || 
         program.acceptable_student_location || 
         program.scholarship_policy || 
         program.special_notes ||
         program.additional_requirements ||
         program.min_gpa ||
         program.min_age ||
         program.max_age ||
         program.min_ielts_score ||
         program.min_toefl_score ||
         program.min_hsk_level ||
         program.accept_students_who_come_to_china !== undefined ||
         program.accepts_minors !== undefined ||
         program.scholarship_duration
}

const getDocumentList = (documents) => {
  if (!documents) return []
  
  // Split by newlines and filter out empty lines
  return documents.split('\n')
    .map(doc => doc.trim())
    .filter(doc => doc.length > 0)
}

const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const startApplication = () => {
  if (!authStore.isAuthenticated) {
    // Store the program ID in localStorage for redirect after login
    localStorage.setItem('redirectAfterLogin', JSON.stringify({
      route: '/profile',
      tab: 'programs',
      programId: program.value.id,
      programData: {
        program_id: program.value.program_id,
        program_name: program.value.name,
        university_name: program.value.university_name,
        city_name: program.value.city_name,
        degree_level: program.value.degree_level,
        language: program.value.language,
        scholarship_type: program.value.scholarship_type
      }
    }))
    
    // Redirect to sign-in page
    window.location.href = '/signin'
    return
  }
  
  // User is logged in, redirect to profile page with program tab
  router.push({
    path: '/profile',
    query: {
      tab: 'programs',
      programId: program.value.id,
      programData: JSON.stringify({
        program_id: program.value.program_id,
        program_name: program.value.name,
        university_name: program.value.university_name,
        city_name: program.value.city_name,
        degree_level: program.value.degree_level,
        language: program.value.language,
        scholarship_type: program.value.scholarship_type
      })
    }
  })
}

const saveProgram = () => {
  if (!authStore.isAuthenticated) {
    toast.warning('Please sign in to save programs')
    return
  }
  toast.success('Program saved to your favorites!')
}

onMounted(() => {
  fetchProgram()
})
</script>

<style scoped>
.program-detail-page {
  min-height: 100vh;
  background-color: #fafafa;
}

.hero-section {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8f5e8 100%);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.date-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.scholarship-details {
  padding: 16px 0;
}

.v-card {
  border-radius: 12px;
}


.hero-description {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-description-content {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.hero-description-content::-webkit-scrollbar {
  width: 4px;
}

.hero-description-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.hero-description-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
}

.hero-description-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}
</style>
