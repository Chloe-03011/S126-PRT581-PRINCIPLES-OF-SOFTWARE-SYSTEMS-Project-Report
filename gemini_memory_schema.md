# .gemini-memory/contexts.json Structure

This is what the file should look like:

```json
{
  "project": "my-mern-app",
  "created": "2025-05-11",
  "version": "1.0",
  "contexts": [
    {
      "id": "20250511-143022-fix-auth-token",
      "title": "Fix JWT token refresh logic",
      "date": "2025-05-11",
      "time": "14:30",
      "stack": "mern",
      "keywords": ["jwt", "auth", "token", "refresh", "express"],
      "summary": "JWT refresh token was not updating on login. Fixed by adding token regeneration in middleware.",
      "solution": "Added token rotation in Express middleware after successful login verification",
      "code_files": ["routes/auth.js", "middleware/authCheck.js"],
      "status": "completed",
      "estimated_tokens": 120
    },
    {
      "id": "20250511-101530-mongo-indexing",
      "title": "Add database indexing for user queries",
      "date": "2025-05-11",
      "time": "10:15",
      "stack": "mern",
      "keywords": ["mongodb", "indexing", "performance", "query"],
      "summary": "User queries were slow. Created indexes on email and username fields in MongoDB.",
      "solution": "Added compound index on users collection: {email: 1, createdAt: -1}",
      "code_files": ["models/User.js", "scripts/indexing.js"],
      "status": "completed",
      "estimated_tokens": 85
    }
  ],
  "index": {
    "2025-05-11": ["20250511-143022-fix-auth-token", "20250511-101530-mongo-indexing"],
    "2025-05-10": ["20250510-162200-react-hook-bug"]
  }
}
```

## Quick Reference - What Goes Where

| Field | Example | Purpose |
|-------|---------|---------|
| `id` | `20250511-143022-fix-auth-token` | Unique identifier (timestamp + slug) |
| `title` | `Fix JWT token refresh logic` | 2-5 words, human-readable title for daily list |
| `keywords` | `["jwt", "auth", "token"]` | For search matching (lowercase, comma-separated) |
| `summary` | `JWT refresh token was not updating...` | 1-2 sentence problem description |
| `solution` | `Added token rotation in Express middleware...` | What you did to fix it (NOT code, just explanation) |
| `code_files` | `["routes/auth.js"]` | Which files were modified (for reference, not stored) |
| `stack` | `mern` | Your tech stack for filtering |
| `status` | `completed` | Track progress |

## Index.json (For Speed)
Keep a separate `index.json` for fast lookups:
```json
{
  "byDate": {
    "2025-05-11": ["id1", "id2"],
    "2025-05-10": ["id3"]
  },
  "byKeyword": {
    "jwt": ["id1"],
    "mongodb": ["id2"],
    "react": ["id3"]
  },
  "byStack": {
    "mern": ["id1", "id2"],
    "python": ["id3"]
  }
}
```

## Storage Location
```
your-project-folder/
├── .gemini-memory/
│   ├── contexts.json          (main storage)
│   └── index.json              (fast lookup)
├── src/
├── server/
└── ... (other project files)
```

## Why This Structure?
- ✅ **Lightweight**: ~150 bytes per context (no code duplication)
- ✅ **Searchable**: Index allows keyword matching in milliseconds
- ✅ **Token-efficient**: Gemini loads only title + summary + solution
- ✅ **Dates grouped**: Easy "show today" or "show week" queries
- ✅ **Local only**: Stays in your project, never sent anywhere
