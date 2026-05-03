---
title: "Conway's Game of Life"
date: 2026-05-01
description: "An adaptive Game of Life tuned for ambient presence with auto-fitting cells, weighted seeding, and patterns you can paint with the cursor."
card-img: "/images/png/game-of-life-cover.png"
card-img-width: 1600
card-img-height: 1198
header_subtitle: "Cellular Automaton · Ambient Simulation"
header-overview: "A live Conway's Game of Life that auto-fits to whatever viewport you give it, ticks slow enough to be contemplative, and lets you seed gliders and blinkers by moving the cursor. Originally built as the hero for 248.AI's website; lifted out here as a study of the simulation in its own right."
order: 2
categories:
  - Cellular Automaton
  - Interactive Design
---

[canvas embed unchanged]

## The Idea

Conway's Game of Life runs on four rules:

1. A live cell with fewer than two live neighbors dies — underpopulation.
2. A live cell with two or three live neighbors survives.
3. A live cell with more than three live neighbors dies — overpopulation.
4. A dead cell with exactly three live neighbors becomes alive — reproduction.

That's the whole specification. Every cell looks at its eight immediate neighbors, applies one of those four cases, and the field updates in lockstep. From those constraints you get gliders that walk across the grid, oscillators that breathe in place, still lifes that anchor the field, and chaotic regions that occasionally resolve into surprising stable structures. Nothing is choreographed. Every pattern is the rules running on themselves.

I first built this as the live hero for [248.AI's website](/case-studies/248-ai/), where the metaphor of complex behavior emerging from simple composable rules matched what the company actually does. Lifted out of that context, the simulation is still interesting on its own — the canonical example of emergence, and a quiet thing to leave running while you read.

## How It Works

The simulation is a pair of 2D arrays. On each tick, every cell counts its live neighbors and decides its next state into a buffer; then the buffer becomes the live grid and the cycle repeats. Standard cellular-automaton implementation — the small details are where it gets interesting.

The grid auto-fits the viewport. Before drawing, the script picks a cell size between 4 and 20 pixels that maximizes coverage and matches the container's aspect ratio, then rebuilds on resize. The grid always feels filled — never starved on a tall viewport, never overcrowded on a wide one.

The seeding interaction is the part I'm most attached to. Hovering over a cell stamps a small pattern there — a glider, a block, or a blinker — and the simulation absorbs it on the next tick. You're not painting on the grid. You're handing it new initial conditions and watching them dissolve into the rest of the field. You can intervene, but you can't author.

The initial population is weighted: sparse on the left, dense on the right. On the original 248.AI hero this gave the headline room to breathe while the simulation took visual priority on the opposite side. I kept the asymmetry here because it gives the grid a directionality that uniform random seeding doesn't — patterns drift left into thinner air, which reads as motion even when nothing is technically moving.

## What I Was After

The simulation should feel ambient, not loud. Most Game of Life embeds tick fast — sometimes a frame at a time — because the implementer is showing off that it runs in real time. Fast ticks are mostly legible to the implementer; for everyone else, patterns flicker by before you can see what they're doing.

A 2.4-second tick is slow enough that you actually catch the rules happening. You can see a blinker oscillate. You can watch a glider take a step. You can see a stable structure get nudged by an incoming wave and rearrange. The grid stops being a visual effect and starts being a thing you watch.

The palette is the same kind of restraint. Live cells pick from three close grays at random, so density reads as gentle chromatic variation instead of a binary on/off field. The dead state is transparent, so the background carries through. Nothing on the grid demands attention — the patterns do.

The hover interaction stays at the center of the design. It turns a passive simulation into something you can shape, but it doesn't give you direct control. That feels true to what the Game of Life actually is.