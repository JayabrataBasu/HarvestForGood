frontend/
├── public/               # Static files
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
├── src/                 # Source files
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable UI components
│   │   ├── common/    # Shared components like Button, Input, etc.
│   │   └── layout/    # Layout components like Header, Footer, etc.
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API services and other business logic
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript type definitions
│   ├── context/       # React context providers
│   ├── styles/        # Global styles and theme
│   ├── App.tsx        # Root component
│   ├── index.tsx      # Entry point
│   └── routes.tsx     # Route definitions
├── package.json        # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project documentation
__________________________________________________________________________________________

frontend/
├── public/               # Static files
│   ├── index.html
│   ├── favicon.ico
│   ├── assets/
│   │   ├── papers/      # Sample PDFs for development
│   │   └── team/        # Team member images
│   └── locales/         # Internationalization files (if needed)
├── src/                 
│   ├── assets/          
│   │   ├── icons/       # SVG icons for academic categories
│   │   ├── illustrations/ # Visual elements for empty states
│   │   └── fonts/       # Custom typography if not using CDN
│   ├── components/      
│   │   ├── common/      
│   │   │   ├── buttons/
│   │   │   ├── cards/   # Research paper cards, team member cards
│   │   │   ├── filters/ # Advanced filter components
│   │   │   └── loaders/ # Skeleton loaders for academic content
│   │   ├── layout/      
│   │   ├── forum/       # Forum-specific components
│   │   │   ├── Thread.tsx
│   │   │   ├── Reply.tsx
│   │   │   └── TagSelector.tsx
│   │   └── research/    # Research paper components
│   │       ├── PaperPreview.tsx
│   │       ├── CitationBlock.tsx
│   │       └── MethodologyBadge.tsx
│   ├── pages/           
│   │   ├── Home/
│   │   ├── About/
│   │   ├── Categories/
│   │   │   ├── index.tsx
│   │   │   └── components/ # Page-specific components
│   │   ├── Search/
│   │   │   ├── index.tsx
│   │   │   ├── components/
│   │   │   └── hooks/    # Search-specific hooks
│   │   └── Forums/
│   ├── hooks/           
│   │   ├── useSearch.ts
│   │   ├── usePagination.ts
│   │   └── useCategories.ts
│   ├── services/        
│   │   ├── api/         # API client configuration
│   │   │   ├── client.ts
│   │   │   └── endpoints.ts
│   │   ├── papers/      # Paper-related services
│   │   └── forum/       # Forum-related services
│   ├── utils/           
│   │   ├── formatters/  # Date, citation formatters
│   │   ├── validators/  # Form validation
│   │   └── analytics/   # Academic usage tracking
│   ├── types/           
│   │   ├── paper.types.ts
│   │   ├── forum.types.ts
│   │   └── filters.types.ts
│   ├── context/         
│   │   ├── SearchContext.tsx
│   │   └── AuthContext.tsx
│   ├── styles/          
│   │   ├── theme/       # Theme configuration
│   │   │   ├── colors.ts
│   │   │   ├── typography.ts
│   │   │   └── spacing.ts
│   │   ├── global.css
│   │   └── mixins/      # SCSS/CSS mixins
│   ├── constants/       # App-wide constants
│   │   ├── categories.ts
│   │   └── routes.ts
│   ├── features/        # Feature-based modules (optional)
│   ├── App.tsx         
│   ├── index.tsx       
│   └── routes.tsx      
├── config/              # Build configuration
│   ├── webpack.config.js
│   └── jest.config.js
├── package.json        
├── tsconfig.json       
└── README.md           
