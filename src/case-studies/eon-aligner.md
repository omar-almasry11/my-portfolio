---
title: "Eon Aligner"
date: 2025-01-01
project-link: "https://eon-aligner-doctor-finder.netlify.app/"
description: "A React doctor-locator app powered by Google Maps and an Airtable backend — giving the marketing team full control over clinic listings without a developer in the loop."
logo: "/images/eon-aligner-logo.svg"
logo-dark: "/images/eon-aligner-logo-dark.svg"
customLogoClass: "mb-8 dark:mb-8"
card-img: "/images/eon-aligner-cover.svg"
card-img-width: 1600
card-img-height: 1200
header-img: "/images/eon-aligner-1.webp"
header-img-width: 3024
header-img-height: 1654
header_subtitle: "Product Design & Development"
header-overview: "A map-first doctor locator built in React with a no-code Airtable backend — letting the marketing team manage certified providers across multiple countries without touching a line of code."
header_meta:
  - label: "Client"
    value: "Eon Aligner"
  - label: "Industry"
    value: "Dental / Healthcare"
  - label: "Timeline"
    value: "3 weeks"
  - label: "Role"
    value: "Designer & Engineer"
order: 6
categories:
  - Product Design
  - Web Development
---

## Overview

Eon Aligner is a clear-aligner brand with a growing network of certified providers across the Middle East. They needed two things at once: a polished, fast way for patients to find a clinic near them, and a way for the marketing team to manage that provider network themselves — across multiple countries, without filing developer tickets every time a clinic was added or moved.

I designed and built a single-page React application with an interactive Google Maps interface, backed by a headless Airtable CMS. The marketing team operates the entire provider network through a familiar spreadsheet — and the patient-facing map updates without a deployment.

---

## The Challenge

A doctor finder sounds simple until you account for who has to keep it accurate. Patients need a fast, intuitive map. The marketing team needs autonomy. The infrastructure needs to be lean enough to ship and maintain without a dedicated engineering team.

<div class="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">
  <div class="standard-card text-left">
    <p class="text-xl font-medium text-normal dark:text-inverted mb-2">Patient Experience Came First</p>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">Visitors needed to find a certified provider in seconds — with map context, location-based filtering, and clear next steps. The interface had to feel native to how people already use Google Maps.</p>
  </div>
  <div class="standard-card text-left">
    <p class="text-xl font-medium text-normal dark:text-inverted mb-2">Marketing Needed Full Autonomy</p>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">Adding a new clinic, updating a doctor's hours, or removing a provider couldn't require a developer. The team needed to manage the network end-to-end through tools they already used.</p>
  </div>
  <div class="standard-card text-left">
    <p class="text-xl font-medium text-normal dark:text-inverted mb-2">A Lean, Secure Stack</p>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">No backend team, no DevOps overhead — but no shortcuts on credentials either. API keys couldn't ship to the browser, and the architecture had to stay maintainable by whoever inherited it.</p>
  </div>
</div>

---

## The Core Insight

The most valuable thing I could build wasn't the map. It was a system the marketing team could operate themselves.

A doctor finder that requires a developer to update is a doctor finder that goes stale. The whole engagement pivots on a single decision: where the source of truth lives. Putting it in Airtable — a tool the marketing team already understood — meant the patient-facing map became a thin, fast view over data the team already owned. Every other architectural decision flowed downstream from that one.

<div class="not-prose cs-decision-callout my-10">
  <p class="text-base sm:text-lg text-normal dark:text-inverted mb-0">The win wasn't the React app. It was the absence of a developer in the loop every time a new clinic opened.</p>
</div>

---

## The Approach

Three decisions shaped the build:

**Airtable as the headless CMS.** The marketing team already worked in spreadsheets. Rather than build a custom admin panel they'd have to learn, I made Airtable the source of truth. New columns, new providers, new countries — all managed through an interface they were already fluent in.

**Serverless proxy for security.** The Airtable API key stays on the server. A Netlify Function sits between the React app and Airtable, handling authentication, pagination, and a 5-minute cache layer. Credentials never reach the browser.

**Responsive map behavior over feature count.** Instead of bolting on filters and toggles, I focused on making the map *feel right* — zoom levels that match what the user just selected, geocoding that loads only when needed, filter dropdowns that depend on each other so the user can't get lost.

---

## Technical Architecture

### Secure API Layer

Rather than expose the Airtable API key in client-side code, the architecture routes every request through a Netlify Function. The serverless layer handles authentication, follows Airtable's pagination tokens until the full dataset is retrieved, and returns sanitized data to the frontend with a 5-minute cache window. The browser never sees a credential.

### Context-Aware Map Camera

The map responds to what the user is doing through a priority-based zoom system:

- Selecting a doctor zooms to street level (15) and centers on their clinic
- Selecting a city zooms to neighborhood level (12), centered on the available providers in that city
- Selecting only a country calculates the geographic centroid by averaging all doctor coordinates in that country, then zooms to regional level (6)

The result: the user always sees relevant context, regardless of how they navigate.

### Hybrid Geocoding Cache

Converting lat/lng to a human-readable address is a paid Google API call. To minimize calls and keep responses instant, the app uses a two-tier cache: an in-memory `Map` for session-fast lookups, persisted to `localStorage` so addresses survive across visits. Geocoding is also lazy — it only runs when a user opens a doctor's info window.

### Cascading Filter Logic

Cities stay disabled until a country is chosen, then dynamically populate with only the cities that have providers in the selected country. All derived state — filtered doctors, available countries, available cities — is memoized to prevent recomputation on every re-render.

---

## Tech Stack

<div class="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-10">
  <div class="standard-card text-left">
    <p class="text-xs uppercase tracking-widest text-normalLight dark:text-invertedLight mb-2">Frontend</p>
    <p class="text-lg text-normal dark:text-inverted mb-0">React 19, Vite, Tailwind CSS</p>
  </div>
  <div class="standard-card text-left">
    <p class="text-xs uppercase tracking-widest text-normalLight dark:text-invertedLight mb-2">Maps</p>
    <p class="text-lg text-normal dark:text-inverted mb-0">@vis.gl/react-google-maps — Advanced Markers and Geocoding</p>
  </div>
  <div class="standard-card text-left">
    <p class="text-xs uppercase tracking-widest text-normalLight dark:text-invertedLight mb-2">Backend / CMS</p>
    <p class="text-lg text-normal dark:text-inverted mb-0">Airtable as a no-code database</p>
  </div>
  <div class="standard-card text-left">
    <p class="text-xs uppercase tracking-widest text-normalLight dark:text-invertedLight mb-2">Serverless & Hosting</p>
    <p class="text-lg text-normal dark:text-inverted mb-0">Netlify Functions and continuous deployment from Git</p>
  </div>
</div>

---

## Key Design Decisions

<div class="not-prose grid grid-cols-1 gap-6 my-10">
  <div class="standard-card">
    <h3 class="text-xl font-medium text-normal dark:text-inverted mb-3">Airtable Over a Custom Admin</h3>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">A bespoke CMS would have been a project of its own — and another tool for marketing to learn. Choosing Airtable meant the team's existing spreadsheet fluency became their CMS skill set on day one. Adding a clinic is the same as adding a row.</p>
  </div>
  <div class="standard-card">
    <h3 class="text-xl font-medium text-normal dark:text-inverted mb-3">A Serverless Function Instead of a Backend</h3>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">A Netlify Function gave us exactly the surface we needed — API proxying, pagination, caching — without standing up a server, a deployment pipeline, or anything else for the team to maintain. The whole backend is one file.</p>
  </div>
  <div class="standard-card">
    <h3 class="text-xl font-medium text-normal dark:text-inverted mb-3">Map Behavior Tuned to Intent</h3>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">A map that always zooms the same way fails its users. By tying zoom level to what the user just selected — a doctor, a city, or a country — the camera always lands on something useful. Small detail; large effect on how the app feels to use.</p>
  </div>
  <div class="standard-card">
    <h3 class="text-xl font-medium text-normal dark:text-inverted mb-3">Lazy Geocoding with a Two-Tier Cache</h3>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">Geocoding every clinic upfront would have been wasteful and slow. Fetching addresses only when a user opens an info window — and caching them in both memory and localStorage — keeps the app responsive while the API bill stays predictable.</p>
  </div>
</div>

---

## Outcome

A live, production tool the marketing team operates independently — and a patient-facing experience that feels native to how people already navigate the web.

<div class="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-10">
  <div class="standard-card text-left py-8">
    <p class="text-2xl font-medium text-normal dark:text-inverted mb-2">Zero Developer Bottleneck</p>
    <p class="text-normalLight dark:text-invertedLight mb-0">Marketing adds, edits, and removes providers in Airtable — changes show up live without a deployment, a ticket, or a developer.</p>
  </div>
  <div class="standard-card text-left py-8">
    <p class="text-2xl font-medium text-normal dark:text-inverted mb-2">Multi-Country Support</p>
    <p class="text-normalLight dark:text-invertedLight mb-0">Cascading country and city filters scale with the network — adding a new market means adding rows, not refactoring code.</p>
  </div>
</div>

---

## Project Images

<div class="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-12">
  <div class="space-y-4">
    <div class="bg-slate-50 dark:bg-white/5 px-2 py-1 md:px-4 md:py-2 rounded-2xl">
      <img src="/images/eon-aligner-1.webp" alt="Eon Aligner doctor finder showing the initial map view with clinic markers across multiple countries" class="w-full h-auto rounded-lg">
    </div>
    <p class="text-xs uppercase tracking-widest opacity-50 text-center">Initial Map View — Clinics Across the Network</p>
  </div>
  <div class="space-y-4">
    <div class="bg-slate-50 dark:bg-white/5 px-2 py-1 md:px-4 md:py-2 rounded-2xl">
      <img src="/images/eon-aligner-2.webp" alt="Eon Aligner doctor locator with country and city filter dropdowns above an interactive Google Map" class="w-full h-auto rounded-lg">
    </div>
    <p class="text-xs uppercase tracking-widest opacity-50 text-center">Cascading Country and City Filters</p>
  </div>
</div>

---

## Reflection

The strongest decision in this project wasn't a technical one — it was refusing to build a custom admin panel. The marketing team didn't need a new tool to learn; they needed their existing tool to be load-bearing. Once Airtable became the source of truth, every other choice — the serverless proxy, the caching layers, the lazy geocoding — was just supporting infrastructure for a workflow the team already had.

The patient-facing map gets the visible credit. The real win is the empty space where a developer used to sit between the marketing team and their own data.