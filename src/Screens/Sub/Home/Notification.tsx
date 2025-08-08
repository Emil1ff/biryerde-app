import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { useTranslation } from "react-i18next"

interface Notification {
  id: string
  type: "payment" | "service" | "offer" | "account"
  title: string
  description: string
  time: string
  date: string
  icon: string
  iconColor: string
  isRead: boolean
}

const Notification = ({ navigation }: any) => {
  const { t } = useTranslation()
  const notifications: Notification[] = [
    {
      id: "1",
      type: "payment",
      title: t("paymentSuccessfulTitle"),
      description: t("paymentSuccessfulDescription"),
      time: "10:00 AM",
      date: t("today"),
      icon: "card-outline",
      iconColor: "#8B5CF6",
      isRead: false,
    },
    {
      id: "2",
      type: "service",
      title: t("newCategoryServicesTitle"),
      description: t("newCategoryServicesDescription"),
      time: "09:30 AM",
      date: t("today"),
      icon: "briefcase-outline",
      iconColor: "#EF4444",
      isRead: false,
    },
    {
      id: "3",
      type: "offer",
      title: t("todaysSpecialOffersTitle"),
      description: t("todaysSpecialOffersDescription"),
      time: "08:15 AM",
      date: t("yesterday"),
      icon: "gift-outline",
      iconColor: "#F59E0B",
      isRead: true,
    },
    {
      id: "4",
      type: "account",
      title: t("creditCardConnectedTitle"),
      description: t("creditCardConnectedDescription"),
      time: "07:45 PM",
      date: "December 22, 2024", // This date is dynamic, not translated
      icon: "checkmark-circle-outline",
      iconColor: "#10B981",
      isRead: true,
    },
    {
      id: "5",
      type: "account",
      title: t("accountSetupSuccessfulTitle"),
      description: t("accountSetupSuccessfulDescription"),
      time: "06:20 PM",
      date: "December 22, 2024", // This date is dynamic, not translated
      icon: "person-circle-outline",
      iconColor: "#10B981",
      isRead: true,
    },
  ]

  const groupedNotifications = notifications.reduce((groups: any, notification) => {
    const date = notification.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(notification)
    return groups
  }, {})

  const renderNotificationItem = (item: Notification) => (
    <TouchableOpacity key={item.id} style={styles.notificationItem}>
      <View style={[styles.notificationIcon, { backgroundColor: item.iconColor + "20" }]}>
        <Icon name={item.icon} size={24} color={item.iconColor} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationDescription}>{item.description}</Text>
      </View>
      <View style={styles.notificationTime}>
        <Text style={styles.timeText}>{item.time}</Text>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("notificationTitle")}</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Icon name="ellipsis-horizontal" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {Object.entries(groupedNotifications).map(([date, notifications]: [string, any]) => (
          <View key={date} style={styles.dateGroup}>
            <View style={styles.dateHeader}>
              <Text style={styles.dateText}>{date}</Text>
              {date === t("today") && (
                <TouchableOpacity>
                  <Text style={styles.clearAllText}>{t("clearAll")}</Text>
                </TouchableOpacity>
              )}
            </View>
            {notifications.map(renderNotificationItem)}
          </View>
        ))}
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
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dateGroup: {
    marginBottom: 30,
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  clearAllText: {
    fontSize: 16,
    color: "#8B5CF6",
    fontWeight: "600",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  notificationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: 20,
  },
  notificationTime: {
    alignItems: "flex-end",
  },
  timeText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8B5CF6",
  },
})

export default Notification
