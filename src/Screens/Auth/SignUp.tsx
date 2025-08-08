"use client"
import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Dimensions, // Import Dimensions for responsive sizing
  ScrollView, // Import ScrollView for scrollable content
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons" // For general icons
import FontAwesome from "react-native-vector-icons/FontAwesome" // For social icons
import type { SignUpProps } from "../../Types/navigation"
import CustomAlert from "../../Components/CustomAlert"

// Responsive sizing utilities
const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (screenWidth * percentage) / 100
const responsiveHeight = (percentage: number) => (screenHeight * percentage) / 100
const responsiveFontSize = (size: number) => size * (screenWidth / 375)

const SignUp: React.FC<SignUpProps> = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // State for CustomAlert
  const [showAlert, setShowAlert] = useState(false)
  const [alertTitle, setAlertTitle] = useState("")
  const [alertMessage, setAlertMessage] = useState("")
  const [alertButtons, setAlertButtons] = useState<any[]>([])

  const handleSignUp = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    console.log("Sign Up:", { email, password, rememberMe })
    navigation.navigate("FillProfile")
  }

  const handleSocialSignUp = (provider: string) => {
    setAlertTitle("Coming Soon")
    setAlertMessage("yaxinda :)")
    setAlertButtons([
      {
        text: "OK",
        onPress: () => setShowAlert(false),
      },
    ])
    setShowAlert(true)
    console.log(`Sign up with ${provider}`)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={responsiveFontSize(24)} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>
          Create your{"\n"}
          Account
        </Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? "eye-outline" : "eye-off-outline"} size={responsiveFontSize(20)} color="rgba(255, 255, 255, 0.6)" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icon name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={responsiveFontSize(20)} color="rgba(255, 255, 255, 0.6)" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Remember Me Checkbox */}
        <View style={styles.rememberContainer}>
          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Icon name="checkmark" size={responsiveFontSize(14)} color="#FFFFFF" />}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signUpButtonContainer} onPress={handleSignUp}>
          <LinearGradient colors={["#8B5CF6", "#A855F7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.signUpButton}>
            <Text style={styles.signUpButtonText}>Sign up</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Sign Up Buttons */}
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialSignUp("Facebook")}>
            <FontAwesome name="facebook" size={responsiveFontSize(24)} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialSignUp("Google")}>
            <FontAwesome name="google" size={responsiveFontSize(24)} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialSignUp("Apple")}>
            <Icon name="logo-apple" size={responsiveFontSize(24)} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signInLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomAlert
        isVisible={showAlert}
        title={alertTitle}
        message={alertMessage}
        buttons={alertButtons}
        onClose={() => setShowAlert(false)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(5),
    paddingBottom: responsiveHeight(5),
  },
  backButton: {
    width: responsiveFontSize(40),
    height: responsiveFontSize(40),
    borderRadius: responsiveFontSize(20),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(3),
  },
  title: {
    fontSize: responsiveFontSize(32),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: responsiveHeight(4),
    lineHeight: responsiveFontSize(40),
  },
  inputContainer: {
    marginBottom: responsiveHeight(2.5),
  },
  inputLabel: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(16),
    marginBottom: responsiveHeight(1),
    fontWeight: "500",
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: responsiveFontSize(12),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    color: "#FFFFFF",
    fontSize: responsiveFontSize(16),
  },
  eyeButton: {
    paddingHorizontal: responsiveWidth(4),
  },
  rememberContainer: {
    marginBottom: responsiveHeight(3.5),
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: responsiveFontSize(20),
    height: responsiveFontSize(20),
    borderRadius: responsiveFontSize(4),
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginRight: responsiveWidth(3),
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(12),
    fontWeight: "bold",
  },
  rememberText: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(16),
  },
  signUpButtonContainer: {
    marginBottom: responsiveHeight(3.5),
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: responsiveHeight(0.6) },
    shadowOpacity: 0.4,
    shadowRadius: responsiveFontSize(8),
    elevation: 10,
  },
  signUpButton: {
    height: responsiveHeight(7),
    borderRadius: responsiveFontSize(28),
    justifyContent: "center",
    alignItems: "center",
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(18),
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: responsiveHeight(2.5),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  dividerText: {
    color: "rgba(255, 255, 255, 0.6)",
    marginHorizontal: responsiveWidth(4),
    fontSize: responsiveFontSize(14),
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: responsiveHeight(3.5),
  },
  socialButton: {
    width: responsiveFontSize(60),
    height: responsiveFontSize(60),
    borderRadius: responsiveFontSize(16),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: responsiveWidth(2.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: responsiveHeight(0.3) },
    shadowOpacity: 0.2,
    shadowRadius: responsiveFontSize(4),
    elevation: 5,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: responsiveHeight(2),
  },
  signInText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: responsiveFontSize(16),
  },
  signInLink: {
    color: "#8B5CF6",
    fontSize: responsiveFontSize(16),
    fontWeight: "600",
  },
})

export default SignUp
