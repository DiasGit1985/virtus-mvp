import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { VirtusProvider, useVirtus } from "./contexts/VirtusContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import RegisterVirtuePage from "./pages/RegisterVirtuePage";
import MuralPage from "./pages/MuralPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import InviteSignupPage from "./pages/InviteSignupPage";
import SelectActivitiesPage from "./pages/SelectActivitiesPage";


function Router() {
  const { currentPage, setCurrentPage } = useVirtus();

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'invite-signup':
        return <InviteSignupPage />;
      case 'activities':
        return <SelectActivitiesPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'register-virtue':
        return <RegisterVirtuePage />;
      case 'mural':
        return <MuralPage />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <LoginPage />;
    }
  };

  return <div>{renderPage()}</div>;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <VirtusProvider>
            <Router />
          </VirtusProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

