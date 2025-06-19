"use client"
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db } from '@/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast, Toaster } from 'react-hot-toast';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Create a new document in the 'contactMessages' collection
      await addDoc(collection(db, 'contactMessages'), {
        name,
        email,
        subject,
        message,
        createdAt: serverTimestamp(),
        status: 'unread' // Useful for admin panel to track read/unread messages
      });
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setSubmitSuccess(true);
      
      // Optional: Show a toast notification
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('There was an error sending your message. Please try again later.');
      toast.error('Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage="contact" />
      <Toaster position="top-center" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-[#32230f] mb-8">Contact Us</h1>
          
          {submitSuccess ? (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
              <p>Your message has been sent successfully. We'll get back to you as soon as possible.</p>
              <button 
                onClick={() => setSubmitSuccess(false)} 
                className="mt-4 px-4 py-2 bg-[#32230f] text-white rounded-md hover:bg-[#6c2704] transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <div className="glass p-8 rounded-xl shadow-lg">
              <p className="text-gray-700 mb-6">
                Have a question about a lost or found item? Need help with using our platform? 
                Fill out the form below and our team will get back to you as soon as possible.
              </p>
              
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
                  {submitError}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-[#32230f] font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c2704] focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-[#32230f] font-medium mb-2">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c2704] focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-[#32230f] font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c2704] focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-[#32230f] font-medium mb-2">Your Message</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c2704] focus:border-transparent"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 bg-[#32230f] text-white rounded-md hover:bg-[#6c2704] transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}