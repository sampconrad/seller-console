# Seller Console

A lightweight, modern seller console built with React, TypeScript, and Tailwind CSS for triaging leads and converting them into opportunities. The application follows SOLID design principles with excellent separation of concerns and long-term maintainability.

🌐 **Live Demo**: [https://sampconrad-coverpin.netlify.app/](https://sampconrad-coverpin.netlify.app/)

## 🚀 Features

### Lead Management

- **Import/Export**: Support for JSON and CSV file formats with complete data including IDs (leads only)
- **Search & Filter**: Real-time search by name/company and filter by status
- **Sorting**: Sort leads by any field (default: score descending)
- **Pagination**: Display 20 leads per page with smart pagination controls
- **Inline Editing**: Edit lead details directly in the slide-over panel with ScoreDial component
- **Status Management**: Track lead progression through different stages
- **Lead Scoring**: Interactive dial component for scoring leads (1-100)

### Opportunity Conversion

- **Lead to Opportunity**: Convert qualified leads into opportunities
- **Opportunity Management**: Full CRUD operations for opportunities (view, edit, delete)
- **Stage Tracking**: Monitor opportunity progression through sales stages
- **Amount Tracking**: Optional monetary value tracking
- **Note**: Opportunities cannot be imported/exported - only leads support file operations

### Data Visualization

- **Interactive Charts**: Doughnut charts in sidebar showing distribution of leads/opportunities by status/stage
- **Real-time Updates**: Charts automatically update when data changes

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: Single column layout, touch-friendly interactions
- **Tablet**: Optimized spacing and navigation
- **Desktop**: Full feature set with side panels and advanced layouts

## ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Clear focus indicators and logical tab order
- **Color Contrast**: WCAG compliant color combinations

## 🏗️ Architecture

### Project Structure

```
src/
├── components/                        # UI components
│   ├── ui/                            # Reusable UI primitives
│   │   ├── Badge.tsx                  # Status/stage badge component
│   │   ├── Button.tsx                 # Button component with variants
│   │   ├── Filter.tsx                 # Reusable quick filter component
│   │   ├── FilterChart.tsx            # Interactive doughnut chart for data visualization
│   │   ├── Footer.tsx                 # Application footer component
│   │   ├── Input.tsx                  # Form input component
│   │   ├── MobileHeader.tsx           # Generic mobile header with tab switching
│   │   ├── Modal.tsx                  # Modal dialog component
│   │   ├── ScoreDial.tsx              # Interactive lead scoring component
│   │   ├── Select.tsx                 # Dropdown select component
│   │   ├── Table.tsx                  # Data table component
│   │   └── Toast.tsx                  # Toast notification system
│   ├── error/                         # Error handling components
│   │   └── ErrorBoundary.tsx          # React error boundary component
│   ├── forms/                         # Form components
│   │   ├── LeadForm.tsx               # Create/edit lead modal
│   │   └── OpportunityForm.tsx        # Converting leads to opportunities
│   ├── layout/                        # Layout components
│   │   ├── Pagination.tsx             # Pagination component
│   │   └── Searchbox.tsx              # Search input component
│   ├── modals/                        # Modal components
│   │   ├── ConfirmationModal.tsx      # Delete confirmation dialog
│   │   └── FormatSelectionModal.tsx   # Import/export format selection
│   ├── panels/                        # Detail panel components
│   │   ├── LeadDetailPanel.tsx        # Lead details with inline editing
│   │   └── OpportunityDetailPanel.tsx # Opportunity details with inline editing
│   ├── sidebar/                       # Sidebar components
│   │   ├── Sidebar.tsx                # Main sidebar component with navigation and filters
│   │   ├── SidebarContent.tsx         # Main sidebar content wrapper
│   │   ├── SidebarDataManagement.tsx  # Data management section
│   │   ├── SidebarFilters.tsx         # Filter section
│   │   ├── SidebarHeader.tsx          # Sidebar header with branding
│   │   ├── SidebarNavigation.tsx      # Navigation section
│   │   └── SidebarWrapper.tsx         # Reusable wrapper for mobile/desktop variants
│   └── tables/                        # Table components
│       ├── LeadsTable.tsx             # Main leads management with pagination
│       └── OpportunitiesTable.tsx     # Opportunities management
├── context/                           # React Context providers
│   ├── AppContext.tsx                 # Global state management
│   └── NotificationContext.tsx        # Toast notification context
├── hooks/                             # Custom React hooks
│   ├── useDebounce.ts                 # Debounced input hook
│   ├── useFilterOptions.ts            # Filter options generation hook
│   ├── useFocusManagement.ts          # Focus management hook
│   ├── useKeyboardNavigation.ts       # Keyboard navigation hook
│   ├── useLeads.ts                    # Lead management logic
│   ├── useOpportunities.ts            # Opportunity management logic
│   └── useSidebar.ts                  # Sidebar state management and handlers
├── services/                          # Business logic layer
│   ├── api.ts                         # Mock API with latency simulation
│   ├── fileService.ts                 # File import/export functionality (leads only)
│   ├── ServiceContainer.ts            # Dependency injection container
│   └── storage.ts                     # Local storage management
├── utils/                             # Utility functions
│   ├── dataTransform.ts               # Data manipulation and formatting
│   └── validation.ts                  # Form validation utilities
├── types/                             # TypeScript definitions
│   └── index.ts                       # All type definitions
├── test/                              # Test files
│   ├── components.test.tsx            # Component tests
│   ├── hooks.test.ts                  # Custom hooks tests
│   ├── services.test.ts               # Services tests
│   ├── setup.ts                       # Test setup configuration
│   └── utils.test.ts                  # Utility function tests
├── data/                              # Sample data
│   └── sampleLeads.json               # 100 sample leads for testing
├── App.tsx                            # Main application component
├── index.css                          # Global styles and Tailwind imports
└── main.tsx                           # Application entry point
```

### Key Architectural Decisions

1. **Context API for State Management**: Chosen over Redux for simplicity and built-in React support
2. **Custom Hooks for Logic**: Business logic separated from UI components using custom hooks
3. **Service Layer with Dependency Injection**: Clean separation between UI and data operations using ServiceContainer pattern
4. **Component Composition**: Modular components with reusable UI primitives
5. **Accessibility-First**: Focus management, keyboard navigation, and ARIA attributes throughout
6. **Optimistic Updates**: Immediate UI feedback with rollback on failure
7. **TypeScript Throughout**: Full type safety across the entire application

## 🛠️ Tech Stack

- **React 18** - UI library with hooks and context
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **Vitest** - Fast unit testing framework
- **React Testing Library** - React component testing utilities
- **Lucide React** - Icon library
- **Chart.js** - Charting library for data visualization
- **ESLint** - Code linting and best practices
- **Prettier** - Code formatting

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd coverpin-seller-console
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Run ESLint
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check if files are formatted correctly
- `npm run format:src` - Format source files only
- `npm run format:staged` - Format only staged files

## 📊 Data Models

### Lead

```typescript
interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}
```

### Opportunity

```typescript
interface Opportunity {
  id: string;
  name: string;
  stage: OpportunityStage;
  amount?: number;
  accountName: string;
  leadId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🧪 Testing

The application includes comprehensive unit tests using Vitest:

- **Utility Functions**: Validation, data transformation, formatting
- **Custom Hooks**: useDebounce, useKeyboardNavigation, useSidebar, and other custom hooks
- **Services**: API, file service, and storage service testing
- **React Components**: UI component behavior and interactions
- **Integration Tests**: End-to-end component integration
- **Error Handling**: ErrorBoundary component testing
- **Component Organization**: Tests ensure proper component structure and imports

Run tests with:

```bash
npm run test
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
