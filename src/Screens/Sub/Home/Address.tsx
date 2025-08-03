"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native"
import MapView, { Marker, type LatLng } from "react-native-maps"
import Icon from "react-native-vector-icons/Ionicons"
import { useDispatch, useSelector } from "react-redux"
import type { AddressLocationScreenProps } from "../../../Types/navigation"
import { updateBookingAddress } from "../../../redux/slices/bookingSlice"
import type { RootState } from "../../../redux/store"

const { width, height } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (width * percentage) / 100
const responsiveHeight = (percentage: number) => (height * percentage) / 100
const responsiveFontSize = (size: number) => size * (width / 375)

const AddressLocationScreen: React.FC<AddressLocationScreenProps> = ({ route, navigation }) => {
  const { serviceId, categoryId, selectedItems, totalPrice, selectedDate, selectedTime, workingHours, appliedPromo } =
    route.params

  const dispatch = useDispatch()
  const currentBookingAddress = useSelector((state: RootState) => state.booking.currentBookingAddress)

  const [address, setAddress] = useState(currentBookingAddress?.address || "255 Grand Park Avenue, New York")
  const [locationDetails, setLocationDetails] = useState(currentBookingAddress?.details || "")
  const [selectedLocation, setSelectedLocation] = useState<LatLng>(
    currentBookingAddress?.coords || { latitude: 40.758, longitude: -73.9855 },
  )

  useEffect(() => {
    console.log("Location changed:", { coords: selectedLocation, address, details: locationDetails })
  }, [selectedLocation, address, locationDetails]) // [^1]

  const handleMapPress = (event: { nativeEvent: { coordinate: LatLng } }) => {
    const newCoords = event.nativeEvent.coordinate
    setSelectedLocation(newCoords)
    console.log("New map location selected:", newCoords)
    Alert.alert(
      "Location Selected",
      `Latitude: ${newCoords.latitude.toFixed(4)}\nLongitude: ${newCoords.longitude.toFixed(4)}`,
    )
  }

  const handleContinue = () => {
    // Redux store-u ünvan məlumatları ilə yeniləyin
    dispatch(updateBookingAddress({ address, details: locationDetails, coords: selectedLocation }))

    // Bütün xidmət məlumatlarını və yenilənmiş ünvan detallarını PaymentMethods ekranına ötürün
    navigation.navigate("PaymentMethods", {
      serviceId,
      categoryId,
      selectedItems,
      totalPrice,
      selectedDate,
      selectedTime,
      workingHours,
      appliedPromo,
      address, // Yenilənmiş ünvan
      details: locationDetails, // Yenilənmiş detallar
      coords: selectedLocation, // Yenilənmiş koordinatlar
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={responsiveFontSize(24)} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Address/Location</Text>
        <View style={{ width: responsiveFontSize(40) }} />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={handleMapPress}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            <Marker coordinate={selectedLocation} title={"Selected Location"} description={address}>
              <View style={styles.customMarker}>
                <Icon name="location-sharp" size={responsiveFontSize(36)} color="#8B5CF6" />
              </View>
            </Marker>
          </MapView>
          <TouchableOpacity
            style={styles.changeMapButton}
            onPress={() =>
              Alert.alert("Change Location", "This would open a more advanced location search/selection interface.")
            }
          >
            <Text style={styles.changeMapButtonText}>Change Location</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Details</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your address"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={address}
              onChangeText={setAddress}
            />
            <TouchableOpacity onPress={() => Alert.alert("Edit Address", "This would allow editing the address text.")}>
              <Icon name="pencil-outline" size={responsiveFontSize(20)} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            placeholder="Additional details (e.g., apartment number, gate code)"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={locationDetails}
            onChangeText={setLocationDetails}
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(7),
    paddingBottom: responsiveHeight(2.5),
  },
  backButton: {
    width: responsiveFontSize(40),
    height: responsiveFontSize(40),
    borderRadius: responsiveFontSize(20),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1.5),
  },
  mapContainer: {
    width: "100%",
    height: responsiveHeight(35),
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: responsiveHeight(3),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  customMarker: {
    justifyContent: "center",
    alignItems: "center",
  },
  changeMapButton: {
    position: "absolute",
    bottom: responsiveHeight(2),
    backgroundColor: "rgba(139, 92, 246, 0.8)",
    borderRadius: 10,
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(4),
  },
  changeMapButtonText: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(14),
    fontWeight: "600",
  },
  section: {
    marginBottom: responsiveHeight(3),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: responsiveHeight(2),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    paddingHorizontal: responsiveWidth(4),
    height: responsiveHeight(7),
    marginBottom: responsiveHeight(1.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  textInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: responsiveFontSize(16),
    fontWeight: "500",
  },
  multilineInput: {
    height: responsiveHeight(15),
    paddingTop: responsiveHeight(2),
    textAlignVertical: "top",
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    paddingHorizontal: responsiveWidth(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  bottomBar: {
    paddingVertical: responsiveHeight(2.5),
    paddingHorizontal: responsiveWidth(5),
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#1A1A2E",
  },
  continueButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(8),
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(17),
    fontWeight: "bold",
  },
})

export default AddressLocationScreen
