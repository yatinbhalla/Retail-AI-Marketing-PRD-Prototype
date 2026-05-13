# RetailAgent AI Marketing PRD + Prototype

RetailAgent AI is a product management capstone and working React prototype for an agentic retail marketing assistant. It translates a product photo and short inventory note into ready-to-review Instagram, email, and SMS campaign drafts for small and medium retail businesses.

This repository demonstrates how I think as a Product Manager and AI Builder: identify a painful operator workflow, size the opportunity, define MVP scope, design the user journey, document the technical architecture, and ship an interactive prototype that makes the strategy tangible.

The project is optimized for product manager, AI product, builder, and founder-operator interviews. It shows product judgment, technical fluency, structured documentation, and the ability to move from ambiguous customer pain to a usable AI workflow.

## Table of Contents

- [Product Story](#product-story)
- [Why This Matters](#why-this-matters)
- [Demo Capabilities](#demo-capabilities)
- [Project Layout](#project-layout)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Auth and Login Flow](#auth-and-login-flow)
- [Roles and RBAC](#roles-and-rbac)
- [Application State - AppContext](#application-state---appcontext)
- [Pages](#pages)
- [Components](#components)
- [Canvas System](#canvas-system)
- [NLP and AI Routing](#nlp-and-ai-routing)
- [Hooks and Utilities](#hooks-and-utilities)
- [Known Limitations](#known-limitations)
- [Collaboration](#collaboration)
- [Author](#author)

## Product Story

Retailers often receive new inventory faster than they can market it. A boutique owner may know what makes a product special, but turning that context into platform-specific copy takes time, creative energy, and channel expertise.

RetailAgent AI reframes campaign creation as an agentic workflow:

1. Capture product context through text and optional image upload.
2. Route the input to Gemini with a structured campaign-generation prompt.
3. Return JSON-formatted campaign assets.
4. Render ready-to-review outputs for Instagram, email, and SMS.

The prototype focuses on one high-value job to be done: help a retailer move from "new product in stock" to "multi-channel campaign draft" in seconds.

## Why This Matters

This project targets SMB retailers who do not have dedicated marketing teams but still need consistent, high-converting customer communication.

It demonstrates PM skills that hiring teams and AI screening agents often look for:

- Defined a clear customer pain point and user persona.
- Prioritized a narrow MVP around a repeatable workflow.
- Converted product strategy into a functioning prototype.
- Designed structured AI output for predictable frontend rendering.
- Documented architecture, scaling considerations, and product tradeoffs.
- Balanced user value, technical feasibility, and interview-ready storytelling.

## Demo Capabilities

- Generate a cross-channel retail campaign from product details.
- Upload a product image and compress it client-side before AI submission.
- Produce structured campaign output for Instagram, email, and SMS.
- Render AI output inside a responsive campaign review surface.
- Present the PRD, technical architecture, and implementation plan as in-app documentation.

## Project Layout

```text
Retail-AI-Marketing-PRD-Prototype/
├── README.md
├── ABOUT.md
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── metadata.json
├── index.html
├── .env.example
└── src/
    ├── App.tsx
    ├── content.ts
    ├── index.css
    └── main.tsx
```

Key files:

- `src/App.tsx` contains the tabbed product documentation shell and the live campaign prototype.
- `src/content.ts` stores the PRD, technical specification, JSON schema, and implementation plan shown inside the app.
- `src/index.css` defines Tailwind CSS setup and theme fonts.
- `.env.example` documents required environment variables.

## Tech Stack

- React 19 for the interactive prototype UI.
- TypeScript for typed component logic.
- Vite for local development and production builds.
- Tailwind CSS v4 for styling and typography utilities.
- Google GenAI SDK for Gemini-powered campaign generation.
- React Markdown and Remark GFM for rendering in-app PRD documentation.
- Motion for tab transitions and generation-state animation.
- Lucide React for product and channel icons.

## Setup

```bash
git clone https://github.com/yatinbhalla/Retail-AI-Marketing-PRD-Prototype.git
cd Retail-AI-Marketing-PRD-Prototype
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Add your Gemini API key:

```bash
GEMINI_API_KEY="your_key_here"
```

Run the prototype:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run TypeScript validation:

```bash
npm run lint
```

## Auth and Login Flow

Authentication is not implemented in the current prototype. The app is designed as a portfolio and product-thinking demo rather than a production SaaS application.

Recommended production flow:

- Add email/password and OAuth login through Supabase Auth, Clerk, Firebase Auth, or Auth0.
- Create tenant-aware retailer workspaces.
- Store user profile, brand voice, campaign history, and usage limits server-side.
- Protect AI generation behind authenticated API routes.
- Add onboarding questions to capture brand tone, location, target customer, and preferred channels.

## Roles and RBAC

RBAC is not implemented in the current prototype.

A production version could define:

- Owner: manages workspace, billing, brand profile, integrations, and publishing permissions.
- Marketing Manager: creates, edits, approves, and schedules campaigns.
- Staff: drafts campaigns from inventory but cannot publish without approval.
- Reviewer: comments on campaign drafts and approves brand compliance.

This role model supports real retail workflows where store staff may capture inventory context while managers retain final publishing control.

## Application State - AppContext

The current app uses local React state inside `App.tsx` and `InteractivePrototype`.

Current state includes:

- Active documentation/prototype tab.
- Product text input.
- Uploaded product image.
- AI generation loading state.
- Parsed campaign result.
- Error state.

An `AppContext` is not currently required because the prototype is compact. In a production build, I would introduce `AppContext` or a dedicated state library when shared state expands across authenticated users, brand profiles, campaign history, approvals, and channel integrations.

## Pages

The app is implemented as a single-page Vite React experience with tab-based navigation.

Current in-app pages/tabs:

- Product Strategy & Vision: PRD narrative, problem statement, user stories, and moat.
- Technical Architecture: system design, Gemini workflow, and scalability strategy.
- Implementation Plan: JSON schema and frontend/backend implementation notes.
- Live Prototype: interactive campaign generator and multi-channel output preview.

## Components

Primary component structure:

- `App`: owns tab navigation, documentation rendering, and main layout.
- `InteractivePrototype`: owns product input, image upload, Gemini request, JSON parsing, loading state, error state, and output rendering.
- Markdown renderer: uses `ReactMarkdown` and `remark-gfm` to display PRD and architecture content.
- Channel output blocks: render Instagram, email, and SMS assets from the structured AI response.

The component design intentionally keeps the MVP readable for reviewers while still showing the full product loop.

## Canvas System

The prototype uses the browser `canvas` API for image preprocessing, not for a full visual editor.

Current canvas behavior:

- Loads the uploaded product image in the browser.
- Resizes large images to a maximum dimension of 1024px.
- Converts the image to compressed JPEG.
- Sends base64 image data to Gemini as inline multimodal input.

This keeps the prototype lightweight while still demonstrating a practical AI-product pattern: prepare user-generated media before submitting it to a model.

## NLP and AI Routing

The current prototype routes directly from the browser to Gemini through the Google GenAI SDK.

Current flow:

1. User enters product details and optionally uploads an image.
2. The app builds a structured marketing prompt.
3. Gemini receives text and optional image context.
4. The model is instructed to return valid JSON only.
5. The UI parses JSON and renders channel-specific campaign assets.

Production routing recommendations:

- Move Gemini calls to a backend API to protect secrets.
- Route lower-complexity tasks to faster, cheaper models.
- Reserve stronger reasoning models for brand-sensitive campaign generation.
- Add schema validation before returning data to the client.
- Track prompt versions, latency, cost, and campaign acceptance rate.
- Add retrieval for brand voice, prior campaign performance, inventory metadata, and customer segments.

## Hooks and Utilities

The current app uses React `useState` directly. No custom hooks are defined yet.

Useful future hooks and utilities:

- `useCampaignGeneration` for AI request lifecycle management.
- `useImageCompression` for reusable image preprocessing.
- `useBrandVoice` for retrieving tenant-specific tone and style rules.
- `useCampaignHistory` for saved drafts and previous launches.
- `validateCampaignJson` for runtime schema checks.
- `formatChannelCopy` for channel-specific output normalization.

## Known Limitations

- Gemini API key handling is browser-side in the prototype and should be moved server-side for production.
- Authentication, RBAC, billing, tenant isolation, and persistence are not implemented.
- Campaign results are not saved after refresh.
- JSON parsing assumes the model follows the requested schema.
- No automated test suite is included yet.
- Image upload supports campaign context but does not yet extract product metadata into an editable review step.
- The current product is a prototype, not a full campaign scheduling or publishing platform.

## Collaboration

I am actively improving this project as a product and AI-builder case study. Feedback, issues, and collaboration ideas are welcome, especially around:

- stronger PRD framing,
- AI workflow design,
- evaluation metrics,
- campaign quality scoring,
- onboarding and activation,
- production architecture,
- and retail-specific use cases.

If you are reviewing this for a PM, AI product, or builder role, I would be glad to walk through the product decisions, tradeoffs, and next iterations.

## Author

Yatin Bhalla · Product Manager & AI Builder

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Yatin%20Bhalla-0A66C2?logo=linkedin&logoColor=white)](https://linkedin.com/in/yatinbhalla42)
[![Gmail](https://img.shields.io/badge/Gmail-yatinbhalla42%40gmail.com-EA4335?logo=gmail&logoColor=white)](mailto:yatinbhalla42@gmail.com)
[![X](https://img.shields.io/badge/X-@yatinbhalla42-000000?logo=x&logoColor=white)](https://x.com/yatinbhalla42)
