"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

// Mock data for payment methods
const paymentMethods = [
  { id: "paypal", name: "PayPal", icon: "paypal", type: "Ionicons" },
  { id: "google-pay", name: "Google Pay", icon: "google", type: "Ionicons" },
  { id: "apple-pay", name: "Apple Pay", icon: "apple", type: "Ionicons" },
  { id: "mastercard", name: "Mastercard", icon: "credit-card", type: "MaterialIcons", last4: "8765" },
  { id: "cash-money", name: "Cash Money", icon: "attach-money", type: "MaterialIcons" },
]

const PaymentMethodsScreen = ({ route, navigation }: any) => {
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
    locationDetails,
  } = route.params
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)

  const handleContinue = () => {
    if (selectedPaymentMethod) {
      navigation.navigate("ReviewSummary", {
        serviceId,
        categoryId,
        selectedItems,
        totalPrice,
        selectedDate,
        selectedTime,
        workingHours,
        appliedPromo,
        address,
        locationDetails,
        selectedPaymentMethod,
      })
    } else {
      alert("Please select a payment method.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.instructionText}>Select the payment method you want to use</Text>

        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={styles.paymentCard}
            onPress={() => setSelectedPaymentMethod(method.id)}
          >
            {method.type === "Ionicons" ? (
              <Icon name={method.icon} size={28} color="#FFFFFF" style={styles.paymentIcon} />
            ) : (
              <MaterialIcons name={method.icon} size={28} color="#FFFFFF" style={styles.paymentIcon} />
            )}
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>{method.name}</Text>
              {method.last4 && <Text style={styles.paymentDetails}>**** {method.last4}</Text>}
            </View>
            <View style={styles.radioCircle}>
              {selectedPaymentMethod === method.id && <View style={styles.selectedRadioFill} />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  instructionText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 20,
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  paymentIcon: {
    marginRight: 15,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  paymentDetails: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
  },
  selectedRadioFill: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#8B5CF6",
  },
  bottomBar: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#1A1A2E",
  },
  continueButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default PaymentMethodsScreen
