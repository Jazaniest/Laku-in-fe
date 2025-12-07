# Laku-in Frontend

Aplikasi e-commerce modern berbasis React dengan fitur AI yang canggih untuk transformasi bisnis digital. Dibangun dengan teknologi terkini dan mendukung voice command untuk navigasi yang intuitif.

## 🚀 Fitur Unggulan

### 🎯 Inti Bisnis
- **Navigasi Voice Command**: Kontrol aplikasi dengan perintah suara menggunakan AI
- **Manajemen Produk**: Sistem manajemen produk yang komprehensif  
- **Analitik Bisnis**: Dashboard analytics dengan visualisasi data real-time
- **Laporan Keuangan**: Sistem pelaporan keuangan dengan export multi-format
- **WhatApp Integration**: Chat dan integrasi WhatsApp untuk customer service
- **Poster Generator**: Pembuat poster promosi otomatis dengan AI
- **Upload Receipt**: Sistem OCR untuk upload dan pembacaan nota transaksi

### 🛠️ Teknologi
- **Frontend**: React 19, TypeScript, Vite
- **UI Components**: Radix UI + Tailwind CSS v4 untuk desain yang responsif
- **Form Management**: React Hook Form dengan validasi Zod
- **Navigation**: React Router DOM v6
- **API**: Integrasi RESTful dengan error handling komprehensif

## 📋 Persyaratan Sistem

### Minimum Requirements
- **Node.js**: v18.0.0 atau lebih tinggi
- **Package Manager**: pnpm (disarankan) atau npm v8+
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Memory**: Minimum 4GB RAM untuk development
- **Storage**: 2GB free space

### Optional Requirements
- **API Keys**: Untuk integrasi Kolosal AI
- **Backend**: Server backend untuk API (disarankan Express.js + PostgreSQL)

## 🚀 Instalasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd Laku-in-fe
```

### 2. Install Dependencies
```bash
# Menggunakan pnpm (disarankan)
pnpm install

# Atau menggunakan npm
npm install
```

### 3. Konfigurasi Environment
```bash
# Copy file environment
cp .env.example .env.local

# Edit file .env.local sesuai kebutuhan
VITE_API_URL=http://localhost:3001
VITE_KOLOSAL_API_URL=https://api.kolosal.dev/v1/completions
VITE_KOLOSAL_API_KEY=your_kolosal_api_key_here
```

### 4. Jalankan Development Server
```bash
# Development mode
pnpm dev        # http://localhost:5173

# Build production
pnpm build

# Preview production build
pnpm preview

# Run linting
pnpm lint
```

## 📁 Struktur Proyek Mendalam

### 🔧 Core Configuration
```
src/
├── main.tsx              # Entry point utama dengan routing
├── index.css             # Global styles dengan Tailwind CSS
└── vite.config.ts        # Vite configuration dengan path alias @/
```

### 🎨 Components Architecture
```
components/
├── ui/                   # Komponen UI reusable (shadcn/ui)
│   ├── button.tsx      # Button dengan variants dan sizes
│   ├── card.tsx        # Card containers
│   ├── input.tsx       # Form inputs dengan validasi
│   ├── dialog.tsx      # Modal dialogs
│   ├── dropdown-menu.tsx  # Dropdown menu actions
│   ├── select.tsx      # Dropdown select
│   ├── textarea.tsx    # Multi-line text input
│   ├── label.tsx       # Form labels
│   ├── progress.tsx    # Progress indicators
│   ├── tabs.tsx        # Tab navigation
│   ├── avatar.tsx      # User avatar display
│   └── badge.tsx       # Status badges
├── auth/               # Authentication components
├── dashboard/          # Dashboard-specific components
├── landing/            # Landing page components
└── VoiceChat.tsx       # Voice command interface
```

### 📄 Pages (Multi-Page Application)
```
pages/
├── LandingPage.tsx          # Halaman utama marketing
├── AuthPage.tsx            # Login/register page
├── DashboardPage.tsx       # Dashboard utama dengan stats
├── FinancialReportPage.tsx  # Laporan keuangan
├── BusinessAnalyticsPage.tsx # Analytics dashboard
├── ReceiptUploadPage.tsx    # Upload dan OCR nota
├── AIPosterGeneratorPage.tsx # AI poster creator
└── WhatsAppPage.tsx        # WhatsApp integration
```

### 🛠️ Services (Business Logic)
```
services/
├── auth.service.ts         # Authentication & authorization
├── dashboard.service.ts    # Dashboard data management
├── financial.service.ts   # Financial reporting
├── analytics.service.ts   # Business analytics
├── receipt.service.ts     # Receipt OCR processing
├── poster.service.ts      # Poster generation
├── voice.service.ts       # Voice command processing
├── whatsapp.service.ts    # WhatsApp integration
└── kolosal-api.client.ts # Kolosal AI API client
```

### 🏷️ Type Definitions (TypeScript)
```
types/
├── auth.types.ts           # Authentication interfaces
├── dashboard.types.ts    # Dashboard data structures
├── financial.types.ts   # Financial data models
├── kolosal-api.types.ts # Kolosal AI API types
├── voice.types.ts       # Voice command interfaces
├── analytics.types.ts   # Analytics data structures
├── receipt.types.ts     # Receipt processing types
├── poster.types.ts      # Poster generation types
├── whatsapp.types.ts    # WhatsApp integration types
└── validation.types.ts  # Form validation schemas
```

### ⚙️ Hooks (React Logic)
```
hooks/
├── useAuth.ts              # Authentication state
├── useDashboard.ts       # Dashboard data management
├── useFinancialReport.ts # Financial reporting
├── useBusinessAnalytics.ts # Business analytics
├── useReceiptUpload.ts   # Receipt upload processing
├── usePosterGenerator.ts # Poster generation
├── useWhatsapp.ts        # WhatsApp integration
└── useAIAnalysis.ts      # AI analysis features
```

### 🎨 Library Utilities
```
lib/
└── utils.ts              # Utility functions (cn - className merger)
```

### 🔧 Constants
```
constants/
└── app.constants.ts      # App-wide constants (voice commands, auth settings)
```

### 🛠️ Utilities
```
utils/
└── performance.utils.ts  # Performance monitoring utilities
```

## 🎨 Sistem Styling

### Tailwind CSS v4 Configuration
- **Mobile-first approach** dengan breakpoint responsive
- **Custom color palette** dengan zinc sebagai base color
- **CSS Variables support** untuk theming dinamis
- **Container queries** untuk layout yang fleksibel
- **Modern utility classes** untuk spacing, typography, layout

### Component Styling
- **Radix UI primitives** untuk accessibility
- **Class Variance Authority (CVA)** untuk component variants
- **Tailwind Merge** untuk utility class merging
- **Consistent spacing scale** (4px grid system)

### Theme System
```typescript
// Color system menggunakan TailwindCSS
// Primary: zinc color scale
// Secondary: blue color scale untuk aksen
// Destructive: red untuk error states
```

## 🗣️ Sistem Voice Command

### Fitur Voice Chat
- **Voice recognition** dengan Web Speech API
- **AI processing** menggunakan Kolosal API
- **Natural language understanding** untuk navigasi
- **Real-time feedback** dengan status indicators
- **Multi-language support** (Bahasa Indonesia)

### Supported Voice Commands
```bash
# Navigasi
"Buka dashboard"
"Tampilkan laporan keuangan"
"Aku ingin lihat analitik"
"Ke halaman upload nota"
"Buka pembuat poster"
"Masuk ke WhatsApp"

# Informasi
"Bagaimana kondisi bisnis saya?"
"Tampilkan statistik"
"Berapa total pendapatan"
```

### Voice Processing Flow
1. **Speech Recognition** → Convert voice to text
2. **AI Processing** → Kolosal API untuk intent analysis
3. **Navigation Response** → JSON response format
4. **Action Execution** → Navigate ke halaman yang sesuai

## 🔌 Integrasi API

### Backend API Integration
- **RESTful API client** dengan error handling
- **Authentication flow** dengan token management
- **Data validation** menggunakan Zod schemas
- **Request/Response transformation** untuk type safety
- **Retry mechanism** untuk network failures

### Kolosal AI Integration
- **Completion API** untuk voice command processing
- **Error handling** untuk API failures
- **Rate limiting awareness** untuk optimal usage
- **Response validation** untuk data integrity

### API Error Handling
```typescript
// Kategori error dengan response yang user-friendly
- Network errors: "Koneksi gagal"
- Authentication errors: "Autentikasi gagal"
- Validation errors: "Data tidak valid"
- Server errors: "Server error"
- Rate limit errors: "Terlalu banyak permintaan"
```

## 🧪 Development Workflow

### Environment Variable Setup
```bash
# Backend API
VITE_API_URL=http://localhost:3001

# Kolosal AI API
VITE_KOLOSAL_API_URL=https://api.kolosal.dev/v1/completions
VITE_KOLOSAL_API_KEY=your_secure_api_key_here
```

### Local Development
```bash
# Start development server
pnpm dev

# Run with hot reload
pnpm dev --mode local

# Debug mode
pnpm dev --debug
```

### Production Build
```bash
# Build untuk production
pnpm build

# Analyze bundle size
pnpm build --analyze

# Serve production build
pnpm serve
```

## 🚢 Deployment Strategy

### Vercel Deployment (Recommended)
```bash
# Build command
pnpm build

# Output directory
dist/

# Environment variables via Vercel dashboard
VITE_API_URL
VITE_KOLOSAL_API_URL  
VITE_KOLOSAL_API_KEY
```

### Manual Deployment
- Build production bundle: `pnpm build`
- Upload `dist/` folder ke web server
- Configure web server untuk SPA routing

## 🔒 Keamanan

### Authentication
- **JWT Token management** dengan refresh mechanism
- **Secure storage** untuk sensitive data
- **Session timeout** handling
- **Input sanitization** untuk form handling

### API Security
- **API Key protection** di environment variables
- **CORS configuration** untuk domain restrictions
- **SSL/TLS enforcement** untuk production
- **Request validation** untuk data integrity

## 🎯 Performance Optimization

### Code Splitting
- **Route-based splitting** dengan React Router
- **Component lazy loading** untuk halaman besar
- **Vendor chunk separation** untuk libraries

### Image Optimization
- **WebP format** untuk kompresi optimal
- **Lazy loading** untuk images
- **Responsive images** dengan srcset

### Bundle Optimization
- **Tree shaking** untuk unused code removal
- **Minification** untuk production builds
- **Gzip compression** untuk static assets

## 📊 Analytics & Monitoring

### Built-in Analytics
- **User interaction tracking** di dashboard
- **Voice command usage analytics**
- **Performance metrics collection**
- **Error tracking and reporting**

### Performance Monitoring
- **Core Web Vitals** tracking
- **Load time monitoring**
- **API response time tracking**
- **User experience metrics**

## 📱 Responsive Design

### Breakpoint Strategy
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

### Mobile-First Approach
- **Touch-friendly interfaces** (min 44px touch targets)
- **Swipe gestures** untuk navigation
- **Optimized image loading** untuk mobile bandwidth
- **Progressive enhancement** untuk features

## 🔄 Maintenance & Technical Debt

### Code Quality
- **ESLint configuration** untuk code standards
- **TypeScript strict mode** untuk type safety
- **Consistent naming conventions** untuk readability
- **Component documentation** untuk maintainability

### Dependency Management
- **Automated dependency updates** dengan Renovate/Dependabot
- **Security vulnerability monitoring**
- **Bundle size monitoring** untuk overhead tracking

## 📞 Dukungan

### Troubleshooting Guide
- **Common issues** dan solusinya
- **Environment setup validation**
- **API connection testing**
- **Performance debugging**

### Maintenance Schedule
- **Weekly**: Dependency updates (minor patches)
- **Monthly**: Security dependency updates (major versions)
- **Quarterly**: Performance audit dan optimization
- **Annual**: Major upgrade planning dan testing

---

**Laku-in Frontend** - Solusi e-commerce generasi berikutnya dengan integrasi AI untuk pengalaman yang revolusioner.
