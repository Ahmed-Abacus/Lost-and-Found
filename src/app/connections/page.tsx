"use client";
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ItemConnections from './ItemConnections';

export default function ConnectionsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage="connections" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-[#32230f] mb-8">Item Connections</h1>
        
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-600 mb-10">
            Here you can see potential matches between lost and found items. Review the connections and 
            reach out to the other party if you believe you've found a match.
          </p>
          
          <ItemConnections />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}