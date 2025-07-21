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
import { AuthScreenProps } from "../../Types/navigation"
import { Icon } from "lucide-react-native"

const { width, height } = Dimensions.get("window")

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
    navigation.navigate("Main")
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

  // Apple Login (kept commented out as per original)
  // const handleAppleLogin = async () => {
  //   try {
  //     const appleAuthRequestResponse = await appleAuth.performRequest({
  //       requestedOperation: AppleAuthRequestOperation.LOGIN,
  //       requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
  //     });
  //     console.log('Apple auth response:', appleAuthRequestResponse);
  //   } catch (error) {
  //     console.error('Apple login error:', error);
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <View style={styles.illustrationContainer}>
            <Image source={require("../../Assets/images/auth/auth.png")} style={styles.image} resizeMode="contain" />
          </View>
          <Text style={styles.title}>Let's you in</Text>
          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
               {/* <Icon name="facebook" size={width * 0.05} color="#3b5998" style={styles.socialIcon} />  */}
              <Text style={styles.socialButtonText}>Continue with Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
              {/* <Icon name="google" size={width * 0.05} color="#db4437" style={styles.socialIcon} /> */}
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.socialButton} onPress={handleAppleLogin}>
              <AppleIcon name="logo-apple" size={width * 0.05} color="#000000" style={styles.socialIcon} />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity> */}
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
    paddingHorizontal: width * 0.05, 
  },
  illustrationContainer: {
    alignItems: "center",
    marginVertical: height * 0.04,
  },
  image: {
    width: width * 0.7, 
    height: height * 0.3, 
    marginBottom: height * 0.03, 
  },
  title: {
    fontSize: width * 0.08, 
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: height * 0.05, 
  },
  socialButtonsContainer: {
    marginBottom: height * 0.035, 
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    paddingVertical: height * 0.02, 
    paddingHorizontal: width * 0.05, 
    marginBottom: height * 0.02, 
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  socialIcon: {
    marginRight: width * 0.04, 
    width: width * 0.06, 
    textAlign: "center",
  },
  socialButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.04, 
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
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
  passwordButtonContainer: {
    marginBottom: height * 0.035, 
  },
  passwordButton: {
    height: height * 0.07, 
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  passwordButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.045, 
    fontWeight: "600",
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

export default Auth


// import React from 'react'
// import { Text, View } from 'react-native'

// const Auth = () => {
//   return (
//     <View><Text>asdfasd</Text></View>
//   )
// }

// export default Auth