---
title: "Eon Aligner"
date: 2025-01-01
project-link: "https://eon-aligner-doctor-finder.netlify.app/"
description: "Eon Aligner is a dental brand specializing in clear-aligner treatment. I built a React-based doctor locator with interactive Google Maps integration, country/city filtering, and an Airtable backend that lets the marketing team manage clinic listings without developer involvement."
logo: "/images/eon-aligner-logo.svg"
logo-dark: "/images/eon-aligner-logo-dark.svg"
customLogoClass: "mb-8 dark:mb-8"
header-img: "/images/eon-aligner-1.webp"
header-overview: "Patients needed a fast, intuitive way to find certified providers in their area. I architected and built a map-first locator using React and Google Maps API, with dynamic country/city filtering and real-time data from Airtable. The solution empowers the marketing team to add, edit, and remove clinic listings through a simple spreadsheet-like interface—no code changes, no deployments, no developer bottlenecks."
order: 1
---

## Overview

I designed and built a production-ready doctor locator application for Eon Aligner, enabling potential patients to discover certified providers in their area through an interactive map interface. The solution empowers the marketing team to manage doctor listings independently through a no-code CMS, eliminating ongoing developer dependency for routine updates.

## The Challenge

Eon Aligner faced a dual problem: patients needed an intuitive way to find nearby certified providers, while the marketing team required autonomy to manage listings across multiple countries without technical assistance. The solution needed to be maintainable, performant, and secure—while keeping the tech stack lean enough for rapid iteration.

Key requirements:

- Interactive map with location-based filtering
- Marketing team self-service for adding/editing doctors
- Multi-region support with country and city filtering
- Zero ongoing developer involvement for content updates

## Solution

I architected a React single-page application that connects a headless CMS (Airtable) to an interactive Google Maps interface. The marketing team manages all doctor data through Airtable's familiar spreadsheet-like interface, while patients experience a polished, responsive map application.

The application features cascading country/city filters, clickable map markers with doctor details, and automatic address resolution from coordinates—all optimized for performance across regions with varying doctor densities.

## Technical Approach

**Secure API Architecture**

Rather than exposing the Airtable API key in client-side code, I implemented a server-side proxy using Netlify Functions. The serverless function handles authentication, pagination, and caching—returning sanitized data to the frontend. This pattern keeps credentials secure while enabling a 5-minute cache layer to reduce API calls.

**Intelligent Map Behavior**

The map camera responds contextually to user actions through a priority-based system:

- Selecting a doctor zooms to street level (15) and centers on their location
- Selecting a city zooms to neighborhood level (12) with the camera centered on available providers
- Selecting only a country calculates the geographic center by averaging all doctor coordinates, then zooms to regional level (6)

This adaptive behavior ensures users always see relevant context regardless of how they navigate.

**Geocoding with Hybrid Caching**

Converting latitude/longitude to human-readable addresses requires Google's Geocoding API. To minimize API calls and improve responsiveness, I implemented a two-tier caching strategy: an in-memory Map for instant access during the session, backed by localStorage for persistence across visits. Addresses are fetched lazily—only when a user opens a doctor's info window.

**Cascading Filter Logic**

The filtering system uses dependent state: cities remain disabled until a country is selected, then dynamically populate with only relevant options. All derived data (filtered doctors, available countries, available cities) is memoized to prevent unnecessary recalculations during re-renders.

**Airtable Pagination Handling**

Airtable returns paginated results for large datasets. The serverless function implements a loop that follows pagination tokens until all records are retrieved, ensuring the application displays complete data regardless of how the doctor list grows.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS
- **Maps:** @vis.gl/react-google-maps (Advanced Markers, Geocoding)
- **Backend/CMS:** Airtable (no-code database)
- **Serverless:** Netlify Functions (API proxy)
- **Deployment:** Netlify (continuous deployment from Git)

## Results

The solution delivered exactly what the business needed: a polished patient-facing tool paired with marketing team autonomy. The architecture decisions—server-side API proxying, intelligent caching, and memoized state—ensure the application remains performant and secure as the doctor network scales.

The marketing team now adds new providers in minutes through Airtable, with changes reflected immediately on the live site. No developer tickets, no deployment cycles, no bottlenecks.

---

## Project Images

<section>
  <div class="mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
      <!-- Image 1 -->
      <div class="w-full">
        <img
          src="/images/eon-aligner-1.webp"
          alt="EON Aligner doctor finder interface showing the initial map view with location markers for dental clinics across different countries"
          class="w-full h-auto object-contain shadow-low dark:shadow-lowInverted"
        />
      </div>
      <!-- Image 2 -->
      <div class="w-full">
        <img
          src="/images/eon-aligner-2.webp"
          alt="EON Aligner doctor locator displaying country and city filter dropdowns with an interactive map showing clinic locations"
          class="w-full h-auto object-contain shadow-low dark:shadow-lowInverted"
        />
      </div>
  </div>
</section>
