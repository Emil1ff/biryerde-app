"use client"
import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
  ScrollView,
  Dimensions, // Import Dimensions for responsive sizing
  Modal, // For the country code picker modal
  FlatList, // For the list of country codes
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons" // For general icons
import type { FillProfileProps } from "../../Types/navigation"

// Responsive sizing utilities
const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (screenWidth * percentage) / 100
const responsiveHeight = (percentage: number) => (screenHeight * percentage) / 100
const responsiveFontSize = (size: number) => size * (screenWidth / 375)

interface CountryCode {
  code: string
  dial_code: string
  name: string
  flag: string // Placeholder for flag, could be actual image URI or emoji
}

const countryCodes: CountryCode[] = [
  { code: "US", dial_code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "GB", dial_code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AZ", dial_code: "+994", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "RU", dial_code: "+7", name: "Russia", flag: "🇷🇺" },
  { code: "DE", dial_code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "FR", dial_code: "+33", name: "France", flag: "🇫🇷" },
  { code: "CA", dial_code: "+1", name: "Canada", flag: "🇨🇦" },
]

const FillProfile: React.FC<FillProfileProps> = ({ navigation }) => {
  const [fullName, setFullName] = useState("")
  const [nickname, setNickname] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isCountryCodeModalVisible, setIsCountryCodeModalVisible] = useState(false)
  const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCode>(countryCodes[0]) // Default to US

  const handleContinue = () => {
    if (!fullName || !email) {
      Alert.alert("Error", "Please fill in required fields (Full Name and Email).")
      return
    }
    navigation.navigate("CreatePIN")
  }

  const handleImagePicker = () => {
    Alert.alert("Image Picker", "Image picker functionality would be implemented here.")
  }

  const handleBackPress = () => {
    navigation.goBack()
  }

  const handleSelectCountryCode = (country: CountryCode) => {
    setSelectedCountryCode(country)
    setIsCountryCodeModalVisible(false)
  }

  const renderCountryCodeItem = ({ item }: { item: CountryCode }) => (
    <TouchableOpacity style={styles.countryCodeItem} onPress={() => handleSelectCountryCode(item)}>
      <Text style={styles.countryCodeFlag}>{item.flag}</Text>
      <Text style={styles.countryCodeName}>{item.name}</Text>
      <Text style={styles.countryCodeDialCode}>{item.dial_code}</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // Ensures keyboard dismissal works well with touchables
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Icon name="arrow-back" size={responsiveFontSize(24)} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>Fill Your Profile</Text>
          </View>

          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <TouchableOpacity style={styles.profileImageWrapper} onPress={handleImagePicker}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Icon name="person-outline" size={responsiveFontSize(50)} color="rgba(255, 255, 255, 0.6)" />
                </View>
              )}
              <View style={styles.editIconContainer}>
                <LinearGradient
                  colors={["#8B5CF6", "#A855F7"]}
                  style={styles.editIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Icon name="pencil-outline" size={responsiveFontSize(18)} color="#FFFFFF" />
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </View>

          {/* Form Inputs */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full Name"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder="Nickname"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputWithIcon}
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                placeholder="Date of Birth (DD/MM/YYYY)"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.inputIcon}>
                <Icon name="calendar-outline" size={responsiveFontSize(20)} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputWithIcon}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity style={styles.inputIcon}>
                <Icon name="mail-outline" size={responsiveFontSize(20)} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.phoneInputContainer}>
                <TouchableOpacity style={styles.countryCodePicker} onPress={() => setIsCountryCodeModalVisible(true)}>
                  <Text style={styles.countryCodeFlag}>{selectedCountryCode.flag}</Text>
                  <Text style={styles.countryCodeText}>{selectedCountryCode.dial_code}</Text>
                  <Icon name="chevron-down" size={responsiveFontSize(16)} color="rgba(255, 255, 255, 0.6)" />
                </TouchableOpacity>
                <TextInput
                  style={styles.phoneInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Phone Number"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.inputWithIcon, styles.addressInput]}
                value={address}
                onChangeText={setAddress}
                placeholder="Address"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                multiline
                numberOfLines={3}
              />
              <TouchableOpacity style={[styles.inputIcon, styles.addressIcon]}>
                <Icon name="location-outline" size={responsiveFontSize(20)} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity style={styles.continueButtonContainer} onPress={handleContinue}>
            <LinearGradient
              colors={["#8B5CF6", "#A855F7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.continueButton}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Country Code Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCountryCodeModalVisible}
        onRequestClose={() => setIsCountryCodeModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsCountryCodeModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Country Code</Text>
            <FlatList
              data={countryCodes}
              renderItem={renderCountryCodeItem}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
              style={styles.countryCodeList}
            />
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsCountryCodeModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(5),
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(3),
  },
  backButton: {
    width: responsiveFontSize(40),
    height: responsiveFontSize(40),
    borderRadius: responsiveFontSize(20),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: responsiveFontSize(28),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: responsiveWidth(5),
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: responsiveHeight(4),
  },
  profileImageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: responsiveFontSize(120),
    height: responsiveFontSize(120),
    borderRadius: responsiveFontSize(60),
  },
  profileImagePlaceholder: {
    width: responsiveFontSize(120),
    height: responsiveFontSize(120),
    borderRadius: responsiveFontSize(60),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  editIcon: {
    width: responsiveFontSize(36),
    height: responsiveFontSize(36),
    borderRadius: responsiveFontSize(18),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  formContainer: {
    marginBottom: responsiveHeight(4),
  },
  inputContainer: {
    marginBottom: responsiveHeight(2.5),
    position: "relative",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: responsiveFontSize(12),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    color: "#FFFFFF",
    fontSize: responsiveFontSize(16),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  inputWithIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: responsiveFontSize(12),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    color: "#FFFFFF",
    fontSize: responsiveFontSize(16),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingRight: responsiveWidth(12), // Make space for the icon
  },
  inputIcon: {
    position: "absolute",
    right: responsiveWidth(4),
    top: "50%",
    transform: [{ translateY: -responsiveFontSize(10) }], // Center vertically
    width: responsiveFontSize(24),
    height: responsiveFontSize(24),
    justifyContent: "center",
    alignItems: "center",
  },
  addressInput: {
    minHeight: responsiveHeight(10), // Adjust height for multiline
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(2),
    textAlignVertical: "top", // Align text to top for multiline
  },
  addressIcon: {
    top: responsiveHeight(2), // Align icon to top for multiline
    transform: [{ translateY: 0 }],
  },
  phoneInputContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: responsiveFontSize(12),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
    alignItems: "center",
  },
  countryCodePicker: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    borderRightWidth: 1,
    borderRightColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.05)", // Slightly different background
  },
  countryCodeFlag: {
    fontSize: responsiveFontSize(20),
    marginRight: responsiveWidth(2),
  },
  countryCodeText: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(16),
    fontWeight: "500",
    marginRight: responsiveWidth(1),
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    color: "#FFFFFF",
    fontSize: responsiveFontSize(16),
  },
  continueButtonContainer: {
    marginTop: responsiveHeight(2),
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: responsiveHeight(0.6) },
    shadowOpacity: 0.4,
    shadowRadius: responsiveFontSize(8),
    elevation: 10,
  },
  continueButton: {
    height: responsiveHeight(7),
    borderRadius: responsiveFontSize(28),
    justifyContent: "center",
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(18),
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1A1A1A",
    borderRadius: responsiveFontSize(16),
    padding: responsiveWidth(6),
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: responsiveHeight(0.5) },
    shadowOpacity: 0.3,
    shadowRadius: responsiveFontSize(8),
    elevation: 10,
  },
  modalTitle: {
    fontSize: responsiveFontSize(22),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: responsiveHeight(2.5),
    textAlign: "center",
  },
  countryCodeList: {
    flexGrow: 0, // Important for FlatList inside ScrollView
    maxHeight: responsiveHeight(50), // Limit height to prevent overflow
  },
  countryCodeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: responsiveHeight(1.5),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  countryCodeFlag: {
    fontSize: responsiveFontSize(20),
    marginRight: responsiveWidth(3),
  },
  countryCodeName: {
    flex: 1,
    fontSize: responsiveFontSize(16),
    color: "#E0E0E0",
  },
  countryCodeDialCode: {
    fontSize: responsiveFontSize(16),
    color: "#8B5CF6",
    fontWeight: "600",
  },
  modalCloseButton: {
    marginTop: responsiveHeight(2.5),
    backgroundColor: "#8B5CF6",
    borderRadius: responsiveFontSize(12),
    paddingVertical: responsiveHeight(1.5),
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(16),
    fontWeight: "bold",
  },
})

export default FillProfile
