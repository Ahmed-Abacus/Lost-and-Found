"use client";
import { useState } from "react";
import Navbar from '@/components/Navbar';
import Image from "next/image";
import Footer from '@/components/Footer';
import { db } from '@/firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { toast, Toaster } from 'react-hot-toast';

// Cloudinary upload function
const uploadToCloudinary = async (file: File): Promise<string> => {
  // Check environment variables
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  
  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary environment variables are not set');
  }
  
  // Validate file
  if (!file) {
    throw new Error('No file provided');
  }
  
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 10MB.');
  }
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload JPG, PNG, or WebP images.');
  }

  // Create form data
  const uploadFormData = new FormData();
  uploadFormData.append('file', file);
  uploadFormData.append('upload_preset', uploadPreset);
  
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: uploadFormData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${data.error?.message || response.status}`);
    }
    
    return data.secure_url || '';
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Categories
const categories = [
  { id: "Wallet", name: "Wallet, credit card & money", icon: "/icons/wallet.png" },
  { id: "Identity", name: "Identity document", icon: "/icons/identity.webp" },
  { id: "Bags", name: "Bags & suitcase", icon: "/icons/bags.png" },
  { id: "Electronics", name: "Electronics", icon: "/icons/electronics.png" },
  { id: "Jewelry", name: "Jewelry and watch", icon: "/icons/jwelry.png" },
  { id: "Clothes", name: "Clothes and accessories", icon: "/icons/clothes.jpg" },
  { id: "Miscellaneous", name: "Miscellaneous", icon: "/icons/misc.png" },
  { id: "Personal", name: "Personal belongings ", icon: "/icons/personals.webp" },
  { id: "Sports", name: "Sport accessories", icon: "/icons/sports.avif" },
  { id: "TwoWheels", name: "Two wheels", icon: "/icons/wheels.png" },
];

// Popular locations for suggestions
const popularLocations = [
  "Main Library", "Student Center", "Science Building", "Cafeteria", 
  "Gymnasium", "Administration Building", "Parking Lot A", "Dormitory Block B", 
  "Computer Lab", "University Park", "fountain ground"
];

export default function RegisterFoundItem() {
  // Form state
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [locationFound, setLocationFound] = useState("");
  const [dateFound, setDateFound] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [itemPhoto, setItemPhoto] = useState<File | null>(null);
  
  // UI state
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Validation state
  const [categoryError, setCategoryError] = useState("");
  const [dateError, setDateError] = useState("");
  const [contactError, setContactError] = useState("");

  // Validation functions
  const validateContact = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{11}$/;
    
    if (!emailRegex.test(value) && !phoneRegex.test(value)) {
      setContactError("Please enter a valid email or 11-digit phone number");
      return false;
    }
    setContactError("");
    return true;
  };

  const validateDate = (value: string): boolean => {
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      setDateError("Date cannot be in the future");
      return false;
    }
    setDateError("");
    return true;
  };

  // Handle location input and suggestions
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationFound(value);
    
    if (value.length > 2) {
      const filteredLocations = popularLocations.filter(loc => 
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filteredLocations);
      setShowSuggestions(filteredLocations.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectLocation = (location: string) => {
    setLocationFound(location);
    setShowSuggestions(false);
  };

  // Image handling
  const handleRemoveImage = () => {
    setItemPhoto(null);
    setImagePreview(null);
    
    const fileInput = document.getElementById('itemPhoto') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setItemPhoto(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!itemCategory) {
      setCategoryError("Please select a category");
      return;
    }

    if (!validateContact(contactInfo) || !validateDate(dateFound)) {
      return;
    }

    try {
      let imageUrl = '';
      
      // Upload image if provided
      if (itemPhoto) {
        setUploadingImage(true);
        toast.loading('Uploading image...');
        
        try {
          imageUrl = await uploadToCloudinary(itemPhoto);
          toast.dismiss();
          toast.success('Image uploaded successfully!');
        } catch (error) {
          toast.dismiss();
          toast.error('Failed to upload image. Please try again.');
          setUploadingImage(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      // Prepare data for Firebase
      const foundItemData = {
        title: itemName,
        description: itemDescription,
        location: locationFound,
        category: itemCategory,
        date: dateFound,
        contactInfo,
        image: imageUrl,
        status: 'pending',
        createdAt: new Date().toISOString(),
        type: 'found'
      };

      // Add to Firebase
      await addDoc(collection(db, 'foundItems'), foundItemData);
      toast.success('Found item registered successfully!');

      // Clear form
      setItemName("");
      setItemDescription("");
      setItemCategory("");
      setLocationFound("");
      setDateFound("");
      setContactInfo("");
      setItemPhoto(null);
      setImagePreview(null);
      
      // Reset file input
      const fileInput = document.getElementById('itemPhoto') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error registering found item:', error);
      toast.error('Error registering found item. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-amber-100 text-gray-800">
      <Navbar currentPage="home" />
      <Toaster position="top-center" />
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-[rgba(255,248,240,0.7)] to-[rgba(188,170,164,0.4)] backdrop-blur-sm p-10 rounded-2xl shadow-xl space-y-8 border border-[rgba(74,85,104,0.2)]">
          <h1 className="text-3xl font-semibold text-center bg-gradient-to-r from-black to-[#6c2704] bg-clip-text text-transparent">
            Report a Found Item
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image Upload */}
            <div className="mb-6">
              <label htmlFor="itemPhoto" className="block text-sm font-medium mb-1 text-[#32230f]">
                Item Photo
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    id="itemPhoto"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                    accept="image/*"
                  />
                </div>
                
                {imagePreview && (
                  <div className="flex-1 flex flex-col items-center">
                    <div className="relative w-32 h-32 mb-2">
                      <Image 
                        src={imagePreview} 
                        alt="Item preview" 
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Item Name */}
            <div>
              <label htmlFor="itemName" className="block text-sm font-medium mb-1 text-[#32230f]">Item Name</label>
              <input
                type="text"
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                required
              />
            </div>

            {/* Item Description */}
            <div>
              <label htmlFor="itemDescription" className="block text-sm font-medium mb-1 text-[#32230f]">Item Description</label>
              <textarea
                id="itemDescription"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                required
              />
            </div>

            {/* Location Found */}
            <div className="relative">
              <label htmlFor="locationFound" className="block text-sm font-medium mb-1 text-[#32230f]">Location Found</label>
              <input
                type="text"
                id="locationFound"
                value={locationFound}
                onChange={handleLocationChange}
                className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                required
              />
              {showSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {locationSuggestions.map((location, index) => (
                    <div 
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectLocation(location)}
                    >
                      {location}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Item Category */}
            <div>
              <label htmlFor="itemCategory" className="block text-sm font-medium mb-1 text-[#32230f]">Select a category *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setItemCategory(category.id);
                      setCategoryError("");
                    }}
                    className={`p-4 border rounded-lg flex flex-col items-center ${
                      itemCategory === category.id ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
                    } hover:border-[#6c2704] transition-colors`}
                  >
                    <Image src={category.icon} alt={category.name} width={48} height={48} className="mb-2" />
                    <span className="text-sm text-center">{category.name}</span>
                  </button>
                ))}
              </div>
              {categoryError && (
                <p className="text-red-500 text-sm mt-2">{categoryError}</p>
              )}
            </div>

            {/* Date Found */}
            <div>
              <label htmlFor="dateFound" className="block text-sm font-medium mb-1 text-[#32230f]">Date Found</label>
              <input
                type="date"
                id="dateFound"
                value={dateFound}
                onChange={(e) => {
                  setDateFound(e.target.value);
                  validateDate(e.target.value);
                }}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                required
              />
              {dateError && (
                <p className="text-red-500 text-sm mt-1">{dateError}</p>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <label htmlFor="contactInfo" className="block text-sm font-medium mb-1 text-[#32230f]">Contact Info (Phone/Email)</label>
              <input
                type="text"
                id="contactInfo"
                value={contactInfo}
                onChange={(e) => {
                  setContactInfo(e.target.value);
                  validateContact(e.target.value);
                }}
                placeholder="Enter 11-digit phone number or valid email"
                className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                required
              />
              {contactError && (
                <p className="text-red-500 text-sm mt-1">{contactError}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={uploadingImage}
                className={`px-6 py-3 bg-gradient-to-r from-black to-[#6c2704] text-white font-semibold rounded-lg shadow-md hover:scale-105 transition duration-300 ${
                  uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploadingImage ? 'Uploading...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
}