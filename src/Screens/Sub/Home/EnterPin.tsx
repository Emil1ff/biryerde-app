"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Vibration } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

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
  const [error, setError] = useState(false)

  const handlePinInput = (num: string) => {
    if (error) setError(false) 
    if (pin.length < 4) {
      setPin(pin + num)
    }
  }

  const handleDeletePin = () => {
    if (error) setError(false)
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
      setError(true)
      Vibration.vibrate(200) 
      setTimeout(() => setPin(""), 500) 
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Enter Your PIN</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <View style={styles.content}>
        <Text style={styles.instructionText}>Enter your PIN to confirm payment</Text>
        <View style={[styles.pinDisplayContainer, error && styles.pinDisplayError]}>
          {[0, 1, 2, 3].map((index) => (
            <View key={index} style={styles.pinDot}>
              {pin.length > index && <View style={styles.pinDotFilled} />}
            </View>
          ))}
        </View>
        {error && <Text style={styles.errorMessage}>Incorrect PIN. Try again.</Text>}

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
                    <Icon name="backspace-outline" size={28} color="#FFFFFF" />
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  instructionText: {
    fontSize: 18, 
    color: "rgba(255, 255, 255, 0.7)", 
    marginBottom: 40, 
    fontWeight: "500",
  },
  pinDisplayContainer: {
    flexDirection: "row",
    marginBottom: 30, 
    backgroundColor: "rgba(255, 255, 255, 0.05)", 
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
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
    width: 25, 
    height: 25,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: "rgba(139, 92, 246, 0.5)", 
    marginHorizontal: 12, 
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)", 
  },
  pinDotFilled: {
    width: 15, 
    height: 15,
    borderRadius: 7.5,
    backgroundColor: "#8B5CF6", 
  },
  errorMessage: {
    color: "#FF6B6B", 
    fontSize: 14,
    marginBottom: 20,
    fontWeight: "600",
  },
  keypad: {
    width: "100%",
    maxWidth: 320, 
    marginTop: 20,
  },
  keypadRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 18, 
  },
  keypadButton: {
    width: 85, 
    height: 70,
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
    fontSize: 32, 
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  bottomBar: {
    paddingVertical: 18, 
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#1A1A2E",
  },
  confirmButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 16, 
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 18, 
    fontWeight: "bold",
  },
})

export default EnterPinScreen
