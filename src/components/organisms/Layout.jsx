import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar 
          isMobileOpen={isMobileMenuOpen} 
          onMobileClose={closeMobileMenu}
        />
        
        <div className="flex-1 lg:ml-0">
          <Header 
            title="Village Administration"
            village="Sundarpur Gram Panchayat"
            onMenuToggle={toggleMobileMenu}
          />
          
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;