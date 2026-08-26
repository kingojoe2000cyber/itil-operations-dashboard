# Richmond Kwadwo Sarpong — ITIL Operations Command Center

A responsive, GitHub Pages-ready IT service management dashboard developed from the supplied IT Infrastructure Library reference. It brings all 12 operating domains and 75 listed templates, policies, reports and checklists into one connected working application, together with Richmond's public professional portfolio and an offline knowledge assistant.

## What works

- Executive command overview with calculated work, priority, health and library indicators
- All original headings and resources, with a distinct matching icon for every card
- Connected incident, problem, change, release, recovery, configuration, testing, security, service and asset records
- Workflow advancement from Open through In Progress, Review, Monitoring and Closed
- Search across modules, templates and records
- Status and priority filtering
- Module workspaces with resources, records and related-practice links
- Editable template preview and Markdown download for every listed resource
- Dedicated Download Center with a combined 75-resource template pack, professional profile, project portfolio and abbreviation glossary
- Searchable glossary covering ITIL, ITSM, cybersecurity, continuity, governance, change and testing abbreviations
- Public-safe professional profile, qualifications, leadership experience, capabilities and portfolio project cards
- Offline knowledge assistant covering Richmond's public professional profile, projects, dashboard functions, modules, abbreviations, workflows, downloads, privacy and GitHub deployment
- New-record creation, local device persistence and demonstration-data reset
- CSV work-register export and JSON evidence/workspace export
- Responsive sidebar and mobile layout

## Important operating note

This is a portfolio-quality client-side demonstration. Records are stored in the current browser using `localStorage`; they are not shared between users or devices. The knowledge assistant uses curated content packaged with the application: it does not call a generative-AI service, require an API key or transmit chat messages externally. Public profile content intentionally excludes private contact, family, credential and confidential institutional information. A production deployment would normally add authenticated users, server-side role-based access control, a database, protected evidence storage, backups and centralized audit logging.

## Run locally

Requirements: Node.js 22 or later.

```bash
npm ci
npm run dev
```

Open the local URL shown in the terminal.

## Deploy on GitHub Pages

1. Create a new GitHub repository.
2. Upload or push this complete project to the repository's `main` branch.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, select **GitHub Actions** as the source.
5. Open the **Actions** tab and run **Deploy ITIL dashboard to GitHub Pages**, or push a new commit to `main`.
6. When the workflow succeeds, GitHub displays the live Pages URL in the deployment summary.

The included workflow automatically detects the repository name and configures the correct GitHub Pages base path.

## Main source files

- `app/page.tsx` — dashboard interface and interactive workflows
- `lib/itil-data.ts` — 12-domain catalogue, 75 resources and sample linked records
- `lib/assistant-data.ts` — public professional content, projects, glossary, downloads and offline assistant knowledge
- `app/globals.css` — visual system and responsive dashboard styling
- `.github/workflows/deploy-pages.yml` — automatic GitHub Pages build and deployment
- `next.config.mjs` — conditional static export configuration for GitHub Pages

## Disclaimer

The dashboard is an independent portfolio implementation. ITIL is a registered trademark of PeopleCert. This project is not affiliated with or endorsed by PeopleCert, and the generated working templates should be reviewed and tailored before organizational use.
