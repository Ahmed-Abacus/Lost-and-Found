"use client"
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage="how-it-works" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-[#32230f] mb-8">How It Works</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="glass p-8 rounded-xl shadow-lg mb-10">
            <h2 className="text-2xl font-semibold text-[#32230f] mb-6">Lost Something?</h2>
            
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-[#f8f5f0] p-4 rounded-full h-16 w-16 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-[#6c2704]">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[#32230f] mb-2">Report Your Lost Item</h3>
                  <p className="text-gray-600">
                    Fill out our simple form with details about your lost item, including when and where you last had it, 
                    a description, and any identifying features. Add photos if available.
                  </p>
                  <Link href="/report-lost" className="inline-block mt-3 text-[#6c2704] hover:underline">
                    Report a Lost Item →
                  </Link>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-[#f8f5f0] p-4 rounded-full h-16 w-16 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-[#6c2704]">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[#32230f] mb-2">Get Notified of Matches</h3>
                  <p className="text-gray-600">
                    Our system will automatically notify you when someone reports finding an item that matches your description. 
                    You can also browse the found items list yourself.
                  </p>
                  <Link href="/found-items" className="inline-block mt-3 text-[#6c2704] hover:underline">
                    Browse Found Items →
                  </Link>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-[#f8f5f0] p-4 rounded-full h-16 w-16 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-[#6c2704]">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[#32230f] mb-2">Verify and Retrieve</h3>
                  <p className="text-gray-600">
                    When you spot your item, you can claim it through our platform. You'll need to verify ownership by 
                    providing specific details about the item. Once verified, arrange to retrieve your item.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass p-8 rounded-xl shadow-lg mb-10">
            <h2 className="text-2xl font-semibold text-[#32230f] mb-6">Found Something?</h2>
            
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-[#f8f5f0] p-4 rounded-full h-16 w-16 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-[#6c2704]">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[#32230f] mb-2">Report the Found Item</h3>
                  <p className="text-gray-600">
                    Register the item you found with details about where and when you found it, along with a description. 
                    Upload photos to help the owner identify their property.
                  </p>
                  <Link href="/register-found" className="inline-block mt-3 text-[#6c2704] hover:underline">
                    Report a Found Item →
                  </Link>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-[#f8f5f0] p-4 rounded-full h-16 w-16 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-[#6c2704]">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[#32230f] mb-2">Connect with the Owner</h3>
                  <p className="text-gray-600">
                    Our system will automatically check for matching lost item reports. The owner may also see your listing 
                    and make a claim. You'll be notified when someone claims the item.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="bg-[#f8f5f0] p-4 rounded-full h-16 w-16 flex items-center justify-center shrink-0">
                  <span className="text-2xl font-bold text-[#6c2704]">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-medium text-[#32230f] mb-2">Return the Item</h3>
                  <p className="text-gray-600">
                    Once the rightful owner has been verified, arrange a safe way to return the item. Our platform helps 
                    facilitate this process while protecting everyone's privacy and security.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-[#32230f] mb-4">Our Success Rate</h2>
            <p className="text-gray-600 mb-6">
              Our platform has helped thousands of people reconnect with their lost belongings. 
              With your participation, we can make this community even more effective.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#6c2704]">75%</div>
                <div className="text-sm text-gray-600 mt-2">Recovery Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#6c2704]">24hrs</div>
                <div className="text-sm text-gray-600 mt-2">Average Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#6c2704]">10k+</div>
                <div className="text-sm text-gray-600 mt-2">Items Returned</div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#32230f] mb-4">Ready to Get Started?</h2>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Link 
                href="/report-lost" 
                className="px-6 py-3 bg-[#32230f] text-white rounded-md hover:bg-[#6c2704] transition"
              >
                Report Lost Item
              </Link>
              <Link 
                href="/register-found" 
                className="px-6 py-3 border border-[#32230f] text-[#32230f] rounded-md hover:bg-[#f8f5f0] transition"
              >
                Report Found Item
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}