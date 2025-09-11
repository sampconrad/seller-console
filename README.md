# Seller Console

A lightweight, modern seller console built with React, TypeScript, and Tailwind CSS for triaging leads and converting them into opportunities. The application follows SOLID design principles with excellent separation of concerns and long-term maintainability.

🌐 **Live Demo**: [https://sampconrad-coverpin.netlify.app/](https://sampconrad-coverpin.netlify.app/)

## 🚀 Features

### Lead Management
- **Import/Export**: Support for JSON and CSV file formats with complete data including IDs
- **Search & Filter**: Real-time search by name/company and filter by status
- **Sorting**: Sort leads by any field (default: score descending)
- **Pagination**: Display 20 leads per page with smart pagination controls
- **Inline Editing**: Edit lead details directly in the slide-over panel with ScoreDial component
- **Status Management**: Track lead progression through different stages
- **Lead Scoring**: Interactive dial component for scoring leads (1-100)

### Opportunity Conversion
- **Lead to Opportunity**: Convert qualified leads into opportunities
- **Opportunity Management**: Full CRUD operations for opportunities
- **Stage Tracking**: Monitor opportunity progression through sales stages
- **Amount Tracking**: Optional monetary value tracking

### User Experience
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Real-time Updates**: Optimistic updates with rollback on failure
- **Toast Notifications**: User feedback for all actions
- **Loading States**: Proper loading indicators throughout the app
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Interactive Components**: ScoreDial for lead scoring, responsive pagination controls

## 🏗️ Architecture

### Project Structure
```
src/
├── components/                    # UI components
│   ├── ui/                       # Reusable UI primitives
│   │   ├── Badge.tsx            # Status/stage badge component
│   │   ├── Button.tsx           # Button component with variants
│   │   ├── Footer.tsx           # Application footer
│   │   ├── Input.tsx            # Form input component
│   │   ├── Modal.tsx            # Modal dialog component
│   │   ├── ScoreDial.tsx        # Interactive lead scoring component
│   │   ├── Select.tsx           # Dropdown select component
│   │   ├── Table.tsx            # Data table component
│   │   ├── Toast.tsx            # Toast notification component
│   │   └── ToastContainer.tsx   # Toast notification container
│   ├── DeleteConfirmationModal.tsx    # Delete confirmation dialog
│   ├── FormatSelectionModal.tsx       # Import/export format selection
│   ├── Header.tsx                     # Application header component
│   ├── LeadDetailPanel.tsx           # Lead details with inline editing
│   ├── LeadFormModal.tsx             # Create/edit lead modal
│   ├── LeadsList.tsx                 # Main leads management with pagination
│   ├── OpportunitiesList.tsx         # Opportunities management
│   ├── OpportunityFormModal.tsx      # Create/edit opportunity modal
│   └── Pagination.tsx                # Pagination component
├── context/                       # React Context providers
│   ├── AppContext.tsx            # Global state management
│   └── NotificationContext.tsx   # Toast notification context
├── hooks/                         # Custom React hooks
│   ├── useDebounce.ts            # Debounced input hook
│   ├── useLeads.ts               # Lead management logic
│   └── useOpportunities.ts       # Opportunity management logic
├── services/                      # Business logic layer
│   ├── api.ts                    # Mock API with latency simulation
│   ├── fileService.ts            # File import/export functionality
│   └── storage.ts                # Local storage management
├── utils/                         # Utility functions
│   ├── dataTransform.ts          # Data manipulation and formatting
│   └── validation.ts             # Form validation utilities
├── types/                         # TypeScript definitions
│   └── index.ts                  # All type definitions
├── test/                          # Test files
│   ├── components.test.tsx       # Component tests
│   ├── setup.ts                  # Test setup configuration
│   └── utils.test.ts             # Utility function tests
├── data/                          # Sample data
│   └── sampleLeads.json          # 100 sample leads for testing
├── App.tsx                        # Main application component
├── index.css                      # Global styles and Tailwind imports
└── main.tsx                       # Application entry point
```

### Design Principles

#### SOLID Principles Implementation
- **Single Responsibility**: Each component/service has one clear purpose
- **Open/Closed**: Components are open for extension, closed for modification
- **Liskov Substitution**: All UI components follow consistent interfaces
- **Interface Segregation**: Focused, specific interfaces for different concerns
- **Dependency Inversion**: High-level modules depend on abstractions

#### Key Architectural Decisions

1. **Context API for State Management**: Chosen over Redux for simplicity and built-in React support
2. **Custom Hooks for Logic**: Reusable business logic separated from UI components
3. **Service Layer**: Clean separation between UI and data operations
4. **Optimistic Updates**: Immediate UI feedback with rollback on failure
5. **TypeScript Throughout**: Full type safety across the entire application

## 🛠️ Setup Instructions

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

The application includes comprehensive unit tests:

- **Utility Functions**: Validation, data transformation, formatting
- **React Components**: UI component behavior and interactions
- **Integration Tests**: End-to-end component integration

Run tests with:
```bash
npm run test
```

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

## 🚀 Performance

- **Code Splitting**: Automatic code splitting with Vite
- **Lazy Loading**: Components loaded on demand
- **Optimistic Updates**: Immediate UI feedback
- **Debounced Search**: Efficient search with 300ms debounce
- **Pagination**: Efficient data loading with 20 items per page
- **Memoization**: React.memo and useMemo for expensive operations

## 🔒 Error Handling

- **Validation**: Client-side validation with clear error messages
- **Network Errors**: Graceful handling of API failures
- **Rollback**: Automatic rollback of optimistic updates on failure
- **User Feedback**: Toast notifications for all user actions


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Vite** - Build tool
- **Vitest** - Testing framework
- **Lucide React** - Icon library
- **Node.js** - Runtime environment
