"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { db } from '@/firebase/config';
import { collection, getDocs, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { toast, Toaster } from 'react-hot-toast';

interface FoundItem {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  description: string;
  contactInfo: string;
  image: string;
  status: 'available' | 'claimed' | 'pending';
  createdAt?: string;
}

export default function FoundItems() {
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<FoundItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimerName, setClaimerName] = useState("");
  const [claimerContact, setClaimerContact] = useState("");
  const [claimerDetails, setClaimerDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleViewDetails = (item: FoundItem & { id: string }) => {
    setSelectedItem(item);
    setShowModal(true);
  };
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const fetchFoundItems = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create a query to get all found items, ordered by creation date
      const foundItemsQuery = query(
        collection(db, 'foundItems'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(foundItemsQuery);
      
      if (querySnapshot.empty) {
        setFoundItems([]);
        setLoading(false);
        return;
      }
      
      const items: FoundItem[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          title: data.title || 'Unnamed Item',
          category: data.category || 'Uncategorized',
          location: data.location || 'Unknown Location',
          date: data.date || new Date().toISOString().split('T')[0],
          description: data.description || 'No description provided',
          contactInfo: data.contactInfo || 'No contact information',
          image: data.image || '/icons/misc.png', // Default image if none provided
          status: (data.status === 'pending' ? 'available' : data.status) || 'available',
          createdAt: data.createdAt
        });
      });
      
      setFoundItems(items);
    } catch (error) {
      console.error('Error fetching found items:', error);
      setError('Failed to load found items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoundItems();
  }, []);

  const openItemDetails = (item: FoundItem) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setShowClaimForm(false);
    setSubmitSuccess(false);
  };

  const handleClaimItem = () => {
    setShowClaimForm(true);
  };
  
  const cancelClaimForm = () => {
    setShowClaimForm(false);
    setClaimerName("");
    setClaimerContact("");
    setClaimerDetails("");
  };

  const handleClaimFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!selectedItem) {
        throw new Error('No item selected');
      }

      // Update the item status in Firebase
      const itemRef = doc(db, 'foundItems', selectedItem.id);
      await updateDoc(itemRef, {
        status: 'pending',
        claimerName,
        claimerContact,
        claimerDetails,
        claimedAt: new Date().toISOString()
      });

      // Update local state
      const updatedItems = foundItems.map(item => 
        item.id === selectedItem.id 
          ? { ...item, status: 'pending' as const } 
          : item
      );
      setFoundItems(updatedItems);

      if (selectedItem) {
        setSelectedItem({ ...selectedItem, status: 'pending' });
      }

      toast.success('Claim submitted successfully!');
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting claim:', error);
      toast.error('Failed to submit claim. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter items based on search term and category
  const filteredItems = foundItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory ? item.category === filterCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(foundItems.map(item => item.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5e6d3] to-[#fff8dc] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pattern-grid"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#32230f] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animate-blob-primary"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#6c2704] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animate-blob-secondary animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-[#98765432] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar with glass effect */}
      <Navbar currentPage="home" />
      <Toaster position="top-center" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#32230f] to-[#6c2704] bg-clip-text text-transparent">
          Found Items
        </h1>

        {/* Search and Filter */}
        <div className="glass p-4 rounded-xl mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search items..."
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-70 border border-[rgba(50,35,15,0.2)] focus:outline-none focus:ring-2 focus:ring-[#6c2704]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <select
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-70 border border-[rgba(50,35,15,0.2)] focus:outline-none focus:ring-2 focus:ring-[#6c2704]"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6c2704]"></div>
          </div>
        ) : error ? (
          <div className="glass p-8 rounded-xl text-center">
            <p className="text-lg text-red-600">{error}</p>
            <button 
              onClick={fetchFoundItems}
              className="mt-4 px-4 py-2 bg-[#6c2704] text-white rounded-lg hover:bg-[#32230f] transition"
            >
              Try Again
            </button>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="glass hover-lift rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
                onClick={() => openItemDetails(item)}
              >
                <div className="relative h-48">
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="p-4"
                  />
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'available' ? 'bg-green-100 text-green-800' :
                    item.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status === 'available' ? 'Available' : 
                     item.status === 'claimed' ? 'Claimed' : 'Pending'}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#32230f] mb-1">{item.title}</h3>
                  <p className="text-sm text-[#6c2704] mb-2">{item.category}</p>
                  <div className="flex items-center text-xs text-gray-600 mb-1">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {item.location}
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {item.date}
                    
                  </div>
                  
                </div>
                <button
                    onClick={() => handleViewDetails(item)}
                    className="w-full py-2 bg-gradient-to-r from-[#32230f] to-[#6c2704] text-white rounded-lg shadow transition transform hover:scale-105"
                  >
                    View Details
                  </button>
              </div>
              

            ))}
          </div>
        ) : (
          <div className="glass p-8 rounded-xl text-center">
            <p className="text-lg text-[#32230f]">No found items match your search criteria.</p>
            <button 
              onClick={() => {setSearchTerm(""); setFilterCategory("");}}
              className="mt-4 px-4 py-2 bg-[#6c2704] text-white rounded-lg hover:bg-[#32230f] transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Item Details Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-[#32230f]">{selectedItem.title}</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-[#6c2704]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
                
              </div>

              <div className="relative h-64 mb-4 bg-gray-100 rounded-lg">
                <Image 
                  src={selectedItem.image} 
                  alt={selectedItem.title}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="p-4"
                />
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedItem.status === 'available' ? 'bg-green-100 text-green-800' :
                    selectedItem.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedItem.status === 'available' ? 'Available' : 
                     selectedItem.status === 'claimed' ? 'Claimed' : 'Claim Pending'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium text-[#32230f]">{selectedItem.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date Found</p>
                    <p className="font-medium text-[#32230f]">{selectedItem.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-[#32230f]">{selectedItem.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium text-[#32230f]">{selectedItem.contactInfo}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-[#32230f]">{selectedItem.description}</p>
                </div>
              </div>

              {/* Buttons for Close and Claim */}
              <div className="flex justify-end space-x-4 mb-4">
                {selectedItem.status === 'available' && !showClaimForm && !submitSuccess && (
                  <button
                    onClick={handleClaimItem}
                    className="py-2 px-4 bg-green-600 text-white rounded-lg shadow transition hover:bg-green-700 disabled:opacity-50"
                  >
                    Claim
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="py-2 px-4 bg-gradient-to-r from-[#32230f] to-[#6c2704] text-white rounded-lg shadow transition hover:opacity-90"
                >
                  Close
                </button>
              </div>

              {/* Simple Claim Form (replacing AI questionnaire) */}
              {showClaimForm && !submitSuccess && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-xl font-semibold text-[#32230f] mb-4">Claim Form</h3>
                  <form onSubmit={handleClaimFormSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c2704]"
                        value={claimerName}
                        onChange={(e) => setClaimerName(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
                      <input
                        type="text"
                        required
                        placeholder="Email or phone number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c2704]"
                        value={claimerContact}
                        onChange={(e) => setClaimerContact(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Proof of Ownership</label>
                      <textarea
                        required
                        placeholder="Please provide details that prove this item belongs to you..."
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6c2704]"
                        value={claimerDetails}
                        onChange={(e) => setClaimerDetails(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={cancelClaimForm}
                        className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-2 bg-gradient-to-r from-[#32230f] to-[#6c2704] text-white rounded-lg hover:opacity-90 transition flex justify-center items-center"
                      >
                        {submitting ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        ) : (
                          'Submit Claim'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {submitSuccess && (
                <div className="mt-6 border-t pt-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="text-lg font-medium text-green-800 mb-2">Claim Submitted Successfully!</h3>
                    <p className="text-green-600">Your claim has been submitted and is pending review. We will contact you soon.</p>
                    <button
                      onClick={closeModal}
                      className="mt-4 px-6 py-2 bg-gradient-to-r from-[#32230f] to-[#6c2704] text-white rounded-lg hover:opacity-90 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}