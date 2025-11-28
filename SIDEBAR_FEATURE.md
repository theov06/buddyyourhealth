# GenAI Sidebar Feature

## Overview
The GenAI chat interface includes a streamlined sidebar with two states: minimized and maximized.

## Sidebar States

### 1. Minimized (70px)
- Shows only icon buttons
- New chat button (+ icon) - 50px × 50px
- Toggle button - 50px × 50px
- Minimal space usage
- Perfect for focus mode
- Matches welcome page sidebar styling

### 2. Maximized (280px) - Default
- New chat button with text
- **Search toggle button** - Click to show/hide search input
- **Search input** - Appears when search button is clicked
- Chat history list with titles and timestamps
- **Chat menu buttons** - Three-dot menu on each chat item (⋮)
- **User profile button** at bottom:
  - User avatar
  - User name
  - "Manage Account" status
  - Navigates to account management page when clicked

## Toggle Behavior
Click the toggle button to switch between states:
- Minimized ⇄ Maximized

Button icons:
- `▶` - Expand from minimized
- `◀` - Minimize from maximized

## Features by State

| Feature | Minimized | Maximized |
|---------|-----------|-----------|
| New Chat Button | ✓ (icon only) | ✓ (with text) |
| Toggle Button | ✓ | ✓ |
| Search Toggle | ✗ | ✓ |
| Search Input | ✗ | ✓ (when toggled) |
| Chat History | ✗ | ✓ |
| Chat Menus | ✗ | ✓ |
| User Profile | ✗ | ✓ |

## Key Features

### Search Functionality
- Click the search button to toggle the search input
- Search input appears with a smooth slide-down animation
- Auto-focuses when opened
- Search through chat history

### User Profile
- Located at the bottom of the sidebar
- Shows user avatar and name
- "Manage Account" status text
- Clicking navigates to `/manage-account` page
- Hover effect with lift animation

## Responsive Behavior
- **Desktop (>1024px)**: Full functionality, maximized width 280px
- **Tablet (768-1024px)**: Sidebar becomes overlay, maximized width 280px
- **Mobile (<768px)**: Sidebar becomes full-width overlay when expanded

## Theme Support
Both dark and light themes are fully supported with appropriate color adjustments for all components.

## Usage
The sidebar state is managed by the `sidebarState` state variable:
```typescript
const [sidebarState, setSidebarState] = useState<'minimized' | 'maximized'>('maximized');
const [showSearch, setShowSearch] = useState(false);
```

Users can:
- Toggle sidebar size by clicking the toggle button
- Toggle search by clicking the search button
- Navigate to account management by clicking the user profile
