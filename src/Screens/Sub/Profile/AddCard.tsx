"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import LinearGradient from "react-native-linear-gradient"

const AddCard: React.FC<any> = ({ navigation }) => {
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "")
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || ""
    setCardNumber(formatted)
  }

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, "")
    let formatted = cleaned
    if (cleaned.length > 2) {
      formatted = `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`
    }
    setExpiryDate(formatted)
  }

  const handleAddNewCard = () => {
    console.log("Adding New Card:", { cardNumber, cardName, expiryDate, cvv })
    navigation.goBack() 
  }

  const lastFourDigits = cardNumber.replace(/\s/g, "").slice(-4)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Card</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#8B5CF6", "#A855F7", "#D946EF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardPreview}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardType}>Mastercard</Text>
            <Icon name="card" size={30} color="#FFFFFF" />
          </View>
          <Text style={styles.cardNumberDisplay}>{cardNumber.length > 0 ? cardNumber : "•••• •••• •••• ••••"}</Text>
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardLabel}>Card Holder Name</Text>
              <Text style={styles.cardValue}>{cardName || "YOUR NAME"}</Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>Expiry Date</Text>
              <Text style={styles.cardValue}>{expiryDate || "MM/YY"}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.form}>
          <Text style={styles.inputLabel}>Card Holder Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Andrew Ainsley"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={cardName}
            onChangeText={setCardName}
          />

          <Text style={styles.inputLabel}>Card Number</Text>
          <TextInput
            style={styles.input}
            placeholder="2823 4567 8901 2345"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={cardNumber}
            onChangeText={formatCardNumber}
            keyboardType="numeric"
            maxLength={19} 
          />

          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={expiryDate}
                onChangeText={formatExpiryDate}
                keyboardType="numeric"
                maxLength={5} 
              />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="•••"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.addNewCardButton} onPress={handleAddNewCard}>
          <LinearGradient
            colors={["#8B5CF6", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addNewCardGradient}
          >
            <Text style={styles.addNewCardText}>Add New Card</Text>
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardPreview: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    aspectRatio: 1.6, 
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardType: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cardNumberDisplay: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  form: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  rowInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  addNewCardButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 40,
  },
  addNewCardGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  addNewCardText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
})

export default AddCard
