"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Image, Animated } from "react-native"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useNavigation } from "@react-navigation/native"
import { AllBookingsScreenProps } from "../../../Types/navigation"

interface ScheduledService {
  id: string
  date: string
  time: string
  serviceName: string
  providerName: string
  duration: string
  status: "confirmed" | "pending" | "completed"
  image: string
}

const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  return `${year}-${month}-${day}`
}

const getServiceStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "#4CAF50"
    case "pending":
      return "#FFC107"
    case "completed":
      return "#9E9E9E"
    default:
      return "#00BCD4"
  }
}

const ScheduledServiceCard: React.FC<{ item: ScheduledService; onPress: (item: ScheduledService) => void }> = ({
  item,
  onPress,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity style={styles.serviceItem} onPress={() => onPress(item)}>
        <Image source={{ uri: item.image }} style={styles.serviceImage} />
        <View style={styles.serviceDetails}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceName}>{item.serviceName}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getServiceStatusColor(item.status) }]}>
              <Text style={styles.statusBadgeText}>{item.status.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.providerName}>{item.providerName}</Text>
          <View style={styles.serviceTimeAndDuration}>
            <MaterialCommunityIcons name="clock-outline" size={14} color="#B0BEC5" style={styles.detailIcon} />
            <Text style={styles.timeText}>{item.time}</Text>
            <Text style={styles.durationText}> ({item.duration})</Text>
          </View>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#B0BEC5" />
      </TouchableOpacity>
    </Animated.View>
  )
}

const AllBookingsScreen: React.FC = () => {
  const navigation = useNavigation<AllBookingsScreenProps["navigation"]>()

  const [allBookings, setAllBookings] = useState<ScheduledService[]>(() => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const dayAfterTomorrow = new Date(today)
    dayAfterTomorrow.setDate(today.getDate() + 2)
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    const lastMonth = new Date(today)
    lastMonth.setMonth(today.getMonth() - 1)

    return [
      {
        id: "1",
        date: formatDateToYYYYMMDD(today),
        time: "09:00 AM",
        serviceName: "House Cleaning",
        providerName: "Jenny Wilson",
        duration: "2 hours",
        status: "confirmed",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      },
      {
        id: "2",
        date: formatDateToYYYYMMDD(today),
        time: "02:00 PM",
        serviceName: "AC Repairing",
        providerName: "Mike Davis",
        duration: "1.5 hours",
        status: "pending",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      },
      {
        id: "3",
        date: formatDateToYYYYMMDD(tomorrow),
        time: "04:30 PM",
        serviceName: "Plumbing Service",
        providerName: "Sarah Johnson",
        duration: "1 hour",
        status: "confirmed",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      },
      {
        id: "4",
        date: formatDateToYYYYMMDD(dayAfterTomorrow),
        time: "10:00 AM",
        serviceName: "Car Wash",
        providerName: "Auto Spa",
        duration: "1 hour",
        status: "completed",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      },
      {
        id: "5",
        date: formatDateToYYYYMMDD(nextWeek),
        time: "11:00 AM",
        serviceName: "Gardening",
        providerName: "Green Thumb",
        duration: "3 hours",
        status: "confirmed",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      },
      {
        id: "6",
        date: formatDateToYYYYMMDD(lastMonth),
        time: "01:00 PM",
        serviceName: "Dog Walking",
        providerName: "Pet Pals",
        duration: "1 hour",
        status: "completed",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      },
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date descending
  })

  const handleServicePress = (service: ScheduledService) => {
    navigation.navigate("BookingDetails", { bookingId: service.id })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Bookings</Text>
        <View style={styles.placeholder} />
      </View>
      <FlatList
        data={allBookings}
        renderItem={({ item }) => <ScheduledServiceCard item={item} onPress={handleServicePress} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.bookingsList}
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
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 24, // To balance the back button
  },
  bookingsList: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 12,
  },
  serviceItem: {
    flexDirection: "row",
    backgroundColor: "#212121",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: "cover",
  },
  serviceDetails: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "700",
  },
  providerName: {
    fontSize: 13,
    color: "#B0BEC5",
    marginBottom: 6,
  },
  serviceTimeAndDuration: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#CFD8DC",
  },
  durationText: {
    fontSize: 12,
    color: "#B0BEC5",
  },
  detailIcon: {
    marginRight: 4,
  },
})

export default AllBookingsScreen
