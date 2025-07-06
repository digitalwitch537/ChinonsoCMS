### **Website Redesign Prompt: Project "ChinonsoIT - Ethereal Glass"**

**I. Overall Vision & Mood**

The goal is a breathtaking, modern, and ethereal redesign of the ChinonsoIT website. The aesthetic should feel futuristic, clean, and highly professional, while remaining approachable. The core of this redesign is the **"glassmorphism"** effect, creating a sense of depth and layered information. The entire user interface should feel like interacting with beautifully crafted, floating glass panels against a dynamic, subtly animated background.

**II. Core Design System: Glassmorphism**

A reusable CSS class named `.glass-card` must be created and applied to all primary content containers and cards. This class will be the foundation of our visual style.

*   **Implementation:**
    *   Create a `.glass-card` class in `src/app/globals.css`.
    *   The CSS properties should be exactly as follows, with the border color being theme-aware:
        ```css
        .glass-card {
          background: hsla(220, 25%, 95%, 0.4); /* Semi-transparent light background */
          border-radius: 16px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(5.6px);
          -webkit-backdrop-filter: blur(5.6px);
          border: 1px solid hsla(220, 25%, 95%, 0.5);
          position: relative; /* Crucial for stacking context */
          z-index: 10;
        }
        ```
    *   **For Dark Mode:** The background color should be a semi-transparent dark shade: `background: hsla(224, 71%, 4%, 0.65);` and the border should be a subtle dark accent: `border: 1px solid hsla(224, 30%, 20%, 0.5);`.

**III. Color Palette & Typography**

*   **Color Scheme:** Based on the lavender tag from the provided image, we will establish a sophisticated tri-color palette built on a dark, professional background.
    *   **Background:** A very deep, near-black blue to make the glass elements and highlights pop.
        *   `--background: 224 71% 4%;`
    *   **Accents (for Orbs, Buttons, Links):**
        *   **Primary Accent (Lavender):** A vibrant yet soft lavender. `hsl(250, 80%, 70%)`
        *   **Secondary Accent (Teal):** A cool, sophisticated teal. `hsl(170, 80%, 60%)`
        *   **Tertiary Accent (Pink):** A warm, energetic pink for highlights. `hsl(330, 90%, 70%)`
    *   **Text:**
        *   **Headings:** Pure white (`hsl(0, 0%, 100%)`) for maximum impact.
        *   **Body/Foreground:** A soft, off-white (`hsl(210, 20%, 94%)`) for comfortable reading.
        *   **Muted Foreground:** A light gray for secondary text (`hsl(210, 15%, 65%)`).
*   **Typography:** Continue using the 'Inter' font. Ensure font weights are adjusted for optimal readability on the new dark, dynamic background.

**IV. Background: Animated Orbs**

To achieve a "wow" effect, the static background will be replaced with a dynamic, multi-layered orb animation.

*   **Implementation:**
    *   The `body` tag should have the solid dark background color.
    *   In the root layout file (`src/app/layout.tsx`), add 5-6 `div` elements before the main content.
    *   These `div`s will be the orbs. Style them with a base `.orb` class:
        ```css
        .orb {
          @apply fixed rounded-full -z-10; /* Places them behind the content */
          filter: blur(80px); /* Creates a very soft, diffused glow */
          opacity: 0.5; /* Can be overridden per orb */
        }
        ```
    *   Assign each orb `div` a unique class (`.orb-1`, `.orb-2`, etc.) with a `radial-gradient` background using the accent colors (Lavender, Teal, Pink).
    *   Position each orb using `top`, `bottom`, `left`, `right`, and give them varying `width` and `height` (using `clamp()` for responsiveness is ideal). This creates a scattered, layered composition.
    *   (Optional but recommended) Add a very subtle, slow CSS animation to the orbs to make them gently drift and pulse, creating a living background.

**V. Component-Specific Redesign**

Apply the `.glass-card` style and new color palette throughout the site.

*   **Layout:** Wrap each major `<section>` on the homepage (`#services`, `#blog`, `#portfolio`, `#cta`) with the `.glass-card` class to turn them into floating glass panels.
*   **Nested Glassmorphism:** For sections containing multiple items (Services, Blog, Portfolio), the individual `ServiceCard`, `BlogPostCard`, and `ProjectCard` components should *also* receive the `.glass-card` style. This will create a stunning nested, layered glass effect.
*   **Hero Section:** The entire hero section container should become a single, prominent `.glass-card`.
*   **Navigation & Footer:** Apply a subtle glass effect to the sticky `header` and the `footer` to ensure they are visually integrated into the new design system.
*   **Interactivity:**
    *   On hover, `.glass-card` elements should have a subtle "lift" effect using `transform: translateY(-4px)` and a slightly brighter border to provide user feedback.
    *   Buttons and links should use the primary accent color.

