/// <mls fileReference="_102020_/l2/skills/molecules/indexGroupPage.ts" enhancement="_blank" />

export const skill = `# Metadata
- Files: l2/molecules/{groupname}/index.ts  +  l2/molecules/{groupname}/index.html
- CustomElement: molecules--{groupname}--index-ActualProjectId
- ClassName: Group{GroupName}Index

# Objective
Create a visual showcase page for a molecule group that presents every component in the group with live interactive examples and a quick-reference decision table. The page serves as both documentation and a live playground, helping developers pick the right component for their context.

# Structure

## index.ts
A Lit Web Component extending StateLitElement, composed of three mandatory sections each implemented as a private method returning TemplateResult.

## index.html
A single line containing only the custom element tag:
<molecules--{groupname}--index-actualProjectId></molecules--{groupname}--index-actualProjectId>

## renderHero()
- A centered header block with a sky-colored pill badge showing the camelCase group name (e.g. groupSelectOne)
- A large bold title with the short human label (e.g. "Select One")
- A 1–2 sentence subtitle describing the shared problem space and hinting at the available implementations

## renderShowcaseCards()
- One card per showcase, stacked vertically inside a max-w-2xl centered column
- A group may show the same component more than once when different configurations deserve separate illustration (e.g. standard vs. bounded)
- Each card has: a colored top accent bar (h-1, unique Tailwind color per card), a header row with the display name on the left and a <code> badge with the kebab-case tag on the right, a one-line subtext describing the interaction context, and a live instance of the component in isEditing mode

## renderReferenceTable()
- Section title: "Quick reference"
- Section subtitle: a short sentence tailored to the group's specific decision — it is NOT a fixed string
- A table with one scenario per row and one column per component (or per configuration when the same component appears with different configs)
- A filled emerald circle (✓) when the component fits the scenario; an em dash (—) otherwise
- Column headers use the same Tailwind color class as each card's accent bar

# Responsibilities
- Declare the custom element with @customElement('molecules--{groupname}--index-actualProjectId')
- Name the class Group{GroupName}Index (PascalCase, e.g. GroupSelectOneIndex)
- Import each component module from its canonical path before using it in the template:
  import '/_actualProjectId_/l2/molecules/{groupname}/{component-name}';
- Declare one @state() property per showcase card (e.g. @state() cardPlan = 'pro')
- Group all showcase state declarations under the comment: // ── Showcase card states ─────────────────────────────────────
- Bind the value to the component correctly by type:
  - String values: attribute binding   value="\${this.cardX}"
  - Boolean / number / null values: property binding   .value=\${this.cardX}
- Update state via @change: @change=\${(e: CustomEvent) => { this.cardX = e.detail.value; }}
- Separate sections with 80-char section banners: // =========================================================================== SECTION NAME
- Compose all three sections in render() inside a single <div class="font-sans min-h-screen">

# Constraints
- index.ts file header must point to _actualProjectId_/l2/molecules/{groupname}/index.ts with enhancement _102020_/l2/enhancementAura
- All three sections (Hero, Showcase Cards, Reference Table) are mandatory; none may be omitted
- Every distinct component in the group must appear in renderReferenceTable()
- Every live showcase instance must receive .isEditing=\${true}
- Do not hardcode hex colors; use only Tailwind utility classes
- Accent bar colors rotate through: violet, emerald, amber, rose, sky, indigo, purple, teal, orange, pink — one distinct color per card

# Notes
- Group descriptions (name, purpose, available implementations) are defined in _102020_/l2/skills/molecules/index.ts — use the corresponding entry's `description` field as the primary source for the hero subtitle and the reference table subtitle.
- Showcase card inner HTML follows this fixed layout:
  <div class="h-1 bg-{color}-500 rounded-t-2xl"></div>
  <div class="p-6">
    <div class="flex items-center justify-between mb-1">
      <p class="text-sm font-bold text-slate-900 dark:text-slate-50">Display Name</p>
      <code class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded">tag-name</code>
    </div>
    <p class="text-xs text-slate-400 mb-5">One-line context description</p>
    <{groupname}--{component} ...></{groupname}--{component}>
  </div>
- Reference table cell for ✓: <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold">✓</span>
- Reference table cell for —: <span class="text-slate-200 dark:text-slate-700 text-sm">—</span>
`;
