"use client"
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Feedback() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedbackType, setFeedbackType] = useState('general');
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // In a real application, you would send this data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Feedback submitted:', { name, email, feedbackType, rating, message });
      
      // Reset form
      setName('');
      setEmail('');
      setFeedbackType('general');
      setRating(null);
      setMessage('');
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitError('There was an error sending your feedback. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage="feedback" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-[#32230f] mb-8">Submit Feedback</h1>
          
          {submitSuccess ? (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-2">Thank You for Your Feedback!</h2>
              <p>We appreciate you taking the time to share your thoughts with us. Your feedback helps us improve our service for everyone.</p>
              <button 
                onClick={() => setSubmitSuccess(false)} 
                className="mt-4 px-4 py-2 bg-[#32230f] text-white rounded-md hover:bg-[#6c2704] transition"
              >
                Submit Another Feedback
              </button>
            </div>
          ) : (
            <div className="glass p-8 rounded-xl shadow-lg">
              <p className="text-gray-600 mb-6">
                Your feedback is valuable to us! Let us know what you think about our platform, report any issues you've encountered, 
                or suggest features that would make Lost and Found more useful for you.
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
                  <label htmlFor="feedbackType" className="block text-[#32230f] font-medium mb-2">Feedback Type</label>
                  <select
                    id="feedbackType"
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c2704] focus:border-transparent"
                    required
                  >
                    <option value="general">General Feedback</option>
                    <option value="suggestion">Feature Suggestion</option>
                    <option value="bug">Bug Report</option>
                    <option value="compliment">Compliment</option>
                    <option value="complaint">Complaint</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-[#32230f] font-medium mb-2">How would you rate your experience?</label>
                  <div className="flex space-x-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-8 w-8 ${
                            rating && star <= rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300 fill-current"
                          }`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                    {rating && (
                      <span className="text-gray-600 self-center ml-2">
                        {rating === 1 && "Poor"}
                        {rating === 2 && "Fair"}
                        {rating === 3 && "Good"}
                        {rating === 4 && "Very Good"}
                        {rating === 5 && "Excellent"}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-[#32230f] font-medium mb-2">Your Feedback</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c2704] focus:border-transparent"
                    required
                    placeholder="Please share your thoughts, suggestions, or report any issues you've encountered..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 bg-[#32230f] text-white rounded-md hover:bg-[#6c2704] transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <h2 className="text-xl font-semibold text-[#32230f] mb-4">Other Ways to Reach Us</h2>
            <p className="text-gray-600">
              You can also contact us directly at <a href="mailto:support@lostandfound.com" className="text-[#6c2704] hover:underline">support@lostandfound.com</a> or 
              through our social media channels.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}