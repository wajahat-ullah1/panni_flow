# Paani Flow Web Dashboard - Setup Guide

## 🚀 Quick Start

This is the React web version of the Paani Flow Admin Dashboard.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** (v8 or higher) or **yarn**
- A modern web browser (Chrome, Firefox, Safari, Edge)

## 📦 Installation

### 1. Create React App Structure

```bash
# Create a new React app (if you haven't already)
npx create-react-app paani-flow-web
cd paani-flow-web
```

### 2. Install Dependencies

```bash
npm install recharts lucide-react react-router-dom axios date-fns
# or
yarn add recharts lucide-react react-router-dom axios date-fns
```

### 3. Project Structure

Organize your files as follows:

```
paani-flow-web/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminDashboard.css
│   │   ├── Sidebar.jsx
│   │   └── Sidebar.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

### 4. Copy Component Files

Copy the provided files to their respective locations:

- `AdminDashboard.jsx` → `src/components/AdminDashboard.jsx`
- `AdminDashboard.css` → `src/components/AdminDashboard.css`
- `Sidebar.jsx` → `src/components/Sidebar.jsx`
- `Sidebar.css` → `src/components/Sidebar.css`
- `App.js` → `src/App.js`
- `App.css` → `src/App.css`
- `index.js` → `src/index.js`
- `index.css` → `src/index.css`
- `index.html` → `public/index.html`

### 5. Update Import Paths

Make sure the import paths in `App.js` are correct:

```javascript
import Sidebar from './components/Sidebar';
import AdminDashboard from './components/AdminDashboard';
```

## 🏃 Running the Application

### Development Mode

```bash
npm start
# or
yarn start
```

The application will open at `http://localhost:3000`

### Production Build

```bash
npm run build
# or
yarn build
```

This creates an optimized production build in the `build/` folder.

### Testing

```bash
npm test
# or
yarn test
```

## 📊 Features

### Dashboard Components

1. **Statistics Cards**
   - Total Orders: 1,847 (+12.5%)
   - Active Deliveries: 24 (In Progress)
   - Revenue (Month): $67K (+21.8%)
   - Active Tankers: 18/25 (72% Utilization)

2. **Revenue Overview Chart**
   - Interactive line chart
   - 6-month data visualization
   - Custom tooltips
   - Smooth animations

3. **Demand Forecast Chart**
   - 7-day bar chart
   - Predicted demand visualization
   - Color-coded bars

4. **Recent Orders**
   - Order ID and company name
   - Quantity information
   - Status badges
   - Color-coded status

5. **Alerts & Notifications**
   - Real-time alerts
   - Priority indicators
   - Timestamp display

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `index.css`:

```css
:root {
  --primary-blue: #00a8e8;
  --success-green: #4caf50;
  --warning-orange: #ff9800;
  /* Add more custom colors */
}
```

### Modifying Stats

Edit the `stats` array in `AdminDashboard.jsx`:

```javascript
const stats = [
  {
    title: 'Your Custom Stat',
    value: '1,234',
    change: '+10%',
    icon: YourIcon,
    color: '#your-color',
    bgColor: '#your-bg-color',
  },
  // Add more stats
];
```

### Chart Customization

Modify chart properties in the component:

```javascript
<LineChart data={revenueData}>
  <Line 
    type="monotone" 
    dataKey="revenue" 
    stroke="#your-color"  // Change line color
    strokeWidth={3}       // Change line width
  />
</LineChart>
```

## 🔗 API Integration

### Connecting to Backend

Replace static data with API calls:

```javascript
import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('YOUR_API_URL/dashboard/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rest of component
};
```

### Environment Variables

Create a `.env` file in the root:

```env
REACT_APP_API_URL=https://your-api.com
REACT_APP_API_KEY=your_api_key
```

Access in code:

```javascript
const API_URL = process.env.REACT_APP_API_URL;
```

## 📱 Responsive Design

The dashboard is fully responsive and adapts to different screen sizes:

- **Desktop**: Full layout with sidebar and all components
- **Tablet**: Optimized layout with collapsible sidebar
- **Mobile**: Stacked layout with hamburger menu

### Testing Responsive Design

1. Open browser DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select different device sizes

## 🧪 Testing

### Unit Tests Example

Create `AdminDashboard.test.js`:

```javascript
import { render, screen } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';

test('renders dashboard title', () => {
  render(<AdminDashboard />);
  const titleElement = screen.getByText(/Admin Dashboard/i);
  expect(titleElement).toBeInTheDocument();
});

test('displays stats cards', () => {
  render(<AdminDashboard />);
  expect(screen.getByText('Total Orders')).toBeInTheDocument();
  expect(screen.getByText('1,847')).toBeInTheDocument();
});
```

Run tests:

```bash
npm test
```

## 🚀 Deployment

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

3. Deploy:
   ```bash
   netlify deploy --prod --dir=build
   ```

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

### Deploy to GitHub Pages

1. Add to `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/paani-flow",
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add scripts:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

## 🐛 Troubleshooting

### Common Issues

**Charts not displaying:**
- Ensure recharts is installed: `npm install recharts`
- Check browser console for errors
- Verify data format matches expected structure

**Icons not showing:**
- Install lucide-react: `npm install lucide-react`
- Check import statements
- Clear cache and restart dev server

**Styling issues:**
- Ensure CSS files are imported
- Check for conflicting styles
- Verify CSS modules configuration

**Build errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear build cache: `rm -rf build`

## 📚 Libraries Used

| Library | Version | Purpose |
|---------|---------|---------|
| React | 18.2.0 | UI framework |
| Recharts | 2.10.3 | Charts and graphs |
| Lucide React | 0.294.0 | Icons |
| React Router | 6.20.1 | Routing (optional) |
| Axios | 1.6.2 | HTTP client |
| Date-fns | 3.0.0 | Date utilities |

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Keep API keys secure
3. **Dependencies**: Regularly update packages
4. **HTTPS**: Always use HTTPS in production
5. **Authentication**: Implement proper auth (JWT, OAuth)
6. **Input Validation**: Validate all user inputs
7. **CSP**: Configure Content Security Policy

## 📈 Performance Optimization

### Code Splitting

```javascript
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminDashboard />
    </Suspense>
  );
}
```

### Memoization

```javascript
import { memo, useMemo } from 'react';

const StatCard = memo(({ stat }) => {
  // Component code
});

const chartData = useMemo(() => {
  return processData(rawData);
}, [rawData]);
```

### Lazy Loading Images

```javascript
<img 
  src={imageSrc} 
  loading="lazy" 
  alt="Description"
/>
```

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Recharts Documentation](https://recharts.org)
- [Lucide Icons](https://lucide.dev)
- [Create React App](https://create-react-app.dev)

## 🤝 Contributing

This is an academic project. For questions or improvements, contact the development team.

## 📄 License

Part of Paani Flow Final Year Project
CECOS University of IT and Emerging Sciences

## 👥 Development Team

- **Wajahat Ullah** - CU-2857-2022
- **Duaa** - CU-2893-2022

**Supervisors:**
- Mr. Abdul Hanan
- Mr. Ghasan

## 📞 Support

For issues or questions, refer to:
- Project documentation
- React community forums
- Stack Overflow

---

**Happy Coding! 🚀**
