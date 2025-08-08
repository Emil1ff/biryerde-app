"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Modal, Alert } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons" 
import servicesData from "../../../data/services.json"

const EReceiptScreen = ({ route, navigation }: any) => {
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

  const [isMoreOptionsModalVisible, setMoreOptionsModalVisible] = useState(false)

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

  const subtotal = Number.parseFloat(totalPrice) / (appliedPromo?.value ? 1 - appliedPromo.value : 1) 
  const promoDiscount = appliedPromo ? (appliedPromo.value < 1 ? subtotal * appliedPromo.value : appliedPromo.value) : 0
  const finalTotal = Number.parseFloat(totalPrice)

  const handleMoreOptionPress = (option: string) => {
    setMoreOptionsModalVisible(false)
    switch (option) {
      case "viewManage":
        Alert.alert("Action", "View & Manage functionality will be implemented here.")
        // navigation.navigate("BookingDetails", { bookingId: serviceId }); // Example navigation
        break
      case "downloadReceipt":
        Alert.alert("Action", "Download Receipt functionality will be implemented here.")
        break
      case "share":
        Alert.alert("Action", "Share functionality will be implemented here.")
        break
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>E-Receipt</Text>
        <TouchableOpacity onPress={() => setMoreOptionsModalVisible(true)} style={styles.moreOptionsButton}>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.barcodeContainer}>
          <Image
            source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/QR_deWP.svg/1200px-QR_deWP.svg.png" }}
            style={styles.barcodeImage}
            resizeMode="contain"
          />
          <View style={styles.logo}><View style={styles.logo2}></View></View>
          <Text style={styles.barcodeText}>#17728</Text>
        </View>

        <View style={styles.receiptSection}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={styles.detailValue}>{service?.name || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{category?.name || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Provider</Text>
            <Text style={styles.detailValue}>{service?.exampleProviderName || "N/A"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>
              {selectedDate ? new Date(selectedDate).toDateString() : "N/A"} at {selectedTime || "N/A"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booking Hours</Text>
            <Text style={styles.detailValue}>{workingHours} hours</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{address || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.receiptSection}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>${subtotal.toFixed(2)}</Text>
          </View>
          {appliedPromo && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Promo ({appliedPromo.discount})</Text>
              <Text style={styles.detailValue}>-${promoDiscount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total</Text>
            <Text style={styles.detailValue}>${finalTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailValue}>{getPaymentMethodName(selectedPaymentMethod || "")}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date of Payment</Text>
            <Text style={styles.detailValue}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isMoreOptionsModalVisible}
        onRequestClose={() => setMoreOptionsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMoreOptionsModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleMoreOptionPress("viewManage")}>
              <Text style={styles.modalOptionText}>View & Manage</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleMoreOptionPress("downloadReceipt")}>
              <Text style={styles.modalOptionText}>Download Receipt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleMoreOptionPress("share")}>
              <Text style={styles.modalOptionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: "#8B5CF6",
    borderRadius: 10,
    position: "absolute",
    top: "45%",
    transform: [{ rotate: '45deg' }]
  },
  logo2: {
    width: 20,
    height: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -10 }, { translateY: -10 }],
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
  moreOptionsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  barcodeContainer: {
    alignItems: "center",
    // backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 20,
    borderWidth: 1,
    // borderColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
  },
  barcodeImage: {
    width: "80%",
    height: 200,
    marginBottom: 10,
  },
  barcodeText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "600",
  },
  receiptSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    paddingBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#212121",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalOptionText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "500",
    textAlign: "center",
  },
})

export default EReceiptScreen
