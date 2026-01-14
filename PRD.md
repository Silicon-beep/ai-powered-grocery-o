# Planning Guide

NeoContoso is an AI-powered intelligent retail operations platform that empowers grocery store managers to optimize Customer Lifetime Value through data-driven insights and operational excellence.

**Experience Qualities**: 

1. **Bold** - Striking visual design with vibrant colors, expressive typography, and commanding presence that demands attention and projects confidence
2. **Futuristic** - Cutting-edge aesthetic with dynamic gradients, atmospheric backgrounds, and sophisticated visual effects that feel advanced and innovative
3. **Electric** - Energetic interactions with purposeful animations, vivid accent colors, and high-contrast elements that create excitement and engagement

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a multi-faceted operational platform integrating real-time data streams, predictive AI models, and multiple specialized agent systems. It requires sophisticated state management, data visualization, role-based access, and seamless navigation between inventory, workforce, pricing, and analytics modules.

## Essential Features

### Operations Overview Dashboard
- **Functionality**: Displays live KPIs across inventory levels, sales velocity, workforce status, and customer lifetime value metrics
- **Purpose**: Provides at-a-glance operational health to identify issues and opportunities immediately
- **Trigger**: Loads automatically on login; updates every 30 seconds via live data feed
- **Progression**: Login → Operations Overview loads with key metrics → Drill into specific areas (inventory/workforce/pricing) → View detailed analytics → Take action on recommendations
- **Success criteria**: All metrics load within 2 seconds; data freshness indicator shows last update time; critical alerts are immediately visible

### Inventory Management Agent
- **Functionality**: Forecasts demand, recommends optimal stock levels, flags stockouts/overstock risks
- **Purpose**: Reduces waste, prevents lost sales, and optimizes working capital
- **Trigger**: Continuous background analysis; manager accesses via Inventory tab
- **Progression**: Navigate to Inventory → View current levels with AI forecast overlay → See restocking recommendations → Review confidence scores → Approve or adjust order quantities → Generate purchase orders
- **Success criteria**: Forecast accuracy within 15% variance; stockout alerts 48 hours in advance; overstock warnings with markdown recommendations

### AI Digital Assistant
- **Functionality**: Natural language interface for querying data, getting explanations, and exploring insights
- **Purpose**: Makes complex data accessible without training; provides contextual guidance
- **Trigger**: Click "AI Agents Active" button; accessible from any view
- **Progression**: Ask question ("Why did dairy shrink last week?") → AI analyzes relevant data → Presents findings with visualizations → Offers actionable recommendations → User can drill deeper or take suggested actions
- **Success criteria**: Response time under 3 seconds; answers are accurate and contextual; cites data sources

### Workforce Scheduling Optimizer
- **Functionality**: Predicts store traffic patterns and recommends optimal staff scheduling
- **Purpose**: Balances labor costs with customer service quality
- **Trigger**: Weekly schedule generation; on-demand what-if scenario planning
- **Progression**: Access Workforce tab → View traffic forecast → See recommended schedule with coverage gaps highlighted → Drag-drop to adjust shifts → AI validates coverage → Publish schedule to team
- **Success criteria**: Labor cost optimization of 8-12%; no understaffing during predicted peaks; shift fairness metrics maintained

### Dynamic Pricing Engine
- **Functionality**: Analyzes competitor prices, demand elasticity, and expiration dates to suggest optimal pricing
- **Purpose**: Maximizes revenue while minimizing waste on perishables
- **Trigger**: Daily analysis; real-time adjustments for fast-moving items
- **Progression**: Navigate to Pricing tab → Review pending recommendations → See projected impact on revenue and waste → Approve individual or batch changes → Monitor performance post-implementation
- **Success criteria**: Revenue lift of 3-5%; 20% reduction in spoilage markdowns; competitor price parity maintained

## Edge Case Handling

- **Data Outages**: Graceful degradation showing last known values with staleness indicators; queue actions for sync when connection restored
- **Conflicting Recommendations**: AI explains trade-offs and lets manager choose priorities (e.g., maximize revenue vs. minimize waste)
- **Unusual Patterns**: Anomaly detection flags unexpected trends for human review rather than auto-acting on outliers
- **Mobile Access**: Responsive design adapts complex dashboards to mobile with progressive disclosure and touch-optimized controls
- **Permission Boundaries**: Role-based access gracefully hides unavailable features rather than showing disabled states

## Design Direction

The design should evoke **bold confidence, electric energy, and futuristic sophistication**. This is a cutting-edge AI platform that should feel powerful and exciting—a tool that gives retail operators superhuman capabilities. The aesthetic draws inspiration from cyberpunk interfaces, premium gaming UIs, and next-gen financial terminals: high-contrast neon accents against deep dark backgrounds, dramatic gradients, and atmospheric visual effects. Every interaction should feel responsive and purposeful, with smooth animations that reinforce the sense of intelligent systems working in real-time.

## Color Selection

The palette combines **deep cosmic backgrounds with vibrant neon accents** to create a system that feels futuristic, energetic, and commanding.

- **Background**: Deep Space Blue (oklch(0.12 0.04 265)) - Rich, dark foundation that makes bright elements pop and creates depth
- **Foreground**: Bright White (oklch(0.98 0.008 265)) - Crisp, high-contrast text that ensures excellent readability

- **Primary Color**: Electric Magenta (oklch(0.75 0.21 330)) - Bold, energetic pink that commands attention for primary actions and key UI elements
- **Secondary Color**: Neon Cyan (oklch(0.65 0.24 195)) - Tech-forward blue-green for supporting actions and complementary highlights
- **Accent Color**: Plasma Yellow (oklch(0.80 0.19 85)) - High-energy yellow for critical CTAs and attention-grabbing elements

- **Supporting Colors**:
  - Success: Vibrant Green (oklch(0.72 0.18 160)) for positive metrics and confirmations
  - Warning: Bright Yellow (oklch(0.78 0.18 75)) for caution states and moderate alerts
  - Destructive: Hot Coral (oklch(0.68 0.22 25)) for critical alerts and dangerous actions

- **Foreground/Background Pairings**:
  - Primary Magenta (oklch(0.75 0.21 330)): Dark Background text (oklch(0.12 0.04 265)) - Ratio 9.8:1 ✓
  - Secondary Cyan (oklch(0.65 0.24 195)): Dark Background text (oklch(0.12 0.04 265)) - Ratio 7.2:1 ✓
  - Accent Yellow (oklch(0.80 0.19 85)): Dark Background text (oklch(0.12 0.04 265)) - Ratio 11.5:1 ✓
  - Background (oklch(0.12 0.04 265)): Foreground White (oklch(0.98 0.008 265)) - Ratio 15.2:1 ✓

## Font Selection

Typography should project **futuristic precision and bold character**—fonts that feel technical yet approachable, with strong personality that matches the electric aesthetic.

- **Display Font**: Syne (Bold/ExtraBold) - Distinctive geometric sans with strong personality for headlines and emphasized elements
- **Primary Typeface**: Space Grotesk - Modern, slightly technical geometric sans with excellent legibility and character; perfect for UI text and data
- **Monospace Font**: JetBrains Mono - Clean, technical monospace for metrics, numbers, and code-like elements

- **Typographic Hierarchy**: 
  - H1 (Page Titles): Syne Black/56px/tight letter spacing (-0.02em)
  - H2 (Section Headers): Syne Bold/24px/tight letter spacing (-0.01em)
  - Body (UI Text): Space Grotesk Medium/15px/relaxed line height (1.6)
  - Labels: Space Grotesk Bold/14px/wide letter spacing (0.05em) UPPERCASE
  - Metrics/Numbers: JetBrains Mono Black/48px for large values, Medium/16px for small values

## Animations

Animations should feel **snappy, purposeful, and energetic** with a focus on enhancing perceived performance and creating moments of delight:

- **Hover Effects**: Scale transforms (1.05x) with slight vertical lift (-4px) on cards and buttons; smooth 200ms transitions
- **Tab Transitions**: Active tabs scale slightly (1.05x) with bold gradient backgrounds and dramatic shadows
- **Metric Updates**: Numbers animate with smooth counting; trend badges appear with elastic bounce-in effect
- **Loading States**: Skeleton screens with shimmer effects; pulsing indicators for live data
- **Page Transitions**: Smooth crossfades between views maintaining spatial relationships
- **Alert Appearances**: Slide-in from top with gentle bounce; pulsing glows on critical alerts

## Component Selection

- **Components**: 
  - **Card**: Primary container for all content sections with gradient backgrounds, thick borders, and dramatic shadows
  - **Button**: Bold with gradient backgrounds, thick borders, and scale hover effects
  - **Badge**: Status indicators with thick borders, glowing backgrounds, and icons
  - **Tabs**: Large, prominent navigation with gradient active states and scale animations
  - **Alert**: High-visibility notifications with colored gradients, thick borders, and icons
  - **Progress**: Animated progress bars and radial indicators for metrics
  - **Dialog/Sheet**: Overlay panels for detailed views and confirmations

- **Customizations**: 
  - All cards use thick 2px borders with colored shadows on hover
  - Gradient backgrounds on all interactive elements (from-color/via-color/to-color patterns)
  - Increased border radius (1rem default) for modern, friendly feel
  - Liberal use of backdrop-blur for depth and layering

- **States**: 
  - **Hover**: Scale up (1.05x), lift vertically (-4px), intensify shadows and border colors
  - **Active**: Bold gradient backgrounds, thick borders, dramatic colored shadows
  - **Focus**: Ring with accent color, maintained hover state
  - **Disabled**: Reduced opacity (50%), grayscale treatment

- **Icon Selection**: 
  - Phosphor Icons with "duotone" and "fill" weights for depth and visual interest
  - Lightning bolts for AI/automation features
  - Package for inventory, Users for workforce, Tag for pricing
  - ChartLine for analytics, ShieldWarning for alerts

- **Spacing**: 
  - Large gaps between sections (space-y-10, gap-8)
  - Generous padding inside cards (p-7, p-6)
  - Increased visual breathing room throughout

- **Mobile**: 
  - Stack cards vertically on mobile
  - Hide text labels in tabs, show icons only
  - Reduce font sizes proportionally
  - Maintain touch targets (min 44px)
  - Simplify gradients and effects for performance
