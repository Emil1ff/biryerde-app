"use client"

import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { useFocusEffect } from "@react-navigation/native"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { LoginManager, AccessToken } from "react-native-fbsdk-next"
import type { AuthScreenProps } from "../../Types/navigation"
import { Facebook, Mail } from "lucide-react-native"

const { width, height } = Dimensions.get("window")

const isTablet = width >= 768
const getResponsiveSize = (phoneSize: number, tabletSize?: number) => {
  return isTablet ? tabletSize || phoneSize * 0.7 : phoneSize
}

const Auth: React.FC<AuthScreenProps> = ({ navigation, route }) => {
  const { fromOnboarding } = route.params || {}

  React.useEffect(() => {
    GoogleSignin.configure({
      webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
    })
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      // BackHandler logic is commented out in original, keeping it that way.
      // const onBackPress = () => {
      //   handleBackPress();
      //   return true;
      // };
      // const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      // return () => subscription.remove();
    }, [fromOnboarding]),
  )

  const handleSignInWithPassword = () => {
    navigation.navigate("Login")
  }

  const handleSignUp = () => {
    navigation.navigate("SignUp")
  }

  const handleFacebookLogin = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(["public_profile", "email"])
      if (result.isCancelled) {
        console.log("User cancelled Facebook login")
        Alert.alert("Login Cancelled", "You cancelled the Facebook login.")
      } else {
        const data = await AccessToken.getCurrentAccessToken()
        if (!data) throw new Error("Failed to get access token")
        console.log("Facebook access token:", data.accessToken.toString())

        Alert.alert("Success", "Logged in with Facebook!")
        navigation.navigate("Main")
      }
    } catch (error) {
      console.error("Facebook login error:", error)
      Alert.alert("Login Error", "Failed to log in with Facebook. Please try again.")
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      console.log("Google user info:", userInfo)

      Alert.alert("Success", "Logged in with Google!")
      navigation.navigate("Main")
    } catch (error) {
      console.error("Google login error:", error)
      Alert.alert("Login Error", "Failed to log in with Google. Please try again.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <View style={styles.illustrationContainer}>
            <Image source={require("../../Assets/images/auth/auth.png")} style={styles.image} resizeMode="contain" />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Let's you in</Text>
            <Text style={styles.subtitle}>Choose your preferred sign in method</Text>
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
              <View style={styles.iconContainer}>
                <Facebook size={getResponsiveSize(20, 24)} color="#1877F2" />
              </View>
              <Text style={styles.socialButtonText}>Continue with Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
              <View style={styles.iconContainer}>
                <Mail size={getResponsiveSize(20, 24)} color="#EA4335" />
              </View>
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.passwordButtonContainer} onPress={handleSignInWithPassword}>
            <LinearGradient colors={["#8B5CF6", "#A855F7"]} style={styles.passwordButton}>
              <Text style={styles.passwordButtonText}>Sign in with password</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
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
    paddingHorizontal: getResponsiveSize(width * 0.05, 40),
    maxWidth: isTablet ? 500 : width,
    alignSelf: "center",
    width: "100%",
  },
  illustrationContainer: {
    alignItems: "center",
    marginVertical: getResponsiveSize(height * 0.04, 40),
  },
  image: {
    width: getResponsiveSize(width * 0.7, 300),
    height: getResponsiveSize(height * 0.3, 200),
    marginBottom: getResponsiveSize(height * 0.03, 20),
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: getResponsiveSize(height * 0.05, 40),
  },
  title: {
    fontSize: getResponsiveSize(width * 0.08, 32),
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: getResponsiveSize(width * 0.035, 16),
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    fontWeight: "400",
  },
  socialButtonsContainer: {
    marginBottom: getResponsiveSize(height * 0.035, 30),
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    paddingVertical: getResponsiveSize(height * 0.02, 16),
    paddingHorizontal: getResponsiveSize(width * 0.05, 20),
    marginBottom: getResponsiveSize(height * 0.015, 12),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: getResponsiveSize(32, 40),
    height: getResponsiveSize(32, 40),
    borderRadius: getResponsiveSize(16, 20),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: getResponsiveSize(width * 0.04, 16),
  },
  socialButtonText: {
    color: "#FFFFFF",
    fontSize: getResponsiveSize(width * 0.04, 16),
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: getResponsiveSize(height * 0.035, 30),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  dividerText: {
    color: "rgba(255, 255, 255, 0.6)",
    marginHorizontal: getResponsiveSize(width * 0.04, 16),
    fontSize: getResponsiveSize(width * 0.035, 14),
    fontWeight: "500",
  },
  passwordButtonContainer: {
    marginBottom: getResponsiveSize(height * 0.035, 30),
  },
  passwordButton: {
    height: getResponsiveSize(height * 0.07, 56),
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  passwordButtonText: {
    color: "#FFFFFF",
    fontSize: getResponsiveSize(width * 0.045, 18),
    fontWeight: "600",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: getResponsiveSize(height * 0.02, 20),
  },
  signUpText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: getResponsiveSize(width * 0.04, 16),
  },
  signUpLink: {
    color: "#8B5CF6",
    fontSize: getResponsiveSize(width * 0.04, 16),
    fontWeight: "600",
  },
})

export default Auth
