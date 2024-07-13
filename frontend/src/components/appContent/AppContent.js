
import AppRoutes from "../routes-nav/AppRoutes";
import NavBar from "../routes-nav/NavBar";
import LoadingSpinner from "../common/LoadingSpinner";
import { useAuthContext } from "../../contexts/AuthContext";

/**
 * AppContent Component
 * 
 * Responsible for rendering the main content of the application after authentication information (`infoLoaded`) has been loaded.
 * 
 * Integrates with user authentication context (`useAuthContext`) to manage
 * authentication-related actions and render navigation (`NavBar`) and
 * application routes (`AppRoutes`).
 * 
 * Uses `LoadingSpinner` to indicate loading state until authentication
 * information is ready.
 */

const AppContent = () => {
  const { infoLoaded } = useAuthContext();

  if (!infoLoaded) return <LoadingSpinner />;

  return (
    <>
      <NavBar />
      <main className="Container pt-5">
        <AppRoutes />
      </main>
    </>
  );
};

export default AppContent;