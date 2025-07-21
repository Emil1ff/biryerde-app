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
  Alert,
  ScrollView,
  Dimensions,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Svg, { Path, Circle } from "react-native-svg"

export type LoginProps = {
  navigation: {
    navigate: (screen: string) => void
    goBack: () => void
  }
}

const { width, height } = Dimensions.get("window")

const ArrowLeftIcon = ({ size, color }: { size: number; color: string }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
)

const EyeIcon = ({ size, color }: { size: number; color: string }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <Circle cx="12" cy="12" r="3" />
  </Svg>
)

const EyeOffIcon = ({ size, color }: { size: number; color: string }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.54 18.54 0 0 1 2.21-3.02M2.92 2.92L21 21M15.04 15.04a3 3 0 0 1-4.24-4.24M1 1l1 1M23 23l-1-1" />
  </Svg>
)

const CheckIcon = ({ size, color }: { size: number; color: string }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M20 6L9 17l-5-5" />
  </Svg>
)

// Social Icons (simplified, using common brand SVG paths)
const FacebookIcon = ({ size, color }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </Svg>
)

const GoogleIcon = ({ size, color }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 11.75c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill={color} />
    <Path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
      fill={color}
    />
    <Path
      d="M12 14.25c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"
      fill={color}
    />
  </Svg>
)

const AppleIcon = ({ size, color }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2.6c-.8-1.1-2.1-1.6-3.5-1.6-2.3 0-4.2 1.9-4.2 4.2 0 1.4.5 2.7 1.6 3.5C4.5 9.8 4 11.1 4 12.5c0 2.3 1.9 4.2 4.2 4.2 1.4 0 2.7-.5 3.5-1.6.8 1.1 2.1 1.6 3.5 1.6 2.3 0 4.2-1.9 4.2-4.2 0-1.4-.5-2.7-1.6-3.5 1.1-.8 1.6-2.1 1.6-3.5 0-2.3-1.9-4.2-4.2-4.2-1.4 0-2.7.5-3.5 1.6zM12 4.2c.8-.8 1.9-1.3 3.1-1.3 1.7 0 3.1 1.4 3.1 3.1 0 1.2-.5 2.3-1.3 3.1-.8.8-1.9 1.3-3.1 1.3-1.7 0-3.1-1.4-3.1-3.1 0-1.2.5-2.3 1.3-3.1z" />
  </Svg>
)

const TwitterIcon = ({ size, color }: { size: number; color: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c11 3 21-10 21-12.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </Svg>
)

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }
    console.log("Login:", { email, password, rememberMe })
    navigation.navigate("SetFingerprint") // Assuming "SetFingerprint" is a valid route
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    Alert.alert("Social Login", `Attempting to log in with ${provider}...`)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityLabel="Go back">
            <ArrowLeftIcon size={width * 0.08} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.title}>Login to your{"\n"}Account</Text>

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
              autoCorrect={false}
              accessibilityLabel="Email address input"
            />
          </View>

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
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="Password input"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon size={width * 0.05} color="#FFFFFF" />
                ) : (
                  <EyeIcon size={width * 0.05} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rememberContainer}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: rememberMe }}
              accessibilityLabel="Remember me checkbox"
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <CheckIcon size={width * 0.03} color="#FFFFFF" />}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.signInButtonContainer}
            onPress={handleLogin}
            accessibilityLabel="Sign in button"
          >
            <LinearGradient
              colors={["#8B5CF6", "#A855F7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signInButton}
            >
              <Text style={styles.signInButtonText}>Sign in</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin("Facebook")}
              accessibilityLabel="Login with Facebook"
            >
              <FacebookIcon size={width * 0.06} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin("Google")}
              accessibilityLabel="Login with Google"
            >
              <GoogleIcon size={width * 0.06} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin("Apple")}
              accessibilityLabel="Login with Apple"
            >
              <AppleIcon size={width * 0.06} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin("Twitter")}
              accessibilityLabel="Login with Twitter"
            >
              <TwitterIcon size={width * 0.06} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05,
    paddingBottom: height * 0.03,
  },
  backButton: {
    marginBottom: height * 0.03,
    width: width * 0.1,
    height: width * 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: height * 0.05,
    lineHeight: width * 0.1,
  },
  inputContainer: {
    marginBottom: height * 0.025,
  },
  inputLabel: {
    color: "#FFFFFF",
    fontSize: width * 0.04,
    marginBottom: height * 0.01,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    color: "#FFFFFF",
    fontSize: width * 0.04,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.02,
    color: "#FFFFFF",
    fontSize: width * 0.04,
  },
  eyeButton: {
    paddingHorizontal: width * 0.04,
  },
  rememberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.035,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: width * 0.05,
    height: width * 0.05,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginRight: width * 0.03,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  rememberText: {
    color: "#FFFFFF",
    fontSize: width * 0.04,
  },
  forgotPasswordText: {
    color: "#8B5CF6",
    fontSize: width * 0.04,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  signInButtonContainer: {
    marginBottom: height * 0.035,
  },
  signInButton: {
    height: height * 0.07,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.045,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: height * 0.035,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  dividerText: {
    color: "rgba(255, 255, 255, 0.6)",
    marginHorizontal: width * 0.04,
    fontSize: width * 0.035,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: height * 0.035,
  },
  socialButton: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: width * 0.025,
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  signUpText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: width * 0.04,
  },
  signUpLink: {
    color: "#8B5CF6",
    fontSize: width * 0.04,
    fontWeight: "600",
  },
})

export default Login
