"use client"
import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert, ScrollView, Dimensions } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useNavigation } from "@react-navigation/native"
import type { AddPaymentMethodScreenProps } from "../../../Types/navigation"

const { width, height } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (width * percentage) / 100
const responsiveHeight = (percentage: number) => (height * percentage) / 100
const responsiveFontSize = (size: number) => size * (width / 375)

const AddPaymentMethodScreen: React.FC = () => {
  const navigation = useNavigation<AddPaymentMethodScreenProps["navigation"]>()
  const [cardNumber, setCardNumber] = useState("")
  const [cardHolder, setCardHolder] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardType, setCardType] = useState<string | null>(null)

  const detectCardType = (number: string) => {
    if (number.startsWith("4")) return "visa"
    if (number.startsWith("5")) return "mastercard"
    if (number.startsWith("34") || number.startsWith("37")) return "amex"
    return null
  }

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "")
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || ""
    setCardNumber(formatted)
    setCardType(detectCardType(cleaned))
  }

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, "")
    if (cleaned.length > 2) {
      setExpiryDate(`${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`)
    } else {
      setExpiryDate(cleaned)
    }
  }

  const handleAddMethod = () => {
    if (cardNumber && cardHolder && expiryDate && cvv) {
      Alert.alert("Payment Method Added", "Your new payment method has been successfully added.")
      navigation.goBack()
    } else {
      Alert.alert("Error", "Please fill in all fields.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={responsiveFontSize(24)} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Payment Method</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardPreview}>
          <LinearGradient
            colors={["#8B5CF6", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Credit/Debit Card</Text>
              {cardType && (
                <MaterialCommunityIcons
                  name={
                    cardType === "visa"
                      ? "credit-card-visa"
                      : cardType === "mastercard"
                        ? "credit-card-mastercard"
                        : cardType === "amex"
                          ? "credit-card-american-express"
                          : "credit-card-outline"
                  }
                  size={responsiveFontSize(40)}
                  color="#FFFFFF"
                />
              )}
            </View>
            <Text style={styles.cardNumberPreview}>
              {cardNumber.padEnd(19, "•").replace(/(\S{4})/g, "$1 ").trim()}
            </Text>
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardSmallText}>Card Holder</Text>
                <Text style={styles.cardHolderPreview}>{cardHolder || "FULL NAME"}</Text>
              </View>
              <View>
                <Text style={styles.cardSmallText}>Expiry Date</Text>
                <Text style={styles.expiryDatePreview}>{expiryDate || "MM/YY"}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Card Number</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="XXXX XXXX XXXX XXXX"
            placeholderTextColor="#B0BEC5"
            maxLength={19}
            value={cardNumber}
            onChangeText={formatCardNumber}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Card Holder Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Name on Card"
            placeholderTextColor="#B0BEC5"
            value={cardHolder}
            onChangeText={setCardHolder}
          />
        </View>
        <View style={styles.rowInputs}>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.inputLabel}>Expiry Date (MM/YY)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="MM/YY"
              placeholderTextColor="#B0BEC5"
              maxLength={5}
              value={expiryDate}
              onChangeText={formatExpiryDate}
            />
          </View>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="XXX"
              placeholderTextColor="#B0BEC5"
              maxLength={3}
              secureTextEntry
              value={cvv}
              onChangeText={setCvv}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddMethod}>
          <LinearGradient
            colors={["#8B5CF6", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addButtonGradient}
          >
            <Text style={styles.addButtonText}>Add Payment Method</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  backButton: {
    padding: responsiveWidth(1),
  },
  headerTitle: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  placeholder: {
    width: responsiveFontSize(24),
  },
  content: {
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(3),
  },
  cardPreview: {
    marginBottom: responsiveHeight(3),
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
  },
  cardGradient: {
    padding: responsiveWidth(5),
    height: responsiveHeight(25),
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: responsiveFontSize(16),
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
  },
  cardNumberPreview: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1,
    textAlign: "center",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardSmallText: {
    fontSize: responsiveFontSize(12),
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: responsiveHeight(0.2),
  },
  cardHolderPreview: {
    fontSize: responsiveFontSize(16),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  expiryDatePreview: {
    fontSize: responsiveFontSize(16),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  inputGroup: {
    marginBottom: responsiveHeight(2.5),
  },
  inputLabel: {
    fontSize: responsiveFontSize(14),
    color: "#B0BEC5",
    marginBottom: responsiveHeight(1),
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.8),
    fontSize: responsiveFontSize(16),
    color: "#FFFFFF",
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: responsiveWidth(43),
  },
  addButton: {
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    marginTop: responsiveHeight(2.5),
    marginBottom: responsiveHeight(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
  },
  addButtonGradient: {
    paddingVertical: responsiveHeight(2.5),
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: responsiveFontSize(18),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
})

export default AddPaymentMethodScreen
