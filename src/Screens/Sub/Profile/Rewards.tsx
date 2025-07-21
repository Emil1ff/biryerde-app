"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Image } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import { RewardsScreenProps } from "../../../Types/navigation"

interface Reward {
  id: string
  name: string
  pointsRequired: number
  image: string
  description: string
}

const rewards: Reward[] = [
  {
    id: "r1",
    name: "50 USD İndirim Kuponu",
    pointsRequired: 500,
    image: "https://via.placeholder.com/150/FFD700/000000?text=Kupon",
    description: "Bir sonraki hizmetinizde 50 USD indirim kazanın.",
  },
  {
    id: "r2",
    name: "Ücretsiz Premium Yıkama",
    pointsRequired: 1000,
    image: "https://via.placeholder.com/150/FFC107/000000?text=Yıkama",
    description: "Aracınız için ücretsiz premium dış yıkama hizmeti.",
  },
  {
    id: "r3",
    name: "1 Saat Ücretsiz Masaj",
    pointsRequired: 1500,
    image: "https://via.placeholder.com/150/FFA500/000000?text=Masaj",
    description: "Seçili spa merkezlerinde 1 saatlik rahatlatıcı masaj.",
  },
  {
    id: "r4",
    name: "100 USD Seyahat Çeki",
    pointsRequired: 2000,
    image: "https://via.placeholder.com/150/FF8C00/000000?text=Seyahat",
    description: "Ortak seyahat acentelerinde kullanabileceğiniz 100 USD değerinde çeki.",
  },
  {
    id: "r5",
    name: "Özel Etkinlik Davetiyesi",
    pointsRequired: 2500,
    image: "https://via.placeholder.com/150/FF4500/000000?text=Etkinlik",
    description: "Yıl sonu özel müşteri etkinliğimize davetiye.",
  },
]

const RewardItem: React.FC<{ item: Reward; currentPoints: number }> = ({ item, currentPoints }) => {
  const canRedeem = currentPoints >= item.pointsRequired
  return (
    <TouchableOpacity style={styles.rewardItem} disabled={!canRedeem}>
      <Image source={{ uri: item.image }} style={styles.rewardImage} />
      <View style={styles.rewardDetails}>
        <Text style={styles.rewardName}>{item.name}</Text>
        <Text style={styles.rewardDescription}>{item.description}</Text>
        <Text style={styles.pointsRequired}>{item.pointsRequired} Puan</Text>
      </View>
      <TouchableOpacity style={[styles.redeemButton, !canRedeem && styles.redeemButtonDisabled]}>
        <Text style={styles.redeemButtonText}>{canRedeem ? "Kullan" : "Yetersiz Puan"}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const RewardsScreen: React.FC = () => {
  const navigation = useNavigation<RewardsScreenProps["navigation"]>()
  const currentPoints = 750
  const nextTierPoints = 1000
  const progress = (currentPoints / nextTierPoints) * 100

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ödüllerim</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.pointsSummaryCard}>
        <LinearGradient
          colors={["#FFD700", "#FFA500"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.pointsGradient}
        >
          <Text style={styles.currentPointsLabel}>Mevcut Puanlarınız</Text>
          <Text style={styles.currentPoints}>{currentPoints}</Text>
          <Text style={styles.nextTierText}>
            Sonraki seviyeye ulaşmak için {nextTierPoints - currentPoints} puan daha!
          </Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </LinearGradient>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Kullanılabilir Ödüller</Text>
      </View>
      <FlatList
        data={rewards}
        renderItem={({ item }) => <RewardItem item={item} currentPoints={currentPoints} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.rewardsList}
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
  pointsSummaryCard: {
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
  pointsGradient: {
    padding: 20,
    alignItems: "center",
  },
  currentPointsLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 5,
  },
  currentPoints: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  nextTierText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 15,
  },
  progressBarBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
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
  rewardsList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  rewardItem: {
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
  rewardImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
    resizeMode: "cover",
  },
  rewardDetails: {
    flex: 1,
    marginRight: 10,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 13,
    color: "#B0BEC5",
    marginBottom: 4,
  },
  pointsRequired: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFD700",
  },
  redeemButton: {
    backgroundColor: "#FFD700",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  redeemButtonDisabled: {
    backgroundColor: "rgba(255, 215, 0, 0.4)",
  },
  redeemButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
  },
})

export default RewardsScreen
