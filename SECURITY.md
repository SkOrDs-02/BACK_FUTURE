# Security Policy

## Supported versions

Security updates are applied to the `main` branch only.

## Reporting a vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Please report security issues via GitHub's private security advisory system:

👉 **[Open a private security advisory](https://github.com/Skords-01/BACK_FUTURE/security/advisories/new)**

Alternatively, contact the repository owner directly via GitHub: [@Skords-01](https://github.com/Skords-01).

Please include:
- Description of the vulnerability and its potential impact
- Steps to reproduce or proof-of-concept
- Affected component (content schema, analytics config, CSP headers, etc.)

We aim to respond within **72 hours** and to publish a fix within **14 days** for confirmed vulnerabilities.

## Scope

This is a static educational site with no user accounts, no payment processing, and no server-side execution. The main attack surfaces are:

- **Content injection** via malicious frontmatter in `content/facts/` (mitigated by Zod schema validation at build time)
- **Cross-site scripting** via inline scripts (mitigated by CSP headers in `vercel.json` / `netlify.toml`)
- **Dependency vulnerabilities** in npm packages (monitored via Dependabot)

Out of scope: social engineering, volumetric attacks, issues in third-party services (Vercel, PostHog, Sentry).
