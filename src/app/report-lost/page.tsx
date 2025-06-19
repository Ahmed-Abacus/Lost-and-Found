"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useItems } from "@/context/ItemContext";
import { db } from '@/firebase/config'; // Remove storage import
import { collection, addDoc } from 'firebase/firestore';
// Remove Firebase Storage imports
import { toast, Toaster } from 'react-hot-toast';

// Add Cloudinary upload function
// Fixed Cloudinary upload function - no variable conflicts
// Debug version to see what's happening
const uploadToCloudinary = async (file: File): Promise<string> => {
  // Check environment variables
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  
  if (!cloudName) {
    throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set');
  }
  
  if (!uploadPreset) {
    throw new Error('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not set');
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
  
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  
  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: uploadFormData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (data.error) {
        throw new Error(`Cloudinary Error: ${data.error.message || JSON.stringify(data.error)}`);
      }
      throw new Error(`Upload failed with status ${response.status}`);
    }
    
    if (!data.secure_url) {
      throw new Error('Upload successful but no URL returned');
    }
    
    return data.secure_url;
    
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
  }
};

interface LostItem {
  id: number;
  item: string;
  description: string;
  location: string;
  category: string;
  dateLost: string;
  contactInfo: string;
  photo?: File | null;
  offerReward?: boolean;
  rewardAmount?: string;
  rewardCurrency?: string;
}

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

// Add subcategories for Wallet
const walletSubcategories = [
  { id: "Wallet_Regular", name: "Wallet", icon: "/icons/wallet.png" },
  { id: "Credit_Card", name: "Credit card", icon: "/icons/credit-card.png" },
  { id: "Cash", name: "Cash/Money", icon: "/icons/cash.png" },
  { id: "Card_Holder", name: "Card holder", icon: "/icons/cardholder.png" },
];

// Add subcategories for Identity documents
const identitySubcategories = [
  { id: "ID_Card", name: "ID Card", icon: "/icons/idcard.png" },
  { id: "Student_Card", name: "Student card", icon: "/icons/std-card.png" },
  { id: "Driving_License", name: "Driving license", icon: "/icons/driver-lisence.png" },
  { id: "Passport", name: "Passport", icon: "/icons/passport.png" },
];

const bagsSubcategories = [
  { id: "Backpack", name: "Backpack", icon: "/icons/backpack.png" },
  { id: "Handbag", name: "Handbag", icon: "/icons/handbag.png" },
];

// Add subcategories for Electronics
const electronicsSubcategories = [
  { id: "Phone", name: "Phone", icon: "/icons/mobile.png" },
  { id: "Charger", name: "Charger", icon: "/icons/charger.png" },
  { id: "Headphones", name: "Headphones/Earbuds", icon: "/icons/handfree.png" },
  { id: "Laptop", name: "Laptop", icon: "/icons/laptop.png" },
];

const jewelrySubcategories = [
{ id: "Ring", name: "Ring", icon: "/icons/ring.png" },
  { id: "Necklace", name: "Necklace", icon: "/icons/necklace.png" },
  { id: "Bracelet", name: "Bracelet", icon: "/icons/bracelet.avif" },
  { id: "Earrings", name: "Earrings", icon: "/icons/earings.png" },
  { id: "Watch", name: "Watch", icon: "/icons/watchh.png" },
  { id: "Other", name: "Other Jewelry", icon: "/icons/otherjwel.png" },
];

const miscellaneousSubcategories = [
  { id: "Keys", name: "miscellaneous", icon: "/icons/misc.png" },
];

const personalSubcategories = [
  { id: "Glasses", name: "belongings", icon: "/icons/keyss.png" },
];

const sportsSubcategories = [
  { id: "Ball", name: "sports", icon: "/icons/sports.avif" },
];

const twoWheelsSubcategories = [
  { id: "Bicycle", name: "vehicles", icon: "/icons/car.png" },
];

const clothesSubcategories = [
  { id: "ClothesGeneral", name: "Clothes", icon: "/icons/clothes.jpg" },
];

export default function ReportAndListPage() {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemSubcategory, setItemSubcategory] = useState("");
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  
  // Add new state variables for wallet-specific fields
  const [itemBrand, setItemBrand] = useState("");
  const [noBrand, setNoBrand] = useState(false);
  const [itemModel, setItemModel] = useState("");
  const [itemColor, setItemColor] = useState("");
  const [hasAddress, setHasAddress] = useState("No");
  const [hasCash, setHasCash] = useState("No");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  // Add missing state variables for credit card
  const [cardType, setCardType] = useState("");
  const [bankName, setBankName] = useState("");
  const [cardDetail, setCardDetail] = useState("");
  
  // Add state variables for cash
  const [cashAmount, setCashAmount] = useState("");
  const [cashCurrency, setCashCurrency] = useState("");
  const [cashContainer, setCashContainer] = useState("");
  const [cashDetail, setCashDetail] = useState("");
  
  // Add state variables for card holder
  const [holderMaterial, setHolderMaterial] = useState("");
  const [cardsInside, setCardsInside] = useState("No");
  const [holderDetail, setHolderDetail] = useState("");
  
  // Add state variables for ID Card
  const [idCardNumber, setIdCardNumber] = useState("");
  const [idCardIssuer, setIdCardIssuer] = useState("");
  const [idCardExpiry, setIdCardExpiry] = useState("");

  // Add state variables for Student Card
  const [studentId, setStudentId] = useState("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");

  // Add state variables for Driving License
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseCountry, setLicenseCountry] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");

  // Add state variables for Passport
  const [passportNumber, setPassportNumber] = useState("");
  const [passportCountry, setPassportCountry] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");
  
  const [locationLastSeen, setLocationLastSeen] = useState("");
  const [dateLost, setDateLost] = useState("");
  const [dateError, setDateError] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [contactError, setContactError] = useState("");
  const [itemPhoto, setItemPhoto] = useState<File | null>(null);
  const [lostItems, setLostItems] = useState<LostItem[]>([]);

  // for bags 
  const [bagBrand, setBagBrand] = useState("");
  const [bagColor, setBagColor] = useState("");
  const [bagContents, setBagContents] = useState("");
  const [bagSize, setBagSize] = useState("");
  const [bagMaterial, setBagMaterial] = useState("");
  
  // Add these state variables with the other useState declarations
  const [backpackSize, setBackpackSize] = useState("");
  const [backpackMaterial, setBackpackMaterial] = useState("");
  const [laptopModel, setLaptopModel] = useState("");
  const [laptopBrand, setLaptopBrand] = useState("");
  const [laptopCharger, setLaptopCharger] = useState("No");
  const [backpackContents, setBackpackContents] = useState("");
  
  const [handbagSize, setHandbagSize] = useState("");
  const [handbagMaterial, setHandbagMaterial] = useState("");
  const [handbagContents, setHandbagContents] = useState("");
  const [hasCharger, setHasCharger] = useState("No");

  const [phoneModel, setPhoneModel] = useState("");
  const [phoneBrand, setPhoneBrand] = useState("");
  const [phoneColor, setPhoneColor] = useState("");
  const [phoneCase, setPhoneCase] = useState("No");
  const [phoneIMEI, setPhoneIMEI] = useState("");
  const [phonePassword, setPhonePassword] = useState("");
  
  // Charger specific state
  const [chargerType, setChargerType] = useState("");
  const [chargerBrand, setChargerBrand] = useState("");
  const [chargerColor, setChargerColor] = useState("");
  
  // Headphones specific state
  const [headphonesType, setHeadphonesType] = useState("");
  const [headphonesBrand, setHeadphonesBrand] = useState("");
  const [headphonesColor, setHeadphonesColor] = useState("");
  const [headphonesWireless, setHeadphonesWireless] = useState("No");
  const [headphonesCase, setHeadphonesCase] = useState("No");

  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleRegistration, setVehicleRegistration] = useState("");
  const [itemSerialNumber, setItemSerialNumber] = useState("");

  const [chargerWattage, setChargerWattage] = useState("");
  const [chargerCable, setChargerCable] = useState("No");

  const [jewelryMaterial, setJewelryMaterial] = useState("");
  const [jewelryColor, setJewelryColor] = useState("");
  const [jewelryStone, setJewelryStone] = useState("No");
  const [jewelryBrand, setJewelryBrand] = useState("");
  const [watchBrand, setWatchBrand] = useState("");
  const [watchType, setWatchType] = useState("");
  const [watchStrap, setWatchStrap] = useState("");

  const [clothesType, setClothesType] = useState("");
  const [clothesSize, setClothesSize] = useState("");
  const [clothesColor, setClothesColor] = useState("");
  const [clothesBrand, setClothesBrand] = useState("");
  const [clothesMaterial, setClothesMaterial] = useState("");

  const [personalItemType, setPersonalItemType] = useState("");
  const [itemMaterial, setItemMaterial] = useState("");
  const [hasCase, setHasCase] = useState("No");
  const [itemValue, setItemValue] = useState("");

  const [ballType, setBallType] = useState("");
  const [ballBrand, setBallBrand] = useState("");
  const [ballColor, setBallColor] = useState("");
  const [ballSize, setBallSize] = useState("");

  const [bicycleType, setBicycleType] = useState("");
  const [bicycleBrand, setBicycleBrand] = useState("");
  const [bicycleColor, setBicycleColor] = useState("");
  const [bicycleSize, setBicycleSize] = useState("");
  const [bicycleLock, setBicycleLock] = useState("No");

  const [offerReward, setOfferReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState("");
  const [rewardCurrency, setRewardCurrency] = useState("PKR");

  // Add loading state for image upload
  const [uploadingImage, setUploadingImage] = useState(false);

  // Add this function to handle category selection
  const handleCategorySelect = (categoryId: string) => {
    setItemCategory(categoryId);
    setCategoryError("");
    setItemSubcategory(""); 
    // Show subcategories for all categories except Clothes
    if (categoryId === "Wallet" || categoryId === "Identity" || categoryId === "Bags" || 
        categoryId === "Electronics" || categoryId === "Jewelry" || categoryId === "Miscellaneous" || 
        categoryId === "Personal" || categoryId === "Sports" || categoryId === "TwoWheels" || categoryId === "Clothes"  ) {
      setShowSubcategories(true);
    } else {
      setShowSubcategories(false);
    }
  };

  const validateContact = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{11}$/;
    
    if (!emailRegex.test(value) && !phoneRegex.test(value)) {
      setContactError("Please enter a valid email (with @) or 11-digit phone number");
      return false;
    }
    setContactError("");
    return true;
  };

  const validateDate = (value: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemCategory) {
      setCategoryError("Please select a category");
      return;
    }

    // For Wallet category, require subcategory selection
    if ((itemCategory === "Wallet" || itemCategory === "Identity" || itemCategory === "Bags" || 
      itemCategory === "Electronics" || itemCategory === "Jewelry" || itemCategory === "Sports" || 
      itemCategory === "TwoWheels") && !itemSubcategory) {
      setCategoryError("Please select a subcategory");
      return;
    }

    if (!validateContact(contactInfo)) {
      return;
    }

    if (!validateDate(dateLost)) {
      return;
    }

    try {
      let imageUrl = '';
      
      // Upload image to Cloudinary if one is selected
      if (itemPhoto) {
        setUploadingImage(true);
        toast.loading('Uploading image...');
        
        try {
          imageUrl = await uploadToCloudinary(itemPhoto);
          toast.dismiss(); // Remove loading toast
          toast.success('Image uploaded successfully!');
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast.dismiss(); // Remove loading toast
          toast.error('Failed to upload image. Please try again.');
          setUploadingImage(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      const lostItemData = {
        title: itemName,
        description: itemDescription,
        location: locationLastSeen,
        category: itemCategory,
        subcategory: itemSubcategory || null,
        date: dateLost,
        contactInfo,
        image: imageUrl, // This will now be the Cloudinary URL
        status: 'pending',
        createdAt: new Date().toISOString(),
        // Wallet specific fields
        ...(itemCategory === 'Wallet' && {
          itemBrand,
          noBrand,
          itemModel,
          itemColor,
          hasAddress,
          hasCash,
          firstName,
          lastName
        }),
        // Credit card specific fields
        ...(itemSubcategory === 'Credit_Card' && {
          cardType,
          bankName,
          cardDetail
        }),
        // Cash specific fields
        ...(itemSubcategory === 'Cash' && {
          cashAmount,
          cashCurrency,
          cashContainer,
          cashDetail
        }),
        // Card holder specific fields
        ...(itemSubcategory === 'Card_Holder' && {
          holderMaterial,
          cardsInside,
          holderDetail
        }),
        // ID Card specific fields
        ...(itemSubcategory === 'ID_Card' && {
          idCardNumber,
          idCardIssuer,
          idCardExpiry
        }),
        // Student Card specific fields
        ...(itemSubcategory === 'Student_Card' && {
          studentId,
          university,
          department
        }),
        // Driving License specific fields
        ...(itemSubcategory === 'Driving_License' && {
          licenseNumber,
          licenseCountry,
          licenseExpiry
        }),
        // Passport specific fields
        ...(itemSubcategory === 'Passport' && {
          passportNumber,
          passportCountry,
          passportExpiry
        }),
        // Bags specific fields
        ...(itemCategory === 'Bags' && {
          bagBrand,
          bagColor,
          bagContents,
          bagSize,
          bagMaterial
        }),
        // Electronics specific fields
        ...(itemCategory === 'Electronics' && {
          ...(itemSubcategory === 'Phone' && {
            phoneModel,
            phoneBrand,
            phoneColor,
            phoneCase,
            phoneIMEI,
            phonePassword
          }),
          ...(itemSubcategory === 'Laptop' && {
            laptopModel,
            laptopBrand,
            laptopCharger
          })
        }),
        // Reward information
        offerReward,
        ...(offerReward && {
          rewardAmount,
          rewardCurrency
        })
      };

      const docRef = await addDoc(collection(db, 'lostItems'), lostItemData);

      if (!docRef.id) {
        throw new Error('Failed to create document');
      } 

      const newItem: LostItem = {
        id: lostItems.length + 1,
        item: itemName,
        description: itemDescription,
        location: locationLastSeen,
        category: itemCategory === "Wallet" && itemSubcategory ? itemSubcategory : itemCategory,
        dateLost,
        contactInfo,
        photo: itemPhoto,
        offerReward: offerReward,
        rewardAmount: offerReward ? rewardAmount : undefined,
        rewardCurrency: offerReward ? rewardCurrency : undefined,
        ...(itemCategory === "Clothes" && {
          clothesType,
          clothesSize,
          clothesColor,
          clothesBrand,
          clothesMaterial
        }),
      };
    
      setLostItems([newItem, ...lostItems]);
      setCategoryError("");
      setContactError("");
      setDateError("");
      toast.success('Lost item reported successfully!');

      // Clear the form
      setItemName("");
      setItemDescription("");
      setItemCategory("");
      setItemSubcategory("");
      setLocationLastSeen("");
      setDateLost("");
      setContactInfo("");
      setItemPhoto(null);

      // Clear wallet fields
      setItemBrand("");
      setNoBrand(false);
      setItemModel("");
      setItemColor("");
      setHasAddress("No");
      setHasCash("No");
      setFirstName("");
      setLastName("");

      // Clear credit card fields
      setCardType("");
      setBankName("");
      setCardDetail("");

      // Clear cash fields
      setCashAmount("");
      setCashCurrency("");
      setCashContainer("");
      setCashDetail("");

      // Clear card holder fields
      setHolderMaterial("");
      setCardsInside("No");
      setHolderDetail("");

      // Clear document fields
      setIdCardNumber("");
      setIdCardIssuer("");
      setIdCardExpiry("");
      setStudentId("");
      setUniversity("");
      setDepartment("");
      setLicenseNumber("");
      setLicenseCountry("");
      setLicenseExpiry("");
      setPassportNumber("");
      setPassportCountry("");
      setPassportExpiry("");

      // Clear bag fields
      setBagBrand("");
      setBagColor("");
      setBagContents("");
      setBagSize("");
      setBagMaterial("");
      setLaptopModel("");
      setLaptopBrand("");
      setHasCharger("No");

      setOfferReward(false);
      setRewardAmount("");
      setRewardCurrency("PKR");

    } catch (error) {
      console.error('Error reporting lost item:', error);
      toast.error('Error reporting lost item. Please try again.');
    }
  };

  // Rest of your component JSX goes here...
  // (I've only shown the critical changes - your JSX remains the same)

  // Phone specific state

    const { foundItems } = useItems();

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-amber-100 text-gray-800">
         <Navbar currentPage="home" />
         <Toaster position="top-center" />
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-[rgba(255,248,240,0.7)] to-[rgba(188,170,164,0.4)] backdrop-blur-sm p-10 rounded-2xl shadow-xl space-y-8 border border-[rgba(74,85,104,0.2)]">
            <h1 className="text-3xl font-semibold text-center bg-gradient-to-r from-black to-[#6c2704] bg-clip-text text-transparent">
              Report a Lost Item
            </h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="itemName" className="block text-sm font-medium mb-1 text-[#32230f]"> Name : </label>
                <input
                  type="text"
                  id="itemName"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                  required
                />
              </div>
  
              <div>
                <label htmlFor="itemCategory" className="block text-sm font-medium mb-1 text-[#32230f]">Select a category *</label>
                
                {!showSubcategories ? (
                  // Show main categories only when subcategories are not shown
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleCategorySelect(category.id)}
                        className={`p-4 border rounded-lg flex flex-col items-center ${
                          itemCategory === category.id ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
                        } hover:border-[#6c2704] transition-colors`}
                      >
                        <Image
                          src={category.icon}
                          alt={category.name}
                          width={48}
                          height={48}
                          className="mb-2"
                        />
                        <span className="text-sm text-center">{category.name}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  // Show subcategories with a back button
                  <div>
                    <div className="flex items-center mb-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowSubcategories(false);
                          setItemCategory("");
                          setItemSubcategory("");
                        }}
                        className="flex items-center text-[#6c2704] hover:text-black transition mr-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to categories
                      </button>


                      <span className="text-sm font-medium text-[#32230f]">
                        {itemCategory === "Wallet" 
                          ? "Wallet subcategories" 
                          : itemCategory === "Identity" 
                            ? "Identity document subcategories" 
                            : itemCategory === "Bags"
                              ? "Bag subcategories"
                              : "Electronics subcategories"}
                      </span>
                      
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {itemCategory === "Wallet" ? (
                        walletSubcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            type="button"
                            onClick={() => {
                              setItemSubcategory(subcategory.id);
                              setCategoryError("");
                            }}
                            className={`p-4 border rounded-lg flex flex-col items-center ${
                              itemSubcategory === subcategory.id ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
                            } hover:border-[#6c2704] transition-colors`}
                          >
                            <Image
                              src={subcategory.icon}
                              alt={subcategory.name}
                              width={48}
                              height={48}
                              className="mb-2"
                            />
                            <span className="text-sm text-center">{subcategory.name}</span>
                          </button>
                        ))
                      ) : itemCategory === "Identity" ? (
                        identitySubcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            type="button"
                            onClick={() => {
                              setItemSubcategory(subcategory.id);
                              setCategoryError("");
                            }}
                            className={`p-4 border rounded-lg flex flex-col items-center ${
                              itemSubcategory === subcategory.id ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
                            } hover:border-[#6c2704] transition-colors`}
                          >
                            <Image
                              src={subcategory.icon}
                              alt={subcategory.name}
                              width={48}
                              height={48}
                              className="mb-2"
                            />
                            <span className="text-sm text-center">{subcategory.name}</span>
                          </button>
                        ))
                      ) : itemCategory === "Bags" ? (
                        bagsSubcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            type="button"
                            onClick={() => {
                              setItemSubcategory(subcategory.id);
                              setCategoryError("");
                            }}
                            className={`p-4 border rounded-lg flex flex-col items-center ${
                              itemSubcategory === subcategory.id ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
                            } hover:border-[#6c2704] transition-colors`}
                          >
                            <Image
                              src={subcategory.icon}
                              alt={subcategory.name}
                              width={48}
                              height={48}
                              className="mb-2"
                            />
                            <span className="text-sm text-center">{subcategory.name}</span>
                          </button>
                        ))
                      ) : itemCategory === "Personal" ? (
                        personalSubcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            type="button"
                            onClick={() => {
                              setItemSubcategory(subcategory.id);
                              setCategoryError("");
                            }}
                            className={`p-4 border rounded-lg flex flex-col items-center ${
                              itemSubcategory === subcategory.id ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
                            } hover:border-[#6c2704] transition-colors`}
                          >
                            <Image
                              src={subcategory.icon}
                              alt={subcategory.name}
                              width={48}
                              height={48}
                              className="mb-2"
                            />
                            <span className="text-sm text-center">{subcategory.name}</span>
                          </button>
                        ))
                      ) : itemCategory === "Sports" ? (
    sportsSubcategories.map((subcategory) => (
      <button
        key={subcategory.id}
        type="button"
        onClick={() => {
          setItemSubcategory(subcategory.id);
          setCategoryError("");
        }}
        className={`p-4 border rounded-lg flex flex-col items-center ${
          itemSubcategory === subcategory.id ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
        } hover:border-[#6c2704] transition-colors`}
      >
        <Image
          src={subcategory.icon}
          alt={subcategory.name}
          width={48}
          height={48}
          className="mb-2"
        />
        <span className="text-sm text-center">{subcategory.name}</span>
      </button>
    ))
  ) : itemCategory === "Miscellaneous" ? (
    miscellaneousSubcategories.map((subcategory) => (
      <button
        key={subcategory.id}
        type="button"
        onClick={() => {
          setItemSubcategory(subcategory.id);
          setCategoryError("");
        }}
        className={`p-4 border rounded-lg flex flex-col items-center ${
          itemSubcategory === subcategory.id ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
        } hover:border-[#6c2704] transition-colors`}
      >
        <Image
          src={subcategory.icon}
          alt={subcategory.name}
          width={48}
          height={48}
          className="mb-2"
        />
        <span className="text-sm text-center">{subcategory.name}</span>
      </button>
    ))
  )  : itemCategory === "Clothes" ? (
    clothesSubcategories.map((subcategory) => (
      <button
        key={subcategory.id}
        type="button"
        onClick={() => {
          setItemSubcategory(subcategory.id);
          setCategoryError("");
        }}
        className={`p-4 border rounded-lg flex flex-col items-center ${
          itemSubcategory === subcategory.id ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
        } hover:border-[#6c2704] transition-colors`}
      >
        <Image
          src={subcategory.icon}
          alt={subcategory.name}
          width={48}
          height={48}
          className="mb-2"
        />
        <span className="text-sm text-center">{subcategory.name}</span>
      </button>
    ))) : itemCategory === "TwoWheels" ? (
      twoWheelsSubcategories.map((subcategory) => (
        <button
          key={subcategory.id}
          type="button"
          onClick={() => {
            setItemSubcategory(subcategory.id);
            setCategoryError("");
          }}
          className={`p-4 border rounded-lg flex flex-col items-center ${
            itemSubcategory === subcategory.id ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
          } hover:border-[#6c2704] transition-colors`}
        >
          <Image
            src={subcategory.icon}
            alt={subcategory.name}
            width={48}
            height={48}
            className="mb-2"
          />
          <span className="text-sm text-center">{subcategory.name}</span>
        </button>
      ))
  ) : itemCategory === "Jewelry" ? (
        jewelrySubcategories.map((subcategory) => (
          <button
            key={subcategory.id}
            type="button"
            onClick={() => {
              setItemSubcategory(subcategory.id);
              setCategoryError("");
            }}
            className={`p-4 border rounded-lg flex flex-col items-center ${
              itemSubcategory === subcategory.id ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
            } hover:border-[#6c2704] transition-colors`}
          >
            <Image
              src={subcategory.icon}
              alt={subcategory.name}
              width={48}
              height={48}
              className="mb-2"
            />
            <span className="text-sm text-center">{subcategory.name}</span>
          </button>
        ))
      ) : (
                        electronicsSubcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            type="button"
                            onClick={() => {
                              setItemSubcategory(subcategory.id);
                              setCategoryError("");
                            }}
                            className={`p-4 border rounded-lg flex flex-col items-center ${
                              itemSubcategory === subcategory.id ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
                            } hover:border-[#6c2704] transition-colors`}
                          >
                            <Image
                              src={subcategory.icon}
                              alt={subcategory.name}
                              width={48}
                              height={48}
                              className="mb-2"
                            />
                            <span className="text-sm text-center">{subcategory.name}</span>
                          </button>
                        ))
                      )
                      }
                    </div>
                  </div>
                )}
                 {categoryError && (
                  <p className="text-red-500 text-sm mt-2">{categoryError}</p>
                )}
              </div>
  
              {/* Add wallet-specific form fields that appear when a subcategory is selected */}
              {itemSubcategory && (
                <div className="space-y-5 border-t pt-5 mt-5">
                  <h3 className="text-lg font-medium text-[#32230f]">Describe your item</h3>
                  
                  {itemSubcategory === "Credit_Card" ? (
                    // Credit Card specific fields
                    <>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-[#32230f]">Lastname</label>
                        <input
                          type="text"
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Enter the lastname"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
  
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-[#32230f]">Firstname</label>
                        <input
                          type="text"
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Enter the firstname"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
  
                      <div>
                        <label htmlFor="cardType" className="block text-sm font-medium mb-1 text-[#32230f]">Card type</label>
                        <select
                          id="cardType"
                          value={cardType}
                          onChange={(e) => setCardType(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        >
                          <option value="">Indicate the type of card</option>
                          <option value="Visa">Visa</option>
                          <option value="Mastercard">Mastercard</option>
                          <option value="American Express">American Express</option>
                          <option value="Discover">Discover</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
  
                      <div>
                        <label htmlFor="bankName" className="block text-sm font-medium mb-1 text-[#32230f]">Bank mentioned on the credit card *</label>
                        <select
                          id="bankName"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                          required={itemSubcategory === "Credit_Card"}
                        >
                          <option value="">Indicate the bank mentioned on the Credit Card</option>
                          <option value="Bank of America">Bank of America</option>
                          <option value="Chase">Chase</option>
                          <option value="Citibank">Citibank</option>
                          <option value="Wells Fargo">Wells Fargo</option>
                          <option value="Capital One">Capital One</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
  
                      <div>
                        <label htmlFor="cardDetail" className="block text-sm font-medium mb-1 text-[#32230f]">Detail</label>
                        <textarea
                          id="cardDetail"
                          value={cardDetail}
                          onChange={(e) => setCardDetail(e.target.value)}
                          placeholder="Describe the object and its distinctive elements as well as possible. Do not indicate first name, last name, surname, address or reference number."
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                          rows={4}
                        />
                      </div>
                    </>
                    ) : itemSubcategory === "Ball" ? (
                      // Card Holder specific fields
                      <>
                      
  <>
    <div>
      <label htmlFor="sportsItemType" className="block text-sm font-medium mb-1 text-[#32230f]">Type of Sports Item</label>
      <select
        id="sportsItemType"
        value={ballType}
        onChange={(e) => setBallType(e.target.value)}
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      >
        <option value="">Select type</option>
        <option value="Football">Football/Soccer Ball</option>
        <option value="Basketball">Basketball</option>
        <option value="Tennis">Tennis Equipment</option>
        <option value="Baseball">Baseball Equipment</option>
        <option value="Golf">Golf Equipment</option>
        <option value="Swimming">Swimming Equipment</option>
        <option value="Racket">Racket/Bat</option>
        <option value="Helmet">Helmet/Protective Gear</option>
        <option value="Gloves">Sports Gloves</option>
        <option value="Shoes">Sports Shoes</option>
        <option value="Clothing">Sports Clothing</option>
        <option value="Water Bottle">Water Bottle</option>
        <option value="Bag">Sports Bag</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div>
      <label htmlFor="sportsBrand" className="block text-sm font-medium mb-1 text-[#32230f]">Brand (if known)</label>
      <input
        type="text"
        id="sportsBrand"
        value={ballBrand}
        onChange={(e) => setBallBrand(e.target.value)}
        placeholder="Enter the sports brand name if known (e.g., Nike, Adidas, Wilson)"
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1 text-[#32230f]">Color</label>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {["Black", "White", "Blue", "Red", "Green", "Yellow", "Orange", "Purple", "Pink", "Grey", "Multi", "Other"].map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setBallColor(color)}
            className={`p-3 border rounded-lg flex items-center justify-center ${
              ballColor === color ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
            } hover:border-[#6c2704] transition-colors`}
          >
            <span className="text-sm">{color}</span>
          </button>
        ))}
      </div>
    </div>

    <div>
      <label htmlFor="sportsSize" className="block text-sm font-medium mb-1 text-[#32230f]">Size/Dimensions (if applicable)</label>
      <select
        id="sportsSize"
        value={ballSize}
        onChange={(e) => setBallSize(e.target.value)}
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      >
        <option value="">Select size</option>
        <option value="XS">Extra Small</option>
        <option value="S">Small</option>
        <option value="M">Medium</option>
        <option value="L">Large</option>
        <option value="XL">Extra Large</option>
        <option value="Youth">Youth Size</option>
        <option value="Adult">Adult Size</option>
        <option value="Standard">Standard Size</option>
        <option value="Other">Other/Custom Size</option>
      </select>
    </div>

    <div>
      <label htmlFor="sportsValue" className="block text-sm font-medium mb-1 text-[#32230f]">Approximate Value (optional)</label>
      <select
        id="sportsValue"
        value={itemValue}
        onChange={(e) => setItemValue(e.target.value)}
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      >
        <option value="">Select value range</option>
        <option value="Low">Low (under $50)</option>
        <option value="Medium">Medium ($50-$200)</option>
        <option value="High">High ($200-$1000)</option>
        <option value="Very High">Very High (over $1000)</option>
      </select>
    </div>

    <div>
      <label htmlFor="sportsDetail" className="block text-sm font-medium mb-1 text-[#32230f]">Additional Details</label>
      <textarea
        id="sportsDetail"
        value={itemDescription}
        onChange={(e) => setItemDescription(e.target.value)}
        placeholder="Describe any distinctive features, markings, or identifying characteristics of your sports item"
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
        rows={3}
      />
    </div>
  </>
                      </>
                      ) : itemSubcategory === "Bicycle" ? (
                        // Card Holder specific fields
                        <>
                           <div>
      <label htmlFor="vehicleType" className="block text-sm font-medium mb-1 text-[#32230f]">Type of Vehicle</label>
      <select
        id="vehicleType"
        value={bicycleType}
        onChange={(e) => setBicycleType(e.target.value)}
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      >
        <option value="">Select type</option>
        <option value="Bicycle">Bicycle</option>
        <option value="Mountain Bike">Mountain Bike</option>
        <option value="Road Bike">Road Bike</option>
        <option value="Electric Bike">Electric Bike</option>
        <option value="Scooter">Scooter</option>
        <option value="Electric Scooter">Electric Scooter</option>
        <option value="Motorcycle">Motorcycle</option>
        <option value="Car">Car</option>
        <option value="Skateboard">Skateboard</option>
        <option value="Longboard">Longboard</option>
        <option value="Roller Skates">Roller Skates</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div>
      <label htmlFor="vehicleBrand" className="block text-sm font-medium mb-1 text-[#32230f]">Brand/Make (if known)</label>
      <input
        type="text"
        id="vehicleBrand"
        value={bicycleBrand}
        onChange={(e) => setBicycleBrand(e.target.value)}
        placeholder="Enter the brand/make if known (e.g., Trek, Honda, Toyota)"
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      />
    </div>

    <div>
      <label htmlFor="vehicleModel" className="block text-sm font-medium mb-1 text-[#32230f]">Model (if known)</label>
      <input
        type="text"
        id="vehicleModel"
        value={itemModel}
        onChange={(e) => setItemModel(e.target.value)}
        placeholder="Enter the model if known (e.g., Civic, Camry, FX1)"
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1 text-[#32230f]">Color</label>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {["Black", "White", "Blue", "Red", "Green", "Silver", "Grey", "Yellow", "Orange", "Brown", "Multi", "Other"].map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setBicycleColor(color)}
            className={`p-3 border rounded-lg flex items-center justify-center ${
              bicycleColor === color ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
            } hover:border-[#6c2704] transition-colors`}
          >
            <span className="text-sm">{color}</span>
          </button>
        ))}
      </div>
    </div>

    <div>
      <label htmlFor="vehiclePlate" className="block text-sm font-medium mb-1 text-[#32230f]">License Plate Number (if applicable)</label>
      <input
        type="text"
        id="vehiclePlate"
        value={vehiclePlate}
        onChange={(e) => setVehiclePlate(e.target.value)}
        placeholder="Enter the license plate number if applicable"
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      />
    </div>

    <div>
      <label htmlFor="vehicleYear" className="block text-sm font-medium mb-1 text-[#32230f]">Year (if known)</label>
      <input
        type="text"
        id="vehicleYear"
        value={vehicleYear}
        onChange={(e) => setVehicleYear(e.target.value)}
        placeholder="Enter the year of manufacture if known"
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      />
    </div>

    <div>
      <label htmlFor="vehicleSize" className="block text-sm font-medium mb-1 text-[#32230f]">Size/Frame Size (if applicable)</label>
      <select
        id="vehicleSize"
        value={bicycleSize}
        onChange={(e) => setBicycleSize(e.target.value)}
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      >
        <option value="">Select size</option>
        <option value="XS">Extra Small</option>
        <option value="S">Small</option>
        <option value="M">Medium</option>
        <option value="L">Large</option>
        <option value="XL">Extra Large</option>
        <option value="Kids">Kids Size</option>
        <option value="Adult">Adult Size</option>
        <option value="Other">Other/Custom Size</option>
      </select>
    </div>

    <div>
      <label htmlFor="vehicleLock" className="block text-sm font-medium mb-1 text-[#32230f]">Had Lock/Security</label>
      <select
        id="vehicleLock"
        value={bicycleLock}
        onChange={(e) => setBicycleLock(e.target.value)}
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      >
        <option value="No">No</option>
        <option value="Yes">Yes</option>
      </select>
    </div>

    <div>
      <label htmlFor="vehicleSerial" className="block text-sm font-medium mb-1 text-[#32230f]">Serial/VIN Number (if known)</label>
      <input
        type="text"
        id="vehicleSerial"
        value={itemSerialNumber}
        onChange={(e) => setItemSerialNumber(e.target.value)}
        placeholder="Enter the serial/VIN number if known"
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      />
    </div>

    <div>
      <label htmlFor="vehicleRegistration" className="block text-sm font-medium mb-1 text-[#32230f]">Registration Number (if applicable)</label>
      <input
        type="text"
        id="vehicleRegistration"
        value={vehicleRegistration}
        onChange={(e) => setVehicleRegistration(e.target.value)}
        placeholder="Enter the registration number if applicable"
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      />
    </div>

    <div>
      <label htmlFor="vehicleDetail" className="block text-sm font-medium mb-1 text-[#32230f]">Additional Details</label>
      <textarea
        id="vehicleDetail"
        value={itemDescription}
        onChange={(e) => setItemDescription(e.target.value)}
        placeholder="Describe any distinctive features, accessories, damage, or identifying characteristics of your vehicle"
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
        rows={3}
      />
    </div>
                        </>
                  ) : itemSubcategory === "ClothesGeneral" ? (
                    // Clothes specific fields
                    <>
                      <div>
                        <label htmlFor="clothesType" className="block text-sm font-medium mb-1 text-[#32230f]">Type of Clothing</label>
                        <select
                          id="clothesType"
                          value={clothesType}
                          onChange={(e) => setClothesType(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        >
                          <option value="">Select type</option>
                          <option value="Jacket">Jacket/Coat</option>
                          <option value="Sweater">Sweater/Hoodie</option>
                          <option value="Shirt">Shirt/T-shirt</option>
                          <option value="Pants">Pants/Trousers</option>
                          <option value="Jeans">Jeans</option>
                          <option value="Shorts">Shorts</option>
                          <option value="Skirt">Skirt</option>
                          <option value="Dress">Dress</option>
                          <option value="Hat">Hat/Cap</option>
                          <option value="Scarf">Scarf</option>
                          <option value="Gloves">Gloves</option>
                          <option value="Socks">Socks</option>
                          <option value="Shoes">Shoes</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
              
                      <div>
                        <label htmlFor="clothesSize" className="block text-sm font-medium mb-1 text-[#32230f]">Size</label>
                        <select
                          id="clothesSize"
                          value={clothesSize}
                          onChange={(e) => setClothesSize(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        >
                          <option value="">Select size</option>
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="XXL">XXL</option>
                          <option value="Other">Other/Unknown</option>
                        </select>
                      </div>
              
                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#32230f]">Color</label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                          {["Black", "White", "Blue", "Red", "Green", "Grey", "Brown", "Yellow", "Purple", "Pink", "Orange", "Other"].map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setClothesColor(color)}
                              className={`p-3 border rounded-lg flex items-center justify-center ${
                                clothesColor === color ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
                              } hover:border-[#6c2704] transition-colors`}
                            >
                              <span className="text-sm">{color}</span>
                            </button>
                          ))}
                        </div>
                      </div>
              
                      <div>
                        <label htmlFor="clothesBrand" className="block text-sm font-medium mb-1 text-[#32230f]">Brand (if known)</label>
                        <input
                          type="text"
                          id="clothesBrand"
                          value={clothesBrand}
                          onChange={(e) => setClothesBrand(e.target.value)}
                          placeholder="Enter the brand name if known"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
              
                      <div>
                        <label htmlFor="clothesMaterial" className="block text-sm font-medium mb-1 text-[#32230f]">Material</label>
                        <select
                          id="clothesMaterial"
                          value={clothesMaterial}
                          onChange={(e) => setClothesMaterial(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        >
                          <option value="">Select material</option>
                          <option value="Cotton">Cotton</option>
                          <option value="Polyester">Polyester</option>
                          <option value="Wool">Wool</option>
                          <option value="Denim">Denim</option>
                          <option value="Leather">Leather</option>
                          <option value="Silk">Silk</option>
                          <option value="Linen">Linen</option>
                          <option value="Mixed">Mixed Materials</option>
                          <option value="Other">Other/Unknown</option>
                        </select>
                      </div>
                    </>
                    ) : itemSubcategory === "Glasses" ? (
                      // Card Holder specific fields
                      <>
                       <div>
      <label htmlFor="personalItemType" className="block text-sm font-medium mb-1 text-[#32230f]">Type of Personal Item</label>
      <select
        id="personalItemType"
        value={personalItemType}
        onChange={(e) => setPersonalItemType(e.target.value)}
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      >
        <option value="">Select type</option>
        <option value="Glasses">Glasses/Sunglasses</option>
        <option value="Watch">Watch</option>
        <option value="Jewelry">Jewelry</option>
        <option value="Cosmetics">Cosmetics</option>
        <option value="Medication">Medication</option>
        <option value="Toiletries">Toiletries</option>
        <option value="Accessories">Accessories</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div>
      <label htmlFor="personalItemBrand" className="block text-sm font-medium mb-1 text-[#32230f]">Brand (if known)</label>
      <input
        type="text"
        id="personalItemBrand"
        value={itemBrand}
        onChange={(e) => setItemBrand(e.target.value)}
        placeholder="Enter the brand name if known"
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1 text-[#32230f]">Color</label>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {["Black", "White", "Blue", "Red", "Green", "Grey", "Brown", "Silver", "Gold", "Pink", "Purple", "Other"].map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setItemColor(color)}
            className={`p-3 border rounded-lg flex items-center justify-center ${
              itemColor === color ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
            } hover:border-[#6c2704] transition-colors`}
          >
            <span className="text-sm">{color}</span>
          </button>
        ))}
      </div>
    </div>

    <div>
      <label htmlFor="personalItemMaterial" className="block text-sm font-medium mb-1 text-[#32230f]">Material (if applicable)</label>
      <select
        id="personalItemMaterial"
        value={itemMaterial}
        onChange={(e) => setItemMaterial(e.target.value)}
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      >
        <option value="">Select material</option>
        <option value="Plastic">Plastic</option>
        <option value="Metal">Metal</option>
        <option value="Glass">Glass</option>
        <option value="Fabric">Fabric</option>
        <option value="Leather">Leather</option>
        <option value="Wood">Wood</option>
        <option value="Ceramic">Ceramic</option>
        <option value="Rubber">Rubber</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div>
      <label htmlFor="personalItemCase" className="block text-sm font-medium mb-1 text-[#32230f]">Has Case/Container</label>
      <select
        id="personalItemCase"
        value={hasCase}
        onChange={(e) => setHasCase(e.target.value)}
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      >
        <option value="No">No</option>
        <option value="Yes">Yes</option>
      </select>
    </div>

    <div>
      <label htmlFor="personalItemValue" className="block text-sm font-medium mb-1 text-[#32230f]">Approximate Value (optional)</label>
      <select
        id="personalItemValue"
        value={itemValue}
        onChange={(e) => setItemValue(e.target.value)}
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      >
        <option value="">Select value range</option>
        <option value="Low">Low (under $50)</option>
        <option value="Medium">Medium ($50-$200)</option>
        <option value="High">High ($200-$1000)</option>
        <option value="Very High">Very High (over $1000)</option>
      </select>
    </div>

    <div>
      <label htmlFor="personalItemDetail" className="block text-sm font-medium mb-1 text-[#32230f]">Additional Details</label>
      <textarea
        id="personalItemDetail"
        value={itemDescription}
        onChange={(e) => setItemDescription(e.target.value)}
        placeholder="Describe any distinctive features or identifying characteristics of your personal item"
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
        rows={3}
      />
    </div>
                      </>
    ) : itemSubcategory === "Keys" ? (
  <>
   <div>
      <label htmlFor="itemType" className="block text-sm font-medium mb-1 text-[#32230f]">Type of Item</label>
      <input
        type="text"
        id="itemType"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Enter the type of item (e.g., Keys, Umbrella, Book)"
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1 text-[#32230f]">Color</label>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {["Black", "White", "Blue", "Red", "Green", "Grey", "Brown", "Yellow", "Silver", "Gold", "Multi", "Other"].map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setItemColor(color)}
            className={`p-3 border rounded-lg flex items-center justify-center ${
              itemColor === color ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
            } hover:border-[#6c2704] transition-colors`}
          >
            <span className="text-sm">{color}</span>
          </button>
        ))}
      </div>
    </div>

    <div>
      <label htmlFor="itemBrand" className="block text-sm font-medium mb-1 text-[#32230f]">Brand (if applicable)</label>
      <input
        type="text"
        id="itemBrand"
        value={itemBrand}
        onChange={(e) => setItemBrand(e.target.value)}
        placeholder="Enter the brand name if applicable"
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      />
    </div>

    <div>
      <label htmlFor="itemSize" className="block text-sm font-medium mb-1 text-[#32230f]">Size/Dimensions (if applicable)</label>
      <select
        id="itemSize"
        value={itemModel} // Reusing itemModel state for size
        onChange={(e) => setItemModel(e.target.value)}
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      >
        <option value="">Select size</option>
        <option value="Tiny">Tiny (fits in palm)</option>
        <option value="Small">Small (pocket-sized)</option>
        <option value="Medium">Medium (handheld)</option>
        <option value="Large">Large (requires two hands)</option>
        <option value="Very Large">Very Large</option>
      </select>
    </div>

    <div>
      <label htmlFor="itemMaterial" className="block text-sm font-medium mb-1 text-[#32230f]">Material (if applicable)</label>
      <select
        id="itemMaterial"
        value={holderMaterial} // Reusing holderMaterial state for material
        onChange={(e) => setHolderMaterial(e.target.value)}
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      >
        <option value="">Select material</option>
        <option value="Metal">Metal</option>
        <option value="Plastic">Plastic</option>
        <option value="Wood">Wood</option>
        <option value="Fabric">Fabric</option>
        <option value="Glass">Glass</option>
        <option value="Leather">Leather</option>
        <option value="Paper">Paper</option>
        <option value="Rubber">Rubber</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div>
      <label htmlFor="itemDescription" className="block text-sm font-medium mb-1 text-[#32230f]">Detailed Description</label>
      <textarea
        id="itemDescription"
        value={itemDescription}
        onChange={(e) => setItemDescription(e.target.value)}
        placeholder="Describe the item in detail - any distinctive features, markings, or other identifying characteristics"
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
        rows={3}
      />
    </div>
  </>
                    ) :  itemSubcategory === "Phone" ? (
                    // Phone specific fields
                    <>
                      <div>
                        <label htmlFor="phoneBrand" className="block text-sm font-medium mb-1 text-[#32230f]">Brand</label>
                        <select
                          id="phoneBrand"
                          value={phoneBrand}
                          onChange={(e) => setPhoneBrand(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        >
                          <option value="">Select brand</option>
                          <option value="Apple">Apple</option>
                          <option value="Samsung">Samsung</option>
                          <option value="Google">Google</option>
                          <option value="Huawei">Huawei</option>
                          <option value="Xiaomi">Xiaomi</option>
                          <option value="OnePlus">OnePlus</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
        <label htmlFor="phoneModel" className="block text-sm font-medium mb-1 text-[#32230f]">Model</label>
        <input
          type="text"
          id="phoneModel"
          value={phoneModel}
          onChange={(e) => setPhoneModel(e.target.value)}
          placeholder="Enter the phone model (e.g., iPhone 13, Galaxy S22)"
          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-[#32230f]">Color</label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {["Black", "White", "Blue", "Red", "Gold", "Other"].map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setPhoneColor(color)}
              className={`p-3 border rounded-lg flex items-center justify-center ${
                phoneColor === color ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
              } hover:border-[#6c2704] transition-colors`}
            >
              <span className="text-sm">{color}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="phoneCase" className="block text-sm font-medium mb-1 text-[#32230f]">Phone Case</label>
        <select
          id="phoneCase"
          value={phoneCase}
          onChange={(e) => setPhoneCase(e.target.value)}
          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>

                   <div>
        <label htmlFor="phoneIMEI" className="block text-sm font-medium mb-1 text-[#32230f]">IMEI Number (if known)</label>
        <input
          type="text"
          id="phoneIMEI"
          value={phoneIMEI}
          onChange={(e) => setPhoneIMEI(e.target.value)}
          placeholder="Enter the IMEI number if you know it"
          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
        />
      </div>   
                    </>
                  ) : itemSubcategory === "Laptop" ? (
                    // Laptop specific fields
                    <>
                      <div>
                        <label htmlFor="laptopBrand" className="block text-sm font-medium mb-1 text-[#32230f]">Brand</label>
                        <select
                          id="laptopBrand"
                          value={laptopBrand}
                          onChange={(e) => setLaptopBrand(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        >
                          <option value="">Select brand</option>
                          <option value="Apple">Apple</option>
                          <option value="Dell">Dell</option>
                          <option value="HP">HP</option>
                          <option value="Lenovo">Lenovo</option>
                          <option value="Asus">Asus</option>
                          <option value="Acer">Acer</option>
                          <option value="Microsoft">Microsoft</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
        <label htmlFor="laptopModel" className="block text-sm font-medium mb-1 text-[#32230f]">Model</label>
        <input
          type="text"
          id="laptopModel"
          value={laptopModel}
          onChange={(e) => setLaptopModel(e.target.value)}
          placeholder="Enter the laptop model (e.g., MacBook Pro, XPS 15)"
          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-[#32230f]">Color</label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {["Silver", "Black", "White", "Grey", "Blue", "Other"].map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setItemColor(color)}
              className={`p-3 border rounded-lg flex items-center justify-center ${
                itemColor === color ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
              } hover:border-[#6c2704] transition-colors`}
            >
              <span className="text-sm">{color}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="laptopCharger" className="block text-sm font-medium mb-1 text-[#32230f]">Charger Included</label>
        <select
          id="laptopCharger"
          value={laptopCharger}
          onChange={(e) => setLaptopCharger(e.target.value)}
          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
             
                    </>
                  ) : itemSubcategory === "Headphones" ? (
                    // Headphones specific fields
                    <>
                      <div>
                        <label htmlFor="headphonesBrand" className="block text-sm font-medium mb-1 text-[#32230f]">Brand</label>
                        <select
                          id="headphonesBrand"
                          value={headphonesBrand}
                          onChange={(e) => setHeadphonesBrand(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        >
                          <option value="">Select brand</option>
                          <option value="Apple">Apple</option>
                          <option value="Sony">Sony</option>
                          <option value="Bose">Bose</option>
                          <option value="Samsung">Samsung</option>
                          <option value="JBL">JBL</option>
                          <option value="Beats">Beats</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
        <label htmlFor="headphonesType" className="block text-sm font-medium mb-1 text-[#32230f]">Type</label>
        <select
          id="headphonesType"
          value={headphonesType}
          onChange={(e) => setHeadphonesType(e.target.value)}
          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
        >
          <option value="">Select type</option>
          <option value="Over-ear">Over-ear</option>
          <option value="On-ear">On-ear</option>
          <option value="In-ear">In-ear</option>
          <option value="Earbuds">Earbuds</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 text-[#32230f]">Color</label>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {["Black", "White", "Blue", "Red", "Grey", "Other"].map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setHeadphonesColor(color)}
              className={`p-3 border rounded-lg flex items-center justify-center ${
                headphonesColor === color ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
              } hover:border-[#6c2704] transition-colors`}
            >
              <span className="text-sm">{color}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="headphonesWireless" className="block text-sm font-medium mb-1 text-[#32230f]">Wireless</label>
        <select
          id="headphonesWireless"
          value={headphonesWireless}
          onChange={(e) => setHeadphonesWireless(e.target.value)}
          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="headphonesCase" className="block text-sm font-medium mb-1 text-[#32230f]">Has Case</label>
        <select
          id="headphonesCase"
          value={headphonesCase}
          onChange={(e) => setHeadphonesCase(e.target.value)}
          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
        >
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>    
     </>
     ) : itemSubcategory === "Charger" ? (
      // Cash specific fields
      <>
       <div>
                        <label htmlFor="chargerType" className="block text-sm font-medium mb-1 text-[#32230f]">Charger Type</label>
                        <select
                          id="chargerType"
                          value={chargerType}
                          onChange={(e) => setChargerType(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        >
                          <option value="">Select charger type</option>
                          <option value="Phone">Phone Charger</option>
                          <option value="Laptop">Laptop Charger</option>
                          <option value="Tablet">Tablet Charger</option>
                          <option value="USB-C">USB-C Charger</option>
                          <option value="Lightning">Lightning Charger</option>
                          <option value="Micro-USB">Micro-USB Charger</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="chargerBrand" className="block text-sm font-medium mb-1 text-[#32230f]">Brand</label>
                        <select
                          id="chargerBrand"
                          value={chargerBrand}
                          onChange={(e) => setChargerBrand(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        >
                          <option value="">Select brand</option>
                          <option value="Apple">Apple</option>
                          <option value="Samsung">Samsung</option>
                          <option value="Dell">Dell</option>
                          <option value="HP">HP</option>
                          <option value="Lenovo">Lenovo</option>
                          <option value="Anker">Anker</option>
                          <option value="Belkin">Belkin</option>
                          <option value="Generic">Generic/No Brand</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#32230f]">Color</label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                          {["Black", "White", "Grey", "Beige", "Blue", "Other"].map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setItemColor(color)}
                              className={`p-3 border rounded-lg flex items-center justify-center ${
                                itemColor === color ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
                              } hover:border-[#6c2704] transition-colors`}
                            >
                              <span className="text-sm">{color}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="chargerWattage" className="block text-sm font-medium mb-1 text-[#32230f]">Wattage (if known)</label>
                        <input
                          type="text"
                          id="chargerWattage"
                          value={chargerWattage}
                          onChange={(e) => setChargerWattage(e.target.value)}
                          placeholder="Enter the wattage (e.g., 65W, 100W)"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="chargerCable" className="block text-sm font-medium mb-1 text-[#32230f]">Cable Included</label>
                        <select
                          id="chargerCable"
                          value={chargerCable}
                          onChange={(e) => setChargerCable(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>
        
            </>    
            
          ) : itemSubcategory === "Ring" || itemSubcategory === "Necklace" || itemSubcategory === "Bracelet" || itemSubcategory === "Earrings" || (itemSubcategory === "Other" && itemCategory === "Jewelry") ? (
      
            <>
              <div>
      <label htmlFor="jewelryMaterial" className="block text-sm font-medium mb-1 text-[#32230f]">Material</label>
      <select
        id="jewelryMaterial"
        value={jewelryMaterial}
        onChange={(e) => setJewelryMaterial(e.target.value)}
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      >
        <option value="">Select material</option>
        <option value="Gold">Gold</option>
        <option value="Silver">Silver</option>
        <option value="Platinum">Platinum</option>
        <option value="Steel">Stainless Steel</option>
        <option value="Titanium">Titanium</option>
        <option value="Copper">Copper</option>
        <option value="Plastic">Plastic</option>
        <option value="Other">Other</option>
      </select>
      </div>
      <div>
      <label className="block text-sm font-medium mb-1 text-[#32230f]">Color</label>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {["Gold", "Silver", "Rose Gold", "Black", "White", "Other"].map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setJewelryColor(color)}
            className={`p-3 border rounded-lg flex items-center justify-center ${
              jewelryColor === color ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
            } hover:border-[#6c2704] transition-colors`}
          >
            <span className="text-sm">{color}</span>
          </button>
        ))}
      </div>
    </div>

    <div>
      <label htmlFor="jewelryStone" className="block text-sm font-medium mb-1 text-[#32230f]">Has Gemstone/Diamond</label>
      <select
        id="jewelryStone"
        value={jewelryStone}
        onChange={(e) => setJewelryStone(e.target.value)}
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      >
        <option value="No">No</option>
        <option value="Yes">Yes</option>
      </select>
    </div>

    <div>
      <label htmlFor="jewelryBrand" className="block text-sm font-medium mb-1 text-[#32230f]">Brand (if known)</label>
      <input
        type="text"
        id="jewelryBrand"
        value={jewelryBrand}
        onChange={(e) => setJewelryBrand(e.target.value)}
        placeholder="Enter the brand name if known"
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      />
    </div>
            </>

) : itemSubcategory === "Watch" ? (
  // Watch specific fields
  <>
    <div>
      <label htmlFor="watchBrand" className="block text-sm font-medium mb-1 text-[#32230f]">Brand</label>
      <select
        id="watchBrand"
        value={watchBrand}
        onChange={(e) => setWatchBrand(e.target.value)}
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      >
        <option value="">Select brand</option>
        <option value="Rolex">Rolex</option>
        <option value="Omega">Omega</option>
        <option value="Casio">Casio</option>
        <option value="Seiko">Seiko</option>
        <option value="Citizen">Citizen</option>
        <option value="Apple">Apple</option>
        <option value="Samsung">Samsung</option>
        <option value="Fitbit">Fitbit</option>
        <option value="Garmin">Garmin</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div>
      <label htmlFor="watchType" className="block text-sm font-medium mb-1 text-[#32230f]">Type</label>
      <select
        id="watchType"
        value={watchType}
        onChange={(e) => setWatchType(e.target.value)}
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      >
        <option value="">Select type</option>
        <option value="Analog">Analog</option>
        <option value="Digital">Digital</option>
        <option value="Smart Watch">Smart Watch</option>
        <option value="Fitness Tracker">Fitness Tracker</option>
        <option value="Hybrid">Hybrid</option>
      </select>
    </div>

    <div>
      <label htmlFor="watchStrap" className="block text-sm font-medium mb-1 text-[#32230f]">Strap Material</label>
      <select
        id="watchStrap"
        value={watchStrap}
        onChange={(e) => setWatchStrap(e.target.value)}
        className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
      >
        <option value="">Select strap material</option>
        <option value="Metal">Metal</option>
        <option value="Leather">Leather</option>
        <option value="Rubber">Rubber/Silicone</option>
        <option value="Fabric">Fabric/Nylon</option>
        <option value="Plastic">Plastic</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium mb-1 text-[#32230f]">Color</label>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {["Silver", "Gold", "Black", "White", "Blue", "Other"].map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setJewelryColor(color)}
            className={`p-3 border rounded-lg flex items-center justify-center ${
              jewelryColor === color ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
            } hover:border-[#6c2704] transition-colors`}
          >
            <span className="text-sm">{color}</span>
          </button>
        ))}
      </div>
    </div>
    </>
                
                  
                    )  : itemSubcategory === "Cash" ? (
                    // Cash specific fields
                    <>
                      <div>
                        <label htmlFor="cashAmount" className="block text-sm font-medium mb-1 text-[#32230f]">Amount *</label>
                        <input
                          type="text"
                          id="cashAmount"
                          value={cashAmount}
                          onChange={(e) => setCashAmount(e.target.value)}
                          placeholder="Enter the approximate amount"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                          required={itemSubcategory === "Cash"}
                        />
                      </div>
  
                      <div>
                        <label htmlFor="cashCurrency" className="block text-sm font-medium mb-1 text-[#32230f]">Currency *</label>
                        <select
                          id="cashCurrency"
                          value={cashCurrency}
                          onChange={(e) => setCashCurrency(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                          required={itemSubcategory === "Cash"}
                        >
                          <option value="">Select currency</option>
                          <option value="USD">USD - US Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="GBP">GBP - British Pound</option>
                          <option value="JPY">JPY - Japanese Yen</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
  
                      <div>
                        <label htmlFor="cashContainer" className="block text-sm font-medium mb-1 text-[#32230f]">Container</label>
                        <select
                          id="cashContainer"
                          value={cashContainer}
                          onChange={(e) => setCashContainer(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        >
                          <option value="">How was the money stored?</option>
                          <option value="Loose">Loose bills/coins</option>
                          <option value="Envelope">In an envelope</option>
                          <option value="Money Clip">In a money clip</option>
                          <option value="Wallet">In a wallet</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
  
                      <div>
                        <label htmlFor="cashDetail" className="block text-sm font-medium mb-1 text-[#32230f]">Additional Details</label>
                        <textarea
                          id="cashDetail"
                          value={cashDetail}
                          onChange={(e) => setCashDetail(e.target.value)}
                          placeholder="Provide any additional details about the lost cash (denominations, specific markings, etc.)"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                          rows={4}
                        />
                      </div>
                    </>
                  ) : itemSubcategory === "Card_Holder" ? (
                    // Card Holder specific fields
                    <>
                      <div>
                        <label htmlFor="itemBrand" className="block text-sm font-medium mb-1 text-[#32230f]">Brand</label>
                        <div className="space-y-2">
                          <input
                            type="text"
                            id="itemBrand"
                            value={itemBrand}
                            onChange={(e) => setItemBrand(e.target.value)}
                            placeholder="What's the card holder's brand?"
                            disabled={noBrand}
                            className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                          />
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="noBrand"
                              checked={noBrand}
                              onChange={(e) => {
                                setNoBrand(e.target.checked);
                                if (e.target.checked) setItemBrand("");
                              }}
                              className="mr-2"
                            />
                            <label htmlFor="noBrand" className="text-sm text-[#32230f]">No brand</label>
                          </div>
                        </div>
                      </div>
  
                      <div>
                        <label htmlFor="holderMaterial" className="block text-sm font-medium mb-1 text-[#32230f]">Material</label>
                        <select
                          id="holderMaterial"
                          value={holderMaterial}
                          onChange={(e) => setHolderMaterial(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        >
                          <option value="">Select material</option>
                          <option value="Leather">Leather</option>
                          <option value="Plastic">Plastic</option>
                          <option value="Metal">Metal</option>
                          <option value="Fabric">Fabric</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
  
                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#32230f]">Item color</label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                          {["Black", "Grey", "White", "Brown", "With pattern", "Other"].map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setItemColor(color)}
                              className={`p-3 border rounded-lg flex items-center justify-center ${
                                itemColor === color ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
                              } hover:border-[#6c2704] transition-colors`}
                            >
                              <span className="text-sm">{color}</span>
                            </button>
                          ))}
                        </div>
                      </div>
  
                      <div>
                        <label htmlFor="cardsInside" className="block text-sm font-medium mb-1 text-[#32230f]">Cards inside</label>
                        <select
                          id="cardsInside"
                          value={cardsInside}
                          onChange={(e) => setCardsInside(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>
  
                      <div>
                        <label htmlFor="holderDetail" className="block text-sm font-medium mb-1 text-[#32230f]">Additional Details</label>
                        <textarea
                          id="holderDetail"
                          value={holderDetail}
                          onChange={(e) => setHolderDetail(e.target.value)}
                          placeholder="Describe any distinctive features of the card holder"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                          rows={4}
                        />
                      </div>
                    </>
                  ) : itemSubcategory === "ID_Card" ? (
                    // ID Card specific fields
                    <>
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-[#32230f]">Firstname</label>
                        <input
                          type="text"
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Enter the firstname"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
  
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-[#32230f]">Lastname</label>
                        <input
                          type="text"
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Enter the lastname"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
  
                      <div>
                        <label htmlFor="idCardNumber" className="block text-sm font-medium mb-1 text-[#32230f]">ID Card Number</label>
                        <input
                          type="text"
                          id="idCardNumber"
                          value={idCardNumber}
                          onChange={(e) => setIdCardNumber(e.target.value)}
                          placeholder="Enter the ID card number (optional)"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
  
                      <div>
                        <label htmlFor="idCardIssuer" className="block text-sm font-medium mb-1 text-[#32230f]">Issuing Authority</label>
                        <input
                          type="text"
                          id="idCardIssuer"
                          value={idCardIssuer}
                          onChange={(e) => setIdCardIssuer(e.target.value)}
                          placeholder="Enter the issuing authority"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
  
                      <div>
                        <label htmlFor="idCardExpiry" className="block text-sm font-medium mb-1 text-[#32230f]">Expiry Date</label>
                        <input
                          type="date"
                          id="idCardExpiry"
                          value={idCardExpiry}
                          onChange={(e) => setIdCardExpiry(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
                    </>
                  ) : itemSubcategory === "Student_Card" ? (
                    // Student Card specific fields
                    <>
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-[#32230f]">Firstname</label>
                        <input
                          type="text"
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Enter the firstname"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
  
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-[#32230f]">Lastname</label>
                        <input
                          type="text"
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Enter the lastname"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
  
                      <div>
                        <label htmlFor="studentId" className="block text-sm font-medium mb-1 text-[#32230f]">Student ID</label>
                        <input
                          type="text"
                          id="studentId"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          placeholder="Enter the student ID number (optional)"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
  
                      <div>
                        <label htmlFor="university" className="block text-sm font-medium mb-1 text-[#32230f]">University/School *</label>
                        <input
                          type="text"
                          id="university"
                          value={university}
                          onChange={(e) => setUniversity(e.target.value)}
                          placeholder="Enter the university or school name"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                          required={itemSubcategory === "Student_Card"}
                        />
                      </div>
  
                      <div>
                        <label htmlFor="department" className="block text-sm font-medium mb-1 text-[#32230f]">Department/Faculty</label>
                        <input
                          type="text"
                          id="department"
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          placeholder="Enter the department or faculty"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
                    </>
                  ) : itemSubcategory === "Driving_License" ? (
                    // Driving License specific fields
                    <>
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-[#32230f]">Firstname</label>
                        <input
                          type="text"
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Enter the firstname"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
  
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-[#32230f]">Lastname</label>
                        <input
                          type="text"
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Enter the lastname"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
  
                      <div>
                        <label htmlFor="licenseNumber" className="block text-sm font-medium mb-1 text-[#32230f]">License Number</label>
                        <input
                          type="text"
                          id="licenseNumber"
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          placeholder="Enter the license number (optional)"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
  
                      <div>
                        <label htmlFor="licenseCountry" className="block text-sm font-medium mb-1 text-[#32230f]">Issuing Country *</label>
                        <select
                          id="licenseCountry"
                          value={licenseCountry}
                          onChange={(e) => setLicenseCountry(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                          required={itemSubcategory === "Driving_License"}
                        >
                          <option value="">Select country</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
  
                      <div>
                        <label htmlFor="licenseExpiry" className="block text-sm font-medium mb-1 text-[#32230f]">Expiry Date</label>
                        <input
                          type="date"
                          id="licenseExpiry"
                          value={licenseExpiry}
                          onChange={(e) => setLicenseExpiry(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
                    </>
                  ) : itemSubcategory === "Passport" ? (
                    // Passport specific fields
                    <>
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-[#32230f]">Firstname</label>
                        <input
                          type="text"
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Enter the firstname"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
  
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-[#32230f]">Lastname</label>
                        <input
                          type="text"
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Enter the lastname"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
  
                      <div>
                        <label htmlFor="passportNumber" className="block text-sm font-medium mb-1 text-[#32230f]">Passport Number</label>
                        <input
                          type="text"
                          id="passportNumber"
                          value={passportNumber}
                          onChange={(e) => setPassportNumber(e.target.value)}
                          placeholder="Enter the passport number (optional)"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
  
                      <div>
                        <label htmlFor="passportCountry" className="block text-sm font-medium mb-1 text-[#32230f]">Issuing Country *</label>
                        <select
                          id="passportCountry"
                          value={passportCountry}
                          onChange={(e) => setPassportCountry(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                          required={itemSubcategory === "Passport"}
  >
                          <option value="">Select country</option>
                          <option value="United States">United States</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
  
                      <div>
                        <label htmlFor="passportExpiry" className="block text-sm font-medium mb-1 text-[#32230f]">Expiry Date</label>
                        <input
                          type="date"
                          id="passportExpiry"
                          value={passportExpiry}
                          onChange={(e) => setPassportExpiry(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        />
                      </div>
                    </>
  ) : (
                    // Original wallet fields for Wallet_Regular subcategory
                    <>
                      <div>
                        <label htmlFor="itemBrand" className="block text-sm font-medium mb-1 text-[#32230f]">Brand *</label>
                        <div className="space-y-2">
                          <input
                            type="text"
                            id="itemBrand"
                            value={itemBrand}
                            onChange={(e) => setItemBrand(e.target.value)}
                            placeholder="What's the item's brand?"
                            disabled={noBrand}
                            className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                          />
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="noBrand"
                              checked={noBrand}
                              onChange={(e) => {
                                setNoBrand(e.target.checked);
                                if (e.target.checked) setItemBrand("");
                              }}
                              className="mr-2"
                            />
                            <label htmlFor="noBrand" className="text-sm text-[#32230f]">No brand</label>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#32230f]">Color</label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                          {["Black", "Grey", "Blue", "Green", "Red", "Other"].map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setBagColor(color)}
                              className={`p-3 border rounded-lg flex items-center justify-center ${
                                bagColor === color ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
                              } hover:border-[#6c2704] transition-colors`}
                            >
                              <span className="text-sm">{color}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="bagSize" className="block text-sm font-medium mb-1 text-[#32230f]">Size</label>
                        <select
                          id="bagSize"
                          value={bagSize}
                          onChange={(e) => setBagSize(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        >
                          <option value="">Select size</option>
                          <option value="Small">Small</option>
                          <option value="Medium">Medium</option>
                          <option value="Large">Large</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="bagMaterial" className="block text-sm font-medium mb-1 text-[#32230f]">Material</label>
                        <select
                          id="bagMaterial"
                          value={bagMaterial}
                          onChange={(e) => setBagMaterial(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        >
                          <option value="">Select material</option>
                          <option value="Nylon">Nylon</option>
                          <option value="Canvas">Canvas</option>
                          <option value="Polyester">Polyester</option>
                          <option value="Leather">Leather</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="handbagContents" className="block text-sm font-medium mb-1 text-[#32230f]">Contents</label>
                        <textarea
                          id="bagContents"
                          value={bagContents}
                          onChange={(e) => setBagContents(e.target.value)}
                          placeholder="Describe items that were inside the handbag (wallet, phone, keys, etc.)"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                          rows={4}
                        />
                      </div>
  
                     
  
                      <div>
                        <label className="block text-sm font-medium mb-1 text-[#32230f]">Item color</label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                          {["Black", "Grey", "White", "Brown", "With pattern", "Other"].map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setItemColor(color)}
                              className={`p-3 border rounded-lg flex items-center justify-center ${
                                itemColor === color ? "border-[#6c2704] bg-[rgba(108,39,4,0.1)]" : "border-gray-200"
                              } hover:border-[#6c2704] transition-colors`}
                            >
                              {/* Color indicators */}
                              <span className="text-sm">{color}</span>
                            </button>
                          ))}
                        </div>
                      </div>
  
                      <div>
                        <label htmlFor="hasAddress" className="block text-sm font-medium mb-1 text-[#32230f]">Presence of an address</label>
                        <select
                          id="hasAddress"
                          value={hasAddress}
                          onChange={(e) => setHasAddress(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>
  
                      <div>
                        <label htmlFor="hasCash" className="block text-sm font-medium mb-1 text-[#32230f]">Presence of cash</label>
                        <select
                          id="hasCash"
                          value={hasCash}
                          onChange={(e) => setHasCash(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>
                    </>
                  )
                  
                  }
                </div>
              )}
  
              <div>
                <label htmlFor="locationLastSeen" className="block text-sm font-medium mb-1 text-[#32230f]">Location Last Seen</label>
                <input
                  type="text"
                  id="locationLastSeen"
                  value={locationLastSeen}
                  onChange={(e) => setLocationLastSeen(e.target.value)}
                  className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                  required
                />
              </div>
  
              <div>
                <label htmlFor="dateLost" className="block text-sm font-medium mb-1 text-[#32230f]">Date Lost</label>
                <input
                  type="date"
                  id="dateLost"
                  value={dateLost}
                  onChange={(e) => {
                    setDateLost(e.target.value);
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
  
              <div>
                <label htmlFor="itemPhoto" className="block text-sm font-medium mb-1 text-[#32230f]">Item Photo</label>
                <input
                  type="file"
                  id="itemPhoto"
                  onChange={(e) => setItemPhoto(e.target.files ? e.target.files[0] : null)}
                  className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                  accept="image/*"
                />
              </div>
              <div className="border-t pt-5 mt-5">
                <h3 className="text-lg font-medium text-[#32230f] mb-4">Reward Information</h3>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="offerReward"
                      checked={offerReward}
                      onChange={(e) => setOfferReward(e.target.checked)}
                      className="h-4 w-4 text-[#6c2704] focus:ring-[#6c2704] border-gray-300 rounded"
                    />
                    <label htmlFor="offerReward" className="ml-2 block text-sm font-medium text-gray-700">
                      Offer a reward for finding this item
                    </label>
                  </div>
                  
                  {offerReward && (
                    <div className="mt-3 pl-6 grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label htmlFor="rewardAmount" className="block text-sm font-medium text-gray-700 mb-1">
                          Reward Amount
                        </label>
                        <input
                          type="number"
                          id="rewardAmount"
                          value={rewardAmount}
                          onChange={(e) => setRewardAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                          required={offerReward}
                          min="0"
                        />
                      </div>
                      <div>
                        <label htmlFor="rewardCurrency" className="block text-sm font-medium text-gray-700 mb-1">
                          Currency
                        </label>
                        <select
                          id="rewardCurrency"
                          value={rewardCurrency}
                          onChange={(e) => setRewardCurrency(e.target.value)}
                          className="w-full px-4 py-2 border border-[rgba(74,85,104,0.5)] rounded-lg bg-[rgba(255,248,240,0.9)] text-[#32230f] focus:border-[#6c2704] focus:ring-2 focus:ring-[rgba(108,39,4,0.2)] focus:outline-none"
                        >
                          <option value="PKR">PKR</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="CAD">CAD</option>
                          <option value="AUD">AUD</option>
                          <option value="JPY">JPY</option>
                          <option value="CNY">CNY</option>
                          <option value="INR">INR</option>
                        </select>
                      </div>
                    </div>
                    
                  )}
                </div>
              </div>
              
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-black to-[#6c2704] text-white font-semibold rounded-lg shadow-md hover:scale-105 transition duration-300"
              >
                Submit Report
              </button>
            </form>
          </div>
        </section>
  
        
  
        <Footer />
      </div>
    )};
    
               