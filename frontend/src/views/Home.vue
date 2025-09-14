<template>
  <div>
    <!-- Hero Section -->
    <HeroSection />
    
    <!-- Partner Universities -->
    <PartnerUniversities />
    
    <!-- Hot Programs -->
    <HotPrograms />
    
    <!-- Statistics -->
    <StatisticsSection />
    
    <!-- Call to Action -->
    <CallToAction />
  </div>
</template>

<script setup>
import HeroSection from '@/components/home/HeroSection.vue'
import PartnerUniversities from '@/components/home/PartnerUniversities.vue'
import HotPrograms from '@/components/home/HotPrograms.vue'
import StatisticsSection from '@/components/home/StatisticsSection.vue'
import CallToAction from '@/components/home/CallToAction.vue'
</script>
