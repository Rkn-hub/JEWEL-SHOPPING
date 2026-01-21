# Design Document: Website Clean Structure

## Overview

This design document outlines the restructuring of "The Vrinda Creation" handcrafted jewelry website from its current scattered file organization to a clean, maintainable structure. The current website has HTML files distributed across deeply nested directories within the `stitch_minimalist_shop_homepage` folder, making maintenance and navigation difficult.

The new structure will organize files logically by functionality, consolidate assets, and maintain all existing features while improving developer experience and site maintainability.

## Architecture

### Current Structure Analysis

The existing website structure has several issues:
- All pages are nested under `stitch_minimalist_shop_homepage/`
- Files are organized by template type rather than functionality
- Multiple variations of similar pages exist
- Assets are embedded inline rather than externalized
- Deep nesting makes file paths complex

### Proposed Structure

```
/
├── index.html                 # Main homepage
├── assets/
│   ├── css/
│   │   ├── main.css          # Main stylesheet
│   │   ├── components.css    # Component-specific styles
│   │   └── themes.css        # Theme and color variations
│   ├── js/
│   │   ├── main.js           # Core functionality
│   │   ├── cart.js           # Shopping cart logic
│   │   └── search.js         # Search functionality
│   └── images/
│       ├── products/         # Product images
│       ├── backgrounds/      # Hero and background images
│       └── icons/           # Icons and logos
├── shop/
│   ├── collections.html      # Product listing page
│   ├── product.html         # Product detail view
│   ├── cart.html            # Shopping cart
│   └── checkout.html        # Checkout process
├── account/
│   ├── dashboard.html       # User dashboard
│   ├── orders.html          # Order history
│   ├── wishlist.html        # User wishlist
│   └── profile.html         # User profile settings
├── info/
│   ├── about.html           # About us page
│   ├── contact.html         # Contact information
│   ├── faq.html             # Frequently asked questions
│   └── shipping.html        # Shipping information
├── search/
│   └── results.html         # Search results page
└── sitemap.html             # Site navigation overview
```

## Components and Interfaces

### Navigation Component

**Purpose**: Provide consistent navigation across all pages
**Location**: Embedded in each HTML file or included via JavaScript
**Features**:
- Floating navigation bar design
- Responsive menu for mobile devices
- Search, cart, and user account access
- Dark/light mode toggle

### Asset Management System

**CSS Organization**:
- `main.css`: Core styles, typography, layout
- `components.css`: Reusable component styles
- `themes.css`: Color schemes and theme variations

**JavaScript Organization**:
- `main.js`: Core site functionality, navigation
- `cart.js`: Shopping cart operations
- `search.js`: Search functionality and overlays

**Image Organization**:
- `products/`: All product photography
- `backgrounds/`: Hero images and backgrounds
- `icons/`: Brand logos and UI icons

### Page Categories

**Shop Pages** (`/shop/`):
- Collections page (product listings)
- Individual product detail pages
- Shopping cart interface
- Checkout process

**Account Pages** (`/account/`):
- User dashboard and profile
- Order history and tracking
- Wishlist management
- Account settings

**Information Pages** (`/info/`):
- About the artisan and brand story
- Contact information and forms
- FAQ and customer support
- Shipping and return policies

## Data Models

### File Structure Model

```javascript
WebsiteStructure = {
  rootDirectory: "/",
  assetDirectories: {
    css: "/assets/css/",
    javascript: "/assets/js/",
    images: "/assets/images/"
  },
  pageCategories: {
    shop: "/shop/",
    account: "/account/",
    info: "/info/",
    search: "/search/"
  },
  navigationPaths: {
    relative: true,
    baseUrl: "/",
    assetPrefix: "/assets/"
  }
}
```

### Navigation Model

```javascript
NavigationStructure = {
  primaryMenu: [
    { label: "Collections", path: "/shop/collections.html" },
    { label: "Featured", path: "/shop/product.html" },
    { label: "About", path: "/info/about.html" },
    { label: "Contact", path: "/info/contact.html" }
  ],
  utilityMenu: [
    { icon: "search", action: "openSearch()" },
    { icon: "shopping_bag", path: "/shop/cart.html" },
    { icon: "person", path: "/account/dashboard.html" }
  ]
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: File Organization by Functionality
*For any* HTML file in the website, it should be placed in a directory that corresponds to its primary functionality (shop, account, info, or root)
**Validates: Requirements 1.1, 1.2, 4.1**

### Property 2: Asset Separation
*For any* website asset (CSS, JavaScript, or image file), it should be located in the dedicated assets directory structure, separate from HTML content files
**Validates: Requirements 1.3, 3.1**

### Property 3: Consistent Naming Convention
*For any* file or directory in the website structure, it should follow the established naming convention (lowercase, hyphen-separated, descriptive names)
**Validates: Requirements 1.4**

### Property 4: Directory Depth Limitation
*For any* file path in the website structure, the directory depth should not exceed 3 levels from the root directory
**Validates: Requirements 1.5**

### Property 5: Navigation Consistency
*For any* HTML page in the website, it should contain the same primary navigation structure with consistent menu items and functionality
**Validates: Requirements 2.1, 2.2**

### Property 6: Link Validity
*For any* internal link in the website, it should resolve to an existing file in the new directory structure
**Validates: Requirements 2.3, 2.5, 5.2**

### Property 7: Functionality Preservation
*For any* interactive element (buttons, forms, JavaScript functions) from the original website, it should be present and functional in the restructured website
**Validates: Requirements 2.4, 5.1, 5.3**

### Property 8: Asset Reference Correctness
*For any* asset reference (CSS, JavaScript, or image) in an HTML file, it should point to a valid file in the new asset directory structure
**Validates: Requirements 3.5, 5.4, 5.5**

### Property 9: Content Deduplication
*For any* two pages in the website, they should not contain substantially similar content unless they serve different functional purposes
**Validates: Requirements 4.2**

### Property 10: Categorical Organization
*For any* page type (product pages, account pages, informational pages), all pages of that type should be grouped in the same directory
**Validates: Requirements 4.3, 4.4, 4.5**

## Error Handling

### File Migration Errors
- **Missing Files**: If original files cannot be found, log the missing file and continue with available files
- **Broken Links**: If links cannot be updated automatically, create a report of broken links for manual review
- **Asset Conflicts**: If multiple assets have the same name, rename with numerical suffixes

### Structure Validation Errors
- **Invalid Paths**: If generated paths are invalid, fall back to safe naming conventions
- **Permission Issues**: If files cannot be moved due to permissions, log errors and provide manual instructions
- **Circular References**: If circular link dependencies are detected, break cycles and report issues

### Content Processing Errors
- **Malformed HTML**: If HTML cannot be parsed, preserve original file and note in error log
- **Missing Assets**: If referenced assets don't exist, create placeholder references and log missing items
- **JavaScript Conflicts**: If JavaScript functions conflict after restructuring, namespace functions appropriately

## Testing Strategy

### Unit Testing Approach
- **File System Tests**: Verify directory structure creation and file placement
- **Link Validation Tests**: Check that all internal links resolve correctly
- **Asset Reference Tests**: Ensure all asset paths are valid and accessible
- **Content Integrity Tests**: Verify that page content is preserved during restructuring

### Property-Based Testing Configuration
Using a file system testing framework (such as Node.js with fs module for JavaScript implementation):
- **Minimum 100 iterations** per property test to ensure comprehensive coverage
- **Random file generation** to test edge cases in naming and organization
- **Link traversal testing** to verify navigation integrity across all pages

Each property test will be tagged with:
**Feature: website-clean-structure, Property {number}: {property_text}**

### Integration Testing
- **End-to-End Navigation**: Test complete user journeys through the restructured site
- **Asset Loading**: Verify all stylesheets, scripts, and images load correctly
- **Functionality Testing**: Ensure all interactive features work as expected
- **Cross-Browser Compatibility**: Test restructured site across different browsers

### Manual Testing Checkpoints
- **Visual Comparison**: Compare original and restructured pages for visual consistency
- **Performance Testing**: Ensure restructuring doesn't negatively impact load times
- **SEO Impact**: Verify that restructuring maintains SEO-friendly URLs and structure