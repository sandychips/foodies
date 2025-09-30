// src/components/SharedLayout/SharedLayout.jsx
import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";
import { Outlet } from "react-router-dom";

const SharedLayout = () => (
  <>
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
    <Header />
    <main id="main-content" role="main">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default SharedLayout;
