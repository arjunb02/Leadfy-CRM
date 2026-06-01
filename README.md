# CRM Dashboard

A modern, responsive CRM dashboard built with Next.js 16, React 19, TypeScript, and Tailwind CSS. Features real-time data visualization, sales pipeline management, and contact management.

## Features

- **Responsive Design**: Mobile-first approach with breakpoints optimized for all screen sizes
- **Dark Mode**: Full light/dark mode support with system preference detection
- **Sales Dashboard**: KPI cards, revenue trends, lead sources, and performance metrics
- **Leads Management**: Searchable leads table with filtering and mobile card view
- **Sales Pipeline**: Kanban-style opportunity pipeline with deal stages
- **Contact Details**: Side panel with contact information, activity timeline, and notes
- **Data Visualization**: Interactive charts using Recharts (sales pipeline, revenue trends, etc.)
- **Accessibility**: WCAG 2.1 compliant with proper ARIA labels and semantic HTML

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **State Management**: React Hooks + Collapsible components
- **Styling**: Tailwind CSS with custom CSS variables
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Theme**: next-themes for light/dark mode

## Project Structure

```
components/
├── crm/                          # CRM-specific components
│   ├── sidebar.tsx               # Navigation sidebar (responsive)
│   ├── navbar.tsx                # Top navigation bar
│   ├── kpi-cards.tsx             # KPI metrics cards
│   ├── charts.tsx                # Data visualization charts
│   ├── leads-table.tsx           # Leads table with search
│   ├── pipeline.tsx              # Sales pipeline kanban
│   ├── right-panel.tsx           # Contact details side panel
│   ├── dashboard-layout.tsx      # Main layout wrapper
│   ├── status-badge.tsx          # Status badge utility
│   ├── skeleton-loader.tsx       # Loading skeletons
│   └── index.ts                  # Component exports
├── ui/                           # shadcn/ui components
└── ...

app/
├── layout.tsx                    # Root layout with providers
├── page.tsx                      # Home page (dashboard)
├── providers.tsx                 # Theme provider
└── globals.css                   # Global styles & design tokens
```

## Color Palette

The dashboard uses a professional color scheme with customizable CSS variables:

- **Primary**: Indigo (280°) - Used for main actions and highlights
- **Secondary**: Purple (300°) - Supporting accent color
- **Accent**: Cyan (170°) - Attention-grabbing highlights
- **Destructive**: Red (25°) - For alerts and dangerous actions
- **Sidebar**: Dark blue-gray background with cyan highlights

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Run development server**:
   ```bash
   pnpm dev
   ```

3. **Open browser**:
   Navigate to `http://localhost:3000`

### Build for Production

```bash
pnpm build
pnpm start
```

## Component Usage

### Using CRM Components

```tsx
import { Sidebar, Navbar, KPICards, Charts } from '@/components/crm'

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <KPICards />
          <Charts />
        </main>
      </div>
    </div>
  )
}
```

### Status Badge

```tsx
import { StatusBadge } from '@/components/crm/status-badge'

<StatusBadge status="qualified" />
// Or with custom className
<StatusBadge status="proposal" className="text-xs" />
```

## Responsive Breakpoints

- **Mobile**: 320px - 768px (sidebar drawer, card layouts)
- **Tablet**: 768px - 1024px (icon-only sidebar, grid transitions)
- **Desktop**: 1024px+ (full sidebar, right panel visible)

## Key Features Explained

### 1. Responsive Sidebar
- Full sidebar on desktop (260px)
- Icon-only mode on tablet (80px)
- Drawer on mobile with backdrop

### 2. KPI Cards
- Real-time metrics (Total Leads, Conversion Rate, Pipeline Value, Deals Won)
- Change indicators with trend arrows
- Hover effects for interactivity

### 3. Data Visualizations
- **Sales Pipeline**: Bar chart showing deals by stage
- **Revenue Trend**: Line chart with actual vs target
- **Lead Sources**: Pie chart showing lead distribution
- **Weekly Performance**: Area chart with multiple metrics

### 4. Leads Table
- Desktop: Full table with sorting options
- Mobile: Card-based layout for better UX
- Real-time search filtering
- Status badges with color coding
- Dropdown actions menu

### 5. Sales Pipeline (Kanban)
- Horizontal scrolling on mobile
- Drag-and-drop ready structure
- Deal cards with amount and company info
- Stage count badges

### 6. Contact Details Panel
- Responsive: Slide-out drawer on mobile, sidebar on desktop
- Contact information with icons
- Activity timeline with collapsible view
- Internal notes section
- Quick action buttons (Call, Email)

## Customization

### Update Color Scheme

Edit `app/globals.css` to change the design tokens:

```css
:root {
  --primary: oklch(0.52 0.31 280); /* Indigo */
  --secondary: oklch(0.55 0.27 300); /* Purple */
  --accent: oklch(0.60 0.35 170); /* Cyan */
  /* ... more colors ... */
}
```

### Modify Sidebar Behavior

In `components/crm/sidebar.tsx`, adjust the responsive breakpoints and default states.

### Update Chart Data

In `components/crm/charts.tsx`, replace mock data with real API calls:

```tsx
const revenueData = await fetchRevenueData() // Replace mock data
```

## Accessibility Features

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast ratios meet WCAG AA standards
- Screen reader optimized
- Focus indicators for keyboard users

## Performance Optimizations

- Code splitting with dynamic imports
- Image optimization with Next.js
- CSS-in-JS with Tailwind (no runtime overhead)
- Memoized components where necessary
- Efficient re-renders with React 19

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Android Chrome 90+)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own CRM or dashboard needs.

## Support

For issues or questions:
- Check the code comments
- Review the component documentation
- Refer to shadcn/ui docs for UI component customization
