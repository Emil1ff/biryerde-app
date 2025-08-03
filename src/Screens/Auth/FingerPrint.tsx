"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Alert,
  Platform,
  Linking,
  Dimensions,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import ReactNativeBiometrics, { BiometryTypes } from "react-native-biometrics"
import Svg, { Path, Circle } from "react-native-svg"

export type FingerPrintProps = {
  navigation: {
    navigate: (screen: string) => void
    goBack: () => void
  }
}

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
})

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

const FingerprintIcon = ({ size, color }: { size: number; color: string }) => (
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
    <Path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z" />
    <Path d="M12 17a5 5 0 0 0 0-10V7a5 5 0 0 0 0 10z" />
    <Path d="M12 22v-2" />
    <Path d="M12 4V2" />
    <Path d="M22 12h-2" />
    <Path d="M4 12H2" />
    <Path d="M19.78 4.22l-1.41 1.41" />
    <Path d="M6.22 19.78l-1.41 1.41" />
    <Path d="M4.22 4.22l1.41 1.41" />
    <Path d="M19.78 19.78l-1.41-1.41" />
  </Svg>
)

const HappyOutlineIcon = ({ size, color }: { size: number; color: string }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    fill="none"
    stroke={color}
    strokeWidth="32"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Circle cx="256" cy="256" r="208" fill="none" />
    <Path d="M169.38 249.38s16.93 24 46.62 24 46.62-24 46.62-24" fill="none" />
    <Path d="M296 249.38s16.93 24 46.62 24 46.62-24 46.62-24" fill="none" />
    <Path d="M200 352s16.93 24 46.62 24 46.62-24 46.62-24" fill="none" />
  </Svg>
)

const UnlockAltIcon = ({ size, color }: { size: number; color: string }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    fill="none"
    stroke={color}
    strokeWidth="32"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path
      d="M336 192h-48V144a80 80 0 0 0-160 0v48H80a48 48 0 0 0-48 48v192a48 48 0 0 0 48 48h352a48 48 0 0 0 48-48V240a48 48 0 0 0-48-48z"
      fill="none"
    />
    <Path d="M256 336v-48" />
  </Svg>
)

const FingerPrint: React.FC<FingerPrintProps> = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [biometryType, setBiometryType] = useState<BiometryTypes | null>(null)
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false)
  const pulseAnim = useRef(new Animated.Value(1)).current
  const progressAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    checkBiometricAvailability()
  }, [])

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    )
    if (isScanning) {
      pulseAnimation.start()
    } else {
      pulseAnimation.stop()
      pulseAnim.setValue(1)
    }
    return () => pulseAnimation.stop()
  }, [isScanning, pulseAnim])

  const checkBiometricAvailability = async () => {
    try {
      const result = await rnBiometrics.isSensorAvailable()
      console.log("Biometric availability result:", result)
      const isAvailable = result.available === true && result.biometryType !== null
      setIsBiometricAvailable(isAvailable)
      setBiometryType(result.biometryType)
      if (!isAvailable) {
        Alert.alert(
          "Biometric Not Available",
          "Your device does not support biometric authentication or it is not set up. Please enable Face ID / Touch ID / Fingerprint in device settings.",
          [
            {
              text: Platform.OS === "ios" ? "Settings" : "OK",
              onPress: () => {
                if (Platform.OS === "ios") {
                  Linking.openURL("App-Prefs:")
                }
              },
            },
            {
              text: "Skip",
              onPress: () => navigation.navigate("Main"), 
              style: "cancel",
            },
          ],
        )
      }
    } catch (error) {
      console.error("isSensorAvailable error:", error)
      setIsBiometricAvailable(false)
      setBiometryType(null)
      Alert.alert("Biometric Error", "Could not check biometric availability. Try again or skip.", [
        {
          text: "Retry",
          onPress: () => checkBiometricAvailability(),
        },
        {
          text: "Skip",
          onPress: () => navigation.navigate("MainTabs"), 
          style: "cancel",
        },
      ])
    }
  }

  const handleBiometricAuth = async () => {
    if (!isBiometricAvailable) {
      Alert.alert("Error", "Biometric authentication is not available")
      return
    }
    setIsScanning(true)
    setScanProgress(0)
    progressAnim.setValue(0)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start()

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 300)

    try {
      const biometricPrompt = getBiometricPromptMessage()
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: biometricPrompt.message,
        cancelButtonText: "Cancel",
      })
      clearInterval(progressInterval)

      if (success) {
        setScanProgress(100)
        await saveBiometricPreference(true)
        setTimeout(() => {
          setIsScanning(false)
          Alert.alert("Success", "Biometric authentication enabled.", [
            {
              text: "Continue",
              onPress: () => navigation.navigate("MainTabs"), 
            },
          ])
        }, 1000)
      } else {
        throw new Error("Authentication failed or cancelled")
      }
    } catch (error) {
      console.log("Biometric auth error:", error)
      clearInterval(progressInterval)
      setIsScanning(false)
      setScanProgress(0)
      progressAnim.setValue(0)
      Alert.alert("Failed", "Biometric authentication failed.", [
        { text: "Try Again", onPress: () => handleBiometricAuth() },
        {
          text: "Skip",
          onPress: () => navigation.navigate("MainTabs"), 
          style: "cancel",
        },
      ])
    }
  }

  const getBiometricPromptMessage = () => {
    switch (biometryType) {
      case BiometryTypes.TouchID:
        return {
          message: "Place your finger on the Touch ID sensor to set up biometric authentication",
          icon: <FingerprintIcon size={50} color="#fff" />,
          title: "Touch ID",
        }
      case BiometryTypes.FaceID:
        return {
          message: "Look at the front camera to set up Face ID authentication",
          icon: <HappyOutlineIcon size={50} color="#fff" />,
          title: "Face ID",
        }
      case BiometryTypes.Biometrics:
        return {
          message: "Use your biometric sensor to set up authentication",
          icon: <UnlockAltIcon size={50} color="#fff" />,
          title: "Biometric",
        }
      default:
        return {
          message: "Use your device biometric to set up authentication",
          icon: <FingerprintIcon size={50} color="#fff" />,
          title: "Fingerprint",
        }
    }
  }

  const saveBiometricPreference = async (enabled: boolean) => {
    try {
      console.log("Biometric preference saved:", enabled)
    } catch (error) {
      console.error("Error saving biometric preference:", error)
    }
  }

  const handleSkip = () => {
    navigation.navigate("MainTabs") 
  }

  const handleBackPress = () => {
    navigation.goBack()
  }

  const renderBiometricIcon = () => {
    const biometricInfo = getBiometricPromptMessage()
    if (scanProgress === 100) {
      return (
        <View style={styles.successContainer}>
          <LinearGradient colors={["#10B981", "#059669"]} style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </LinearGradient>
        </View>
      )
    }
    return (
      <Animated.View
        style={[
          styles.fingerprintContainer,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <LinearGradient colors={["#8B5CF6", "#A855F7"]} style={styles.fingerprintIcon}>
          {biometricInfo.icon}
        </LinearGradient>
        {isScanning && (
          <>
            <View style={[styles.scanRing, styles.scanRing1]} />
            <View style={[styles.scanRing, styles.scanRing2]} />
            <View style={[styles.scanRing, styles.scanRing3]} />
          </>
        )}
      </Animated.View>
    )
  }

  const getBiometricTitle = () => {
    switch (biometryType) {
      case BiometryTypes.TouchID:
        return "Set Your Touch ID"
      case BiometryTypes.FaceID:
        return "Set Your Face ID"
      case BiometryTypes.Biometrics:
        return "Set Your Biometric"
      default:
        return "Set Your Fingerprint"
    }
  }

  const getBiometricDescription = () => {
    switch (biometryType) {
      case BiometryTypes.TouchID:
        return "Add Touch ID to make your account more secure"
      case BiometryTypes.FaceID:
        return "Add Face ID to make your account more secure"
      case BiometryTypes.Biometrics:
        return "Add biometric authentication to make your account more secure"
      default:
        return "Add a fingerprint to make your account more secure"
    }
  }

  const getInstructionText = () => {
    switch (biometryType) {
      case BiometryTypes.TouchID:
        return "Please place your finger on the Touch ID sensor to get started"
      case BiometryTypes.FaceID:
        return "Please look at the front camera to get started"
      case BiometryTypes.Biometrics:
        return "Please use your biometric sensor to get started"
      default:
        return "Please put your finger on the fingerprint scanner to get started"
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeftIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>{getBiometricTitle()}</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{getBiometricDescription()}</Text>
        </View>

        <View style={styles.iconContainer}>{renderBiometricIcon()}</View>

        {isScanning && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {scanProgress < 100
                ? `Authenticating... ${scanProgress}%`
                : "Biometric authentication set up successfully!"}
            </Text>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        )}
        {!isScanning && scanProgress === 0 && <Text style={styles.instructionText}>{getInstructionText()}</Text>}

        <View style={styles.buttonsContainer}>
          {!isScanning && scanProgress === 0 && (
            <>
              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.continueButtonContainer}
                onPress={handleBiometricAuth}
                disabled={!isBiometricAvailable}
              >
                <LinearGradient
                  colors={
                    isBiometricAvailable
                      ? ["#8B5CF6", "#A855F7"]
                      : ["rgba(139, 92, 246, 0.3)", "rgba(168, 85, 247, 0.3)"]
                  }
                  style={styles.continueButton}
                >
                  <Text style={[styles.continueButtonText, !isBiometricAvailable && styles.disabledButtonText]}>
                    Continue
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    marginTop: 30,
    paddingTop: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 20,
  },
  descriptionContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  description: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    lineHeight: 24,
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fingerprintContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  fingerprintIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  successContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  successIconText: {
    fontSize: 50,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  scanRing: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "rgba(139, 92, 246, 0.3)",
    borderRadius: 100,
  },
  scanRing1: {
    width: 160,
    height: 160,
  },
  scanRing2: {
    width: 200,
    height: 200,
  },
  scanRing3: {
    width: 240,
    height: 240,
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  progressText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 20,
    textAlign: "center",
  },
  progressBarContainer: {
    width: "80%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#8B5CF6",
    borderRadius: 2,
  },
  instructionText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    marginBottom: 40,
  },
  buttonsContainer: {
    marginBottom: 30,
  },
  skipButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 16,
  },
  skipButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  continueButtonContainer: {
    marginTop: 0,
  },
  continueButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  disabledButtonText: {
    color: "rgba(255, 255, 255, 0.5)",
  },
})

export default FingerPrint
