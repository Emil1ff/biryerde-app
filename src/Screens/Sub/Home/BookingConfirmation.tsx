"use client"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

const BookingConfirmationScreen = ({ route, navigation }: any) => {
  const { serviceId, categoryId, totalPrice } = route.params 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Icon name="checkmark-outline" size={80} color="#8B5CF6" />
        </View>
        <Text style={styles.confirmationTitle}>Booking Successful!</Text>
        <Text style={styles.confirmationMessage}>
          Your booking for {serviceId} is confirmed. Total: ${totalPrice}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("EReceipt", {
              serviceId,
              categoryId,
              totalPrice,
              ...route.params,
            })
          }
        >
          <Text style={styles.buttonText}>View E-Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => navigation.navigate("Main")}>
          <Text style={styles.secondaryButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 30,
    width: "100%",
    maxWidth: 400,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(139, 92, 246, 0.2)", // Light purple background
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  confirmationTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 15,
    textAlign: "center",
  },
  confirmationMessage: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  secondaryButtonText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default BookingConfirmationScreen
