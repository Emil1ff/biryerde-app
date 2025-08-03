"use client"
import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Dimensions } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import type { AllTransactionsScreenProps } from "../../../Types/navigation"

const { width, height } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (width * percentage) / 100
const responsiveHeight = (percentage: number) => (height * percentage) / 100
const responsiveFontSize = (size: number) => size * (width / 375)

interface Transaction {
  id: string
  type: "expense" | "income"
  description: string
  date: string
  amount: number
}

const transactions: Transaction[] = [
  { id: "t1", type: "expense", description: "House Cleaning", date: "Jan 15, 2025", amount: -50.0 },
  { id: "t2", type: "income", description: "Balance Top-up", date: "Jan 10, 2025", amount: 100.0 },
  { id: "t3", type: "expense", description: "Car Wash", date: "Jan 08, 2025", amount: -25.0 },
  { id: "t4", type: "income", description: "Referral Bonus", date: "Jan 05, 2025", amount: 10.0 },
  { id: "t5", type: "expense", description: "Plumbing Service", date: "Dec 28, 2024", amount: -75.0 },
  { id: "t6", type: "income", description: "Balance Top-up", date: "Dec 20, 2024", amount: 200.0 },
  { id: "t7", type: "expense", description: "Garden Maintenance", date: "Dec 18, 2024", amount: -60.0 },
  { id: "t8", type: "income", description: "Refund", date: "Dec 12, 2024", amount: 15.0 },
  { id: "t9", type: "expense", description: "Electrician Service", date: "Dec 05, 2024", amount: -90.0 },
  { id: "t10", type: "income", description: "Referral Bonus", date: "Nov 28, 2024", amount: 20.0 },
  { id: "t11", type: "expense", description: "House Cleaning", date: "Nov 20, 2024", amount: -50.0 },
  { id: "t12", type: "income", description: "Balance Top-up", date: "Nov 15, 2024", amount: 150.0 },
]

const TransactionItem: React.FC<{ item: Transaction }> = ({ item }) => {
  const isExpense = item.type === "expense"
  const iconName = isExpense ? "arrow-up-circle-outline" : "arrow-down-circle-outline"
  const iconColor = isExpense ? "#FF6B6B" : "#6BFF6B"
  const amountColor = isExpense ? "#FF6B6B" : "#6BFF6B"
  return (
    <TouchableOpacity style={styles.transactionItem}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isExpense ? "rgba(255, 107, 107, 0.1)" : "rgba(107, 255, 107, 0.1)" },
        ]}
      >
        <Icon name={iconName} size={responsiveFontSize(24)} color={iconColor} />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color: amountColor }]}>
        {isExpense ? "" : "+"}
        {item.amount.toFixed(2)} USD
      </Text>
    </TouchableOpacity>
  )
}

const AllTransactionsScreen: React.FC = () => {
  const navigation = useNavigation<AllTransactionsScreenProps["navigation"]>()
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={responsiveFontSize(24)} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Transactions</Text>
        <View style={styles.placeholder} />
      </View>
      <FlatList
        data={transactions}
        renderItem={({ item }) => <TransactionItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.transactionsList}
        showsVerticalScrollIndicator={false}
      />
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
  transactionsList: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2.5),
    paddingBottom: responsiveHeight(5),
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    marginBottom: responsiveHeight(1.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    width: responsiveFontSize(50),
    height: responsiveFontSize(50),
    borderRadius: responsiveFontSize(25),
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsiveWidth(4),
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: responsiveFontSize(17),
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: responsiveHeight(0.5),
  },
  transactionDate: {
    fontSize: responsiveFontSize(14),
    color: "#9CA3AF",
  },
  transactionAmount: {
    fontSize: responsiveFontSize(18),
    fontWeight: "700",
  },
})

export default AllTransactionsScreen
