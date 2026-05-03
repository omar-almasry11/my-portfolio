---
title: "Refinement"
date: 2026-04-15
description: "An exploration of the concept of refinement and the patient process of turning something rough into something finished."
card-img: "/images/morphing-diamonds-cover.png"
card-img-width: 1600
card-img-height: 1200
header_subtitle: "WebGL · Custom Shaders"
header-overview: "Two interactive scenes exploring a single idea: that something raw and shapeless can clear into a finished, faceted form. The first is a blob of ore that polishes itself through the five Platonic solids and back. The second is a tic-tac-toe board that resolves itself, choosing a winning line at random and refining those three pieces into matching gems."
order: 1
categories:
  - WebGL
  - Visual Design
requireThree: true
scripts:
  - /scripts/smelter-three-scenes-bundle.js
---

<div class="not-prose experiment-canvas-stack">
  <figure class="experiment-canvas-figure">
    <div class="experiment-canvas-frame">
      <canvas id="refining-blob-canvas" aria-label="Morphing refining blob — drag to rotate"></canvas>
    </div>
    <figcaption class="experiment-canvas-caption">Hover to spin up the morph. Click and drag to rotate the gem.</figcaption>
  </figure>

  <figure class="experiment-canvas-figure">
    <div class="experiment-canvas-frame experiment-canvas-frame--square">
      <canvas id="gem-tictactoe-canvas" aria-label="Gem tic-tac-toe — three pieces refine themselves into a winning line"></canvas>
    </div>
    <figcaption class="experiment-canvas-caption">The board picks a winning line, refines those three gems into matching shapes, then dissolves them back to raw ore.</figcaption>
  </figure>
</div>

## The Idea

Both scenes are reaching for the same thing: the moment when a rough material reveals the finished form that was already inside it.

The first scene is the simplest version of the metaphor I could think of. A noisy, blob-shaped piece of "raw" material slowly clears its bumps, polishes itself, and snaps into one of the five Platonic solids — tetrahedron, cube, octahedron, dodecahedron, icosahedron — before melting back down and starting again with the next shape in the sequence.

The second takes the same idea and applies it to a puzzle. Nine identical gems sit on a 3×3 grid. Every few seconds the board picks a random winning line — a row, a column, a diagonal — and reshapes those three pieces into the same Platonic solid, holds the win, then dissolves them back to neutral. A tic-tac-toe board that solves itself by refining its own pieces.

## What I Was After

The *feel* of refinement, not just the visual. The blob shouldn't pop into a gem — it should *clear up*. The bumps should die out before the topology changes, so you never see the polyhedron looking ore-like, and you never see the ore looking faceted. Most of the work was tuning those transitions until the moment of becoming-finished felt patient instead of abrupt.

The tic-tac-toe board is a small bet that the same metaphor scales — that watching a system *resolve itself* might be more interesting than watching a player solve it.

## Built With

A single custom GLSL shader handles both the morphing geometry and the dual-material rendering — soft volumetric lighting at low morph values, a faceted iridescent gem at high morph values, with the cross-fade tuned to feel like polishing rather than switching. The same sapphire palette holds in both light and dark modes.

The full source is on [GitHub](https://github.com/omar-almasry11) for anyone curious about the shader work.