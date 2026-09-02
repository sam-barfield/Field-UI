# Field Design System

**Field** is a professional, high-craft design system tailored for dark-themed environments (with light theme parity), featuring minimal and inheritable design tokens, a first-class React + TypeScript component library, an interactive living sticker sheet, and a live visual theme editor with instant code export.

---

## ⚡ Quick Start

### 1. Install and Run the Interactive Showcase
```bash
# Install dependencies across all packages
npm install

# Start the interactive Sticker Sheet & Theme Editor
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Monorepo Architecture

| Package / Directory | Purpose |
|:---|:---|
| [`packages/tokens`](./packages/tokens) | Minimal, 3-tier design token engine (primitives, dark/light semantics, presets, W3C DTCG JSON, and CSS compiler) |
| [`packages/react`](./packages/react) | First-class React + TypeScript client library (`@field/react`) with 35+ accessible components |
| [`apps/showcase`](./apps/showcase) | Interactive application featuring the **Component Catalog**, **Living Sticker Sheet**, **Theme Editor**, **Real-World Demos & Cloud Terminal**, and **Documentation** |
| [`docs/DESIGN_PHILOSOPHY.md`](./docs/DESIGN_PHILOSOPHY.md) | Design rationale, tactical aesthetics, token inheritance model, and accessibility standards |
| [`docs/AGENTS.md`](./docs/AGENTS.md) | Dedicated LLM & AI coding assistant guide with import contracts, recipes, and anti-hallucination rules |
| [`docs/COMPONENT_MANIFEST.json`](./docs/COMPONENT_MANIFEST.json) | Machine-readable component catalog with props, types, and descriptions for agent structured tool calling |

---

## 🎨 Design Aesthetic: Tactical & Smart

Field deliberately rejects generic AI / template boilerplate:
- **Obsidian Baseline**: Deep, cool-toned dark surfaces (`#090B0E`, `#11141B`, `#171B24`) that maximize contrast while eliminating visual fatigue.
- **1px Micro-Luminescence**: Tactile 1px borders with inset top-edge specular highlights (`inset 0 1px 0 rgba(255, 255, 255, 0.12)`).
- **Tabular Precision**: Figures and KPI metrics are rendered with monospace tabular numerals (`font-variant-numeric: tabular-nums`).
- **Snappy Physics**: Transitions utilize spring-like cubic beziers (`cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 🛠️ Using `@field/react` in your React / TypeScript App

```tsx
import '@field/react/styles/field.css';
import { ThemeProvider, Button, Card, StatCard, TextInput } from '@field/react';

export function Dashboard() {
  return (
    <ThemeProvider defaultMode="dark">
      <StatCard
        label="SYSTEM LATENCY"
        value="14.8 ms"
        delta={{ value: "-3.1 ms", trend: "up" }}
      />
      <Button variant="primary">Deploy Node</Button>
    </ThemeProvider>
  );
}
```

---

## 🤖 Working with AI Agents

When prompting an AI assistant (Antigravity, Claude, ChatGPT, Cursor) to write components with Field:
- Point the agent to [docs/AGENTS.md](./docs/AGENTS.md).
- Use the **Agent Prompt Generator** tab in the showcase app to copy ready-to-use prompt templates for any component or pattern.
