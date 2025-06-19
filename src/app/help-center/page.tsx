"use client"
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface HelpCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  topics: HelpTopic[];
}

interface HelpTopic {
  id: string;
  title: string;
  content: React.ReactNode;
}

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories: HelpCategory[] = [
    {
      id: 'account',
      title: 'Account & Profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      topics: [
        {
          id: 'create-account',
          title: 'How to create an account',
          content: (
            <div>
              <p className="mb-4">Creating an account on Lost and Found is easy and free. Follow these steps:</p>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>Click on the "Sign Up" button in the top right corner of the homepage.</li>
                <li>Enter your email address, create a password, and provide your name.</li>
                <li>Review and accept our Terms of Service and Privacy Policy.</li>
                <li>Click "Create Account" to complete the process.</li>
                <li>Check your email for a verification link and click it to activate your account.</li>
              </ol>
              <p>Once your account is created, you can start reporting lost or found items right away.</p>
            </div>
          )
        },
        {
          id: 'reset-password',
          title: 'How to reset your password',
          content: (
            <div>
              <p className="mb-4">If you've forgotten your password, you can easily reset it:</p>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>Click on "Log In" in the top right corner of the homepage.</li>
                <li>Click on the "Forgot Password?" link below the login form.</li>
                <li>Enter the email address associated with your account.</li>
                <li>Check your email for a password reset link.</li>
                <li>Click the link and follow the instructions to create a new password.</li>
              </ol>
              <p>If you don't receive the email within a few minutes, check your spam folder or contact our support team for assistance.</p>
            </div>
          )
        }
      ]
    },
    {
      id: 'lost-items',
      title: 'Reporting Lost Items',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      topics: [
        {
          id: 'report-lost',
          title: 'How to report a lost item',
          content: (
            <div>
              <p className="mb-4">To report a lost item:</p>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>Log in to your account.</li>
                <li>Click on "Report Lost Item" in the navigation menu.</li>
                <li>Fill out the form with as much detail as possible about your lost item.</li>
                <li>Include when and where you last had the item.</li>
                <li>Upload photos of the item if available.</li>
                <li>Provide your contact information.</li>
                <li>Submit the form.</li>
              </ol>
              <p>Your lost item report will be visible to other users who might have found your item. You'll receive notifications if someone reports finding an item that matches your description.</p>
            </div>
          )
        },
        {
          id: 'edit-lost-report',
          title: 'How to edit or delete a lost item report',
          content: (
            <div>
              <p className="mb-4">To edit or delete a lost item report:</p>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>Log in to your account.</li>
                <li>Go to your dashboard or profile page.</li>
                <li>Find the lost item report you want to modify in your list of reports.</li>
                <li>Click on "Edit" to update the information or "Delete" to remove the report.</li>
                <li>If editing, make your changes and click "Save" to update the report.</li>
              </ol>
              <p>Note: If your item has been found, please mark it as "Recovered" instead of deleting the report. This helps us track success rates and improve our service.</p>
            </div>
          )
        }
      ]
    },
    {
      id: 'found-items',
      title: 'Reporting Found Items',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      topics: [
        {
          id: 'report-found',
          title: 'How to report a found item',
          content: (
            <div>
              <p className="mb-4">To report an item you've found:</p>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>Log in to your account.</li>
                <li>Click on "Report Found Item" in the navigation menu.</li>
                <li>Fill out the form with details about the item you found.</li>
                <li>Specify where and when you found it.</li>
                <li>Upload photos to help the owner identify their item.</li>
                <li>Provide your contact information.</li>
                <li>Submit the form.</li>
              </ol>
              <p>Your found item report will be visible to users looking for lost items. The system will also automatically check for matching lost item reports and notify potential owners.</p>
            </div>
          )
        },
        {
          id: 'return-process',
          title: 'The item return process',
          content: (
            <div>
              <p className="mb-4">When someone claims an item you've reported as found:</p>
              <ol className="list-decimal pl-6 space-y-2 mb-4">
                <li>You'll receive a notification that someone has claimed the item.</li>
                <li>Review the claim details and any verification information provided.</li>
                <li>If you believe they are the rightful owner, you can approve the claim.</li>
                <li>Use our messaging system to arrange a safe meeting place or delivery method.</li>
                <li>After returning the item, mark the report as "Returned" in your dashboard.</li>
              </ol>
              <p className="mb-4">Tips for a safe return:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Meet in a public place during daylight hours.</li>
                <li>Consider meeting at a police station or other safe exchange zone.</li>
                <li>Ask for identification to verify the person's identity.</li>
                <li>Ask specific questions about the item that only the owner would know.</li>
              </ul>
            </div>
          )
        }
      ]
    },
    {
      id: 'safety',
      title: 'Safety & Security',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      topics: [
        {
          id: 'privacy-protection',
          title: 'How we protect your privacy',
          content: (
            <div>
              <p className="mb-4">At Lost and Found, we take your privacy seriously:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Your contact information is never publicly displayed.</li>
                <li>Communication between users happens through our secure messaging system.</li>
                <li>You control what personal information you share with other users.</li>
                <li>We use encryption to protect your data during transmission.</li>
                <li>We regularly update our security measures to protect against new threats.</li>
              </ul>
              <p>For more details, please review our <Link href="/privacy-policy" className="text-[#6c2704] hover:underline">Privacy Policy</Link>.</p>
            </div>
          )
        },
        {
          id: 'safe-meetups',
          title: 'Tips for safe meetups',
          content: (
            <div>
              <p className="mb-4">When meeting someone to retrieve or return an item:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li><strong>Choose a safe location:</strong> Meet in a public place with plenty of people around, such as a coffee shop, shopping mall, or police station.</li>
                <li><strong>Bring a friend:</strong> If possible, don't go alone to the meetup.</li>
                <li><strong>Meet during daylight hours:</strong> Avoid meeting at night or in isolated areas.</li>
                <li><strong>Tell someone where you're going:</strong> Let a friend or family member know where you're meeting and when you expect to return.</li>
                <li><strong>Trust your instincts:</strong> If something feels wrong, don't proceed with the meeting.</li>
                <li><strong>Verify identity:</strong> Ask for identification and verify that the person is who they claim to be.</li>
                <li><strong>Use our messaging system:</strong> Keep all communication within our platform until you're ready to meet.</li>
              </ul>
              <p>Remember, your safety is more important than any item. If you ever feel uncomfortable, it's okay to cancel or reschedule a meetup.</p>
            </div>
          )
        }
      ]
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId === activeCategory ? null : categoryId);
    setActiveTopic(null);
  };

  const handleTopicClick = (topicId: string) => {
    setActiveTopic(topicId === activeTopic ? null : topicId);
  };

  const filteredCategories = searchQuery
    ? helpCategories.map(category => ({
        ...category,
        topics: category.topics.filter(topic =>
          topic.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.topics.length > 0)
    : helpCategories;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage="help-center" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-[#32230f] mb-8">Help Center</h1>
        
        <div className="max-w-4xl mx-auto mb-10">
          <div className="glass p-6 rounded-xl shadow-lg mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c2704] focus:border-transparent"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute left-3 top-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="glass p-6 rounded-xl shadow-lg">
            {filteredCategories.length > 0 ? (
              <div className="space-y-6">
                {filteredCategories.map((category) => (
                  <div key={category.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className="flex items-center justify-between w-full text-left font-medium text-[#32230f] py-2 focus:outline-none"
                    >
                      <div className="flex items-center">
                        <span className="text-[#6c2704] mr-3">{category.icon}</span>
                        <span className="text-lg">{category.title}</span>
                      </div>
                      <svg
                        className={`w-5 h-5 transition-transform ${
                          activeCategory === category.id ? "transform rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>

                    <div
                      className={`mt-2 transition-all duration-300 overflow-hidden ${
                        activeCategory === category.id
                          ? "max-h-[1000px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pl-9 space-y-3">
                        {category.topics.map((topic) => (
                          <div key={topic.id}>
                            <button
                              onClick={() => handleTopicClick(topic.id)}
                              className="flex items-center justify-between w-full text-left text-[#32230f] py-2 focus:outline-none hover:text-[#6c2704]"
                            >
                              <span>{topic.title}</span>
                              <svg
                                className={`w-4 h-4 transition-transform ${
                                  activeTopic === topic.id ? "transform rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                ></path>
                              </svg>
                            </button>

                            <div
                              className={`mt-2 pl-4 border-l-2 border-gray-200 transition-all duration-300 overflow-hidden ${
                                activeTopic === topic.id
                                  ? "max-h-[1000px] opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                            >
                              <div className="text-gray-600 py-2">{topic.content}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">
                  We couldn't find any help topics matching your search. Please try different keywords or browse the categories.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-4 py-2 bg-[#32230f] text-white rounded-md hover:bg-[#6c2704] transition"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-[#32230f] mb-6">Still Need Help?</h2>
          <p className="text-gray-600 mb-6">
            If you couldn't find the answer to your question, our support team is here to help.
          </p>
          <Link
            href="/contact"
            className="px-6 py-3 bg-[#32230f] text-white rounded-md hover:bg-[#6c2704] transition inline-block"
          >
            Contact Support
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}