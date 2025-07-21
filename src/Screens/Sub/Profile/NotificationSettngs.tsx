"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

interface NotificationSetting {
  id: string
  title: string
  description?: string
  enabled: boolean
  onToggle: (value: boolean) => void
}

const NotificationSettings: React.FC<any> = ({ navigation }) => {
  const [generalNotifications, setGeneralNotifications] = useState(true)
  const [vibrate, setVibrate] = useState(true)
  const [specialOffers, setSpecialOffers] = useState(true)
  const [promoDiscount, setPromoDiscount] = useState(true)
  const [payments, setPayments] = useState(true)
  const [cashback, setCashback] = useState(true)
  const [appUpdates, setAppUpdates] = useState(true)
  const [newServiceAvailable, setNewServiceAvailable] = useState(true)
  const [newTipsAvailable, setNewTipsAvailable] = useState(true)

  const notificationSettings: NotificationSetting[] = [
    {
      id: "1",
      title: "General Notification",
      enabled: generalNotifications,
      onToggle: setGeneralNotifications,
    },
    {
      id: "2",
      title: "Vibrate",
      enabled: vibrate,
      onToggle: setVibrate,
    },
    {
      id: "3",
      title: "Special Offers",
      enabled: specialOffers,
      onToggle: setSpecialOffers,
    },
    {
      id: "4",
      title: "Promo & Discount",
      enabled: promoDiscount,
      onToggle: setPromoDiscount,
    },
    {
      id: "5",
      title: "Payments",
      enabled: payments,
      onToggle: setPayments,
    },
    {
      id: "6",
      title: "Cashback",
      enabled: cashback,
      onToggle: setCashback,
    },
    {
      id: "7",
      title: "App Updates",
      enabled: appUpdates,
      onToggle: setAppUpdates,
    },
    {
      id: "8",
      title: "New Service Available",
      enabled: newServiceAvailable,
      onToggle: setNewServiceAvailable,
    },
    {
      id: "9",
      title: "New Tips Available",
      enabled: newTipsAvailable,
      onToggle: setNewTipsAvailable,
    },
  ]

  const renderSettingItem = (setting: NotificationSetting) => (
    <View key={setting.id} style={styles.settingItem}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{setting.title}</Text>
        {setting.description && <Text style={styles.settingDescription}>{setting.description}</Text>}
      </View>
      <Switch
        value={setting.enabled}
        onValueChange={setting.onToggle}
        trackColor={{ false: "#424242", true: "#8B5CF6" }}
        thumbColor={setting.enabled ? "#FFFFFF" : "#E0E0E0"}
        ios_backgroundColor="#424242"
      />
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsList}>{notificationSettings.map(renderSettingItem)}</View>
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  settingsList: {
    marginTop: 10,
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E0E0E0",
  },
  settingDescription: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 2,
  },
})

export default NotificationSettings
