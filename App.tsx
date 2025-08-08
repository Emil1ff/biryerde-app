import type React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import './i18n' 
import i18n from './i18n'

import type { RootStackParamList } from './src/Types/navigation';
import Onboarding from './src/Screens/AppStart/Onboarding';
import Splash from './src/Screens/AppStart/Splash';
import Auth from './src/Screens/Auth/Auth';
import Login from './src/Screens/Auth/Login';
import SignUp from './src/Screens/Auth/SignUp';
import ForgotPassword from './src/Screens/Auth/Forgot';
import Main from './src/Screens/Main';
import FillProfile from './src/Screens/Auth/FillProfile';
import CreatePin from './src/Screens/Auth/CreatePin';
import FingerPrint from './src/Screens/Auth/FingerPrint';
import Search from './src/Screens/Sub/Home/Search';
import Bookmark from './src/Screens/Sub/Home/Bookmark';
import SpecialOffers from './src/Screens/Sub/Home/SpecialOffers';
import Notification from './src/Screens/Sub/Home/Notification';
import PopularServices from './src/Screens/Sub/Home/PopularServices';
import Filter from './src/Screens/Sub/Home/Filter';
import AllServices from './src/Screens/Sub/Home/AllServices';
import ServiceListByCategoryScreen from './src/Screens/Sub/Home/ServiceListByCategoryScreen';
import EditProfile from './src/Screens/Sub/Profile/EditProfile';
import NotificationSettings from './src/Screens/Sub/Profile/NotificationSettngs';
import Payment from './src/Screens/Sub/Profile/Payment';
import AddCard from './src/Screens/Sub/Profile/AddCard';
import Security from './src/Screens/Sub/Profile/Security';
import Language from './src/Screens/Sub/Profile/Language';
import PrivacyPolicy from './src/Screens/Sub/Profile/PrivacyPolicy';
import InviteFriends from './src/Screens/Sub/Profile/InviteFriend';
import HelpCenter from './src/Screens/Sub/Profile/HelpCenter';
import Contact from './src/Screens/Sub/Profile/Contact';
import Call from './src/Screens/Sub/Call';
import ChatDetailScreen from './src/Screens/Sub/Home/ChatDetail';
import ServiceDetailScreen from './src/Screens/Sub/Home/ServiceDetail';
import AllReviewsScreen from './src/Screens/Sub/Home/AllServiceReview';
import AllPhotosAndVideosScreen from './src/Screens/Sub/Home/AllServicePhotos';
import ServiceCustomizationScreen from './src/Screens/Sub/Home/ServiceCustomization';
import BookingDetailsScreen from './src/Screens/Sub/Home/BookingDetails';
import AddPromoScreen from './src/Screens/Sub/Home/AddProme';
import PaymentMethodsScreen from './src/Screens/Sub/Home/PayMetods';
import ReviewSummaryScreen from './src/Screens/Sub/Home/RewievSummary';
import EnterPinScreen from './src/Screens/Sub/Home/EnterPin';
import BookingConfirmationScreen from './src/Screens/Sub/Home/BookingConfirmation';
import EReceiptScreen from './src/Screens/Sub/Home/EReceipt';
import CustomerService from './src/Screens/Sub/Home/CustomerService';
import WalletScreen from './src/Screens/Sub/Profile/Wallet';
import RewardsScreen from './src/Screens/Sub/Profile/Rewards';
import AchievementsScreen from './src/Screens/Sub/Profile/Achievements';
import AnalyticsScreen from './src/Screens/Sub/Profile/Analytics';
import AddPaymentMethodScreen from './src/Screens/Sub/Profile/AddPay';
import AllTransactionsScreen from './src/Screens/Sub/Profile/AllTransactions';
import AddMoneyScreen from './src/Screens/Sub/Profile/AddMoney';
import AddBookingScreen from './src/Screens/Sub/Profile/AddBooking';
import AllBookingsScreen from './src/Screens/Sub/Profile/AllBooking';
import AddressLocationScreen from './src/Screens/Sub/Home/Address';
import FilteredResultsScreen from './src/Screens/Sub/Home/FiltredResources';
import { I18nextProvider } from 'react-i18next';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
              presentation: 'card',
              animationTypeForReplace: 'push',
              ...(Platform.OS === 'android' && {
                animation: 'slide_from_right',
              }),
            }}
          >
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Auth" component={Auth} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="FillProfile" component={FillProfile} />
            <Stack.Screen name="CreatePIN" component={CreatePin} />
            <Stack.Screen name="SetFingerprint" component={FingerPrint} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="Bookmark" component={Bookmark} />
            <Stack.Screen name="SpecialOffers" component={SpecialOffers} />
            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen
              name="MostPopularServices"
              component={PopularServices}
            />
            <Stack.Screen name="Filter" component={Filter} />
            <Stack.Screen name="AllServices" component={AllServices} />
            <Stack.Screen
              name="ServiceListByCategory"
              component={ServiceListByCategoryScreen}
            />
            <Stack.Screen
              name="ServiceDetail"
              component={ServiceDetailScreen}
            />
            <Stack.Screen
              name="AllPhotosAndVideos"
              component={AllPhotosAndVideosScreen}
            />
            <Stack.Screen name="AllReviews" component={AllReviewsScreen} />
            <Stack.Screen
              name="ServiceCustomization"
              component={ServiceCustomizationScreen}
            />
            <Stack.Screen
              name="BookingDetails"
              component={BookingDetailsScreen}
            />
            <Stack.Screen name="AddPromo" component={AddPromoScreen} />
            <Stack.Screen
              name="AddressLocation"
              component={AddressLocationScreen}
            />
            <Stack.Screen
              name="PaymentMethods"
              component={PaymentMethodsScreen}
            />
            <Stack.Screen
              name="ReviewSummary"
              component={ReviewSummaryScreen}
            />
            <Stack.Screen name="EnterPIN" component={EnterPinScreen} />
            <Stack.Screen
              name="BookingConfirmation"
              component={BookingConfirmationScreen}
            />
            <Stack.Screen name="EReceipt" component={EReceiptScreen} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen
              name="NotificationSettings"
              component={NotificationSettings}
            />
            <Stack.Screen name="Payment" component={Payment} />
            <Stack.Screen name="AddNewCard" component={AddCard} />
            <Stack.Screen name="Security" component={Security} />
            <Stack.Screen name="Language" component={Language} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
            <Stack.Screen name="InviteFriends" component={InviteFriends} />
            <Stack.Screen name="HelpCenterFAQ" component={HelpCenter} />
            <Stack.Screen name="Contact" component={Contact} />
            <Stack.Screen
              name="CustomerServiceChat"
              component={CustomerService}
            />
            <Stack.Screen name="CallScreen" component={Call} />
            <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
            <Stack.Screen name="Wallet" component={WalletScreen} />
            <Stack.Screen name="Rewards" component={RewardsScreen} />
            <Stack.Screen name="Achievements" component={AchievementsScreen} />
            <Stack.Screen name="Analytics" component={AnalyticsScreen} />
            <Stack.Screen
              name="AddPaymentMethod"
              component={AddPaymentMethodScreen}
            />
            <Stack.Screen
              name="AllTransactions"
              component={AllTransactionsScreen}
            />
            <Stack.Screen name="AddMoney" component={AddMoneyScreen} />
            <Stack.Screen name="AddBooking" component={AddBookingScreen} />
            <Stack.Screen name="AllBookings" component={AllBookingsScreen} />
            <Stack.Screen
              name="FilteredResults"
              component={FilteredResultsScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
