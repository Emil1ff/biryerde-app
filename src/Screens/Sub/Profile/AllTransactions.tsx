"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import { AllTransactionsScreenProps } from "../../../Types/navigation"

interface Transaction {
  id: string
  type: "expense" | "income"
  description: string
  date: string
  amount: number
}

const transactions: Transaction[] = [
  { id: "t1", type: "expense", description: "Ev Temizliği", date: "Oca 15, 2025", amount: -50.0 },
  { id: "t2", type: "income", description: "Bakiye Yükleme", date: "Oca 10, 2025", amount: 100.0 },
  { id: "t3", type: "expense", description: "Araba Yıkama", date: "Oca 08, 2025", amount: -25.0 },
  { id: "t4", type: "income", description: "Referans Bonusu", date: "Oca 05, 2025", amount: 10.0 },
  { id: "t5", type: "expense", description: "Tesisat Hizmeti", date: "Ara 28, 2024", amount: -75.0 },
  { id: "t6", type: "income", description: "Bakiye Yükleme", date: "Ara 20, 2024", amount: 200.0 },
  { id: "t7", type: "expense", description: "Bahçe Bakımı", date: "Ara 18, 2024", amount: -60.0 },
  { id: "t8", type: "income", description: "İade", date: "Ara 12, 2024", amount: 15.0 },
  { id: "t9", type: "expense", description: "Elektrikçi Hizmeti", date: "Ara 05, 2024", amount: -90.0 },
  { id: "t10", type: "income", description: "Referans Bonusu", date: "Kas 28, 2024", amount: 20.0 },
  { id: "t11", type: "expense", description: "Ev Temizliği", date: "Kas 20, 2024", amount: -50.0 },
  { id: "t12", type: "income", description: "Bakiye Yükleme", date: "Kas 15, 2024", amount: 150.0 },
]

const TransactionItem: React.FC<{ item: Transaction }> = ({ item }) => {
  const isExpense = item.type === "expense"
  const iconName = isExpense ? "arrow-up-circle-outline" : "arrow-down-circle-outline"
  const iconColor = isExpense ? "#EF4444" : "#10B981"
  const amountColor = isExpense ? "#EF4444" : "#10B981"

  return (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={[styles.iconContainer, { backgroundColor: isExpense ? "#331A1A" : "#1A331A" }]}>
        <Icon name={iconName} size={24} color={iconColor} />
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
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tüm İşlemler</Text>
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
  transactionsList: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#212121",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 13,
    color: "#B0BEC5",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default AllTransactionsScreen
