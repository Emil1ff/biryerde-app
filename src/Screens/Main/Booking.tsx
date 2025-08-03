'use client';
import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  Modal,
  Alert,
  Linking,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import type {
  BookingDetailsScreenProps,
  EReceiptScreenProps,
  InboxScreenPropsTab,
} from '../../Types/navigation'; 

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Booking {
  id: string;
  serviceName: string;
  providerName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
  image: string;
  backgroundColor: string;
  address: string;
  mapImage?: string;
  latitude?: number;
  longitude?: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'upcoming':
      return '#00BCD4';
    case 'completed':
      return '#4CAF50';
    case 'cancelled':
      return '#F44336';
    default:
      return '#9E9E9E';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'upcoming':
      return 'Upcoming';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

const BookingCard: React.FC<{ item: Booking }> = ({ item }) => {
  const navigation = useNavigation<
    BookingDetailsScreenProps['navigation'] &
      EReceiptScreenProps['navigation'] &
      InboxScreenPropsTab['navigation']
  >();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isMoreOptionsModalVisible, setIsMoreOptionsModalVisible] =
    useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const toggleMapExpansion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsMapExpanded(!isMapExpanded);
  };

  const handleViewReceipt = () => {
    navigation.navigate('EReceipt', {
      serviceId: item.id,
      categoryId: 'dummy-category',
      selectedItems: [],
      totalPrice: item.price.toString(),
      selectedDate: item.date,
      selectedTime: item.time,
      workingHours: '2',
      appliedPromo: null,
      address: item.address,
      selectedPaymentMethod: 'mastercard',
    });
  };

  const handleBookingCardPress = () => {
    navigation.navigate('BookingDetails', { bookingId: item.id });
  };

  const handleMapPress = () => {
    if (item.latitude && item.longitude) {
      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });
      const latLng = `${item.latitude},${item.longitude}`;
      const label = encodeURIComponent(item.address);
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      });

      if (url) {
        Linking.openURL(url).catch(err =>
          console.error('An error occurred', err),
        );
      }
    } else {
      Alert.alert(
        'Location Not Available',
        'Map coordinates are not available for this booking.',
      );
    }
  };

  const handleMessagePress = () => {
    navigation.navigate('Inbox', {
      screen: 'Chat',
      params: {
        chatId: `provider-${item.providerName.replace(/\s/g, '')}`,
        participantName: item.providerName,
        participantImage: item.image,
      },
    });
  };

  const handleMoreOptionSelect = (option: string) => {
    setIsMoreOptionsModalVisible(false);
    switch (option) {
      case 'viewDetails':
        handleBookingCardPress();
        break;
      case 'editBooking':
        Alert.alert('Edit Booking', `Edit booking for ${item.serviceName}`);
        // navigation.navigate("AddBooking", { bookingId: item.id }); // Example for navigating to edit screen
        break;
      case 'cancelBooking':
        Alert.alert('Cancel Booking', `Cancel booking for ${item.serviceName}`);
        break;
      case 'rescheduleBooking':
        Alert.alert(
          'Reschedule Booking',
          `Reschedule booking for ${item.serviceName}`,
        );
        break;
    }
  };

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={styles.bookingItem}
        activeOpacity={0.8}
        onPress={handleBookingCardPress}
      >
        <View style={styles.cardContent}>
          <View
            style={[
              styles.serviceImageContainer,
              { backgroundColor: item.backgroundColor },
            ]}
          >
            <Image source={{ uri: item.image }} style={styles.providerImage} />
          </View>
          <View style={styles.bookingInfo}>
            <View style={styles.bookingHeader}>
              <Text style={styles.serviceName}>{item.serviceName}</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.messageButton}
                  onPress={handleMessagePress}
                >
                  <MaterialCommunityIcons
                    name="message-text-outline"
                    size={20}
                    color="#B0BEC5"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.moreButton}
                  onPress={() => setIsMoreOptionsModalVisible(true)}
                >
                  <MaterialCommunityIcons
                    name="dots-horizontal"
                    size={20}
                    color="#B0BEC5"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.providerName}>{item.providerName}</Text>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getStatusText(item.status)}
                </Text>
              </View>
            </View>
            <View style={styles.bookingDetails}>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={16}
                  color="#B0BEC5"
                  style={styles.detailIcon}
                />
                <Text style={styles.detailText}>{item.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={16}
                  color="#B0BEC5"
                  style={styles.detailIcon}
                />
                <Text style={styles.detailText}>{item.time}</Text>
              </View>
            </View>
            <View style={styles.addressContainer}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={16}
                color="#B0BEC5"
                style={styles.detailIcon}
              />
              <Text style={styles.addressText}>{item.address}</Text>
            </View>
          </View>
        </View>

        {isMapExpanded && (
          <View>
            {(item.status === 'completed' || item.status === 'cancelled') &&
              item.latitude &&
              item.longitude && (
                <View style={styles.mapContainer}>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}
                    onPress={handleMapPress}
                  >
                    <Marker
                      coordinate={{
                        latitude: item.latitude,
                        longitude: item.longitude,
                      }}
                    >
                      <View style={styles.customMarker}>
                        <Image
                          source={{ uri: item.image }}
                          style={styles.markerImage}
                        />
                        <View style={styles.markerPin} />
                      </View>
                    </Marker>
                  </MapView>
                  <LinearGradient
                    colors={['#8B5CF6', '#A855F7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.viewReceiptButtonGradient}
                  >
                    <TouchableOpacity
                      style={styles.viewReceiptButton}
                      onPress={handleViewReceipt}
                    >
                      <Text style={styles.viewReceiptButtonText}>
                        View E-Receipt
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              )}
            {item.status === 'upcoming' && (
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rescheduleButton}>
                  <LinearGradient
                    colors={['#8B5CF6', '#A855F7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.rescheduleButtonGradient}
                  >
                    <Text style={styles.rescheduleButtonText}>Reschedule</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          style={styles.expandCollapseButton}
          onPress={toggleMapExpansion}
        >
          <MaterialCommunityIcons
            name={isMapExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#B0BEC5"
          />
        </TouchableOpacity>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isMoreOptionsModalVisible}
        onRequestClose={() => setIsMoreOptionsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsMoreOptionsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleMoreOptionSelect('viewDetails')}
            >
              <Text style={styles.modalOptionText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleMoreOptionSelect('editBooking')}
            >
              <Text style={styles.modalOptionText}>Edit Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleMoreOptionSelect('rescheduleBooking')}
            >
              <Text style={styles.modalOptionText}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleMoreOptionSelect('cancelBooking')}
            >
              <Text
                style={[styles.modalOptionText, styles.modalOptionTextDanger]}
              >
                Cancel Booking
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </Animated.View>
  );
};

interface BookingScreenProps {
  onScroll: (event: any) => void;
}

const Booking: React.FC<BookingScreenProps> = ({ onScroll }) => {
  const [selectedTab, setSelectedTab] = useState('Upcoming');
  const tabs = ['Upcoming', 'Completed', 'Cancelled'];
  const bookings: Booking[] = [
    {
      id: '1',
      serviceName: 'Plumbing Repair',
      providerName: 'Chantel Chadwick',
      date: 'Dec 23, 2024',
      time: '10:00 AM',
      status: 'upcoming',
      price: 25,
      image:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plumbing-repair-image.jpeg',
      backgroundColor: '#FFCDD2',
      address: '123 Main St, New York',
      latitude: 40.7128,
      longitude: -74.006,
      mapImage: '/placeholder.svg?height=120&width=300',
    },
    {
      id: '2',
      serviceName: 'Appliance Service',
      providerName: 'Kenny Spenceman',
      date: 'Dec 24, 2024',
      time: '2:00 PM',
      status: 'upcoming',
      price: 45,
      image:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/appliance-service-image.jpeg',
      backgroundColor: '#BBDEFB',
      address: '456 Oak Ave, Brooklyn',
      latitude: 40.6782,
      longitude: -73.9442,
      mapImage: '/placeholder.svg?height=120&width=300',
    },
    {
      id: '3',
      serviceName: 'Laundry Services',
      providerName: 'Phyllis Godley',
      date: 'Dec 20, 2024',
      time: '9:00 AM',
      status: 'upcoming',
      price: 30,
      image:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/laundry-services-image.jpeg',
      backgroundColor: '#C8E6C9',
      address: '789 Pine St, Manhattan',
      latitude: 40.7831,
      longitude: -73.9712,
      mapImage: '/placeholder.svg?height=120&width=300',
    },
    {
      id: '4',
      serviceName: 'Home Cleaning',
      providerName: 'Marygold Medley',
      date: 'Dec 12, 2024',
      time: '10:00 AM',
      status: 'completed',
      price: 60,
      image:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/home-cleaning-image.jpeg',
      backgroundColor: '#FFF9C4',
      address: '169 Carpenter Pass',
      latitude: 34.0522,
      longitude: -118.2437,
      mapImage: '/placeholder.svg?height=120&width=300',
    },
    {
      id: '5',
      serviceName: 'Laundry Services',
      providerName: 'Alfonso Schumacher',
      date: 'Dec 08, 2024',
      time: '09:00 AM',
      status: 'completed',
      price: 35,
      image:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/laundry-services-image-2.jpeg',
      backgroundColor: '#DCEDC8',
      address: '08099 Anhalt Alley',
      latitude: 34.0522,
      longitude: -118.2437,
      mapImage: '/placeholder.svg?height=120&width=300',
    },
    {
      id: '6',
      serviceName: 'Painting the Walls',
      providerName: 'Alfonso Schumacher',
      date: 'Dec 04, 2024',
      time: '02:00 PM',
      status: 'completed',
      price: 20,
      image:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/painting-walls-image.jpeg',
      backgroundColor: '#CFD8DC',
      address: '8620 Kropf Street',
      latitude: 34.0522,
      longitude: -118.2437,
      mapImage: '/placeholder.svg?height=120&width=300',
    },
    {
      id: '7',
      serviceName: 'Plumbing Repair',
      providerName: 'Chantel Chadwick',
      date: 'Nov 20, 2024',
      time: '11:00 AM',
      status: 'cancelled',
      price: 50,
      image:
        'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plumbing-repair-image.jpeg',
      backgroundColor: '#FFCDD2',
      address: '123 Main St, New York',
      latitude: 40.7128,
      longitude: -74.006,
      mapImage: '/placeholder.svg?height=120&width=300',
    },
  ];
  const filteredBookings = bookings.filter(booking => {
    switch (selectedTab) {
      case 'Upcoming':
        return booking.status === 'upcoming';
      case 'Completed':
        return booking.status === 'completed';
      case 'Cancelled':
        return booking.status === 'cancelled';
      default:
        return true;
    }
  });
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [selectedTab]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <TouchableOpacity style={styles.searchButton}>
          <MaterialCommunityIcons name="magnify" size={24} color="#E0E0E0" />
        </TouchableOpacity>
      </View>
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {filteredBookings.length > 0 ? (
        <Animated.FlatList
          data={filteredBookings}
          renderItem={({ item }) => <BookingCard item={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.bookingsList}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
      ) : (
        <View style={styles.emptyState}>
          <Image
            source={{
              uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vnr6ZBuF66UJXsvQhqD1b9DjgUbjO3.png',
            }}
            style={styles.emptyStateImage}
          />
          <Text style={styles.emptyStateTitle}>
            You have no upcoming booking
          </Text>
          <Text style={styles.emptyStateDescription}>
            You do not have an upcoming booking. Make a new booking by clicking
            the button below
          </Text>
          <TouchableOpacity style={styles.makeNewBookingButton}>
            <Text style={styles.makeNewBookingButtonText}>
              Make New Booking
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsWrapper: {
    backgroundColor: '#000000',
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabsContent: {
    paddingHorizontal: 20,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    minWidth: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 14,
    color: 'rgba(139, 92, 246, 0.9)',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  bookingsList: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 100,
  },
  bookingItem: {
    backgroundColor: '#212121',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  serviceImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  providerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bookingInfo: {
    flex: 1,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  moreButton: {
    padding: 4,
  },
  providerName: {
    fontSize: 13,
    color: '#B0BEC5',
    marginBottom: 8,
  },
  statusRow: {
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bookingDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailIcon: {
    marginRight: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#CFD8DC',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 13,
    color: '#B0BEC5',
    flex: 1,
  },
  mapContainer: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 12,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  markerPin: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#8B5CF6',
    marginTop: -4,
  },
  viewReceiptButtonGradient: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  viewReceiptButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewReceiptButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  cancelButtonText: {
    fontSize: 13,
    color: '#F44336',
    fontWeight: '600',
  },
  rescheduleButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  rescheduleButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  rescheduleButtonText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 50,
  },
  emptyStateImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  makeNewBookingButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  makeNewBookingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  expandCollapseButton: {
    alignSelf: 'center',
    marginTop: 10,
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#212121',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalOptionText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  modalOptionTextDanger: {
    color: '#EF4444',
  },
});

export default Booking;
