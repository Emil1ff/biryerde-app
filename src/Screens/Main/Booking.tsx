"use client"
import type React from "react"
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react" // Added forwardRef, useImperativeHandle
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
  type FlatList, 
  Dimensions, 
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useNavigation } from "@react-navigation/native"
import MapView, { Marker } from "react-native-maps"
import type { BookingDetailsScreenProps, EReceiptScreenProps, InboxScreenPropsTab } from "../../Types/navigation"
import { useTranslation } from "react-i18next"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (screenWidth * percentage) / 100
const responsiveHeight = (percentage: number) => (screenHeight * percentage) / 100
const responsiveFontSize = (size: number) => size * (screenWidth / 375)

// if (Platform.OS === "android") {
//   if (UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true)
//   }
// }

interface Booking {
  id: string
  serviceName: string
  providerName: string
  date: string
  time: string
  status: "upcoming" | "completed" | "cancelled"
  price: number
  image: string
  backgroundColor: string
  address: string
  mapImage?: string
  latitude?: number
  longitude?: number
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "upcoming":
      return "#00BCD4"
    case "completed":
      return "#4CAF50"
    case "cancelled":
      return "#F44336"
    default:
      return "#9E9E9E"
  }
}

const getStatusText = (status: string, t: (key: string) => string) => {
  switch (status) {
    case "upcoming":
      return t("upcoming")
    case "completed":
      return t("completed")
    case "cancelled":
      return t("cancelled")
    default:
      return status
  }
}

const BookingCard: React.FC<{ item: Booking }> = ({ item }) => {
  const { t } = useTranslation()
  const navigation = useNavigation<
    BookingDetailsScreenProps["navigation"] & EReceiptScreenProps["navigation"] & InboxScreenPropsTab["navigation"]
  >()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const [isMapExpanded, setIsMapExpanded] = useState(false)
  const [isMoreOptionsModalVisible, setIsMoreOptionsModalVisible] = useState(false)

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  const toggleMapExpansion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setIsMapExpanded(!isMapExpanded)
  }

  const handleViewReceipt = () => {
    navigation.navigate("EReceipt", {
      serviceId: item.id,
      categoryId: "dummy-category",
      selectedItems: [],
      totalPrice: item.price.toString(),
      selectedDate: item.date,
      selectedTime: item.time,
      workingHours: "2",
      appliedPromo: null,
      address: item.address,
      selectedPaymentMethod: "mastercard",
    })
  }

  const handleBookingCardPress = () => {
    navigation.navigate("BookingDetails", { bookingId: item.id })
  }

  const handleMapPress = () => {
    if (item.latitude && item.longitude) {
      const scheme = Platform.select({
        ios: "maps:0,0?q=",
        android: "geo:0,0?q=",
      })
      const latLng = `${item.latitude},${item.longitude}`
      const label = encodeURIComponent(item.address)
      const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`,
      })
      if (url) {
        Linking.openURL(url).catch((err) => console.error("An error occurred", err))
      }
    } else {
      Alert.alert(t("locationNotAvailableTitle"), t("mapCoordinatesNotAvailableMessage"))
    }
  }

  const handleMessagePress = () => {
    navigation.navigate("Inbox", {
      screen: "Chat",
      params: {
        chatId: `provider-${item.providerName.replace(/\s/g, "")}`,
        participantName: item.providerName,
        participantImage: item.image,
      },
    })
  }

  const handleMoreOptionSelect = (option: string) => {
    setIsMoreOptionsModalVisible(false)
    switch (option) {
      case "viewDetails":
        handleBookingCardPress()
        break
      case "editBooking":
        Alert.alert(
          t("editBookingAlertTitle"),
          t("editBookingAlertMessage", {
            serviceName: item.serviceName,
          }),
        )
        // navigation.navigate("AddBooking", { bookingId: item.id }); // Example for navigating to edit screen
        break
      case "cancelBooking":
        Alert.alert(
          t("cancelBookingAlertTitle"),
          t("cancelBookingAlertMessage", {
            serviceName: item.serviceName,
          }),
        )
        break
      case "rescheduleBooking":
        Alert.alert(
          t("rescheduleBookingAlertTitle"),
          t("rescheduleBookingAlertMessage", {
            serviceName: item.serviceName,
          }),
        )
        break
    }
  }

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity style={styles.bookingItem} activeOpacity={0.8} onPress={handleBookingCardPress}>
        <View style={styles.cardContent}>
          <View style={[styles.serviceImageContainer, { backgroundColor: item.backgroundColor }]}>
            <Image source={{ uri: item.image }} style={styles.providerImage} />
          </View>
          <View style={styles.bookingInfo}>
            <View style={styles.bookingHeader}>
              <Text style={styles.serviceName}>{item.serviceName}</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.messageButton} onPress={handleMessagePress}>
                  <MaterialCommunityIcons name="message-text-outline" size={responsiveFontSize(20)} color="#B0BEC5" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.moreButton} onPress={() => setIsMoreOptionsModalVisible(true)}>
                  <MaterialCommunityIcons name="dots-horizontal" size={responsiveFontSize(20)} color="#B0BEC5" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.providerName}>{item.providerName}</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{getStatusText(item.status, t)}</Text>
              </View>
            </View>
            <View style={styles.bookingDetails}>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  size={responsiveFontSize(16)}
                  color="#B0BEC5"
                  style={styles.detailIcon}
                />
                <Text style={styles.detailText}>{item.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={responsiveFontSize(16)}
                  color="#B0BEC5"
                  style={styles.detailIcon}
                />
                <Text style={styles.detailText}>{item.time}</Text>
              </View>
            </View>
            <View style={styles.addressContainer}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={responsiveFontSize(16)}
                color="#B0BEC5"
                style={styles.detailIcon}
              />
              <Text style={styles.addressText}>{item.address}</Text>
            </View>
          </View>
        </View>
        {isMapExpanded && (
          <View>
            {(item.status === "completed" || item.status === "cancelled") && item.latitude && item.longitude && (
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
                      <Image source={{ uri: item.image }} style={styles.markerImage} />
                      <View style={styles.markerPin} />
                    </View>
                  </Marker>
                </MapView>
                <LinearGradient
                  colors={["#8B5CF6", "#A855F7"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.viewReceiptButtonGradient}
                >
                  <TouchableOpacity style={styles.viewReceiptButton} onPress={handleViewReceipt}>
                    <Text style={styles.viewReceiptButtonText}>{t("viewEReceipt")}</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            )}
            {item.status === "upcoming" && (
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>{t("cancelButton")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rescheduleButton}>
                  <LinearGradient
                    colors={["#8B5CF6", "#A855F7"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.rescheduleButtonGradient}
                  >
                    <Text style={styles.rescheduleButtonText}>{t("rescheduleButton")}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        <TouchableOpacity style={styles.expandCollapseButton} onPress={toggleMapExpansion}>
          <MaterialCommunityIcons
            name={isMapExpanded ? "chevron-up" : "chevron-down"}
            size={responsiveFontSize(24)}
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
            <TouchableOpacity style={styles.modalOption} onPress={() => handleMoreOptionSelect("viewDetails")}>
              <Text style={styles.modalOptionText}>{t("viewDetails")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleMoreOptionSelect("editBooking")}>
              <Text style={styles.modalOptionText}>{t("editBooking")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleMoreOptionSelect("rescheduleBooking")}>
              <Text style={styles.modalOptionText}>{t("rescheduleModal")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleMoreOptionSelect("cancelBooking")}>
              <Text style={[styles.modalOptionText, styles.modalOptionTextDanger]}>{t("cancelBookingModal")}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </Animated.View>
  )
}

interface BookingScreenProps {
  onScroll: (event: any) => void
}

// Define the type for the ref handle
export interface BookingRef {
  scrollToTop: () => void
}

const Booking = forwardRef<BookingRef, BookingScreenProps>(({ onScroll }, ref) => {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState(t("upcoming")) // Initialize with translated "upcoming"
  const tabs = [t("upcoming"), t("completed"), t("cancelled")]

  const flatListRef = useRef<FlatList<Booking>>(null) // Ref for the FlatList

  // Expose scrollToTop method via useImperativeHandle
  useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
    },
  }))

  const bookings: Booking[] = [
    {
      id: "1",
      serviceName: "Plumbing Repair",
      providerName: "Chantel Chadwick",
      date: "Dec 23, 2024",
      time: "10:00 AM",
      status: "upcoming",
      price: 25,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plumbing-repair-image.jpeg",
      backgroundColor: "#FFCDD2",
      address: "123 Main St, New York",
      latitude: 40.7128,
      longitude: -74.006,
      mapImage: "/placeholder.svg?height=120&width=300",
    },
    {
      id: "2",
      serviceName: "Appliance Service",
      providerName: "Kenny Spenceman",
      date: "Dec 24, 2024",
      time: "2:00 PM",
      status: "upcoming",
      price: 45,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/appliance-service-image.jpeg",
      backgroundColor: "#BBDEFB",
      address: "456 Oak Ave, Brooklyn",
      latitude: 40.6782,
      longitude: -73.9442,
      mapImage: "/placeholder.svg?height=120&width=300",
    },
    {
      id: "3",
      serviceName: "Laundry Services",
      providerName: "Phyllis Godley",
      date: "Dec 20, 2024",
      time: "9:00 AM",
      status: "upcoming",
      price: 30,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/laundry-services-image.jpeg",
      backgroundColor: "#C8E6C9",
      address: "789 Pine St, Manhattan",
      latitude: 40.7831,
      longitude: -73.9712,
      mapImage: "/placeholder.svg?height=120&width=300",
    },
    {
      id: "4",
      serviceName: "Home Cleaning",
      providerName: "Marygold Medley",
      date: "Dec 12, 2024",
      time: "10:00 AM",
      status: "completed",
      price: 60,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/home-cleaning-image.jpeg",
      backgroundColor: "#FFF9C4",
      address: "169 Carpenter Pass",
      latitude: 34.0522,
      longitude: -118.2437,
      mapImage: "/placeholder.svg?height=120&width=300",
    },
    {
      id: "5",
      serviceName: "Laundry Services",
      providerName: "Alfonso Schumacher",
      date: "Dec 08, 2024",
      time: "09:00 AM",
      status: "completed",
      price: 35,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/laundry-services-image-2.jpeg",
      backgroundColor: "#DCEDC8",
      address: "08099 Anhalt Alley",
      latitude: 34.0522,
      longitude: -118.2437,
      mapImage: "/placeholder.svg?height=120&width=300",
    },
    {
      id: "6",
      serviceName: "Painting the Walls",
      providerName: "Alfonso Schumacher",
      date: "Dec 04, 2024",
      time: "02:00 PM",
      status: "completed",
      price: 20,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/painting-walls-image.jpeg",
      backgroundColor: "#CFD8DC",
      address: "8620 Kropf Street",
      latitude: 34.0522,
      longitude: -118.2437,
      mapImage: "/placeholder.svg?height=120&width=300",
    },
    {
      id: "7",
      serviceName: "Plumbing Repair",
      providerName: "Chantel Chadwick",
      date: "Nov 20, 2024",
      time: "11:00 AM",
      status: "cancelled",
      price: 50,
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/plumbing-repair-image.jpeg",
      backgroundColor: "#FFCDD2",
      address: "123 Main St, New York",
      latitude: 40.7128,
      longitude: -74.006,
      mapImage: "/placeholder.svg?height=120&width=300",
    },
  ]

  const filteredBookings = bookings.filter((booking) => {
    switch (selectedTab) {
      case t("upcoming"):
        return booking.status === "upcoming"
      case t("completed"):
        return booking.status === "completed"
      case t("cancelled"):
        return booking.status === "cancelled"
      default:
        return true
    }
  })

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  }, [selectedTab])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("myBookings")}</Text>
        <TouchableOpacity style={styles.searchButton}>
          <MaterialCommunityIcons name="magnify" size={responsiveFontSize(24)} color="#E0E0E0" />
        </TouchableOpacity>
      </View>
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {filteredBookings.length > 0 ? (
        <Animated.FlatList
          ref={flatListRef} // Assign the ref to FlatList
          data={filteredBookings}
          renderItem={({ item }) => <BookingCard item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.bookingsList}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
      ) : (
        <View style={styles.emptyState}>
          <Image
            source={{
              uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vnr6ZBuF66UJXsvQhqD1b9DjgUbjO3.png",
            }}
            style={styles.emptyStateImage}
          />
          <Text style={styles.emptyStateTitle}>{t("noUpcomingBookingTitle")}</Text>
          <Text style={styles.emptyStateDescription}>{t("noUpcomingBookingDescription")}</Text>
          <TouchableOpacity style={styles.makeNewBookingButton}>
            <Text style={styles.makeNewBookingButtonText}>{t("makeNewBooking")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(1.5),
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    marginTop: responsiveHeight(5),
  },
  title: {
    fontSize: responsiveFontSize(26),
    fontWeight: "700",
    color: "#FFFFFF",
  },
  searchButton: {
    width: responsiveFontSize(44),
    height: responsiveFontSize(44),
    borderRadius: responsiveFontSize(22),
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  tabsWrapper: {
    backgroundColor: "#000000",
    paddingBottom: responsiveHeight(1),
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  tabsContent: {
    paddingHorizontal: responsiveWidth(5),
  },
  tab: {
    paddingHorizontal: responsiveWidth(4.5),
    paddingVertical: responsiveHeight(1.1),
    borderRadius: responsiveFontSize(20),
    marginRight: responsiveWidth(2.5),
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.4)",
    minWidth: responsiveWidth(22),
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  tabText: {
    fontSize: responsiveFontSize(14),
    color: "rgba(139, 92, 246, 0.9)",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  bookingsList: {
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(1.5),
    paddingBottom: responsiveHeight(12), // Adjusted for tab bar height
  },
  bookingItem: {
    backgroundColor: "#212121",
    borderRadius: responsiveFontSize(12),
    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(2),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: responsiveHeight(0.4) },
    shadowOpacity: 0.3,
    shadowRadius: responsiveFontSize(5),
    elevation: 8,
  },
  cardContent: {
    flexDirection: "row",
    marginBottom: responsiveHeight(1.5),
  },
  serviceImageContainer: {
    width: responsiveFontSize(70),
    height: responsiveFontSize(70),
    borderRadius: responsiveFontSize(10),
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsiveWidth(4),
    overflow: "hidden",
  },
  providerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bookingInfo: {
    flex: 1,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsiveHeight(0.5),
  },
  serviceName: {
    fontSize: responsiveFontSize(17),
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    marginRight: responsiveWidth(2),
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  messageButton: {
    width: responsiveFontSize(32),
    height: responsiveFontSize(32),
    borderRadius: responsiveFontSize(16),
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsiveWidth(2),
  },
  moreButton: {
    padding: responsiveFontSize(4),
  },
  providerName: {
    fontSize: responsiveFontSize(13),
    color: "#B0BEC5",
    marginBottom: responsiveHeight(1),
  },
  statusRow: {
    marginBottom: responsiveHeight(1.5),
  },
  statusBadge: {
    paddingHorizontal: responsiveWidth(2.5),
    paddingVertical: responsiveHeight(0.5),
    borderRadius: responsiveFontSize(12),
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: responsiveFontSize(11),
    color: "#FFFFFF",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  bookingDetails: {
    flexDirection: "row",
    marginBottom: responsiveHeight(1),
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: responsiveWidth(5),
  },
  detailIcon: {
    marginRight: responsiveWidth(1.5),
  },
  detailText: {
    fontSize: responsiveFontSize(13),
    color: "#CFD8DC",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressText: {
    fontSize: responsiveFontSize(13),
    color: "#B0BEC5",
    flex: 1,
  },
  mapContainer: {
    width: "100%",
    height: responsiveHeight(30), // Adjusted map height
    borderRadius: responsiveFontSize(8),
    overflow: "hidden",
    marginTop: responsiveHeight(1.5),
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  customMarker: {
    alignItems: "center",
    justifyContent: "center",
    width: responsiveFontSize(50),
    height: responsiveFontSize(50),
  },
  markerImage: {
    width: responsiveFontSize(40),
    height: responsiveFontSize(40),
    borderRadius: responsiveFontSize(20),
    borderWidth: 2,
    borderColor: "#8B5CF6",
  },
  markerPin: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: responsiveFontSize(8),
    borderRightWidth: responsiveFontSize(8),
    borderTopWidth: responsiveFontSize(16),
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#8B5CF6",
    marginTop: responsiveHeight(-0.5),
  },
  viewReceiptButtonGradient: {
    position: "absolute",
    bottom: responsiveHeight(1.2),
    left: responsiveWidth(2.5),
    right: responsiveWidth(2.5),
    borderRadius: responsiveFontSize(10),
    overflow: "hidden",
  },
  viewReceiptButton: {
    paddingVertical: responsiveHeight(1.5),
    alignItems: "center",
  },
  viewReceiptButtonText: {
    fontSize: responsiveFontSize(14),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: responsiveHeight(1.2),
  },
  cancelButton: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.2),
    borderRadius: responsiveFontSize(20),
    backgroundColor: "rgba(244, 67, 54, 0.15)",
    marginRight: responsiveWidth(2),
    borderWidth: 1,
    borderColor: "#F44336",
  },
  cancelButtonText: {
    fontSize: responsiveFontSize(13),
    color: "#F44336",
    fontWeight: "600",
  },
  rescheduleButton: {
    borderRadius: responsiveFontSize(20),
    overflow: "hidden",
  },
  rescheduleButtonGradient: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.2),
    borderRadius: responsiveFontSize(20),
  },
  rescheduleButtonText: {
    fontSize: responsiveFontSize(13),
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(10),
    marginTop: responsiveHeight(6),
  },
  emptyStateImage: {
    width: responsiveFontSize(150),
    height: responsiveFontSize(150),
    resizeMode: "contain",
    marginBottom: responsiveHeight(2.5),
  },
  emptyStateTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: responsiveHeight(1.2),
    textAlign: "center",
  },
  emptyStateDescription: {
    fontSize: responsiveFontSize(14),
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: responsiveFontSize(20),
    marginBottom: responsiveHeight(2.5),
  },
  makeNewBookingButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(6),
    borderRadius: responsiveFontSize(25),
  },
  makeNewBookingButtonText: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(16),
    fontWeight: "bold",
  },
  expandCollapseButton: {
    alignSelf: "center",
    marginTop: responsiveHeight(1.2),
    padding: responsiveFontSize(5),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#212121",
    borderTopLeftRadius: responsiveFontSize(20),
    borderTopRightRadius: responsiveFontSize(20),
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1.2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: responsiveHeight(-0.5) },
    shadowOpacity: 0.3,
    shadowRadius: responsiveFontSize(10),
    elevation: 15,
  },
  modalOption: {
    paddingVertical: responsiveHeight(1.8),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalOptionText: {
    fontSize: responsiveFontSize(18),
    color: "#FFFFFF",
    fontWeight: "500",
    textAlign: "center",
  },
  modalOptionTextDanger: {
    color: "#EF4444",
  },
})

export default Booking
