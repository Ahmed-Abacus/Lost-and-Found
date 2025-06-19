"use client"
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { db } from '@/firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

interface LostItem {
  title: string;
  category: string;
  location: string;
  date: string;
  description: string;
  contactInfo: string;
  image?: string;
  status: 'pending' | 'found' | 'claimed';
  offerReward?: boolean;
  rewardAmount?: string;
  rewardCurrency?: string;
  finderName?: string;
  finderContact?: string;
  finderDetails?: string;
  foundDate?: string;
}

export default function LostItems() {
  const [lostItems, setLostItems] = useState<(LostItem & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<(LostItem & { id: string }) | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showFoundForm, setShowFoundForm] = useState(false);
  const [finderName, setFinderName] = useState("");
  const [finderContact, setFinderContact] = useState("");
  const [finderDetails, setFinderDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'lostItems'));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as LostItem
        }));
        setLostItems(items);
      } catch (error) {
        console.error('Error fetching lost items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLostItems();
  }, []);

  const handleFoundItem = () => {
    setShowFoundForm(true);
  };

  const handleFoundFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    
    setSubmitting(true);
    try {
      const itemRef = doc(db, 'lostItems', selectedItem.id);
      await updateDoc(itemRef, {
        status: 'found',
        finderName,
        finderContact,
        finderDetails,
        foundDate: new Date().toISOString()
      });

      setLostItems(prevItems =>
        prevItems.map(item =>
          item.id === selectedItem.id
            ? { ...item, status: 'found', finderName, finderContact, finderDetails }
            : item
        )
      );
      
      setSelectedItem(prev => prev ? {
        ...prev,
        status: 'found',
        finderName,
        finderContact,
        finderDetails
      } : null);
      
      setSubmitSuccess(true);
      setShowFoundForm(false);
    } catch (error) {
      console.error('Error updating item status:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const cancelFoundForm = () => {
    setShowFoundForm(false);
    setFinderName("");
    setFinderContact("");
    setFinderDetails("");
  };

  const handleViewDetails = (item: LostItem & { id: string }) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setShowFoundForm(false);
    setSubmitSuccess(false);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      found: 'bg-green-100 text-green-800',
      claimed: 'bg-blue-100 text-blue-800'
    };
    return (
      <span className={`px-2 py-1 ${badges[status as keyof typeof badges]} rounded-full text-xs`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5e6d3] to-[#fff8dc]">
      <Navbar currentPage="home" />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#32230f] to-[#6c2704] bg-clip-text text-transparent">
          Lost Items
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#32230f]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lostItems.map((item) => (
              <div key={item.id} className="glass hover-lift rounded-xl overflow-hidden shadow-lg">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-[#32230f]">{item.title}</h2>
                    {getStatusBadge(item.status)}
                    
                  </div>
                  
                  <div className="mb-4">
                    
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Category:</span> {item.category}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Location:</span> {item.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Date:</span> {new Date(item.date).toLocaleDateString()}
                    </p>
                    
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {item.offerReward && (
                    <p className="text-sm text-green-600 font-medium mt-2">
                      Reward: {item.rewardAmount} {item.rewardCurrency}
                    </p>
                  )}
                  
                  <button
                    onClick={() => handleViewDetails(item)}
                    className="w-full py-2 bg-gradient-to-r from-[#32230f] to-[#6c2704] text-white rounded-lg shadow transition transform hover:scale-105"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-[#32230f]">{selectedItem.title}</h2>
                  {getStatusBadge(selectedItem.status)}
                </div>
                
                {selectedItem.image && (
                  <div className="mb-6 flex justify-center">
                    <div className="relative h-48 w-full max-w-md rounded-lg overflow-hidden">
                      <Image 
                        src={selectedItem.image} 
                        alt={selectedItem.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Category:</span> {selectedItem.category}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Location:</span> {selectedItem.location}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Date:</span> {new Date(selectedItem.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Status:</span> {selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1)}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Contact:</span> {selectedItem.contactInfo}
                    </p>
                    {selectedItem.offerReward && (
                      <p className="text-sm text-green-600 font-medium">
                        Reward: {selectedItem.rewardAmount} {selectedItem.rewardCurrency}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-[#32230f] mb-2">Description</h3>
                  <p className="text-gray-700">{selectedItem.description}</p>
                </div>

                {selectedItem.status === 'found' && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg">
                    <h3 className="text-lg font-medium text-green-800 mb-2">Found Information</h3>
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-medium">Found by:</span> {selectedItem.finderName}
                    </p>
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-medium">Found Date:</span> {selectedItem.foundDate && new Date(selectedItem.foundDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Details:</span> {selectedItem.finderDetails}
                    </p>
                  </div>
                )}

<div className="flex justify-end space-x-4 mb-4">
                  {selectedItem.status === 'pending' && !showFoundForm && (
                    <button
                      onClick={handleFoundItem}
                      className="py-2 px-4 bg-green-600 text-white rounded-lg shadow transition hover:bg-green-700 disabled:opacity-50"
                    >
                      Found
                    </button>
                  )}
                  <button
                    onClick={closeModal}
                    className="py-2 px-4 bg-gradient-to-r from-[#32230f] to-[#6c2704] text-white rounded-lg shadow transition hover:opacity-90"
                  >
                    Close
                  </button>
                </div>

                {showFoundForm && (
                  <form onSubmit={handleFoundFormSubmit} className="mb-6">
                    <h3 className="text-lg font-medium text-[#32230f] mb-4">Found Item Form</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input
                          type="text"
                          value={finderName}
                          onChange={(e) => setFinderName(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32230f]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Information</label>
                        <input
                          type="text"
                          value={finderContact}
                          onChange={(e) => setFinderContact(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32230f]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
                        <textarea
                          value={finderDetails}
                          onChange={(e) => setFinderDetails(e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32230f] h-24"
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 py-2 bg-green-600 text-white rounded-lg shadow transition hover:bg-green-700 disabled:opacity-50"
                        >
                          {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelFoundForm}
                          className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg shadow transition hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {submitSuccess && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800">Thank you for reporting this found item!</p>
                  </div>
                )}
                
                
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}