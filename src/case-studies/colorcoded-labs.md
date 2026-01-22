---
title: "ColorCoded Labs"
date: 2025-01-04
project-link: "https://www.colorcodedlabs.com/"
description: "A tech boot camp that prepares motivated individuals with the skills they need for high-demand technology careers."
logo: "/images/color-code-labs-logo.svg"
logo-dark: "/images/color-code-labs-logo.svg"
customLogoClass: "w-12 h-12 dark:w-12 dark:h-12"
header-img: "/images/colorcoded-labs-hero.webp"
header-overview: "ColorCoded Labs is a tech training bootcamp that's based in Colombus, Ohio. This bootcamp focuses on underrepresented talent in the tech industry, and has a job placement program that helps connects their graduates with employers who want to diversify their workforce."
order: 2
---

## Project Overview

**Client:** ColorCoded Labs  
**Industry:** Tech Education / Coding Bootcamp  
**Project Type:** Website Redesign & CMS Architecture  
**Timeline:** 4 weeks  
**My Role:** Lead Designer & Developer

---

## The Challenge

ColorCoded Labs is a coding bootcamp based in Columbus, Ohio, with a powerful mission: providing tech training to underrepresented talent and connecting graduates with employers committed to workforce diversity. Their programs—Manual QA and QA Automation—have helped hundreds of career changers break into tech.

The company had launched as a pilot and quickly gained traction. Their existing website, built by the same agency that created their branding, served them well initially. But as they grew, several problems emerged:

### The Core Issues

**1. The Brand Was Getting Lost in Itself**

ColorCoded Labs has a fantastic brand identity—bold, vibrant colors that represent diversity and energy. But on their website, these colors were everywhere. Headers, backgrounds, buttons, accents—everything competed for attention.

The paradox: _When everything is colorful, nothing stands out._

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
  <div class="space-y-4">
    <img src="/images/colorcoded-labs-before-1.webp" alt="ColorCoded Labs Old Design 1" class="w-full h-auto rounded-2xl shadow-medium">
    <p class="text-xs uppercase tracking-widest opacity-50 text-center">Original Design: High Cognitive Load</p>
  </div>
  <div class="space-y-4">
    <img src="/images/colorcoded-labs-before-2.webp" alt="ColorCoded Labs Old Design 2" class="w-full h-auto rounded-2xl shadow-medium">
    <p class="text-xs uppercase tracking-widest opacity-50 text-center">Inconsistent Visual Hierarchy</p>
  </div>
</div>

**2. Structure Didn't Match Growth**

The site was missing critical pages:

- No About Us page (essential for mission-driven companies)
- No Partnerships page (needed for B2B outreach)
- No Press/News section (they were getting media coverage with nowhere to showcase it)

**3. Operational Bottleneck**

Adding or modifying courses required developer intervention. The team couldn't:

- Update course information independently
- Add new programs without rebuilding pages
- Manage time-sensitive content (enrollment deadlines, countdown timers)

---

## Discovery & Strategy

### Understanding the Real Problem

Looking at the existing site alongside their brand guidelines, I identified the core tension:

The brand colors were meant to be _distinctive_—to pop and grab attention. But when applied to every element, they created visual noise instead of visual impact.

**My diagnosis to the client:**

> "I like the colors concept a lot, but I think it's being overused on the website in a way that's making the concept less impactful. More whitespace and high-contrast backgrounds would make the colors stand out more."

### The Strategic Approach

**Design Strategy:** Introduce restraint. Create a neutral canvas (clean whites, subtle grays) that allows the brand colors to be _intentional_ rather than _overwhelming_.

**Information Architecture:** Add the missing pages and restructure navigation to support their growth:

- About Us (mission and team)
- Programs (with dropdown)
- Press/News
- Partnerships

**Technical Strategy:** Build a CMS architecture that empowers the team to manage courses independently—including complex features like countdown timers and cross-site visibility toggles.

---

## Design Process

### Audit: What Wasn't Working

The existing site used brand colors for:

- Page backgrounds
- Section backgrounds
- Headers and subheaders
- Buttons and CTAs
- Decorative elements
- Navigation

Result: Visual fatigue. The eye had nowhere to rest, and nothing felt important.

### The Refinement: Strategic Color Application

I introduced a new visual hierarchy:

**Base Layer (90% of the page):**

- Clean white backgrounds
- Light gray accents for section separation
- Dark text for readability
- Generous whitespace

**Accent Layer (10% of the page):**

- Brand colors reserved for:
  - Primary CTAs
  - Course-specific identifiers
  - Key data points
  - Interactive elements on hover

**The Result:** When color appears, it _means something_. Each course gets its signature color (blue for Manual QA, green for QA Automation), creating instant recognition without overwhelming the user.

### Color System

To allow the website's vibrant colors to stand out without competing for attention, I introduced a neutral set of base colors. This approach not only provides a modern, professional canvas but also makes it easier to assign specific, distinguishable colors to different programs—like individual course pages—enhancing the site's overall utility.

**New Base Colors**

<div class="flex flex-wrap gap-8 tracking-tight my-8">
  <div class="flex flex-col items-center sm:items-start">
    <div class="w-16 h-16 rounded-xl shadow-low dark:shadow-lowInverted" style="background-color: #18172D;"></div>
    <div class="mt-2 text-center sm:text-left">
      <p class="font-bold text-base mb-0 text-normal dark:text-inverted">Xiketic</p>
      <span class="text-xs opacity-60 font-mono">#18172D</span>
    </div>
  </div>
  <div class="flex flex-col items-center sm:items-start">
    <div class="w-16 h-16 rounded-xl shadow-low dark:shadow-lowInverted border border-slate-200 dark:border-white/10" style="background-color: #F2F2F2;"></div>
    <div class="mt-2 text-center sm:text-left">
      <p class="font-bold text-base mb-0 text-normal dark:text-inverted">Cultured</p>
      <span class="text-xs opacity-60 font-mono">#F2F2F2</span>
    </div>
  </div>
  <div class="flex flex-col items-center sm:items-start">
    <div class="w-16 h-16 rounded-xl shadow-low dark:shadow-lowInverted border border-slate-200 dark:border-white/10" style="background-color: #FFFFFF;"></div>
    <div class="mt-2 text-center sm:text-left">
      <p class="font-bold text-base mb-0 text-normal dark:text-inverted">White</p>
      <span class="text-xs opacity-60 font-mono">#FFFFFF</span>
    </div>
  </div>
</div>

**Existing Brand Colors**

<div class="flex flex-wrap gap-8 tracking-tight my-8">
  <div class="flex flex-col items-center sm:items-start">
    <div class="w-12 h-12 rounded-lg shadow-low dark:shadow-lowInverted" style="background-color: #262262;"></div>
    <div class="mt-2 text-center sm:text-left">
      <p class="font-bold text-sm mb-0 text-normal dark:text-inverted">Midnight Blue</p>
      <span class="text-[10px] opacity-60 font-mono">#262262</span>
    </div>
  </div>
  <div class="flex flex-col items-center sm:items-start">
    <div class="w-12 h-12 rounded-lg shadow-low dark:shadow-lowInverted" style="background-color: #1C75BB;"></div>
    <div class="mt-2 text-center sm:text-left">
      <p class="font-bold text-sm mb-0 text-normal dark:text-inverted">French Blue</p>
      <span class="text-[10px] opacity-60 font-mono">#1C75BB</span>
    </div>
  </div>
  <div class="flex flex-col items-center sm:items-start">
    <div class="w-12 h-12 rounded-lg shadow-low dark:shadow-lowInverted" style="background-color: #61C7CF;"></div>
    <div class="mt-2 text-center sm:text-left">
      <p class="font-bold text-sm mb-0 text-normal dark:text-inverted">Dark Turquoise</p>
      <span class="text-[10px] opacity-60 font-mono">#61C7CF</span>
    </div>
  </div>
  <div class="flex flex-col items-center sm:items-start">
    <div class="w-12 h-12 rounded-lg shadow-low dark:shadow-lowInverted" style="background-color: #F6931D;"></div>
    <div class="mt-2 text-center sm:text-left">
      <p class="font-bold text-sm mb-0 text-normal dark:text-inverted">Carrot Orange</p>
      <span class="text-[10px] opacity-60 font-mono">#F6931D</span>
    </div>
  </div>
  <div class="flex flex-col items-center sm:items-start">
    <div class="w-12 h-12 rounded-lg shadow-low dark:shadow-lowInverted" style="background-color: #EB008B;"></div>
    <div class="mt-2 text-center sm:text-left">
      <p class="font-bold text-sm mb-0 text-normal dark:text-inverted">Deep Cerise</p>
      <span class="text-[10px] opacity-60 font-mono">#EB008B</span>
    </div>
  </div>
</div>

### Page-by-Page Approach

**Homepage:**

- Clean hero with clear value proposition
- Course cards with color-coded accents (not color-flooded backgrounds)
- Social proof section (review ratings, salary outcomes)
- Sticky CTA bar for enrollment

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
  <img src="/images/colorcoded-labs-homepage.webp" alt="ColorCoded Labs Redesigned Homepage" class="w-full h-auto rounded-2xl shadow-medium">
  <img src="/images/colorcoded-labs-offering.webp" alt="ColorCoded Labs Course Offerings" class="w-full h-auto rounded-2xl shadow-medium">
</div>

**Course Pages:**

- Each course "owns" its color
- Countdown timer for enrollment deadlines
- Clear curriculum breakdown
- Graduate outcomes and salary data

<div class="w-full my-12">
  <img src="/images/colorcoded-labs-course-page.webp" alt="ColorCoded Labs Individual Course Page" class="w-full h-auto rounded-2xl shadow-medium">
</div>

**About Page:**

- Mission-first storytelling
- Team introduction
- Company values aligned with diversity mission

<div class="w-full my-12">
  <img src="/images/colorcoded-labs-about.webp" alt="ColorCoded Labs Redesigned About Page" class="w-full h-auto rounded-2xl shadow-medium">
</div>

**Partnerships Page:**

- B2B focus for employer partnerships
- Clear value proposition for hiring partners
- Contact/inquiry flow

**Press Page:**

- CMS-driven news appearances
- Automatic page generation for each press mention
- Chronological archive

---

## Technical Implementation

### CMS Architecture

The biggest operational win was the course management system I built in Webflow:

**What the ColorCoded Labs team can now do without a developer:**

1. **Add New Courses**
   - Create course in CMS
   - Assign course color (appears everywhere automatically)
   - Set curriculum, pricing, timeline
   - Course page generates automatically

2. **Manage Enrollment Deadlines**
   - Set countdown timer date in CMS
   - Timer updates automatically across site
   - No code touching required

3. **Control Course Visibility**
   - Single toggle: "Show/Hide Course"
   - Affects: Homepage, navigation dropdown, course listing page
   - Instant site-wide update

4. **Add Press Mentions**
   - Add news item to CMS
   - Press page updates automatically
   - New press release page generates if needed

### Technical Details

- **Platform:** Webflow
- **CMS Collections:** Courses, Press/News, Team Members
- **Custom Features:**
  - Dynamic countdown timer pulling dates from CMS
  - Conditional visibility based on CMS toggles
  - Color theming via CMS color picker
  - Automatic navigation updates

---

## The Transformation

### Before vs. After Comparison

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-12 items-start">
  <div class="space-y-4">
    <img src="/images/colorcoded-labs-before-1.webp" alt="Original Homepage" class="w-full h-auto rounded-2xl shadow-medium">
    <p class="text-xs uppercase tracking-widest opacity-50 text-center">Original Pilot Site</p>
  </div>
  <div class="space-y-4">
    <img src="/images/colorcoded-labs-homepage.webp" alt="Redesigned Homepage" class="w-full h-auto rounded-2xl shadow-medium">
    <p class="text-xs uppercase tracking-widest opacity-50 text-center">2023 Redesign</p>
  </div>
</div>

**Before:**

- Brand colors everywhere, competing for attention
- Missing critical pages
- Team dependent on developers for content updates
- No clear visual hierarchy

**After:**

- Strategic color application that makes the brand pop
- Complete page structure supporting business growth
- Full content independence via CMS
- Clean, modern aesthetic with intentional color moments

### Design Philosophy in Action

The key insight from this project: _Restraint is a design skill._

ColorCoded Labs' brand wasn't broken—it was being diluted. By pulling back and creating breathing room, the vibrant colors finally got the attention they deserved.

---

## Results & Impact

### Operational Efficiency

- Team can now add courses, update content, and manage press mentions independently
- Enrollment deadline updates take seconds, not developer hours
- New course launch requires zero development work

### Brand Clarity

- Colors now serve a purpose (course identification, CTAs, key moments)
- Visual hierarchy guides users through conversion funnel
- Modern, clean aesthetic matches their professional positioning

### Scalability

- Site structure supports continued growth
- CMS architecture ready for new programs
- Press section showcases growing media presence

---

## Key Learnings

### 1. Sometimes the Problem Isn't What They Think

The client asked for a "refresh"—move things around, add some content. But the real issue was strategic: their brand was getting lost in visual noise. Identifying and articulating this elevated the project from cosmetic updates to meaningful improvement.

### 2. Restraint Requires Confidence

It's easy to add more. It's harder to take away. Convincing a client that _less color_ would make their colorful brand _more impactful_ required clear rationale and trust.

### 3. CMS Architecture Is Design Work

The course management system wasn't just development—it was designing a workflow. Understanding how the team would use the site daily informed every CMS decision.

### 4. Mission-Driven Clients Deserve Mission-Worthy Design

ColorCoded Labs is doing important work: creating pathways into tech for underrepresented talent. Their website needed to reflect that professionalism and purpose—not just look "colorful."

---

## Project Images

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
  <img src="/images/colorcoded-labs-homepage.webp" alt="ColorCoded Labs Homepage Design" class="w-full h-auto rounded-2xl shadow-medium">
  <img src="/images/colorcoded-labs-course-page.webp" alt="ColorCoded Labs Course Page Design" class="w-full h-auto rounded-2xl shadow-medium">
  <img src="/images/colorcoded-labs-offering.webp" alt="ColorCoded Labs Offering Grid" class="w-full h-auto rounded-2xl shadow-medium">
  <img src="/images/colorcoded-labs-about.webp" alt="ColorCoded Labs About Page Design" class="w-full h-auto rounded-2xl shadow-medium">
</div>
