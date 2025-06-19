export interface LostItem {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  description: string;
  contactInfo: string;
  image?: string;
  status: 'pending' | 'found' | 'claimed';
  
  // Wallet fields
  itemBrand?: string;
  itemModel?: string;
  itemColor?: string;
  hasAddress?: string;
  hasCash?: string;
  firstName?: string;
  lastName?: string;
  
  // Credit card fields
  cardType?: string;
  bankName?: string;
  cardDetail?: string;
  
  // Cash fields
  cashAmount?: string;
  cashCurrency?: string;
  cashContainer?: string;
  cashDetail?: string;
  
  // Card holder fields
  holderMaterial?: string;
  cardsInside?: string;
  holderDetail?: string;
  
  // Document fields
  idCardNumber?: string;
  idCardIssuer?: string;
  idCardExpiry?: string;
  studentId?: string;
  university?: string;
  department?: string;
  licenseNumber?: string;
  licenseCountry?: string;
  licenseExpiry?: string;
  passportNumber?: string;
  passportCountry?: string;
  passportExpiry?: string;
  
  // Bag fields
  bagBrand?: string;
  bagColor?: string;
  bagContents?: string;
  bagSize?: string;
  bagMaterial?: string;
  
  // Electronics fields
  phoneBrand?: string;
  phoneModel?: string;
  phoneColor?: string;
  phoneCase?: string;
  phoneIMEI?: string;
  phonePassword?: string;
  itemSerialNumber?: string;
  
  // Clothes fields
  clothesType?: string;
  clothesSize?: string;
  clothesColor?: string;
  clothesBrand?: string;
  clothesMaterial?: string;

  offerReward?: boolean;
  rewardAmount?: string;
  rewardCurrency?: string;
}

export interface FoundItem {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  description: string;
  contactInfo: string;
  image: string;
  status: 'available' | 'claimed' | 'pending';
}