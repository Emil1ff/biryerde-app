import type { LatLng } from "react-native-maps" 

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  phone: string
  address: string
  bio: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  phone: string
  address: string
  bio: string
  memberSince: string
  totalBookings: number
  reviewsGiven: number
}

export interface ServiceCategory {
  id: string
  name: string
  icon: string
  color: string
  iconFamily: "Ionicons" | "MaterialIcons"
  description: string
  providersCount: number
  services: Service[] 
}

export interface Service {
  id: string
  categoryId: string
  name: string
  image: string
  rating: number
  reviewCount: number
  priceRange: string
  description: string
  provider: Provider
  items: ServiceItem[]
  reviews: Review[]
  photos: string[]
  videos: string[]
  isVIP: boolean 
}

export interface ServiceItem {
  id: string
  name: string
  price: number
  duration: string 
  description?: string
}

export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  date: string
}

export interface Category {
  id: string
  name: string
  image: string
}

export interface Provider {
  id: string
  name: string
  avatar: string
  rating: number
  reviewCount: number
  address: string
  latitude: number
  longitude: number
  workingHours: { day: string; hours: string }[]
  contact: { phone: string; email: string }
}

export interface Booking {
  id: string
  serviceId: string
  userId: string
  date: string
  time: string
  selectedItems: ServiceItem[]
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  address: string
  locationDetails?: string
  appliedPromo?: Promo
  paymentMethod?: PaymentMethod
  eReceiptDetails?: EReceiptDetails
}

export interface Promo {
  id: string
  code: string
  discount: number 
  type: "percentage" | "fixed"
  description: string
}

export interface Wallet {
  userId: string
  balance: number
  currency: string
  transactions: Transaction[]
}

export interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "payment" | "refund"
  amount: number
  currency: string
  date: string
  description: string
  status: "completed" | "pending" | "failed"
}

export interface PaymentMethod {
  id: string
  type: "credit_card" | "paypal" | "apple_pay" | "google_pay" | "wallet"
  details: string 
  isDefault: boolean
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  receiverId: string
  content: string
  timestamp: string
  isRead: boolean
}

export interface Chat {
  id: string
  participants: string[] 
  lastMessage: string
  lastMessageTimestamp: string
  unreadCount: number
  otherParticipantName: string
  otherParticipantAvatar: string
  isOnline: boolean
}

export interface Call {
  id: string
  callerId: string
  receiverId: string
  callType: "incoming" | "outgoing"
  duration: string
  timestamp: string
  contactName: string
  contactImage: string
}

export interface EReceiptDetails {
  transactionId: string
  date: string
  time: string
  serviceName: string
  providerName: string
  items: { name: string; price: number }[]
  subtotal: number
  discount: number
  tax: number
  total: number
  paymentMethod: string
}


export interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  token: string | null
  isLoading: boolean
  error: string | null
}

export interface ProfileState {
  profile: UserProfile | null
  isLoading: boolean
  error: string | null
}

export interface ServiceState {
  services: Service[]
  categories: Category[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  filterCriteria: any 
  filteredServices: Service[]
}

export interface MessageState {
  chats: Chat[]
  messages: Message[]
  isLoading: boolean
  error: string | null
}

export interface WalletState {
  wallet: Wallet | null
  isLoading: boolean
  error: string | null
}

export interface TransactionState {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
}

export interface PaymentMethodState {
  paymentMethods: PaymentMethod[]
  isLoading: boolean
  error: string | null
}

export type { LatLng }
