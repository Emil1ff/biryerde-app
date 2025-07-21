"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useNavigation } from "@react-navigation/native"
import { AchievementsScreenProps } from "../../../Types/navigation"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  color: string
  unlocked: boolean
  progress?: number // For achievements with progress
  target?: number // For achievements with progress
}

const achievements: Achievement[] = [
  {
    id: "a1",
    name: "İlk Rezervasyon",
    description: "İlk hizmet rezervasyonunuzu tamamlayın.",
    icon: "star-outline",
    color: "#FFC107",
    unlocked: true,
  },
  {
    id: "a2",
    name: "Sadık Müşteri",
    description: "10 hizmet rezervasyonu tamamlayın.",
    icon: "heart-outline",
    color: "#FF6347",
    unlocked: false,
    progress: 7,
    target: 10,
  },
  {
    id: "a3",
    name: "Uzman Kullanıcı",
    description: "Tüm hizmet kategorilerinden en az birer rezervasyon yapın.",
    icon: "trophy-outline",
    color: "#4CAF50",
    unlocked: false,
  },
  {
    id: "a4",
    name: "Sosyal Kelebek",
    description: "5 arkadaşınızı uygulamaya davet edin.",
    icon: "people-outline",
    color: "#00BCD4",
    unlocked: true,
  },
  {
    id: "a5",
    name: "Yorum Canavarı",
    description: "5 hizmete yorum yapın.",
    icon: "chatbubbles-outline",
    color: "#8B5CF6",
    unlocked: false,
    progress: 2,
    target: 5,
  },
  {
    id: "a6",
    name: "Gece Kuşu",
    description: "Gece 22:00'den sonra 3 rezervasyon yapın.",
    icon: "moon-outline",
    color: "#607D8B",
    unlocked: false,
  },
]

const AchievementItem: React.FC<{ item: Achievement }> = ({ item }) => {
  return (
    <View style={styles.achievementItem}>
      <LinearGradient
        colors={item.unlocked ? [item.color, "#212121"] : ["#212121", "#121212"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.achievementIconContainer}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={36}
          color={item.unlocked ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)"}
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
                { width: `${(item.progress / item.target) * 100}%`, backgroundColor: item.color },
              ]}
            />
            <Text style={styles.progressText}>
              {item.progress}/{item.target}
            </Text>
          </View>
        )}
      </View>
      {item.unlocked && (
        <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" style={styles.unlockedBadge} />
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
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Başarılarım</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={unlockedAchievements}
        renderItem={({ item }) => <AchievementItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.achievementsList}
        ListHeaderComponent={() => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kilidi Açılan Başarılar ({unlockedAchievements.length})</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="trophy-off" size={80} color="rgba(255, 255, 255, 0.2)" />
            <Text style={styles.emptyStateText}>Henüz kilidi açılan bir başarınız yok.</Text>
          </View>
        )}
      />

      <FlatList
        data={lockedAchievements}
        renderItem={({ item }) => <AchievementItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.achievementsList}
        ListHeaderComponent={() => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kilitli Başarılar ({lockedAchievements.length})</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="lock-open-outline" size={80} color="rgba(255, 255, 255, 0.2)" />
            <Text style={styles.emptyStateText}>Tüm başarıların kilidini açtınız!</Text>
          </View>
        )}
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
  achievementsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  achievementItem: {
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
  achievementIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 13,
    color: "#B0BEC5",
    marginBottom: 8,
  },
  lockedText: {
    opacity: 0.6,
  },
  progressBarBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    position: "relative",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    position: "absolute",
    right: 5,
    top: -2,
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  unlockedBadge: {
    marginLeft: 10,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#212121",
    borderRadius: 12,
    marginHorizontal: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    marginTop: 15,
  },
})

export default AchievementsScreen
