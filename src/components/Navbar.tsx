"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  currentPage?: 'home' | 'report-lost' | 'register-found' | 'lost-items' | 'found-items' | 'contact' | 'faq' | 'how-it-works' | 'success-stories' | 'tips' | 'privacy-policy' | 'help-center' | 'terms' | 'feedback' | 'report-issue' | 'connections';
}

export default function Navbar({ currentPage = 'home' }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Redirect to login page
    router.push('/login');
  };
  return (
    <nav className="glass sticky top-0 z-10 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-5">
        <div className="text-lg font-semibold">
          <Link href="/" className="bg-gradient-to-r from-[#32230f] to-[#6c2704] bg-clip-text text-transparent">
            Lost and Found
          </Link>
        </div>
        
        {/* Desktop Navigation - hidden on mobile */}
        <div className="hidden md:flex space-x-6">
          <Link 
            href="/report-lost" 
            className={`text-[#32230f] hover:text-[#6c2704] transition duration-300 ${currentPage === 'report-lost' ? 'font-medium' : ''}`}
          >
            Report Lost Item
          </Link>
          <Link 
            href="/register-found" 
            className={`text-[#32230f] hover:text-[#6c2704] transition duration-300 ${currentPage === 'register-found' ? 'font-medium' : ''}`}
          >
            Report Found Item
          </Link>
          <Link 
            href="/lost-items" 
            className={`text-[#32230f] hover:text-[#6c2704] transition duration-300 ${currentPage === 'lost-items' ? 'font-medium' : ''}`}
          >
            Lost Items
          </Link>
          <Link 
            href="/found-items" 
            className={`text-[#32230f] hover:text-[#6c2704] transition duration-300 ${currentPage === 'found-items' ? 'font-medium' : ''}`}
          >
            Found Items
          </Link>
          <Link 
            href="/connections" 
            className={`text-[#32230f] hover:text-[#6c2704] transition duration-300 ${currentPage === 'contact' ? 'font-medium' : ''}`}
          >
            Matches
          </Link>
          <Link 
            href="/#connections" 
            className={`text-[#32230f] hover:text-[#6c2704] transition duration-300 ${currentPage === 'contact' ? 'font-medium' : ''}`}
          >
            Contact Us
          </Link>
          <a
            onClick={handleLogout}
            className="text-[#32230f] hover:text-[#6c2704] transition duration-300 cursor-pointer"
          >
            Logout
          </a>
         
        </div>
        
        {/* Mobile Menu Button - visible only on mobile */}
        <button 
          className="md:hidden text-[#32230f] focus:outline-none"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Mobile Menu - slides down when open */}
      {mobileMenuOpen && (
        <div className="md:hidden glass py-3 px-4 border-t border-[rgba(50,35,15,0.1)] animate-slideDown">
          <div className="flex flex-col space-y-3">
            <Link 
              href="/report-lost" 
              className={`text-[#32230f] hover:text-[#6c2704] transition duration-300 py-2 ${currentPage === 'report-lost' ? 'font-medium' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Report Lost Item
            </Link>
            <Link 
              href="/register-found" 
              className={`text-[#32230f] hover:text-[#6c2704] transition duration-300 py-2 ${currentPage === 'register-found' ? 'font-medium' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Report Found Item
            </Link>
            <Link 
              href="/lost-items" 
              className={`text-[#32230f] hover:text-[#6c2704] transition duration-300 py-2 ${currentPage === 'lost-items' ? 'font-medium' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Lost Items
            </Link>
            <Link 
              href="/found-items" 
              className={`text-[#32230f] hover:text-[#6c2704] transition duration-300 py-2 ${currentPage === 'found-items' ? 'font-medium' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Found Items
            </Link>
            <Link 
              href="/connections" 
              className={`text-[#32230f] hover:text-[#6c2704] transition duration-300 py-2 ${currentPage === 'found-items' ? 'font-medium' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Matches
            </Link>
            <Link 
              href="/#connections" 
              className={`text-[#32230f] hover:text-[#6c2704] transition duration-300 py-2 ${currentPage === 'found-items' ? 'font-medium' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              contact us
            </Link>
            <a
                onClick={handleLogout}
                className="text-[#32230f] hover:text-[#6c2704] transition duration-300 py-2 cursor-pointer"
              >
                Logout
              </a>
            
          </div>
        </div>
      )}
    </nav>
  );
}