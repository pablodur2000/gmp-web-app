# QA Test Plan - Jira Epic & Story Structure

**Project:** QA  
**Based on:** `Repos/gmp-ui-test/TEST_PLAN.md`  
**Created:** 2025-12-01

---

## Overview

This document maps the comprehensive E2E test plan to Jira Epics and Stories in the QA project. Each Epic represents a major testing area, and Stories represent specific test scenarios or test suites.

---

## Phase 1: Foundation Tests - Deep Analysis (Desktop Only)

**Goal:** Establish comprehensive test infrastructure and verify critical paths with deep validation  
**Timeline:** Week 1  
**Total Test Files:** 8  
**Total Epics:** 3  
**Total Stories:** 8  
**Estimated Total Execution Time:** 3-5 minutes (comprehensive testing with interactions)  
**Priority:** Highest - Must complete before other phases  
**Viewport:** Desktop only (1920x1080) - Mobile testing in separate phase  
**Test Depth:** Comprehensive - Interactions, animations, data validation, API calls, user flows

### Phase 1 Overview

Phase 1 focuses on establishing a **comprehensive** foundation of the test suite by:
1. **Smoke Tests** - Deep health checks with interaction validation (3 tests, ~30-45 seconds total)
2. **HomePage Tests** - Comprehensive HomePage functionality with animations, interactions, and data validation (3 tests, ~2-3 minutes total)
3. **Navigation Tests** - Full navigation testing with dropdowns, hover states, and state management (2 tests, ~30-45 seconds total)

**Key Improvements Over Basic Tests:**
- ✅ **Interaction Testing** - Not just visibility, but actual user interactions (clicks, hovers, scrolls)
- ✅ **Data Validation** - Verify content correctness, image loading, data from Supabase
- ✅ **Animation/Transition Verification** - Test Intersection Observer animations, carousel transitions
- ✅ **State Management** - Verify component states, modal open/close, dropdown visibility
- ✅ **Edge Cases** - Empty states, error handling, loading states
- ✅ **User Flows** - Complete user journeys, not just isolated elements
- ✅ **Performance Checks** - Page load times, network requests, image loading
- ✅ **Accessibility Basics** - Alt text, ARIA labels, keyboard navigation
- ✅ **Form Validation** - Input field validation, button states
- ✅ **Scroll Behavior** - Smooth scrolling, Intersection Observer triggers

These tests are prioritized because:
- They provide comprehensive feedback on critical paths
- They verify both visual and functional aspects
- They catch regressions in interactions, not just display
- They establish baseline for all future tests
- They validate real user experiences, not just technical checks

### Phase 1 Test Breakdown

#### Epic 1: Smoke Tests (3 Stories)
**Purpose:** Comprehensive health checks that verify critical paths with interactions, data validation, and API calls  
**Execution Time:** ~30-45 seconds total  
**Frequency:** Run on every commit, every deployment  
**Viewport:** Desktop (1920x1080) - Mobile testing in separate phase

1. **Critical Public Paths** - Verifies HomePage, CatalogPage, ProductDetailPage load with:
   - Content validation (text, images, data from Supabase)
   - Interactions (clicks, scrolls, navigation)
   - Data correctness (API responses match displayed content)
   - Performance checks (load times, network requests)
   - Image loading verification

2. **Critical Admin Paths** - Verifies AdminLoginPage loads with:
   - Form validation (empty fields, email format)
   - Password visibility toggle functionality
   - AdminDashboardPage requires auth with:
   - Redirect verification (timing, security)
   - No content exposure

3. **Critical Navigation** - Verifies header, logo, dropdown menus with:
   - Hover states and interactions
   - Active link highlighting
   - Dropdown menu behavior
   - Smooth scrolling

#### Epic 2: HomePage Testing (3 Stories - Phase 1)
**Purpose:** Comprehensive HomePage testing with animations, interactions, data validation, Intersection Observer, and complete user flows  
**Execution Time:** ~2-3 minutes total  
**Frequency:** Run on every commit, every deployment  
**Viewport:** Desktop (1920x1080) - Mobile testing in separate phase

1. **HomePage Loads and Displays** - Verifies all sections with:
   - Intersection Observer animations (trigger on scroll)
   - Scroll behavior (smooth scrolling, section visibility)
   - Content validation (text, images, data)
   - Supabase API calls (Featured Products loading)
   - Image loading (no broken images)
   - Performance metrics (load times)

2. **Hero Section Comprehensive** - Verifies:
   - Carousel auto-advance (all 4 slides, 5-second intervals)
   - First-visit animation sequence (2.5s, 5 steps)
   - Parallax effects (mouse movement)
   - CTA button interactions (hover, click, navigation)
   - All slide content (titles, subtitles, descriptions, images)

3. **HomePage Interactions and Flows** - Verifies:
   - All CTA buttons (hero, CTA section, header)
   - Map modal open/close (button click, modal display, close button)
   - Location section animations (Intersection Observer)
   - Featured Products data loading (Supabase API, product cards)
   - Complete user journey (home → catalog navigation)

#### Epic 5: Navigation Testing (2 Stories - Phase 1)
**Purpose:** Comprehensive navigation testing with dropdowns, hover states, active link management, smooth scrolling, and state management  
**Execution Time:** ~30-45 seconds total  
**Frequency:** Run on every commit, every deployment  
**Viewport:** Desktop (1920x1080) - Mobile testing in separate phase

1. **Header Navigation Comprehensive** - Verifies:
   - All navigation links (Inicio, Catálogo, Sobre GMP, Contacto)
   - Catalog dropdown menu (hover to open, category links, hover effects)
   - Category links with query parameters (`/catalogo?categoria={category}`)
   - Active link highlighting (based on current page)
   - Smooth scroll to anchor links (`#sobre-gmp`)
   - Navigation state management

2. **Logo and Navigation State** - Verifies:
   - Logo navigation from all pages (home, catalog, product detail)
   - URL changes correctly
   - Browser history management
   - Page state preservation

### Phase 1 Success Criteria

✅ **All smoke tests pass** - Critical paths are accessible with data validation  
✅ **All HomePage tests pass** - HomePage displays correctly with animations and interactions  
✅ **All navigation tests pass** - Navigation is functional with dropdowns and hover states  
✅ **No flaky tests** - Tests are stable and reliable  
✅ **Comprehensive execution** - All Phase 1 tests complete in 3-5 minutes (thorough testing)  
✅ **Excellent coverage** - Critical user paths are tested with interactions, not just visibility  
✅ **Data validation** - Tests verify data from Supabase matches displayed content  
✅ **Interaction testing** - Tests verify user interactions (clicks, hovers, scrolls)  
✅ **Animation verification** - Tests verify Intersection Observer animations and transitions  
✅ **Desktop focus** - All tests run on desktop viewport (mobile in separate phase)

### Phase 1 Dependencies

**Required Setup:**
- Test environment running (localhost:5173 or deployed URL)
- Test data in Supabase (at least 1 featured product for HomePage tests)
- Playwright browsers installed
- Test utilities configured (step-executor, etc.)

**No Dependencies On:**
- Authentication (smoke tests don't require login)
- Complex test data (basic products/categories sufficient)
- External services (except Supabase for product data)

### Phase 1 Test Data Requirements

**Minimum Test Data Needed:**
- At least 1 featured product (for FeaturedProducts section)
- At least 1 product with valid ID (for ProductDetailPage smoke test)
- Categories data (for navigation dropdown - can use mock data)

**Test Data Setup:**
- Can use existing production/staging data
- Or create minimal test data via admin panel
- No cleanup required (read-only tests)

---

## Epic Structure

### Epic 1: Smoke Tests - Critical Path Verification
**Priority:** Highest (Phase 1)  
**Goal:** Fast feedback on critical paths  
**Test Files:** 3  
**Estimated Time:** 15-20 minutes total execution  
**Links to GMP Epics:** GMP-4 (HomePage), GMP-26 (CatalogPage), GMP-34 (ProductDetailPage), GMP-10 (AdminLoginPage), GMP-17 (AdminDashboardPage)

#### Story 1: Smoke Test - Critical Public Paths Load Correctly (Comprehensive)
**Test File:** `smoke/critical-public-paths-load-correctly.spec.ts`  
**Priority:** Critical  
**Estimated Execution Time:** 10-15 seconds  
**Tags:** `@smoke`, `@heartbeat`, `@development`, `@staging`, `@production`  
**Viewport:** Desktop (1920x1080)

**What to Test (Comprehensive):**

- **HomePage (`/`):**
  - Page loads without errors (wait for `networkidle`)
  - Page title contains "GMP" (verify exact title format)
  - No JavaScript errors in console (capture and log errors)
  - Header is visible and sticky (verify on scroll)
  - Hero section is visible and interactive
  - Location section is visible (scroll to verify)
  - Featured Products section loads data from Supabase (verify API call)
  - Featured Products display correctly (verify product count, images load)
  - About GMP section is visible (scroll to verify)
  - CTA section is visible (scroll to verify)
  - All images load successfully (verify no broken images)
  - Intersection Observer animations trigger on scroll
  - Page load time is acceptable (< 3 seconds)

- **CatalogPage (`/catalogo`):**
  - Page loads without errors (wait for `networkidle`)
  - Page title is correct ("Catálogo de Productos" or similar)
  - No JavaScript errors in console
  - Product listing area is visible and populated
  - Products load from Supabase (verify API call)
  - Product count displays correctly
  - Filters sidebar is visible and functional
  - Main category filter buttons are visible (Todas, Cuero, Macramé)
  - Search input is visible and functional
  - View mode toggle is visible (Grid/List buttons)
  - At least one product card is visible and clickable
  - Product images load successfully

- **ProductDetailPage (`/producto/:id`):**
  - Page loads without errors (using valid product ID from database)
  - Page title contains product name (verify exact title)
  - No JavaScript errors in console
  - Product information section is visible with all data:
    - Product title matches database
    - Product price is formatted correctly (COP currency)
    - Product description is displayed
    - Product images are loaded
  - Image gallery is visible and functional
  - Breadcrumb navigation is visible and correct
  - Back to catalog button is visible and clickable
  - Product data matches Supabase data (verify API response)

**Acceptance Criteria:**
- All three public pages load successfully with full content
- No critical JavaScript errors in console
- Page titles are correct and match content
- All main content areas are visible and populated
- Data loads from Supabase correctly
- Images load successfully (no broken images)
- Intersection Observer animations work
- Test completes in < 15 seconds
- All interactive elements are functional (not just visible)

**Detailed Test Steps:**

1. **HomePage Test:**
   - Navigate to `/`
   - Wait for `networkidle` state
   - Verify page title contains "GMP"
   - Capture console errors (log but don't fail on warnings)
   - Verify header is visible and sticky (scroll down, verify header stays)
   - Verify hero section is visible with title, subtitle, description
   - Scroll to location section, verify Intersection Observer animation triggers
   - Verify location section displays: "Tienda Física", "Envíos a Todo el País", "Garantía de Calidad"
   - Scroll to Featured Products section
   - Verify Featured Products section loads (check for loading spinner, then products)
   - Verify at least one featured product is displayed (if products exist in DB)
   - Verify product card has: image, title, price, inventory status
   - Verify product images load (check for broken images)
   - Scroll to About GMP section, verify it's visible
   - Scroll to CTA section, verify button is visible
   - Verify page load time < 3 seconds

2. **CatalogPage Test:**
   - Navigate to `/catalogo`
   - Wait for `networkidle` state
   - Verify page title
   - Verify header is visible
   - Verify page heading "Catálogo de Productos" is visible
   - Verify filters sidebar is visible on left
   - Verify main category filter buttons: "Todas", "Cuero", "Macramé"
   - Verify search input is visible with Search icon
   - Verify view mode toggle buttons (Grid/List) are visible
   - Verify products load from Supabase (check network request)
   - Verify product count displays (e.g., "Mostrando X productos")
   - Verify at least one product card is visible
   - Verify product card has: image, title, price
   - Verify product images load successfully
   - Click on a product card, verify navigation to product detail page

3. **ProductDetailPage Test:**
   - Get a valid product ID from Supabase (or use known test product)
   - Navigate to `/producto/{productId}`
   - Wait for `networkidle` state
   - Verify page title contains product name
   - Verify breadcrumb navigation: "Inicio / Catálogo / {Product Name}"
   - Verify product title matches database
   - Verify product price is formatted correctly (COP currency, e.g., "$45.000")
   - Verify product description is displayed
   - Verify main product image is visible and loaded
   - Verify thumbnail images are visible (if multiple images)
   - Verify "Volver al Catálogo" button is visible
   - Click "Volver al Catálogo", verify navigation to `/catalogo`
   - Verify product data matches Supabase (compare displayed data with API response)

**Test Structure:**
```typescript
test.describe('Smoke Test - Critical Public Paths (Comprehensive)', () => {
  test('HomePage loads correctly with all sections and data', { 
    tag: ['@smoke', '@desktop'] 
  }, async ({ page }) => {
    // Navigate, wait for networkidle
    // Verify title, console errors
    // Verify header sticky behavior
    // Scroll and verify each section
    // Verify Intersection Observer animations
    // Verify Featured Products load from Supabase
    // Verify images load
    // Verify page load time
  });
  
  test('CatalogPage loads correctly with products and filters', { 
    tag: ['@smoke', '@desktop'] 
  }, async ({ page }) => {
    // Navigate, wait for networkidle
    // Verify all UI elements
    // Verify products load from Supabase
    // Verify product cards are clickable
    // Verify navigation to product detail
  });
  
  test('ProductDetailPage loads correctly with product data', { 
    tag: ['@smoke', '@desktop'] 
  }, async ({ page }) => {
    // Get product ID from Supabase
    // Navigate to product detail
    // Verify all product data matches database
    // Verify images load
    // Verify navigation back to catalog
  });
});
```

---

#### Story 2: Smoke Test - Critical Admin Paths Require Authentication (Comprehensive)
**Test File:** `smoke/critical-admin-paths-require-authentication.spec.ts`  
**Priority:** Critical  
**Estimated Execution Time:** 10-15 seconds  
**Tags:** `@smoke`, `@authentication`, `@admin`, `@development`, `@staging`  
**Viewport:** Desktop (1920x1080)

**What to Test (Comprehensive):**

- **AdminLoginPage (`/admin/login`):**
  - Page loads without errors (wait for `networkidle`)
  - Page title is correct
  - Login form is visible and properly styled
  - Email input field is present, visible, and focusable
  - Password input field is present, visible, and focusable
  - Password visibility toggle button is present (Eye/EyeOff icon)
  - Submit button is present, visible, and enabled
  - Submit button text is "Sign In to Admin"
  - Form validation works (try submitting empty form)
  - Email field accepts email format
  - Password field masks input (shows dots)
  - Password visibility toggle works (click to show/hide password)
  - Form has proper labels and accessibility
  - Error message area is present (for displaying errors)
  - Loading state works (button shows spinner when submitting)
  - Branding elements are visible (logo, title "Admin Access")

- **AdminDashboardPage (`/admin/dashboard`) - Unauthenticated:**
  - Navigate directly to `/admin/dashboard` without authentication
  - Verify redirect happens automatically (check URL changes)
  - Verify redirect destination is `/admin/login`
  - Verify redirect happens before dashboard content loads
  - Verify no dashboard content is visible (security check)
  - Verify user is not authenticated (check localStorage/session)
  - Try accessing dashboard again, verify redirect persists
  - Verify browser history (back button behavior)

**Acceptance Criteria:**
- AdminLoginPage loads with all form elements functional
- Form validation works correctly
- Password visibility toggle functions
- AdminDashboardPage redirects unauthenticated users immediately
- Redirect is secure (no dashboard content exposed)
- No JavaScript errors
- All interactive elements are functional
- Test completes in < 15 seconds

**Detailed Test Steps:**

1. **AdminLoginPage Test:**
   - Navigate to `/admin/login`
   - Wait for `networkidle` state
   - Verify page title
   - Verify "Admin Access" heading is visible
   - Verify login form container is visible
   - Verify email input field:
     - Field is visible and enabled
     - Placeholder text is present
     - Label "Email Address" is visible
     - Mail icon is visible on left
     - Field is focusable (click and verify focus)
   - Verify password input field:
     - Field is visible and enabled
     - Placeholder text is present
     - Label "Password" is visible
     - Lock icon is visible on left
     - Eye/EyeOff icon button is visible on right
     - Field masks input by default
   - Test password visibility toggle:
     - Click Eye icon, verify password is visible
     - Click EyeOff icon, verify password is masked
   - Verify submit button:
     - Button is visible and enabled
     - Button text is "Sign In to Admin"
     - Button has correct styling
   - Test form validation:
     - Click submit with empty fields, verify validation (if implemented)
     - Enter invalid email format, verify validation
   - Verify error message area is present (even if empty)
   - Verify branding elements (logo, title)

2. **AdminDashboardPage Unauthenticated Access Test:**
   - Clear any existing authentication (clear localStorage, cookies)
   - Navigate directly to `/admin/dashboard`
   - Verify redirect happens (wait for URL change)
   - Verify final URL is `/admin/login`
   - Verify redirect happens quickly (< 1 second)
   - Verify no dashboard content is visible during redirect
   - Verify login page loads after redirect
   - Try accessing dashboard again, verify redirect persists
   - Verify browser back button works correctly

**Test Structure:**
```typescript
test.describe('Smoke Test - Critical Admin Paths (Comprehensive)', () => {
  test('AdminLoginPage loads correctly with functional form', { 
    tag: ['@smoke', '@admin', '@desktop'] 
  }, async ({ page }) => {
    // Navigate to /admin/login
    // Verify all form elements
    // Test password visibility toggle
    // Test form validation
    // Verify interactive elements
  });
  
  test('AdminDashboardPage requires authentication and redirects', { 
    tag: ['@smoke', '@admin', '@desktop'] 
  }, async ({ page }) => {
    // Clear authentication
    // Navigate to /admin/dashboard
    // Verify redirect to /admin/login
    // Verify no dashboard content exposed
    // Verify redirect timing
  });
});
```

---

#### Story 3: Smoke Test - Critical Navigation Elements Work Correctly (Comprehensive)
**Test File:** `smoke/critical-navigation-elements-work-correctly.spec.ts`  
**Priority:** Critical  
**Estimated Execution Time:** 10-15 seconds  
**Tags:** `@smoke`, `@navigation`, `@desktop`, `@development`, `@staging`, `@production`  
**Viewport:** Desktop (1920x1080) - Mobile testing in separate phase

**What to Test (Comprehensive - Desktop Only):**

- **Header Element:**
  - Header is visible on page load
  - Header is sticky (stays at top when scrolling down)
  - Header has correct background (white with shadow)
  - Header height is correct (~64px)
  - Header z-index is correct (stays above content)

- **Logo:**
  - Logo image is visible and loaded
  - Logo has correct alt text ("Logo")
  - Logo is clickable (cursor changes to pointer on hover)
  - Logo navigates to home page (`/`) on click
  - Logo maintains aspect ratio
  - Logo is properly positioned in header

- **Navigation Links (Desktop):**
  - "Inicio" link is visible and clickable
  - "Catálogo" link is visible and clickable
  - "Sobre GMP" link is visible and clickable
  - "Contacto" link is visible (if present)
  - Links have correct hover states (color changes, background changes)
  - Active link highlighting works (current page link is highlighted)
  - Links navigate to correct URLs

- **Catalog Dropdown Menu (Desktop):**
  - "Catálogo" link shows dropdown on hover
  - Dropdown menu appears with correct styling
  - Dropdown displays category list (Billeteras, Cinturones, etc.)
  - Each category link is clickable
  - Category links navigate to `/catalogo?categoria={category}`
  - Dropdown closes when mouse leaves
  - Dropdown has correct z-index (appears above content)
  - Category links have hover effects

- **Header CTA Button (Desktop):**
  - "Ver Catálogo" button is visible in header
  - Button has correct styling (primary button style)
  - Button is clickable
  - Button navigates to `/catalogo` on click
  - Button has hover effect

**Acceptance Criteria:**
- All navigation elements are visible and functional
- Logo navigates to home page correctly
- All navigation links work and navigate correctly
- Catalog dropdown menu works with hover
- Active link highlighting works
- Header sticky behavior works
- All hover states work correctly
- Test completes in < 15 seconds
- **Note:** Mobile menu testing is excluded (separate phase)

**Detailed Test Steps:**

1. **Header and Logo Test:**
   - Navigate to home page
   - Verify header is visible immediately
   - Verify header has white background with shadow
   - Scroll down page, verify header stays at top (sticky)
   - Scroll back to top, verify header remains visible
   - Verify logo is visible in header
   - Verify logo has alt text "Logo"
   - Hover over logo, verify cursor changes to pointer
   - Click logo, verify navigation to `/`
   - Navigate to `/catalogo`, verify logo still visible
   - Click logo from catalog page, verify navigation to home

2. **Navigation Links Test (Desktop):**
   - Navigate to home page
   - Verify "Inicio" link is visible
   - Verify "Catálogo" link is visible
   - Verify "Sobre GMP" link is visible
   - Verify "Contacto" link is visible (if present)
   - Test "Inicio" link:
     - Click "Inicio" link
     - Verify URL is `/`
     - Verify "Inicio" link has active styling (highlighted)
   - Test "Catálogo" link:
     - Click "Catálogo" link
     - Verify URL is `/catalogo`
     - Verify "Catálogo" link has active styling
   - Test hover states:
     - Hover over each link, verify color/background changes
     - Verify hover effects are smooth (transitions)

3. **Catalog Dropdown Menu Test (Desktop):**
   - Navigate to home page
   - Hover over "Catálogo" link
   - Verify dropdown menu appears
   - Verify dropdown has correct styling (white background, shadow, rounded)
   - Verify dropdown displays category list:
     - "Billeteras" with description
     - "Cinturones" with description
     - "Bolsos" with description
     - "Accesorios" with description
   - Verify each category link is visible and clickable
   - Test category link click:
     - Click "Billeteras" category
     - Verify URL is `/catalogo?categoria=billeteras`
     - Verify catalog page loads
     - Navigate back to home
   - Test dropdown close:
     - Hover over "Catálogo" to open dropdown
     - Move mouse away from dropdown
     - Verify dropdown closes
   - Test dropdown hover effects:
     - Hover over category items, verify hover effects

4. **Header CTA Button Test (Desktop):**
   - Navigate to home page
   - Verify "Ver Catálogo" button is visible in header
   - Verify button has primary button styling
   - Hover over button, verify hover effect
   - Click button, verify navigation to `/catalogo`
   - Verify button works from any page

5. **Active Link Highlighting Test:**
   - Navigate to `/`
   - Verify "Inicio" link has active styling (leather-800 text, leather-100 background)
   - Navigate to `/catalogo`
   - Verify "Catálogo" link has active styling
   - Verify "Inicio" link does NOT have active styling

**Test Structure:**
```typescript
test.describe('Smoke Test - Critical Navigation (Desktop Only)', () => {
  test('Header and logo are functional', { 
    tag: ['@smoke', '@navigation', '@desktop'] 
  }, async ({ page }) => {
    // Verify header sticky behavior
    // Verify logo visibility and navigation
    // Test from multiple pages
  });
  
  test('Navigation links work correctly with hover states', { 
    tag: ['@smoke', '@navigation', '@desktop'] 
  }, async ({ page }) => {
    // Verify all navigation links
    // Test navigation
    // Test hover states
    // Test active link highlighting
  });
  
  test('Catalog dropdown menu works correctly', { 
    tag: ['@smoke', '@navigation', '@desktop'] 
  }, async ({ page }) => {
    // Test dropdown on hover
    // Test category links
    // Test dropdown close
    // Test hover effects
  });
  
  test('Header CTA button works correctly', { 
    tag: ['@smoke', '@navigation', '@desktop'] 
  }, async ({ page }) => {
    // Verify button visibility
    // Test button click
    // Test navigation
  });
});
```

---

### Epic 2: Public Pages - HomePage Testing
**Priority:** High (Phase 1)  
**Goal:** Verify HomePage functionality  
**Test Files:** 3 (Phase 1), 6 total (all phases)  
**Links to GMP Epic:** GMP-4 (HomePage Epic)

#### Story 1: Test Case - HomePage Loads and Displays Correctly
**Test File:** `e2e/public/home-page/home-page-loads-and-displays-correctly.spec.ts`  
**Priority:** High  
**Estimated Execution Time:** 10-15 seconds  
**Tags:** `@e2e`, `@public`, `@homepage`, `@development`, `@staging`, `@production`

**What to Test:**
- **Page Load:**
  - Navigate to `/` (home page)
  - Wait for page to load completely (`networkidle`)
  - Verify page title contains "GMP"
  - Check for console errors (warn but don't fail)

- **Main Sections Visibility:**
  - Hero Section is visible
  - Location Section is visible
  - Featured Products Section is visible (if products exist)
  - About GMP Section is visible
  - CTA Section is visible

- **Page Health:**
  - No critical JavaScript errors
  - Page content is rendered (body not empty)
  - Images load correctly (no broken images)

**Acceptance Criteria:**
- Page loads successfully
- All main sections are visible
- No critical errors
- Page is fully interactive

**Detailed Test Steps:**

1. **Initial Page Load:**
   - Navigate to `/`
   - Start performance timer
   - Wait for `networkidle` state
   - Stop timer, verify load time < 3 seconds
   - Verify page title contains "GMP"
   - Capture console errors (log all, fail on critical)

2. **Hero Section Verification:**
   - Verify hero section is visible immediately
   - Verify hero section height is at least viewport height
   - Verify background images are loaded (check network requests)
   - Verify title, subtitle, description are visible
   - Verify CTA button is visible and styled correctly
   - Verify overlay is present (dark overlay on images)

3. **Location Section Verification:**
   - Scroll down to location section (smooth scroll)
   - Wait for Intersection Observer to trigger
   - Verify section heading "Ubicación" is visible
   - Verify three info cards animate in:
     - "Tienda Física" card (MapPin icon)
     - "Envíos a Todo el País" card (Truck icon)
     - "Garantía de Calidad" card (Shield icon)
   - Verify location address is displayed correctly
   - Verify "Ver mapa" button is visible
   - Verify location icon card (right side) is visible
   - Verify "Rastrear Envío" link is present with correct href

4. **Featured Products Section Verification:**
   - Scroll to Featured Products section
   - Verify section heading "Productos Destacados" is visible
   - Verify loading spinner appears initially
   - Wait for products to load (check network request to Supabase)
   - Verify API call: `GET /rest/v1/products?featured=eq.true&available=eq.true`
   - If products exist:
     - Verify at least one product card is visible
     - Verify product image loads (check image src)
     - Verify product title is displayed
     - Verify product price is formatted (UYU currency)
     - Verify inventory status badge is displayed
     - Verify "Ver más" button is visible
     - Click product card, verify navigation to product detail
     - Navigate back to home
   - If no products: verify section doesn't render (returns null)
   - Verify "Ver todos los productos" link is visible
   - Click link, verify navigation to `/catalogo`
   - Navigate back to home

5. **About GMP Section Verification:**
   - Scroll to About GMP section
   - Verify section has ID `#sobre-gmp`
   - Wait for Intersection Observer animation
   - Verify section heading "Sobre GMP" is visible
   - Verify section description is visible
   - Verify image is loaded (check image src and alt text)
   - Verify "Gabriela Ponzoni" heading is visible
   - Verify description text about marroquinería and macramé
   - Verify animations trigger (check translate-x, opacity changes)

6. **CTA Section Verification:**
   - Scroll to CTA section
   - Verify section has dark background
   - Verify heading is visible
   - Verify description text is visible
   - Verify "Ver Catálogo Completo" button is visible
   - Verify button styling (white background, leather-800 text)
   - Verify ArrowRight icon is present
   - Click button, verify navigation to `/catalogo`
   - Navigate back to home

7. **Page Health Check:**
   - Verify no broken images (check all img src attributes)
   - Verify all links have href attributes
   - Verify page is scrollable
   - Verify all sections are accessible via scroll

---

#### Story 2: Test Case - HomePage Hero Section Displays Correctly (Comprehensive)
**Test File:** `e2e/public/home-page/home-page-hero-section-displays-correctly.spec.ts`  
**Priority:** High  
**Estimated Execution Time:** 60-90 seconds  
**Tags:** `@e2e`, `@public`, `@homepage`, `@hero`, `@desktop`, `@development`, `@staging`, `@production`  
**Viewport:** Desktop (1920x1080)

**What to Test (Comprehensive):**

- **Hero Section Visibility and Content:**
  - Hero section container is visible and takes full viewport height
  - Background images are loaded (verify all 4 slide images load)
  - Title text is visible, readable, and properly styled (large font, white color)
  - Subtitle text is visible and properly styled (smaller font, leather-200 color)
  - Description text is visible and properly styled
  - CTA button "Explorar Catálogo" is visible with correct styling
  - Overlay (dark overlay on background) is present and visible
  - Decorative elements are visible (blur circles)

- **Carousel Functionality (Comprehensive):**
  - **Auto-Advance:**
    - Carousel auto-advances every 5 seconds (verify timing)
    - Background image changes between slides (verify image URL changes)
    - Title updates with slide (verify text changes)
    - Subtitle updates with slide (verify text changes)
    - Description updates with slide (verify text changes)
    - Smooth transitions between slides (verify opacity transitions)
    - Carousel loops correctly (returns to slide 0 after slide 3)
  - **All 4 Slides:**
    - Slide 1: "Artesanías en Cuero" - verify title, subtitle, description, image
    - Slide 2: "Macramé Artesanal" - verify title, subtitle, description, image
    - Slide 3: "Desde Paysandú" - verify title, subtitle, description, image
    - Slide 4: "Monederos Artesanales" - verify title, subtitle, description, image
  - **Image Loading:**
    - All 4 background images load successfully
    - Images have correct URLs
    - Images are properly sized and positioned

- **First Visit Animation Sequence (Comprehensive):**
  - Animation plays on first visit (fresh page load)
  - **Step 1 (0-0.5s):** Logo is visible initially
  - **Step 2 (0.5-1s):** Logo disappears, white curtain starts sliding up
  - **Step 3 (1-1.5s):** White curtain finishes sliding up to header height
  - **Step 4 (1.5-2s):** Header appears smoothly
  - **Step 5 (2-2.5s):** Animation completes, scroll is enabled
  - Scroll is disabled during animation (verify body overflow is hidden)
  - Scroll is enabled after animation (verify body overflow is auto)
  - Header is hidden initially (verify header-hidden class)
  - Header appears after animation (verify header-visible class)
  - Animation doesn't play on subsequent visits (verify localStorage or state)

- **Parallax Effect:**
  - Parallax effect works on mouse move
  - Background image moves slightly based on mouse position
  - Effect is smooth and responsive

- **CTA Button (Comprehensive):**
  - Button is visible and properly styled
  - Button text "Explorar Catálogo" is visible
  - ArrowRight icon is present
  - Button has hover effect (verify scale transform on hover)
  - Button is clickable (cursor changes to pointer)
  - Button navigates to `/catalogo` on click
  - Button has correct link (verify href or to prop)
  - Button has group hover effect (icon translates on hover)

**Acceptance Criteria:**
- Hero section displays all elements correctly with proper styling
- Carousel auto-advances through all 4 slides with correct timing
- All slide content (title, subtitle, description, images) is correct
- First visit animation completes successfully in 2.5 seconds
- Scroll is properly disabled/enabled during animation
- CTA button navigates to catalog page correctly
- Parallax effect works on mouse movement
- All text is readable and properly formatted
- All images load successfully

**Detailed Test Steps:**

1. **Initial Load and First Visit Animation:**
   - Navigate to `/` (fresh page load)
   - Verify logo appears immediately (first visit animation)
   - Wait for animation sequence:
     - 0-0.5s: Logo visible
     - 0.5-1s: Logo disappears, white curtain starts
     - 1-1.5s: White curtain finishes sliding up
     - 1.5-2s: Header appears
     - 2-2.5s: Animation completes
   - Verify scroll is disabled during animation (try scrolling, should not work)
   - Verify scroll is enabled after animation (try scrolling, should work)
   - Verify header is visible after animation

2. **Hero Section Content Verification:**
   - Verify hero section is visible and full height
   - Verify background image is loaded (check image URL)
   - Verify overlay is present (dark overlay)
   - Verify title is visible (check current slide title)
   - Verify subtitle is visible (check current slide subtitle)
   - Verify description is visible (check current slide description)
   - Verify CTA button is visible with text "Explorar Catálogo"
   - Verify ArrowRight icon is present in button
   - Verify decorative elements (blur circles) are visible

3. **Carousel Auto-Advance Test:**
   - Note current slide (slide 0: "Artesanías en Cuero")
   - Wait 5 seconds
   - Verify slide changes to slide 1 ("Macramé Artesanal")
   - Verify title, subtitle, description update
   - Verify background image URL changes
   - Wait 5 seconds
   - Verify slide changes to slide 2 ("Desde Paysandú")
   - Verify content updates
   - Wait 5 seconds
   - Verify slide changes to slide 3 ("Monederos Artesanales")
   - Verify content updates
   - Wait 5 seconds
   - Verify slide loops back to slide 0 ("Artesanías en Cuero")
   - Verify all 4 slides cycle correctly

4. **All Slides Content Verification:**
   - Wait for each slide and verify:
     - **Slide 0:** Title="Artesanías en Cuero", Subtitle="Hechas con Amor y Tradición"
     - **Slide 1:** Title="Macramé Artesanal", Subtitle="Tejidos que Transforman Espacios"
     - **Slide 2:** Title="Desde Paysandú", Subtitle="Para Todo Uruguay"
     - **Slide 3:** Title="Monederos Artesanales", Subtitle="Detalles que Marcan la Diferencia"
   - Verify each slide's description text is correct
   - Verify each slide's background image loads

5. **Parallax Effect Test:**
   - Move mouse to center of screen
   - Move mouse to top-left corner
   - Verify background image moves slightly (parallax effect)
   - Move mouse to bottom-right corner
   - Verify background image moves in opposite direction
   - Verify effect is smooth and responsive

6. **CTA Button Test:**
   - Verify button is visible
   - Hover over button, verify scale transform (hover:scale-105)
   - Hover over button, verify ArrowRight icon translates (group-hover:translate-x-1)
   - Click button, verify navigation to `/catalogo`
   - Verify URL changes correctly
   - Navigate back to home

7. **Subsequent Visit Test:**
   - Navigate away from home page
   - Navigate back to home page
   - Verify first visit animation does NOT play again (if implemented)
   - Verify hero section loads immediately without animation

---

#### Story 3: Test Case - HomePage Navigation to Catalog Works Correctly (Comprehensive)
**Test File:** `e2e/public/home-page/home-page-navigation-to-catalog-works-correctly.spec.ts`  
**Priority:** High  
**Estimated Execution Time:** 30-45 seconds  
**Tags:** `@e2e`, `@public`, `@homepage`, `@navigation`, `@desktop`, `@development`, `@staging`, `@production`  
**Viewport:** Desktop (1920x1080)

**What to Test (Comprehensive):**

- **Hero Section CTA (Comprehensive):**
  - "Explorar Catálogo" button in hero section
  - Button is visible immediately (no scroll needed)
  - Button has correct styling (leather-600 background, white text)
  - Button text "Explorar Catálogo" is visible
  - ArrowRight icon is present in button
  - Button has hover effects:
    - Background changes to leather-700 on hover
    - Button scales up slightly (hover:scale-105)
    - ArrowRight icon translates right (group-hover:translate-x-1)
  - Button is clickable (cursor changes to pointer)
  - Button navigates to `/catalogo` on click
  - Navigation is smooth (no page reload, uses React Router)
  - Button works before and after first visit animation

- **CTA Section Button (Comprehensive):**
  - "Ver Catálogo Completo" button in CTA section
  - Scroll to CTA section (verify smooth scroll)
  - Button is visible in CTA section
  - Button has correct styling (white background, leather-800 text)
  - Button text "Ver Catálogo Completo" is visible
  - ArrowRight icon is present
  - Button has hover effect (hover:bg-leather-50)
  - Button is clickable
  - Button navigates to `/catalogo` on click
  - Navigation is smooth
  - CTA section has correct background (leather-800)

- **Header CTA Button (Desktop - Comprehensive):**
  - "Ver Catálogo" button in header
  - Button is visible in header (desktop viewport)
  - Button has primary button styling (btn-primary class)
  - ShoppingBag icon is present
  - Button text "Ver Catálogo" is visible
  - Button has hover effect
  - Button is clickable
  - Button navigates to `/catalogo` on click
  - Button is always visible (sticky header)
  - Button works from any scroll position

- **Navigation State and History:**
  - Verify browser history is updated correctly
  - Verify back button works (navigate back from catalog)
  - Verify URL changes correctly
  - Verify page state is preserved (if applicable)

**Acceptance Criteria:**
- All three CTA buttons navigate to catalog page correctly
- All buttons have correct styling and hover effects
- Navigation is smooth (React Router, no page reload)
- Buttons are visible and accessible
- Buttons work from any page state
- Browser history is managed correctly
- All buttons work on desktop viewport

**Detailed Test Steps:**

1. **Hero Section CTA Test:**
   - Navigate to `/`
   - Wait for page to load (including first visit animation)
   - Locate "Explorar Catálogo" button in hero section
   - Verify button is visible immediately (no scroll needed)
   - Verify button styling (leather-600 background, white text, rounded-lg)
   - Verify ArrowRight icon is present
   - Test hover effect:
     - Hover over button
     - Verify background changes to leather-700
     - Verify button scales up slightly (transform scale)
     - Verify ArrowRight icon translates right
   - Click button
   - Verify URL changes to `/catalogo`
   - Verify catalog page loads correctly
   - Verify navigation is smooth (no page reload)
   - Navigate back to home (browser back button)
   - Verify home page loads correctly

2. **CTA Section Button Test:**
   - Navigate to `/`
   - Scroll down to CTA section (smooth scroll)
   - Verify CTA section is visible
   - Verify section has dark background (leather-800)
   - Locate "Ver Catálogo Completo" button
   - Verify button is visible
   - Verify button styling (white background, leather-800 text)
   - Verify ArrowRight icon is present
   - Test hover effect:
     - Hover over button
     - Verify background changes to leather-50
   - Click button
   - Verify URL changes to `/catalogo`
   - Verify catalog page loads correctly
   - Navigate back to home

3. **Header CTA Button Test (Desktop):**
   - Navigate to `/`
   - Verify header is visible (sticky header)
   - Locate "Ver Catálogo" button in header
   - Verify button is visible (desktop viewport)
   - Verify button has primary styling (btn-primary class)
   - Verify ShoppingBag icon is present
   - Verify button text "Ver Catálogo" is visible
   - Test hover effect (if applicable)
   - Click button
   - Verify URL changes to `/catalogo`
   - Verify catalog page loads correctly
   - Navigate back to home

4. **Navigation from Different States:**
   - Navigate to `/`
   - Scroll down to middle of page
   - Click header "Ver Catálogo" button
   - Verify navigation works from scrolled position
   - Navigate back to home
   - Verify page scrolls to top (or maintains position, depending on implementation)

5. **Browser History Test:**
   - Navigate to `/`
   - Click any CTA button to go to `/catalogo`
   - Verify browser back button works
   - Click back button
   - Verify navigation back to `/`
   - Verify home page loads correctly

---

### Epic 5: Public Pages - Navigation Testing
**Priority:** High (Phase 1)  
**Goal:** Verify navigation functionality  
**Test Files:** 2 (Phase 1), 4 total (all phases)  
**Links to GMP Epic:** GMP-4 (HomePage Epic) - Navigation is part of HomePage

#### Story 1: Test Case - Header Navigation Links Work Correctly (Comprehensive)
**Test File:** `e2e/public/navigation/header-navigation-links-work-correctly.spec.ts`  
**Priority:** High  
**Estimated Execution Time:** 45-60 seconds  
**Tags:** `@e2e`, `@public`, `@navigation`, `@desktop`, `@development`, `@staging`, `@production`  
**Viewport:** Desktop (1920x1080)

**What to Test (Comprehensive - Desktop Only):**

- **Desktop Navigation Links:**
  - "Inicio" link is visible and clickable
  - "Inicio" link navigates to `/` on click
  - "Catálogo" link is visible and clickable
  - "Catálogo" link navigates to `/catalogo` on click
  - "Sobre GMP" link is visible and clickable
  - "Sobre GMP" link performs smooth scroll to `#sobre-gmp` section
  - "Contacto" link is visible (if exists)
  - "Contacto" link navigates to `/contacto` (if exists)
  - All links have correct spacing and alignment

- **Active Link Highlighting (Comprehensive):**
  - When on home page (`/`), "Inicio" link has active styling:
    - Text color: leather-800
    - Background: leather-100
  - When on catalog page (`/catalogo`), "Catálogo" link has active styling
  - When on other pages, appropriate link has active styling
  - Active styling is applied correctly (not on wrong links)
  - Active styling persists during navigation

- **Catalog Dropdown Menu (Comprehensive - Desktop):**
  - "Catálogo" link shows dropdown on hover (desktop only)
  - Dropdown menu appears with correct timing
  - Dropdown has correct styling:
    - White background
    - Shadow (shadow-lg)
    - Rounded corners (rounded-lg)
    - Border (border-gray-200)
  - Dropdown displays category list:
    - "Billeteras" with description
    - "Cinturones" with description
    - "Bolsos" with description
    - "Accesorios" with description
  - Each category link is visible and clickable
  - Each category link has hover effect (hover:bg-leather-50)
  - Category links navigate to `/catalogo?categoria={category}` (lowercase)
  - Dropdown closes when mouse leaves (onMouseLeave)
  - Dropdown stays open when hovering over it
  - Dropdown has correct z-index (appears above content)
  - ChevronDown icon is visible on "Catálogo" link

- **Link Hover States (Comprehensive):**
  - Hover over "Inicio" link:
    - Text color changes to leather-800
    - Background changes to leather-50
    - Transition is smooth
  - Hover over "Catálogo" link:
    - Same hover effects
    - Dropdown appears
  - Hover over "Sobre GMP" link:
    - Same hover effects
  - Hover effects work consistently across all links

- **Smooth Scroll to Anchor (Comprehensive):**
  - Click "Sobre GMP" link
  - Verify smooth scroll behavior (scroll-behavior: smooth)
  - Verify page scrolls to `#sobre-gmp` section
  - Verify section is visible in viewport after scroll
  - Verify URL updates (if implemented) or stays as `/`
  - Verify scroll completes smoothly (not instant jump)

**Acceptance Criteria:**
- All navigation links work correctly and navigate to correct pages
- Dropdown menu displays and functions properly with hover
- Active link highlighting works correctly based on current page
- Smooth scroll works for anchor links
- All hover states work correctly
- Dropdown menu has correct styling and behavior
- Category links navigate with correct query parameters

**Detailed Test Steps:**

1. **Navigation Links Test:**
   - Navigate to `/`
   - Verify all navigation links are visible: "Inicio", "Catálogo", "Sobre GMP", "Contacto"
   - Test "Inicio" link:
     - Click "Inicio" link
     - Verify URL is `/`
     - Verify page is home page
     - Verify "Inicio" link has active styling
   - Test "Catálogo" link:
     - Click "Catálogo" link
     - Verify URL is `/catalogo`
     - Verify catalog page loads
     - Verify "Catálogo" link has active styling
     - Navigate back to home

2. **Catalog Dropdown Menu Test (Comprehensive):**
   - Navigate to `/`
   - Hover over "Catálogo" link
   - Verify dropdown menu appears (wait for animation)
   - Verify dropdown has correct styling (white, shadow, rounded)
   - Verify dropdown displays 4 categories:
     - "Billeteras" with description "Billeteras y portamonedas"
     - "Cinturones" with description "Cinturones de cuero"
     - "Bolsos" with description "Bolsos y carteras"
     - "Accesorios" with description "Accesorios varios"
   - Verify each category item has hover effect (hover over item, verify background changes)
   - Test category link click:
     - Click "Billeteras" category
     - Verify URL is `/catalogo?categoria=billeteras`
     - Verify catalog page loads
     - Verify filter is applied (if implemented)
     - Navigate back to home
   - Test dropdown close:
     - Hover over "Catálogo" to open dropdown
     - Move mouse away from dropdown area
     - Verify dropdown closes
   - Test dropdown persistence:
     - Hover over "Catálogo" to open dropdown
     - Move mouse to dropdown menu (without leaving)
     - Verify dropdown stays open
     - Move mouse back to "Catálogo" link
     - Verify dropdown stays open

3. **Smooth Scroll to Anchor Test:**
   - Navigate to `/`
   - Scroll to top of page
   - Click "Sobre GMP" link
   - Verify smooth scroll behavior (not instant jump)
   - Verify page scrolls to `#sobre-gmp` section
   - Verify section is visible in viewport
   - Verify section heading "Sobre GMP" is visible
   - Verify scroll completes smoothly

4. **Active Link Highlighting Test (Comprehensive):**
   - Navigate to `/`
   - Verify "Inicio" link has active styling:
     - Text color is leather-800
     - Background is leather-100
   - Verify other links do NOT have active styling
   - Navigate to `/catalogo`
   - Verify "Catálogo" link has active styling
   - Verify "Inicio" link does NOT have active styling
   - Navigate back to `/`
   - Verify "Inicio" link has active styling again

5. **Hover States Test:**
   - Navigate to `/`
   - Hover over "Inicio" link:
     - Verify text color changes to leather-800
     - Verify background changes to leather-50
     - Verify transition is smooth
   - Hover over "Catálogo" link:
     - Verify same hover effects
     - Verify dropdown appears
   - Hover over "Sobre GMP" link:
     - Verify same hover effects
   - Verify hover effects are consistent across all links

---

#### Story 2: Test Case - Header Logo Navigation Works Correctly (Comprehensive)
**Test File:** `e2e/public/navigation/header-logo-navigation-works-correctly.spec.ts`  
**Priority:** High  
**Estimated Execution Time:** 20-30 seconds  
**Tags:** `@e2e`, `@public`, `@navigation`, `@desktop`, `@development`, `@staging`, `@production`  
**Viewport:** Desktop (1920x1080)

**What to Test (Comprehensive - Desktop Only):**

- **Logo Visibility and Styling:**
  - Logo image is visible in header
  - Logo has correct alt text ("Logo")
  - Logo has correct dimensions (h-14, maintains aspect ratio)
  - Logo is properly positioned (left side of header)
  - Logo image loads successfully (no broken image)
  - Logo maintains aspect ratio on all pages
  - Logo is always visible (sticky header)

- **Logo Navigation (Comprehensive):**
  - Logo is clickable (cursor changes to pointer on hover)
  - Logo is wrapped in Link component (verify href or to prop)
  - Clicking logo navigates to `/` (home page)
  - Navigation works from any page:
    - From home page (`/`)
    - From catalog page (`/catalogo`)
    - From product detail page (`/producto/:id`)
    - From any other page
  - Navigation is smooth (React Router, no page reload)
  - URL changes correctly to `/`
  - Page state is reset (scrolls to top, or maintains position)

- **Logo Interaction States:**
  - Logo has hover effect (if implemented)
  - Logo is always accessible (not hidden by other elements)
  - Logo works even when header is sticky (scrolled position)

- **Navigation State Management:**
  - Browser history is updated correctly
  - Back button works after logo navigation
  - Page loads correctly after navigation

**Acceptance Criteria:**
- Logo is visible and clickable on all pages
- Logo navigates to home page from any page correctly
- Navigation is smooth and uses React Router
- Browser history is managed correctly
- Logo displays correctly on desktop viewport
- Logo is always accessible in sticky header

**Detailed Test Steps:**

1. **Logo Visibility Test:**
   - Navigate to `/`
   - Verify header is visible
   - Locate logo image in header (left side)
   - Verify logo image is loaded (check image src)
   - Verify logo has alt text "Logo"
   - Verify logo dimensions (h-14, maintains aspect ratio)
   - Verify logo is properly positioned (left side of header)

2. **Logo Navigation from Home:**
   - Navigate to `/`
   - Hover over logo, verify cursor changes to pointer
   - Click logo
   - Verify URL is `/` (stays on home if already there)
   - Verify page is home page
   - Verify no unnecessary reload

3. **Logo Navigation from Catalog:**
   - Navigate to `/catalogo`
   - Verify logo is visible in header
   - Click logo
   - Verify URL changes to `/`
   - Verify home page loads correctly
   - Verify navigation is smooth (React Router)
   - Verify page scrolls to top (or maintains position)

4. **Logo Navigation from Product Detail:**
   - Navigate to `/producto/{productId}` (use valid product ID)
   - Verify logo is visible in header
   - Click logo
   - Verify URL changes to `/`
   - Verify home page loads correctly
   - Verify navigation is smooth

5. **Logo Navigation from Scrolled Position:**
   - Navigate to `/`
   - Scroll down page (header becomes sticky)
   - Verify logo is still visible in sticky header
   - Click logo
   - Verify navigation to home works
   - Verify page scrolls to top (or maintains scroll position)

6. **Browser History Test:**
   - Navigate to `/catalogo`
   - Click logo to go to `/`
   - Verify browser back button works
   - Click back button
   - Verify navigation back to `/catalogo`
   - Verify catalog page loads correctly

7. **Logo Accessibility Test:**
   - Verify logo is always visible (not hidden by other elements)
   - Verify logo is clickable from any scroll position
   - Verify logo works in sticky header state

---

### Epic 3: Public Pages - CatalogPage Testing
**Priority:** High (Phase 2)  
**Goal:** Verify product browsing and filtering

**Stories:**
1. **Story:** Test Case - CatalogPage Loads and Displays All Products
   - Tests: `e2e/public/catalog-page/catalog-page-loads-and-displays-all-products.spec.ts`
   - Covers: Product listing, product cards display

2. **Story:** Test Case - CatalogPage Product Count Displays Correctly
   - Tests: `e2e/public/catalog-page/catalog-page-product-count-displays-correctly.spec.ts`
   - Covers: Results count, filtered count

3. **Story:** Test Case - CatalogPage Main Category Filter Works Correctly
   - Tests: `e2e/public/catalog-page/catalog-page-main-category-filter-works-correctly.spec.ts`
   - Covers: Cuero/Macramé filter buttons, product filtering

4. **Story:** Test Case - CatalogPage Subcategory Filter Works Correctly
   - Tests: `e2e/public/catalog-page/catalog-page-subcategory-filter-works-correctly.spec.ts`
   - Covers: Category filter sidebar, product filtering

5. **Story:** Test Case - CatalogPage Inventory Status Filter Works Correctly
   - Tests: `e2e/public/catalog-page/catalog-page-inventory-status-filter-works-correctly.spec.ts`
   - Covers: Inventory status checkboxes, product filtering

6. **Story:** Test Case - CatalogPage Search Functionality Works Correctly
   - Tests: `e2e/public/catalog-page/catalog-page-search-functionality-works-correctly.spec.ts`
   - Covers: Search input, debounce, search results

7. **Story:** Test Case - CatalogPage View Mode Switch Works Correctly
   - Tests: `e2e/public/catalog-page/catalog-page-view-mode-switch-works-correctly.spec.ts`
   - Covers: Grid/List toggle, layout changes

8. **Story:** Test Case - CatalogPage Navigation to Product Detail Works Correctly
   - Tests: `e2e/public/catalog-page/catalog-page-navigation-to-product-detail-works-correctly.spec.ts`
   - Covers: Product card click, navigation

---

### Epic 4: Public Pages - ProductDetailPage Testing
**Priority:** Medium (Phase 2)  
**Goal:** Verify product detail page functionality

**Stories:**
1. **Story:** Test Case - ProductDetailPage Loads and Displays Product Information
   - Tests: `e2e/public/product-detail-page/product-detail-page-loads-and-displays-product-information.spec.ts`
   - Covers: Product data display, price, description, badges

2. **Story:** Test Case - ProductDetailPage Image Gallery Works Correctly
   - Tests: `e2e/public/product-detail-page/product-detail-page-image-gallery-works-correctly.spec.ts`
   - Covers: Main image, thumbnail selection, image switching

3. **Story:** Test Case - ProductDetailPage Breadcrumb Navigation Works Correctly
   - Tests: `e2e/public/product-detail-page/product-detail-page-breadcrumb-navigation-works-correctly.spec.ts`
   - Covers: Breadcrumb links, navigation

4. **Story:** Test Case - ProductDetailPage Back to Catalog Navigation Works Correctly
   - Tests: `e2e/public/product-detail-page/product-detail-page-back-to-catalog-navigation-works-correctly.spec.ts`
   - Covers: Back button, navigation

---

### Epic 5: Public Pages - Navigation Testing
**Priority:** High (Phase 1)  
**Goal:** Verify navigation functionality

**Stories:**
1. **Story:** Test Case - Header Navigation Links Work Correctly
   - Tests: `e2e/public/navigation/header-navigation-links-work-correctly.spec.ts`
   - Covers: Navigation menu items, links

2. **Story:** Test Case - Header Catalog Dropdown Menu Works Correctly
   - Tests: `e2e/public/navigation/header-catalog-dropdown-menu-works-correctly.spec.ts`
   - Covers: Dropdown menu, category links

3. **Story:** Test Case - Header Mobile Menu Opens and Closes Correctly
   - Tests: `e2e/public/navigation/header-mobile-menu-opens-and-closes-correctly.spec.ts`
   - Covers: Mobile menu toggle, responsive behavior

4. **Story:** Test Case - Header Logo Navigation Works Correctly
   - Tests: `e2e/public/navigation/header-logo-navigation-works-correctly.spec.ts`
   - Covers: Logo click, home navigation

---

### Epic 6: Admin - Authentication Testing
**Priority:** High (Phase 3)  
**Goal:** Verify admin login and access control

**Stories:**
1. **Story:** Test Case - Admin Login with Valid Credentials Works Correctly
   - Tests: `e2e/admin/authentication/admin-login-with-valid-credentials-works-correctly.spec.ts`
   - Covers: Successful login, redirect to dashboard

2. **Story:** Test Case - Admin Login with Invalid Credentials Shows Error
   - Tests: `e2e/admin/authentication/admin-login-with-invalid-credentials-shows-error.spec.ts`
   - Covers: Error message display, form validation

3. **Story:** Test Case - Admin Login with Non-Admin User Shows Access Denied Error
   - Tests: `e2e/admin/authentication/admin-login-with-non-admin-user-shows-access-denied-error.spec.ts`
   - Covers: Admin privilege check, access denied message

4. **Story:** Test Case - Admin Login Password Visibility Toggle Works Correctly
   - Tests: `e2e/admin/authentication/admin-login-password-visibility-toggle-works-correctly.spec.ts`
   - Covers: Show/hide password button

---

### Epic 7: Admin - Dashboard Testing
**Priority:** High (Phase 3)  
**Goal:** Verify admin dashboard functionality

**Stories:**
1. **Story:** Test Case - Admin Dashboard Loads and Displays Correctly
   - Tests: `e2e/admin/dashboard/admin-dashboard-loads-and-displays-correctly.spec.ts`
   - Covers: Dashboard layout, stats, quick actions

2. **Story:** Test Case - Admin Dashboard Product Count Displays Correctly
   - Tests: `e2e/admin/dashboard/admin-dashboard-product-count-displays-correctly.spec.ts`
   - Covers: Product count stat card

3. **Story:** Test Case - Admin Dashboard Sign Out Works Correctly
   - Tests: `e2e/admin/dashboard/admin-dashboard-sign-out-works-correctly.spec.ts`
   - Covers: Sign out button, redirect to login

4. **Story:** Test Case - Admin Dashboard Unauthorized Access Redirects to Login
   - Tests: `e2e/admin/dashboard/admin-dashboard-unauthorized-access-redirects-to-login.spec.ts`
   - Covers: Access control, redirect behavior

---

### Epic 8: Admin - Product Management Testing
**Priority:** High (Phase 4)  
**Goal:** Verify product CRUD operations

**Stories:**
1. **Story:** Test Case - Admin Dashboard Create New Product Works Correctly
   - Tests: `e2e/admin/product-management/admin-dashboard-create-new-product-works-correctly.spec.ts`
   - Covers: Product form, field validation, submission, success

2. **Story:** Test Case - Admin Dashboard Edit Existing Product Works Correctly
   - Tests: `e2e/admin/product-management/admin-dashboard-edit-existing-product-works-correctly.spec.ts`
   - Covers: Edit form, field updates, save changes

3. **Story:** Test Case - Admin Dashboard Delete Product Works Correctly
   - Tests: `e2e/admin/product-management/admin-dashboard-delete-product-works-correctly.spec.ts`
   - Covers: Delete button, confirmation, product removal

4. **Story:** Test Case - Admin Dashboard Delete Product Confirmation Modal Works Correctly
   - Tests: `e2e/admin/product-management/admin-dashboard-delete-product-confirmation-modal-works-correctly.spec.ts`
   - Covers: Modal display, confirm/cancel actions

5. **Story:** Test Case - Admin Dashboard Product Search Works Correctly
   - Tests: `e2e/admin/product-management/admin-dashboard-product-search-works-correctly.spec.ts`
   - Covers: Search input, search results, filtering

6. **Story:** Test Case - Admin Dashboard View Products Catalog Works Correctly
   - Tests: `e2e/admin/product-management/admin-dashboard-view-products-catalog-works-correctly.spec.ts`
   - Covers: Catalog view toggle, product list display

7. **Story:** Test Case - Admin Dashboard Product Form Validation Works Correctly
   - Tests: `e2e/admin/product-management/admin-dashboard-product-form-validation-works-correctly.spec.ts`
   - Covers: Required fields, field validation, error messages

---

### Epic 9: Admin - Sales Management Testing
**Priority:** Medium (Phase 5)  
**Goal:** Verify sales management functionality

**Stories:**
1. **Story:** Test Case - Admin Dashboard View Sales List Works Correctly
   - Tests: `e2e/admin/sales-management/admin-dashboard-view-sales-list-works-correctly.spec.ts`
   - Covers: Sales list display, sale details

2. **Story:** Test Case - Admin Dashboard Search Sales by Customer Name Works Correctly
   - Tests: `e2e/admin/sales-management/admin-dashboard-search-sales-by-customer-name-works-correctly.spec.ts`
   - Covers: Search input, customer name filtering

3. **Story:** Test Case - Admin Dashboard Update Sale Status to Pendiente Works Correctly
   - Tests: `e2e/admin/sales-management/admin-dashboard-update-sale-status-to-pendiente-works-correctly.spec.ts`
   - Covers: Status dropdown, status update

4. **Story:** Test Case - Admin Dashboard Update Sale Status to En Proceso Works Correctly
   - Tests: `e2e/admin/sales-management/admin-dashboard-update-sale-status-to-en-proceso-works-correctly.spec.ts`
   - Covers: Status dropdown, status update

5. **Story:** Test Case - Admin Dashboard Update Sale Status to Completado Works Correctly
   - Tests: `e2e/admin/sales-management/admin-dashboard-update-sale-status-to-completado-works-correctly.spec.ts`
   - Covers: Status dropdown, status update, sold field

6. **Story:** Test Case - Admin Dashboard Update Sale Status to Cancelado Works Correctly
   - Tests: `e2e/admin/sales-management/admin-dashboard-update-sale-status-to-cancelado-works-correctly.spec.ts`
   - Covers: Status dropdown, status update

---

### Epic 10: Admin - Activity Logs Testing
**Priority:** Medium (Phase 5)  
**Goal:** Verify activity log functionality

**Stories:**
1. **Story:** Test Case - Admin Dashboard View Recent Activity Works Correctly
   - Tests: `e2e/admin/activity-logs/admin-dashboard-view-recent-activity-works-correctly.spec.ts`
   - Covers: Activity list display, activity details

2. **Story:** Test Case - Admin Dashboard Search Activity by Resource Name Works Correctly
   - Tests: `e2e/admin/activity-logs/admin-dashboard-search-activity-by-resource-name-works-correctly.spec.ts`
   - Covers: Search input, resource name filtering

3. **Story:** Test Case - Admin Dashboard Search Activity by Email Works Correctly
   - Tests: `e2e/admin/activity-logs/admin-dashboard-search-activity-by-email-works-correctly.spec.ts`
   - Covers: Search input, email filtering

4. **Story:** Test Case - Admin Dashboard Filter Activity by Create Action Works Correctly
   - Tests: `e2e/admin/activity-logs/admin-dashboard-filter-activity-by-create-action-works-correctly.spec.ts`
   - Covers: Action filter pills, CREATE filter

5. **Story:** Test Case - Admin Dashboard Filter Activity by Update Action Works Correctly
   - Tests: `e2e/admin/activity-logs/admin-dashboard-filter-activity-by-update-action-works-correctly.spec.ts`
   - Covers: Action filter pills, UPDATE filter

6. **Story:** Test Case - Admin Dashboard Filter Activity by Delete Action Works Correctly
   - Tests: `e2e/admin/activity-logs/admin-dashboard-filter-activity-by-delete-action-works-correctly.spec.ts`
   - Covers: Action filter pills, DELETE filter

7. **Story:** Test Case - Admin Dashboard Delete Activity Log Works Correctly
   - Tests: `e2e/admin/activity-logs/admin-dashboard-delete-activity-log-works-correctly.spec.ts`
   - Covers: Delete button, log removal, success notification

---

### Epic 11: Integration Tests - Complete User Flows
**Priority:** Medium (Phase 6)  
**Goal:** Verify end-to-end user flows

**Stories:**
1. **Story:** Test Case - Complete Product Browsing Flow from Home to Detail
   - Tests: `integration/complete-product-browsing-flow-from-home-to-detail.spec.ts`
   - Covers: Home → Catalog → Product Detail complete flow

2. **Story:** Test Case - Complete Admin Product Management Flow (Create, Edit, Delete)
   - Tests: `integration/complete-admin-product-management-flow-create-edit-delete.spec.ts`
   - Covers: Login → Create → Edit → Delete complete flow

3. **Story:** Test Case - Complete Admin Sales Management Flow (View and Update Status)
   - Tests: `integration/complete-admin-sales-management-flow-view-and-update-status.spec.ts`
   - Covers: Login → View Sales → Search → Update Status complete flow

---

## Summary Statistics

- **Total Epics:** 11
- **Total Stories:** 60+
- **Test Files Covered:** All test files from TEST_PLAN.md

---

## Implementation Priority

### Phase 1: Foundation (Week 1)
- Epic 1: Smoke Tests
- Epic 2: HomePage Testing (Basic)
- Epic 5: Navigation Testing

### Phase 2: Public Pages (Week 2)
- Epic 3: CatalogPage Testing
- Epic 4: ProductDetailPage Testing
- Epic 2: HomePage Testing (Complete)

### Phase 3: Admin Authentication (Week 3)
- Epic 6: Authentication Testing
- Epic 7: Dashboard Testing

### Phase 4: Admin Product Management (Week 4)
- Epic 8: Product Management Testing

### Phase 5: Admin Sales & Activity (Week 5)
- Epic 9: Sales Management Testing
- Epic 10: Activity Logs Testing

### Phase 6: Integration (Week 6)
- Epic 11: Integration Tests

---

## Linking Strategy

### Link QA Stories to GMP Feature Epics

Each QA Story should be linked to the corresponding GMP feature Epic:

- **HomePage QA Stories** → Link to `GMP-4` (HomePage Epic)
- **AdminLoginPage QA Stories** → Link to `GMP-10` (AdminLoginPage Epic)
- **AdminDashboardPage QA Stories** → Link to `GMP-17` (AdminDashboardPage Epic)
- **CatalogPage QA Stories** → Link to `GMP-26` (CatalogPage Epic)
- **ProductDetailPage QA Stories** → Link to `GMP-34` (ProductDetailPage Epic)

### Use "Relates to" Link Type

In Jira, use the "Relates to" link type to connect QA Stories to GMP Epics. This shows:
- Which features are being tested
- Test coverage for each feature
- Traceability between tests and features

---

## Next Steps

1. **Create QA Epic in Jira:**
   - Go to QA project: https://pablo-durandev.atlassian.net/browse/QA
   - Create Epic: "QA & Testing - Quality Assurance Epic"

2. **Create All 11 Epics:**
   - Create each Epic listed above
   - Link to main QA Epic (if using parent Epic structure)

3. **Create Stories:**
   - Create Stories under each Epic
   - Link Stories to corresponding GMP feature Epics using "Relates to"

4. **Track Implementation:**
   - Update Story status as tests are written
   - Link test files to Stories in description or comments
   - Track test execution results

---

## Notes

- Each Story represents one or more test files
- Stories can be broken down into Tasks if needed (e.g., "Write test file", "Execute test", "Fix flaky test")
- Bugs found during testing should be created in QA project and linked to both QA Epic and GMP feature Epic
- Test execution results can be tracked via comments or custom fields

---

## Phase 1 Improvements Summary

### What Changed from Basic to Comprehensive Tests

**Before (Basic Tests):**
- ✅ Visibility checks only ("element is visible")
- ✅ Basic page load verification
- ✅ Simple navigation tests
- ⏱️ Fast execution (~90 seconds)
- 📱 Included mobile viewport tests

**After (Comprehensive Tests):**
- ✅ **Interaction Testing** - Clicks, hovers, scrolls, form interactions, button states
- ✅ **Data Validation** - Verify Supabase API calls, compare data with displayed content
- ✅ **Animation Verification** - Intersection Observer, carousel transitions, first-visit animation sequence
- ✅ **State Management** - Modal open/close, dropdown visibility, active link states, form states
- ✅ **Performance Checks** - Page load times, network requests, image loading verification
- ✅ **User Flows** - Complete journeys (home → catalog → product detail), not just isolated elements
- ✅ **Edge Cases** - Empty states, loading states, error handling, redirects
- ✅ **Accessibility Basics** - Alt text, ARIA labels, keyboard navigation, focus states
- ✅ **Desktop Focus** - All tests on desktop viewport (1920x1080) - Mobile in separate phase
- ✅ **Content Verification** - Text content, image URLs, data correctness
- ⏱️ Comprehensive execution (~3-5 minutes)

### Key Testing Improvements

1. **Not Just Visibility, But Functionality:**
   - Tests verify elements are not just visible, but actually work
   - Button clicks, hover effects, form submissions are tested
   - Navigation is verified with URL changes and page loads
   - Interactions are tested, not just element presence

2. **Data Validation:**
   - Tests verify data loads from Supabase (check network requests)
   - Compare displayed content with API responses
   - Verify product data, prices, images match database
   - Verify Featured Products section loads real data

3. **Animation and Interaction:**
   - Intersection Observer animations are verified (trigger on scroll)
   - Carousel transitions are tested (all 4 slides, timing)
   - First-visit animation sequence is verified (5 steps, 2.5 seconds)
   - Hover states and transitions are tested
   - Parallax effects are verified

4. **Complete User Flows:**
   - Tests verify complete user journeys
   - Not just "button exists" but "button works and navigates correctly"
   - Verify browser history, back button, state management
   - Test from different starting points

5. **Desktop-Only Focus:**
   - All Phase 1 tests run on desktop viewport (1920x1080)
   - Mobile testing will be in a separate phase
   - This allows deeper testing without viewport complexity
   - More focused and thorough desktop testing

### Why This Depth is Important

- **Catches Real Bugs:** Tests interactions, not just display - catches functional issues
- **Validates User Experience:** Tests what users actually do, not just what's on screen
- **Prevents Regressions:** Comprehensive tests catch more issues before production
- **Better Coverage:** Tests data, animations, interactions, and user flows
- **Production-Ready:** Tests verify real functionality, not just code existence
- **Confidence:** Deep tests give confidence that features actually work

### Test Execution Time Comparison

| Test Type | Basic Tests | Comprehensive Tests |
|-----------|------------|---------------------|
| Smoke Tests | ~15-20 seconds | ~30-45 seconds |
| HomePage Tests | ~40-60 seconds | ~2-3 minutes |
| Navigation Tests | ~20-30 seconds | ~30-45 seconds |
| **Total Phase 1** | **~90 seconds** | **~3-5 minutes** |

**Trade-off:** Slightly longer execution time for much better test coverage and bug detection.

---

## Phase 1 Test Coverage Summary

### What Phase 1 Tests Cover

✅ **Smoke Tests:**
- Page loads with data validation
- API calls to Supabase
- Content correctness
- Image loading
- Performance metrics

✅ **HomePage Tests:**
- All sections with Intersection Observer animations
- Hero carousel with all 4 slides
- First-visit animation sequence
- Featured Products data loading
- Map modal interactions
- Complete user flows

✅ **Navigation Tests:**
- Dropdown menus with hover states
- Active link highlighting
- Smooth scrolling
- Browser history management
- Logo navigation from all pages

### What Phase 1 Does NOT Cover (Future Phases)

❌ **Mobile Viewport** - Separate phase for mobile testing  
❌ **CatalogPage Deep Testing** - Phase 2  
❌ **ProductDetailPage Deep Testing** - Phase 2  
❌ **Admin Authentication Deep Testing** - Phase 3  
❌ **Admin Dashboard Deep Testing** - Phase 3  
❌ **Integration Flows** - Phase 6

---

**Last Updated:** 2025-12-01  
**Phase 1 Status:** Ready for implementation with comprehensive test scenarios

