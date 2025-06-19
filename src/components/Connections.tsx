"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Connections() {
  return (
    <div id="connections" className="mt-12 glass p-8 rounded-xl shadow-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center text-[#32230f]">CONTACT US</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-medium text-[#32230f] mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="text-[#32230f] hover:text-[#6c2704] transition">Home</Link></li>
            <li><Link href="/report-lost" className="text-[#32230f] hover:text-[#6c2704] transition">Report Lost Item</Link></li>
            <li><Link href="/register-found" className="text-[#32230f] hover:text-[#6c2704] transition">Report Found Item</Link></li>
            <li><Link href="/lost-items" className="text-[#32230f] hover:text-[#6c2704] transition">Lost Items</Link></li>
            <li><Link href="/found-items" className="text-[#32230f] hover:text-[#6c2704] transition">Found Items</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium text-[#32230f] mb-3">Resources</h3>
          <ul className="space-y-2">
            <li><Link href="/faq" className="text-[#32230f] hover:text-[#6c2704] transition">F.A.Q</Link></li>
            <li><Link href="/how-it-works" className="text-[#32230f] hover:text-[#6c2704] transition">How It Works</Link></li>
            <li><Link href="/success-stories" className="text-[#32230f] hover:text-[#6c2704] transition">Success Stories</Link></li>
            <li><Link href="/tips" className="text-[#32230f] hover:text-[#6c2704] transition">Tips for Finding Items</Link></li>
            <li><Link href="/privacy-policy" className="text-[#32230f] hover:text-[#6c2704] transition">Privacy Policy</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium text-[#32230f] mb-3">Support</h3>
          <ul className="space-y-2">
            <li><Link href="/help-center" className="text-[#32230f] hover:text-[#6c2704] transition">Help Center</Link></li>
            <li><Link href="/contact" className="text-[#32230f] hover:text-[#6c2704] transition">Contact Support</Link></li>
            <li><Link href="/terms" className="text-[#32230f] hover:text-[#6c2704] transition">Terms of Use</Link></li>
            <li><Link href="/feedback" className="text-[#32230f] hover:text-[#6c2704] transition">Submit Feedback</Link></li>
            <li><Link href="/report-issue" className="text-[#32230f] hover:text-[#6c2704] transition">Report an Issue</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8 border-t pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="font-medium text-[#32230f] mb-3">FOLLOW US:</h3>
            <div className="flex space-x-4">
              <Link href="https://instagram.com" className="text-[#32230f] hover:text-[#6c2704] transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
              <Link href="https://facebook.com" className="text-[#32230f] hover:text-[#6c2704] transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </Link>
              <Link href="https://twitter.com" className="text-[#32230f] hover:text-[#6c2704] transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <h3 className="font-medium text-[#32230f] mb-3">HAVE A QUESTION?</h3>
            <Link href="/contact" className="text-[#32230f] hover:text-[#6c2704] transition flex items-center justify-center md:justify-end">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Email Us
            </Link>
            
            <h3 className="font-medium text-[#32230f] mt-4 mb-3">EMERGENCY CONTACT</h3>
            <div className="flex items-center justify-center md:justify-end text-[#32230f]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>+1 (800) 123-4567</span>
            </div>
            
            <h3 className="font-medium text-[#32230f] mt-4 mb-3">DOWNLOAD OUR APP</h3>
            <div className="flex flex-row space-x-2 justify-center md:justify-end">
              <Link href="https://apps.apple.com" className="hover:opacity-80 transition">
                <Image src="/app-store-badge.png" alt="Download on the App Store" width={120} height={40} unoptimized />
              </Link>
              <Link href="https://play.google.com" className="hover:opacity-80 transition">
                <Image src="/google-play-badge.png" alt="Get it on Google Play" width={120} height={40} unoptimized />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}