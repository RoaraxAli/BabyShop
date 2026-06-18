export const docGroups = [
  {
    title: "Start",
    pages: [
      { title: "Overview", href: "/documentation/overview" },
      { title: "Installation", href: "/documentation/installation" },
      { title: "Domains", href: "/documentation/domains" },
      { title: "Downloads", href: "/documentation/downloads" },
    ],
  },
  {
    title: "User Guide",
    pages: [
      { title: "Accounts", href: "/documentation/accounts" },
      { title: "Shopping", href: "/documentation/shopping" },
      { title: "Cart and Checkout", href: "/documentation/checkout" },
      { title: "AI Assistant", href: "/documentation/assistant" },
      { title: "Orders", href: "/documentation/orders" },
      { title: "Returns", href: "/documentation/returns" },
    ],
  },
  {
    title: "Developer Guide",
    pages: [
      { title: "Architecture", href: "/documentation/architecture" },
      { title: "Frontend", href: "/documentation/frontend" },
      { title: "Backend", href: "/documentation/backend" },
      { title: "Data Model", href: "/documentation/data-model" },
      { title: "Deployment", href: "/documentation/deployment" },
      { title: "Testing", href: "/documentation/testing" },
    ],
  },
  {
    title: "Operations",
    pages: [
      { title: "Security", href: "/documentation/security" },
      { title: "Admin", href: "/documentation/admin" },
      { title: "Troubleshooting", href: "/documentation/troubleshooting" },
      { title: "Roadmap", href: "/documentation/roadmap" },
    ],
  },
];

export const docs = {
  overview: {
    title: "BabyShopHub Documentation",
    description:
      "A complete product, user, developer, and deployment guide for the BabyShopHub ecosystem.",
    sections: [
      ["What BabyShopHub Is", "BabyShopHub is a baby essentials commerce platform with public marketing pages, authenticated shopping flows, an AI assistant, order management, wishlist, profile, and admin workflows."],
      ["Product Surfaces", "The Flutter application targets mobile and desktop-style app experiences. The Next.js BabyShop website targets marketing, documentation, downloads, and web shopping experiences."],
      ["Recommended Domain Setup", "Deploy the public website at web.yourdomain.com and documentation at docs.yourdomain.com. The same Next.js project can serve both using route structure or separate deployments."],
    ],
  },
  installation: {
    title: "Installation",
    description: "Install and run the BabyShop Next.js website locally.",
    sections: [
      ["Requirements", "Use Node.js 20 or newer, npm, and a terminal. The project was created as a standalone folder named BabyShop beside the Flutter BabyShopHub folder."],
      ["Commands", "Run npm install, then npm run dev. For production verification run npm run build. For a deployed build run npm run start after building."],
      ["Project Root", "Use C:\\Users\\Muhammad Ali\\Downloads\\BabyShopHub\\BabyShop as the website root when deploying or running commands."],
    ],
  },
  domains: {
    title: "Domain Strategy",
    description: "Recommended domain and subdomain structure for production.",
    sections: [
      ["Public Website", "Point web.yourdomain.com to the BabyShop Next.js deployment. This is the pre-login product website with home, about, contact, downloads, and login entry points."],
      ["Documentation", "Point docs.yourdomain.com to the documentation section. You can deploy the same repo with rewrites to /documentation or deploy a docs-only build later."],
      ["Web App Experience", "Use web.yourdomain.com for the public website, /login for Firebase authentication, /shop for customers, and /admin for admin users."],
    ],
  },
  downloads: {
    title: "Downloads and Platform Builds",
    description: "How BabyShopHub can be packaged across platforms.",
    sections: [
      ["Android", "Flutter can build Android APK outputs for testing and app bundle outputs for Play Store distribution."],
      ["iOS", "Flutter can build iOS apps from macOS with Xcode. Use flutter build ios, configure signing, and submit through App Store Connect."],
      ["Web", "Flutter can build a web app with flutter build web, while this Next.js project provides a dedicated marketing and website experience."],
      ["PC", "The PC target for this project is the desktop build experience, with Windows as the primary computer target."],
    ],
  },
  accounts: {
    title: "Accounts",
    description: "Customer account behavior and profile expectations.",
    sections: [
      ["Registration", "Users create an account with name, email, password, and optional profile details. Verification and password reset should be available in production."],
      ["Profile", "The profile area stores addresses, order history, wishlist access, account settings, and support preferences."],
      ["Roles", "Customers use shopping and support flows. Admin users can access product, order, and analytics management."],
    ],
  },
  shopping: {
    title: "Shopping",
    description: "Catalog browsing, search, filtering, wishlist, and product detail behavior.",
    sections: [
      ["Catalog", "Products are grouped by diapers, baby food, clothing, toys, bath, and essentials. Each product should expose price, image, category, description, and stock state."],
      ["Search", "Search should handle product names, categories, and parent intent such as organic food, sensitive skin diapers, or newborn clothing."],
      ["Wishlist", "Wishlist saves recurring purchases and comparison items. It should be available from web and app surfaces."],
    ],
  },
  checkout: {
    title: "Cart and Checkout",
    description: "Cart, promo, address, payment, and confirmation flow.",
    sections: [
      ["Cart", "Users can add, remove, and update item quantities. Cart totals should include item subtotal, discounts, delivery fees, and taxes if applicable."],
      ["Promos", "Promo codes like FIRSTBABY should be validated server-side before final order creation."],
      ["Checkout", "Checkout collects shipping address, delivery option, payment details, and final confirmation."],
    ],
  },
  assistant: {
    title: "AI Assistant",
    description: "AI support for product recommendations and policy questions.",
    sections: [
      ["Scope", "The assistant helps with diapers, baby food, toys, shipping, returns, sizing, and product discovery. It should not provide medical diagnosis."],
      ["Fallback", "If the AI provider fails, the app should show useful local responses instead of a generic busy message."],
      ["Safety", "For allergies, illness, fever, or urgent symptoms, the assistant must direct users to qualified healthcare professionals."],
    ],
  },
  orders: {
    title: "Orders",
    description: "Order tracking, status, and customer communication.",
    sections: [
      ["Statuses", "Recommended statuses are pending, confirmed, packed, shipped, out for delivery, delivered, cancelled, and refunded."],
      ["Tracking", "Users should see delivery status, item list, shipping address, and support contact options."],
      ["Notifications", "Email or push notifications should be sent for confirmation, shipping, delivery, and refund events."],
    ],
  },
  returns: {
    title: "Returns",
    description: "Return and refund guidance for baby products.",
    sections: [
      ["Eligibility", "Unopened and unused items in original packaging are the safest return category. Perishable or hygiene-sensitive items may need stricter rules."],
      ["Workflow", "Users request a return, select reason, upload evidence if needed, and wait for admin approval."],
      ["Refunds", "Refunds should be processed after returned items are inspected or when a support exception is approved."],
    ],
  },
  architecture: {
    title: "Architecture",
    description: "High-level system design for BabyShopHub.",
    sections: [
      ["Frontend", "The Flutter app handles native-style app surfaces. The Next.js website handles public pages, docs, downloads, and web application views."],
      ["Services", "AuthProvider, ShopProvider, cloud upload, AI assistant service, Firebase, and SMTP/email services form the current app service layer."],
      ["Future Split", "As the product grows, use dedicated API services for inventory, orders, payments, AI, and notifications."],
    ],
  },
  frontend: {
    title: "Frontend",
    description: "Frontend implementation standards for the website and app.",
    sections: [
      ["Next.js", "Use App Router routes, shared components, structured content files, responsive CSS, and accessible semantic markup."],
      ["Flutter", "Use focused screens, providers for shared state, reusable cards, and safe bottom spacing for floating navigation."],
      ["Design", "Public pages should feel editorial and trustworthy. Authenticated screens should be dense, efficient, and task-focused."],
    ],
  },
  backend: {
    title: "Backend",
    description: "Backend responsibilities and integration points.",
    sections: [
      ["Current Server", "The existing Node server handles SMTP email dispatch. It should be expanded carefully or split into production services."],
      ["APIs", "Production APIs should validate authentication, authorize admin actions, validate promo codes, and protect checkout/payment operations."],
      ["Secrets", "Move API keys, SMTP credentials, and AI provider keys into environment variables before deployment."],
    ],
  },
  "data-model": {
    title: "Data Model",
    description: "Core entities used across BabyShopHub.",
    sections: [
      ["User", "User records include id, display name, email, role, profile picture, addresses, and account metadata."],
      ["Product", "Product records include id, name, description, price, category, image URL, stock, featured state, and safety or age notes."],
      ["Order", "Order records include items, totals, shipping address, status, payment state, timestamps, and tracking fields."],
    ],
  },
  deployment: {
    title: "Deployment",
    description: "Deploy BabyShop website and documentation.",
    sections: [
      ["Website", "Deploy BabyShop as a Next.js project with project root set to the BabyShop folder. Set web.yourdomain.com as the production domain."],
      ["Documentation", "For docs.yourdomain.com, either point to the same deployment and rewrite to /documentation, or create a docs-only deployment later."],
      ["Build", "Run npm run build before deploying. Confirm all static routes generate successfully."],
    ],
  },
  testing: {
    title: "Testing",
    description: "Recommended verification checklist.",
    sections: [
      ["Website", "Check desktop, tablet, and mobile layouts for home, about, contact, downloads, docs, and app routes."],
      ["App Flows", "Verify product browsing, wishlist, cart, assistant fallback, profile, orders, and admin mock views."],
      ["Build", "Run npm run build and resolve TypeScript, lint, image, and CSS warnings before submission."],
    ],
  },
  security: {
    title: "Security",
    description: "Security expectations before production launch.",
    sections: [
      ["Secrets", "Never commit API keys or SMTP passwords. Use .env.local locally and deployment environment variables in production."],
      ["Authentication", "Protect /shop and /admin routes with real authentication before exposing customer or admin data."],
      ["Authorization", "Admin routes must check role server-side, not only hide links in the UI."],
    ],
  },
  admin: {
    title: "Admin",
    description: "Admin responsibilities and management workflows.",
    sections: [
      ["Products", "Admins manage product names, descriptions, pricing, stock, images, categories, and featured status."],
      ["Orders", "Admins review new orders, update statuses, coordinate shipping, and approve exceptions."],
      ["Support", "Admins review return requests, customer issues, and AI assistant escalation topics."],
    ],
  },
  troubleshooting: {
    title: "Troubleshooting",
    description: "Common issues and fixes.",
    sections: [
      ["Next.js Build Fails", "Check import aliases, missing dependencies, TypeScript errors, and unsupported image hosts."],
      ["AI Assistant Fails", "Check model names, API key validity, network access, and fallback response behavior."],
      ["Flutter Hot Reload", "Use hot restart when constructor or instance-field initialization does not refresh."],
    ],
  },
  roadmap: {
    title: "Roadmap",
    description: "Suggested next improvements.",
    sections: [
      ["Near Term", "Add real auth gates, persistent cart, real product database, and docs search."],
      ["Mid Term", "Add payments, order tracking integrations, admin analytics, and notification workflows."],
      ["Long Term", "Split website, docs, API, and admin into separately deployable surfaces as traffic grows."],
    ],
  },
} as const;

export type DocSlug = keyof typeof docs;
