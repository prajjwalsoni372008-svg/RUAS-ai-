---
name: SpecForge
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#009eb9'
  on-tertiary-container: '#002f38'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-matrix:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.05em
  label-status:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-base: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system embodies an authoritative, precision-engineered aesthetic tailored for academic curriculum developers, ABET/NBA accreditation leads, and engineering faculty. The environment fuses technical rigor with modern IDE utility, avoiding dry institutional tropes in favor of an ergonomic command-center feel.

The emotional target is uncompromising clarity, intellectual flow, and verifiable confidence. Visual tension is maintained through deep slate backdrops paired with surgical indigo, violet, and electric cyan accents.

Design Style: **Technical / Modern IDE Hybrid**
- High density without visual clutter.
- Utilitarian spatial distribution combined with subtle ambient glassmorphism for floating toolbars and modals.
- Precise hairline dividers, structural data grids, and strict token-driven telemetry cues.

## Colors

The palette leverages a deep navy/slate hierarchy to maximize legibility of dense matrices while mitigating cognitive fatigue during extended curriculum design sessions.

- **Canvas & Surface Tier**:
  - `bg-base`: `#090D16` (Deepest canvas)
  - `surface-1`: `#0F172A` (Panels, sidebars, base cards)
  - `surface-2`: `#1E293B` (Elevated card containers, active rows, modal content)
  - `surface-3`: `#334155` (Hover states, input backgrounds, active pills)
- **Primary & Accent Scale**:
  - Primary (`#6366F1` - Electric Indigo): Primary actions, active navigation anchors, focus halos.
  - Secondary (`#8B5CF6` - Vivid Violet): AI prompt suggestions, auto-align actions, LLM completion hooks.
  - Tertiary (`#06B6D4` - Cyan Precision): Status indicators, PO/CO correlation weightings, active telemetry.
- **Accreditation Status Tokens**:
  - Validated/Mapped: `#10B981` (Emerald)
  - Warning/Under-mapped: `#F59E0B` (Amber)
  - Error/Orphan Outcome: `#EF4444` (Crimson)
  - Draft/Unmapped: `#64748B` (Muted Slate)
- **Borders & Partitions**:
  - Structural Hairline: `rgba(148, 163, 184, 0.12)`
  - Active/Focused Hairline: `rgba(99, 102, 241, 0.4)`

## Typography

The dual-type setup establishes immediate distinction between institutional prose and operational engineering metadata:

- **Inter**: Drives prose, syllabi descriptions, course context, narrative summaries, and navigation menus. Provides neutral, non-distracting rendering across dense viewports.
- **JetBrains Mono**: Assigned to matrix coordinate codes (`CO1`, `PO3`, `PSO2`), Bloom's Taxonomy classification tags, formula indices, token counts, model provider tags, and numerical correlation coefficients (`1.0`, `2.0`, `3.0`).
- Text hierarchy must preserve typographic tension: column headers in the matrix must use `label-matrix` in uppercase with wide tracking, while syllabi inputs employ standard `body-md` for natural readability.

## Layout & Spacing

The layout is built around an expandable workbench structure containing three persistent zones: an inspectable hierarchical sidebar (Tree/Modules), a central multi-pane editor/matrix canvas, and an optional collapsible telemetry/AI companion rail.

- **Grid Discipline**:
  - The central workspace utilizes a 12-column adaptive fluid grid for narrative components and dynamic form layouts.
  - The matrix view decouples from 12-column flow into a pinned 2-dimensional computational table with frozen primary index columns (`CO_ID`) and fixed-width analytical data columns (`PO1`â€“`PO12`).
- **Breakpoints & Adaptation**:
  - **Desktop (HL
JŠˆ™YKXÛÛ[[ˆÜ]\[™HÛÜšØ™[˜Ú
ŒÚYX˜\ˆ
È›^Y]Üˆ
ÈÍ[œÜXİÜŠKˆX]š^^[™ÈÜš^›Û[HÚ]]]Ë\ØÜ›Û‚ˆH
Š•X›]
ÍHLÎ\
JŠˆ]\˜[[™[ÈÛÛ\ÙH[ÈXÛÛˆØÚÈšYÙÙ\œÈÜˆ˜]Ù\ˆİ™\›^\ËˆXZ[ˆY]Üˆ™]Z[œÈ[šY]ÈÚY‚ˆH
Š“[Øš[H
Í
JŠˆÛÜšØ™[˜ÚÛÛ™\ÈÈÚ[™ÛK\[™H\ÚÈ›İÎÈX]š^ÛÛ\Ù\Èœ›ÛH‘ÜšYÈÙ\]Y[X[XØÛÜ™[ÛœÈ\ˆÛİ\œÙHİ]ÛÛYK‚‚ˆÈÈ[]˜][Ûˆ	ˆ\‚•š\İX[Y\˜\˜ÚH]™\˜YÙ\È\˜Ú]Xİ\˜[Û˜[İXÚÚ[™ÈÛÛXš[™YÚ][˜K[İÈY™\Ú[ÛˆÚYİÜÈÈ\ÛÛ]H[˜İ[Û˜[^Y\œÈÚ]İ]š\İX[šY‚‚‹H
Š“]™[
Ø[˜\ÊJŠˆÌLM˜˜\Ù[[™Hİ\™˜XÙK‚‹H
Š“]™[H
ØÚÙYÛÛZ[™\œÊJŠˆÌŒMÌXÚ]Z\›[™H\š[Y]\ˆ›Ü™\ˆ\ÛÛY™Ø˜JMMŒËNŒ
X‚‹H
Š“]™[ˆ
Xİ]™HØ\™È	ˆÙ[›Øİ\ÊJŠˆÌQLLĞ˜İXHÜYYÙHš[K[YÚ[œÙ]\™Ø˜JMKMKMKŒŠX›Ş\ÚYİÎˆMœLœ™Ø˜J
X‚‹H
Š“]™[È
[Ù[È	ˆÛÛ[X[™[]\ÊJŠˆÌŒMÌXİ™\ˆ˜XÚÙ›Ü™Ø˜JKLËŒ‹ÍJXÚ]˜XÚÙ›ÜYš[\ˆ›\ŠLœ
Xˆİ]\ˆ›İ[™\Nˆ\ÛÛY™Ø˜JNKL‹KŒJX›Ş\ÚYİÎˆŒN™Ø˜JÊX‚‹H
Š“]™[
›Ø][™ÈZXÜ›ËQ™YY˜XÚÈÈÛÛ\ÊJŠˆÌQLLĞ˜Ú]›Ü™\ˆ\ÛÛY™Ø˜JMMŒËNŒŠX[™›Ş\ÚYİÎˆ™Ø˜JŠX‚‚ˆÈÈÚ\\Â‚•Èİ\İZ[ˆ[ˆ[š\›Û›Y[ÙˆXÚšXØ[]]Üš]H[™[œÚ]KÙ[ÛY]H˜]›ÜœÈ\ØÚ\[™YİË\˜Y]\Èİ\˜]\™H
›İ[™Y™\ÜÎˆX
N‚‚‹H
Š’[œ]Ë]ÛœË[™X›HÙ[ÊŠˆŒ\™[X

KˆÛX[‹Üš\ÜÛÜ›™\œÈ™\Ù\™HX^[][H^[™X[\İ]K‚‹H
Š”[™[Ë[]˜]YØ\™Ë[™›Ü›Û™\ÊŠˆ\™[X

KˆİXİ\˜[œ˜[Z[™ÈXZ[Z[œÈÛ\š]HÚ]İ]ÛÚÚ[™ÈYÙÜ™\ÜÚ]™K‚‹H
Š“[Ù[È	ˆX[ÙÜÊŠˆÍ\™[X
Lœ
KˆÛÙ[™Y\š[Y]\ˆX\šÜÈ^XÚ]]XÚY[œ›ÛHÛÜšØ™[˜Ú[™\Ë‚‹H
Š”İ]\È[™XØ]ÜœÈ	ˆZXÜ›È˜YÙ\ÊŠˆ[[
NNN\
HÈ[[YYX][H\İ[™İZ\ÚÜ\˜][Û˜[X\šÙ\œÈœ›ÛHY]X›H›Ü›HšY[È[™[˜[]XØ[[\Ë‚‚ˆÈÈÛÛ\Û™[Â‚ˆÈÈÈ]ÛœÈ	ˆ[\˜Xİ]™HšYÙÙ\œÂ‹H
Š”š[X\H]ÛŠŠˆ[™YÛÈ˜\ÙH
ÍŒÍ‘ŒX
H˜Y[™ÈÈÍ‘MXÛˆİ™\‹ˆÛÛ˜\İ\ÙÜ˜\NˆÑ‘‘‘‘‘˜
Ù[ZX›Û
KˆÚ\œ˜Y]\Ëˆ›Øİ\Èš[™ÎˆœÛÛYÎNÑÚ]œÙ™œÙ]‚‹H
Š”ÙXÛÛ™\HÈÚÜİ
Šˆ˜[œÜ\™[˜\ÙHÚ]\ÛÛY™Ø˜JMMŒËNŒMŠX›Ü™\‹ˆ^ˆÛ]HÌ
ĞĞ‘QLX
Kˆİ™\ˆÚYÈš[È™Ø˜JMKMKMKŒ
X[™›Ü™\ˆÈ™Ø˜JMMŒËNŒÊX‚‹H
ŠRHXİ[Ûˆ˜\šX[
ŠˆÜ˜YY[š[™È
ÍŒÍ‘ŒXÈÎPÑ˜
HÚ]Y\Û]Hš[[™š[Û]Ü\šÈXÛÛ‹‚‚ˆÈÈÈ›Ü›H[œ]È	ˆ–SÒÈÜ™Y[X[Â‹H˜XÚÙÜ›İ[™ˆİ\™˜XÙHY\ˆH
ÌŒMÌX
KİXİ\˜[›Ü™\ˆ\ÛÛY™Ø˜JMMŒËNŒMŠX‚‹HXİ]™HÈ\[™Èİ]Nˆ[™YÛÈ›Ü™\ˆ
ÍŒÍ‘ŒX
HÚ]ÛİÈÚYİÈ\ÍŒÍ‘ŒX‚‹H[Û›ÜÜXÙHX\ÚÈ[œ]È›Üˆ–SÒÈ
œš[™È[İ\ˆİÛˆÙ^JH[šY\È™X]\š[™È[›[™H^YHÙÙÛ\È[™›İšY\ˆ˜YÙ\È
Ü[RK[›ÜXËÛ[XJK‚‚ˆÈÈÈÛİ\œÙHİ]ÛÛYH
ÓÊH	ˆ›ÙÜ˜[Hİ]ÛÛYH
ÊHX]š^‹H
Š’XY\ˆÙ[ÊŠˆ[Û›ÜÜXÙHX™[Ë›İ]YHYÜ™Y\ÈÜˆš^Y™\XØ[H]ÍœÛÛ[[ˆÚYÈÚ]YÚXÛÛ˜\İ^
ÎMLĞ
K‚‹H
Š“X]š^Ù[ÊŠˆ[\˜Xİ]™HÌÌœÜ]Z\˜ÛH\™Ù]ÈXØÙ\[™È˜[Y\È8 %X
ÛYÚ
K˜
[Ù\˜]JKØ
İXœİ[X[
K‚‹H
ŠÛÜœ™[][ÛˆÙ[İ[\ÊŠ‚ˆHÈ›Û™Xˆ›[šÈÜˆİXH[Hİ
™Ø˜JMMŒËNŒŠX
K‚ˆHXˆİÈ[ŞX[ˆ
™Ø˜J‹N‹ŒL‹ŒMJX
K^Ì‘‚ˆH˜ˆYY][H[[™YÛÈ
™Ø˜JNKL‹KŒŠX
K^ÎNÑ‚ˆHØˆYÚZ[[œÚ]HÛÛYš[Û]Z[™YÛÈ
™Ø˜JLÎKL‹‹ŒÊX
K^ĞÌØÚ]\ÛÛY™Ø˜JLÎKL‹‹
X‚‚ˆÈÈÈ]™Hİ]\È[[™XØ]ÜœÂ‹HÛÛ\XİZYÚ
Œ
K[Û›ÜÜXÙH›Û›Û[[˜Y]\Ë‚‹H[˜ÛY\ÈH]™HœÛİÚ[™È[™Èİ‚ˆHÜ™Y[ˆ
ÌLNX
NˆPTQ
L	JXˆH[X™\ˆ
ÑNQL˜
NˆÍS‘T‹T‘T‘TÑS•QˆHš[Û]
ÎPÑ˜
NˆHS‘‘T‘SÑH‘PQX‚ˆÈÈÈš[H˜YËX[™Q›Ü[Ù[‹H›Ü›Û™Hİ\™˜XÙNˆ\ÚYZ\›[™H›Ü™\ˆ
œ\ÚY™Ø˜JNKL‹K
X
K[\š[Üˆ˜XÚÙÜ›İ[™™Ø˜JMKŒË‹ŠX‚‹Hİ™\‹Ñ˜YÈİ]Nˆ›Ü™\ˆ˜[œÚ][ÛœÈÈœšYÚŞX[ˆ
Ì‘
K˜XÚÙÜ›İ[™È™Ø˜J‹N‹ŒL‹ŒŠXÚ]ØØ[H›İ[˜ÙK‚‹Hİ\ÜY]Y]Nˆ[Û›ÜÜXÙHš[H›Ü›X]YÜÈ
”˜‘ĞÖ’”ÓÓ˜“Q
H™[™\ˆ[œÚYHZXÜ›ÈYÜÈÚ]œÛÜ›™\ˆ˜Y]\Ë