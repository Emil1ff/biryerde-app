"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import { AddMoneyScreenProps } from "../../../Types/navigation"

const AddMoneyScreen: React.FC = () => {
  const navigation = useNavigation<AddMoneyScreenProps["navigation"]>()
  const [amount, setAmount] = useState("")
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const moneyOptions = [50, 100, 200, 500]

  const handleAddMoney = () => {
    if (Number.parseFloat(amount) > 0) {
      Alert.alert("Para Eklendi", `${amount} USD hesabınıza eklendi.`)
      navigation.goBack()
    } else {
      Alert.alert("Hata", "Lütfen geçerli bir miktar girin.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Para Ekle</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Miktar Girin</Text>
        <TextInput
          style={styles.amountInput}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor="#B0BEC5"
          value={amount}
          onChangeText={(text) => {
            setAmount(text.replace(/[^0-9.]/g, ""))
            setSelectedOption(null)
          }}
        />
        <Text style={styles.currency}>USD</Text>

        <View style={styles.optionsContainer}>
          {moneyOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.optionButton, selectedOption === option && styles.selectedOptionButton]}
              onPress={() => {
                setAmount(option.toString())
                setSelectedOption(option)
              }}
            >
              <Text style={[styles.optionText, selectedOption === option && styles.selectedOptionText]}>
                {option} USD
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddMoney}>
          <LinearGradient
            colors={["#4CAF50", "#66BB6A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addButtonGradient}
          >
            <Text style={styles.addButtonText}>Para Ekle</Text>
          </LinearGradient>
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
    width: 24, // Back button ile aynı genişlikte boşluk
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#B0BEC5",
    marginBottom: 10,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    width: "100%",
    marginBottom: 5,
  },
  currency: {
    fontSize: 24,
    fontWeight: "600",
    color: "#B0BEC5",
    marginBottom: 30,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 40,
  },
  optionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 8,
    minWidth: 120,
    alignItems: "center",
  },
  selectedOptionButton: {
    backgroundColor: "#4CAF50",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  selectedOptionText: {
    color: "#FFFFFF",
  },
  addButton: {
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    marginTop: "auto", // Sayfanın altına hizala
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

export default AddMoneyScreen
