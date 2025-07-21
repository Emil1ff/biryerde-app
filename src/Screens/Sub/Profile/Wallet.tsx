"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useNavigation } from "@react-navigation/native"
import { WalletScreenProps } from "../../../Types/navigation"

interface Transaction {
  id: string
  type: "expense" | "income"
  description: string
  date: string
  amount: number
}

const recentTransactions: Transaction[] = [
  { id: "1", type: "expense", description: "Ev Temizliği", date: "Oca 15, 2025", amount: -50.0 },
  { id: "2", type: "income", description: "Bakiye Yükleme", date: "Oca 10, 2025", amount: 100.0 },
  { id: "3", type: "expense", description: "Araba Yıkama", date: "Oca 08, 2025", amount: -25.0 },
  { id: "4", type: "income", description: "Referans Bonusu", date: "Oca 05, 2025", amount: 10.0 },
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

const WalletScreen: React.FC = () => {
  const navigation = useNavigation<WalletScreenProps["navigation"]>()
  const currentBalance = 1250.0

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cüzdanım</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.balanceCard}>
        <LinearGradient
          colors={["#4CAF50", "#66BB6A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceGradient}
        >
          <Text style={styles.balanceLabel}>Mevcut Bakiye</Text>
          <Text style={styles.balanceAmount}>USD {currentBalance.toFixed(2)}</Text>
          <TouchableOpacity style={styles.addMoneyButton} onPress={() => navigation.navigate("AddMoney")}>
            <Icon name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.addMoneyButtonText}>Para Ekle</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Son İşlemler</Text>
      </View>
      <FlatList
        data={recentTransactions}
        renderItem={({ item }) => <TransactionItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.transactionsList}
        scrollEnabled={false} // Sadece son işlemleri gösterdiği için kaydırmayı kapat
      />
      <TouchableOpacity style={styles.viewAllButton} onPress={() => navigation.navigate("AllTransactions")}>
        <Text style={styles.viewAllButtonText}>Tüm İşlemleri Görüntüle</Text>
        <Icon name="chevron-forward-outline" size={16} color="#8B5CF6" />
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ödeme Yöntemleri</Text>
      </View>
      <TouchableOpacity style={styles.addPaymentMethodButton} onPress={() => navigation.navigate("AddPaymentMethod")}>
        <MaterialCommunityIcons name="credit-card-plus-outline" size={24} color="#8B5CF6" />
        <Text style={styles.addPaymentMethodButtonText}>Yeni Ödeme Yöntemi Ekle</Text>
      </TouchableOpacity>
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
  balanceCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  balanceGradient: {
    padding: 20,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  addMoneyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addMoneyButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  transactionsList: {
    paddingHorizontal: 20,
    paddingBottom: 10,
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
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginTop: 10,
    marginHorizontal: 20,
  },
  viewAllButtonText: {
    fontSize: 16,
    color: "#8B5CF6",
    fontWeight: "600",
    marginRight: 5,
  },
  addPaymentMethodButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#212121",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  addPaymentMethodButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 10,
  },
})

export default WalletScreen
