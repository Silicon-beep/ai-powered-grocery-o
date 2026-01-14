# Planning Guide

NeoContoso is an AI-powered intelligent retail operations platform that empowers grocery store managers to optimize Customer Lifetime Value through data-driven insights and operational excellence.

**Experience Qualities**: 

1. **Professional** - Sophisticated visual design with refined typography and a polished color palette that conveys enterprise-grade reliability and authority
2. **Intelligent** - Every metric and visualization reveals actionable intelligence that drives better business decisions with AI-powered recommendations
3. **Refined** - Clean, modern aesthetics with subtle gradients, thoughtful spacing, and elegant micro-interactions that feel premium without being ostentatious

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a multi-faceted operational platform integrating real-time data streams, predictive AI models, and multiple specialized agent systems. It requires sophisticated state management, data visualization, role-based access, and seamless navigation between inventory, workforce, pricing, and analytics modules.

- **Trigger**: Contin

### Workforce Scheduling Optimizer
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
- **Functionality**: Predicts store traffic patterns and recommends optimal staff scheduling
- **Progression**: Ask question ("Why did dairy shrink last week?") → AI analyzes releva
- **Trigger**: Weekly schedule generation; on-demand what-if scenario planning
- **Progression**: Access Workforce tab → View traffic forecast → See recommended schedule with coverage gaps highlighted → Drag-drop to adjust shifts → AI validates coverage → Publish schedule to team
- **Success criteria**: Labor cost optimization of 8-12%; no understaffing during predicted peaks; shift fairness metrics maintained

### Dynamic Pricing Engine
## Design Direction
The design should evoke **professional confidence, operational clarity, and intell
## Color Selection
The palette combines **deep professional tones with vibrant data visualization accents** to create a system that feels authoritative yet dynamic.
- **Primary Color**: Deep Navy Blue (oklch(0.28 0.08 250)) - Conveys trust, stability, and professional authority; used for primary actions and navigati

- **Accent Color**: Electric 
  - Success: Forest Green (oklch(0.55 0.12 150)) for positive metrics and approvals
  - Critical: Coral Red (oklch(0.62 0.20 25)) for urgent alerts and stoc
- **Foreground/Background Pairings**:
  - Accent Teal (oklch(0.65 0.15 195)): Navy text (oklch(0.28 0.08 250)) - Ratio 4.9:1 ✓
  - Background Slate (oklch(0.96 0.01 250)): Foreground Charcoal (oklch(0.25 0.02 250)) - Ratio 12.5:1 ✓

Typography should project **a
- **Primary Typeface**: Inter Variable - Clean geometric sans-serif with excellent legibility in da
- **Typographic Hierarchy**: 
  - H2 (Section Headers): Inter Semibold/24px/tight letter spacing 
  - Body (Descriptions): Inter Regular/15px/relaxed line height (1.6)
  - Metrics/Numbers: JetBrains Mono Medium/18-24px (size varies by prominence)



- Live metric updates: gentle pulse on change, then smooth number transition
- Dashboard navigation: smooth crossfade between views maintaining spatial
- Data loading states: skeleton screens with shimmer effect, not spinners


  - **Card**: Primary

  - **Alert**: Critical notifications for stockouts, anomalies, and urgent actions needed
  - **Dialog**: Confirmation modals for high-impact actions (pricing changes, schedule publishing)
  - **Progress**: Visual indicators for stock levels, forecast confidence, task completion
  - **Sheet**: Slide-out panels for detailed drilldowns without losing dashboard context
  - **Separator**: Visual hierarchy between dashboard sections


## Design Direction

The design should evoke **professional confidence, sophisticated intelligence, and refined precision**. This is a mission-critical enterprise tool for retail operators, so it must feel robust, trustworthy, and purpose-built for fast decision-making under pressure. The aesthetic balances data density with elegant breathing room—displaying complex information without overwhelming. The visual language draws inspiration from modern financial terminals and premium BI platforms: information-rich but never cluttered, with intelligent use of color to highlight what demands attention. Subtle gradients, refined shadows, and polished micro-interactions create a sense of premium quality.

- **Primary Color*

The palette combines **sophisticated professional tones with vibrant intelligence accents** to create a system that feels authoritative yet dynamic and modern.

- **Primary Color**: Deep Navy Blue (oklch(0.35 0.12 250)) - Conveys trust, stability, and professional authority; used for primary actions and navigation elements
- **Foreground/Backgroun
  - Slate Gray (oklch(0.50 0.04 250)) for secondary UI elements and sophisticated backgrounds
  - Cool White (oklch(0.98 0.005 250)) for pristine canvas areas with subtle warmth
- **Accent Color**: Electric Teal (oklch(0.65 0.15 195)) - Intelligent, modern attention-grabber for CTAs, AI recommendations, and interactive elements
Typography should p
- **Primary Typeface**: Inter - Modern geometric sans-serif with excellent legibili
- **Typographic Hierarchy**: 
  - H2 (Section Headers): Inter Semibold/24px/tight letter spacing (-0.01em)
  - Body (Descriptions): Inter Regular/15px/relaxed line height (1.6)
  - Metrics/Numbers: JetBrains Mono M
  - Primary Navy (oklch(0.35 0.12 250)): White text (oklch(0.98 0.01 250)) - Ratio 9.2:1 ✓
  - Accent Teal (oklch(0.65 0.15 195)): Navy text (oklch(0.20 0.04 250)) - Ratio 6.8:1 ✓
  - Warning Amber (oklch(0.70 0.15 75)): Navy text (oklch(0.20 0.04 250)) - Ratio 7.1:1 ✓
  - Background (oklch(0.98 0.005 250)): Foreground Charcoal (oklch(0.25 0.02 250)) - Ratio 13.1:1 ✓

- Data loading st

Typography should project **analytical precision and refined professionalism**—fonts that are highly legible at small sizes (for dense data tables) while maintaining distinctive character for headers and emphasis.

- **Primary Typeface**: Inter - Modern geometric sans-serif with excellent legibility in data-dense contexts; professional, clean, and highly readable with refined character
  - **Table**: Dense data display for inventory lists, transactions, schedules; sticky headers and virtual scrolling for perfor
  - **Alert**: Critical notif
  - H1 (App Title): Inter Bold/32px/tight letter spacing (-0.02em)
  - **Progress**: Visual indicators for stock levels, forecast confidence, t
  - **Sheet**: Slide-out panels for detailed drilldowns without
  - **Separator**: Visual hierarchy between dashboard sections

  - **Metric Cards**: Custom component combining large numeric display (JetBra





























