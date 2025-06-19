"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/firebase/config';
import { collection, getDocs, doc, updateDoc, addDoc, query, where, orderBy } from 'firebase/firestore';
import { toast, Toaster } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
}

interface LostItem {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  description: string;
  contactInfo: string;
  image?: string;
  status: 'pending' | 'found' | 'claimed';
  createdAt?: string;
  userId?: string;
}

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
  userId?: string;
}

interface Connection {
  id: string;
  lostItemId: string;
  foundItemId: string;
  matchPercentage: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
}

interface ConnectionWithItems extends Connection {
  lostItem: LostItem;
  foundItem: FoundItem;
  lostItemUser: User;
  foundItemUser: User;
}

interface ConnectionsProps {
  userId?: string; // Optional: to filter connections for a specific user
  itemId?: string; // Optional: to filter connections for a specific item
  type?: 'all' | 'pending' | 'accepted' | 'completed'; // Filter by connection status
}

export default function Connections({ userId, itemId, type = 'all' }: ConnectionsProps) {
  const [connections, setConnections] = useState<ConnectionWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'completed'>(type);

  useEffect(() => {
    fetchConnections();
  }, [userId, itemId, type]);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch lost items
      const lostItemsSnapshot = await getDocs(collection(db, 'lostItems'));
      const lostItems: LostItem[] = lostItemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<LostItem, 'id'>
      }));
      
      // Fetch found items
      const foundItemsSnapshot = await getDocs(collection(db, 'foundItems'));
      const foundItems: FoundItem[] = foundItemsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<FoundItem, 'id'>
      }));
      
      // Fetch existing connections from Firebase
      const connectionsSnapshot = await getDocs(collection(db, 'connections'));
      let existingConnections: ConnectionWithItems[] = [];
      
      if (!connectionsSnapshot.empty) {
        // If connections exist in Firebase, use them
        existingConnections = connectionsSnapshot.docs.map(doc => {
          const data = doc.data() as Omit<Connection, 'id'>;
          const lostItem = lostItems.find(item => item.id === data.lostItemId) || {
            id: data.lostItemId,
            title: 'Unknown Item',
            category: 'Unknown',
            location: 'Unknown',
            date: new Date().toISOString(),
            description: 'Item details not available',
            contactInfo: 'No contact info',
            status: 'pending' as const
          };
          
          const foundItem = foundItems.find(item => item.id === data.foundItemId) || {
            id: data.foundItemId,
            title: 'Unknown Item',
            category: 'Unknown',
            location: 'Unknown',
            date: new Date().toISOString(),
            description: 'Item details not available',
            contactInfo: 'No contact info',
            image: '/icons/misc.png',
            status: 'available' as const
          };
          
          // Create default user objects since we don't have actual user data
          const lostItemUser: User = {
            id: lostItem.userId || 'unknown',
            name: 'Item Owner',
            avatar: '/avatars/default.jpg'
          };
          
          const foundItemUser: User = {
            id: foundItem.userId || 'unknown',
            name: 'Item Finder',
            avatar: '/avatars/default.jpg'
          };
          
          return {
            id: doc.id,
            ...data,
            lostItem,
            foundItem,
            lostItemUser,
            foundItemUser
          };
        });
      } else {
        // If no connections exist, generate potential connections based on matching criteria
        existingConnections = generatePotentialConnections(lostItems, foundItems);
      }
      
      // Filter connections based on props
      let filteredConnections = existingConnections;
      
      if (userId) {
        filteredConnections = filteredConnections.filter(
          conn => conn.lostItem.userId === userId || conn.foundItem.userId === userId
        );
      }
      
      if (itemId) {
        filteredConnections = filteredConnections.filter(
          conn => conn.lostItemId === itemId || conn.foundItemId === itemId
        );
      }
      
      if (type !== 'all') {
        filteredConnections = filteredConnections.filter(conn => conn.status === type);
      }
      
      setConnections(filteredConnections);
    } catch (err) {
      console.error('Error fetching connections:', err);
      setError('Failed to load connections. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to generate potential connections based on matching criteria
// Function to generate potential connections based on matching criteria
const generatePotentialConnections = (lostItems: LostItem[], foundItems: FoundItem[]): ConnectionWithItems[] => {
  const potentialConnections: ConnectionWithItems[] = [];
  
  lostItems.forEach(lostItem => {
    // Only consider pending lost items
    if (lostItem.status !== 'pending') return;
    
    foundItems.forEach(foundItem => {
      // Only consider available found items
      if (foundItem.status !== 'available' && foundItem.status !== 'pending') return;
      
      // COMPULSORY: Check for title matching first
      const lostWords = lostItem.title.toLowerCase().split(' ').filter(word => word.length > 2); // Filter out short words like "a", "is", "the"
      const foundWords = foundItem.title.toLowerCase().split(' ').filter(word => word.length > 2);
      const commonWords = lostWords.filter(word => foundWords.includes(word));
      
      // If no common words in titles, skip this potential connection
      if (commonWords.length === 0) {
        return; // Skip to next found item
      }
      
      // Calculate match percentage based on various criteria
      let matchScore = 0;
      let totalCriteria = 0;
      
      // Match by category (high weight)
      if (lostItem.category.toLowerCase() === foundItem.category.toLowerCase()) {
        matchScore += 30;
      }
      totalCriteria += 30;
      
      // Match by title keywords (already verified above, now score it)
      const titleMatchRatio = commonWords.length / Math.max(lostWords.length, foundWords.length);
      matchScore += 30 * titleMatchRatio; // Give high weight to title matching
      totalCriteria += 30;
      
      // Match by location proximity
      if (lostItem.location.toLowerCase().includes(foundItem.location.toLowerCase()) || 
          foundItem.location.toLowerCase().includes(lostItem.location.toLowerCase())) {
        matchScore += 20;
      }
      totalCriteria += 20;
      
      // Match by date proximity
      const lostDate = new Date(lostItem.date);
      const foundDate = new Date(foundItem.date);
      const daysDifference = Math.abs((foundDate.getTime() - lostDate.getTime()) / (1000 * 3600 * 24));
      
      if (daysDifference <= 7) {
        matchScore += 20;
      } else if (daysDifference <= 14) {
        matchScore += 10;
      }
      totalCriteria += 20;
      
      // Calculate final percentage
      const matchPercentage = Math.round((matchScore / totalCriteria) * 100);
      
      // Since title matching is now compulsory, we can lower the threshold
      if (matchPercentage >= 40) {
        // Create default user objects since we don't have actual user data
        const lostItemUser: User = {
          id: lostItem.userId || 'unknown',
          name: 'Item Owner',
          avatar: '/avatars/default.jpg'
        };
        
        const foundItemUser: User = {
          id: foundItem.userId || 'unknown',
          name: 'Item Finder',
          avatar: '/avatars/default.jpg'
        };
        
        potentialConnections.push({
          id: `auto-${lostItem.id}-${foundItem.id}`,
          lostItemId: lostItem.id,
          foundItemId: foundItem.id,
          matchPercentage,
          status: 'pending',
          createdAt: new Date().toISOString(),
          lostItem,
          foundItem,
          lostItemUser,
          foundItemUser
        });
      }
    });
  });
  
  // Sort by match percentage (highest first)
  return potentialConnections.sort((a, b) => b.matchPercentage - a.matchPercentage);
};

  const filteredConnections = activeTab === 'all' 
    ? connections 
    : connections.filter(conn => conn.status === activeTab);

  const handleUpdateStatus = async (connectionId: string, newStatus: 'accepted' | 'rejected' | 'completed') => {
    try {
      // Check if this is an auto-generated connection or one from Firebase
      const isAutoGenerated = connectionId.startsWith('auto-');
      
      if (isAutoGenerated) {
        // For auto-generated connections, create a new document in Firebase
        const connection = connections.find(conn => conn.id === connectionId);
        
        if (!connection) {
          throw new Error('Connection not found');
        }
        
        const { id, lostItem, foundItem, lostItemUser, foundItemUser, ...connectionData } = connection;
        
        // Add the connection to Firebase
        const newConnectionRef = await addDoc(collection(db, 'connections'), {
          ...connectionData,
          status: newStatus,
          updatedAt: new Date().toISOString()
        });
        
        // Update local state with the new Firebase ID
        setConnections(prev => 
          prev.map(conn => 
            conn.id === connectionId 
              ? { ...conn, id: newConnectionRef.id, status: newStatus } 
              : conn
          )
        );
        
        // If accepted, update the status of both items
        if (newStatus === 'accepted') {
          // Update lost item status
          const lostItemRef = doc(db, 'lostItems', connection.lostItemId);
          await updateDoc(lostItemRef, { status: 'found' });
          
          // Update found item status
          const foundItemRef = doc(db, 'foundItems', connection.foundItemId);
          await updateDoc(foundItemRef, { status: 'claimed' });
        }
      } else {
        // For existing connections, update the document in Firebase
        const connectionRef = doc(db, 'connections', connectionId);
        await updateDoc(connectionRef, { 
          status: newStatus,
          updatedAt: new Date().toISOString()
        });
        
        // If accepted, update the status of both items
        if (newStatus === 'accepted') {
          const connection = connections.find(conn => conn.id === connectionId);
          
          if (connection) {
            // Update lost item status
            const lostItemRef = doc(db, 'lostItems', connection.lostItemId);
            await updateDoc(lostItemRef, { status: 'found' });
            
            // Update found item status
            const foundItemRef = doc(db, 'foundItems', connection.foundItemId);
            await updateDoc(foundItemRef, { status: 'claimed' });
          }
        }
        
        // Update local state
        setConnections(prev => 
          prev.map(conn => 
            conn.id === connectionId 
              ? { ...conn, status: newStatus } 
              : conn
          )
        );
      }
      
      toast.success(`Connection ${newStatus} successfully!`);
    } catch (err) {
      console.error('Error updating connection status:', err);
      toast.error('Failed to update connection status. Please try again.');
      setError('Failed to update connection status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6c2704]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-gray-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900">No connections found</h3>
        <p className="mt-2 text-sm text-gray-500">
          There are currently no connections between lost and found items.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Toaster position="top-center" />
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-[#6c2704] text-[#6c2704]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Connections
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'pending'
                ? 'border-[#6c2704] text-[#6c2704]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab('accepted')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'accepted'
                ? 'border-[#6c2704] text-[#6c2704]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Accepted
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
              activeTab === 'completed'
                ? 'border-[#6c2704] text-[#6c2704]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Completed
          </button>
        </nav>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredConnections.map(connection => (
          <div key={connection.id} className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Lost Item */}
              <div className="flex-1 bg-red-50 p-4 rounded-lg border border-red-100">
                <div className="flex items-center mb-3">
                  <div className="bg-red-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-red-800">Lost Item</h3>
                </div>
                
                <div className="flex items-start mb-4">
                  {connection.lostItem.image ? (
                    <div className="w-20 h-20 mr-4 flex-shrink-0 rounded-md overflow-hidden">
                      <Image 
                        src={connection.lostItem.image} 
                        alt={connection.lostItem.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 mr-4 flex-shrink-0 bg-red-200 rounded-md flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium">{connection.lostItem.title}</h4>
                    <p className="text-sm text-gray-600">{connection.lostItem.category}</p>
                    <p className="text-sm text-gray-600">Lost on: {new Date(connection.lostItem.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Location: {connection.lostItem.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 mr-2 rounded-full overflow-hidden">
                    <Image 
                      src={connection.lostItemUser.avatar || '/avatars/default.jpg'} 
                      alt={connection.lostItemUser.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{connection.lostItemUser.name}</p>
                    <p className="text-xs text-gray-500">Reported by</p>
                  </div>
                </div>
              </div>
              
              {/* Connection Info */}
              <div className="flex flex-col items-center justify-center px-4">
                <div className="bg-[#6c2704] text-white rounded-full py-1 px-3 text-sm font-medium mb-2">
                  {connection.matchPercentage}% Match
                </div>
                <div className="w-16 h-0.5 bg-gray-300 my-2"></div>
                <div className="text-xs text-gray-500 mb-2">
                  {new Date(connection.createdAt).toLocaleDateString()}
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                  connection.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  connection.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  connection.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                </div>
              </div>
              
              {/* Found Item */}
              <div className="flex-1 bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center mb-3">
                  <div className="bg-green-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-green-800">Found Item</h3>
                </div>
                
                <div className="flex items-start mb-4">
                  {connection.foundItem.image ? (
                    <div className="w-20 h-20 mr-4 flex-shrink-0 rounded-md overflow-hidden">
                      <Image 
                        src={connection.foundItem.image} 
                        alt={connection.foundItem.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 mr-4 flex-shrink-0 bg-green-200 rounded-md flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium">{connection.foundItem.title}</h4>
                    <p className="text-sm text-gray-600">{connection.foundItem.category}</p>
                    <p className="text-sm text-gray-600">Found on: {new Date(connection.foundItem.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Location: {connection.foundItem.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 mr-2 rounded-full overflow-hidden">
                    <Image 
                      src={connection.foundItemUser.avatar || '/avatars/default.jpg'} 
                      alt={connection.foundItemUser.name}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{connection.foundItemUser.name}</p>
                    <p className="text-xs text-gray-500">Found by</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            {connection.status === 'pending' && (
              <div className="mt-4 flex justify-end space-x-3">
                <button 
                  onClick={() => handleUpdateStatus(connection.id, 'rejected')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleUpdateStatus(connection.id, 'accepted')}
                  className="px-4 py-2 bg-[#6c2704] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#32230f]"
                >
                  Accept
                </button>
              </div>
            )}
            
            {connection.status === 'accepted' && (
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => handleUpdateStatus(connection.id, 'completed')}
                  className="px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700"
                >
                  Mark as Completed
                </button>
              </div>
            )}
            
            {connection.status === 'completed' && (
              <div className="mt-4 flex justify-end">
                <Link 
                  href={`/connections/${connection.id}`}
                  className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  View Details
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}