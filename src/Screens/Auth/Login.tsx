//login.tsx

"use client"

import type React from "react"
import { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  TextInput,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Ionicons from "react-native-vector-icons/Ionicons"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import CustomAlert from "../../Components/CustomAlert"

export type LoginProps = {
  navigation: {
    navigate: (screen: string) => void
    goBack: () => void
  }
}

const { width, height } = Dimensions.get("window")

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertTitle, setAlertTitle] = useState("")
  const [alertMessage, setAlertMessage] = useState("")

  const backButtonScale = useRef(new Animated.Value(1)).current
  const signInButtonScale = useRef(new Animated.Value(1)).current
  const socialButtonScales = useRef({
    facebook: new Animated.Value(1),
    google: new Animated.Value(1),
    apple: new Animated.Value(1),
    twitter: new Animated.Value(1),
  }).current

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title)
    setAlertMessage(message)
    setAlertVisible(true)
  }

  const hideAlert = () => {
    setAlertVisible(false)
  }

  const handleLogin = () => {
    if (!email || !password) {
      showAlert("Error", "Please fill in all fields")
      return
    }
    console.log("Login:", { email, password, rememberMe })
    if (email === "test@mail.com" && password === "123456789") {
      navigation.navigate("Main")
    } else {
      showAlert("Login Failed", "Invalid email or password.")
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    showAlert("Social Login", `Attempting to log in with ${provider}...`)
  }

  const animatePressIn = (scaleAnim: Animated.Value, toValue = 0.95) => {
    Animated.spring(scaleAnim, {
      toValue,
      useNativeDriver: true,
    }).start()
  }

  const animatePressOut = (scaleAnim: Animated.Value, toValue = 1) => {
    Animated.spring(scaleAnim, {
      toValue,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollViewContent}>
        <View style={styles.content}>
          <Pressable
            onPressIn={() => animatePressIn(backButtonScale, 0.9)}
            onPressOut={() => animatePressOut(backButtonScale)}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          >
            <Animated.View style={[styles.backButton, { transform: [{ scale: backButtonScale }] }]}>
              <Ionicons name="arrow-back" size={width * 0.06} color="#FFFFFF" />
            </Animated.View>
          </Pressable>

          <Text style={styles.title}>Login to your{"\n"}Account</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Email address input"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Password input"
              />
              <Pressable
                style={({ pressed }) => [styles.eyeButton, { opacity: pressed ? 0.7 : 1 }]}
                onPress={() => setShowPassword(!showPassword)}
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              >
                <Ionicons name="eye" size={width * 0.05} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          <View style={styles.rememberForgotContainer}>
            <Pressable
              style={({ pressed }) => [styles.checkboxContainer, { opacity: pressed ? 0.7 : 1 }]}
              onPress={() => setRememberMe(!rememberMe)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: rememberMe }}
              accessibilityLabel="Remember me checkbox"
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Ionicons name="checkmark" size={width * 0.04} color="#FFFFFF" />}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </Pressable>
          </View>

          <Pressable
            onPressIn={() => animatePressIn(signInButtonScale, 0.98)}
            onPressOut={() => animatePressOut(signInButtonScale)}
            onPress={handleLogin}
            accessibilityLabel="Sign in button"
          >
            <Animated.View style={[styles.signInButton, { transform: [{ scale: signInButtonScale }] }]}>
              <LinearGradient
                colors={["#8B5CF6", "#A855F7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFillObject}
              />
              <Text style={styles.signInButtonText}>Sign in</Text>
            </Animated.View>
          </Pressable>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialLoginButtons}>
            <Pressable
              onPressIn={() => animatePressIn(socialButtonScales.facebook, 0.9)}
              onPressOut={() => animatePressOut(socialButtonScales.facebook)}
              onPress={() => handleSocialLogin("Facebook")}
              accessibilityLabel="Login with Facebook"
            >
              <Animated.View style={[styles.socialButton, { transform: [{ scale: socialButtonScales.facebook }] }]}>
                <FontAwesome name="facebook" size={width * 0.06} color="#FFFFFF" />
              </Animated.View>
            </Pressable>
            <Pressable
              onPressIn={() => animatePressIn(socialButtonScales.google, 0.9)}
              onPressOut={() => animatePressOut(socialButtonScales.google)}
              onPress={() => handleSocialLogin("Google")}
              accessibilityLabel="Login with Google"
            >
              <Animated.View style={[styles.socialButton, { transform: [{ scale: socialButtonScales.google }] }]}>
                <FontAwesome name="google" size={width * 0.06} color="#FFFFFF" />
              </Animated.View>
            </Pressable>
            <Pressable
              onPressIn={() => animatePressIn(socialButtonScales.apple, 0.9)}
              onPressOut={() => animatePressOut(socialButtonScales.apple)}
              onPress={() => handleSocialLogin("Apple")}
              accessibilityLabel="Login with Apple"
            >
              <Animated.View style={[styles.socialButton, { transform: [{ scale: socialButtonScales.apple }] }]}>
                <FontAwesome name="apple" size={width * 0.06} color="#FFFFFF" />
              </Animated.View>
            </Pressable>
            <Pressable
              onPressIn={() => animatePressIn(socialButtonScales.twitter, 0.9)}
              onPressOut={() => animatePressOut(socialButtonScales.twitter)}
              onPress={() => handleSocialLogin("Twitter")}
              accessibilityLabel="Login with Twitter"
            >
              <Animated.View style={[styles.socialButton, { transform: [{ scale: socialButtonScales.twitter }] }]}>
                <FontAwesome name="twitter" size={width * 0.06} color="#FFFFFF" />
              </Animated.View>
            </Pressable>
          </View>

          <View style={styles.signUpPrompt}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <Pressable
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text style={styles.signUpLink}>Sign up</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <CustomAlert isVisible={alertVisible} title={alertTitle} message={alertMessage} onClose={hideAlert} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    paddingTop: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: height * 0.05,
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.06,
    maxWidth: 600,
    alignSelf: "center",
  },
  backButton: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.04,
  },
  title: {
    fontSize: width * 0.09,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: height * 0.05,
    lineHeight: width * 0.11,
    textAlign: "left",
  },
  inputGroup: {
    marginBottom: height * 0.025,
  },
  inputLabel: {
    color: "#E0E0E0",
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1A1A1A",
    borderRadius: 15,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.022,
    color: "#FFFFFF",
    fontSize: width * 0.042,
    borderWidth: 1,
    borderColor: "#333333",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#333333",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.022,
    color: "#FFFFFF",
    fontSize: width * 0.042,
  },
  eyeButton: {
    paddingHorizontal: width * 0.04,
  },
  rememberForgotContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.04,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: width * 0.055,
    height: width * 0.055,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#666666",
    marginRight: width * 0.025,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  rememberText: {
    color: "#E0E0E0",
    fontSize: width * 0.038,
    fontWeight: "500",
  },
  forgotPasswordText: {
    color: "#A855F7",
    fontSize: width * 0.038,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  signInButtonContainer: {
    marginBottom: height * 0.04,
  },
  signInButton: {
    height: height * 0.075,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    overflow: "hidden", // Clip LinearGradient
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.048,
    fontWeight: "700",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.035,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#333333",
  },
  dividerText: {
    color: "#999999",
    marginHorizontal: width * 0.04,
    fontSize: width * 0.035,
    fontWeight: "500",
  },
  socialLoginButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: height * 0.04,
  },
  socialButton: {
    width: width * 0.16,
    height: width * 0.16,
    borderRadius: 18,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: width * 0.025,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  signUpPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  signUpText: {
    color: "#CCCCCC",
    fontSize: width * 0.04,
    fontWeight: "500",
  },
  signUpLink: {
    color: "#A855F7",
    fontSize: width * 0.04,
    fontWeight: "700",
  },
})

export default Login