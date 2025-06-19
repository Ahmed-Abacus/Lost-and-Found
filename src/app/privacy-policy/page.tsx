"use client"
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage="privacy-policy" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-[#32230f] mb-8">Privacy Policy</h1>
          
          <div className="glass p-8 rounded-xl shadow-lg">
            <p className="text-gray-600 mb-6">
              Last Updated: April 27, 2025
            </p>
            
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-[#32230f] mb-3">1. Introduction</h2>
                <p className="text-gray-600">
                  Welcome to Lost and Found. We respect your privacy and are committed to protecting your personal data. 
                  This privacy policy will inform you about how we look after your personal data when you visit our website 
                  and tell you about your privacy rights and how the law protects you.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-[#32230f] mb-3">2. The Data We Collect</h2>
                <p className="text-gray-600 mb-3">
                  We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                  <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                  <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                  <li><strong>Profile Data</strong> includes your username and password, your interests, preferences, feedback and survey responses.</li>
                  <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-[#32230f] mb-3">3. How We Use Your Data</h2>
                <p className="text-gray-600 mb-3">
                  We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>To register you as a new user.</li>
                  <li>To process and facilitate lost and found item reports.</li>
                  <li>To manage our relationship with you.</li>
                  <li>To improve our website, products/services, marketing or customer relationships.</li>
                  <li>To recommend content that may be of interest to you.</li>
                  <li>To administer and protect our business and this website.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-[#32230f] mb-3">4. Data Security</h2>
                <p className="text-gray-600">
                  We have put in place appropriate security measures to prevent your personal data from being accidentally lost, 
                  used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data 
                  to those employees, agents, contractors and other third parties who have a business need to know.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-[#32230f] mb-3">5. Data Retention</h2>
                <p className="text-gray-600">
                  We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, 
                  including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-[#32230f] mb-3">6. Your Legal Rights</h2>
                <p className="text-gray-600 mb-3">
                  Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Request access to your personal data.</li>
                  <li>Request correction of your personal data.</li>
                  <li>Request erasure of your personal data.</li>
                  <li>Object to processing of your personal data.</li>
                  <li>Request restriction of processing your personal data.</li>
                  <li>Request transfer of your personal data.</li>
                  <li>Right to withdraw consent.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-[#32230f] mb-3">7. Contact Us</h2>
                <p className="text-gray-600">
                  If you have any questions about this privacy policy or our privacy practices, please contact us at:
                  <br /><br />
                  Email: privacy@lostandfound.com<br />
                  Phone: +1 (800) 123-4567<br />
                  Address: Lahore Garrison University
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}