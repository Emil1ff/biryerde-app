"use client"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Dimensions } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import {
  format,
  addMonths,
  subMonths,
  isSameDay,
  isBefore,
  startOfDay,
  endOfMonth,
  startOfMonth,
  getDay,
  setHours,
  setMinutes,
  isPast,
} from "date-fns"
import { enUS } from "date-fns/locale" 

const { width } = Dimensions.get("window")

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
]

const BookingDetailsScreen = ({ route, navigation }: any) => {
  const { serviceId, categoryId, selectedItems, totalPrice } = route.params
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date()) 
  const [workingHours, setWorkingHours] = useState(1)
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<any>(null)

  const today = startOfDay(new Date())
  const startOfCurrentMonth = startOfMonth(currentMonth)
  const endOfCurrentMonth = endOfMonth(currentMonth)
  const numDaysInMonth = Number.parseInt(format(endOfCurrentMonth, "dd"))
  const firstDayOfWeek = getDay(startOfCurrentMonth) 

  const days = Array.from({ length: numDaysInMonth }, (_, i) => i + 1)
  const emptyDaysBefore = Array.from({ length: firstDayOfWeek }, (_, i) => null)

  useEffect(() => {
    setSelectedTime(null)
  }, [selectedDate])

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (!isBefore(newDate, today)) {
      setSelectedDate(newDate)
    }
  }

  const handleMonthChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      const prevMonth = subMonths(currentMonth, 1)
      if (!isBefore(endOfMonth(prevMonth), today)) {
        setCurrentMonth(prevMonth)
        setSelectedDate(null) 
      }
    } else {
      setCurrentMonth(addMonths(currentMonth, 1))
      setSelectedDate(null) 
    }
  }

  const handleWorkingHoursChange = (change: number) => {
    setWorkingHours(Math.max(1, workingHours + change))
  }

  const navigateToAddPromo = () => {
    navigation.navigate("AddPromo", {
      onSelectPromo: (promo: any) => {
        setAppliedPromo(promo)
        setPromoCode(promo.name) 
      },
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Select Date Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                onPress={() => handleMonthChange("prev")}
                disabled={isSameDay(startOfCurrentMonth, startOfMonth(today))}
              >
                <Icon
                  name="chevron-back-outline"
                  size={20}
                  color={isSameDay(startOfCurrentMonth, startOfMonth(today)) ? "rgba(255, 255, 255, 0.3)" : "#FFFFFF"}
                />
              </TouchableOpacity>
              <Text style={styles.calendarMonth}>{format(currentMonth, "MMMM yyyy", { locale: enUS })}</Text>
              <TouchableOpacity onPress={() => handleMonthChange("next")}>
                <Icon name="chevron-forward-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.weekDaysContainer}>
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <Text key={index} style={styles.weekDayText}>
                  {day}
                </Text>
              ))}
            </View>
            <View style={styles.daysContainer}>
              {emptyDaysBefore.map((_, index) => (
                <View key={`empty-${index}`} style={styles.dayCell} />
              ))}
              {days.map((day) => {
                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
                const isPastDay = isBefore(date, today) && !isSameDay(date, today)
                const isSelected = selectedDate && isSameDay(date, selectedDate)
                const isToday = isSameDay(date, today)

                return (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayCell,
                      isSelected && styles.selectedDayCell,
                      isToday && styles.highlightedDayCell,
                      isPastDay && styles.disabledDayCell,
                    ]}
                    onPress={() => handleDateSelect(day)}
                    disabled={isPastDay}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isSelected && styles.selectedDayText,
                        isPastDay && styles.disabledDayText,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Working Hours</Text>
          <View style={styles.workingHoursCard}>
            <Text style={styles.workingHoursLabel}>How many hours do you want to work?</Text>
            <View style={styles.quantityControl}>
              <TouchableOpacity style={styles.quantityButton} onPress={() => handleWorkingHoursChange(-1)}>
                <Icon name="remove-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{workingHours}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={() => handleWorkingHoursChange(1)}>
                <Icon name="add-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Start Time</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timeSlotsContainer}
          >
            {timeSlots.map((time) => {
              const [hourStr, minuteStr] = time.split(" ")[0].split(":")
              const hour = Number.parseInt(hourStr) + (time.includes("PM") && hourStr !== "12" ? 12 : 0)
              const minute = Number.parseInt(minuteStr)

              const timeDate = selectedDate ? setMinutes(setHours(selectedDate, hour), minute) : null

              const isTimePast = timeDate && isPast(timeDate) && isSameDay(timeDate, new Date())
              const isDisabled = !selectedDate || isTimePast

              return (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlotButton,
                    selectedTime === time && styles.selectedTimeSlotButton,
                    isDisabled && styles.disabledTimeSlotButton,
                  ]}
                  onPress={() => setSelectedTime(time)}
                  disabled={!!isDisabled}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      selectedTime === time && styles.selectedTimeSlotText,
                      isDisabled && styles.disabledTimeSlotText,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promo Code</Text>
          <TouchableOpacity style={styles.promoCodeInputContainer} onPress={navigateToAddPromo}>
            <TextInput
              style={styles.promoCodeInput}
              placeholder="Enter Promo Code"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={promoCode}
              editable={false} 
            />
            <Icon name="chevron-forward-outline" size={24} color="rgba(255, 255, 255, 0.5)" />
          </TouchableOpacity>
          {appliedPromo && (
            <Text style={styles.appliedPromoText}>
              Applied: {appliedPromo.name} ({appliedPromo.discount})
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceLabel}>Total Price</Text>
          <Text style={styles.totalPriceValue}>
            ${(totalPrice * workingHours * (appliedPromo ? 1 - appliedPromo.value : 1)).toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() =>
            navigation.navigate("AddressLocation", {
              serviceId,
              categoryId,
              selectedItems,
              totalPrice: (totalPrice * workingHours * (appliedPromo ? 1 - appliedPromo.value : 1)).toFixed(2),
              selectedDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : null, // Pass as string
              selectedTime,
              workingHours,
              appliedPromo,
            })
          }
          disabled={!selectedDate || !selectedTime} 
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 25, 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  calendarCard: {
    backgroundColor: "#1A1A1A", 
    borderRadius: 16,
    padding: 20, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20, 
  },
  calendarMonth: {
    fontSize: 20, 
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  weekDaysContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  weekDayText: {
    color: "rgba(255, 255, 255, 0.5)", 
    fontSize: 13, 
    width: (width - 40 - 40) / 7, 
    textAlign: "center",
    fontWeight: "600",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  dayCell: {
    width: (width - 40 - 40) / 7, 
    height: (width - 40 - 40) / 7,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
  },
  dayText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  selectedDayCell: {
    backgroundColor: "#8B5CF6",
    borderRadius: 999, 
    borderWidth: 0, 
  },
  selectedDayText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  highlightedDayCell: {
    borderWidth: 2, 
    borderColor: "#8B5CF6",
    borderRadius: 999,
  },
  disabledDayCell: {
    backgroundColor: "rgba(255, 255, 255, 0.02)", 
  },
  disabledDayText: {
    color: "rgba(255, 255, 255, 0.2)", 
  },
  workingHoursCard: {
    backgroundColor: "#1A1A1A", 
    borderRadius: 16,
    paddingVertical: 18, 
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  workingHoursLabel: {
    fontSize: 16,
    color: "#E0E0E0", 
    fontWeight: "500",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)", 
    borderRadius: 25, 
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  quantityButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)", 
    borderRadius: 20, 
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginHorizontal: 15, 
  },
  timeSlotsContainer: {
    paddingRight: 20,
  },
  timeSlotButton: {
    backgroundColor: "#1A1A1A", 
    borderRadius: 12,
    paddingVertical: 12, 
    paddingHorizontal: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)", 
  },
  selectedTimeSlotButton: {
    backgroundColor: "#8B5CF6", 
    borderColor: "#8B5CF6",
  },
  timeSlotText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedTimeSlotText: {
    color: "#FFFFFF",
  },
  disabledTimeSlotButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)", 
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  disabledTimeSlotText: {
    color: "rgba(255, 255, 255, 0.3)",
  },
  promoCodeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A", 
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 55, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  promoCodeInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  appliedPromoText: {
    fontSize: 14,
    color: "#4ECDC4", 
    marginTop: 10, 
    fontWeight: "600",
    alignSelf: "flex-start", 
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18, 
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#1A1A2E",
  },
  totalPriceContainer: {
    alignItems: "flex-start",
  },
  totalPriceLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  totalPriceValue: {
    fontSize: 24, 
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  continueButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 16, 
    paddingHorizontal: 35, 
    alignItems: "center",
    shadowColor: "#8B5CF6", 
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 17, 
    fontWeight: "bold",
  },
})

export default BookingDetailsScreen
