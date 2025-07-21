"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

// Mock data for promo codes
const promoCodes = [
  {
    id: "promo1",
    name: "Special 20% Off",
    description: "Get 20% off on your first booking.",
    discount: "20% OFF",
    value: 0.2,
    icon: "local-offer",
    color: "#8B5CF6", 
  },
  {
    id: "promo2",
    name: "Welcome 15% Off",
    description: "Welcome discount for new users.",
    discount: "15% OFF",
    value: 0.15,
    icon: "card-giftcard",
    color: "#FFC107", 
  },
  {
    id: "promo3",
    name: "Holiday 25% Off",
    description: "Enjoy 25% off during the holiday season.",
    discount: "25% OFF",
    value: 0.25,
    icon: "redeem",
    color: "#FF6B6B",
  },
  {
    id: "promo4",
    name: "Discount 10% Off",
    description: "General discount for all services.",
    discount: "10% OFF",
    value: 0.1,
    icon: "discount",
    color: "#4ECDC4", 
  },
  {
    id: "promo5",
    name: "Oneuse $10 Off",
    description: "Get $10 off on any service.",
    discount: "$10 OFF",
    value: 10, 
    icon: "attach-money",
    color: "#FF7F50", 
  },
]

const AddPromoScreen = ({ route, navigation }: any) => {
  const { onSelectPromo } = route.params
  const [selectedPromo, setSelectedPromo] = useState<any>(null)

  const handleApplyPromo = () => {
    if (selectedPromo) {
      onSelectPromo(selectedPromo)
    }
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Promo</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView style={styles.scrollView}>
        {promoCodes.map((promo) => (
          <TouchableOpacity
            key={promo.id}
            style={[styles.promoCard, selectedPromo?.id === promo.id && styles.selectedPromoCard]}
            onPress={() => setSelectedPromo(promo)}
          >
            <View style={[styles.promoIconCircle, { backgroundColor: promo.color }]}>
              <MaterialIcons name={promo.icon} size={24} color="#FFFFFF" />
            </View>
            <View style={styles.promoInfo}>
              <Text style={styles.promoName}>{promo.name}</Text>
              <Text style={styles.promoDescription}>{promo.description}</Text>
            </View>
            <View style={styles.radioCircle}>
              {selectedPromo?.id === promo.id && <View style={styles.selectedRadioFill} />}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.applyPromoButton} onPress={handleApplyPromo}>
          <Text style={styles.applyPromoButtonText}>Apply Promo</Text>
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
  promoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedPromoCard: {
    borderColor: "#8B5CF6", 
  },
  promoIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  promoInfo: {
    flex: 1,
  },
  promoName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  promoDescription: {
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
  applyPromoButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  applyPromoButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default AddPromoScreen
