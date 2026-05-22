# Project Instructions: Nitun Sir Crowdfunding

This file provides foundational mandates for Gemini CLI sessions within this workspace. These instructions take precedence over general defaults.

## Session Startup Protocol

At the beginning of every new session, you **MUST** read the following files to synchronize with the project's state, memory, and architectural standards:

1.  **.gemini-memory/index.json** & **.gemini-memory/contexts.json**: Contains the historical log of tasks, solutions, and key codebases.
2.  **gemini_local_memory_prompt.md**: Instructions on how to record and retrieve project memory.
3.  **gemini_memory_commands.md**: Standardized commands for managing the local memory system.
4.  **gemini_memory_schema.md**: The JSON schema and structure for memory entries.

## Core Architecture
- **Stack**: MERN (React 19, Vite, Express 5, MongoDB/Mongoose).
- **Auth**: JWT via httpOnly cookies.
- **Payments**: Dual integration (SSLCommerz for BDT, Stripe for USD).

## Workflow Mandates
- Always check the memory index before starting a complex task to see if related work has been done.
- Update the memory index after completing significant milestones or architectural changes.
- **NEVER** start the backend or frontend server autonomously. Always wait for the user to do so or ask for permission.
- If you need logs, error messages, or status updates from the browser console or the server terminal, explicitly ask the user to provide them.
