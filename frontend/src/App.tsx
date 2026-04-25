import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { useAuthStore } from '@/store/authStore';

import DashboardLayout from '@/components/layout/DashboardLayout';
// import LandingPage from '@/pages/LandingPage';
// import LoginPage from '@/pages/LoginPage';
// import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import MarketPage from '@/pages/MarketPage';
import NewsPage from '@/pages/NewsPage';
import CalendarPage from '@/pages/CalendarPage';
import WatchlistPage from '@/pages/WatchlistPage';
import AlertsPage from '@/pages/AlertsPage';
import CopyTradingPage from '@/pages/CopyTradingPage';
import ProfilePage from '@/pages/ProfilePage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import SettingsPage from '@/pages/SettingsPage';
import BillingPage from '@/pages/BillingPage';
import TraderDetailPage from '@/pages/TraderDetailPage';
import AnalyticsPage from '@/pages/AnalyticsPage';

// TODO: Re-enable auth routes after application is ready
// function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
//   return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
// }

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* TODO: Re-enable public routes after application is ready */}
        {/* <Route path="/" element={<LandingPage />} /> */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/register" element={<RegisterPage />} /> */}

        {/* Main Application — Dashboard Layout */}
        <Route
          element={<DashboardLayout />}
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/copy-trading" element={<CopyTradingPage />} />
          <Route path="/trader/:id" element={<TraderDetailPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
