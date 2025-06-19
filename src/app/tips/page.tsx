"use client"
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface Tip {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function Tips() {
  const tips: Tip[] = [
    {
      id: 1,
      title: "Act Quickly",
      description: "The sooner you report a lost item, the better your chances of recovery. Don't wait - create a lost item report as soon as you realize something is missing.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Be Detailed",
      description: "Include as many specific details as possible in your lost item report. Mention unique identifying features, scratches, stickers, or personalized elements that only the true owner would know.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Add Photos",
      description: "If you have photos of your lost item, include them in your report. Visual references make identification much easier for people who might have found your item.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Retrace Your Steps",
      description: "Think carefully about where you last had the item and all the places you visited afterward. Contact businesses, transportation services, and venues you visited around the time of the loss.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    },
    {
      id: 5,
      title: "Check Lost & Found Offices",
      description: "Many public places like airports, shopping malls, and transit stations have dedicated lost and found offices. Contact them directly in addition to posting on our platform.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      id: 6,
      title: "Use Social Media",
      description: "Share your lost item report on your social media accounts. The more people who know about your lost item, the better your chances of finding it.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )
    },
    {
      id: 7,
      title: "Offer a Reward",
      description: "Consider offering a reward for valuable or sentimental items. This can motivate people to make an extra effort to return your belongings.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 8,
      title: "Be Patient & Persistent",
      description: "Sometimes items take time to be found and reported. Check our platform regularly and don't give up hope too quickly. Many items are recovered weeks after being lost.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage="tips" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-[#32230f] mb-8">Tips for Finding Lost Items</h1>
        
        <div className="max-w-4xl mx-auto mb-10">
          <p className="text-center text-gray-600 mb-10">
            Losing something important can be stressful, but following these tips can significantly 
            increase your chances of recovering your belongings.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip) => (
              <div key={tip.id} className="glass p-6 rounded-xl shadow-lg">
                <div className="flex items-start">
                  <div className="text-[#6c2704] mr-4 mt-1">
                    {tip.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-[#32230f] mb-2">{tip.title}</h2>
                    <p className="text-gray-600">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-[#32230f] mb-6">Ready to Report a Lost Item?</h2>
          <p className="text-gray-600 mb-6">
            The sooner you report your lost item, the better your chances of recovery.
          </p>
          <Link 
            href="/report-lost" 
            className="px-6 py-3 bg-[#32230f] text-white rounded-md hover:bg-[#6c2704] transition inline-block"
          >
            Report Lost Item
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}