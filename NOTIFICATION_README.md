# Notification Banner Component

A reusable notification banner component that displays loading and error messages with auto-dismiss functionality and a close button.

## Features

- 🎨 **Multiple Types**: Loading, Success, Error, Warning, and Info notifications
- ⏰ **Auto-dismiss**: Configurable duration with manual override
- 🎭 **Smooth Animations**: Slide-in/out animations with CSS transitions
- 📱 **Responsive Design**: Adapts to different screen sizes
- ♿ **Accessibility**: Proper ARIA labels and keyboard navigation
- 🎯 **Easy Integration**: Simple props interface and custom hook

## Components

### NotificationBanner

The main notification component with the following props:

```typescript
interface NotificationBannerProps {
  type: NotificationType;        // 'loading' | 'success' | 'error' | 'warning' | 'info'
  message: string;               // The notification message
  duration?: number;             // Auto-dismiss duration in ms (0 = no auto-dismiss)
  onClose?: () => void;         // Callback when notification is closed
  show?: boolean;               // Control visibility
  className?: string;           // Additional CSS classes
}
```

### useNotification Hook

A custom hook that provides a simple interface for managing notifications:

```typescript
const {
  notifications,
  showNotification,
  showLoading,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  hideNotification,
  hideAllNotifications,
  handleClose,
} = useNotification();
```

## Usage Examples

### Basic Usage

```tsx
import NotificationBanner from './components/NotificationBanner';

// Simple success notification
<NotificationBanner
  type="success"
  message="Operation completed successfully!"
/>

// Loading notification (no auto-dismiss)
<NotificationBanner
  type="loading"
  message="Processing your request..."
  duration={0}
/>

// Error with custom duration
<NotificationBanner
  type="error"
  message="Something went wrong!"
  duration={8000}
  onClose={() => console.log('Notification closed')}
/>
```

### Using the Hook

```tsx
import { useNotification } from './hooks/useNotification';
import NotificationBanner from './components/NotificationBanner';

const MyComponent = () => {
  const {
    notifications,
    showSuccess,
    showError,
    showLoading,
    handleClose
  } = useNotification();

  const handleSubmit = async () => {
    const loadingId = showLoading('Submitting form...');
    
    try {
      await submitForm();
      hideNotification(loadingId);
      showSuccess('Form submitted successfully!');
    } catch (error) {
      hideNotification(loadingId);
      showError('Failed to submit form. Please try again.');
    }
  };

  return (
    <div>
      <button onClick={handleSubmit}>Submit Form</button>
      
      {/* Render all notifications */}
      {notifications.map(notification => (
        <NotificationBanner
          key={notification.id}
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          show={notification.show}
          onClose={() => handleClose(notification.id)}
        />
      ))}
    </div>
  );
};
```

### Integration with Redux Actions

```tsx
import { useNotification } from './hooks/useNotification';

const MyComponent = () => {
  const { showSuccess, showError, showLoading } = useNotification();
  const dispatch = useDispatch();

  const handleCreateBoard = async (title: string) => {
    const loadingId = showLoading('Creating board...');
    
    try {
      await dispatch(createBoard(title)).unwrap();
      hideNotification(loadingId);
      showSuccess('Board created successfully!');
    } catch (error) {
      hideNotification(loadingId);
      showError('Failed to create board. Please try again.');
    }
  };

  // ... rest of component
};
```

## Styling

The component uses CSS custom properties that match your existing design system:

- `--bg-primary`, `--bg-secondary`, `--bg-tertiary` for backgrounds
- `--accent-primary`, `--accent-success`, `--accent-danger`, etc. for colors
- `--spacing-*` variables for consistent spacing
- `--border-radius` and `--shadow-*` for visual effects

## Customization

### Custom Styles

You can override styles by passing a `className` prop:

```tsx
<NotificationBanner
  type="success"
  message="Custom styled notification"
  className="my-custom-notification"
/>
```

### Custom Durations

Different notification types have sensible defaults, but you can customize them:

```tsx
// Quick success message
showSuccess('Saved!', 2000);

// Long error message
showError('Critical error occurred', 15000);

// No auto-dismiss for important warnings
showWarning('Please review before proceeding', 0);
```

## Best Practices

1. **Loading States**: Use `duration={0}` for loading notifications and manually hide them when the operation completes
2. **Error Handling**: Provide clear, actionable error messages
3. **Success Feedback**: Confirm successful operations with brief success messages
4. **Accessibility**: Ensure messages are descriptive and helpful for screen readers
5. **Performance**: Don't create too many notifications simultaneously

## Demo

Check out `NotificationDemo.tsx` for interactive examples of all notification types and features.

## File Structure

```
src/
├── components/
│   ├── NotificationBanner.tsx    # Main component
│   └── NotificationDemo.tsx      # Demo component
├── hooks/
│   └── useNotification.ts        # Custom hook
└── index.css                     # Styles (added to existing file)
```
