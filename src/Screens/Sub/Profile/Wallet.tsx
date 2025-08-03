"use client"
import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Dimensions, ScrollView } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"

type RootStackParamList = {
  AddMoney: undefined
  AllTransactions: undefined
  AddPaymentMethod: undefined
}

type WalletScreenNavigationProp = StackNavigationProp<RootStackParamList, "AddMoney">

interface Transaction {
  id: string
  type: "expense" | "income"
  description: string
  date: string
  amount: number
}

const { width, height } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (width * percentage) / 100
const responsiveHeight = (percentage: number) => (height * percentage) / 100
const responsiveFontSize = (size: number) => size * (width / 375)

const recentTransactions: Transaction[] = [
  { id: "1", type: "expense", description: "House Cleaning", date: "Jan 15, 2025", amount: -50.0 },
  { id: "2", type: "income", description: "Balance Top-up", date: "Jan 10, 2025", amount: 100.0 },
  { id: "3", type: "expense", description: "Car Wash", date: "Jan 08, 2025", amount: -25.0 },
  { id: "4", type: "income", description: "Referral Bonus", date: "Jan 05, 2025", amount: 10.0 },
  { id: "5", type: "expense", description: "Grocery Shopping", date: "Jan 03, 2025", amount: -75.0 },
  { id: "6", type: "income", description: "Freelance Work", date: "Jan 02, 2025", amount: 200.0 },
  { id: "7", type: "expense", description: "Electricity Bill", date: "Jan 01, 2025", amount: -40.0 },
  { id: "8", type: "expense", description: "Internet Bill", date: "Dec 30, 2024", amount: -30.0 },
  { id: "9", type: "income", description: "Salary", date: "Dec 25, 2024", amount: 1500.0 },
  { id: "10", type: "expense", description: "Restaurant", date: "Dec 20, 2024", amount: -60.0 },
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
          styles.transactionIconContainer,
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

const WalletScreen: React.FC = () => {
  const navigation = useNavigation<WalletScreenNavigationProp>()
  const currentBalance = 1250.0
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={responsiveFontSize(24)} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wallet</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.scrollViewContent}>
        <View style={styles.balanceCard}>
          <LinearGradient
            colors={["#8B5CF6", "#6B46C1"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceGradient}
          >
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>USD {currentBalance.toFixed(2)}</Text>
            <TouchableOpacity style={styles.addMoneyButton} onPress={() => navigation.navigate("AddMoney")}>
              <Icon name="add-circle-outline" size={responsiveFontSize(20)} color="#FFFFFF" />
              <Text style={styles.addMoneyButtonText}>Add Money</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
        <FlatList
          data={recentTransactions}
          renderItem={({ item }) => <TransactionItem item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.transactionsList}
          scrollEnabled={false}
        />
        <TouchableOpacity style={styles.viewAllButton} onPress={() => navigation.navigate("AllTransactions")}>
          <Text style={styles.viewAllButtonText}>View All Transactions</Text>
          <Icon name="chevron-forward-outline" size={responsiveFontSize(16)} color="#8B5CF6" />
        </TouchableOpacity>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
        </View>
        <TouchableOpacity style={styles.addPaymentMethodButton} onPress={() => navigation.navigate("AddPaymentMethod")}>
          <MaterialCommunityIcons name="credit-card-plus-outline" size={responsiveFontSize(24)} color="#8B5CF6" />
          <Text style={styles.addPaymentMethodButtonText}>Add New Payment Method</Text>
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
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: responsiveHeight(4),
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
  balanceCard: {
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(3),
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 12,
  },
  balanceGradient: {
    paddingVertical: responsiveHeight(4),
    paddingHorizontal: responsiveWidth(6),
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: responsiveFontSize(15),
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: responsiveHeight(0.5),
  },
  balanceAmount: {
    fontSize: responsiveFontSize(42),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: responsiveHeight(3),
  },
  addMoneyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 25,
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(5),
  },
  addMoneyButtonText: {
    fontSize: responsiveFontSize(16),
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: responsiveWidth(2),
  },
  sectionHeader: {
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(4),
    marginBottom: responsiveHeight(2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: responsiveFontSize(22),
    fontWeight: "700",
    color: "#FFFFFF",
  },
  transactionsList: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(1.5),
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
  transactionIconContainer: {
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
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: responsiveHeight(1.8),
    marginTop: responsiveHeight(1.5),
    marginHorizontal: responsiveWidth(5),
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    borderRadius: 12,
  },
  viewAllButtonText: {
    fontSize: responsiveFontSize(16),
    color: "#8B5CF6",
    fontWeight: "600",
    marginRight: responsiveWidth(1.5),
  },
  addPaymentMethodButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addPaymentMethodButtonText: {
    fontSize: responsiveFontSize(17),
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: responsiveWidth(3),
  },
})

export default WalletScreen
