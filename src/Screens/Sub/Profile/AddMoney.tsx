"use client"
import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert, Dimensions } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import type { AddMoneyScreenProps } from "../../../Types/navigation"

const { width, height } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (width * percentage) / 100
const responsiveHeight = (percentage: number) => (height * percentage) / 100
const responsiveFontSize = (size: number) => size * (width / 375)

const AddMoneyScreen: React.FC = () => {
  const navigation = useNavigation<AddMoneyScreenProps["navigation"]>()
  const [amount, setAmount] = useState("")
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const moneyOptions = [50, 100, 200, 500]

  const handleAddMoney = () => {
    if (Number.parseFloat(amount) > 0) {
      Alert.alert("Money Added", `${amount} USD has been added to your account.`)
      navigation.goBack()
    } else {
      Alert.alert("Error", "Please enter a valid amount.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={responsiveFontSize(24)} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Money</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Enter Amount</Text>
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
            colors={["#8B5CF6", "#6B46C1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addButtonGradient}
          >
            <Text style={styles.addButtonText}>Add Money</Text>
          </LinearGradient>
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
    alignItems: "center",
  },
  label: {
    fontSize: responsiveFontSize(16),
    color: "#B0BEC5",
    marginBottom: responsiveHeight(1.5),
  },
  amountInput: {
    fontSize: responsiveFontSize(48),
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    width: "100%",
    marginBottom: responsiveHeight(0.5),
  },
  currency: {
    fontSize: responsiveFontSize(24),
    fontWeight: "600",
    color: "#B0BEC5",
    marginBottom: responsiveHeight(4),
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: responsiveHeight(5),
  },
  optionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingVertical: responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(5),
    margin: responsiveWidth(2),
    minWidth: responsiveWidth(30),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedOptionButton: {
    backgroundColor: "#8B5CF6",
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  optionText: {
    fontSize: responsiveFontSize(16),
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
    marginTop: "auto",
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

export default AddMoneyScreen
