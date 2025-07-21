"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert, ScrollView } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useNavigation } from "@react-navigation/native"
import { AddPaymentMethodScreenProps } from "../../../Types/navigation"

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
      Alert.alert("Ödeme Yöntemi Eklendi", "Yeni ödeme yönteminiz başarıyla eklendi.")
      navigation.goBack()
    } else {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni Ödeme Yöntemi Ekle</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardPreview}>
          <LinearGradient
            colors={["#6A1B9A", "#8E24AA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>Kredi/Banka Kartı</Text>
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
                  size={40}
                  color="#FFFFFF"
                />
              )}
            </View>
            <Text style={styles.cardNumberPreview}>
              {cardNumber
                .padEnd(19, "•")
                .replace(/(\S{4})/g, "$1 ")
                .trim()}
            </Text>
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardSmallText}>Kart Sahibi</Text>
                <Text style={styles.cardHolderPreview}>{cardHolder || "AD SOYAD"}</Text>
              </View>
              <View>
                <Text style={styles.cardSmallText}>Son Kullanma Tarihi</Text>
                <Text style={styles.expiryDatePreview}>{expiryDate || "AA/YY"}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Kart Numarası</Text>
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
          <Text style={styles.inputLabel}>Kart Sahibi Adı</Text>
          <TextInput
            style={styles.input}
            placeholder="Kart üzerindeki ad"
            placeholderTextColor="#B0BEC5"
            value={cardHolder}
            onChangeText={setCardHolder}
          />
        </View>

        <View style={styles.rowInputs}>
          <View style={[styles.inputGroup, styles.halfInput]}>
            <Text style={styles.inputLabel}>Son Kullanma Tarihi (AA/YY)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="AA/YY"
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
            <Text style={styles.addButtonText}>Ödeme Yöntemi Ekle</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  cardPreview: {
    marginBottom: 30,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  cardGradient: {
    padding: 20,
    height: 200,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
  },
  cardNumberPreview: {
    fontSize: 24,
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
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 2,
  },
  cardHolderPreview: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  expiryDatePreview: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#B0BEC5",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#212121",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#FFFFFF",
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  addButton: {
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 20,
    marginBottom: 30,
  },
  addButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
})

export default AddPaymentMethodScreen
