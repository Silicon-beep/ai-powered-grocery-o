# Planning Guide

An AI-powered grocery store management platform that optimizes operational efficiency, profitability, and customer lifetime value through real-time dashboards, predictive analytics, and intelligent automation across inventory, workforce, pricing, and loss prevention.

**Experience Qualities**: 
1. **Insightful** - Every metric and visualization reveals actionable intelligence that drives better business decisions
2. **Confident** - AI recommendations are presented with clear rationale and confidence levels, empowering managers to act decisively
3. **Efficient** - Complex operational data is distilled into clear, scannable views that respect the time constraints of busy store managers

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a multi-faceted operational platform integrating real-time data streams, predictive AI models, and multiple specialized agent systems. It requires sophisticated state management, data visualization, role-based access, and seamless navigation between inventory, workforce, pricing, and analytics modules.

## Essential Features

### Real-Time Operations Dashboard
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

### Workforce Scheduling Optimizer
- **Functionality**: Predicts store traffic patterns and recommends optimal staff scheduling
- **Purpose**: Reduces labor costs while maintaining service quality during peak periods
- **Trigger**: Weekly schedule generation; on-demand what-if scenario planning
- **Progression**: Access Workforce tab → View traffic forecast → See recommended schedule with coverage gaps highlighted → Drag-drop to adjust shifts → AI validates coverage → Publish schedule to team
- **Success criteria**: Labor cost optimization of 8-12%; no understaffing during predicted peaks; shift fairness metrics maintained

### Dynamic Pricing Engine
- **Functionality**: Recommends price adjustments for perishables and high-demand items based on inventory age, demand, and margin targets
- **Purpose**: Maximizes revenue while minimizing waste on time-sensitive products
- **Trigger**: Automated twice-daily for perishables; on-demand for promotional planning
- **Progression**: Navigate to Pricing tab → View items flagged for price adjustment → Review AI rationale (freshness, velocity, margin) → Preview revenue impact → Approve pricing changes → Prices update in POS system
- **Success criteria**: 15-20% reduction in perishable waste; maintained or improved margin percentages; price changes propagate to POS within 5 minutes

### Loss Prevention Analytics
- **Functionality**: Detects anomalies indicating shrinkage, fraud, or operational issues
- **Purpose**: Reduces inventory loss and identifies systematic problems
- **Trigger**: Continuous monitoring with alerts for significant anomalies
- **Progression**: Receive alert notification → Navigate to Loss Prevention tab → View anomaly details with historical context → Investigate potential causes → Mark resolution actions → Track shrinkage trends over time
- **Success criteria**: Anomaly detection within 24 hours; false positive rate below 10%; clear investigation workflow with audit trail

### Product Placement Advisor
- **Functionality**: Analyzes basket data and suggests optimal shelf placement and cross-promotions
- **Purpose**: Increases basket size and customer lifetime value through strategic merchandising
- **Trigger**: Monthly analysis cycle; on-demand for layout changes
- **Progression**: Access Product Placement tab → View current layout with performance heatmap → See AI recommendations for high-impact moves → Preview estimated basket size increase → Create planogram → Track performance post-implementation
- **Success criteria**: Basket size increase of 5-10% in test stores; clear A/B testing framework; measurable impact on CLV

### AI Digital Assistant
- **Functionality**: Provides natural language interface for querying data and receiving explanations
- **Purpose**: Enables managers to get instant answers without navigating complex dashboards
- **Trigger**: Click assistant icon from any view; voice command on mobile
- **Progression**: Ask question ("Why did dairy shrink last week?") → AI analyzes relevant data → Presents answer with supporting charts → Offers follow-up questions → Provides actionable recommendations
- **Success criteria**: 80%+ query comprehension rate; responses within 3 seconds; actionable recommendations included in 60%+ of answers

## Edge Case Handling

- **Network Connectivity Loss**: Local caching maintains read-only dashboard access; queued actions sync when connection restored; clear offline indicator
- **Incomplete Historical Data**: AI agents flag data quality issues; recommendations include confidence adjustments; gradual model improvement as data accumulates
- **Anomalous External Events**: Human override capability for AI recommendations; special event tagging (holidays, weather, local events) to improve forecasting
- **Multi-Store Chain Scaling**: Role-based access controls; regional manager view aggregates multiple stores; store-specific model tuning for local patterns
- **Integration Failures with LOB Systems**: Graceful degradation to manual entry; clear status indicators for each integration; automatic retry with exponential backoff
- **Conflicting AI Recommendations**: Priority system with business rules; human approval required for high-impact decisions; explanation of trade-offs presented clearly

## Design Direction

The design should evoke **professional confidence, operational clarity, and intelligent efficiency**. This is a mission-critical tool for retail operators, so it must feel robust, trustworthy, and purpose-built for fast decision-making under pressure. The aesthetic should balance data density with visual breathing room—displaying complex information without overwhelming. Think sophisticated financial terminals meets modern BI platforms: information-rich but never cluttered, with intelligent use of color to highlight what demands attention.

## Color Selection

The palette combines **deep professional tones with vibrant data visualization accents** to create a system that feels authoritative yet dynamic.

- **Primary Color**: Deep Navy Blue (oklch(0.28 0.08 250)) - Conveys trust, stability, and professional authority; used for primary actions and navigation
- **Secondary Colors**: 
  - Slate Gray (oklch(0.45 0.02 250)) for secondary UI elements and backgrounds
  - Cool White (oklch(0.98 0.01 250)) for clean canvas areas
- **Accent Color**: Electric Teal (oklch(0.65 0.15 195)) - Attention-grabbing for CTAs, AI recommendations, and interactive elements
- **Alert Colors**:
  - Success: Forest Green (oklch(0.55 0.12 150)) for positive metrics and approvals
  - Warning: Amber (oklch(0.70 0.15 75)) for items requiring attention
  - Critical: Coral Red (oklch(0.62 0.20 25)) for urgent alerts and stockouts
- **Data Visualization**: Five-color scale from cool blue through teal to warm orange for heatmaps and performance gradients
- **Foreground/Background Pairings**:
  - Primary Navy (oklch(0.28 0.08 250)): White text (oklch(0.98 0.01 250)) - Ratio 9.2:1 ✓
  - Accent Teal (oklch(0.65 0.15 195)): Navy text (oklch(0.28 0.08 250)) - Ratio 4.9:1 ✓
  - Warning Amber (oklch(0.70 0.15 75)): Navy text (oklch(0.28 0.08 250)) - Ratio 6.1:1 ✓
  - Background Slate (oklch(0.96 0.01 250)): Foreground Charcoal (oklch(0.25 0.02 250)) - Ratio 12.5:1 ✓

## Font Selection

Typography should project **analytical precision and modern professionalism**—fonts that are highly legible at small sizes (for dense data tables) while maintaining distinctive character for headers and emphasis.

- **Primary Typeface**: Inter Variable - Clean geometric sans-serif with excellent legibility in data-dense contexts; professional without being sterile
- **Monospace/Data**: JetBrains Mono - For numerical data, timestamps, and metrics where alignment and scanability are critical
- **Typographic Hierarchy**: 
  - H1 (View Titles): Inter Bold/32px/tight letter spacing (-0.02em)
  - H2 (Section Headers): Inter Semibold/24px/tight letter spacing (-0.01em)
  - H3 (Card Titles): Inter Semibold/18px/normal letter spacing
  - Body (Descriptions): Inter Regular/15px/relaxed line height (1.6)
  - Data Labels: Inter Medium/13px/normal spacing
  - Metrics/Numbers: JetBrains Mono Medium/18-24px (size varies by prominence)
  - Small Meta: Inter Regular/13px/muted color

## Animations

Animations should **reinforce data updates and state transitions** without delaying or distracting from critical information. Use motion to draw attention to changes in real-time metrics, smooth transitions between dashboard views, and provide satisfying feedback on user actions. Keep timing fast (150-250ms) to match the operational tempo of store management—this isn't a leisurely consumer app.

Key animation moments:
- Live metric updates: gentle pulse on change, then smooth number transition
- AI recommendation appearance: subtle slide-in with confidence indicator animation
- Dashboard navigation: smooth crossfade between views maintaining spatial orientation
- Alert notifications: attention-grabbing but respectful slide-in from top-right
- Data loading states: skeleton screens with shimmer effect, not spinners
- Action confirmations: satisfying micro-interactions on approvals and submissions

## Component Selection

- **Components**: 
  - **Card**: Primary container for all dashboard widgets and metric groups; elevated shadow for depth
  - **Tabs**: Main navigation between Inventory, Workforce, Pricing, Loss Prevention, and Product Placement views
  - **Table**: Dense data display for inventory lists, transactions, schedules; sticky headers and virtual scrolling for performance
  - **Badge**: Status indicators (in-stock/low/out, shift-covered/gap, high-confidence/medium/low)
  - **Alert**: Critical notifications for stockouts, anomalies, and urgent actions needed
  - **Button**: Primary (approve actions), Secondary (view details), Destructive (override/reject)
  - **Dialog**: Confirmation modals for high-impact actions (pricing changes, schedule publishing)
  - **Tooltip**: Contextual help for AI confidence scores and metric definitions
  - **Progress**: Visual indicators for stock levels, forecast confidence, task completion
  - **Skeleton**: Loading states that maintain layout stability during data fetches
  - **Sheet**: Slide-out panels for detailed drilldowns without losing dashboard context
  - **Popover**: Quick actions and filters that don't warrant full modal treatment
  - **Separator**: Visual hierarchy between dashboard sections
  - **ScrollArea**: Smooth scrolling for tables and lists with custom scrollbar styling

- **Customizations**: 
  - **Metric Cards**: Custom component combining large numeric display (JetBrains Mono), trend indicator (arrow + percentage), sparkline chart, and comparison context
  - **AI Recommendation Card**: Custom component with confidence meter, rationale text, impact preview, and approve/reject actions
  - **Forecast Chart**: Custom D3-based component showing historical actuals (solid line) vs. AI forecast (dashed) with confidence band shading
  - **Staff Schedule Grid**: Custom time-slot grid with drag-drop capability and coverage heat mapping

- **States**: 
  - Buttons: Distinct hover (slight elevation + brightness increase), active (pressed inward), loading (spinner replaces text), disabled (reduced opacity + no pointer)
  - Inputs: Subtle border on default, accent color ring on focus, validation states (green check/red warning icon inline)
  - Cards: Elevated shadow on hover for interactive cards, pulsing border for cards with new alerts/updates
  - AI Recommendations: Three confidence states (high=teal border, medium=amber, low=gray) with corresponding badge color

- **Icon Selection**: 
  - Phosphor icons for all UI actions: ChartLine (analytics), Package (inventory), Users (workforce), Tag (pricing), ShieldWarning (loss prevention), Layout (product placement), ChatCircle (AI assistant), TrendUp/TrendDown (metrics), WarningCircle (alerts), CheckCircle (approvals), Clock (scheduling), Lightning (AI indicator)

- **Spacing**: 
  - Card padding: p-6 (24px) for generous breathing room around content
  - Section gaps: gap-6 (24px) between major dashboard sections
  - Metric groups: gap-4 (16px) between related metrics
  - Tight spacing: gap-2 (8px) for labels and their values
  - Dashboard margins: px-8 py-6 for main content area
  - Grid layouts: gap-4 for card grids on desktop, gap-3 on mobile

- **Mobile**: 
  - Tab navigation converts to bottom sheet selector on mobile
  - Metric cards stack vertically with full-width on screens <768px
  - Tables switch to card-list view showing key columns only; tap to expand for full details
  - AI Assistant becomes primary navigation method on mobile via floating action button
  - Charts adapt to portrait orientation with adjusted aspect ratios
  - Side sheets become full-screen modals on mobile
  - Reduced padding (p-4 instead of p-6) to maximize screen real estate
  - Collapsible sections for less critical info to reduce initial scroll depth
