examination-portal/                 # Root project folder
├── backend/                        # ← Backend folder
│   ├── src/                        # ← Source code folder
│   │   ├── controllers/            # ← API logic (authController.ts, etc.)
│   │   ├── models/                 # ← Database models
│   │   ├── routes/                 # ← API routes (authRoutes.ts, etc.)
│   │   ├── middleware/             # ← Auth middleware, validators
│   │   ├── config/                 # ← Database config, schema.sql
│   │   ├── utils/                  # ← Helper functions (jwt.ts, password.ts)
│   │   └── index.ts                # ← Main server file
│   ├── node_modules/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                        # ← Environment variables
│   └── dist/                       # ← Compiled JS (after build)
│
└── frontend/                       # ← Frontend folder
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── contexts/
    │   ├── types/
    │   ├── utils/
    │   ├── App.tsx
    │   └── main.tsx
    ├── node_modules/
    ├── package.json
    ├── tsconfig.json
    ├── .env
    └── index.html