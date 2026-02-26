# VolcanoAtlas — Complete Design Specification

## CRITICAL: Read This First

The current site has broken layouts, no padding, no visual hierarchy. This document specifies EXACTLY how every component and page should look. Implement this as a complete overhaul — replace all existing page templates and components.

---

## Design Direction

**Aesthetic**: Dark, editorial, authoritative — like a premium National Geographic digital atlas crossed with a modern data dashboard. NOT a generic dark theme. Think: cinematic, immersive, volcanic.

**Font Stack**:
- Headings: `font-family: 'Playfair Display', Georgia, serif` (import from Google Fonts)
- Body: `font-family: 'Source Sans 3', system-ui, sans-serif` (import from Google Fonts)
- Data/Labels: `font-family: 'JetBrains Mono', monospace` (for coordinates, elevations, VEI numbers)

**Color Palette** (use CSS variables in globals.css):
```css
:root {
  --bg-primary: #0a0a0a;
  --bg-card: #141414;
  --bg-card-hover: #1c1c1c;
  --bg-elevated: #1a1a1a;
  --bg-accent: rgba(245, 158, 11, 0.08);
  --border: #262626;
  --border-hover: #404040;
  --text-primary: #f5f5f5;
  --text-secondary: #a3a3a3;
  --text-muted: #737373;
  --accent: #f59e0b;
  --accent-hover: #d97706;
  --accent-subtle: rgba(245, 158, 11, 0.15);
  --danger: #ef4444;
  --success: #22c55e;
}
```

**Spacing System**: Use Tailwind defaults. Generous whitespace everywhere — this is an encyclopedia, not a cramped dashboard. Minimum `py-16` between major sections, `gap-6` in grids, `p-6` inside cards.

---

## Global Layout

```
<body class="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen">
  <Header />
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {children}
  </main>
  <Footer />
</body>
```

EVERY page wraps its content in `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`. No exceptions. Nothing should ever touch the screen edges.

---

## Component Specifications

### Header
```
<header class="sticky top-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-md border-b border-[var(--border)]">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">
      <!-- Logo: volcano icon (🌋 or SVG) + "VolcanoAtlas" in Playfair Display, amber color -->
      <!-- Nav: Playfair Display text, text-sm tracking-wide uppercase -->
      <!-- Dropdowns: bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-2xl p-2 -->
    </div>
  </div>
</header>
```

### Card Component (used everywhere)
```
<div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 
            hover:border-[var(--border-hover)] transition-all duration-300">
```

### Section Heading (H2)
```
<h2 class="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-white mb-6 
           pl-4 border-l-4 border-[var(--accent)]">
```

### Section Heading (H3 — subsections)
```
<h3 class="font-['Playfair_Display'] text-xl font-semibold text-white mb-4">
```

### Prose Content
```
<div class="prose prose-invert prose-lg max-w-none 
            prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed
            prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white">
```

### Stat Badge (for VEI, eruption counts, etc.)
```
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium 
             bg-[var(--accent-subtle)] text-[var(--accent)]">
  VEI 5
</span>
```

---

## Page Templates

### HOMEPAGE

```
<!-- Hero -->
<section class="text-center py-12 md:py-20">
  <h1 class="font-['Playfair_Display'] text-5xl md:text-7xl font-bold tracking-tight mb-4">
    Every Volcano <span class="text-[var(--accent)]">on Earth</span>
  </h1>
  <p class="text-xl text-[var(--text-secondary)] mb-8">
    Explore detailed profiles of <span class="text-[var(--accent)] font-semibold">150 volcanoes</span> across <span class="text-[var(--accent)] font-semibold">46 countries</span>
  </p>
</section>

<!-- Map: full width within max-w-7xl, rounded-xl overflow-hidden, h-[500px] md:h-[600px] -->
<section class="mb-16">
  <div class="rounded-xl overflow-hidden border border-[var(--border)] h-[500px] md:h-[600px]">
    <!-- Leaflet map with dark tiles -->
  </div>
  <p class="text-center text-[var(--text-muted)] text-sm mt-3">Click any marker to explore a volcano</p>
</section>

<!-- Featured Volcanoes -->
<section class="mb-16">
  <h2 ... (section heading style) ...>Featured Volcanoes</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Each volcano card -->
    <a href="/volcano/..." class="group bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6
                                   hover:border-[var(--accent)] transition-all duration-300 
                                   hover:shadow-lg hover:shadow-amber-500/5">
      <h3 class="font-['Playfair_Display'] text-lg font-bold text-white mb-3 
                 group-hover:text-[var(--accent)] transition-colors">Kilauea</h3>
      <div class="space-y-1.5 text-sm">
        <div class="flex justify-between">
          <span class="text-[var(--text-muted)]">Location</span>
          <span class="text-[var(--text-secondary)]">United States</span>
        </div>
        <div class="flex justify-between">
          <span class="text-[var(--text-muted)]">Type</span>
          <span class="text-[var(--text-secondary)]">Shield volcano</span>
        </div>
        <div class="flex justify-between">
          <span class="text-[var(--text-muted)]">Elevation</span>
          <span class="font-mono text-[var(--text-secondary)]">1,222 m</span>
        </div>
      </div>
      <div class="mt-4 pt-4 border-t border-[var(--border)] flex items-center text-[var(--accent)] text-sm font-medium">
        Explore Volcano <span class="ml-1 group-hover:ml-2 transition-all">→</span>
      </div>
    </a>
  </div>
</section>

<!-- Browse by Country -->
<section class="mb-16">
  <h2 ...>Browse by Country</h2>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
    <a href="/volcanoes-in-..." class="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4
                                       hover:border-[var(--accent)] transition-all text-center group">
      <div class="font-mono text-2xl font-bold text-[var(--accent)] mb-1">165</div>
      <div class="text-sm text-[var(--text-secondary)] group-hover:text-white transition-colors">United States</div>
    </a>
  </div>
</section>

<!-- Explore Volcanic Science: 4-card grid with icons -->
<!-- Stats bar: 4 columns with big amber numbers -->
<!-- About section: prose text -->
```

### VOLCANO PROFILE PAGE

This is the most important template. 2-column layout on desktop.

```
<!-- Breadcrumbs -->
<nav class="text-sm text-[var(--text-muted)] mb-4">
  <a href="/" class="hover:text-[var(--accent)]">Home</a>
  <span class="mx-2">/</span>
  <a href="/volcanoes-in-italy" class="hover:text-[var(--accent)]">Italy</a>
  <span class="mx-2">/</span>
  <span class="text-[var(--text-secondary)]">Mount Vesuvius</span>
</nav>

<!-- Hero -->
<div class="mb-8">
  <h1 class="font-['Playfair_Display'] text-4xl md:text-5xl font-bold mb-2">Mount Vesuvius</h1>
  <p class="text-[var(--text-muted)] text-lg mb-1 italic">Vesuvio (Italian)</p>
  <p class="text-[var(--accent)] text-xl font-['Playfair_Display'] mb-6">Italy's Most Dangerous Volcano</p>
  
  <!-- Hero stats bar -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4">
      <div class="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Location</div>
      <div class="text-white font-medium">Italy, Campania</div>
    </div>
    <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4">
      <div class="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Elevation</div>
      <div class="text-white font-mono font-medium">1,281 m</div>
    </div>
    <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4">
      <div class="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Status</div>
      <div class="text-[var(--accent)] font-medium">Active</div>
    </div>
    <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4">
      <div class="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Last Eruption</div>
      <div class="text-white font-mono font-medium">1944</div>
    </div>
  </div>
</div>

<!-- 2-Column Layout -->
<div class="flex flex-col lg:flex-row gap-8">
  
  <!-- Main Content (left) -->
  <div class="flex-1 min-w-0 lg:max-w-[65%]">
    
    <!-- Quick Answer Box -->
    <div class="bg-[var(--accent-subtle)] border-l-4 border-[var(--accent)] rounded-r-xl p-6 mb-10">
      <h2 class="font-['Playfair_Display'] text-xl font-bold text-[var(--accent)] mb-4">Quick Answer</h2>
      <div class="space-y-4">
        <div>
          <div class="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">What is it?</div>
          <p class="text-[var(--text-secondary)] leading-relaxed">...</p>
        </div>
        <div>
          <div class="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">Current Status</div>
          <p class="text-[var(--text-secondary)] leading-relaxed">...</p>
        </div>
        <!-- famous_for, danger_level -->
      </div>
    </div>
    
    <!-- Sections: Each section with H2 border-l accent, prose content -->
    <section class="mb-10" id="overview">
      <h2 class="font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-white mb-6 
                 pl-4 border-l-4 border-[var(--accent)]">Overview</h2>
      <div class="prose prose-invert prose-lg max-w-none text-[var(--text-secondary)] leading-relaxed">
        <!-- HTML content from JSON -->
      </div>
    </section>

    <!-- Notable Eruptions: subsections as cards -->
    <section class="mb-10" id="notable-eruptions">
      <h2 ...>Notable Eruptions</h2>
      <div class="space-y-6">
        <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
          <h3 class="font-['Playfair_Display'] text-xl font-semibold text-white mb-2">
            The Eruption of 79 CE — Destruction of Pompeii
          </h3>
          <div class="flex gap-2 mb-4">
            <span class="... stat badge ...">VEI 5</span>
            <span class="... stat badge bg-red-500/15 text-red-400 ...">~16,000 deaths</span>
          </div>
          <div class="prose prose-invert max-w-none text-[var(--text-secondary)]">
            <!-- content -->
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison Tables -->
    <section class="mb-10">
      <h2 ...>How It Compares</h2>
      <div class="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table class="w-full text-sm">
          <thead>
            <tr class="bg-[var(--accent)]/10 border-b border-[var(--border)]">
              <th class="text-left p-4 text-[var(--accent)] font-semibold text-xs uppercase tracking-wider">Volcano</th>
              <!-- ... -->
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-[var(--border)] hover:bg-[var(--bg-card-hover)]">
              <td class="p-4 text-white font-medium">Vesuvius</td>
              <td class="p-4 text-[var(--text-secondary)]">Italy</td>
              <!-- ... -->
            </tr>
            <!-- Alternate: even rows get bg-[var(--bg-card)] -->
          </tbody>
        </table>
      </div>
    </section>

    <!-- Eruption Timeline -->
    <section class="mb-10">
      <h2 ...>Eruption Timeline</h2>
      <div class="relative pl-8 border-l-2 border-[var(--border)] space-y-6">
        <div class="relative">
          <div class="absolute -left-[2.45rem] w-4 h-4 rounded-full bg-[var(--accent)] border-2 border-[var(--bg-primary)]"></div>
          <div class="bg-[var(--bg-card)] rounded-lg p-4 border border-[var(--border)]">
            <div class="flex items-center gap-3 mb-1">
              <span class="font-mono text-[var(--accent)] font-bold">79 CE</span>
              <span class="... stat badge ...">VEI 5</span>
            </div>
            <p class="text-sm text-[var(--text-secondary)]">Catastrophic eruption burying Pompeii and Herculaneum</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Facts -->
    <section class="mb-10">
      <h2 ...>Key Facts</h2>
      <div class="grid gap-4">
        <div class="flex gap-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4">
          <span class="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] 
                       font-mono font-bold text-sm flex items-center justify-center">1</span>
          <p class="text-[var(--text-secondary)] text-sm leading-relaxed">Fact text here...</p>
        </div>
      </div>
    </section>

    <!-- FAQs -->
    <section class="mb-10">
      <h2 ...>Frequently Asked Questions</h2>
      <div class="divide-y divide-[var(--border)] border border-[var(--border)] rounded-xl overflow-hidden">
        <details class="group">
          <summary class="flex items-center justify-between p-5 cursor-pointer 
                         bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-colors">
            <span class="font-medium text-white">Is Mount Vesuvius still active?</span>
            <svg class="w-5 h-5 text-[var(--text-muted)] group-open:rotate-180 transition-transform" ...>
              <!-- Chevron -->
            </svg>
          </summary>
          <div class="p-5 bg-[var(--bg-primary)] text-[var(--text-secondary)] leading-relaxed">
            Answer text...
          </div>
        </details>
      </div>
    </section>
  </div>

  <!-- Sidebar (right) -->
  <aside class="lg:w-[33%] flex-shrink-0">
    <div class="lg:sticky lg:top-24 space-y-6">
      
      <!-- Key Facts Card -->
      <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <h3 class="font-['Playfair_Display'] text-lg font-bold text-[var(--accent)] mb-4">Key Facts</h3>
        <dl class="space-y-3">
          <div class="flex justify-between items-baseline">
            <dt class="text-xs text-[var(--text-muted)] uppercase tracking-wider">Elevation</dt>
            <dd class="font-mono text-white font-medium">1,281 m</dd>
          </div>
          <div class="border-t border-[var(--border)]"></div>
          <!-- repeat for each fact -->
        </dl>
      </div>

      <!-- Table of Contents -->
      <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <h3 class="font-['Playfair_Display'] text-lg font-bold text-[var(--accent)] mb-4">Contents</h3>
        <nav class="space-y-2">
          <a href="#overview" class="block text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] 
                                    transition-colors py-1 pl-3 border-l-2 border-transparent 
                                    hover:border-[var(--accent)]">
            Overview
          </a>
          <!-- repeat for each section -->
        </nav>
      </div>

      <!-- External Links -->
      <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
        <h3 class="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">External Links</h3>
        <div class="space-y-2">
          <a href="..." class="flex items-center gap-2 text-sm text-[var(--accent)] hover:underline">
            <span>→</span> Smithsonian GVP
          </a>
        </div>
      </div>
    </div>
  </aside>
</div>
```

### COUNTRY PAGE

```
<!-- Hero -->
<div class="mb-10">
  <h1 class="font-['Playfair_Display'] text-4xl md:text-5xl font-bold mb-3">
    Volcanoes in <span class="text-[var(--accent)]">Iceland</span>
  </h1>
  
  <!-- Stats bar -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
    <div class="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 text-center">
      <div class="font-mono text-3xl font-bold text-[var(--accent)]">35</div>
      <div class="text-xs text-[var(--text-muted)] uppercase tracking-wider mt-1">Total Volcanoes</div>
    </div>
    <!-- Repeat: Most Active, Highest, Most Recent -->
  </div>
</div>

<!-- Sections: same H2 style, prose style as volcano page -->

<!-- Volcano Table -->
<section class="mb-10">
  <h2 ...>All Volcanoes in Iceland</h2>
  <!-- Same table styling as comparison tables but with sortable column headers -->
  <!-- Volcano names that have profile pages should link with amber color -->
</section>

<!-- FAQs + Facts: same components -->
```

### SPECIAL / RANKING PAGES

Same layout as country pages but single-column. Ranking pages emphasize the ranked table at the top.

### FOOTER

```
<footer class="bg-[var(--bg-elevated)] border-t border-[var(--border)] mt-20">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <!-- Column 1: Featured Volcanoes -->
      <div>
        <h4 class="font-['Playfair_Display'] text-[var(--accent)] font-bold mb-4">Featured Volcanoes</h4>
        <ul class="space-y-2">
          <li><a href="..." class="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">Kilauea</a></li>
        </ul>
      </div>
      <!-- Columns 2-4: Countries, Explore, About -->
    </div>
    <div class="border-t border-[var(--border)] mt-8 pt-8 text-center text-xs text-[var(--text-muted)]">
      © 2026 VolcanoAtlas. Data sourced from the Smithsonian Global Volcanism Program.
    </div>
  </div>
</footer>
```

---

## Implementation Checklist

1. [ ] Add Google Fonts (Playfair Display, Source Sans 3, JetBrains Mono) to layout.tsx
2. [ ] Set CSS variables in globals.css
3. [ ] Replace ALL page templates with the exact specs above
4. [ ] Every page content wrapped in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
5. [ ] Volcano page: 2-column layout with sticky sidebar
6. [ ] Quick Answer box: amber left border + amber tinted background
7. [ ] All H2s: Playfair Display + left amber border
8. [ ] All cards: bg-card + border + rounded-xl + p-6
9. [ ] Notable eruptions: individual cards with VEI/death badges
10. [ ] Eruption timeline: vertical line with amber dots
11. [ ] Facts: numbered with amber circles
12. [ ] FAQs: details/summary accordion with chevron
13. [ ] Comparison tables: amber headers, alternating rows
14. [ ] Featured volcano cards: hover amber border + arrow animation
15. [ ] Country grid: centered numbers, clean hover
16. [ ] Footer: 4-column, proper padding, never cut off
17. [ ] Monospace font for all numbers (elevations, coordinates, years, VEI)
