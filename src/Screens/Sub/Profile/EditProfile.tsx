"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, TextInput } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import LinearGradient from "react-native-linear-gradient"

const EditProfile: React.FC<any> = ({ navigation }) => {
  const [fullName, setFullName] = useState("Andrew Ainsley")
  const [nickname, setNickname] = useState("Andrew")
  const [dob, setDob] = useState("12/12/1991") // Placeholder for Date of Birth
  const [email, setEmail] = useState("andrew_ainsley@yourdomain.com")
  const [country, setCountry] = useState("United States") // Placeholder for country picker
  const [phoneNumber, setPhoneNumber] = useState("+1 234 567 890")
  const [gender, setGender] = useState("Male") // Placeholder for gender picker
  const [address, setAddress] = useState("246 New Avenue, New York")

  const profileImage =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg"

  const handleUpdateProfile = () => {
    // Implement profile update logic here
    console.log("Profile Updated:", {
      fullName,
      nickname,
      dob,
      email,
      country,
      phoneNumber,
      gender,
      address,
    })
    navigation.goBack() // Go back after updating
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <TouchableOpacity style={styles.editImageButton}>
            <Icon name="pencil-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />

          <Text style={styles.inputLabel}>Nickname</Text>
          <TextInput style={styles.input} value={nickname} onChangeText={setNickname} />

          <Text style={styles.inputLabel}>Date of Birth</Text>
          <TouchableOpacity style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputFlex}
              value={dob}
              onChangeText={setDob}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              keyboardType="numeric"
            />
            <Icon name="calendar-outline" size={20} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Email</Text>
          <TouchableOpacity style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputFlex}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={false} // Email usually not editable directly
            />
            <Icon name="lock-closed-outline" size={20} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Country</Text>
          <TouchableOpacity style={styles.inputWithIcon}>
            <Image source={{ uri: "https://flagcdn.com/w2560/us.png" }} style={styles.flagIcon} />
            <TextInput
              style={styles.inputFlex}
              value={country}
              onChangeText={setCountry}
              editable={false} // Placeholder for picker
            />
            <Icon name="chevron-down" size={20} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Phone Number</Text>
          <TouchableOpacity style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputFlex}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <Icon name="call-outline" size={20} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Gender</Text>
          <TouchableOpacity style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputFlex}
              value={gender}
              onChangeText={setGender}
              editable={false} // Placeholder for picker
            />
            <Icon name="chevron-down" size={20} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Address</Text>
          <TextInput style={styles.input} value={address} onChangeText={setAddress} multiline />
        </View>

        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
          <LinearGradient
            colors={["#8B5CF6", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.updateButtonGradient}
          >
            <Text style={styles.updateButtonText}>Update</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    position: "relative",
    alignSelf: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  form: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  inputFlex: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#FFFFFF",
  },
  flagIcon: {
    width: 24,
    height: 18,
    marginRight: 12,
    borderRadius: 2,
  },
  updateButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 40,
  },
  updateButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  updateButtonText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
})

export default EditProfile
