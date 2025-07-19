+++
title = 'Projects'
date = 2025-07-19
draft = false
+++

## Neural Surface Compression

2024, *Research, Education, Master Thesis*

Neural compression models are not restricted to texture space inputs.
This is a research piece on a neural texture compression method that parameterizes material data on the object's surface, circumventing the need for UV-mapping.
I examine if the method can achieve sufficient visual quality at high compression rates without the requiring 3D models to be UV-mapped.

[Paper](https://gupea.ub.gu.se/handle/2077/84873), [Source](https://github.com/pacex/neural-surface)

---

## Volumetric Cloud Renderer

2023, *Education*

<div style="text-align: center;">
  <img src="/projects/clouds.png" style="width: 100%; max-width: 900px;">
</div>

A volumetric cloud renderer written in C++ using OpenGL.
My implementation marches along view rays and samples a 3D gradient noise function as cloud density.
Accumulated density samples serve as transmittance estimates to compute shading.
We optimize via transmittance-dependent step sizes and mitigate artifacts using blue noise sample offsets.

[Source](https://github.com/pacex/gpuClouds)

---

## Shard Engine

2023, *Education*

Extension to the Shard Game Engine that enables 3D rendering through OpenGL.
We extend the engine API to support 3D transforms, meshes, shaders, textures and cameras and adapt the existing collision and physics system.

[Source](https://github.com/pacex/ShardEngineOpenGL)

---

## Javalette Compiler

2023, *Education*

Javalette is a simplified toy programming language similar to Java.
I implement a compiler for Javalette that builds a syntax tree to parse a given program into LLVM instructions.

[Source](https://github.com/pacex/JavaletteCompiler)

---

## Water Surface Shader

2022, *Contest*

<div style="text-align: center;">
  <img src="/projects/ocean.png" style="width: 100%; max-width: 900px;">
</div>

This project is my entry to [XOR's fluid challange](https://x.com/XorDev/status/1568277920698753026).
The task is to develop a fluid effect using GameMaker.
My submission is a water surface renderer that uses trochoidal waves, cube-maps and screen space reflections to create a believable visual impression.

[Source](https://github.com/pacex/GMSOceanSurface), [Challenge](https://x.com/XorDev/status/1568277920698753026)

---

## Accelerating Particle Ray Tracing

2022, *Research, Education, Bachelor Thesis*

<div style="text-align: center;">
  <img src="/projects/particle.png" style="width: 100%; max-width: 800px;">
</div>

P-k-d trees are an efficient acceleration structure specific to ray tracing of particle data.
I examine if early termination through probabilistic occlusion culling can accelerate the traversal of P-k-d trees while keeping sufficient visual quality.

[Paper](https://elib.uni-stuttgart.de/items/97443d42-34da-483f-a23d-a6f2a46559fd), [Source](https://github.com/pacex/rtxpkd_ldav2020)

---

## Route Planner

2019, *Education*

A web-based route planner using Dijkstra path finding.

[Source](https://github.com/pacex/route_planner)

---

## Willy's Wine

2018, *Contest, Game Jam*

<div style="text-align: center;">
  <img src="/projects/willy.png" style="width: 100%; max-width: 800px;">
</div>

I made this puzzle game as my entry to the [11th Game++ Community Challenge](http://youtu.be/XBQhFZ4F56o?t=2h52m47s) hosted by [LetsGameDev](http://www.youtube.com/channel/UCSTSJT-X8obSxoJ7ySioGXQ).
It is a memory puzzle about building a bridge by stacking crates so that Willy can reach his beloved wine barrel.

[Game](https://pacex.itch.io/willyswine), [Game Jam](http://youtu.be/XBQhFZ4F56o?t=2h52m47s)


