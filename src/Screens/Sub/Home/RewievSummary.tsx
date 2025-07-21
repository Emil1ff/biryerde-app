"use client"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import servicesData from "../../../data/services.json"

const ReviewSummaryScreen = ({ route, navigation }: any) => {
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

  const category = servicesData.categories.find((cat) => cat.id === categoryId)
  const service = category?.services.find((svc) => svc.id === serviceId)

  const getPaymentMethodName = (id: string) => {
    switch (id) {
      case "paypal":
        return "PayPal"
      case "google-pay":
        return "Google Pay"
      case "apple-pay":
        return "Apple Pay"
      case "mastercard":
        return "Mastercard **** 8765"
      case "cash-money":
        return "Cash Money"
      default:
        return "Unknown"
    }
  }

  const subtotal = Number.parseFloat(totalPrice) / (appliedPromo?.value ? 1 - appliedPromo.value : 1) // Reverse promo calculation for subtotal
  const promoDiscount = appliedPromo ? (appliedPromo.value < 1 ? subtotal * appliedPromo.value : appliedPromo.value) : 0
  const finalTotal = Number.parseFloat(totalPrice)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Summary</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Invoice</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service</Text>
            <Text style={styles.summaryValue}>{service?.name || "N/A"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Category</Text>
            <Text style={styles.summaryValue}>{category?.name || "N/A"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Provider</Text>
            <Text style={styles.summaryValue}>{service?.exampleProviderName || "N/A"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Date & Time</Text>
            <Text style={styles.summaryValue}>
              {selectedDate ? new Date(selectedDate).toDateString() : "N/A"} at {selectedTime || "N/A"}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Booking Hours</Text>
            <Text style={styles.summaryValue}>{workingHours} hours</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Location</Text>
            <Text style={styles.summaryValue}>{address || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Payment Details</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
          {appliedPromo && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Promo ({appliedPromo.discount})</Text>
              <Text style={styles.summaryValue}>-${promoDiscount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>${finalTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Method</Text>
            <Text style={styles.summaryValue}>{getPaymentMethodName(selectedPaymentMethod || "")}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() =>
            navigation.navigate("EnterPIN", {
              serviceId,
              categoryId,
              selectedItems,
              totalPrice: finalTotal, // Pass the final total
              selectedDate,
              selectedTime,
              workingHours,
              appliedPromo,
              address,
              selectedPaymentMethod,
            })
          }
        >
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
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
  summaryCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomBar: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#1A1A2E",
  },
  confirmButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default ReviewSummaryScreen
