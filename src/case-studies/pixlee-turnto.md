---
title: "Pixlee TurnTo"
date: 2025-01-01
project-link: "https://emplifi.io/resources/"
description: "Enterprise blog migration from WordPress to Webflow — 850+ posts, SEO-preserving redirects, and a CMS the marketing team could actually run. (Pixlee TurnTo is now part of Emplifi.)"
logo: "/images/emplifi-logo.svg"
logo-dark: "/images/emplifi-logo-white.svg"
customLogoClass: "w-24 h-24 mb-0 dark:w-24 dark:h-24 dark:mb-6"
card-img: "/images/pixlee-screenshot-1.webp"
card-img-width: 1600
card-img-height: 1000
header-img: "/images/pixlee-header-img.webp"
header-img-width: 2600
header-img-height: 2756
header_subtitle: "Blog Migration & Webflow Development"
header-overview: "A high-traffic enterprise blog had outgrown WordPress. I led the rebuild on Webflow — migrating 850+ pages, rebuilding discovery and filtering for readers, and protecting organic search with disciplined URL and redirect work. After launch, Pixlee TurnTo joined Emplifi; the property continues to serve as a major content hub."
header_meta:
  - label: "Client"
    value: "Pixlee TurnTo"
  - label: "Industry"
    value: "Social UGC, Reviews & CX Software"
  - label: "Scope"
    value: "850+ CMS items"
  - label: "Role"
    value: "Lead Webflow Developer"
order: 4
categories:
  - Web Design / Dev
draft: true
---

## Overview

Pixlee TurnTo helped global brands collect and display social proof — user-generated content, ratings and reviews, and influencer programs — across commerce and marketing stacks. Their marketing engine depended on a large, mature blog: deep archives, category and topic taxonomies, and steady organic traffic.

The blog lived on WordPress. It worked — until it didn't. Performance, editorial friction, and the cost of maintaining a custom stack at that scale pushed the team toward a platform that could ship fast, stay stable, and give marketing direct control. Webflow was the bet.

I led the technical side of the migration: CMS architecture, templates, interactive listing behavior, and the unglamorous work that makes or breaks a project like this — URL parity, metadata, and redirects so search visibility didn't crater mid-move.

After the migration, Pixlee TurnTo was acquired by **Emplifi**. The blog continues under the Emplifi umbrella as a core resources destination.

---

## The Challenge

This wasn't a brochure site. It was a **high-traffic publishing surface** with years of equity in URLs, internal links, and rankings. The constraints were technical and political: marketing needed flexibility; SEO needed continuity; readers needed faster pages and clearer ways to browse.

<div class="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">
  <div class="standard-card text-left">
    <p class="text-xl font-medium text-normal dark:text-inverted mb-2">Scale Without a Safety Net</p>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">Hundreds of live URLs, each with history in search. A migration that mishandles structure or redirects doesn't just look messy — it quietly bleeds traffic.</p>
  </div>
  <div class="standard-card text-left">
    <p class="text-xl font-medium text-normal dark:text-inverted mb-2">WordPress Feature Debt</p>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">Filtering, categories, date-driven content, and editorial workflows had accreted over time. Anything built in Webflow had to match real reader behavior, not just look fine in a template.</p>
  </div>
  <div class="standard-card text-left">
    <p class="text-xl font-medium text-normal dark:text-inverted mb-2">Marketing Ownership</p>
    <p class="text-lg text-normalLight dark:text-invertedLight mb-0">The goal was operational independence: publish, reorganize, and iterate without opening a ticket for every structural change.</p>
  </div>
</div>

---

## The Core Insight

**Treat the migration as a product launch, not a file transfer.**

The valuable artifact wasn't a pixel-perfect page — it was continuity: authority preserved, internal links intact, and a CMS that matched how the team actually publishes. Every decision — collection fields, template splits, filter UI, redirect rules — had to be tested against those outcomes.

<div class="not-prose cs-decision-callout my-10">
  <p class="text-base sm:text-lg text-normal dark:text-inverted mb-0">If SEO and editorial workflow are both first-class requirements, the build order matters: structure and URL strategy before polish; CMS ergonomics before edge-case animations.</p>
</div>

---

## Approach

**Audit first.** Map content types, taxonomies, URL patterns, and high-value landing pages. Identify what must be one-to-one versus what could be consolidated.

**Build for the CMS.** Webflow's CMS is only as good as the schema — field naming, references, and template boundaries determine whether the team can scale content or fight the system.

**Pair engineering with editorial QA.** Migrations fail in the gaps: a missing redirect, a truncated meta description, a template that breaks on legacy embeds. Cross-checking with marketing caught those before launch.

**Launch with redirect discipline.** Systematic 301s from legacy routes to new routes, validated against crawl data and spot checks on high-traffic posts.

---

## What We Built

### CMS & templates

Structured the blog in Webflow so posts, categories, and supporting fields mapped cleanly from WordPress. Templates covered listing and detail views with room for the team's ongoing publishing rhythm — not a one-off campaign microsite.

### Discovery & filtering

Recreated reader-facing tools to browse content by category and time — the kind of filtering that sounds simple until you account for edge cases, empty states, and performance on long lists.

### SEO continuity

Carried forward titles, descriptions, and structured cues where applicable; kept URLs and redirects aligned so the transition read as a platform move, not a new site with amnesia.

### Performance & operations

Leaned on Webflow's hosting and asset pipeline so pages loaded faster than the legacy stack, with less operational overhead for the team maintaining it.

---

## Collaboration

I worked tightly with **marketing** on structure, acceptance testing, and launch sequencing — this project only works when editorial stakeholders trust the CMS. The outcome was a property they could run day to day without developer intervention for routine publishing.

---

## Outcome

The blog relaunched on Webflow with **850+ entries** migrated into a coherent CMS, **filtering and browse patterns** rebuilt for readers, and **redirect and metadata work** aimed at protecting organic visibility through the cutover. The subsequent **Emplifi acquisition** shifted branding and ownership, but the migration itself left the team with a faster, more maintainable foundation for content.

<div class="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-12">
  <div class="space-y-4">
    <div class="bg-slate-50 dark:bg-white/5 px-2 py-1 md:px-4 md:py-2 rounded-2xl">
      <img src="/images/pixlee-screenshot-1.webp" alt="Pixlee TurnTo blog listing on Webflow showing resource cards and layout" class="w-full h-auto rounded-lg">
    </div>
    <p class="text-xs uppercase tracking-widest opacity-50 text-center">Resources listing — browse and content hierarchy</p>
  </div>
  <div class="space-y-4">
    <div class="bg-slate-50 dark:bg-white/5 px-2 py-1 md:px-4 md:py-2 rounded-2xl">
      <img src="/images/pixlee-screenshot-2.webp" alt="Pixlee TurnTo article and editorial layout after migration" class="w-full h-auto rounded-lg">
    </div>
    <p class="text-xs uppercase tracking-widest opacity-50 text-center">Article template — long-form reading experience</p>
  </div>
</div>

---

## Reflection

Large migrations are a study in **risk management**. The visible work is the design system and components; the invisible work is what keeps traffic and trust intact. I'm proud of shipping something the marketing team could own — and of treating redirects and metadata with the same seriousness as anything user-facing.

This is the kind of engagement I like: high stakes, clear success metrics, and close partnership with the people who live in the CMS after I hand it off.
