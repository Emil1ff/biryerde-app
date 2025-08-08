import type React from "react"
import { useEffect, useRef } from "react"
import { View, StyleSheet, Animated, Platform, UIManager, Dimensions, Easing } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { StackScreenProps } from "@react-navigation/stack"
import type { RootStackParamList } from "../../Types/navigation"
import { CommonActions } from '@react-navigation/native'

const { width, height } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (width * percentage) / 100
const responsiveHeight = (percentage: number) => (height * percentage) / 100
const responsiveFontSize = (size: number) => size * (width / 375)

type SplashProps = StackScreenProps<RootStackParamList, "Splash">

const Splash: React.FC<SplashProps> = ({ navigation }) => {
  const spinValue = useRef(new Animated.Value(0)).current
  const logoScale = useRef(new Animated.Value(0.8)).current
  const textOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()

    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    )
    spinAnimation.start()

    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched")
        if (hasLaunched === null) {
          await AsyncStorage.setItem("hasLaunched", "true")
          setTimeout(() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Onboarding' }],
              })
            )
          }, 3000)
        } else {
          setTimeout(() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Main' }],
              })
            )
          }, 3000)
        }
      } catch (error) {
        console.error("Error checking first launch:", error)
        setTimeout(() => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            })
          )
        }, 3000)
      }
    }

    checkFirstLaunch()

    return () => {
      spinAnimation.stop()
    }
  }, [navigation, spinValue, logoScale, textOpacity])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
        <LinearGradient colors={["#8B5CF6", "#A855F7", "#C084FC"]} style={styles.logoGradient}>
          <View style={styles.logoShape} />
        </LinearGradient>
      </Animated.View>
      <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>BirYerdə</Animated.Text>
      <View style={styles.spinnerWrapper}>
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: responsiveWidth(40),
    height: responsiveWidth(40),
    borderRadius: responsiveWidth(20),
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 20,
    marginBottom: responsiveHeight(3),
  },
  logoGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoShape: {
    width: responsiveWidth(20),
    height: responsiveWidth(20),
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: responsiveWidth(5),
    transform: [{ rotate: "45deg" }],
  },
  appName: {
    fontSize: responsiveFontSize(32),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: responsiveHeight(8),
    letterSpacing: 1.5,
  },
  spinnerWrapper: {
    position: "absolute",
    bottom: responsiveHeight(10),
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    borderWidth: 3,
    borderColor: "rgba(139, 92, 246, 0.3)",
    borderTopColor: "#8B5CF6",
  },
})

export default Splash