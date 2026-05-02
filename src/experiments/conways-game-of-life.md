---
title: "Conway's Game of Life"
date: 2026-05-01
description: "An adaptive Game of Life simulation tuned for ambient presence — auto-fitting cells, weighted seeding, and patterns you can paint with the cursor."
card-img: "/images/png/game-of-life-cover.png"
card-img-width: 1600
card-img-height: 1198
header_subtitle: "JavaScript · Cellular Automaton"
header-overview: "A live Conway's Game of Life that auto-fits to whatever viewport you give it, ticks slow enough to be contemplative, and lets you seed gliders and blinkers by moving the cursor. Originally built as the hero for 248.AI's website; lifted out here as a study of the simulation in its own right."
order: 2
categories:
  - JavaScript
  - Interactive Design
---

<div class="not-prose experiment-canvas-stack">
  <figure class="experiment-canvas-figure">
    <div class="experiment-canvas-frame gol-experiment-frame">
      <div class="gol-experiment-wrapper">
        <div id="gol-experiment-gridContainer"></div>
      </div>
    </div>
    <figcaption class="experiment-canvas-caption">Hover the grid to seed gliders, blocks, and blinkers. Generations tick every 2.4 seconds — slow enough to watch shapes survive, drift, and die.</figcaption>
  </figure>
</div>

<style>
  .gol-experiment-frame {
    background-color: #EEEEEE;
    border-radius: 1rem;
  }
  .gol-experiment-wrapper {
    width: 100%;
    height: 100%;
  }
  #gol-experiment-gridContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  #gol-experiment-gridContainer table {
    border-spacing: 2px !important;
    border-collapse: separate !important;
  }
  #gol-experiment-gridContainer td {
    width: var(--gol-cell-size);
    height: var(--gol-cell-size);
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    transition: background-color 0.4s ease-in-out;
  }
  #gol-experiment-gridContainer td.live { background-color: #B8B8C1; }
  #gol-experiment-gridContainer td.dead { background-color: transparent; }
</style>

<script>
(function() {
  const reproductionTime = 2400;
  let rows, cols, grid, nextGrid, gameInterval;

  const patterns = {
    glider: [[0,1,0],[0,0,1],[1,1,1]],
    block: [[1,1],[1,1]],
    blinker: [[1,1,1]],
  };

  function calculateGridDimensions() {
    const gridContainer = document.getElementById('gol-experiment-gridContainer');
    if (!gridContainer) return { cellSize: 8, cols: 0, rows: 0 };
    const borderSpacing = 2;
    const containerWidth = gridContainer.clientWidth;
    const containerHeight = gridContainer.clientHeight;
    let bestScore = 0, bestSize = 4, bestCols = 0, bestRows = 0;
    for (let cellSize = 4; cellSize <= 20; cellSize++) {
      const colsFit = Math.floor((containerWidth + borderSpacing) / (cellSize + borderSpacing));
      const rowsFit = Math.floor((containerHeight + borderSpacing) / (cellSize + borderSpacing));
      if (colsFit < 10 || rowsFit < 10) continue;
      const coverage = (colsFit * cellSize) * (rowsFit * cellSize);
      const aspectScore = 1 - Math.abs((colsFit/rowsFit) - (containerWidth/containerHeight));
      const totalScore = coverage * aspectScore;
      if (totalScore > bestScore) {
        bestScore = totalScore; bestSize = cellSize; bestCols = colsFit; bestRows = rowsFit;
      }
    }
    return { cellSize: bestSize, cols: bestCols, rows: bestRows };
  }

  function initializeGrid() {
    grid = Array.from({ length: rows }, () => Array(cols).fill(0));
    nextGrid = Array.from({ length: rows }, () => Array(cols).fill(0));
    const rightStart = cols * 0.4;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let probability = 0.98;
        if (j >= rightStart) {
          const position = (j - rightStart) / (cols - rightStart);
          probability = 0.85 - (0.4 * Math.pow(position, 1.5));
        }
        grid[i][j] = Math.random() > probability ? 1 : 0;
      }
    }
  }

  function createTable() {
    const gridContainer = document.getElementById('gol-experiment-gridContainer');
    if (!gridContainer) return;
    gridContainer.innerHTML = '';
    const table = document.createElement('table');
    const { cellSize } = calculateGridDimensions();
    gridContainer.style.setProperty('--gol-cell-size', `${cellSize}px`);
    const colors = ['#EEEEEE', '#B8B8C1', '#787E8E'];
    for (let i = 0; i < rows; i++) {
      const tr = document.createElement('tr');
      for (let j = 0; j < cols; j++) {
        const cell = document.createElement('td');
        cell.id = `golx_${i}_${j}`;
        if (grid[i][j] === 1) {
          cell.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        }
        cell.classList.add(grid[i][j] === 1 ? 'live' : 'dead');
        cell.addEventListener("mouseenter", () => addPattern(i, j));
        tr.appendChild(cell);
      }
      table.appendChild(tr);
    }
    gridContainer.appendChild(table);
  }

  function updateView() {
    const colors = ['#EEEEEE', '#B8B8C1', '#787E8E'];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const cell = document.getElementById(`golx_${i}_${j}`);
        if (cell) {
          if (grid[i][j] === 1) {
            if (!cell.dataset.color) {
              cell.dataset.color = colors[Math.floor(Math.random() * colors.length)];
            }
            cell.style.backgroundColor = cell.dataset.color;
          } else {
            cell.style.backgroundColor = "transparent";
            delete cell.dataset.color;
          }
        }
      }
    }
  }

  function addPattern(row, col) {
    const patternNames = Object.keys(patterns);
    const randomPattern = patterns[patternNames[Math.floor(Math.random() * patternNames.length)]];
    for (let i = 0; i < randomPattern.length; i++) {
      for (let j = 0; j < randomPattern[i].length; j++) {
        const newRow = row + i, newCol = col + j;
        if (newRow < rows && newCol < cols) grid[newRow][newCol] = randomPattern[i][j];
      }
    }
    updateView();
  }

  function applyRules(row, col) {
    const n = countNeighbors(row, col);
    if (grid[row][col] === 1) nextGrid[row][col] = (n === 2 || n === 3) ? 1 : 0;
    else nextGrid[row][col] = (n === 3) ? 1 : 0;
  }

  function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newRow = row + i, newCol = col + j;
        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
          count += grid[newRow][newCol] || 0;
        }
      }
    }
    return count;
  }

  function computeNextGeneration() {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) applyRules(i, j);
    }
    [grid, nextGrid] = [nextGrid, grid];
    updateView();
  }

  function startGame() {
    if (gameInterval) clearInterval(gameInterval);
    const d = calculateGridDimensions();
    rows = d.rows; cols = d.cols;
    if (rows === 0 || cols === 0) return;
    initializeGrid();
    createTable();
    updateView();
    gameInterval = setInterval(computeNextGeneration, reproductionTime);
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const d = calculateGridDimensions();
      rows = d.rows; cols = d.cols;
      if (rows === 0 || cols === 0) return;
      initializeGrid();
      createTable();
      updateView();
    }, 200);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startGame);
  } else {
    startGame();
  }
})();
</script>

## The Idea

Conway's Game of Life runs on four rules:

1. A live cell with fewer than two live neighbors dies — underpopulation.
2. A live cell with two or three live neighbors survives.
3. A live cell with more than three live neighbors dies — overpopulation.
4. A dead cell with exactly three live neighbors becomes alive — reproduction.

That's the whole specification. Every cell looks at its eight immediate neighbors, applies one of those four cases, and the field updates in lockstep. From those constraints you get gliders that walk across the grid, oscillators that breathe in place, still lifes that anchor the field, and chaotic regions that occasionally resolve into surprising stable structures. Nothing is choreographed. Every pattern is the rules running on themselves.

I first built this as the live hero for [248.AI's website](/case-studies/248-ai/), where the metaphor of "complex behavior emerging from simple composable rules" matched what the company actually does. Lifted out of that context, the simulation is still interesting on its own — the canonical example of emergence, and a quiet thing to leave running while you read.

## How It Works

Three pieces, none of them complicated on their own.

**The simulation itself** is a pair of 2D arrays — `grid` and `nextGrid`. On each tick, every cell counts its live neighbors and decides its next state, writing into `nextGrid`; then the two arrays swap. The double buffer is the part that's easy to get wrong — read and write into the same array and cells that just changed contaminate the neighbors that haven't been visited yet. The rules stop being the rules.

**The adaptive grid** is the part that took the longest to settle. The container has a fluid width and height, but cells need to be square, evenly spaced, and large enough to read at a glance. So before drawing, the script searches cell sizes from 4px to 20px, picks the size that maximizes coverage *and* matches the container's aspect ratio, and rebuilds the table on resize. The grid always feels filled — never starved on a tall viewport, never dense to the point of mush on a wide one.

**The seeding interaction** uses `mouseenter` on individual cells. When the cursor crosses a cell, the script picks a small Game of Life pattern at random (glider, block, or blinker) and stamps it down. The simulation absorbs the change on the next tick. You're not painting on the grid — you're handing it new initial conditions and watching them dissolve into the rest of the field.

The initial population is weighted: sparse on the left, dense on the right. On the original 248.AI hero this asymmetry let the headline breathe while the simulation took visual priority on the opposite side. I kept it here because it gives the grid a directionality that uniform random seeding doesn't — patterns drift left into thinner air, which reads as motion even when nothing is technically moving.

## What I Was After

I wanted the simulation to feel ambient, not loud. Most Game of Life embeds tick fast — sometimes a frame at a time — because the implementer is showing off that it runs in real time. Fast ticks are mostly legible to the implementer; for everyone else, patterns flicker by before you can see what they're doing.

A 2.4-second tick is slow enough that you actually catch the rules happening. You can see a blinker oscillate. You can watch a glider take a step. You can see a stable structure get nudged by an incoming wave and rearrange. The grid stops being a visual effect and starts being a thing you watch.

The palette decision was the same kind of restraint. Live cells pick from three close grays at random, so density reads as gentle chromatic variation instead of a binary on/off field. The dead state is transparent, so the background carries through. Nothing on the grid demands attention — the patterns do.

The hover interaction is the move I'm most attached to. It turns a passive simulation into something you can shape, but it doesn't give you direct control — you're seeding initial conditions and the rules take it from there. You can intervene, but you can't author. That feels true to what the Game of Life actually is.
