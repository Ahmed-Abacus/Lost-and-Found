"use client"
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

interface SuccessStory {
  id: number;
  name: string;
  item: string;
  story: string;
  image: string;
}

export default function SuccessStories() {
  const stories: SuccessStory[] = [
    {
      id: 1,
      name: "Tehreem Aslam",
      item: "Ring",
      story: "I lost my engagement ring at the fountain ground. I was devastated. I posted on Lost and Found, and within 48 hours, someone had found it buried in the sand! I'm eternally grateful for this platform and the honest person who returned it.",
      image: "/uploads/success-story-1.webp"
    },
    {
      id: 2,
      name: "Mehreen Waseem",
      item: "Laptop with Important Work",
      story: "I accidentally left my laptop in a class. It contained months of research that wasn't fully backed up. I thought it was gone forever, but after posting on Lost and Found, a student found this and contacted me. We arranged a meeting, and I got my laptop back intact!",
      image: "/uploads/success-story-2.jpg"
    },
    {
      id: 3,
      name: "Ali Raza",
      item: "Family Watch",
      story: "My grandfather's watch went missing. It was the only thing I had to remember him by. I was heartbroken. After posting on Lost and Found, one of the movers recognized it from the description and returned it. This platform helped me recover an irreplaceable piece of my family history.",
      image: "/uploads/success-story-3.jpg"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage="success-stories" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-[#32230f] mb-8">Success Stories</h1>
        
        <div className="max-w-4xl mx-auto mb-10">
          <p className="text-center text-gray-600 mb-10">
            Every day, people are reunited with their lost belongings thanks to our platform and the kindness of strangers. 
            Here are some of the heartwarming stories from our community.
          </p>
          
          <div className="space-y-12">
            {stories.map((story) => (
              <div key={story.id} className="glass p-6 rounded-xl shadow-lg">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 flex-shrink-0">
                    <div className="relative h-60 w-full rounded-lg overflow-hidden">
                      <Image 
                        src={story.image} 
                        alt={`${story.name} with their ${story.item}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-xl font-semibold text-[#32230f] mb-2">{story.name}</h2>
                    <h3 className="text-[#6c2704] mb-4">Recovered: {story.item}</h3>
                    <p className="text-gray-600">{story.story}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-[#32230f] mb-6">Share Your Success Story</h2>
          <p className="text-gray-600 mb-6">
            Have you been reunited with a lost item through our platform? We'd love to hear about it!
            Share your story and inspire others.
          </p>
          <a 
            href="/contact" 
            className="px-6 py-3 bg-[#32230f] text-white rounded-md hover:bg-[#6c2704] transition inline-block"
          >
            Submit Your Story
          </a>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}