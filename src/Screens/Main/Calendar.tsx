"use client"
import type React from "react"
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  type ScrollView,
  Platform,
  UIManager,
  Animated,
  Modal,
  Alert,
  Dimensions, // Import Dimensions for responsive sizing
  FlatList, // Import FlatList for rendering lists
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { useNavigation } from "@react-navigation/native"
import type { BookingDetailsScreenProps, AddBookingScreenProps, AllBookingsScreenProps } from "../../Types/navigation"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (screenWidth * percentage) / 100
const responsiveHeight = (percentage: number) => (screenHeight * percentage) / 100
const responsiveFontSize = (size: number) => size * (screenWidth / 375)

// if (Platform.OS === "android") {
//   if (UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true)
//   }
// }

interface CalendarDay {
  date: number
  fullDate: Date
  isToday: boolean
  isSelected: boolean
  isCurrentMonth: boolean
  hasBooking: boolean
  dayName: string
}

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

const CalendarDayItem: React.FC<{
  item: CalendarDay
  onPress: (day: CalendarDay) => void
}> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.calendarDay, !item.isCurrentMonth && styles.outOfMonthDay]}
      onPress={() => onPress(item)}
      disabled={!item.isCurrentMonth}
    >
      {item.isSelected ? (
        <LinearGradient
          colors={["#8B5CF6", "#A855F7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.selectedDayGradient}
        >
          <Text style={styles.selectedDayText}>{item.date}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.dayCircle, item.isToday && styles.todayDay]}>
          <Text
            style={[
              styles.calendarDayText,
              item.isToday && styles.todayDayText,
              !item.isCurrentMonth && styles.outOfMonthDayText,
            ]}
          >
            {item.date}
          </Text>
        </View>
      )}
      {item.hasBooking && <View style={[styles.bookingDot, item.isSelected && styles.bookingDotSelected]} />}
    </TouchableOpacity>
  )
}

const ScheduledServiceCard: React.FC<{
  item: ScheduledService
  onMorePress: (item: ScheduledService) => void
}> = ({ item, onMorePress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const { t } = useTranslation()

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity style={styles.serviceItem}>
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
            <MaterialCommunityIcons
              name="clock-outline"
              size={responsiveFontSize(14)}
              color="#B0BEC5"
              style={styles.detailIcon}
            />
            <Text style={styles.timeText}>{item.time}</Text>
            <Text style={styles.durationText}> ({item.duration})</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton} onPress={() => onMorePress(item)}>
          <MaterialCommunityIcons name="dots-horizontal" size={responsiveFontSize(20)} color="#B0BEC5" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  )
}

interface CalendarScreenProps {
  onScroll: (event: any) => void
}

export interface CalendarRef {
  scrollToTop: () => void
}

const Calendar = forwardRef<CalendarRef, CalendarScreenProps>(({ onScroll }, ref) => {
  const { t } = useTranslation()
  const navigation = useNavigation<
    BookingDetailsScreenProps["navigation"] & AddBookingScreenProps["navigation"] & AllBookingsScreenProps["navigation"]
  >()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isModalVisible, setModalVisible] = useState(false)
  const [selectedServiceForOptions, setSelectedServiceForOptions] = useState<ScheduledService | null>(null)

  const scrollViewRef = useRef<ScrollView>(null) // Internal ref for ScrollView

  // Expose scrollToTop method via useImperativeHandle
  useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true })
    },
  }))

  const monthNames = [
    t("monthJanuary"),
    t("monthFebruary"),
    t("monthMarch"),
    t("monthApril"),
    t("monthMay"),
    t("monthJune"),
    t("monthJuly"),
    t("monthAugust"),
    t("monthSeptember"),
    t("monthOctober"),
    t("monthNovember"),
    t("monthDecember"),
  ]
  const dayNames = [t("daySun"), t("dayMon"), t("dayTue"), t("dayWed"), t("dayThu"), t("dayFri"), t("daySat")]

  const [allBookings, setAllBookings] = useState<Record<string, ScheduledService[]>>(() => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const dayAfterTomorrow = new Date(today)
    dayAfterTomorrow.setDate(today.getDate() + 2)

    const bookings: ScheduledService[] = [
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
        date: formatDateToYYYYMMDD(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)),
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
        date: formatDateToYYYYMMDD(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)),
        time: "10:00 AM",
        serviceName: "Car Wash",
        providerName: "Auto Spa",
        duration: "1 hour",
        status: "completed",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      },
    ]

    const bookingsMap: Record<string, ScheduledService[]> = {}
    bookings.forEach((service) => {
      if (!bookingsMap[service.date]) {
        bookingsMap[service.date] = []
      }
      bookingsMap[service.date].push(service)
    })
    return bookingsMap
  })

  const displayedServices = allBookings[formatDateToYYYYMMDD(selectedDate)] || []

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    const startDate = new Date(firstDayOfMonth)
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay()) // Adjust to start from Sunday

    const days: CalendarDay[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Normalize today's date

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      currentDate.setHours(0, 0, 0, 0) // Normalize current date

      const isCurrentMonth = currentDate.getMonth() === month
      const isToday = currentDate.getTime() === today.getTime()
      const isSelected = currentDate.getTime() === selectedDate.getTime()
      const hasBooking = !!allBookings[formatDateToYYYYMMDD(currentDate)]

      days.push({
        date: currentDate.getDate(),
        fullDate: currentDate,
        isToday,
        isSelected,
        isCurrentMonth,
        hasBooking,
        dayName: dayNames[currentDate.getDay()],
      })
    }
    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth)
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)

    // Adjust selectedDate if it falls out of the new month
    const newSelectedDate = new Date(newMonth.getFullYear(), newMonth.getMonth(), selectedDate.getDate())
    if (newSelectedDate.getMonth() !== newMonth.getMonth()) {
      newSelectedDate.setDate(0) // Set to last day of previous month if original day doesn't exist
    }
    setSelectedDate(newSelectedDate)
  }

  const selectDate = (day: CalendarDay) => {
    setSelectedDate(day.fullDate)
  }

  const handleMoreOptionsPress = (service: ScheduledService) => {
    setSelectedServiceForOptions(service)
    setModalVisible(true)
  }

  const handleModalOptionPress = (option: string) => {
    if (selectedServiceForOptions) {
      switch (option) {
        case "viewDetails":
          navigation.navigate("BookingDetails", {
            bookingId: selectedServiceForOptions.id,
          })
          break
        case "editBooking":
          Alert.alert(
            t("editBookingAlertTitle"),
            t("editBookingAlertMessage", {
              serviceName: selectedServiceForOptions.serviceName,
            }),
          )
          break
        case "cancelBooking":
          Alert.alert(
            t("cancelBookingAlertTitle"),
            t("cancelBookingAlertMessage", {
              serviceName: selectedServiceForOptions.serviceName,
            }),
          )
          break
        case "rescheduleBooking":
          Alert.alert(
            t("rescheduleBookingAlertTitle"),
            t("rescheduleBookingAlertMessage", {
              serviceName: selectedServiceForOptions.serviceName,
            }),
          )
          break
      }
    }
    setModalVisible(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("myCalendarTitle")}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddBooking")}>
          <LinearGradient
            colors={["#8B5CF6", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addButtonGradient}
          >
            <MaterialCommunityIcons name="plus" size={responsiveFontSize(24)} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <Animated.ScrollView
        ref={scrollViewRef} // Assign internal ref
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: responsiveHeight(12) }} // Adjusted for tab bar height
      >
        <View style={styles.calendarCard}>
          <View style={styles.monthNavigation}>
            <TouchableOpacity style={styles.navButton} onPress={() => navigateMonth("prev")}>
              <MaterialCommunityIcons name="chevron-left" size={responsiveFontSize(24)} color="#E0E0E0" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity style={styles.navButton} onPress={() => navigateMonth("next")}>
              <MaterialCommunityIcons name="chevron-right" size={responsiveFontSize(24)} color="#E0E0E0" />
            </TouchableOpacity>
          </View>
          <View style={styles.dayNamesContainer}>
            {dayNames.map((dayName) => (
              <Text key={dayName} style={styles.dayName}>
                {dayName}
              </Text>
            ))}
          </View>
          <FlatList
            data={generateCalendarDays()}
            renderItem={({ item }) => <CalendarDayItem item={item} onPress={selectDate} />}
            keyExtractor={(item, index) => `${item.fullDate.toISOString()}-${index}`}
            numColumns={7}
            scrollEnabled={false}
            contentContainerStyle={styles.calendarGrid}
          />
        </View>
        <View style={styles.scheduledServicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t("serviceBookingSectionTitle")} ({displayedServices.length})
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("AllBookings")}>
              <Text style={styles.seeAllText}>{t("seeAll")}</Text>
            </TouchableOpacity>
          </View>
          {displayedServices.length > 0 ? (
            <FlatList
              data={displayedServices}
              renderItem={({ item }) => <ScheduledServiceCard item={item} onMorePress={handleMoreOptionsPress} />}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.servicesList}
            />
          ) : (
            <View style={styles.emptySchedule}>
              <MaterialCommunityIcons
                name="clipboard-text-off"
                size={responsiveFontSize(80)}
                color="rgba(255, 255, 255, 0.2)"
                style={styles.emptyScheduleIcon}
              />
              <Text style={styles.emptyScheduleTitle}>{t("noServiceBookingTitle")}</Text>
              <Text style={styles.emptyScheduleText}>{t("noServiceBookingDescription")}</Text>
            </View>
          )}
        </View>
      </Animated.ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleModalOptionPress("viewDetails")}>
              <Text style={styles.modalOptionText}>{t("viewDetails")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleModalOptionPress("editBooking")}>
              <Text style={styles.modalOptionText}>{t("editBooking")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleModalOptionPress("rescheduleBooking")}>
              <Text style={styles.modalOptionText}>{t("rescheduleModal")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={() => handleModalOptionPress("cancelBooking")}>
              <Text style={[styles.modalOptionText, styles.modalOptionTextDanger]}>{t("cancelBookingModal")}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(1.5),
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    marginTop: responsiveHeight(5),
  },
  title: {
    fontSize: responsiveFontSize(26),
    fontWeight: "700",
    color: "#FFFFFF",
  },
  addButton: {
    borderRadius: responsiveFontSize(24),
    overflow: "hidden",
  },
  addButtonGradient: {
    width: responsiveFontSize(48),
    height: responsiveFontSize(48),
    borderRadius: responsiveFontSize(24),
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  calendarCard: {
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(2.5),
    backgroundColor: "#212121",
    borderRadius: responsiveFontSize(16),
    padding: responsiveWidth(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: responsiveHeight(0.4) },
    shadowOpacity: 0.3,
    shadowRadius: responsiveFontSize(5),
    elevation: 8,
  },
  monthNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(1.2),
  },
  monthTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  navButton: {
    padding: responsiveFontSize(8),
    borderRadius: responsiveFontSize(20),
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  dayNamesContainer: {
    flexDirection: "row",
    marginBottom: responsiveHeight(1.2),
  },
  dayName: {
    flex: 1,
    textAlign: "center",
    fontSize: responsiveFontSize(13),
    color: "#B0BEC5",
    fontWeight: "600",
  },
  calendarGrid: {
    marginBottom: responsiveHeight(1.2),
  },
  calendarDay: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: responsiveWidth(0.5),
    position: "relative",
  },
  dayCircle: {
    width: responsiveFontSize(38),
    height: responsiveFontSize(38),
    borderRadius: responsiveFontSize(19),
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDayGradient: {
    width: responsiveFontSize(38),
    height: responsiveFontSize(38),
    borderRadius: responsiveFontSize(19),
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDayText: {
    fontSize: responsiveFontSize(16),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  todayDay: {
    borderWidth: 1.5,
    borderColor: "#8B5CF6",
  },
  calendarDayText: {
    fontSize: responsiveFontSize(16),
    color: "#FFFFFF",
    fontWeight: "500",
  },
  todayDayText: {
    color: "#8B5CF6",
    fontWeight: "bold",
  },
  outOfMonthDay: {
    opacity: 0.4,
  },
  outOfMonthDayText: {
    color: "rgba(255, 255, 255, 0.4)",
  },
  bookingDot: {
    position: "absolute",
    bottom: responsiveHeight(0.6),
    width: responsiveFontSize(6),
    height: responsiveFontSize(6),
    borderRadius: responsiveFontSize(3),
    backgroundColor: "#4CAF50",
  },
  bookingDotSelected: {
    backgroundColor: "#FFFFFF",
  },
  scheduledServicesSection: {
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(2.5),
    paddingBottom: responsiveHeight(12), // Adjusted for tab bar height
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsiveHeight(1.8),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  seeAllText: {
    fontSize: responsiveFontSize(14),
    color: "#8B5CF6",
    fontWeight: "600",
  },
  servicesList: {
    gap: responsiveHeight(1.5),
  },
  serviceItem: {
    flexDirection: "row",
    backgroundColor: "#212121",
    borderRadius: responsiveFontSize(12),
    padding: responsiveWidth(3),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: responsiveHeight(0.2) },
    shadowOpacity: 0.2,
    shadowRadius: responsiveFontSize(3),
    elevation: 5,
  },
  serviceImage: {
    width: responsiveFontSize(60),
    height: responsiveFontSize(60),
    borderRadius: responsiveFontSize(8),
    marginRight: responsiveWidth(3),
    resizeMode: "cover",
  },
  serviceDetails: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsiveHeight(0.5),
  },
  serviceName: {
    fontSize: responsiveFontSize(16),
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    marginRight: responsiveWidth(2),
  },
  statusBadge: {
    paddingHorizontal: responsiveWidth(2),
    paddingVertical: responsiveHeight(0.4),
    borderRadius: responsiveFontSize(10),
  },
  statusBadgeText: {
    fontSize: responsiveFontSize(10),
    color: "#FFFFFF",
    fontWeight: "700",
  },
  providerName: {
    fontSize: responsiveFontSize(13),
    color: "#B0BEC5",
    marginBottom: responsiveHeight(0.8),
  },
  serviceTimeAndDuration: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: responsiveFontSize(13),
    fontWeight: "600",
    color: "#CFD8DC",
  },
  durationText: {
    fontSize: responsiveFontSize(12),
    color: "#B0BEC5",
  },
  detailIcon: {
    marginRight: responsiveWidth(1),
  },
  moreButton: {
    padding: responsiveFontSize(8),
  },
  emptySchedule: {
    alignItems: "center",
    paddingVertical: responsiveHeight(5),
    backgroundColor: "#212121",
    borderRadius: responsiveFontSize(12),
    marginHorizontal: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: responsiveHeight(0.2) },
    shadowOpacity: 0.2,
    shadowRadius: responsiveFontSize(3),
    elevation: 5,
  },
  emptyScheduleIcon: {
    marginBottom: responsiveHeight(2),
  },
  emptyScheduleTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: "bold",
    color: "#E0E0E0",
    marginBottom: responsiveHeight(1),
    textAlign: "center",
  },
  emptyScheduleText: {
    fontSize: responsiveFontSize(14),
    color: "#B0BEC5",
    textAlign: "center",
    paddingHorizontal: responsiveWidth(5),
    lineHeight: responsiveFontSize(20),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#212121",
    borderTopLeftRadius: responsiveFontSize(20),
    borderTopRightRadius: responsiveFontSize(20),
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1.2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: responsiveHeight(-0.5) },
    shadowOpacity: 0.3,
    shadowRadius: responsiveFontSize(10),
    elevation: 15,
  },
  modalOption: {
    paddingVertical: responsiveHeight(1.8),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalOptionText: {
    fontSize: responsiveFontSize(18),
    color: "#FFFFFF",
    fontWeight: "500",
    textAlign: "center",
  },
  modalOptionTextDanger: {
    color: "#EF4444",
  },
})

export default Calendar
