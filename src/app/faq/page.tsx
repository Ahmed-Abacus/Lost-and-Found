"use client"
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: "How do I report a lost item?",
      answer: "To report a lost item, navigate to the 'Report Lost Item' page from the main menu. Fill out the form with as much detail as possible about your lost item, including when and where you last saw it, a description, and any identifying features. The more information you provide, the better chance you have of someone finding and returning your item."
    },
    {
      question: "How do I report a found item?",
      answer: "If you've found an item, go to the 'Report Found Item' page from the navigation menu. Complete the form with details about the item you found, where and when you found it, and your contact information. You can also upload a photo of the item to help the owner identify it."
    },
    {
      question: "What happens after I report a lost item?",
      answer: "After reporting a lost item, your report will be visible to other users on our platform. If someone finds an item matching your description, they can contact you through our system. You'll receive notifications when there are potential matches or when someone claims to have found your item."
    },
    {
      question: "How do I claim an item that I see on the found items list?",
      answer: "If you see your lost item in the found items list, click on the item to view its details. Then click the 'Claim This Item' button. You'll need to provide additional information to verify that you're the rightful owner, such as specific details about the item that weren't included in the public listing."
    },
    {
      question: "Is my personal information safe?",
      answer: "Yes, we take data privacy seriously. Your contact information is not publicly displayed. When someone wants to return an item to you, they'll contact you through our messaging system, and you can choose how to proceed from there. Please review our Privacy Policy for more details."
    },
    {
      question: "How long do lost and found reports stay active?",
      answer: "Reports typically remain active for 90 days. After that period, they will be archived but can be reactivated upon request. If your item is found or returned, you can mark the report as resolved at any time."
    },
    {
      question: "Are there any fees for using this service?",
      answer: "Our basic lost and found reporting service is completely free. We believe in helping people reconnect with their lost items without any barriers. We may offer premium features in the future, but the core functionality will always remain free."
    },
    {
      question: "What should I do if I suspect someone is falsely claiming my item?",
      answer: "If you believe someone is making a false claim, please contact our support team immediately. We have verification procedures in place to help ensure items are returned to their rightful owners. Never share sensitive information or meet with someone you don't trust."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage="faq" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-[#32230f] mb-8">Frequently Asked Questions</h1>
          
          <div className="glass p-6 rounded-xl shadow-lg">
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <button
                    className="flex justify-between items-center w-full text-left font-medium text-[#32230f] py-2 focus:outline-none"
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{item.question}</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${openIndex === index ? 'transform rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  <div 
                    className={`mt-2 text-gray-600 transition-all duration-300 overflow-hidden ${
                      openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="py-2">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <h2 className="text-xl font-semibold text-[#32230f] mb-4">Still Have Questions?</h2>
            <p className="text-gray-600 mb-6">
              If you couldn't find the answer to your question, feel free to contact our support team.
            </p>
            <a 
              href="/contact" 
              className="px-6 py-3 bg-[#32230f] text-white rounded-md hover:bg-[#6c2704] transition inline-block"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}