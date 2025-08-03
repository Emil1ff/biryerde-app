"use client"
import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Image, Dimensions } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import type { RewardsScreenProps } from "../../../Types/navigation"

const { width, height } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (width * percentage) / 100
const responsiveHeight = (percentage: number) => (height * percentage) / 100
const responsiveFontSize = (size: number) => size * (width / 375)

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
    name: "50 USD Discount Coupon",
    pointsRequired: 500,
    image: "https://via.placeholder.com/150/FFD700/000000?text=Coupon",
    description: "Get a 50 USD discount on your next service.",
  },
  {
    id: "r2",
    name: "Free Premium Car Wash",
    pointsRequired: 1000,
    image: "https://via.placeholder.com/150/FFC107/000000?text=Wash",
    description: "Enjoy a free premium exterior car wash service.",
  },
  {
    id: "r3",
    name: "1 Hour Free Massage",
    pointsRequired: 1500,
    image: "https://via.placeholder.com/150/FFA500/000000?text=Massage",
    description: "A relaxing 1-hour massage at selected spa centers.",
  },
  {
    id: "r4",
    name: "100 USD Travel Voucher",
    pointsRequired: 2000,
    image: "https://via.placeholder.com/150/FF8C00/000000?text=Travel",
    description: "A 100 USD voucher redeemable at partner travel agencies.",
  },
  {
    id: "r5",
    name: "Exclusive Event Invitation",
    pointsRequired: 2500,
    image: "https://via.placeholder.com/150/FF4500/000000?text=Event",
    description: "An invitation to our exclusive year-end customer event.",
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
        <Text style={styles.pointsRequired}>{item.pointsRequired} Points</Text>
      </View>
      <TouchableOpacity style={[styles.redeemButton, !canRedeem && styles.redeemButtonDisabled]}>
        <Text style={styles.redeemButtonText}>{canRedeem ? "Redeem" : "Insufficient Points"}</Text>
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
          <Icon name="arrow-back" size={responsiveFontSize(24)} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Rewards</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.pointsSummaryCard}>
        <LinearGradient
          colors={["#8B5CF6", "#A855F7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.pointsGradient}
        >
          <Text style={styles.currentPointsLabel}>Your Current Points</Text>
          <Text style={styles.currentPoints}>{currentPoints}</Text>
          <Text style={styles.nextTierText}>
            {`Earn ${nextTierPoints - currentPoints} more points for the next tier!`}
          </Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
        </LinearGradient>
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Available Rewards</Text>
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
  pointsSummaryCard: {
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
  pointsGradient: {
    paddingVertical: responsiveHeight(4),
    paddingHorizontal: responsiveWidth(6),
    alignItems: "center",
  },
  currentPointsLabel: {
    fontSize: responsiveFontSize(15),
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: responsiveHeight(0.5),
  },
  currentPoints: {
    fontSize: responsiveFontSize(42),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: responsiveHeight(1.5),
  },
  nextTierText: {
    fontSize: responsiveFontSize(14),
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: responsiveHeight(2),
    textAlign: "center",
  },
  progressBarBackground: {
    width: "100%",
    height: responsiveHeight(1),
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: responsiveHeight(0.5),
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: responsiveHeight(0.5),
  },
  sectionHeader: {
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(4),
    marginBottom: responsiveHeight(2),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(22),
    fontWeight: "700",
    color: "#FFFFFF",
  },
  rewardsList: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(5),
  },
  rewardItem: {
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
  rewardImage: {
    width: responsiveFontSize(60),
    height: responsiveFontSize(60),
    borderRadius: 8,
    marginRight: responsiveWidth(4),
    resizeMode: "cover",
  },
  rewardDetails: {
    flex: 1,
    marginRight: responsiveWidth(2.5),
  },
  rewardName: {
    fontSize: responsiveFontSize(17),
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: responsiveHeight(0.5),
  },
  rewardDescription: {
    fontSize: responsiveFontSize(13),
    color: "#9CA3AF",
    marginBottom: responsiveHeight(0.5),
  },
  pointsRequired: {
    fontSize: responsiveFontSize(14),
    fontWeight: "600",
    color: "#FFD700",
  },
  redeemButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 10,
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(3),
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  redeemButtonDisabled: {
    backgroundColor: "rgba(139, 92, 246, 0.4)",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  redeemButtonText: {
    fontSize: responsiveFontSize(14),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
})

export default RewardsScreen
