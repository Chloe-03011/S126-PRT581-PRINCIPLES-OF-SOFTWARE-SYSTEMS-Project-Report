# Gemini CLI Memory - User Commands

Copy these commands and paste them into Gemini CLI to interact with your local memory system.

## Daily Commands

### See today's contexts
```
show today
```
**Gemini responds with:**
```
Today's Contexts (2025-05-11):
1. [10:30] Fix JWT token refresh logic
2. [14:15] Add database indexing for user queries
3. [16:45] Debug React hook lifecycle issue
```

### See this week's contexts
```
show week
```

### Search for a specific context
```
search: mongoose schema
```
or
```
search: deployment error
```

---

## When Starting a New Session

### First thing to say:
```
Load my project memory
```
**Gemini will:**
- Initialize `.gemini-memory/` if needed
- Show today's contexts
- Be ready to use them automatically

---

## During a Coding Session

### Save current solution as context
```
Save this context: [suggested title here]
```

Example:
```
Save this context: Fix infinite loop in useEffect dependency
```

**Gemini will confirm and store it locally**

### Or just finish the problem, Gemini will ask:
```
Should I save this as context? Title: [auto-suggested]? (y/n)
```

---

## Context Management

### Clear/archive old contexts
```
archive old contexts
```
(Gemini moves contexts older than 30 days to `contexts-archive.json`)

### Delete a specific context
```
delete context: 20250511-143022-fix-auth-token
```

### Show full context details
```
get context: JWT token refresh
```
(Shows everything: summary, solution, files modified, tokens used)

---

## When Switching Sessions (Quota Reset)

**After changing auth and starting fresh:**

1. **Tell Gemini:**
   ```
   New session - load my memory
   ```

2. **Gemini will automatically:**
   - Load all today's contexts
   - Know what you've been working on
   - Retrieve relevant context when you ask questions

3. **Example:** You ask the same type of question:
   ```
   How do I handle authentication better?
   ```
   Gemini responds:
   ```
   [Using saved context from 10:30] You already fixed JWT refresh logic today...
   ```

---

## Pro Tips

### For efficiency, use:
- `show today` → Quick reference of what you've done
- `search: keyword` → Find related past solutions
- Let Gemini auto-retrieve contexts (don't ask manually every time)

### Don't repeat yourself:
Instead of re-explaining:
```
I need to fix auth again
```
Just say:
```
Similar to earlier [10:30 context], but for login API endpoint
```

### Review before saving:
Don't save every small fix. Save major problems:
- ✅ `[Save] Fix authentication flow from scratch`
- ❌ `[Skip] Change variable name from `user` to `currentUser`

---

## Sample Conversation Flow

**Session 1 (10:30 AM):**
```
You: Load my project memory
Gemini: Ready. `.gemini-memory/` initialized. No contexts yet today.

You: How do I fix JWT token refresh?
Gemini: [solves problem]

You: Save this context: Fix JWT token refresh logic
Gemini: ✓ Saved to memory (ID: 20250511-103022-jwt-refresh)
```

**Later (14:30 AM - hit quota limit, switched auth):**
```
You: Load my project memory
Gemini: Today's contexts:
1. [10:30] Fix JWT token refresh logic

You: How do I add database indexing?
Gemini: [solves problem] Note: Your JWT fix earlier...

You: Save this as database indexing
Gemini: ✓ Saved
```

**Next day (new project, similar issue):**
```
You: Load my project memory
Gemini: Today's contexts: (empty - starting fresh)
```

---

## Troubleshooting

**"Gemini isn't remembering contexts"**
- Say: `Load my project memory` first
- Check `.gemini-memory/contexts.json` exists in project folder
- Verify you said "Save this context" after solving

**"Contexts are taking too many tokens"**
- Gemini should auto-limit to top 2 contexts max
- If not, say: `Use only essential context (max 150 tokens)`

**"I want to see all contexts from a past week"**
```
show contexts from May 5-11
```

---

## File Locations
Everything stays here (no auth needed, completely local):
```
your-project/
└── .gemini-memory/
    ├── contexts.json
    ├── index.json
    └── contexts-archive.json (auto-created for old ones)
```

✅ **Privacy**: Nothing leaves your computer
✅ **Offline**: Works without internet (memory is local)
✅ **One command**: `show today` gets everything
