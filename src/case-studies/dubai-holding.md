---
title: "Dubai Holding"
date: 2025-01-04
project-link: "https://www.dubaiholding.com/"
description: "A two-year enterprise engagement — building the shared component system that powered websites across Dubai Holding's portfolio of destination, retail, and hospitality brands."
logo: "/images/duba-holding-logo-2.svg"
logo-dark: "/images/dubai-holding-logo-inverted.avif"
customLogoClass: "w-20 h-20 dark:w-20 dark:h-20"
card-img: "/images/dh-card-cover.svg"
card-img-width: 1600
card-img-height: 1200
header-img: "/images/dubai-holding-hero-img.webp"
header-img-width: 1305
header-img-height: 2299
header_subtitle: "Enterprise Design System & Portfolio Migration"
header-overview: "A two-year engagement with Dubai Holding where I designed and built a shared component system that powered websites across multiple marketing teams, property brands, and business units."
header_meta:
  - label: "Client"
    value: "Dubai Holding"
  - label: "Industry"
    value: "Enterprise / Multi-Property Portfolio"
  - label: "Timeline"
    value: "2 years"
  - label: "Role"
    value: "Lead Designer & Developer"
order: 1
categories:
  - Design System
  - Web Design
---

## Overview

Dubai Holding is one of the Middle East's largest holding companies — managing destination, retail, hospitality, and residential brands across the UAE. In late 2023, they hired me directly as a contractor to lead a large-scale migration of their digital portfolio onto Webflow. The work expanded over two years into designing and building component libraries that are still powering their portfolio today.

---

## The Challenge

Dubai Holding has a large portfolio of enterprise websites, each with its own content model, stakeholders, and unique brand. Tens of websites had to be rebuilt — which required a more holistic, system-driven approach than treating each as a standalone project.

<div class="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">
  <div class="standard-card text-left">
    <p class="text-xl font-semibold text-normal dark:text-inverted mb-2">Multiple Teams, Different Brands</p>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">Each brand under Dubai Holding had its own brand expression, design assets, and marketing team. Designing one-off sites for each would be slow, inconsistent, and impossible to maintain.</p>
  </div>
  <div class="standard-card text-left">
    <p class="text-xl font-semibold text-normal dark:text-inverted mb-2">Years of SEO Equity at Risk</p>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">These sites weren't launches — they were migrations. Each property carried years of organic search rankings and domain authority that any missed redirect, broken canonical, or content drift could unwind.</p>
  </div>
  <div class="standard-card text-left">
    <p class="text-xl font-semibold text-normal dark:text-inverted mb-2">Bilingual and Accessibility Requirements</p>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">Properties needed full Arabic/English support with proper RTL layouts, and retail properties required WCAG AA compliance.</p>
  </div>
</div>

---

## The Core Insight

While each Dubai Holding brand had its own design language, the properties shared a lot of underlying structure — accessibility standards, RTL compatibility, content patterns marketing teams needed to control without developer involvement. Lowering development overhead was a major reason for the move off Sitefinity, so building all of this once and reusing it everywhere wasn't optional.

The most valuable thing I could build for Dubai Holding wasn't a website. It was the system that let them ship websites.

Treating each property as its own project compounds inefficiency: every new property restarts the design process, every team solves the same problems independently, and the portfolio drifts toward inconsistency as it grows. The real leverage was architectural — build a shared component library once, designed to flex across different brand expressions. Each property inherits the system's structural decisions while expressing its own identity through color, typography, logo, and content. One system, many surfaces.

---

## The Approach

Three decisions shaped the engagement:

**Build the system first, then the sites.** Invest upfront in a component library engineered for reuse. Every subsequent property migration becomes assembly rather than rebuild. Components stay synced with a single source of truth so updates roll out across many websites without manual rework.

**Encode the non-negotiables at the component level.** Accessibility, RTL support, and performance patterns should be impossible to break at the page level — they need to be baked into the components themselves. Brand-level styles and variables stay controlled at the site level.

**Enable the marketing teams to own their own properties.** Structure the CMS so each team can publish and iterate independently, without requiring developer support for routine updates.

---

## The Component Library: A Two-Level System

Each component had two levels of control. The first level was settings managed at the component library level, synced across every property using it. The second level was variables changed at the site level for full per-property customization.

This made every component flex without breaking. The same hero pattern that worked for Nad Al Sheba Mall could carry Circle Mall's brand with a swap of color, logo, and content. The same navigation could render LTR in English or RTL in Arabic. The same card grid could handle retail listings, tourism attractions, or hospitality properties depending on the CMS configuration behind it.

What the library encoded:

- **Accessibility from the ground up.** Every interactive component built to WCAG AA — proper heading hierarchy, ARIA labels, keyboard navigation, color contrast — so individual property pages couldn't accidentally regress.
- **Bilingual and RTL support.** Components handled Arabic and English layouts natively, with mirrored spacing, flipped iconography, and typographic adjustments for each script.
- **Performance patterns.** Image optimization, lazy-loading, and efficient code standardized at the component level.
- **Brand flex points.** Color tokens, logo slots, typography overrides, and imagery zones exposed for per-property customization — without letting teams break the structural logic underneath.
- **CMS-driven content.** Marketing teams could update content without touching design or development.

The library shipped with Nad Al Sheba Mall, was reused on Circle Mall, and scaled across additional retail and destination properties from there.

---

## In Practice: Visit Hatta

<a href="https://www.visithatta.com/" target="_blank" rel="noopener noreferrer">visithatta.com</a>

Visit Hatta is the official website for Dubai's largest nature reserve — a flagship tourism property welcoming over 350,000 visitors per season. It needed to serve both English and Arabic audiences with a bilingual experience that felt equally native to each, while preserving the organic traffic already flowing through it.

**What I delivered:**

- **Full Sitefinity-to-Webflow rebuild.** Rebuilt the entire site on Webflow while preserving content model, URL structure, and SEO equity.
- **Native bilingual implementation.** Full Arabic/English support using Webflow's localization features, with custom RTL styling applied across every component.
- **SEO coordination.** Worked with the in-house SEO team on metadata, sitemaps, schema markup, and redirect strategy — the site launched without losing search rankings.
- **Third-party integrations.** Custom integrations for booking systems and analytics, wired into the component architecture.

<section class="py-8">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
    <div class="w-full">
      <img src="/images/hatta-homepage-english.webp" alt="Visit Hatta homepage in English" class="w-full h-auto object-contain rounded-2xl" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">English homepage</p>
    </div>
    <div class="w-full">
      <img src="/images/hatta-homepage-arabic.webp" alt="Visit Hatta homepage in Arabic with RTL layout" class="w-full h-auto object-contain rounded-2xl" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Arabic homepage with RTL layout</p>
    </div>
    <div class="w-full">
      <img src="/images/hatta-inner-page.webp" alt="Visit Hatta activities page" class="w-full h-auto object-contain rounded-2xl" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Activities page</p>
    </div>
    <div class="w-full">
      <img src="/images/hatta-menu.webp" alt="Visit Hatta navigation menu" class="w-full h-auto object-contain rounded-2xl" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Navigation menu</p>
    </div>
  </div>
</section>

---

## In Practice: Nad Al Sheba Mall

<a href="https://www.nadalshebamall.ae/" target="_blank" rel="noopener noreferrer">nadalshebamall.ae</a>

Nad Al Sheba Mall was the first retail property to ship on the component library. Retail properties needed WCAG AA compliance, which meant accessibility couldn't be a page-level concern — it had to be built into every component. After Nad Al Sheba shipped, the same library powered <a href="https://www.circlemall.ae/" target="_blank" rel="noopener noreferrer">Circle Mall</a> with brand-level customization, no rework required. That was the proof the system worked.

<section class="py-8">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
    <div class="w-full">
      <img src="/images/nad-al-sheba-dubai-holding.webp" alt="Nad Al Sheba Mall website homepage" class="w-full h-auto object-contain rounded-2xl" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Nad Al Sheba Mall homepage</p>
    </div>
    <div class="w-full">
      <img src="/images/nad-al-sheba-wcag.webp" alt="WCAG accessibility audit showing AA conformance" class="w-full h-auto object-contain rounded-2xl" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">WCAG AA conformance verified</p>
    </div>
  </div>
</section>

---

## Across the Portfolio

Visit Hatta and Nad Al Sheba were two anchors in a broader engagement. Over two years, the component library and its supporting patterns powered additional properties across Dubai Holding's portfolio.

<section class="py-8">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
    <div class="w-full text-lg">
      <img src="/images/bay-avenue-final.webp" alt="Bay Avenue website" class="w-full h-auto object-contain rounded-2xl" />
      <p class="mt-2"><a href="https://www.bayavenue.ae/" class="font-semibold" target="_blank" rel="noopener noreferrer">Bay Avenue</a></p>
    </div>
    <div class="w-full text-lg">
      <img src="/images/souq-jumeirah-final.webp" alt="Souk Madinat Jumeirah website" class="w-full h-auto object-contain rounded-2xl" />
      <p class="mt-2"><a href="https://www.soukmadinatjumeirah.ae/en" class="font-semibold" target="_blank" rel="noopener noreferrer">Souk Madinat Jumeirah</a></p>
    </div>
  </div>
</section>

I also contributed to migrations for Dubai Holding's **Nakheel** brand properties — consolidating their digital presence on Webflow alongside the rest of the portfolio. Each new engagement moved faster than the last, because the system had already absorbed the structural problems the previous properties had encountered.

---

## Key Design Decisions

<div class="not-prose grid grid-cols-1 gap-6 my-10">
  <div class="standard-card">
    <h3 class="text-xl font-medium text-normal dark:text-inverted mb-3">Designing the System, Not the Sites</h3>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">The first major decision was refusing to treat Dubai Holding as a series of one-off website projects. Every hour spent on the component library upfront saved weeks on every subsequent property migration.</p>
  </div>
  <div class="standard-card">
    <h3 class="text-xl font-medium text-normal dark:text-inverted mb-3">Accessibility and Bilingual Support as System Foundations</h3>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">The non-negotiables — WCAG AA, RTL, performance — had to be solved at the component level, not the page level. Designing these into the library's foundations meant no individual property launch could regress on them, no matter who was operating the site afterward.</p>
  </div>
  <div class="standard-card">
    <h3 class="text-xl font-medium text-normal dark:text-inverted mb-3">SEO as a Design Consideration, Not a Post-Launch Task</h3>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">With years of search equity on the line, SEO wasn't something to check at the end. Content models, URL structures, schema markup, and redirect strategies were designed into each migration from the start — in close coordination with Dubai Holding's SEO team. Every migration launched without losing ground on search rankings.</p>
  </div>
  <div class="standard-card">
    <h3 class="text-xl font-medium text-normal dark:text-inverted mb-3">Building for Independence</h3>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">The goal wasn't to make Dubai Holding's marketing teams dependent on me — it was to give them infrastructure they could operate themselves. Every CMS was designed to put content control in the team's hands, with the design system enforcing consistency in the background. Today, the teams run their properties independently — the outcome I was designing toward from the start.</p>
  </div>
</div>

---

## Outcome

A two-year direct engagement supporting multiple marketing teams across destination, retail, and hospitality properties.

<div class="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">
  <div class="standard-card text-left py-8">
    <p class="text-xl sm:text-2xl font-semibold text-normal dark:text-inverted mb-2">Portfolio-Wide Component Library</p>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">Shared design system powering retail and destination properties, still in active use by Dubai Holding's teams today.</p>
  </div>
  <div class="standard-card text-left py-8">
    <p class="text-xl sm:text-2xl font-semibold text-normal dark:text-inverted mb-2">Zero SEO Regression</p>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">Every migration launched without losing organic search rankings — preserving years of accumulated domain authority.</p>
  </div>
  <div class="standard-card text-left py-8">
    <p class="text-xl sm:text-2xl font-semibold text-normal dark:text-inverted mb-2">Accessibility as Default</p>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">WCAG AA compliance achieved across retail properties, with accessibility encoded into the component library so future sites inherit it automatically.</p>
  </div>
</div>

---

## Reflection

The most impactful thing a designer can do for an enterprise client is to design the system that lets them ship great websites — for years — without you.

Dubai Holding taught me that at scale, the leverage isn't in any individual screen or page. It's in the decisions the system forces downstream. When those decisions are right, each new property gets easier. When they're wrong, the whole portfolio drifts.