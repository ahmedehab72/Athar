# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React (JavaScript), chosen by the user ("I prefer React JS"). 3D through React Three Fiber (three, @react-three/drei, @react-three/postprocessing), page routing with react-router-dom, motion with GSAP and Lenis, small shared state with zustand. Static build; no backend.

## Users

Arabic-speaking visitors discovering "Athar" (أثر), a luxury scent rooted in kyphi (كايفي), the ancient Egyptian temple incense. They arrive curious, browse on desktop and phone, and should leave understanding the story and wanting to ask about the perfume.

## Product Purpose

A cinematic brand site: the story of kyphi, the incense Athar descends from, told through five Blender scenes, ending on a product page whose action is an inquiry / request, not a checkout. Success = the visitor reaches the perfume page and contacts the brand.

## Positioning

The site is built directly on the brand's own 3D scenes (D:\New folder\blender-website-1\kyphi.blend): temple, sixteen ingredients, ritual, alabaster vessel, modern bottle. The journey between pages is a camera flight through that one scene, not a slideshow of stock imagery.

## Operating Context

- Source scene: `kyphi.blend`, five chapters on the X axis 16 m apart, each with its own preview camera (CH1 Temple 35 mm, CH2–CH5 85 mm). Exported to `public/models/kyphi.glb`.
- The .blend has no lights and uses volumetric materials that do not export; lighting and haze are rebuilt on the web.

## Capabilities and Constraints

- Language: Arabic only, RTL.
- No e-commerce. Product page action is an inquiry.
- Undecided / placeholder: price, bottle sizes, points of sale, contact details. Marked as placeholders in the UI; never invented.

## Brand Commitments

- Name: أثر (Athar). Renamed from "كايفي" on 2026-11-16 at the user's request. "كايفي" now refers only to the historical incense in the story copy (Plutarch, Edfu, the word kapet), never to the brand or the product.
- Palette is binding and comes from the Blender materials: deep black #0A0806 / #100E0B, stone #221C16 / #393229, alabaster #E9DEC7, gold #E4CF92 / #C7A04C / #85682B, amber #DF8E1C / honey #F4A633, ember #E77419, wine #41141C, myrrh #592C1F, cinnamon #643E25.

## Evidence on Hand

- 3D scene and its five camera shots (above).
- No testimonials, press, prices, retailers or contact data exist yet. Do not fabricate them.
- Historical framing (Kyphi as Egyptian temple incense, Plutarch's sixteen ingredients, recipes carved at Edfu and Philae) is general public history; keep claims modest.

## Product Principles

1. The scene is the hero; interface recedes behind it.
2. Every page is one shot of the same film; navigation is camera movement.
3. Story first, product last; the product page closes the journey with one clear action.
4. Say only what is true; placeholders stay visibly placeholders.

## Accessibility & Inclusion

Arabic RTL typography with no letter-spacing on Arabic; respect `prefers-reduced-motion` (no camera flights, reduced particles); readable contrast over the 3D; full keyboard navigation of menus and ingredient list; canvas is decorative (`aria-hidden`) and all content exists as real HTML.
