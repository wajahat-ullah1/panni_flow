# Order Management - Web Application Documentation

## Overview
The Order Management component is a comprehensive React web application for tracking and managing water delivery orders. It includes search, filtering, table view, and detailed order modals.

## Components

### 1. OrderManagement.jsx
Main component that displays the order list with search and filter capabilities.

### 2. OrderDetailModal.jsx
Modal component for viewing complete order information with timeline and actions.

## Features

### ✅ Main Features

1. **Search Functionality**
   - Real-time search across order ID, customer name, and location
   - Search icon indicator
   - Responsive input with focus states

2. **Status Filter**
   - Dropdown menu with all status options
   - Visual checkmark for selected status
   - Filter by: All Status, Pending, In-Transit, Delivered, Cancelled

3. **Order Statistics Dashboard**
   - 4 color-coded stat cards
   - Total Orders: 8
   - Pending: 2 (Orange)
   - In-Transit: 3 (Blue)
   - Delivered: 3 (Green)

4. **Orders Table**
   - 8 columns: Order ID, Customer, Location, Quantity, Amount, Date & Time, Status, Actions
   - Sortable and filterable
   - Hover effects on rows
   - Color-coded status badges
   - Click-to-view eye icon

5. **Order Detail Modal**
   - Complete order information
   - Visual timeline with completion indicators
   - Quick action buttons (Call, View Location, View Invoice)
   - Status-based action buttons (Assign Driver, Track Delivery)
   - Smooth animations

6. **Export Functionality**
   - Export button with download icon
   - Gradient blue styling
   - Ready for CSV/Excel export implementation

## Installation

```bash
# Already included in main project
# No additional dependencies needed beyond lucide-react
```

## Usage

### Basic Implementation

```javascript
import OrderManagement from './components/OrderManagement';

function App() {
  return <OrderManagement />;
}
```

### With Navigation

```javascript
import { useState } from 'react';
import OrderManagement from './components/OrderManagement';

function App() {
  const [activeScreen, setActiveScreen] = useState('orders');

  return (
    <div>
      {activeScreen === 'orders' && <OrderManagement />}
    </div>
  );
}
```

## Data Structure

### Order Object

```javascript
{
  id: string,            // e.g., "ORD-2456"
  customer: string,      // Customer name
  location: string,      // Delivery address
  quantity: string,      // e.g., "5000L"
  amount: string,        // e.g., "$450"
  date: string,          // Date in format "YYYY-MM-DD"
  time: string,          // Time in format "HH:MM AM/PM"
  status: string,        // Pending, In-Transit, Delivered, Cancelled
  statusColor: string    // Hex color code
}
```

### Timeline Item

```javascript
{
  status: string,        // Timeline stage name
  time: string,          // Time of completion
  completed: boolean     // Whether stage is completed
}
```

## Customization

### Change Colors

Edit the status colors in the orders array:

```javascript
const orders = [
  {
    status: 'Custom-Status',
    statusColor: '#YOUR_COLOR',
  },
];
```

### Add More Columns

1. Add header in table:
```javascript
<th>New Column</th>
```

2. Add data cell:
```javascript
<td>{order.newField}</td>
```

### Modify Filter Options

```javascript
const statusOptions = [
  'All Status',
  'Your Custom Status',
  // Add more options
];
```

## API Integration

### Fetching Orders

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('YOUR_API_URL/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rest of component
};
```

### Filtering with API

```javascript
const fetchOrdersByStatus = async (status) => {
  try {
    const response = await axios.get(
      `YOUR_API_URL/orders?status=${status}`
    );
    setOrders(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Export Implementation

```javascript
const handleExportData = async () => {
  try {
    const response = await axios.get(
      'YOUR_API_URL/orders/export',
      { responseType: 'blob' }
    );
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orders.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Export error:', error);
  }
};
```

## Advanced Features

### 1. Pagination

```javascript
const [currentPage, setCurrentPage] = useState(1);
const ordersPerPage = 10;

const indexOfLastOrder = currentPage * ordersPerPage;
const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

// Pagination controls
<div className="pagination">
  <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
    Previous
  </button>
  <span>Page {currentPage}</span>
  <button onClick={() => setCurrentPage(prev => prev + 1)}>
    Next
  </button>
</div>
```

### 2. Sorting

```javascript
const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

const handleSort = (key) => {
  let direction = 'asc';
  if (sortConfig.key === key && sortConfig.direction === 'asc') {
    direction = 'desc';
  }
  setSortConfig({ key, direction });
};

const sortedOrders = [...filteredOrders].sort((a, b) => {
  if (!sortConfig.key) return 0;
  
  const aValue = a[sortConfig.key];
  const bValue = b[sortConfig.key];
  
  if (aValue < bValue) {
    return sortConfig.direction === 'asc' ? -1 : 1;
  }
  if (aValue > bValue) {
    return sortConfig.direction === 'asc' ? 1 : -1;
  }
  return 0;
});

// In table header
<th onClick={() => handleSort('date')}>
  Date & Time
  {sortConfig.key === 'date' && (
    <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
  )}
</th>
```

### 3. Bulk Selection

```javascript
const [selectedOrders, setSelectedOrders] = useState([]);

const handleSelectOrder = (orderId) => {
  setSelectedOrders(prev =>
    prev.includes(orderId)
      ? prev.filter(id => id !== orderId)
      : [...prev, orderId]
  );
};

const handleSelectAll = () => {
  if (selectedOrders.length === filteredOrders.length) {
    setSelectedOrders([]);
  } else {
    setSelectedOrders(filteredOrders.map(order => order.id));
  }
};

// In table
<th>
  <input
    type="checkbox"
    checked={selectedOrders.length === filteredOrders.length}
    onChange={handleSelectAll}
  />
</th>

<td>
  <input
    type="checkbox"
    checked={selectedOrders.includes(order.id)}
    onChange={() => handleSelectOrder(order.id)}
  />
</td>
```

### 4. Loading States

```javascript
const [loading, setLoading] = useState(true);

// In component
{loading ? (
  <div className="loading-state">
    <div className="spinner"></div>
    <p>Loading orders...</p>
  </div>
) : (
  <table className="orders-table">
    {/* Table content */}
  </table>
)}
```

## Styling

### CSS Variables

Use CSS variables for easy theming:

```css
:root {
  --status-pending: #FF9800;
  --status-transit: #2196F3;
  --status-delivered: #4CAF50;
  --status-cancelled: #F44336;
}

.status-badge {
  background-color: var(--status-pending);
}
```

### Dark Mode Support

```css
@media (prefers-color-scheme: dark) {
  .order-management {
    background-color: #1a1a1a;
    color: #fff;
  }

  .orders-table {
    background-color: #2a2a2a;
  }
}
```

## Performance Optimization

### 1. Memoization

```javascript
import { useMemo } from 'react';

const filteredOrders = useMemo(() => {
  return orders.filter(order => {
    const matchesSearch = /* search logic */;
    const matchesStatus = /* filter logic */;
    return matchesSearch && matchesStatus;
  });
}, [orders, searchQuery, selectedStatus]);
```

### 2. Debounced Search

```javascript
import { useCallback } from 'react';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const debouncedSearch = useCallback(
  debounce((query) => {
    setSearchQuery(query);
  }, 300),
  []
);

// In input
<input
  onChange={(e) => debouncedSearch(e.target.value)}
/>
```

### 3. Virtual Scrolling

For very large datasets:

```javascript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={filteredOrders.length}
  itemSize={60}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      {/* Order row */}
    </div>
  )}
</FixedSizeList>
```

## Testing

### Unit Tests

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import OrderManagement from './OrderManagement';

test('renders order management title', () => {
  render(<OrderManagement />);
  expect(screen.getByText('Order Management')).toBeInTheDocument();
});

test('search filters orders', () => {
  render(<OrderManagement />);
  const searchInput = screen.getByPlaceholderText(/search/i);
  fireEvent.change(searchInput, { target: { value: 'ORD-2456' } });
  expect(screen.getByText('ORD-2456')).toBeInTheDocument();
});

test('opens order detail modal', () => {
  render(<OrderManagement />);
  const viewButton = screen.getAllByRole('button', { name: /view/i })[0];
  fireEvent.click(viewButton);
  expect(screen.getByText('Order Details')).toBeInTheDocument();
});
```

## Accessibility

### Keyboard Navigation

```javascript
<button
  onClick={handleClick}
  onKeyPress={(e) => e.key === 'Enter' && handleClick()}
  tabIndex={0}
  aria-label="View order details"
>
  <Eye size={20} />
</button>
```

### ARIA Labels

```javascript
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {filteredOrders.length} orders found
</div>
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Common Issues

### Issue: Dropdown not closing
**Solution:** Add click outside handler

```javascript
useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.filter-container')) {
      setShowStatusDropdown(false);
    }
  };

  document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, []);
```

### Issue: Modal not scrolling
**Solution:** Check overflow properties in CSS

```css
.modal-body {
  overflow-y: auto;
  max-height: calc(90vh - 200px);
}
```

## Future Enhancements

- [ ] Advanced filters (date range, amount range)
- [ ] Bulk actions (delete, update status)
- [ ] Print orders
- [ ] Email orders
- [ ] Order notes and comments
- [ ] File attachments
- [ ] Activity log
- [ ] Auto-refresh

## Resources

- [Lucide Icons](https://lucide.dev)
- [React Documentation](https://react.dev)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

## Support

For issues or questions, refer to the main project documentation.

---

**Part of Paani Flow Final Year Project**
CECOS University of IT and Emerging Sciences
