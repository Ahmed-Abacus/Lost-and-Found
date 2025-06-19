"use client"
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage="terms" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-[#32230f] mb-8">Terms of Use</h1>
          
          <div className="glass p-8 rounded-xl shadow-lg">
            <p className="text-gray-600 mb-6">
              Last Updated: April 27, 2025
            </p>
            
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-[#32230f] mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-600">
                  By accessing or using the Lost and Found platform, you agree to be bound by these Terms of Use. If you do not agree to all the terms and conditions, you must not access or use our services.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-[#32230f] mb-3">2. Description of Service</h2>
                <p className="text-gray-600">
                  Lost and Found is a platform that connects people who have lost items with people who have found items. We provide tools for reporting lost items, registering found items, and facilitating communication between users to help return lost property to its rightful owners.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-[#32230f] mb-3">3. User Accounts</h2>
                <p className="text-gray-600 mb-3">
                  To use certain features of our service, you may need to create an account. You are responsible for:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Providing accurate and complete information when creating your account</li>
                  <li>Maintaining the security of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use of your account</li>
                </ul>
                <p className="text-gray-600 mt-3">
                  We reserve the right to terminate accounts that violate our terms or policies.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-[#32230f] mb-3">4. User Conduct</h2>
                <p className="text-gray-600 mb-3">
                  When using our service, you agree not to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Post false, misleading, or fraudulent information</li>
                  <li>Impersonate another person or entity</li>
                  <li>Harass, threaten, or intimidate other users</li>
                  <li>Post content that is illegal, offensive, or infringes on others' rights</li>
                  <li>Use our platform for any illegal activities</li>
                  <li>Attempt to manipulate our system for financial gain</li>
                  <li>Interfere with the proper functioning of the service</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-[#32230f] mb-3">5. Content Ownership</h2>
                <p className="text-gray-600">
                  You retain ownership of any content you submit to our platform. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content in connection with our services. You are solely responsible for the content you post and warrant that you have all necessary rights to grant us this license.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-[#32230f] mb-3">6. Privacy</h2>
                <p className="text-gray-600">
                  Your privacy is important to us. Our <Link href="/privacy-policy" className="text-[#6c2704] hover:underline">Privacy Policy</Link> explains how we collect, use, and protect your personal information. By using our service, you consent to our collection and use of your data as described in the Privacy Policy.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-[#32230f] mb-3">7. Limitation of Liability</h2>
                <p className="text-gray-600">
                  Lost and Found is provided "as is" without warranties of any kind. We are not responsible for the actions of users on our platform. We do not guarantee that items will be found or returned. In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our service.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-[#32230f] mb-3">8. Indemnification</h2>
                <p className="text-gray-600">
                  You agree to indemnify and hold harmless Lost and Found, its affiliates, officers, employees, and agents from any claims, damages, liabilities, costs, or expenses arising from your use of the service or violation of these terms.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-[#32230f] mb-3">9. Modifications to Terms</h2>
                <p className="text-gray-600">
                  We may modify these Terms of Use at any time. We will notify users of significant changes through our website or by email. Your continued use of the service after such modifications constitutes your acceptance of the updated terms.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-[#32230f] mb-3">10. Governing Law</h2>
                <p className="text-gray-600">
                  These Terms of Use shall be governed by and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-[#32230f] mb-3">11. Contact Information</h2>
                <p className="text-gray-600">
                  If you have any questions about these Terms of Use, please contact us at:
                  <br /><br />
                  Email: legal@lostandfound.com<br />
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