# Migration Changes: Porting New Features to Old Website

This document contains all the code, markup, styles, and implementation steps needed to apply specific features from the current (new) version of the website to the old version after reverting.

**Asset folder:** All updated images and fonts are in `migration-assets/` at the project root. Copy the contents of `migration-assets/images/` into your `src/images/` and `migration-assets/fonts/` into `src/fonts/`.

---

## Table of Contents

1. [Navbar: Contact Link as Normal Link](#1-navbar-contact-link-as-normal-link)
2. [Space Grotesk Font with Current Sizes](#2-space-grotesk-font-with-current-sizes)
3. [Homepage Hero: Rotating Greeting Text](#3-homepage-hero-rotating-greeting-text)
4. [Homepage Hero Section Sizing](#4-homepage-hero-section-sizing)
5. [Case Study Cards with Tags](#5-case-study-cards-with-tags)
6. [SocialSuite Case Study Content](#6-socialsuite-case-study-content)
7. [Magnetic Effect for Cards and Buttons](#7-magnetic-effect-for-cards-and-buttons)
8. [Custom Cursor System with Transitions](#8-custom-cursor-system-with-transitions)
9. [Omar Almasry to O. Logo Animation](#9-omar-almasry-to-o-logo-animation)
10. [Remove "Designed with Eleventy" from Footer](#10-remove-designed-with-eleventy-from-footer)
11. [Remove "Designer of Webz / Maker of Things" from Homepage](#11-remove-designer-of-webz--maker-of-things-from-homepage)
12. [Page Titles](#12-page-titles)
13. [About Page Copy and Card Structure](#13-about-page-copy-and-card-structure)
14. [Typing Stick Cursor Effect on Text Hover](#14-typing-stick-cursor-effect-on-text-hover)
15. [Use Old Website Colors](#15-use-old-website-colors)

---

## 1. Navbar: Contact Link as Normal Link

**Files affected:** `src/_includes/partials/navbar.liquid`

Replace the Contact button/CTA with a normal nav link matching the About link style. The Contact link should be a plain `<a>` with class `menu_link` and the roll-text hover effect.

**Full navbar markup:**

```html
<nav id="mainNav" class="px-[5%] py-4 sticky top-0 z-50 transition-transform duration-300">
  <div class="max-w-4xl mx-auto flex items-center justify-between gap-3">
    <!-- Logo -->
    <a href="{{ '/' | url }}" class="logo logo-nav flex shrink-0 items-center font-bold no-underline group">
      <span class="logo-morph text-xl sm:text-2xl text-normalLight dark:text-invertedLight group-hover:text-primary dark:group-hover:text-primaryInverted transition-colors duration-300"
        ><span class="logo-letter-o">O</span
        ><span class="logo-rest-clip"><span class="logo-rest">mar Almasry</span></span
        ><span class="logo-dot text-primary dark:text-primaryInverted">.</span></span
      >
    </a>

    <!-- About, Contact, theme toggle: single row on mobile -->
    <div class="flex min-w-0 items-center justify-end gap-2.5 sm:gap-7 md:gap-8">
      <a
        href="{{ '/about/' | url }}"
        class="menu_link shrink-0 min-h-[44px] flex items-center text-normalLight text-base sm:text-lg font-medium hover:text-primary no-underline dark:text-invertedLight dark:hover:text-primaryInverted"
        {% if page.url == '/about/' %}
          aria-current="page"
        {% endif %}
      >
        <span class="roll-text">
          <span data-text="About">About</span>
          <span data-text="About" aria-hidden="true">About</span>
        </span>
      </a>

      <div class="flex shrink-0 items-center gap-4 sm:gap-7 md:gap-8">
        <a
          href="mailto:hello@omaralmasry.com"
          class="menu_link shrink-0 min-h-[44px] flex items-center text-normalLight text-base sm:text-lg font-medium hover:text-primary no-underline dark:text-invertedLight dark:hover:text-primaryInverted"
        >
          <span class="roll-text">
            <span data-text="Contact">Contact</span>
            <span data-text="Contact" aria-hidden="true">Contact</span>
          </span>
        </a>

        <button
          id="themeToggle"
          type="button"
          class="theme-toggle shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center bg-inverted rounded-full shadow-low dark:shadow-lowInverted dark:bg-normal"
        >
          <span class="sr-only">Toggle dark mode</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 fill-current text-primaryInverted hover:text-inverted block dark:hidden"
            role="img"
            aria-label="Dark Mode"
            viewBox="0 0 256 256"
          >
            <path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z"></path>
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 fill-current text-ctaSurface hidden dark:block"
            role="img"
            aria-label="Light Mode"
            viewBox="0 0 256 256"
          >
            <path d="M120,40V32a8,8,0,0,1,16,0v8a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-8-8A8,8,0,0,0,50.34,61.66Zm0,116.68-8,8a8,8,0,0,0,11.32,11.32l8-8a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l8-8a8,8,0,0,0-11.32-11.32l-8,8A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l8,8a8,8,0,0,0,11.32-11.32ZM40,120H32a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Zm88,88a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-8A8,8,0,0,0,128,208Zm96-88h-8a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Z"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</nav>
```

**Required CSS for roll-text hover effect** (add to `input.css` inside `@layer components`):

```css
  .roll-text {
    @apply relative block overflow-hidden h-[1.5em] leading-[1.5em];
  }

  .roll-text span {
    @apply block transition-transform;
    transition-duration: 700ms;
    transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
  }

  .menu_link:hover .roll-text span {
    @apply -translate-y-full;
  }
```

---

## 2. Space Grotesk Font with Current Sizes

**Files affected:** `src/styles/input.css`, `tailwind.config.js`, `src/_includes/layouts/layout.liquid`, `src/fonts/`

### Step 1: Copy font file
Copy `migration-assets/fonts/Space Grotesk.ttf` into `src/fonts/`.

### Step 2: Add @font-face (input.css)
Add inside `@layer base`:

```css
  @font-face {
    font-family: Space Grotesk;
    src: url('/fonts/Space Grotesk.ttf');
    font-style: normal;
    font-weight: 300 700;
    font-display: swap;
  }
```

### Step 3: Set as default sans font (tailwind.config.js)
In `theme.extend`:

```js
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
      },
```

### Step 4: Preload in layout (layout.liquid)
Add inside `<head>`:

```html
    <link
      rel="preload"
      href="/fonts/Space%20Grotesk.ttf"
      as="font"
      type="font/ttf"
      crossorigin
    >
```

### Step 5: Font size rules (input.css)
Add inside `@layer base`:

```css
  h1 {
    @apply text-4xl sm:text-6xl font-extrabold mb-4 leading-[1.1] tracking-tight;
  }

  p {
    @apply text-xl mb-4;
  }

  h2 {
    @apply text-4xl sm:text-5xl font-bold mb-4 leading-[1.1] tracking-tight;
  }

  h3 {
    @apply text-2xl lg:text-3xl font-semibold mb-1;
  }

  h2,
  h3 {
    scroll-margin-top: 80px;
  }
```

---

## 3. Homepage Hero: Rotating Greeting Text

**Files affected:** `src/index.html`, `src/scripts/main.js`, `src/styles/input.css`

### Step 1: Hero HTML (index.html)
Replace the "Hi there" static text with the rotating greeting markup:

```html
<p class="home-heading hero-greeting-line flex w-full flex-nowrap items-center justify-center gap-0 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl z-0 relative mb-3">
  <span class="hero-greeting-rotator whitespace-nowrap" aria-live="polite" aria-atomic="true" lang="en" dir="ltr">
    <span id="heroGreetingWord" class="hero-greeting-word whitespace-nowrap" lang="en" dir="ltr">Hi</span>
  </span>
</p>
```

### Step 2: Typing animation JS (main.js)
Add this function and its initialization:

```js
function initHeroGreetingRotator() {
  const greetingWord = document.getElementById('heroGreetingWord');
  if (!greetingWord) return;

  const greetings = [
    { text: 'Hi', lang: 'en' },
    { text: 'Bonjour', lang: 'fr' },
    { text: 'مرحبا', lang: 'ar' }
  ];

  const rotator = greetingWord.closest('.hero-greeting-rotator');

  const setGreetingMeta = (entry) => {
    const rtl = entry.lang === 'ar';
    const dir = rtl ? 'rtl' : 'ltr';
    greetingWord.setAttribute('lang', entry.lang);
    greetingWord.setAttribute('dir', dir);
    if (rotator) {
      rotator.setAttribute('lang', entry.lang);
      rotator.setAttribute('dir', dir);
    }
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    let index = 0;
    setGreetingMeta(greetings[index]);
    greetingWord.textContent = greetings[index].text;
    window.setInterval(() => {
      index = (index + 1) % greetings.length;
      setGreetingMeta(greetings[index]);
      greetingWord.textContent = greetings[index].text;
    }, 4000);
    return;
  }

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeSpeed = 185;
  const deleteSpeed = 110;
  const holdAfterTypeMs = 2400;
  const holdAfterDeleteMs = 500;

  const tick = () => {
    const current = greetings[wordIndex];
    const fullText = current.text;
    setGreetingMeta(current);

    if (isDeleting) {
      charIndex = Math.max(0, charIndex - 1);
    } else {
      charIndex = Math.min(fullText.length, charIndex + 1);
    }

    greetingWord.textContent = fullText.slice(0, charIndex);

    if (!isDeleting && charIndex === fullText.length) {
      isDeleting = true;
      window.setTimeout(tick, holdAfterTypeMs);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % greetings.length;
      window.setTimeout(tick, holdAfterDeleteMs);
      return;
    }

    window.setTimeout(tick, isDeleting ? deleteSpeed : typeSpeed);
  };

  setGreetingMeta(greetings[wordIndex]);
  greetingWord.textContent = '';
  tick();
}

document.addEventListener('DOMContentLoaded', initHeroGreetingRotator);
```

### Step 3: CSS for greeting rotator and blinking caret (input.css)
Add inside `@layer components`:

```css
  .home-heading {
    @apply relative z-[20] transition-colors duration-300 ease-out;
  }

  .home-heading.hero-greeting-line {
    @apply w-full max-w-full;
    line-height: 1.2;
    min-height: 1.35em;
  }

  .hero-greeting-rotator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding-inline-end: 0.22em;
    flex: 0 0 auto;
    overflow: visible;
    line-height: inherit;
    unicode-bidi: isolate;
  }

  .hero-greeting-word {
    display: inline-block;
    text-align: center;
    unicode-bidi: plaintext;
    line-height: inherit;
    vertical-align: middle;
  }

  .hero-greeting-rotator::after {
    content: "";
    position: absolute;
    inset-inline-end: 0;
    top: 50%;
    transform: translateY(-46%);
    width: 0.07em;
    min-width: 2px;
    height: 0.75em;
    border-radius: 9999px;
    background-color: currentColor;
    animation: heroCaretBlink 1s steps(1, end) infinite;
    opacity: 0.95;
    pointer-events: none;
  }

  @keyframes heroCaretBlink {
    0%, 45% {
      opacity: 1;
    }
    46%, 100% {
      opacity: 0;
    }
  }
```

---

## 4. Homepage Hero Section Sizing

**Files affected:** `src/index.html`

Replace the entire hero section with the current version's sizing:

```html
<div class="min-h-svh flex flex-col items-center justify-start px-[5%] pt-32 pb-12">
    <div class="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        <div id="portraitCircle" class="relative w-56 h-56 rounded-full bg-inverted dark:bg-secondary mb-6 overflow-hidden shadow-low dark:shadow-lowInverted">
            <picture>
              <img src="/images/profile-pic-no-bg.png" alt="Omar Almasry Portrait" width="500" height="500" class="w-full h-full object-cover">
            </picture>
          </div>
        <p class="home-heading hero-greeting-line flex w-full flex-nowrap items-center justify-center gap-0 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl z-0 relative mb-3">
          <span class="hero-greeting-rotator whitespace-nowrap" aria-live="polite" aria-atomic="true" lang="en" dir="ltr">
            <span id="heroGreetingWord" class="hero-greeting-word whitespace-nowrap" lang="en" dir="ltr">Hi</span>
          </span>
        </p>
        <h1 class="hero-intro text-base sm:text-xl text-normalLight font-normal dark:text-invertedLight max-w-[40rem] mx-auto leading-relaxed pb-4">
            My name is Omar Almasry. I'm a digital designer working with agencies and in-house marketing teams to design and build digital experiences that work for everyone.
        </h1>
    </div>
  </div>
```

Key sizing details:
- Portrait circle: `w-56 h-56` (224px)
- Greeting text: `text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold`
- Intro text: `text-base sm:text-xl font-normal`, max-width `40rem`
- Section: `min-h-svh`, `pt-32 pb-12`

---

## 5. Case Study Cards with Tags

**Files affected:** `src/_includes/partials/section-projects-bento.liquid`, `src/styles/input.css`, case study markdown files

### Step 1: Create the bento card partial
Create/replace `src/_includes/partials/section-projects-bento.liquid`:

```html
{%- comment -%}
  Featured projects in a 2-column grid using standard-card style.
{%- endcomment -%}
<section class="py-20 md:py-28 px-[5%] {{ customClasses | default: '' }}">
  <div class="max-w-4xl mx-auto">
    {% if header or subheader %}
      <div class="mb-10 md:mb-12">
        {% if header %}
          <h2 class="text-2xl sm:text-4xl font-bold leading-[1.1] tracking-tight mb-0">
            {{ header }}
          </h2>
        {% endif %}
        {% if subheader %}
          <p class="text-xl sm:text-2xl text-normalLight leading-tight dark:text-invertedLight max-w-2xl mt-4 mb-0">
            {{ subheader }}
          </p>
        {% endif %}
      </div>
    {% endif %}

    {% if collection and collection.size > 0 %}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {% for item in collection limit: limit %}
          <article class="standard-card case-study-cursor-card group relative overflow-hidden !p-0">
            <a
              href="{{ item.url }}"
              class="stretched-link block focus:outline-none"
              aria-label="View case study: {{ item.data.title }}"
            >
              <span class="sr-only">View case study: {{ item.data.title }}</span>
            </a>

            {% if item.data['card-img'] %}
              <div class="case-study-media aspect-[4/3] overflow-hidden rounded-t-md">
                <img
                  src="{{ item.data['card-img'] }}"
                  alt="{{ item.data.title }}"
                  {% if item.data['card-img-width'] and item.data['card-img-height'] %}
                    width="{{ item.data['card-img-width'] }}"
                    height="{{ item.data['card-img-height'] }}"
                  {% endif %}
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                >
              </div>
            {% elsif item.data.header-img %}
              <div class="case-study-media aspect-[4/3] overflow-hidden rounded-t-md">
                <img
                  src="{{ item.data.header-img }}"
                  alt="{{ item.data.title }}"
                  {% if item.data['header-img-width'] and item.data['header-img-height'] %}
                    width="{{ item.data['header-img-width'] }}"
                    height="{{ item.data['header-img-height'] }}"
                  {% endif %}
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                >
              </div>
            {% elsif item.data.logo %}
              <div class="case-study-media aspect-[4/3] overflow-hidden rounded-t-md flex items-center justify-center bg-secondary dark:bg-secondaryInverted p-10">
                {% if item.data['logo-dark'] %}
                  <img src="{{ item.data.logo }}" alt="{{ item.data.title }}" class="max-h-16 w-auto object-contain dark:hidden" loading="lazy" decoding="async">
                  <img src="{{ item.data['logo-dark'] }}" alt="{{ item.data.title }}" class="max-h-16 w-auto object-contain hidden dark:block" loading="lazy" decoding="async">
                {% else %}
                  <img src="{{ item.data.logo }}" alt="{{ item.data.title }}" class="max-h-16 w-auto object-contain" loading="lazy" decoding="async">
                {% endif %}
              </div>
            {% endif %}

            <div class="case-study-content p-6 flex flex-col flex-1">
              {% if item.data.categories and item.data.categories.size > 0 %}
                <ul class="flex flex-wrap gap-2 mb-3 pointer-events-none" role="list" aria-label="Project categories">
                  {% for cat in item.data.categories %}
                    <li>
                      <span class="case-study-tag">{{ cat }}</span>
                    </li>
                  {% endfor %}
                </ul>
              {% endif %}
              <h3 class="text-2xl font-bold tracking-tight text-normal dark:text-inverted mb-2 leading-snug">
                {{ item.data.title }}
              </h3>
              {% if item.data.description %}
                <p class="text-base text-normalLight dark:text-invertedLight leading-snug mb-4">
                  {{ item.data.description }}
                </p>
              {% endif %}
              <div class="mt-auto">
                <span class="inline-flex items-center gap-2 text-primary dark:text-primaryInverted font-medium text-md sm:text-md pointer-events-none" aria-hidden="true">
                  View case study
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 sm:w-6 sm:h-6 fill-current shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                    viewBox="0 0 256 256"
                    aria-hidden="true"
                  >
                    <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                  </svg>
                </span>
              </div>
            </div>
          </article>
        {% endfor %}
      </div>
    {% endif %}
  </div>
</section>
```

### Step 2: CSS for cards and tags (input.css)
Add inside `@layer components`:

```css
  .standard-card {
    @apply border border-normal rounded-md flex flex-col justify-start items-start h-full p-6 no-underline transition-[background-color,border-color,color,box-shadow] duration-300 shadow-low w-full dark:shadow-lowInverted relative dark:border-inverted;
  }

  .case-study-tag {
    @apply inline-flex items-center rounded-full border border-normal px-2.5 py-0.5 text-xs font-medium leading-tight tracking-tight text-normalLight dark:border-inverted dark:text-invertedLight;
  }
```

### Step 3: Add categories to case study front matter
Each case study markdown file needs a `categories` array. Example:

```yaml
categories:
  - Branding
  - Web Design / Dev
```

### Step 4: Render on homepage (index.html)
After the hero section, render the bento grid:

```html
  {%- render 'partials/section-projects-bento',
    header: 'Featured Projects',
    subheader: 'Interesting case studies for some projects I worked on.',
    collection: collections.caseStudies,
    limit: 6
  -%}
```

### Step 5: Stretched link CSS (input.css, outside @layer)

```css
.stretched-link::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  pointer-events: auto;
}

.standard-card a:not(.stretched-link) {
  position: relative;
  z-index: 11;
}

.group.relative {
  position: relative;
}
```

---

## 6. SocialSuite Case Study Content

**Files affected:** `src/case-studies/socialsuite.md`, `src/_includes/layouts/case-study-layout.liquid`, `.eleventy.js`

### Step 1: Create the case study file
Create `src/case-studies/socialsuite.md` with the following complete content:

```markdown
---
title: "Socialsuite"
date: 2025-01-04
description: "Brand identity and website design for a global ESG platform serving 150+ organizations — including YMCA, Big Brothers Big Sisters, and publicly traded companies on NASDAQ and NYSE."
logo: "/images/png/socialsuite-logo.webp"
logo-dark: "/images/png/socialsuite-logo.webp"
customLogoClass: "w-12 h-12 dark:w-12 dark:h-12"
card-img: "/images/png/socialsuite-cover-updated.png"
card-img-width: 1600
card-img-height: 1200
header-img: "/images/socialsuite-hero-img.webp"
header-img-width: 2880
header-img-height: 1738
header_subtitle: "Brand Identity & Website Design"
header-overview: "Transforming an ESG software leader's digital presence — designing a sophisticated website that speaks to both mission-driven nonprofits and enterprise corporations."
header_meta:
  - label: "Client"
    value: "Socialsuite"
  - label: "Industry"
    value: "ESG & Impact Measurement"
  - label: "Timeline"
    value: "6 weeks"
  - label: "Role"
    value: "Lead Designer & Developer"
order: 1
categories:
  - Branding
  - Web Design / Dev
---

## Overview

Socialsuite is a global leader in ESG and impact measurement software, serving 150+ organizations worldwide — from nonprofits like YMCA and Habitat for Humanity to publicly traded companies on NASDAQ and NYSE. Following a comprehensive rebrand, I led the complete redesign of their web presence, translating new brand guidelines into a digital experience that serves two distinct audiences while driving measurable conversion improvements.

---

## The Challenge

Socialsuite had a problem: their website didn't match their market position.

As a platform serving both Fortune 500 companies and leading nonprofits, they needed a digital presence that could speak credibly to both. Instead, they had outdated visuals, a confusing user experience, and a homepage conversion rate of just 2.15%.

The goal was ambitious: double conversions to 4.5% — without sacrificing lead quality.

<div class="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">
  <div class="standard-card text-center">
    <p class="text-3xl font-extrabold text-normal dark:text-inverted mb-2">01</p>
    <p class="font-semibold text-normal dark:text-inverted mb-2">Visual Identity Disconnect</p>
    <p class="text-sm text-normalLight dark:text-invertedLight mb-0">The existing site relied on generic stock illustrations and outdated branding that failed to communicate their premium positioning as an enterprise software provider.</p>
  </div>
  <div class="standard-card text-center">
    <p class="text-3xl font-extrabold text-normal dark:text-inverted mb-2">02</p>
    <p class="font-semibold text-normal dark:text-inverted mb-2">Poor Conversion Performance</p>
    <p class="text-sm text-normalLight dark:text-invertedLight mb-0">A homepage conversion rate of just 2.15% was actively hindering growth.</p>
  </div>
  <div class="standard-card text-center">
    <p class="text-3xl font-extrabold text-normal dark:text-inverted mb-2">03</p>
    <p class="font-semibold text-normal dark:text-inverted mb-2">Audience Confusion</p>
    <p class="text-sm text-normalLight dark:text-invertedLight mb-0">A single "Book a Demo" flow attempted to serve two dramatically different audiences — creating friction at every touchpoint.</p>
  </div>
</div>

<div class="not-prose grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
  <div class="space-y-4">
    <div class="bg-slate-50 dark:bg-white/5 px-2 py-1 md:px-4 md:py-2 rounded-2xl shadow-low dark:shadow-lowInverted">
      <img src="/images/socialsuite-before-1.webp" alt="Socialsuite Old Homepage Top" class="w-full h-auto rounded-lg shadow-sm">
    </div>
    <p class="text-xs uppercase tracking-widest opacity-50 text-center">Original Homepage Design</p>
  </div>
  <div class="space-y-4">
    <div class="bg-slate-50 dark:bg-white/5 px-2 py-1 md:px-4 md:py-2 rounded-2xl shadow-low dark:shadow-lowInverted">
      <img src="/images/socialsuite-before-2.webp" alt="Socialsuite Old Homepage Bottom" class="w-full h-auto rounded-lg shadow-sm">
    </div>
    <p class="text-xs uppercase tracking-widest opacity-50 text-center">Inconsistent Messaging & Layout</p>
  </div>
</div>

---

## The Core Insight

The real problem wasn't design — it was clarity.

One message can't resonate with both audiences. The website needed to feel like two experiences in one — unified by brand, differentiated by intent.

<div class="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
  <div class="cs-audience-card standard-card" style="border-left: 3px solid #00a0aa;">
    <p class="text-xs uppercase tracking-widest text-normalLight dark:text-invertedLight mb-4">Social Impact Users</p>
    <ul class="space-y-3 text-sm text-normalLight dark:text-invertedLight m-0 p-0 list-none">
      <li class="flex items-start gap-2"><span class="font-semibold text-normal dark:text-inverted shrink-0">Who:</span> Nonprofits ($1–10M revenue)</li>
      <li class="flex items-start gap-2"><span class="font-semibold text-normal dark:text-inverted shrink-0">Focus:</span> Community impact reporting</li>
      <li class="flex items-start gap-2"><span class="font-semibold text-normal dark:text-inverted shrink-0">Buyers:</span> Program directors, grant writers</li>
      <li class="flex items-start gap-2"><span class="font-semibold text-normal dark:text-inverted shrink-0">Tone:</span> Approachable, mission-focused</li>
    </ul>
  </div>
  <div class="cs-audience-card standard-card" style="border-left: 3px solid #014682;">
    <p class="text-xs uppercase tracking-widest text-normalLight dark:text-invertedLight mb-4">ESG Users</p>
    <ul class="space-y-3 text-sm text-normalLight dark:text-invertedLight m-0 p-0 list-none">
      <li class="flex items-start gap-2"><span class="font-semibold text-normal dark:text-inverted shrink-0">Who:</span> Public companies ($10M–2B market cap)</li>
      <li class="flex items-start gap-2"><span class="font-semibold text-normal dark:text-inverted shrink-0">Focus:</span> Regulatory compliance</li>
      <li class="flex items-start gap-2"><span class="font-semibold text-normal dark:text-inverted shrink-0">Buyers:</span> C-suite, sustainability officers</li>
      <li class="flex items-start gap-2"><span class="font-semibold text-normal dark:text-inverted shrink-0">Tone:</span> Professional, data-driven</li>
    </ul>
  </div>
</div>

---

## Discovery & Strategy

I mapped each audience's journey separately — understanding that a nonprofit program director and a Fortune 500 sustainability officer have completely different pain points, vocabularies, and trust signals.

This informed everything: navigation structure, content hierarchy, imagery choices, and CTA placement.

### Competitive Analysis

I analyzed the client's reference sites (Slack, Wealthsimple, Pingboard, Flyhyer) and identified key patterns:

- Clean, spacious layouts with generous whitespace
- Custom illustrations that reinforce brand personality
- Clear, benefit-focused value propositions above the fold
- Conversion-optimized CTAs with minimal friction

### Strategic Approach

**Visual Strategy**
Move from generic SaaS aesthetics to a sophisticated, purpose-driven design language that bridges corporate professionalism with nonprofit authenticity.

**Conversion Strategy**
Implement separate, optimized demo flows and tailored value propositions for each audience. By reducing form friction through progressive disclosure and strategically placing social proof throughout the user journey, we streamlined the path to action and increased overall trust.

<div class="not-prose w-full my-12">
  <img src="/images/socialsuite-form.webp" alt="Socialsuite conversion-optimized form design" class="w-full h-auto rounded-2xl shadow-medium dark:shadow-mediumInverted">
</div>

---

## Early Exploration

Before any visual design, I focused on content strategy and page structure. Working with the Socialsuite team, I created wireframes to map out user flows and content hierarchy — ensuring we solved the structural problems before layering on brand.

The homepage needed to quickly route two different audiences to relevant content, while industry-specific pages had to speak directly to sector needs (like metals and mining companies navigating ESG compliance).

These wireframes became our alignment tool — getting stakeholder buy-in on structure before committing to pixels.

<div class="not-prose grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
  <div class="space-y-4">
    <div class="bg-slate-50 dark:bg-white/5 px-2 py-1 md:px-4 md:py-2 rounded-2xl shadow-low dark:shadow-lowInverted">
      <img src="/images/png/socialsuite-wireframe-1.png" alt="Socialsuite homepage wireframe showing content hierarchy and user pathways" class="w-full h-auto rounded-lg shadow-sm">
    </div>
    <p class="text-xs uppercase tracking-widest opacity-50 text-center">Homepage wireframe — mapping content hierarchy and user pathways</p>
  </div>
  <div class="space-y-4">
    <div class="bg-slate-50 dark:bg-white/5 px-2 py-1 md:px-4 md:py-2 rounded-2xl shadow-low dark:shadow-lowInverted">
      <img src="/images/png/socialsuite-wireframe-2.png" alt="Socialsuite industry page wireframe with tailored structure for sector-specific audiences" class="w-full h-auto rounded-lg shadow-sm">
    </div>
    <p class="text-xs uppercase tracking-widest opacity-50 text-center">Industry page wireframe — tailored structure for sector-specific audiences</p>
  </div>
</div>

---

## Visual Direction

With structure locked, I explored how the brand palette could shape the emotional tone of the site. The rebrand provided a rich color system — but how bold should we go?

I tested three directions:

<div class="not-prose grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
  <div class="cs-direction-card">
    <p class="text-xs uppercase tracking-widest text-normalLight dark:text-invertedLight mb-3 font-bold">Direction A</p>
    <h3 class="text-lg font-bold text-normal dark:text-inverted mb-3">Energetic & Bold</h3>
    <div class="rounded-xl overflow-hidden shadow-low dark:shadow-lowInverted mb-4">
      <img src="/images/png/socialsuite-hero-color-attempt-3.png" alt="Socialsuite hero Direction A — Warm & Bold with yellow-gold background" class="w-full h-auto">
    </div>
    <p class="text-sm text-normalLight dark:text-invertedLight mb-0">A yellow-gold background paired with teal accents created energy and optimism — but risked feeling too playful for enterprise audiences.</p>
  </div>
  <div class="cs-direction-card">
    <p class="text-xs uppercase tracking-widest text-normalLight dark:text-invertedLight mb-3 font-bold">Direction B</p>
    <h3 class="text-lg font-bold text-normal dark:text-inverted mb-3">Premium & Confident</h3>
    <div class="rounded-xl overflow-hidden shadow-low dark:shadow-lowInverted mb-4">
      <img src="/images/png/direction-b.png" alt="Socialsuite hero Direction B — Cool & Confident with deep teal gradient" class="w-full h-auto">
    </div>
    <p class="text-sm text-normalLight dark:text-invertedLight mb-0">A deep ocean-to-teal gradient anchored by the brand's circular motifs — bold and contemporary, with a sophistication that signals enterprise credibility without feeling cold.</p>
  </div>
  <div class="cs-direction-card">
    <p class="text-xs uppercase tracking-widest text-normalLight dark:text-invertedLight mb-3 font-bold">Direction C</p>
    <h3 class="text-lg font-bold text-normal dark:text-inverted mb-3">Clear & Minimal</h3>
    <div class="rounded-xl overflow-hidden shadow-low dark:shadow-lowInverted mb-4">
      <img src="/images/png/socialsuite-hero-color-attempt-1.png" alt="Socialsuite hero Direction C — Subtle & Premium with light background" class="w-full h-auto">
    </div>
    <p class="text-sm text-normalLight dark:text-invertedLight mb-0">A clean, light background let the product UI and brand shapes take centre stage — the most restrained option, prioritising clarity and content over colour.</p>
  </div>
</div>

### The Decision

<div class="not-prose cs-decision-callout my-10">
  <p class="text-base sm:text-lg text-normal dark:text-inverted mb-0">We landed on a variation of <strong>Direction B — the teal gradient</strong>. It struck the right balance: distinctive enough to feel fresh, professional enough for enterprise credibility, and flexible enough to work across both nonprofit and corporate audiences.</p>
</div>

---

## Visual Identity System

The rebrand gave me a sophisticated color palette and logo geometry. My job was to extend this into a complete digital design system — one that could flex between nonprofit warmth and enterprise credibility.

### Color System

**Primary Colors**

<div class="not-prose flex flex-wrap gap-8 tracking-tight my-8">
  <div class="flex flex-col items-center sm:items-start">
    <div class="w-16 h-16 rounded-xl shadow-low dark:shadow-lowInverted" style="background-color: #014682;"></div>
    <div class="mt-2 text-center sm:text-left">
      <p class="font-bold text-base mb-0 text-normal dark:text-inverted">Ocean</p>
      <span class="text-xs opacity-60 font-mono">#014682</span>
    </div>
  </div>
  <div class="flex flex-col items-center sm:items-start">
    <div class="w-16 h-16 rounded-xl shadow-low dark:shadow-lowInverted" style="background-color: #00a0aa;"></div>
    <div class="mt-2 text-center sm:text-left">
      <p class="font-bold text-base mb-0 text-normal dark:text-inverted">Lagoon</p>
      <span class="text-xs opacity-60 font-mono">#00a0aa</span>
    </div>
  </div>
</div>

**Secondary Palette**

<div class="not-prose flex flex-wrap gap-8 tracking-tight my-8">
  <div class="flex flex-col items-center sm:items-start">
    <div class="w-16 h-16 rounded-xl shadow-low dark:shadow-lowInverted" style="background-color: #00a0c8;"></div>
    <div class="mt-2 text-center sm:text-left">
      <p class="font-bold text-base mb-0 text-normal dark:text-inverted">Sky</p>
      <span class="text-xs opacity-60 font-mono">#00a0c8</span>
    </div>
  </div>
  <div class="flex flex-col items-center sm:items-start">
    <div class="w-16 h-16 rounded-xl shadow-low dark:shadow-lowInverted" style="background-color: #bcc896;"></div>
    <div class="mt-2 text-center sm:text-left">
      <p class="font-bold text-base mb-0 text-normal dark:text-inverted">Grass</p>
      <span class="text-xs opacity-60 font-mono">#bcc896</span>
    </div>
  </div>
  <div class="flex flex-col items-center sm:items-start">
    <div class="w-16 h-16 rounded-xl shadow-low dark:shadow-lowInverted" style="background-color: #00a096;"></div>
    <div class="mt-2 text-center sm:text-left">
      <p class="font-bold text-base mb-0 text-normal dark:text-inverted">Leaf</p>
      <span class="text-xs opacity-60 font-mono">#00a096</span>
    </div>
  </div>
</div>

**Deep Water Gradient**

<div class="not-prose w-full h-32 rounded-2xl my-6 shadow-medium dark:shadow-mediumInverted" style="background: linear-gradient(90deg, #014682 0%, #00a0aa 100%);"></div>

A sophisticated blue-to-teal gradient that added depth while maintaining accessibility — used strategically in hero sections to create visual interest without overwhelming content.

### Typography

<div class="not-prose w-full my-12 space-y-12">
  <div class="flex items-baseline gap-6 border-b border-normal dark:border-inverted pb-8">
    <span class="text-[10rem] md:text-[12rem] font-bold tracking-tighter text-normal dark:text-inverted leading-none" style="font-family: 'Roboto', sans-serif;">Aa</span>
    <div class="flex flex-col">
      <span class="text-3xl font-mono opacity-50">Roboto</span>
      <div class="flex gap-3 mt-4">
        <span class="text-xs uppercase tracking-widest opacity-40">Light 300</span>
        <span class="text-xs uppercase tracking-widest opacity-40">Regular 400</span>
        <span class="text-xs uppercase tracking-widest opacity-40">Bold 700</span>
      </div>
    </div>
  </div>
  <div class="space-y-4">
    <p class="text-xs uppercase tracking-[0.2em] opacity-40 font-bold mb-0">Characters & Numbers</p>
    <div class="text-4xl md:text-6xl tracking-[0.15em] text-normal dark:text-inverted leading-[1.4]" style="font-family: 'Roboto', sans-serif;">
      ABCDEFGHIJKLMN<br>
      OPQRSTUVWXYZ<br>
      abcdefghijklmn<br>
      opqrstuvwxyz<br>
      1234567890!@#$%
    </div>
  </div>
  <div class="max-w-3xl">
    <p class="text-xl leading-relaxed text-normalLight dark:text-invertedLight">
      I selected Roboto for its versatility and clean, modern aesthetic. Its excellent readability across screen sizes and weights made it ideal for both data-heavy ESG content and emotion-driven impact storytelling.
    </p>
  </div>
</div>

### Custom Illustration System

<div class="not-prose w-full my-12">
  <img src="/images/socialsuite-custom-illustration-system-1.webp" alt="Socialsuite Custom Illustration System" class="w-full h-auto rounded-2xl shadow-medium dark:shadow-mediumInverted">
</div>

> "Custom design over stock photos... visual identity to be driven by our mission and vision"

Rather than generic SaaS illustrations, I developed a distinctive visual system that merged authentic photography with geometric abstraction:

<div class="not-prose space-y-8 my-12">
  <img src="/images/socialsuite-custom-illustration-system-2.webp" alt="Socialsuite Illustration Approach 1" class="w-full h-auto rounded-2xl shadow-medium dark:shadow-mediumInverted">
  <img src="/images/socialsuite-custom-illustration-system-3.webp" alt="Socialsuite Illustration Approach 2" class="w-full h-auto rounded-2xl shadow-medium dark:shadow-mediumInverted">
</div>

### Photography & Circular Frames

Inspired by the client's logo geometry, I created a series of circular frames using concentric line work. These frames:

- **Echoed the logo** — maintaining brand consistency through circular motifs
- **Created visual hierarchy** — drawing attention to key imagery
- **Flexed across audiences** — warm and human for nonprofits, professional for enterprise

Photography was treated in black-and-white with subtle brand color overlays — real people in authentic moments, showing diverse industries from nonprofits to mining to manufacturing.

### Icon System

I implemented the Phosphor icon library in duotone style — aligning with the brand's modern aesthetic while providing a comprehensive library for use across the website, product, and marketing materials.

<div class="not-prose grid grid-cols-3 md:grid-cols-6 gap-4 my-10">
  <div class="aspect-square bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center p-4 shadow-low dark:shadow-lowInverted">
    <img src="/images/socialsuite-icon-usage-1.svg" alt="Socialsuite Icon 1" class="w-full h-full object-contain opacity-80">
  </div>
  <div class="aspect-square bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center p-4 shadow-low dark:shadow-lowInverted">
    <img src="/images/socialsuite-icon-usage-2.svg" alt="Socialsuite Icon 2" class="w-full h-full object-contain opacity-80">
  </div>
  <div class="aspect-square bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center p-4 shadow-low dark:shadow-lowInverted">
    <img src="/images/socialsuite-icon-usage-3.svg" alt="Socialsuite Icon 3" class="w-full h-full object-contain opacity-80">
  </div>
  <div class="aspect-square bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center p-4 shadow-low dark:shadow-lowInverted">
    <img src="/images/socialsuite-icon-usage-4.svg" alt="Socialsuite Icon 4" class="w-full h-full object-contain opacity-80">
  </div>
  <div class="aspect-square bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center p-4 shadow-low dark:shadow-lowInverted">
    <img src="/images/socialsuite-icon-usage-5.svg" alt="Socialsuite Icon 5" class="w-full h-full object-contain opacity-80">
  </div>
  <div class="aspect-square bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center p-4 shadow-low dark:shadow-lowInverted">
    <img src="/images/socialsuite-icon-usage-6.svg" alt="Socialsuite Icon 6" class="w-full h-full object-contain opacity-80">
  </div>
</div>

---

## Key Design Decisions

<div class="not-prose grid grid-cols-1 gap-6 my-10">
  <div class="standard-card">
    <p class="text-xs uppercase tracking-widest text-normalLight dark:text-invertedLight mb-3">Decision 01</p>
    <h3 class="text-xl font-bold text-normal dark:text-inverted mb-3">Expanding Logo Geometry Into a Design System</h3>
    <p class="text-base text-normalLight dark:text-invertedLight mb-0">The Socialsuite logo is built from overlapping circles — a visual metaphor for connection and impact. When the team decided against traditional illustrations, I saw an opportunity: expand this circular language into a complete visual system. Concentric circles, overlapping shapes, and circular photo frames became the vocabulary — creating brand cohesion without relying on generic SaaS illustrations.</p>
  </div>
  <div class="standard-card">
    <p class="text-xs uppercase tracking-widest text-normalLight dark:text-invertedLight mb-3">Decision 02</p>
    <h3 class="text-xl font-bold text-normal dark:text-inverted mb-3">Photography Treatment Over Illustration</h3>
    <p class="text-base text-normalLight dark:text-invertedLight mb-4">Rather than typical tech illustrations, I proposed black-and-white photography with subtle brand color overlays. This achieved three things:</p>
    <ul class="text-sm text-normalLight dark:text-invertedLight space-y-2 m-0 pl-5 list-disc">
      <li><span class="font-semibold text-normal dark:text-inverted">Authenticity</span> — real people, real impact</li>
      <li><span class="font-semibold text-normal dark:text-inverted">Flexibility</span> — works for both nonprofit and enterprise audiences</li>
      <li><span class="font-semibold text-normal dark:text-inverted">Sophistication</span> — elevates beyond typical SaaS aesthetics</li>
    </ul>
  </div>
  <div class="standard-card">
    <p class="text-xs uppercase tracking-widest text-normalLight dark:text-invertedLight mb-3">Decision 03</p>
    <h3 class="text-xl font-bold text-normal dark:text-inverted mb-3">Progressive Disclosure in Forms</h3>
    <p class="text-base text-normalLight dark:text-invertedLight mb-0">The original demo form asked for everything upfront — creating friction. I redesigned it with progressive disclosure: start simple, reveal complexity only when needed. This reduced perceived effort while maintaining lead quality for the sales team.</p>
  </div>
</div>

<div class="not-prose space-y-8 my-12">
  <img src="/images/socialsuite-circles-concept-1.webp" alt="Socialsuite Logo Geometry Applied" class="w-full h-auto rounded-2xl shadow-medium dark:shadow-mediumInverted">
  <img src="/images/socialsuite-circles-concept-2.webp" alt="Socialsuite Circular Design System" class="w-full h-auto rounded-2xl shadow-medium dark:shadow-mediumInverted">
</div>

---

## The Solution

A website that speaks two languages.

The final design creates distinct pathways for each audience while maintaining unified brand integrity. Nonprofits see mission-focused messaging and impact stories. Enterprise users see compliance frameworks and ROI data.

Same brand. Different conversations.

<div class="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
  <img src="/images/socialsuite-finished-product-1.webp" alt="Socialsuite Final Design — Desktop" class="w-full h-auto rounded-2xl shadow-medium dark:shadow-mediumInverted">
  <img src="/images/socialsuite-finished-product-2.webp" alt="Socialsuite Final Design — Pages" class="w-full h-auto rounded-2xl shadow-medium dark:shadow-mediumInverted">
</div>

---

## Outcome

The redesigned website launched in December 2022.

<div class="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-10">
  <div class="standard-card text-center py-8">
    <p class="text-4xl sm:text-5xl font-extrabold text-normal dark:text-inverted mb-2">165+</p>
    <p class="text-sm text-normalLight dark:text-invertedLight mb-0">Organizations served worldwide</p>
  </div>
  <div class="standard-card text-center py-8">
    <p class="text-4xl sm:text-5xl font-extrabold text-normal dark:text-inverted mb-2">2×</p>
    <p class="text-sm text-normalLight dark:text-invertedLight mb-0">Conversion rate target</p>
  </div>
</div>

<div class="not-prose standard-card my-10">
  <blockquote class="m-0 p-0 border-none">
    <p class="text-lg sm:text-xl italic text-normal dark:text-inverted leading-relaxed mb-4">"It was fantastic to work with Omar - from start to finish he was a delight to work with! Omar went above and beyond to help us deliver our project on time - going above and beyond the original scope of work to help us create an incredible website. His training on the CMS was fantastic, and I recommend Omar to anyone looking for assistance with a Webflow site!"</p>
    <footer class="flex flex-col">
      <span class="font-bold text-normal dark:text-inverted">Eleanor Carter</span>
      <span class="text-sm text-normalLight dark:text-invertedLight">Senior Content Strategist</span>
    </footer>
  </blockquote>
</div>

The visual system has since been adopted across Socialsuite's product interface, sales materials, and investor presentations.

---

## Reflection

This project reinforced something I believe deeply: the best design solutions often come from constraints.

When the team decided against traditional illustrations, it pushed me to expand the logo geometry into a full visual system — a solution that ended up being more distinctive and ownable than any illustration library could have been.

It also taught me the value of designing for clarity over cleverness. Two audiences, two journeys, one cohesive brand. That's the balance enterprise software demands.
```

### Step 2: CSS for case study components (input.css)
Add inside `@layer components`:

```css
  .cs-direction-card {
    @apply border border-normal rounded-2xl flex flex-col p-5 shadow-low dark:shadow-lowInverted dark:border-inverted;
  }

  .cs-decision-callout {
    @apply border-l-4 rounded-lg px-6 py-5;
    border-color: #00a0aa;
    background: rgba(0, 160, 170, 0.05);
  }

  html.dark .cs-decision-callout {
    background: rgba(0, 160, 170, 0.1);
  }
```

### Step 3: Case study layout with "Next" button
Replace `src/_includes/layouts/case-study-layout.liquid`:

```html
---
layout: "/layouts/layout.liquid"
---
<header class="pt-24 pb-4 px-[5%] mx-auto">
  <div class="container mx-auto max-w-4xl">
    <div class="mb-12">
      <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-3 text-normal dark:text-inverted">{{ title }}</h1>
      {% if header_subtitle %}
        <p class="text-xl sm:text-2xl font-medium text-normalLight dark:text-invertedLight mb-4">{{ header_subtitle }}</p>
      {% endif %}
      {% if header-overview %}
        <p class="text-base sm:text-xl text-normalLight font-normal dark:text-invertedLight max-w-[40rem] leading-relaxed mb-0">{{ header-overview }}</p>
      {% endif %}
    </div>

    {% if header_meta %}
      <div class="cs-meta-bar grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-12 py-6 border-y border-normal dark:border-inverted">
        {% for item in header_meta %}
          <div>
            <p class="text-xs uppercase tracking-widest text-normalLight dark:text-invertedLight mb-1">{{ item.label }}</p>
            <p class="text-base font-semibold text-normal dark:text-inverted mb-0">{{ item.value }}</p>
          </div>
        {% endfor %}
      </div>
    {% endif %}

    {% if header-img %}
      <div class="w-full rounded-2xl overflow-hidden shadow-medium dark:shadow-mediumInverted">
        <img
          src="{{ header-img }}"
          alt="{{ title }} Hero Image"
          {% if header-img-width and header-img-height %}
            width="{{ header-img-width }}" height="{{ header-img-height }}"
          {% endif %}
          class="w-full h-auto max-h-[800px] object-cover object-top"
        >
      </div>
    {% endif %}
  </div>
</header>
<section class="pt-12 pb-24 px-[5%]">
  <div class="container mx-auto max-w-4xl">
    <article class="prose case-study-prose mx-auto max-w-4xl">
      {{ content }}
    </article>

    {% assign next_cs = collections.caseStudies | nextCaseStudy: page.url %}
    {% if next_cs %}
      <div class="w-full mt-16 pt-12 border-t border-normal dark:border-inverted flex justify-end">
        <a
          href="{{ next_cs.url | url }}"
          class="case-study-next-link group ml-auto inline-flex items-center gap-2 rounded-full px-6 py-3 text-primary dark:text-primaryInverted font-semibold no-underline hover:text-primary dark:hover:text-primaryInverted transition-colors duration-300"
        >
          <span>Next Case Study: {{ next_cs.data.title }}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 sm:w-6 sm:h-6 fill-current shrink-0 transition-transform duration-200 group-hover:translate-x-1"
            viewBox="0 0 256 256"
            aria-hidden="true"
          >
            <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
          </svg>
        </a>
      </div>
    {% endif %}
  </div>
</section>
```

### Step 4: Add nextCaseStudy filter (.eleventy.js)
Add this filter to your Eleventy config:

```js
  eleventyConfig.addFilter("nextCaseStudy", function (caseStudies, currentUrl) {
    if (!Array.isArray(caseStudies) || !currentUrl) return null;
    const idx = caseStudies.findIndex((item) => item.url === currentUrl);
    if (idx === -1 || idx >= caseStudies.length - 1) return null;
    return caseStudies[idx + 1];
  });
```

### Step 5: SocialSuite images
Copy all SocialSuite-related images from `migration-assets/images/` to `src/images/`:
- `socialsuite-icon-usage-1.svg` through `-6.svg`
- `png/socialsuite-cover-updated.png`
- `png/socialsuite-wireframe-1.png`, `png/socialsuite-wireframe-2.png`
- `png/socialsuite-hero-color-attempt-1.png`, `-3.png`
- `png/direction-b.png`
- `png/socialsuite-logo.webp`, `png/social-suite-logo.png`
- Plus all `socialsuite-*.webp` files from `migration-assets/images/`

---

## 7. Magnetic Effect for Cards and Buttons

**Files affected:** `src/scripts/cursor.js`, `src/styles/input.css`

### Step 1: Magnetic effect function (cursor.js)
Add this inside the DOMContentLoaded listener (needs access to the `lerp` function from the cursor system):

```js
    const addMagneticEffect = (selector, strength = 0.4) => {
        const magneticElements = document.querySelectorAll(selector);
        magneticElements.forEach(el => {
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let isHovering = false;

        const lerpMagnetic = () => {
            if (!isHovering && Math.abs(currentX) < 0.01 && Math.abs(currentY) < 0.01) {
                el.style.transform = 'translate3d(0,0,0)';
                return;
            }

            currentX = lerp(currentX, targetX, 0.1);
            currentY = lerp(currentY, targetY, 0.1);

            el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            requestAnimationFrame(lerpMagnetic);
        };

        el.addEventListener('mouseenter', () => {
            isHovering = true;
            lerpMagnetic();
        });

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            targetX = (e.clientX - rect.left - rect.width / 2) * strength;
            targetY = (e.clientY - rect.top - rect.height / 2) * strength;
        });

        el.addEventListener('mouseleave', () => {
            isHovering = false;
            targetX = 0;
            targetY = 0;
        });
    });
    };

    addMagneticEffect('.menu_link', 0.4);
    addMagneticEffect('.footer-social-link', 0.28);
```

### Step 2: Case study card clip-path fill (cursor.js)
Add inside the DOMContentLoaded listener:

```js
    document.querySelectorAll('.case-study-cursor-card').forEach((card) => {
        card.addEventListener('mouseenter', (e) => {
            stripCursorState.forEach(cls => {
                cursorDot.classList.remove(cls);
                cursor.classList.remove(cls);
            });
            clearTextCursorMetrics();
            cursorDot.classList.add('cursor-dot-fade');

            const rect = card.getBoundingClientRect();
            card.style.setProperty('--clip-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--clip-y', `${e.clientY - rect.top}px`);
            card.classList.add('card-glow-active');
        });
        card.addEventListener('mouseleave', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--clip-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--clip-y', `${e.clientY - rect.top}px`);
            cursorDot.classList.remove('cursor-dot-fade');
            card.classList.remove('card-glow-active');
        });
    });
```

### Step 3: CSS for card glow and fill effects (input.css)
Add inside `@layer components`:

```css
  .case-study-cursor-card {
    --clip-x: 50%;
    --clip-y: 50%;
  }

  .case-study-cursor-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: rgba(99, 99, 99, 0.08);
    clip-path: circle(0% at var(--clip-x) var(--clip-y));
    transition: clip-path 420ms cubic-bezier(0.23, 1, 0.32, 1);
    pointer-events: none;
    z-index: 1;
  }

  .case-study-cursor-card.card-glow-active::before {
    clip-path: circle(125% at var(--clip-x) var(--clip-y));
  }

  html.dark .case-study-cursor-card::before {
    background: rgba(176, 176, 176, 0.1);
  }

  .case-study-cursor-card .case-study-media,
  .case-study-cursor-card .case-study-content {
    @apply relative z-[2];
  }

  .footer-cta-cursor-link {
    isolation: isolate;
    --clip-x: 50%;
    --clip-y: 50%;
  }

  .footer-cta-cursor-link > * {
    @apply relative z-[1];
  }

  .footer-cta-cursor-link::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: rgba(99, 99, 99, 0.08);
    clip-path: circle(0% at var(--clip-x) var(--clip-y));
    transition: clip-path 420ms cubic-bezier(0.23, 1, 0.32, 1);
    pointer-events: none;
    z-index: 0;
  }

  .footer-cta-cursor-link.cta-fill-active::before {
    clip-path: circle(150% at var(--clip-x) var(--clip-y));
  }

  html.dark .footer-cta-cursor-link::before {
    background: rgba(176, 176, 176, 0.1);
  }

  .case-study-next-link {
    isolation: isolate;
    --clip-x: 50%;
    --clip-y: 50%;
  }

  .case-study-next-link > * {
    @apply relative z-[1];
  }

  .case-study-next-link::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: rgba(99, 99, 99, 0.08);
    clip-path: circle(0% at var(--clip-x) var(--clip-y));
    transition: clip-path 420ms cubic-bezier(0.23, 1, 0.32, 1);
    pointer-events: none;
    z-index: 0;
  }

  .case-study-next-link.cta-fill-active::before {
    clip-path: circle(150% at var(--clip-x) var(--clip-y));
  }

  html.dark .case-study-next-link::before {
    background: rgba(176, 176, 176, 0.1);
  }
```

---

## 8. Custom Cursor System with Transitions

**Files affected:** `src/scripts/cursor.js`, `src/styles/input.css`, `src/_includes/layouts/layout.liquid`

### Step 1: Cursor HTML (layout.liquid)
Add before `</body>`:

```html
    <!-- Custom Cursor -->
    <div class="cursor-wrapper">
      <div class="cursor">
        <div class="cursor_dot"></div>
      </div>
    </div>
```

### Step 2: Full cursor.js
Create `src/scripts/cursor.js` with the complete cursor system:

```js
document.addEventListener('DOMContentLoaded', () => {
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!supportsHover) return;

    const cursor = document.querySelector('.cursor-wrapper');
    const cursorDot = document.querySelector('.cursor_dot');

    if (!cursor || !cursorDot) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (cursorX === 0 && cursorY === 0) {
            cursorX = mouseX;
            cursorY = mouseY;
        }
    });

    const animate = () => {
        if (!isRunning) return;
        cursorX = lerp(cursorX, mouseX, 0.2);
        cursorY = lerp(cursorY, mouseY, 0.2);

        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

        animationFrameId = requestAnimationFrame(animate);
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animationFrameId = null;
    let isRunning = false;

    function start() {
        if (isRunning || prefersReducedMotion.matches) return;
        isRunning = true;
        animationFrameId = requestAnimationFrame(animate);
    }

    function stop() {
        if (!isRunning) return;
        isRunning = false;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    function syncAnimationState() {
        if (document.hidden || prefersReducedMotion.matches) {
            stop();
            return;
        }
        start();
    }

    syncAnimationState();
    document.addEventListener('visibilitychange', syncAnimationState);
    prefersReducedMotion.addEventListener('change', syncAnimationState);

    const applyTextCursorMetrics = (el) => {
        const cs = getComputedStyle(el);
        cursorDot.style.setProperty('--cursor-text-fg', cs.color);

        const fontSize = parseFloat(cs.fontSize);
        if (!Number.isFinite(fontSize) || fontSize <= 0) return;

        const lhRaw = cs.lineHeight;
        let heightPx;
        if (lhRaw === 'normal') {
            heightPx = fontSize * 1.25;
        } else {
            const lhNum = parseFloat(lhRaw);
            heightPx = Number.isFinite(lhNum) ? lhNum * 0.9 : fontSize * 1.25;
        }
        heightPx = Math.round(Math.max(16, Math.min(heightPx, fontSize * 1.4)));

        const widthPx = Math.max(2, Math.round(fontSize * 0.085));
        cursorDot.style.setProperty('--cursor-text-w', `${widthPx}px`);
        cursorDot.style.setProperty('--cursor-text-h', `${heightPx}px`);
        cursorDot.style.setProperty('--cursor-text-fg', cs.color);
    };

    const clearTextCursorMetrics = () => {
        cursorDot.style.removeProperty('--cursor-text-w');
        cursorDot.style.removeProperty('--cursor-text-h');
        cursorDot.style.removeProperty('--cursor-text-fg');
    };

    const addHoverEffect = (selector, classesToAdd, classesToRemove = [], options = {}) => {
        const { syncTextCursorMetrics, excludeWithin } = options;
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (excludeWithin && el.closest(excludeWithin)) return;
            el.addEventListener('mouseenter', () => {
                if (syncTextCursorMetrics) applyTextCursorMetrics(el);
                classesToRemove.forEach(cls => {
                    cursorDot.classList.remove(cls);
                    if (cls.includes('top') || cls.includes('behind')) cursor.classList.remove(cls);
                });
                classesToAdd.forEach(cls => {
                    if (cls.includes('top') || cls.includes('behind')) cursor.classList.add(cls);
                    else cursorDot.classList.add(cls);
                });
            });
            el.addEventListener('mouseleave', () => {
                classesToAdd.forEach(cls => {
                    cursor.classList.remove(cls);
                    cursorDot.classList.remove(cls);
                });
                if (syncTextCursorMetrics) clearTextCursorMetrics();
            });
        });
    };

    const cursorDotResetClasses = [
        'scale-cursor-up',
        'scale-cursor-up-small',
        'scale-cursor-up-footer',
        'white-cursor',
        'black-cursor',
        'cursor-text',
        'brush-cursor',
        'pixel-cursor',
        'cursor-dot-fade',
    ];
    const stripCursorState = [...cursorDotResetClasses, 'cursor-top', 'cursor-behind'];

    addHoverEffect('.menu_link', ['scale-cursor-up'], stripCursorState);
    addHoverEffect('.button', ['white-cursor', 'cursor-top'], stripCursorState);
    addHoverEffect('#back-to-top', ['cursor-dot-fade'], stripCursorState);
    addHoverEffect('.logo, .theme-toggle', ['cursor-dot-fade'], stripCursorState);
    addHoverEffect('.footer-social-link', ['scale-cursor-up-footer', 'cursor-behind'], stripCursorState);
    addHoverEffect('.list-parent, .service-card', ['scale-cursor-up-small', 'black-cursor'], stripCursorState);
    addHoverEffect('.home-heading, .js-colorful-heading', ['scale-cursor-up-small', 'cursor-top'], stripCursorState);
    addHoverEffect('#portraitCircle', ['scale-cursor-up-small', 'cursor-top'], stripCursorState);

    addHoverEffect(
        'p:not(.home-heading), h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, .prose p, .prose li, .prose blockquote',
        ['cursor-text'],
        stripCursorState,
        { syncTextCursorMetrics: true, excludeWithin: '.case-study-cursor-card' }
    );

    // --- Magnetic Effect (see section 7) ---
    // --- Case study card fill (see section 7) ---
    // --- Next case study link fill ---

    document.querySelectorAll('.case-study-next-link').forEach((link) => {
        link.addEventListener('mouseenter', (e) => {
            stripCursorState.forEach(cls => {
                cursorDot.classList.remove(cls);
                cursor.classList.remove(cls);
            });
            clearTextCursorMetrics();
            cursorDot.classList.add('cursor-dot-fade');

            const rect = link.getBoundingClientRect();
            link.style.setProperty('--clip-x', `${e.clientX - rect.left}px`);
            link.style.setProperty('--clip-y', `${e.clientY - rect.top}px`);
            link.classList.add('cta-fill-active');
        });
        link.addEventListener('mouseleave', (e) => {
            const rect = link.getBoundingClientRect();
            link.style.setProperty('--clip-x', `${e.clientX - rect.left}px`);
            link.style.setProperty('--clip-y', `${e.clientY - rect.top}px`);
            cursorDot.classList.remove('cursor-dot-fade');
            link.classList.remove('cta-fill-active');
        });
    });

    document.querySelectorAll('.footer-cta-cursor-link').forEach((link) => {
        link.addEventListener('mouseenter', (e) => {
            stripCursorState.forEach(cls => {
                cursorDot.classList.remove(cls);
                cursor.classList.remove(cls);
            });
            clearTextCursorMetrics();
            cursorDot.classList.add('cursor-dot-fade');

            const rect = link.getBoundingClientRect();
            link.style.setProperty('--clip-x', `${e.clientX - rect.left}px`);
            link.style.setProperty('--clip-y', `${e.clientY - rect.top}px`);
            link.classList.add('cta-fill-active');
        });
        link.addEventListener('mouseleave', (e) => {
            const rect = link.getBoundingClientRect();
            link.style.setProperty('--clip-x', `${e.clientX - rect.left}px`);
            link.style.setProperty('--clip-y', `${e.clientY - rect.top}px`);
            cursorDot.classList.remove('cursor-dot-fade');
            link.classList.remove('cta-fill-active');
        });
    });
});
```

### Step 3: Cursor CSS (input.css)
Add inside `@layer components`:

```css
  .cursor-wrapper {
    @apply fixed top-0 left-0 w-5 h-5 pointer-events-none z-[30] flex items-center justify-center translate-x-0 translate-y-0 will-change-transform transition-[z-index] duration-0;
  }

  .cursor-top {
    @apply z-[100] !important;
  }

  .cursor-behind {
    @apply z-[10] !important;
  }

  .cursor_dot {
    @apply w-[1.4rem] h-[1.4rem] bg-primary rounded-full dark:bg-primaryInverted;
    opacity: 0.8;
    transition: background-color 300ms ease-out, opacity 300ms ease-out, transform 300ms ease-out;
  }

  .scale-cursor-up {
    @apply scale-[4];
    opacity: 1;
  }

  .scale-cursor-up-small {
    @apply scale-[1.5];
    opacity: 1;
  }

  .scale-cursor-up-footer {
    @apply scale-[2.2];
    opacity: 1;
  }

  .cursor-dot-fade {
    opacity: 0 !important;
    transition: opacity 220ms ease-out !important;
  }

  .black-cursor {
    @apply bg-inverted opacity-40 dark:bg-primaryInverted;
  }

  .white-cursor {
    @apply bg-white !important;
    opacity: 0.5 !important;
  }
```

Add outside `@layer` blocks:

```css
@media (max-width: 1024px) {
  .cursor-wrapper {
    @apply hidden;
  }
}
```

### Step 4: Load cursor.js (layout.liquid)
Add before `</body>`:

```html
    <script src="/scripts/cursor.js" defer></script>
```

---

## 9. Omar Almasry to O. Logo Animation

**Files affected:** `src/_includes/partials/navbar.liquid`, `src/scripts/main.js`, `src/styles/input.css`

### Step 1: Logo HTML (navbar.liquid)
The logo markup uses nested spans for the morphing effect:

```html
    <a href="{{ '/' | url }}" class="logo logo-nav flex shrink-0 items-center font-bold no-underline group">
      <span class="logo-morph text-xl sm:text-2xl text-normalLight dark:text-invertedLight group-hover:text-primary dark:group-hover:text-primaryInverted transition-colors duration-300"
        ><span class="logo-letter-o">O</span
        ><span class="logo-rest-clip"><span class="logo-rest">mar Almasry</span></span
        ><span class="logo-dot text-primary dark:text-primaryInverted">.</span></span
      >
    </a>
```

**Important:** The `><span` placement (no whitespace between closing `>` and opening `<`) is intentional to avoid rendering gaps.

### Step 2: Scroll handler (main.js)
Add to main.js:

```js
const mainNav = document.getElementById('mainNav');
let lastScrollY = window.scrollY;
let navTicking = false;

function handleNavScroll() {
  if (!navTicking) {
    requestAnimationFrame(() => {
      if (mainNav) {
        const currentScrollY = Math.max(window.scrollY, 0);

        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          mainNav.classList.add('nav-logo-compact');
        } else if (currentScrollY < lastScrollY || currentScrollY <= 12) {
          mainNav.classList.remove('nav-logo-compact');
        }

        if (window.innerWidth < 640) {
          if (currentScrollY > lastScrollY && currentScrollY > 80) {
            mainNav.classList.add('nav-hidden');
          } else {
            mainNav.classList.remove('nav-hidden');
          }
        } else {
          mainNav.classList.remove('nav-hidden');
        }

        lastScrollY = currentScrollY;
      }
      navTicking = false;
    });
    navTicking = true;
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
window.addEventListener('resize', () => {
  if (mainNav && window.innerWidth >= 640) {
    mainNav.classList.remove('nav-hidden');
  }
}, { passive: true });
```

### Step 3: CSS for logo morphing (input.css)
Add inside `@layer components`:

```css
  .logo-nav {
    min-width: 2.5rem;
  }

  .logo-nav .logo-morph {
    display: inline-flex;
    align-items: baseline;
    white-space: nowrap;
  }

  .logo-nav .logo-letter-o {
    display: inline-block;
    transform-origin: left center;
    transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1), font-weight 600ms cubic-bezier(0.23, 1, 0.32, 1);
  }

  .logo-nav .logo-rest-clip {
    display: inline-block;
    overflow: hidden;
    max-width: 12rem;
    opacity: 1;
    transition: max-width 350ms cubic-bezier(0.23, 1, 0.32, 1), opacity 120ms ease;
    vertical-align: baseline;
  }

  .logo-nav .logo-rest {
    display: inline-block;
    white-space: nowrap;
  }

  .logo-nav .logo-dot {
    display: inline-block;
    opacity: 0;
    transform: translateX(6px) scale(1);
    transform-origin: left center;
    transition: opacity 350ms ease, transform 450ms cubic-bezier(0.23, 1, 0.32, 1);
  }

  #mainNav.nav-logo-compact .logo-rest-clip {
    max-width: 0;
    opacity: 0;
  }

  #mainNav.nav-logo-compact .logo-letter-o {
    transform: scale(2);
    font-weight: 400;
  }

  #mainNav.nav-logo-compact .logo-dot {
    opacity: 1;
    transform: translateX(0.55em) scale(2);
    font-weight: 400;
  }

  #mainNav {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 300ms ease-out, transform 300ms ease-out;
    will-change: opacity, transform;
  }

  #mainNav.nav-hidden {
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
  }
```

---

## 10. Remove "Designed with Eleventy" from Footer

**Files affected:** `src/_includes/partials/footer.liquid`

If your old footer contains a line like "Designed with Eleventy and TailwindCSS" or "Built with Eleventy," simply delete that line/element. The current version's footer does not include it.

---

## 11. Remove "Designer of Webz / Maker of Things" from Homepage

**Files affected:** `src/index.html`

If your old homepage contains a section with "Designer of Webz, Maker of Things" or similar text, remove that entire section. The current version does not include it.

---

## 12. Page Titles

**Files affected:** `src/index.html`, `src/about.html`, `src/case-studies.html`, `src/_includes/layouts/layout.liquid`

### Layout default title (layout.liquid)
```html
    <title>{{ title | default: 'Omar Almasry | Digital Designer & Webflow Specialist' }}</title>
```

### Homepage front matter (index.html)
```yaml
---
layout: layouts/layout.liquid
title: Omar Almasry | Brand & Digital Designer
description: Digital designer helping agencies and in-house teams build accessible, high-performance websites.
---
```

### About page front matter (about.html)
```yaml
---
layout: /layouts/layout.liquid
title: About | Digital Designer
description: Learn about Omar Almasry, a digital designer from Egypt now based in Toronto. Working with agencies and in-house teams to build accessible, high-performance digital experiences.
---
```

### Case Studies page front matter (case-studies.html)
```yaml
---
layout: layouts/layout.liquid
title: Case Studies | Webflow & Digital Design Portfolio
description: Case studies showcasing Webflow migrations, accessibility implementations, and performance optimizations for enterprise clients including Dubai Holding, Emplifi, and more.
---
```

### OG/Twitter meta tags (layout.liquid)
```html
    <meta property="og:title" content="{{ title | default: 'Omar Almasry | Digital Designer & Webflow Specialist' }}">
    <meta property="og:description" content="{{ description | default: 'Digital designer specializing in Webflow, accessibility, and performance optimization. Building scalable websites for enterprise clients and agencies.' }}">
    <meta property="og:image" content="{{ og_image | default: '/images/png/og.png' }}">
    <meta property="og:url" content="{{ page_url | default: 'https://omaralmasry.com' }}{{ page.url }}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Omar Almasry - Digital Designer">
    <meta property="og:locale" content="en_US">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{{ title | default: 'Omar Almasry | Digital Designer & Webflow Specialist' }}">
    <meta name="twitter:description" content="{{ description | default: 'Digital designer specializing in Webflow, accessibility, and performance optimization. Building scalable websites for enterprise clients and agencies.' }}">
    <meta name="twitter:image" content="{{ og_image | default: '/images/png/og.png' }}">
```

---

## 13. About Page Copy and Card Structure

**Files affected:** `src/about.html`

Replace the about page content with the full current version. The page uses the `page-header` partial and a `section-standard` partial with captured content.

### Step 1: Page header partial
Ensure `src/_includes/partials/page-header.liquid` exists:

```html
<section class="pt-24 px-[5%] {{ sectionPaddingBottom | default: 'pb-12' }}">
  <div class="max-w-4xl mx-auto">
    <h1
      id="{{ mainTitleId | default: 'pageTitle' }}"
      class="{{ titleMarginBottom | default: 'mb-4' }}{% unless disableColorfulHeading %} js-colorful-heading{% endunless %} {{ mainTitleClass | default: '' }}"
    >
      {{ headerTitle | default: 'Lorem ipsum' }}
    </h1>
    {% if headerSubtitle %}
      <p class="text-xl sm:text-2xl text-normalLight {{ headerSubtitleMaxWidth | default: 'max-w-2xl' }} ml-0 leading-tight dark:text-invertedLight">
        {{
          headerSubtitle
          | default: 'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat.'
        }}
      </p>
    {% endif %}
  </div>
</section>
```

### Step 2: Full about.html
```html
---
layout: /layouts/layout.liquid
title: About | Digital Designer
description: Learn about Omar Almasry, a digital designer from Egypt now based in Toronto. Working with agencies and in-house teams to build accessible, high-performance digital experiences.
---

{%- render 'partials/page-header',
  headerTitle: 'About',
  headerSubtitle: 'Who I am, what I do, and how I work with teams around the world.',
  headerSubtitleMaxWidth: 'max-w-lg',
  mainTitleClass: 'text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl',
  mainTitleId: 'aboutTitle',
  disableColorfulHeading: true,
  titleMarginBottom: 'mb-3',
  sectionPaddingBottom: 'pb-6'
-%}

{% capture aboutContent %}
<div class="space-y-4 mb-16">
  <p>I'm Omar Almasry — a digital designer specializing in brand identity and digital experiences.</p>
  <p>I work with agencies and in-house marketing teams to create brands and websites that connect with people and actually work — accessible, purposeful, and built to last.</p>
  <p>My path to design started with architecture. Five years of studying how structure, aesthetics, and function come together taught me to think in systems. Eventually I realized I didn't want to wait decades to see my ideas built — on the web, you can design, build, and ship in weeks.</p>
  <p>I was born and raised in Egypt, immigrated to Canada, and have worked with clients across 11 countries. I'm fluent in English, Arabic, and French — and I bring that global perspective to everything I design.</p>
  <p>When I'm not designing, I'm probably walking by the lake with a coffee, building Lego with my daughter, or falling deeper into a book. I also care deeply about accessibility — not as an afterthought, but as a foundation. I hold a CPACC certification and believe the web should work for everyone.</p>
</div>

<div class="flex flex-col gap-4 sm:grid grid-cols-6 gap-4">

  <!-- CPACC Certified Card -->
  <div class="standard-card col-span-4">
    <h3 class="text-base sm:text-lg font-bold">CPACC Certified</h3>
    <p class="text-sm sm:text-base font-light text-normalLight dark:text-invertedLight mb-4">Certified Professional in Accessibility Core Competencies (IAAP) — committed to designing inclusive digital experiences that work for everyone.</p>
    <div class="about-credentials-stack flex w-full flex-col gap-8 pt-2">
      <div class="about-credentials-item flex w-full max-w-40 sm:max-w-full justify-start px-0 sm:px-0">
        <div data-iframe-width="150" data-iframe-height="200" data-share-badge-id="e2d4a2de-f74b-4c74-b4ac-2fe682fab1ef" data-share-badge-host="https://www.credly.com"></div>
        <script type="text/javascript" async src="https://cdn.credly.com/assets/utilities/embed.js"></script>
      </div>
    </div>
  </div>

  <!-- Webflow Certified Partner Card -->
  <div class="standard-card col-span-2">
    <h3 class="text-base sm:text-lg font-bold">Webflow Certified Partner</h3>
    <p class="text-sm sm:text-base font-light mb-4 text-normalLight dark:text-invertedLight">Recognized by Webflow as a trusted professional for building high-quality websites.</p>
    <div class="about-credentials-stack flex w-full flex-col items-start gap-6 pt-2">
      <a href="https://webflow.com/@omar-almasrys-workspace" class="about-credentials-item block w-full max-w-[8.5rem] sm:max-w-36 px-0 sm:px-0" target="_blank" rel="noopener noreferrer">
        <picture>
          <source srcset="/images/webflow-certified-partner.webp" type="image/webp">
          <img src="/images/webflow-certified-partner.png" width="480" height="97" loading="lazy" class="w-full h-auto" aria-label="Webflow Certified Partner Label">
        </picture>
      </a>
    </div>
  </div>

  <!-- Global Experience Card -->
  <div class="standard-card col-span-6 justify-center">
    <h3 class="text-base sm:text-lg font-bold">Global Experience</h3>
    <p class="text-sm sm:text-base font-light mb-4 text-normalLight dark:text-invertedLight max-w-2xl">I've had the pleasure of working with clients from 11 different countries on 5 continents.</p>
    <div class="globe-embed w-full aspect-square max-w-[350px] sm:max-w-[450px] mx-auto"></div>
  </div>

  <!-- Location Card -->
  <div class="standard-card col-span-2">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 fill-current mb-4 text-primary dark:text-primaryInverted shrink-0" viewBox="0 0 256 256" aria-hidden="true">
      <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"></path>
    </svg>
    <h3 class="text-base sm:text-lg font-bold mb-2">Current Location</h3>
    <p class="text-sm sm:text-base font-light text-normalLight dark:text-invertedLight">Toronto, ON, Canada</p>
  </div>

  <!-- Time Card -->
  <div class="standard-card col-span-2">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 fill-current mb-4 text-primary dark:text-primaryInverted shrink-0" viewBox="0 0 256 256" aria-hidden="true">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path>
    </svg>
    <h3 class="text-base sm:text-lg font-bold mb-2">Local Time</h3>
    <div class="local-time font-light flex items-center text-sm sm:text-base text-normalLight dark:text-invertedLight">
      <span id="hours" class="time-part w-[2ch] text-center">14</span>
      <span class="colon mx-0.5">:</span>
      <span id="minutes" class="time-part w-[2ch] text-center">34</span>
      <span class="colon mx-0.5">:</span>
      <span id="seconds" class="time-part w-[2ch] text-center">33</span>
      <span id="timezone" class="ml-1.5 whitespace-nowrap">(EST)</span>
    </div>
  </div>

  <!-- Languages Card -->
  <div class="standard-card col-span-2">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 fill-current mb-4 text-primary dark:text-primaryInverted shrink-0" viewBox="0 0 256 256" aria-hidden="true">
      <path d="M247.15,212.42l-56-112a8,8,0,0,0-14.31,0l-21.71,43.43A88,88,0,0,1,108,126.93,103.65,103.65,0,0,0,135.69,64H160a8,8,0,0,0,0-16H104V32a8,8,0,0,0-16,0V48H32a8,8,0,0,0,0,16h87.63A87.76,87.76,0,0,1,96,116.35a87.74,87.74,0,0,1-19-31,8,8,0,1,0-15.08,5.34A103.63,103.63,0,0,0,84,127a87.55,87.55,0,0,1-52,17,8,8,0,0,0,0,16,103.46,103.46,0,0,0,64-22.08,104.18,104.18,0,0,0,51.44,21.31l-26.6,53.19a8,8,0,0,0,14.31,7.16L148.94,192h70.11l13.79,27.58A8,8,0,0,0,240,224a8,8,0,0,0,7.15-11.58ZM156.94,176,184,121.89,211.05,176Z"></path>
    </svg>
    <h3 class="text-base sm:text-lg font-bold mb-2">Languages Spoken</h3>
    <p class="text-sm sm:text-base font-light text-normalLight dark:text-invertedLight mb-1">English (EN)</p>
    <p class="text-sm sm:text-base font-light text-normalLight dark:text-invertedLight mb-1">Arabic (AR)</p>
    <p class="text-sm sm:text-base font-light text-normalLight dark:text-invertedLight">French (FR)</p>
  </div>

</div>
{% endcapture %}

{%- render 'partials/section-standard',
  content: aboutContent,
  customClasses: 'pt-4'
-%}


<script>
  window.addEventListener('load', () => {
      function updateTime() {
          const now = new Date();
          const options = { timeZone: 'America/Toronto', hour12: false };
          const timeString = now.toLocaleTimeString('en-US', options);
          const [hours, minutes, seconds] = timeString.split(':');

          const timeZoneString = now.toLocaleDateString('en-US', {
              timeZone: 'America/Toronto',
              timeZoneName: 'short'
          });
          const timeZoneAbbrev = timeZoneString.split(', ')[1];

          document.getElementById('hours').textContent = hours.padStart(2, '0');
          document.getElementById('minutes').textContent = minutes.padStart(2, '0');
          document.getElementById('seconds').textContent = seconds.padStart(2, '0');
          document.getElementById('timezone').textContent = `(${timeZoneAbbrev})`;
      }
  
      setInterval(updateTime, 1000);
      updateTime();
  
      const globeContainer = document.querySelector('.globe-embed');
      if (globeContainer) {
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
          const isSmallScreen = window.matchMedia('(max-width: 640px)').matches;
          let globeInitialized = false;
          let isVisible = false;
          let isAnimating = false;
          let animationFrameId = null;
          let scene;
          let camera;
          let renderer;
          let globe;
          let controls;
          let isUserInteracting = false;
          let autoRotateTimeout;

          const startAnimation = () => {
              if (isAnimating || !renderer || document.hidden || prefersReducedMotion.matches || !isVisible) return;
              isAnimating = true;
              animate();
          };

          const stopAnimation = () => {
              if (!isAnimating) return;
              isAnimating = false;
              if (animationFrameId) {
                  cancelAnimationFrame(animationFrameId);
                  animationFrameId = null;
              }
          };

          const handleVisibilityChange = () => {
              if (document.hidden || prefersReducedMotion.matches || !isVisible) {
                  stopAnimation();
                  return;
              }
              startAnimation();
          };

          const loadGlobeScripts = () => {
              if (globeInitialized) {
                  startAnimation();
                  return;
              }
              globeInitialized = true;
              const script = document.createElement('script');
              script.src = 'https://cdn.jsdelivr.net/npm/three@0.138.1/build/three.min.js';
              script.defer = true;
              script.onload = () => {
                  const orbitScript = document.createElement('script');
                  orbitScript.src = 'https://cdn.jsdelivr.net/npm/three@0.138.1/examples/js/controls/OrbitControls.js';
                  orbitScript.defer = true;
                  orbitScript.onload = initGlobe;
                  document.body.appendChild(orbitScript);
              };
              document.body.appendChild(script);
          };

          const initGlobe = () => {
              scene = new THREE.Scene();
              scene.background = null;

              camera = new THREE.PerspectiveCamera(75, globeContainer.clientWidth / globeContainer.clientHeight, 0.1, 1000);
              renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

              renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
              renderer.setPixelRatio(isSmallScreen ? 1 : Math.min(window.devicePixelRatio, 2));
              globeContainer.appendChild(renderer.domElement);

              const texture = new THREE.TextureLoader().load('/images/globe-texture.webp');
              texture.minFilter = THREE.LinearFilter;
              texture.magFilter = THREE.LinearFilter;

              globe = new THREE.Mesh(
                  new THREE.SphereGeometry(5, 64, 64),
                  new THREE.MeshStandardMaterial({
                      map: texture,
                      roughness: 0.8,
                      metalness: 0.2
                  })
              );
              scene.add(globe);

              const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
              scene.add(ambientLight);

              const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
              directionalLight.position.set(10, 10, 10);
              scene.add(directionalLight);

              camera.position.set(0, 0, 12);
              controls = new THREE.OrbitControls(camera, renderer.domElement);
              controls.enableDamping = true;
              controls.enableZoom = false;

              controls.addEventListener('start', () => {
                  isUserInteracting = true;
                  if (autoRotateTimeout) clearTimeout(autoRotateTimeout);
              });

              controls.addEventListener('end', () => {
                  autoRotateTimeout = setTimeout(() => isUserInteracting = false, 1000);
              });

              function onWindowResize() {
                  if (!camera || !renderer) return;
                  const width = globeContainer.clientWidth;
                  const height = globeContainer.clientHeight;
                  
                  camera.aspect = width / height;
                  camera.updateProjectionMatrix();
                  
                  renderer.setSize(width, height);
              }

              window.addEventListener('resize', onWindowResize);
              startAnimation();
          };

          function animate() {
              if (!isAnimating) return;
              animationFrameId = requestAnimationFrame(animate);
              if (!isUserInteracting && globe) globe.rotation.y += 0.001;
              if (controls) controls.update();
              if (renderer && scene && camera) renderer.render(scene, camera);
          }

          if ('IntersectionObserver' in window) {
              const globeObserver = new IntersectionObserver((entries) => {
                  entries.forEach((entry) => {
                      isVisible = entry.isIntersecting;
                      if (entry.isIntersecting) {
                          loadGlobeScripts();
                      } else {
                          stopAnimation();
                      }
                  });
              }, { rootMargin: '200px 0px', threshold: 0.1 });
              globeObserver.observe(globeContainer);
          } else {
              isVisible = true;
              loadGlobeScripts();
          }

          document.addEventListener('visibilitychange', handleVisibilityChange);
          prefersReducedMotion.addEventListener('change', handleVisibilityChange);
      }
  });
</script>
```

---

## 14. Typing Stick Cursor Effect on Text Hover

**Files affected:** `src/scripts/cursor.js`, `src/styles/input.css`

This is already included in the full cursor.js from Section 8. Here are the specific pieces:

### JS: Text cursor metrics (already in cursor.js)
The `applyTextCursorMetrics` function reads font-size, line-height, and color from hovered elements and sets CSS custom properties. The `addHoverEffect` call targets all text elements:

```js
    addHoverEffect(
        'p:not(.home-heading), h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, .prose p, .prose li, .prose blockquote',
        ['cursor-text'],
        stripCursorState,
        { syncTextCursorMetrics: true, excludeWithin: '.case-study-cursor-card' }
    );
```

### CSS: Typing stick shape (input.css)
Add inside `@layer components`:

```css
  .cursor-text {
    width: var(--cursor-text-w, 4px) !important;
    height: var(--cursor-text-h, 3rem) !important;
    border-radius: 9999px !important;
    opacity: 1 !important;
    background-color: var(--cursor-text-fg, #3d60e2) !important;
    transform: translate(-50%, -50%) scale(1) !important;
  }

  html.dark .cursor_dot.cursor-text {
    background-color: var(--cursor-text-fg, #F7CB15) !important;
  }
```

The cursor-text width and height are dynamically set by JS based on the hovered text's actual font metrics, so the I-beam always matches the text size.

---

## 15. Use Old Website Colors

**Note:** Keep the color tokens from the old website. The current version uses these Tailwind tokens for reference only:

```js
// Current color tokens (tailwind.config.js) — for reference
colors: {
  savoyBlue: '#3d60e2',
  oxfordBlue: '#2C2C2C',
  ivory: '#FAF9F6',
  ctaSurface: '#3D4F5B',
  ctaSurfaceDark: '#EFD7C3',
},
textColor: {
  normal: '#2C2C2C',
  normalLight: '#636363',
  primary: '#3D4F5B',
  primaryInverted: '#EFD7C3',
  inverted: '#FAF9F6',
  invertedLight: '#B0B0B0',
},
backgroundColor: {
  normal: '#FAF9F6',
  secondary: '#FAF9F6',
  secondaryInverted: '#2C2C2C',
  inverted: '#2C2C2C',
  primary: '#3D4F5B',
  primaryInverted: '#EFD7C3',
},
borderColor: {
  normal: '#E6E3DD',
  inverted: '#3A3A3A',
},
```

**Do NOT replace the old website's color values with these.** Keep the old palette. All the component markup above uses semantic Tailwind classes (`text-primary`, `bg-inverted`, etc.) which will automatically use whatever values are defined in the old tailwind config.

The only hard-coded colors in the new code are:
- Focus ring: `#3d60e2` (light) / `#F7CB15` (dark) — in input.css `:focus-visible`
- Cursor text fallback: `#3d60e2` (light) / `#F7CB15` (dark) — in `.cursor-text` CSS
- Colorful heading palette: `#FB8304`, `#40BFAE`, `#FE3300`, `#3d60e2` — in colorful-heading.js

These should be updated to match the old site's accent colors if they differ.

---

## Asset Manifest

All assets are in `migration-assets/`. Copy them to `src/` preserving the directory structure:

```
migration-assets/
├── fonts/
│   └── Space Grotesk.ttf          → src/fonts/
├── images/
│   ├── *.svg                       → src/images/
│   ├── *.png                       → src/images/
│   ├── *.webp                      → src/images/
│   ├── *.jpg                       → src/images/
│   ├── *.mp4                       → src/images/
│   ├── profile-pic-no-bg.png       → src/images/ (hero portrait)
│   ├── globe-texture.webp          → src/images/ (about page globe)
│   └── png/
│       ├── socialsuite-*.png       → src/images/png/
│       ├── direction-b.png         → src/images/png/
│       ├── og.png                  → src/images/png/
│       └── (all other .png/.webp)  → src/images/png/
```

Key assets for specific features:
- **Hero portrait:** `profile-pic-no-bg.png`
- **SocialSuite card image:** `png/socialsuite-cover-updated.png`
- **SocialSuite case study images:** all `socialsuite-*.webp` and `socialsuite-*.png` files
- **Globe texture:** `globe-texture.webp`
- **Testimonial portraits:** `*-portrait.webp`
- **Client logos:** all SVG logo files
