# Folix — Instant Portfolio Generator

A modern, responsive, client-side AI Portfolio Website Generator built for simplicity and high performance.

## 🌟 Live Demo & URL Access

- **Landing & Generator:** [http://localhost:5173/](http://localhost:5173/)
- **Sample Published Portfolio:** [http://localhost:5173/p/rafeek](http://localhost:5173/p/rafeek)

---

## 🚀 Key Features

1. **Step 1: Modern Landing Page**
   - Clean, SaaS aesthetic inspired by Linear, Framer, and Vercel.
   - Hero: *"Turn Your Resume Into a Stunning Portfolio"*.
   - Streamlined 3-step workflow explanation (Upload Resume → Choose Template → Publish).
   - Interactive showcase of 5 curated templates with live preview.
   - Quick "My Portfolios" modal to manage all published sites.

2. **Step 2: Resume Upload & Extraction**
   - Supports **PDF (.pdf)**, **Word Document (.docx)**, and text files.
   - Full drag-and-drop zone and file browser.
   - Automated client-side extraction:
     - Full Name
     - Professional Title / Designation
     - Professional Summary
     - Email Address
     - Phone Number
     - Location
     - Skills & Competencies (deduplicated tag pills)
     - Work Experience (Company, Role, Dates, Description, Highlights)
     - Academic Background & Education
     - Key Projects & Deliverables
     - Certifications & Accreditations
     - Social & Web Links (GitHub, LinkedIn, Website, Twitter/X)
   - 1-Click Demo Resumes: Test immediately with **Mohamed Rafeek** (Full Stack & AI Engineer) or **Elena Rostova** (Principal UX Designer).

3. **Step 3: Extracted Resume Editor**
   - Tabbed / structured editor allowing users to review, edit, add, or delete any parsed field.
   - Leave empty fields clean rather than creating fake data.

4. **Step 4: 5 Predefined Templates**
   - **Minimal:** Clean, simple, editorial typography, generous whitespace.
   - **Modern:** Contemporary dark SaaS layout with ambient glow gradients, glassmorphism cards, and badge accents.
   - **Developer:** Technical terminal aesthetic with CLI banners, commit-history career timelines, and repository project cards.
   - **Creative:** Expressive design for creatives with warm lighting, bold serif accents, large showcase cards, and playful typography.
   - **Professional:** Structured corporate executive portfolio suitable for consultants, engineering leaders, and job seekers.

5. **Step 5: Live Portfolio Preview**
   - Real-time dynamic preview populated with your extracted data.
   - Device viewport toggles (**Desktop**, **Tablet**, **Mobile**).
   - Quick template switcher pills right in the preview topbar.

6. **Step 6: Publishing & Vanity URLs**
   - "Publish Portfolio" modal with custom vanity name input (e.g. `rafeek` → `/p/rafeek`).
   - URL validation, lowercase conversion, and automatic space-to-hyphen replacement.
   - **Overwrite Logic:** No duplicate name restrictions — newly published portfolios with the same name cleanly overwrite the previous version.
   - **Confetti Celebration:** Festive particle physics animation on publication.
   - Copy URL and View Live Portfolio actions.

7. **Step 7: Published Portfolio Page (`/p/:name`)**
   - Responsive layout with working navigation, social links, contact CTA, and footer.
   - Floating visitor/owner pill to easily edit data or copy the shareable link.
   - Clean **404 page** with "Create This Portfolio" button if the slug does not exist.
   - Persistent `localStorage` storage that survives page refreshes.

---

## 🛠️ Technical Details

- **Port:** `5173`
- **Architecture:** 100% Client-Side SPA with native Node.js SPA HTTP static server.
- **Storage:** Browser `localStorage` (`portfolioai_portfolios`).
- **No Backend / Database / Authentication Required** — Zero friction setup.

### Running Locally

```bash
# Start the local server
npm run dev
# or
node server.js
```

Visit [http://localhost:5173/](http://localhost:5173/) in your web browser.
