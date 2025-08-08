import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import type { NavigatorScreenParams, CompositeScreenProps } from "@react-navigation/native"
import type { LatLng } from "react-native-maps" 

export type BottomTabParamList = {
  Home: undefined
  Bookings: undefined
  Calendar: undefined
  Inbox: undefined
  Profile: undefined
}

export type RootStackParamList = {
  FilteredResults: {
    filters: {}}
  Splash: undefined
  Onboarding: undefined
  Auth: { fromOnboarding?: boolean }
  Login: undefined
  SignUp: undefined
  FillProfile: undefined
  CreatePIN: undefined
  SetFingerprint: undefined
  Main: NavigatorScreenParams<BottomTabParamList>
  Search: { query?: string }
  Bookmark: undefined
  SpecialOffers: undefined
  Notification: undefined
  MostPopularServices: undefined
  AllServices: undefined
  ServiceListByCategory: { categoryId: string; categoryName: string }
  ServiceDetail: { serviceId: string; categoryId: string }
  AllPhotosAndVideos: { serviceId: string; categoryId: string }
  AllReviews: { serviceId: string; categoryId: string }
  Filter: undefined
  ServiceCustomization: { serviceId: string; categoryId: string }
  AddPaymentMethod: undefined
  AllTransactions: undefined
  AddMoney: undefined
  EnterPIN: undefined
  AddBooking: undefined
  AllBookings: undefined
  BookingDetails: { bookingId: string }
  AddPromo: { onSelectPromo: (promo: any) => void }
  AddressLocation: {
    serviceId: string
    categoryId: string
    selectedItems: any[] 
    totalPrice: number
    selectedDate: string | null
    selectedTime: string | null
    workingHours: number
    appliedPromo: any
  }
  PaymentMethods: {
    serviceId: string
    categoryId: string
    selectedItems: any[] 
    totalPrice: number
    selectedDate: string | null
    selectedTime: string | null
    workingHours: number
    appliedPromo: any
    address: string
    locationDetails: string
    selectedLocation: LatLng 
  }
  ReviewSummary: {
    serviceId: string
    categoryId: string
    selectedItems: { [key: string]: number }
    totalPrice: number
    selectedDate: string | null
    selectedTime: string | null
    workingHours: number
    appliedPromo: any
    address: string
    locationDetails: string
    selectedPaymentMethod: string | null
  }
  BookingConfirmation: {
    serviceId: string
    categoryId: string
    selectedItems: { [key: string]: number }
    totalPrice: number
    selectedDate: string | null
    selectedTime: string | null
    workingHours: number
    appliedPromo: any
    address: string
    locationDetails: string
    selectedPaymentMethod: string | null
  }
  EReceipt: {
    serviceId: string
    categoryId: string
    selectedItems: { [key: string]: number }
    totalPrice: number
    selectedDate: string | null
    selectedTime: string | null
    workingHours: number
    appliedPromo: any
    address: string
    locationDetails: string
    selectedPaymentMethod: string | null
  }
  EditProfile: undefined
  NotificationSettings: undefined
  Payment: undefined
  AddNewCard: undefined
  Security: undefined
  Language: undefined
  PrivacyPolicy: undefined
  InviteFriends: undefined
  HelpCenterFAQ: undefined
  Contact: undefined
  CustomerServiceChat: undefined
  CallScreen: { contactName: string; contactImage: string }
  ChatDetail: { chatId: string; senderName: string; senderImage: string; isOnline: boolean }
  Chat: undefined
  ForgotPassword: undefined
  Wallet: undefined
  Rewards: undefined
  Achievements: undefined
  Analytics: undefined
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type SplashScreenProps = NativeStackScreenProps<RootStackParamList, "Splash">
export type OnboardingProps = NativeStackScreenProps<RootStackParamList, "Onboarding">
export type AuthScreenProps = NativeStackScreenProps<RootStackParamList, "Auth">
export type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">
export type SignUpProps = NativeStackScreenProps<RootStackParamList, "SignUp">
export type FillProfileProps = NativeStackScreenProps<RootStackParamList, "FillProfile">
export type CreatePinProps = NativeStackScreenProps<RootStackParamList, "CreatePIN">
export type FingerPrintProps = NativeStackScreenProps<RootStackParamList, "SetFingerprint">
export type ServiceListByCategoryScreenProps = NativeStackScreenProps<RootStackParamList, "ServiceListByCategory">
export type ServiceDetailScreenProps = NativeStackScreenProps<RootStackParamList, "ServiceDetail">
export type AllPhotosAndVideosScreenProps = NativeStackScreenProps<RootStackParamList, "AllPhotosAndVideos">
export type AllReviewsScreenProps = NativeStackScreenProps<RootStackParamList, "AllReviews">
export type ServiceCustomizationScreenProps = NativeStackScreenProps<RootStackParamList, "ServiceCustomization">
export type BookingDetailsScreenProps = NativeStackScreenProps<RootStackParamList, "BookingDetails">
export type AddPromoScreenProps = NativeStackScreenProps<RootStackParamList, "AddPromo">
export type AddressLocationScreenProps = NativeStackScreenProps<RootStackParamList, "AddressLocation">
export type PaymentMethodsScreenProps = NativeStackScreenProps<RootStackParamList, "PaymentMethods">
export type ReviewSummaryScreenProps = NativeStackScreenProps<RootStackParamList, "ReviewSummary">
export type EnterPinScreenProps = NativeStackScreenProps<RootStackParamList, "EnterPIN">
export type BookingConfirmationScreenProps = NativeStackScreenProps<RootStackParamList, "BookingConfirmation">
export type EReceiptScreenProps = NativeStackScreenProps<RootStackParamList, "EReceipt">
export type BookmarkScreenProps = NativeStackScreenProps<RootStackParamList, "Bookmark">
export type SpecialOffersScreenProps = NativeStackScreenProps<RootStackParamList, "SpecialOffers">
export type NotificationScreenProps = NativeStackScreenProps<RootStackParamList, "Notification">
export type EditProfileScreenProps = NativeStackScreenProps<RootStackParamList, "EditProfile">
export type NotificationSettingsScreenProps = NativeStackScreenProps<RootStackParamList, "NotificationSettings">
export type PaymentScreenProps = NativeStackScreenProps<RootStackParamList, "Payment">
export type AddNewCardScreenProps = NativeStackScreenProps<RootStackParamList, "AddNewCard">
export type SecurityScreenProps = NativeStackScreenProps<RootStackParamList, "Security">
export type LanguageScreenProps = NativeStackScreenProps<RootStackParamList, "Language">
export type PrivacyPolicyScreenProps = NativeStackScreenProps<RootStackParamList, "PrivacyPolicy">
export type InviteFriendsScreenProps = NativeStackScreenProps<RootStackParamList, "InviteFriends">
export type HelpCenterFAQScreenProps = NativeStackScreenProps<RootStackParamList, "HelpCenterFAQ">
export type ContactScreenProps = NativeStackScreenProps<RootStackParamList, "Contact">
export type CustomerServiceChatScreenProps = NativeStackScreenProps<RootStackParamList, "CustomerServiceChat">
export type CallScreenProps = NativeStackScreenProps<RootStackParamList, "CallScreen">
export type ChatScreenProps = NativeStackScreenProps<RootStackParamList, "Chat">
export type ForgotPasswordProps = NativeStackScreenProps<RootStackParamList, "ForgotPassword">
export type ChatDetailScreenProps = NativeStackScreenProps<RootStackParamList, "ChatDetail">
export type SearchScreenProps = NativeStackScreenProps<RootStackParamList, "Search">
export type WalletScreenProps = NativeStackScreenProps<RootStackParamList, "Wallet">
export type RewardsScreenProps = NativeStackScreenProps<RootStackParamList, "Rewards">
export type AchievementsScreenProps = NativeStackScreenProps<RootStackParamList, "Achievements">
export type AnalyticsScreenProps = NativeStackScreenProps<RootStackParamList, "Analytics">
export type AddMoneyScreenProps = NativeStackScreenProps<RootStackParamList, "AddMoney">
export type AddPaymentMethodScreenProps = NativeStackScreenProps<RootStackParamList, "AddPaymentMethod">
export type AllTransactionsScreenProps = NativeStackScreenProps<RootStackParamList, "AllTransactions">
export type AddBookingScreenProps = NativeStackScreenProps<RootStackParamList, "AddBooking">
export type AllBookingsScreenProps = NativeStackScreenProps<RootStackParamList, "AllBookings">
export type HomeScreenPropsTab = BottomTabScreenProps<BottomTabParamList, "Home">
export type BookingsScreenPropsTab = BottomTabScreenProps<BottomTabParamList, "Bookings">
export type CalendarScreenPropsTab = BottomTabScreenProps<BottomTabParamList, "Calendar">
export type InboxScreenPropsTab = BottomTabScreenProps<BottomTabParamList, "Inbox">
export type ProfileScreenPropsTab = BottomTabScreenProps<BottomTabParamList, "Profile">
export type FilteredResultsScreenProps = NativeStackScreenProps<RootStackParamList, "FilteredResults">

export type HomeScreenPropsWithScroll = CompositeScreenProps<
  HomeScreenPropsTab,
  NativeStackScreenProps<RootStackParamList>
> & { onScroll: (event: any) => void }
export type BookingsScreenPropsWithScroll = CompositeScreenProps<
  BookingsScreenPropsTab,
  NativeStackScreenProps<RootStackParamList>
> & { onScroll: (event: any) => void }
export type CalendarScreenPropsWithScroll = CompositeScreenProps<
  CalendarScreenPropsTab,
  NativeStackScreenProps<RootStackParamList>
> & { onScroll: (event: any) => void }
export type InboxScreenPropsWithScroll = CompositeScreenProps<
  InboxScreenPropsTab,
  NativeStackScreenProps<RootStackParamList>
> & { onScroll: (event: any) => void }
export type ProfileScreenPropsWithScroll = CompositeScreenProps<
  ProfileScreenPropsTab,
  NativeStackScreenProps<RootStackParamList>
> & { onScroll: (event: any) => void }