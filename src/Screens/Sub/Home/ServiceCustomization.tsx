"use client"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

interface ServiceItem {
  id: string
  name: string
  basePrice: number
}

const serviceCustomizationOptions: ServiceItem[] = [
  { id: "living-room", name: "Living Room", basePrice: 15 },
  { id: "terrace", name: "Terrace", basePrice: 10 },
  { id: "bedroom", name: "Bedroom", basePrice: 12 },
  { id: "bathroom", name: "Bathroom", basePrice: 8 },
  { id: "kitchen", name: "Kitchen", basePrice: 20 },
  { id: "dining-room", name: "Dining Room", basePrice: 15 },
  { id: "garage", name: "Garage", basePrice: 25 },
]

const ServiceCustomizationScreen = ({ route, navigation }: any) => {
  const { serviceId, categoryId } = route.params
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({})
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    let calculatedPrice = 0
    for (const itemId in selectedItems) {
      const item = serviceCustomizationOptions.find((opt) => opt.id === itemId)
      if (item) {
        calculatedPrice += item.basePrice * selectedItems[itemId]
      }
    }
    setTotalPrice(calculatedPrice)
  }, [selectedItems])

  const handleQuantityChange = (itemId: string, change: number) => {
    setSelectedItems((prev) => {
      const currentQuantity = prev[itemId] || 0
      const newQuantity = Math.max(0, currentQuantity + change)
      return { ...prev, [itemId]: newQuantity }
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>House Cleaning</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <Text style={styles.instructionText}>Select number of rooms/items to be cleaned</Text>

        {serviceCustomizationOptions.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Text style={styles.itemName}>
              {item.name} <Text style={styles.itemPrice}>(${item.basePrice})</Text>
            </Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(item.id, -1)}>
                <Icon name="remove-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{selectedItems[item.id] || 0}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={() => handleQuantityChange(item.id, 1)}>
                <Icon name="add-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceLabel}>Total Price</Text>
          <Text style={styles.totalPriceValue}>${totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.continueButton, totalPrice === 0 && styles.disabledButton]}
          onPress={() =>
            navigation.navigate("BookingDetails", {
              serviceId,
              categoryId,
              selectedItems,
              totalPrice,
            })
          }
          disabled={totalPrice === 0}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 20,
    fontWeight: "500",
  },
  itemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  itemPrice: {
    fontSize: 17,
    fontWeight: "normal",
    color: "rgba(255, 255, 255, 0.6)",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 25,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  quantityButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginHorizontal: 15,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#1A1A2E",
  },
  totalPriceContainer: {
    alignItems: "flex-start",
  },
  totalPriceLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  totalPriceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  continueButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 35,
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "rgba(139, 92, 246, 0.4)",
    shadowOpacity: 0,
    elevation: 0,
  },
})

export default ServiceCustomizationScreen
