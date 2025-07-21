"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, StyleSheet, Animated, Platform, UIManager, ActivityIndicator } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { StackScreenProps } from "@react-navigation/stack"
import type { RootStackParamList } from "../../Types/navigation"

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

type SplashProps = StackScreenProps<RootStackParamList, "Splash">

const Splash: React.FC<SplashProps> = ({ navigation }) => {
  const spinValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched")
        if (hasLaunched === null) {
          await AsyncStorage.setItem("hasLaunched", "true")
          setTimeout(() => {
            navigation.replace("Onboarding")
          }, 3000) 
        } else {
          setTimeout(() => {
            navigation.replace("Main")
          }, 3000) 
        }
      } catch (error) {
        console.error("Error checking first launch:", error)
        setTimeout(() => {
          navigation.replace("Main")
        }, 3000)
      }
    }

    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    )
    spinAnimation.start()

    checkFirstLaunch() 

    return () => {
      spinAnimation.stop()
    }
  }, [navigation, spinValue])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <LinearGradient colors={["#8B5CF6", "#A855F7", "#C084FC"]} style={styles.logo}>
          <View style={styles.logoText} />
        </LinearGradient>
      </View>
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    width: 60,
    height: 60,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
  },
  spinnerContainer: {
    position: "absolute",
    bottom: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    width: 40,
    height: 40,
    position: "relative",
  },
  spinnerDot: {
    position: "absolute",
    width: 6,
    height: 6,
    backgroundColor: "#8B5CF6",
    borderRadius: 3,
    top: "50%",
    left: "50%",
    marginLeft: -3,
    marginTop: -3,
  },
})

export default Splash
