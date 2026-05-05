# 🤖 ReviewMind — Your AI Senior Engineer

> **"Your AI senior engineer, reviewing every PR before humans do."**

**ReviewMind** is a self-hostable, privacy-first, LLM-agnostic code review bot designed to run natively within your GitHub workflows. It provides intelligent, multi-pass reviews of your Pull Requests, catching logic errors, security vulnerabilities, and style violations—all without vendor lock-in.

---

## 🌟 Signature "Wow" Features

| Feature | Why It Stands Out |
| :--- | :--- |
| **🎯 Inline PR comments** | Feels like a real code reviewer, not a bot |
| **🔁 Model-agnostic** | Works with OpenAI, Anthropic, or 100% local Ollama |
| **📈 Code Health Score** | Gives repos a score — teams compete to improve it |
| **🛡️ OWASP-mapped security** | Enterprise teams love compliance-ready output |
| **🖥️ Self-hosted dashboard** | No SaaS lock-in — huge appeal to privacy-focused orgs |
| **🤖 Dogfoods itself** | The repo uses its own bot — builds trust instantly |
| **📬 Weekly digest** | Passive reminder that keeps sponsors engaged |
| **📖 Learning mode** | Explains why something is wrong, not just that it is |

## 🏗️ High-Level Architecture

The project is structured into modular components to ensure scalability and ease of extension:

- `action/` — GitHub Action entry point and PR interaction logic.
- `engine/` — Core AI orchestration, chunking diffs, and deduplicating suggestions.
- `providers/` — Plug-and-play LLM adapters (OpenAI, Anthropic, Gemini, Ollama).
- `rules/` — Language and framework-specific rule sets.
- `security/` — Dedicated scanners for secrets, injections, and OWASP mapping.
- `dashboard/` — A self-hosted Web UI for managing rules, reviewing analytics, and tracking time saved.
- `api/` — REST API powering the dashboard.
- `analytics/` — Metrics collection and health scoring.

## ⚙️ Configuration

A single `.reviewmind.yml` in your repository controls everything from model selection to rule overrides.

## 💰 Sponsorship Funnel

Support the open-source core of ReviewMind and gain access to premium features:

- ☕ **$5/mo** → Supporter badge + name in README
- 🚀 **$15/mo** → Priority issue support
- 🏢 **$50/mo** → Team dashboard access + weekly reports
- 💎 **$200/mo** → Custom rules consultation + SLA support

## 🗺️ Build Roadmap

### Phase 1 — MVP
- Core GitHub Action
- OpenAI + Anthropic providers
- Security + Logic review passes
- Inline PR comments

### Phase 2 — Traction
- Ollama local model support
- Self-hosted dashboard v1
- Auto stack detection
- OWASP security mapping

### Phase 3 — Growth
- Weekly digest emails
- Code Health Score
- Developer insights analytics
- Custom rules via YAML

### Phase 4 — Enterprise Pull
- Jira / Linear / Slack integrations
- PDF security reports
- SSO / org-level controls
- Audit logs
