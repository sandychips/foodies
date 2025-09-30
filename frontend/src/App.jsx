import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "./components/Loader/Loader.jsx";
import SharedLayout from "./components/SharedLayout/SharedLayout.jsx";
import RequireAuth from "./components/RouteGuards/RequireAuth.jsx";

const Home = lazy(() => import("./pages/HomePage/HomePage.jsx"));
const RecipePage = lazy(() => import("./pages/RecipePage/RecipePage.jsx"));
const AddRecipePage = lazy(() =>
  import("./pages/AddRecipePage/AddRecipePage.jsx")
);
const UserPage = lazy(() => import("./pages/UserPage/UserPage.jsx"));

const NotFoundPage = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>404 - Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
  </div>
);

export function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<Home />} />
          <Route path="/recipe/:id" element={<RecipePage />} />
          <Route path="/user/:id/recipe/:id" element={<RecipePage />} />
          <Route
            path="/recipe/add"
            element={
              <RequireAuth>
                <AddRecipePage />
              </RequireAuth>
            }
          />
          <Route
            path="/user/:id"
            element={
              <RequireAuth>
                <UserPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
