"use client"
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface IssueType {
  id: string;
  label: string;
  description: string;
}

export default function ReportIssue() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [issueType, setIssueType] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [deviceInfo, setDeviceInfo] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const issueTypes: IssueType[] = [
    {
      id: 'login',
      label: 'Login/Account Issues',
      description: 'Problems with signing in, account creation, or password reset'
    },
    {
      id: 'search',
      label: 'Search Functionality',
      description: 'Issues with searching for lost or found items'
    },
    {
      id: 'reporting',
      label: 'Reporting Items',
      description: 'Problems with reporting lost or found items'
    },
    {
      id: 'messaging',
      label: 'Messaging System',
      description: 'Issues with the messaging or notification system'
    },
    {
      id: 'display',
      label: 'Display/UI Issues',
      description: 'Problems with how the website looks or functions'
    },
    {
      id: 'performance',
      label: 'Performance Issues',
      description: 'Website is slow, freezing, or crashing'
    },
    {
      id: 'other',
      label: 'Other Technical Issue',
      description: 'Any other technical problems not listed above'
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setAttachments([...attachments, ...fileArray]);
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // In a real application, you would send this data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Issue reported:', { 
        name, 
        email, 
        issueType, 
        issueDescription, 
        steps, 
        deviceInfo, 
        attachments: attachments.map(file => file.name) 
      });
      
      // Reset form
      setName('');
      setEmail('');
      setIssueType('');
      setIssueDescription('');
      setSteps('');
      setDeviceInfo('');
      setAttachments([]);
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting issue report:', error);
      setSubmitError('There was an error sending your issue report. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPage="report-issue" />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-[#32230f] mb-8">Report a Technical Issue</h1>
          
          {submitSuccess ? (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-2">Thank You for Your Report!</h2>
              <p>We've received your issue report and our technical team will investigate it as soon as possible. If we need additional information, we'll contact you via the email address you provided.</p>
              <p className="mt-2">Your report helps us improve Lost and Found for everyone.</p>
              <button 
                onClick={() => setSubmitSuccess(false)} 
                className="mt-4 px-4 py-2 bg-[#32230f] text-white rounded-md hover:bg-[#6c2704] transition"
              >
                Report Another Issue
              </button>
            </div>
          ) : (
            <div className="glass p-8 rounded-xl shadow-lg">
              <p className="text-gray-600 mb-6">
                Encountered a problem with our platform? Please let us know so we can fix it. 
                The more details you provide, the faster we can identify and resolve the issue.
              </p>
              
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
                  {submitError}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
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
                  
                  <div>
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
                </div>
                
                <div className="mb-4">
                  <label htmlFor="issueType" className="block text-[#32230f] font-medium mb-2">Issue Type</label>
                  <select
                    id="issueType"
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c2704] focus:border-transparent"
                    required
                  >
                    <option value="">Select an issue type</option>
                    {issueTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {issueType && (
                    <p className="mt-1 text-sm text-gray-500">
                      {issueTypes.find(type => type.id === issueType)?.description}
                    </p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="issueDescription" className="block text-[#32230f] font-medium mb-2">
                    Issue Description
                  </label>
                  <textarea
                    id="issueDescription"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c2704] focus:border-transparent"
                    placeholder="Please describe the issue in detail. What happened? What were you trying to do?"
                    required
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="steps" className="block text-[#32230f] font-medium mb-2">
                    Steps to Reproduce
                  </label>
                  <textarea
                    id="steps"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c2704] focus:border-transparent"
                    placeholder="What steps can we take to reproduce this issue? (e.g., 1. Logged in 2. Clicked on 'Report Lost Item' 3. Filled out form 4. Clicked submit)"
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="deviceInfo" className="block text-[#32230f] font-medium mb-2">
                    Device & Browser Information
                  </label>
                  <input
                    type="text"
                    id="deviceInfo"
                    value={deviceInfo}
                    onChange={(e) => setDeviceInfo(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6c2704] focus:border-transparent"
                    placeholder="e.g., Windows 10, Chrome 96.0.4664.110"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-[#32230f] font-medium mb-2">
                    Attachments (Screenshots, etc.)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="fileUpload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-3 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input
                        id="fileUpload"
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  
                  {attachments.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Attached Files:</p>
                      <ul className="space-y-2">
                        {attachments.map((file, index) => (
                          <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                            <span className="text-sm truncate max-w-xs">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 bg-[#32230f] text-white rounded-md hover:bg-[#6c2704] transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Issue Report'}
                </button>
              </form>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <h2 className="text-xl font-semibold text-[#32230f] mb-4">Need Immediate Help?</h2>
            <p className="text-gray-600">
              For urgent issues, you can contact our support team directly at{' '}
              <a href="mailto:support@lostandfound.com" className="text-[#6c2704] hover:underline">
                support@lostandfound.com
              </a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}