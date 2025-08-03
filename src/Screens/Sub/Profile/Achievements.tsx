"use client"
import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Dimensions, ScrollView } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useNavigation } from "@react-navigation/native"
import type { AchievementsScreenProps } from "../../../Types/navigation"

const { width, height } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (width * percentage) / 100
const responsiveHeight = (percentage: number) => (height * percentage) / 100
const responsiveFontSize = (size: number) => size * (width / 375)

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  color: string
  unlocked: boolean
  progress?: number
  target?: number
}

const achievements: Achievement[] = [
  {
    id: "a1",
    name: "First Booking",
    description: "Complete your first service booking.",
    icon: "star-outline",
    color: "#FFC107",
    unlocked: true,
  },
  {
    id: "a2",
    name: "Loyal Customer",
    description: "Complete 10 service bookings.",
    icon: "heart-outline",
    color: "#FF6347",
    unlocked: false,
    progress: 7,
    target: 10,
  },
  {
    id: "a3",
    name: "Expert User",
    description: "Make at least one booking from all service categories.",
    icon: "trophy-outline",
    color: "#4CAF50",
    unlocked: false,
  },
  {
    id: "a4",
    name: "Social Butterfly",
    description: "Invite 5 friends to the app.",
    icon: "people-outline",
    color: "#00BCD4",
    unlocked: true,
  },
  {
    id: "a5",
    name: "Review Master",
    description: "Leave reviews for 5 services.",
    icon: "chatbubbles-outline",
    color: "#8B5CF6",
    unlocked: false,
    progress: 2,
    target: 5,
  },
  {
    id: "a6",
    name: "Night Owl",
    description: "Make 3 bookings after 10:00 PM.",
    icon: "moon-outline",
    color: "#607D8B",
    unlocked: false,
  },
]

const AchievementItem: React.FC<{ item: Achievement }> = ({ item }) => {
  return (
    <View style={styles.achievementItem}>
      <LinearGradient
        colors={["#2A2A2A", "#1A1A1A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.achievementIconContainer}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={responsiveFontSize(36)}
          color={item.unlocked ? item.color : "rgba(255, 255, 255, 0.4)"}
        />
      </LinearGradient>
      <View style={styles.achievementDetails}>
        <Text style={[styles.achievementName, !item.unlocked && styles.lockedText]}>{item.name}</Text>
        <Text style={[styles.achievementDescription, !item.unlocked && styles.lockedText]}>{item.description}</Text>
        {item.progress !== undefined && item.target !== undefined && (
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(item.progress / item.target) * 100}%`, backgroundColor: "#8B5CF6" },
              ]}
            />
            <Text style={styles.progressText}>
              {item.progress}/{item.target}
            </Text>
          </View>
        )}
      </View>
      {item.unlocked && (
        <MaterialCommunityIcons
          name="check-circle"
          size={responsiveFontSize(24)}
          color="#6BFF6B"
          style={styles.unlockedBadge}
        />
      )}
    </View>
  )
}

const AchievementsScreen: React.FC = () => {
  const navigation = useNavigation<AchievementsScreenProps["navigation"]>()
  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const lockedAchievements = achievements.filter((a) => !a.unlocked)
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={responsiveFontSize(24)} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Achievements</Text>
          <View style={styles.placeholder} />
        </View>
      <ScrollView style={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <FlatList
          data={unlockedAchievements}
          renderItem={({ item }) => <AchievementItem item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.achievementsList}
          scrollEnabled={false}
          ListHeaderComponent={() => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Unlocked Achievements ({unlockedAchievements.length})</Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="trophy-off"
                size={responsiveFontSize(80)}
                color="rgba(255, 255, 255, 0.2)"
              />
              <Text style={styles.emptyStateText}>You haven't unlocked any achievements yet.</Text>
            </View>
          )}
        />
        <FlatList
          data={lockedAchievements}
          renderItem={({ item }) => <AchievementItem item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.achievementsList}
          scrollEnabled={false}
          ListHeaderComponent={() => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Locked Achievements ({lockedAchievements.length})</Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="lock-open-outline"
                size={responsiveFontSize(80)}
                color="rgba(255, 255, 255, 0.2)"
              />
              <Text style={styles.emptyStateText}>You have unlocked all achievements!</Text>
            </View>
          )}
        />
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(7),
    paddingBottom: responsiveHeight(2.5),
    // Removed borderBottomWidth and borderBottomColor to allow full scroll
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
  achievementsList: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(2.5),
  },
  achievementItem: {
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
  achievementIconContainer: {
    width: responsiveFontSize(60),
    height: responsiveFontSize(60),
    borderRadius: responsiveFontSize(30),
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsiveWidth(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  achievementDetails: {
    flex: 1,
  },
  achievementName: {
    fontSize: responsiveFontSize(17),
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: responsiveHeight(0.5),
  },
  achievementDescription: {
    fontSize: responsiveFontSize(13),
    color: "#9CA3AF",
    marginBottom: responsiveHeight(1),
  },
  lockedText: {
    opacity: 0.6,
  },
  progressBarBackground: {
    width: "100%",
    height: responsiveHeight(1),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: responsiveHeight(0.5),
    position: "relative",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: responsiveHeight(0.5),
  },
  progressText: {
    position: "absolute",
    right: responsiveWidth(1.5),
    top: -responsiveHeight(0.5),
    fontSize: responsiveFontSize(10),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  unlockedBadge: {
    marginLeft: responsiveWidth(2.5),
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: responsiveHeight(5),
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: responsiveHeight(2.5),
  },
  emptyStateText: {
    fontSize: responsiveFontSize(16),
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    marginTop: responsiveHeight(2),
  },
})

export default AchievementsScreen
