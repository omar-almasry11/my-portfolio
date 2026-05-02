---
title: "Morphing Diamonds"
date: 2026-04-15
description: "A pair of WebGL scenes about refinement — raw, blob-like ore that polishes itself into faceted gems, and a tic-tac-toe board that resolves itself by reshaping its own pieces."
card-img: "/images/morphing-diamonds-cover.png"
card-img-width: 1600
card-img-height: 1200
header_subtitle: "Three.js · Custom GLSL Shaders"
header-overview: "Two interactive scenes built around the same idea: that something rough and shapeless can be refined into a finished, valuable form. The first scene is a raw blob that morphs through the five Platonic solids and back, picking up iridescent sapphire facets each time it polishes. The second is a 3×3 tic-tac-toe board that solves itself — picking a winning line at random, then reshaping those three pieces into matching gems before dissolving them back to start over."
order: 1
categories:
  - ThreeJS
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
    <figcaption class="experiment-canvas-caption">Hover to spin up the morph. Click and drag to rotate the gem in your hands.</figcaption>
  </figure>

  <figure class="experiment-canvas-figure">
    <div class="experiment-canvas-frame experiment-canvas-frame--square">
      <canvas id="gem-tictactoe-canvas" aria-label="Gem tic-tac-toe — three pieces refine themselves into a winning line"></canvas>
    </div>
    <figcaption class="experiment-canvas-caption">Watch the board pick a winning line, refine those three gems into matching shapes, then dissolve them back to raw ore.</figcaption>
  </figure>
</div>

## The Idea

Both scenes are reaching for the same thing: the moment when a rough material reveals the finished form that was already inside it. Refinement, basically — the patient process of turning ore into something with edges, geometry, and light bouncing off it.

The first scene is the simplest version of the metaphor I could think of. A noisy, blob-shaped piece of "raw" material slowly clears its bumps, polishes itself, and snaps into one of the five Platonic solids — tetrahedron, cube, octahedron, dodecahedron, icosahedron — before melting back down and starting again with the next shape in the sequence.

The second scene takes the same idea and applies it to a puzzle. Nine identical gems sit on a 3×3 grid. Every few seconds the board picks a random winning line — a row, a column, a diagonal — and reshapes those three pieces into the same Platonic solid, holds the win, then dissolves them back to neutral. It's a tic-tac-toe board that solves itself by refining its own pieces.

## How It Works

The whole thing runs on a single custom GLSL shader. The vertex shader does the morphing: it takes a sphere of vertices and, based on a `uMorph` value between 0 and 1, blends each vertex between three layers — a noisy "ore" displacement, a smooth blob, and the exact ray-cast intersection of a Platonic solid hull. As the morph progresses, the high-frequency noise dies off first, the blob shape clears, and the polyhedron snaps into place.

The fragment shader handles two materials in one pass. At low morph values it's a soft, roughly-lit volume — the "raw" body. As the morph crosses a threshold, it cross-fades into a mirror gem material with thin-film iridescence, faceted reflections, refraction through the surface, and a holographic rim. The same sapphire palette is used in both light and dark modes so the gem reads consistently against either backdrop.

The tic-tac-toe scene reuses the same shader but pins the morph state per cell. Cells that aren't on the active winning line stay at morph = 0 (raw blobs); the three cells on the active line ease through 0 → 1 → 0 over a six-second cycle, all snapping to the same randomly-chosen Platonic kind so the win reads as visually unified.

## What I Was After

I wanted the _feel_ of refinement, not just the visual. The blob shouldn't pop into a gem — it should clear up. The bumps should die out before the topology changes, so you never see the polyhedron looking ore-like, and you never see the ore looking faceted. The shader spends most of its complexity on those transitions: where to dampen the noise, when to swap the underlying geometry, how to make the iridescence shift based on view angle so the gem looks like it actually has a surface.

The tic-tac-toe board is a small bet that the same metaphor scales — that watching a system _resolve itself_ is more interesting than watching a player solve it.
