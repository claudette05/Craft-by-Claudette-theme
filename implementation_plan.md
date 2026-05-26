# Replace Discover What's New with Editable Lookbook

## Goal Description
Replace the "See What's New Here" product grid on the homepage with a new **Customer Love Lookbook** component. The lookbook can display:
- A single cover image with text overlay and a call‑to‑action button, **or**
- A collage of images selected by the admin, **or**
- A carousel that mixes both styles (cover + collage slides).
All content (images, overlay titles, descriptions, button text & URL, display mode) must be fully editable via the admin dashboard and persisted in the database. The design will feature glass‑morphism, subtle micro‑animations and responsive layout.

## User Review Required
> [!IMPORTANT]
> Review the expanded data model, the three display modes, and the admin UI layout. Approve before implementation.

## Open Questions
> [!WARNING]
> None – the design is now fully specified based on your clarification.

## Proposed Changes
---
### Data Model & Service
- **[MODIFY] `services/databaseService.ts`**
  - Add methods `getLookbookConfig(): Promise<LookbookConfig>` and `saveLookbookConfig(config: LookbookConfig): Promise<void>`.
- **[MODIFY] `types.ts`** (or create if absent)
  - Define:
```ts
export type LookbookMode = 'cover' | 'collage' | 'carousel';
export interface LookbookConfig {
  mode: LookbookMode;
  coverImageUrl?: string;          // used for 'cover' or first slide of carousel
  overlayTitle?: string;
  overlaySubtitle?: string;
  buttonText?: string;
  buttonUrl?: string;             // defaults to '/customerLove'
  collageImageUrls?: string[];    // used for 'collage' or additional slides
}
```
- Update any existing context typings if needed.

### Application Context
- **[MODIFY] `context/AppContext.tsx`**
  - Add state `lookbookConfig` with loader similar to other configs.
  - Load config in `loadAppData` alongside other data.
  - Provide `updateLookbookConfig` method that calls the new service method and updates context state.

### Frontend Component
- **[NEW] `components/Lookbook.tsx`**
  - Reads `lookbookConfig` from context.
  - Renders based on `mode`:
    - **cover** – full‑width image with dark gradient overlay, overlayTitle/subtitle centered, CTA button linking to `buttonUrl`.
    - **collage** – a responsive CSS‑grid of images (2‑3 columns on desktop, 1 column on mobile) with a subtle glass backdrop.
    - **carousel** – uses `framer‑motion`/`react‑slick‑carousel` (or simple CSS slider) to cycle through slides; each slide can be a cover style or a collage tile.
  - Applies glass‑morphism via `backdrop-filter: blur(12px)` and semi‑transparent layer.
  - Adds subtle hover scaling (`whileHover={{ scale: 1.02 }}`) and entry fade‑in animation.
  - Fully responsive – stacks to vertical on narrow viewports.

### Homepage Integration
- **[MODIFY] `App.tsx`**
  - Locate the `ProductGrid` block with title `"See What's New Here"` (around lines 350‑360).
  - Replace that block with `<Lookbook />` component and add the import at the top.

### Admin Dashboard UI
- **[MODIFY] `components/AdminDashboard.tsx`** (or a dedicated tab/component)
  - Add a new **"Lookbook"** section.
  - Form elements:
    - Radio buttons or a select for `mode` (Cover, Collage, Carousel).
    - Image uploader (`uploadImage`) for `coverImageUrl`.
    - Multi‑image uploader (allow selecting multiple files) for `collageImageUrls`.
    - `FormInput` fields for `overlayTitle`, `overlaySubtitle`, `buttonText`, `buttonUrl`.
  - Live preview area that renders the Lookbook component with the current draft config.
  - Save button calls `updateLookbookConfig` and shows a toast.

- **[MODIFY] `components/admin/pages/AdminSettingsPage.tsx`** (optional) – expose a shortcut link to the Lookbook tab if you prefer a single‑page settings layout.

### Styling
- **[MODIFY] `index.css`** (or appropriate CSS module)
  - Add `.lookbook` base class with:
    ```css
    .lookbook {
      position: relative;
      overflow: hidden;
      border-radius: 1rem;
      backdrop-filter: blur(12px);
      background: rgba(255,255,255,0.15);
    }
    .lookbook::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
    }
    ```
  - Define responsive typography variables for overlay text.
  - Add carousel slide transitions (`.lookbook-slide { transition: transform 0.4s ease; }`).

### Verification Plan
- **Manual**: Log in as admin, switch between modes, upload images, edit overlay text, save, and confirm the homepage updates immediately.
- **Link Test**: Click the CTA button and verify navigation to `/customerLove` (or custom URL).
- **Persistence**: Reload the page; the chosen mode and assets should persist.
- **Responsive Check**: Resize browser to mobile width; collage should become a single column, carousel should be swipe‑able.
- **Performance**: Ensure lazy‑loading of images for carousel/collage to keep initial load fast.

---
