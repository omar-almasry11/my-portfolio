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
header-overview: "A two-year direct engagement as Dubai Holding's Webflow design and development partner — building the shared component system that powered websites across multiple marketing teams, property brands, and business units."
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

Dubai Holding is one of the Middle East's largest diversified holding companies — managing destination, retail, hospitality, and residential brands across the emirate. In late 2023, they hired me directly as a contractor to lead a large-scale migration of their digital portfolio onto Webflow.

What started as a scoped migration engagement became a two-year partnership spanning multiple marketing teams, property brands, and business units, and the design and build of a component system that's still powering their portfolio today.

---

## The Challenge

Migrating a single enterprise website is a challenge. But migrating a portfolio of enterprise websites — each with its own marketing team, its own content model, its own stakeholders, and its own brand expression? That's a much bigger challenge that requires a more holistic approach.

<div class="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">
  <div class="standard-card text-left">
    <p class="text-3xl font-extrabold text-normal dark:text-inverted mb-2">01</p>
    <p class="font-semibold text-normal dark:text-inverted mb-2">Multiple Teams, One Standard</p>
    <p class="text-sm text-normalLight dark:text-invertedLight mb-0">Each property had its own marketing team with its own priorities, timelines, and brand expressions. Designing one-off sites for each would be slow, inconsistent, and impossible to maintain. But over-centralizing would stifle the distinctiveness each property needed.</p>
  </div>
  <div class="standard-card text-left">
    <p class="text-3xl font-extrabold text-normal dark:text-inverted mb-2">02</p>
    <p class="font-semibold text-normal dark:text-inverted mb-2">Years of SEO Equity at Risk</p>
    <p class="text-sm text-normalLight dark:text-invertedLight mb-0">These sites weren't launches — they were migrations. Each property carried years of organic search rankings and domain authority that any missed redirect, broken canonical, or content drift could unwind.</p>
  </div>
  <div class="standard-card text-left">
    <p class="text-3xl font-extrabold text-normal dark:text-inverted mb-2">03</p>
    <p class="font-semibold text-normal dark:text-inverted mb-2">Bilingual and Accessible by Default</p>
    <p class="text-sm text-normalLight dark:text-invertedLight mb-0">Properties needed full Arabic/English support with proper RTL layouts, and retail properties required WCAG AA compliance. These weren't add-ons — they were foundational requirements that every component had to handle from day one.</p>
  </div>
</div>

---

## The Core Insight

The most valuable thing I could build for Dubai Holding wasn't a website. It was the system that let them ship websites.

The temptation with enterprise migration work is to treat each property as its own project — audit the existing site, design a replacement, build it, ship it, move on. But when you're working across a portfolio, that approach compounds inefficiency: every new property restarts the design process, every team solves the same problems independently, and the portfolio drifts toward inconsistency as it grows.

The real leverage was architectural. Build a shared component library once, designed to flex across different brand expressions. Let each property inherit the system's structural decisions — accessibility, RTL support, performance, SEO patterns — while expressing its own identity through color, typography, logo, and content. One system, many surfaces.

---

## The Approach

Dubai Holding was effectively a portfolio design problem, not a website design problem. Three decisions shaped the engagement:

**Build the system first, then the sites.** Invest upfront in a component library engineered for reuse. Every subsequent property migration becomes assembly rather than rebuild.

**Encode the non-negotiables at the component level.** Accessibility, RTL support, and performance patterns should be impossible to break at the page level — they need to be baked into the components themselves.

**Enable the marketing teams to own their own properties.** Structure the CMS so each team can publish and iterate independently, without coming back to me for routine updates.

---

## The Component Library

The component library became the organizing unit of the entire engagement — the artifact that made every subsequent property migration faster, more consistent, and more resilient than the last.

Each component was engineered to flex: the same hero pattern that worked for Nad Al Sheba Mall could carry Circle Mall's brand with a swap of color, logo, and content. The same navigation pattern could render left-to-right in English or right-to-left in Arabic. The same card grid could handle retail listings, tourism attractions, or hospitality properties depending on the CMS configuration behind it.

What the library encoded:

- **Accessibility from the ground up.** Every interactive component was built to WCAG AA standards — proper heading hierarchy, ARIA labels, keyboard navigation, and color contrast — so individual property pages couldn't accidentally regress.
- **Bilingual and RTL support.** Components handled Arabic and English layouts natively, with mirrored spacing, flipped iconography, and typographic adjustments for each script.
- **Performance patterns.** Image optimization, lazy-loading, and efficient code were standardized at the component level, not left as per-property concerns.
- **Brand flex points.** Every component exposed the right surfaces for per-property customization — color tokens, logo slots, typography overrides, imagery zones — without letting teams break the structural logic underneath.
- **CMS-driven content.** Each component was wired into the CMS so marketing teams could update content without touching design or development.

The library shipped with Nad Al Sheba Mall, was reused on Circle Mall, and scaled across additional retail and destination properties from there.

---

## In Practice: Visit Hatta

<a href="https://www.visithatta.com/" target="_blank" rel="noopener noreferrer">visithatta.com</a>

Visit Hatta is the official website for Dubai's largest nature reserve — a flagship tourism property that welcomes over 350,000 visitors per season. The site needed to serve both English and Arabic audiences with a bilingual experience that felt equally native to each.

This was one of the higher-sensitivity properties in the portfolio — both because of its visibility and because of the volume of organic traffic already flowing through it.

**What I delivered:**

- **Full WordPress-to-Webflow rebuild.** Rebuilt the entire site on Webflow while preserving its content model, URL structure, and SEO equity.
- **Native bilingual implementation.** Full Arabic/English support using Webflow's native localization features, with custom RTL styling applied consistently across every component.
- **SEO coordination.** Worked closely with the in-house SEO team on metadata, sitemaps, schema markup, and redirect strategy — ensuring the site launched without losing its search rankings.
- **Third-party integrations.** Implemented custom integrations for booking systems and analytics, wired into the component architecture.

<section class="py-8">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
    <div class="w-full">
      <img src="/images/hatta-homepage-english.webp" alt="Visit Hatta homepage in English" class="w-full h-auto object-contain shadow-low dark:shadow-lowInverted rounded-2xl" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">English homepage</p>
    </div>
    <div class="w-full">
      <img src="/images/hatta-homepage-arabic.webp" alt="Visit Hatta homepage in Arabic with RTL layout" class="w-full h-auto object-contain shadow-low dark:shadow-lowInverted rounded-2xl" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Arabic homepage with RTL layout</p>
    </div>
    <div class="w-full">
      <img src="/images/hatta-inner-page.webp" alt="Visit Hatta activities page" class="w-full h-auto object-contain shadow-low dark:shadow-lowInverted rounded-2xl" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Activities page</p>
    </div>
    <div class="w-full">
      <img src="/images/hatta-menu.webp" alt="Visit Hatta navigation menu" class="w-full h-auto object-contain shadow-low dark:shadow-lowInverted rounded-2xl" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Navigation menu</p>
    </div>
  </div>
</section>

---

## In Practice: Nad Al Sheba Mall

<a href="https://www.nadalshebamall.ae/" target="_blank" rel="noopener noreferrer">nadalshebamall.ae</a>

Nad Al Sheba Mall was the first retail property to ship on the component library — and its requirements shaped how the library handled accessibility going forward. Retail properties in the portfolio needed to meet WCAG AA compliance, which meant accessibility couldn't be an afterthought at the page level; it had to be encoded into every component.

After shipping Nad Al Sheba, the same component library was reused for <a href="https://www.circlemall.ae/" target="_blank" rel="noopener noreferrer">Circle Mall</a> — validating the premise that a well-designed system could absorb a new property with brand-level customization rather than component-level rework.

**What I delivered:**

- **WCAG AA conformance.** Audited and achieved accessibility compliance across the full site — verified through structured testing.
- **Reusable component architecture.** Built the retail property template that later powered Circle Mall and additional retail launches.
- **Consistent brand flex.** Retained each property's distinct identity while maintaining the shared structural and accessibility decisions underneath.

<section class="py-8">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
    <div class="w-full">
      <img src="/images/nad-al-sheba-dubai-holding.webp" alt="Nad Al Sheba Mall website homepage" class="w-full h-auto object-contain shadow-low dark:shadow-lowInverted rounded-2xl" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Nad Al Sheba Mall homepage</p>
    </div>
    <div class="w-full">
      <img src="/images/nad-al-sheba-wcag.webp" alt="WCAG accessibility audit showing AA conformance" class="w-full h-auto object-contain shadow-low dark:shadow-lowInverted rounded-2xl" />
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">WCAG AA conformance verified</p>
    </div>
  </div>
</section>

---

## Across the Portfolio

Visit Hatta and Nad Al Sheba were two anchors in a broader engagement. Over the two years, the component library and its supporting patterns powered additional properties across Dubai Holding's portfolio.

<section class="py-8">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
    <div class="w-full text-lg">
      <img src="/images/bay-avenue-final.webp" alt="Bay Avenue website" class="w-full h-auto object-contain shadow-low dark:shadow-lowInverted rounded-2xl" />
      <p class="mt-2"><a href="https://www.bayavenue.ae/" class="font-semibold" target="_blank" rel="noopener noreferrer">Bay Avenue</a></p>
    </div>
    <div class="w-full text-lg">
      <img src="/images/souq-jumeirah-final.webp" alt="Souk Madinat Jumeirah website" class="w-full h-auto object-contain shadow-low dark:shadow-lowInverted rounded-2xl" />
      <p class="mt-2"><a href="https://www.soukmadinatjumeirah.ae/en" class="font-semibold" target="_blank" rel="noopener noreferrer">Souk Madinat Jumeirah</a></p>
    </div>
  </div>
</section>

I also contributed to migrations for Dubai Holding's **Nakheel** brand properties — consolidating their digital presence on Webflow alongside the rest of the portfolio.

The pattern across every property was the same: each new engagement moved faster than the last, because the system had already absorbed the structural problems the previous properties had encountered.

---

## Key Design Decisions

<div class="not-prose grid grid-cols-1 gap-6 my-10">
  <div class="standard-card">
    <p class="text-xs uppercase tracking-widest text-normalLight dark:text-invertedLight mb-3">Decision 01</p>
    <h3 class="text-xl font-bold text-normal dark:text-inverted mb-3">Designing the System, Not the Sites</h3>
    <p class="text-base text-normalLight dark:text-invertedLight mb-0">The first major decision was refusing to treat Dubai Holding as a series of one-off website projects. Every hour spent on the component library upfront saved weeks on every subsequent property migration.</p>
  </div>
  <div class="standard-card">
    <p class="text-xs uppercase tracking-widest text-normalLight dark:text-invertedLight mb-3">Decision 02</p>
    <h3 class="text-xl font-bold text-normal dark:text-inverted mb-3">Accessibility and Bilingual Support as System Foundations</h3>
    <p class="text-base text-normalLight dark:text-invertedLight mb-0">The non-negotiables — WCAG AA, RTL, performance — had to be solved at the component level, not the page level. Designing these into the library's foundations meant no individual property launch could regress on them, no matter who was operating the site afterward.</p>
  </div>
  <div class="standard-card">
    <p class="text-xs uppercase tracking-widest text-normalLight dark:text-invertedLight mb-3">Decision 03</p>
    <h3 class="text-xl font-bold text-normal dark:text-inverted mb-3">SEO as a Design Consideration, Not a Post-Launch Task</h3>
    <p class="text-base text-normalLight dark:text-invertedLight mb-0">With years of search equity on the line, SEO wasn't something to check at the end. Content models, URL structures, schema markup, and redirect strategies were designed into each migration from the start — in close coordination with Dubai Holding's SEO team. Every migration launched without losing ground on search rankings.</p>
  </div>
  <div class="standard-card">
    <p class="text-xs uppercase tracking-widest text-normalLight dark:text-invertedLight mb-3">Decision 04</p>
    <h3 class="text-xl font-bold text-normal dark:text-inverted mb-3">Building for Independence</h3>
    <p class="text-base text-normalLight dark:text-invertedLight mb-0">The goal wasn't to make Dubai Holding's marketing teams dependent on me — it was to give them infrastructure they could operate themselves. Every CMS was designed to put content control in the team's hands, with the design system enforcing consistency in the background. Today, the teams run their properties independently — which is the outcome I was designing toward from the start.</p>
  </div>
</div>

---

## Outcome

A two-year direct engagement with Dubai Holding, supporting multiple marketing teams across destination, retail, and hospitality properties.

<div class="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">
  <div class="standard-card text-left py-8">
    <p class="text-xl sm:text-2xl font-extrabold text-normal dark:text-inverted mb-2">Portfolio-Wide Component Library</p>
    <p class="text-sm text-normalLight dark:text-invertedLight mb-0">Shared design system powering retail and destination properties, still in active use by Dubai Holding's teams today — independent of ongoing design support.</p>
  </div>
  <div class="standard-card text-left py-8">
    <p class="text-xl sm:text-2xl font-extrabold text-normal dark:text-inverted mb-2">Zero SEO Regression</p>
    <p class="text-sm text-normalLight dark:text-invertedLight mb-0">Every migration launched without losing organic search rankings — preserving years of accumulated domain authority across the portfolio.</p>
  </div>
  <div class="standard-card text-left py-8">
    <p class="text-xl sm:text-2xl font-extrabold text-normal dark:text-inverted mb-2">Accessibility as Default</p>
    <p class="text-sm text-normalLight dark:text-invertedLight mb-0">WCAG AA compliance achieved across retail properties, with accessibility encoded into the component library so future sites inherit it automatically.</p>
  </div>
</div>

The engagement scaled the way enterprise engagements do when they're working — from initial migration scope to flagship properties, from contractor relationship to trusted system partner, across two full years of continuous work.

---

## Reflection

The most impactful thing a designer can do for an enterprise client isn't to design one great website. It's to design the system that lets them ship great websites — for years — without you.

Dubai Holding taught me that at scale, the leverage isn't in any individual screen or page. It's in the decisions the system forces downstream: accessibility baked into every component, bilingual support that can't be accidentally dropped, brand flex points that keep properties distinct while keeping the portfolio coherent. When those decisions are right, each new property gets easier. When they're wrong, the whole portfolio drifts.
