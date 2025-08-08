"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Vibration, Dimensions } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import CustomAlert from "../../../Components/CustomAlert"

const { width, height } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (width * percentage) / 100
const responsiveHeight = (percentage: number) => (height * percentage) / 100
const responsiveFontSize = (size: number) => size * (width / 375)

const EnterPinScreen = ({ route, navigation }: any) => {
  const {
    serviceId,
    categoryId,
    selectedItems,
    totalPrice,
    selectedDate,
    selectedTime,
    workingHours,
    appliedPromo,
    address,
    selectedPaymentMethod,
  } = route.params
  const [pin, setPin] = useState("")
  const expectedPin = "0000"
  const [isAlertVisible, setIsAlertVisible] = useState(false) 

  const handlePinInput = (num: string) => {
    if (isAlertVisible) setIsAlertVisible(false)
    if (pin.length < 4) {
      setPin(pin + num)
    }
  }

  const handleDeletePin = () => {
    if (isAlertVisible) setIsAlertVisible(false)
    setPin(pin.slice(0, -1))
  }

  const handleConfirm = () => {
    if (pin === expectedPin) {
      navigation.navigate("BookingConfirmation", {
        serviceId,
        categoryId,
        selectedItems,
        totalPrice,
        selectedDate,
        selectedTime,
        workingHours,
        appliedPromo,
        address,
        selectedPaymentMethod,
      })
    } else {
      // Vibration.vibrate(200)
      setIsAlertVisible(true)
      setTimeout(() => setPin(""), 500)
    }
  }

  const handleCloseAlert = () => {
    setIsAlertVisible(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={responsiveFontSize(24)} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enter Your PIN</Text>
        <View style={{ width: responsiveFontSize(40) }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.instructionText}>Enter your PIN to confirm payment</Text>
        <View style={[styles.pinDisplayContainer, isAlertVisible && styles.pinDisplayError]}>
          {[0, 1, 2, 3].map((index) => (
            <View key={index} style={styles.pinDot}>
              {pin.length > index && <View style={styles.pinDotFilled} />}
            </View>
          ))}
        </View>
        {isAlertVisible && <Text style={styles.errorMessage}>Incorrect PIN. Try again.</Text>}
        <View style={styles.keypad}>
          {[
            ["1", "2", "3"],
            ["4", "5", "6"],
            ["7", "8", "9"],
            ["", "0", "delete"],
          ].map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keypadRow}>
              {row.map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.keypadButton, key === "" && styles.hiddenButton]}
                  onPress={() => (key === "delete" ? handleDeletePin() : handlePinInput(key))}
                  disabled={key === ""}
                >
                  {key === "delete" ? (
                    <Icon name="backspace-outline" size={responsiveFontSize(28)} color="#FFFFFF" />
                  ) : (
                    <Text style={styles.keypadButtonText}>{key}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={pin.length !== 4}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>

      <CustomAlert
        isVisible={isAlertVisible}
        title="PIN Error"
        message="The PIN you entered is incorrect. Please try again."
        onClose={handleCloseAlert}
        buttons={[{ text: "OK", onPress: handleCloseAlert, style: "default" }]}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(7),
    paddingBottom: responsiveHeight(2.5),
  },
  backButton: {
    width: responsiveFontSize(40),
    height: responsiveFontSize(40),
    borderRadius: responsiveFontSize(20),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(6),
  },
  instructionText: {
    fontSize: responsiveFontSize(18),
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: responsiveHeight(5),
    fontWeight: "500",
  },
  pinDisplayContainer: {
    flexDirection: "row",
    marginBottom: responsiveHeight(4),
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 15,
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  pinDisplayError: {
    borderColor: "#FF6B6B",
    borderWidth: 2,
  },
  pinDot: {
    width: responsiveFontSize(25),
    height: responsiveFontSize(25),
    borderRadius: responsiveFontSize(12.5),
    borderWidth: 2,
    borderColor: "rgba(139, 92, 246, 0.5)",
    marginHorizontal: responsiveWidth(3),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  pinDotFilled: {
    width: responsiveFontSize(15),
    height: responsiveFontSize(15),
    borderRadius: responsiveFontSize(7.5),
    backgroundColor: "#8B5CF6",
  },
  errorMessage: {
    color: "#FF6B6B",
    fontSize: responsiveFontSize(14),
    marginBottom: responsiveHeight(2.5),
    fontWeight: "600",
  },
  keypad: {
    width: "100%",
    maxWidth: 320,
    marginTop: responsiveHeight(2.5),
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: responsiveHeight(2.5),
  },
  keypadButton: {
    width: responsiveWidth(22),
    height: responsiveHeight(9),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "#1A1A1A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  hiddenButton: {
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
  },
  keypadButtonText: {
    fontSize: responsiveFontSize(32),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  bottomBar: {
    paddingVertical: responsiveHeight(2.5),
    paddingHorizontal: responsiveWidth(5),
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#1A1A2E",
  },
  confirmButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: responsiveHeight(2),
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(18),
    fontWeight: "bold",
  },
})

export default EnterPinScreen
