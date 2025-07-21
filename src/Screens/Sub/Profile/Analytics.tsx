"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useNavigation } from "@react-navigation/native"
import { AnalyticsScreenProps } from "../../../Types/navigation"

interface StatCardProps {
  title: string
  value: string
  icon: string
  color: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <View style={styles.statCard}>
    <LinearGradient
      colors={[color, "rgba(0,0,0,0.2)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.statCardGradient}
    >
      <MaterialCommunityIcons name={icon} size={30} color="#FFFFFF" style={styles.statIcon} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </LinearGradient>
  </View>
)

const AnalyticsScreen: React.FC = () => {
  const navigation = useNavigation<AnalyticsScreenProps["navigation"]>()

  const totalServices = 45
  const totalSpending = 1250.0
  const averageRating = 4.8
  const completedBookings = 38
  const pendingBookings = 7

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analizler</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <StatCard title="Toplam Hizmet" value={totalServices.toString()} icon="briefcase-outline" color="#2196F3" />
          <StatCard
            title="Toplam Harcama"
            value={`$${totalSpending.toFixed(2)}`}
            icon="cash-multiple"
            color="#4CAF50"
          />
          <StatCard title="Ortalama Puan" value={averageRating.toFixed(1)} icon="star-outline" color="#FFC107" />
          <StatCard
            title="Tamamlanan Rez."
            value={completedBookings.toString()}
            icon="check-circle-outline"
            color="#8B5CF6"
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Rezervasyon Durumu</Text>
        </View>
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <MaterialCommunityIcons name="check-all" size={24} color="#4CAF50" />
            <Text style={styles.statusText}>Tamamlanan Rezervasyonlar:</Text>
            <Text style={styles.statusValue}>{completedBookings}</Text>
          </View>
          <View style={styles.statusRow}>
            <MaterialCommunityIcons name="timer-sand" size={24} color="#FFC107" />
            <Text style={styles.statusText}>Bekleyen Rezervasyonlar:</Text>
            <Text style={styles.statusValue}>{pendingBookings}</Text>
          </View>
          <View style={styles.statusRow}>
            <MaterialCommunityIcons name="calendar-remove-outline" size={24} color="#EF4444" />
            <Text style={styles.statusText}>İptal Edilen Rezervasyonlar:</Text>
            <Text style={styles.statusValue}>5</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Harcama Dağılımı</Text>
        </View>
        <View style={styles.categorySpendingCard}>
          <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>Ev Hizmetleri</Text>
            <Text style={styles.categoryAmount}>$500.00</Text>
          </View>
          <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>Otomotiv</Text>
            <Text style={styles.categoryAmount}>$300.00</Text>
          </View>
          <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>Güzellik & Spa</Text>
            <Text style={styles.categoryAmount}>$250.00</Text>
          </View>
          <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>Diğer</Text>
            <Text style={styles.categoryAmount}>$200.00</Text>
          </View>
        </View>
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
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  statCard: {
    width: "48%",
    height: 150,
    marginBottom: 15,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  statCardGradient: {
    flex: 1,
    padding: 15,
    justifyContent: "space-between",
  },
  statIcon: {
    alignSelf: "flex-end",
    opacity: 0.7,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  statTitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  statusCard: {
    backgroundColor: "#212121",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  statusText: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 10,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  categorySpendingCard: {
    backgroundColor: "#212121",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  categoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  categoryName: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
})

export default AnalyticsScreen
