"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Svg, { Path, Circle } from "react-native-svg"

export type ForgotPasswordProps = {
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

const MailIcon = ({ size, color }: { size: number; color: string }) => (
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
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Path d="M22 6l-10 7L2 6" />
  </Svg>
)

const LockIcon = ({ size, color }: { size: number; color: string }) => (
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
    <Path d="M12 17v-5M17 9V7a5 5 0 0 0-10 0v2M12 17H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-5z" />
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

const ChatBubbleEllipsesOutlineIcon = ({ size, color }: { size: number; color: string }) => (
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
    <Path d="M408 64H104a56.16 56.16 0 0 0-56 56v192a56.16 56.16 0 0 0 56 56h40.09a24 24 0 0 1 16.97 7.03L239.05 448l.95-.95c2.72-2.72 5.29-5.29 7.76-7.76A24 24 0 0 1 264 408h144a56.16 56.16 0 0 0 56-56V120a56.16 56.16 0 0 0-56-56z" />
    <Circle cx="160" cy="216" r="24" fill={color} />
    <Circle cx="256" cy="216" r="24" fill={color} />
    <Circle cx="352" cy="216" r="24" fill={color} />
  </Svg>
)

const CheckmarkCircleIcon = ({ size, color }: { size: number; color: string }) => (
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
    <Path d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48z" fill="none" />
    <Path d="M368 192L256.07 304.09 192 240" fill="none" />
  </Svg>
)

const BackspaceOutlineIcon = ({ size, color }: { size: number; color: string }) => (
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
    <Path d="M112 160l-64 64 64 64" />
    <Path d="M64 224h294c58.76 0 106 49.33 106 108v20c0 58.67-47.24 108-106 108H176c-16.53 0-31.32-9.35-39-24L64 224z" />
  </Svg>
)

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ navigation }) => {
  const [step, setStep] = useState(1)
  const [selectedContact, setSelectedContact] = useState<"sms" | "email" | null>(null)
  const [otp, setOtp] = useState<string[]>(["", "", "", ""])
  const otpInputs = useRef<Array<TextInput | null>>([])
  const [resendTimer, setResendTimer] = useState(60)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isTimerActive && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    } else if (resendTimer === 0) {
      setIsTimerActive(false)
    }
    return () => clearInterval(timer)
  }, [isTimerActive, resendTimer])

  const startResendTimer = () => {
    setResendTimer(60)
    setIsTimerActive(true)
  }

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp]
    newOtp[index] = text
    setOtp(newOtp)
    if (text && index < 3) {
      otpInputs.current[index + 1]?.focus()
    }
    if (!text && index > 0) {
      otpInputs.current[index - 1]?.focus()
    }
  }

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus()
    }
  }

  const handleContinue = () => {
    if (step === 1) {
      if (!selectedContact) {
        Alert.alert("Error", "Please select a contact method.")
        return
      }
      startResendTimer()
      setStep(2)
    } else if (step === 2) {
      if (otp.join("").length !== 4) {
        Alert.alert("Error", "Please enter the full 4-digit code.")
        return
      }
      console.log("Verifying OTP:", otp.join(""))
      setStep(3)
    } else if (step === 3) {
      if (!newPassword || !confirmPassword) {
        Alert.alert("Error", "Please fill in both password fields.")
        return
      }
      if (newPassword !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match.")
        return
      }
      console.log("Resetting password...")
      setStep(4)
      setTimeout(() => {
        navigation.navigate("HomeTab") // Assuming "HomeTab" is a valid route
      }, 3000)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Image
              source={{ url: "/placeholder.svg?height=250&width=250" }}
              style={styles.illustration}
              resizeMode="contain"
            />
            <Text style={styles.description}>Select which contact details should we use to reset your password</Text>
            <TouchableOpacity
              style={[styles.contactOption, selectedContact === "sms" && styles.contactOptionSelected]}
              onPress={() => setSelectedContact("sms")}
            >
              <View style={styles.contactIconContainer}>
                <ChatBubbleEllipsesOutlineIcon size={24} color="#8B5CF6" />
              </View>
              <View>
                <Text style={styles.contactLabel}>via SMS</Text>
                <Text style={styles.contactValue}>+1 111 ******99</Text>
              </View>
              {selectedContact === "sms" && (
                <CheckmarkCircleIcon size={24} color="#8B5CF6" style={styles.checkmarkIcon} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.contactOption, selectedContact === "email" && styles.contactOptionSelected]}
              onPress={() => setSelectedContact("email")}
            >
              <View style={styles.contactIconContainer}>
                <MailIcon size={24} color="#8B5CF6" />
              </View>
              <View>
                <Text style={styles.contactLabel}>via Email</Text>
                <Text style={styles.contactValue}>and****ley@yourdomain.com</Text>
              </View>
              {selectedContact === "email" && (
                <CheckmarkCircleIcon size={24} color="#8B5CF6" style={styles.checkmarkIcon} />
              )}
            </TouchableOpacity>
          </>
        )
      case 2:
        return (
          <>
            <Text style={styles.description}>Code has been sent to +1 111 ******99</Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (otpInputs.current[index] = ref)}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleOtpKeyPress(e, index)}
                  value={digit}
                  selectionColor="#8B5CF6"
                />
              ))}
            </View>
            <Text style={styles.resendText}>
              Resend code in <Text style={styles.resendTimer}>{resendTimer} s</Text>
            </Text>
            <TouchableOpacity
              onPress={startResendTimer}
              disabled={isTimerActive}
              style={isTimerActive ? styles.resendButtonDisabled : styles.resendButton}
            >
              <Text style={isTimerActive ? styles.resendButtonTextDisabled : styles.resendButtonText}>Resend Code</Text>
            </TouchableOpacity>
            <View style={styles.keypadContainer}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.keypadButton}
                  onPress={() =>
                    handleOtpChange(
                      String(num),
                      otp.findIndex((d) => !d),
                    )
                  }
                >
                  <Text style={styles.keypadText}>{num}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.keypadButton}
                onPress={() => {
                  // Placeholder for '*' key, if needed for specific input types
                }}
              >
                <Text style={styles.keypadText}>*</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.keypadButton}
                onPress={() =>
                  handleOtpChange(
                    "0",
                    otp.findIndex((d) => !d),
                  )
                }
              >
                <Text style={styles.keypadText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.keypadButton}
                onPress={() => {
                  const lastFilledIndex = otp.findIndex((d, i) => i > 0 && !otp[i]) - 1
                  if (lastFilledIndex >= 0) {
                    const newOtp = [...otp]
                    newOtp[lastFilledIndex] = ""
                    setOtp(newOtp)
                    otpInputs.current[lastFilledIndex]?.focus()
                  } else if (otp[0]) {
                    // If only first digit is filled
                    const newOtp = [...otp]
                    newOtp[0] = ""
                    setOtp(newOtp)
                  }
                }}
              >
                <BackspaceOutlineIcon size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </>
        )
      case 3:
        return (
          <>
            <Image
              source={{ url: "/placeholder.svg?height=250&width=250" }}
              style={styles.illustration}
              resizeMode="contain"
            />
            <Text style={styles.description}>Create Your New Password</Text>
            <View style={styles.inputContainer}>
              <View style={styles.passwordInputWrapper}>
                <LockIcon size={20} color="rgba(255, 255, 255, 0.6)" style={styles.passwordIcon} />
                <TextInput
                  style={styles.passwordField}
                  placeholder="New Password"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeButton}>
                  {showNewPassword ? (
                    <EyeOffIcon size={20} color="rgba(255, 255, 255, 0.6)" />
                  ) : (
                    <EyeIcon size={20} color="rgba(255, 255, 255, 0.6)" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.passwordInputWrapper}>
                <LockIcon size={20} color="rgba(255, 255, 255, 0.6)" style={styles.passwordIcon} />
                <TextInput
                  style={styles.passwordField}
                  placeholder="Confirm Password"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
                  {showConfirmPassword ? (
                    <EyeOffIcon size={20} color="rgba(255, 255, 255, 0.6)" />
                  ) : (
                    <EyeIcon size={20} color="rgba(255, 255, 255, 0.6)" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.rememberMeContainer} onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <CheckIcon size={12} color="#FFFFFF" />}
              </View>
              <Text style={styles.rememberMeText}>Remember me</Text>
            </TouchableOpacity>
          </>
        )
      case 4:
        return (
          <View style={styles.successContainer}>
            <Image
              source={{ url: "/placeholder.svg?height=300&width=300" }}
              style={styles.successIllustration}
              resizeMode="contain"
            />
            <Text style={styles.congratulationsText}>Congratulations!</Text>
            <Text style={styles.successMessage}>
              Your account is ready to use. You will be redirected to the Home page in a few seconds.
            </Text>
            <ActivityIndicator size="large" color="#8B5CF6" style={styles.loadingIndicator} />
          </View>
        )
      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {step !== 4 && (
          <TouchableOpacity
            onPress={() => (step === 1 ? navigation.goBack() : setStep(step - 1))}
            style={styles.backButton}
          >
            <ArrowLeftIcon size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{step === 3 || step === 4 ? "Create New Password" : "Forgot Password"}</Text>
      </View>
      <View style={styles.content}>{renderStep()}</View>
      {step !== 4 && (
        <TouchableOpacity onPress={handleContinue} style={styles.continueButtonContainer}>
          <LinearGradient
            colors={["#8B5CF6", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButton}
          >
            <Text style={styles.continueButtonText}>{step === 2 ? "Verify" : "Continue"}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    marginTop: 30,
  },
  backButton: {
    paddingRight: 10,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginLeft: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  illustration: {
    width: width * 0.7,
    height: height * 0.25,
    marginBottom: height * 0.03,
  },
  description: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: width * 0.04,
    textAlign: "center",
    marginBottom: height * 0.04,
    lineHeight: width * 0.06,
  },
  contactOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A3A",
    borderRadius: 15,
    padding: width * 0.04,
    marginBottom: height * 0.02,
    width: "100%",
    borderWidth: 1,
    borderColor: "transparent",
  },
  contactOptionSelected: {
    borderColor: "#8B5CF6",
  },
  contactIconContainer: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderRadius: 10,
    padding: 10,
    marginRight: width * 0.03,
  },
  contactLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: width * 0.035,
  },
  contactValue: {
    color: "#FFFFFF",
    fontSize: width * 0.04,
    fontWeight: "500",
  },
  checkmarkIcon: {
    marginLeft: "auto",
  },
  continueButtonContainer: {
    width: "90%",
    alignSelf: "center",
    marginBottom: height * 0.03,
  },
  continueButton: {
    height: height * 0.07,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: width * 0.045,
    fontWeight: "600",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: height * 0.03,
  },
  otpInput: {
    width: width * 0.15,
    height: width * 0.15,
    backgroundColor: "#2A2A3A",
    borderRadius: 10,
    color: "#FFFFFF",
    fontSize: width * 0.06,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  resendText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: width * 0.038,
    marginBottom: height * 0.02,
  },
  resendTimer: {
    color: "#8B5CF6",
    fontWeight: "bold",
  },
  resendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#8B5CF6",
    marginBottom: height * 0.03,
  },
  resendButtonDisabled: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.5)",
    marginBottom: height * 0.03,
  },
  resendButtonText: {
    color: "#8B5CF6",
    fontSize: width * 0.038,
    fontWeight: "600",
  },
  resendButtonTextDisabled: {
    color: "rgba(139, 92, 246, 0.5)",
    fontSize: width * 0.038,
    fontWeight: "600",
  },
  keypadContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    marginTop: height * 0.02,
  },
  keypadButton: {
    width: width / 4 - 20,
    height: width / 4 - 20,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: (width / 4 - 20) / 2,
    backgroundColor: "#2A2A3A",
  },
  keypadText: {
    color: "#FFFFFF",
    fontSize: width * 0.06,
    fontWeight: "bold",
  },
  inputContainer: {
    width: "100%",
    marginBottom: height * 0.025,
  },
  passwordInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A3A",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: width * 0.04,
  },
  passwordIcon: {
    marginRight: width * 0.03,
  },
  passwordField: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: width * 0.04,
    paddingVertical: height * 0.02,
  },
  eyeButton: {
    paddingLeft: width * 0.03,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: height * 0.03,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  rememberMeText: {
    color: "#FFFFFF",
    fontSize: width * 0.04,
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.05,
  },
  successIllustration: {
    width: width * 0.8,
    height: height * 0.3,
    marginBottom: height * 0.03,
  },
  congratulationsText: {
    color: "#8B5CF6",
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginBottom: height * 0.01,
  },
  successMessage: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: width * 0.04,
    textAlign: "center",
    lineHeight: width * 0.06,
    marginBottom: height * 0.03,
  },
  loadingIndicator: {
    marginTop: height * 0.02,
  },
})

export default ForgotPassword
