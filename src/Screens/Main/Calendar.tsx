import type React from 'react';
import { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  Platform,
  UIManager,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type {
  BookingDetailsScreenProps,
  AddBookingScreenProps,
  AllBookingsScreenProps,
} from '../../../src/Types/navigation';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CalendarDay {
  date: number;
  fullDate: Date;
  isToday: boolean;
  isSelected: boolean;
  isCurrentMonth: boolean;
  hasBooking: boolean;
  dayName: string;
}

interface ScheduledService {
  id: string;
  date: string;
  time: string;
  serviceName: string;
  providerName: string;
  duration: string;
  status: 'confirmed' | 'pending' | 'completed';
  image: string;
}

const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getServiceStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return '#4CAF50';
    case 'pending':
      return '#FFC107';
    case 'completed':
      return '#9E9E9E';
    default:
      return '#00BCD4';
  }
};

const CalendarDayItem: React.FC<{
  item: CalendarDay;
  onPress: (day: CalendarDay) => void;
}> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.calendarDay, !item.isCurrentMonth && styles.outOfMonthDay]}
      onPress={() => onPress(item)}
      disabled={!item.isCurrentMonth}
    >
      {item.isSelected ? (
        <LinearGradient
          colors={['#8B5CF6', '#A855F7']}
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
      {item.hasBooking && (
        <View
          style={[
            styles.bookingDot,
            item.isSelected && styles.bookingDotSelected,
          ]}
        />
      )}
    </TouchableOpacity>
  );
};

const ScheduledServiceCard: React.FC<{
  item: ScheduledService;
  onMorePress: (item: ScheduledService) => void;
}> = ({ item, onMorePress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity style={styles.serviceItem}>
        <Image source={{ uri: item.image }} style={styles.serviceImage} />
        <View style={styles.serviceDetails}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceName}>{item.serviceName}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getServiceStatusColor(item.status) },
              ]}
            >
              <Text style={styles.statusBadgeText}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.providerName}>{item.providerName}</Text>
          <View style={styles.serviceTimeAndDuration}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color="#B0BEC5"
              style={styles.detailIcon}
            />
            <Text style={styles.timeText}>{item.time}</Text>
            <Text style={styles.durationText}> ({item.duration})</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => onMorePress(item)}
        >
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={20}
            color="#B0BEC5"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const Calendar: React.FC<{ onScroll: (event: any) => void }> = ({
  onScroll,
}) => {
  const navigation = useNavigation<
    BookingDetailsScreenProps['navigation'] &
      AddBookingScreenProps['navigation'] &
      AllBookingsScreenProps['navigation']
  >();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedServiceForOptions, setSelectedServiceForOptions] =
    useState<ScheduledService | null>(null);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const [allBookings, setAllBookings] = useState<
    Record<string, ScheduledService[]>
  >(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    const bookings: ScheduledService[] = [
      {
        id: '1',
        date: formatDateToYYYYMMDD(today),
        time: '09:00 AM',
        serviceName: 'House Cleaning',
        providerName: 'Jenny Wilson',
        duration: '2 hours',
        status: 'confirmed',
        image:
          'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg',
      },
      {
        id: '2',
        date: formatDateToYYYYMMDD(today),
        time: '02:00 PM',
        serviceName: 'AC Repairing',
        providerName: 'Mike Davis',
        duration: '1.5 hours',
        status: 'pending',
        image:
          'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg',
      },
      {
        id: '3',
        date: formatDateToYYYYMMDD(
          new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
        ),
        time: '04:30 PM',
        serviceName: 'Plumbing Service',
        providerName: 'Sarah Johnson',
        duration: '1 hour',
        status: 'confirmed',
        image:
          'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg',
      },
      {
        id: '4',
        date: formatDateToYYYYMMDD(
          new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
        ),
        time: '10:00 AM',
        serviceName: 'Car Wash',
        providerName: 'Auto Spa',
        duration: '1 hour',
        status: 'completed',
        image:
          'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg',
      },
    ];

    const bookingsMap: Record<string, ScheduledService[]> = {};
    bookings.forEach(service => {
      if (!bookingsMap[service.date]) {
        bookingsMap[service.date] = [];
      }
      bookingsMap[service.date].push(service);
    });
    return bookingsMap;
  });

  const displayedServices = useMemo(() => {
    const selectedDateString = formatDateToYYYYMMDD(selectedDate);
    return allBookings[selectedDateString] || [];
  }, [selectedDate, allBookings]);

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      currentDate.setHours(0, 0, 0, 0);

      const isCurrentMonth = currentDate.getMonth() === month;
      const isToday = currentDate.getTime() === today.getTime();
      const isSelected = currentDate.getTime() === selectedDate.getTime();
      const hasBooking = !!allBookings[formatDateToYYYYMMDD(currentDate)];

      days.push({
        date: currentDate.getDate(),
        fullDate: currentDate,
        isToday,
        isSelected,
        isCurrentMonth,
        hasBooking,
        dayName: dayNames[currentDate.getDay()],
      });
    }
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);

    const newSelectedDate = new Date(
      newMonth.getFullYear(),
      newMonth.getMonth(),
      selectedDate.getDate(),
    );
    if (newSelectedDate.getMonth() !== newMonth.getMonth()) {
      newSelectedDate.setDate(0);
    }
    setSelectedDate(newSelectedDate);
  };

  const selectDate = (day: CalendarDay) => {
    setSelectedDate(day.fullDate);
  };

  const handleMoreOptionsPress = (service: ScheduledService) => {
    setSelectedServiceForOptions(service);
    setModalVisible(true);
  };

  const handleModalOptionPress = (option: string) => {
    if (selectedServiceForOptions) {
      switch (option) {
        case 'viewDetails':
          navigation.navigate('BookingDetails', {
            bookingId: selectedServiceForOptions.id,
          });
          break;
        case 'editBooking':
          Alert.alert(
            'Edit Booking',
            `Edit the booking for ${selectedServiceForOptions.serviceName}`,
          );
          // navigation.navigate("AddBooking", { bookingId: selectedServiceForOptions.id }); // If AddBooking is also used for editing
          break;
        case 'cancelBooking':
          Alert.alert(
            'Cancel Booking',
            `Cancel the booking for ${selectedServiceForOptions.serviceName}`,
          );
          break;
        case 'rescheduleBooking':
          Alert.alert(
            'Reschedule Booking',
            `Reschedule the booking for ${selectedServiceForOptions.serviceName}`,
          );
          break;
      }
    }
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Calendar</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddBooking')}
        >
          <LinearGradient
            colors={['#8B5CF6', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addButtonGradient}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll} // Pass onScroll prop
        scrollEventThrottle={16} // Important for smooth animation
        contentContainerStyle={{ paddingBottom: 100 }} // Alt çubuk için boşluk
      >
        <View style={styles.calendarCard}>
          <View style={styles.monthNavigation}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigateMonth('prev')}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={24}
                color="#E0E0E0"
              />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Text>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => navigateMonth('next')}
            >
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#E0E0E0"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.dayNamesContainer}>
            {dayNames.map(dayName => (
              <Text key={dayName} style={styles.dayName}>
                {dayName}
              </Text>
            ))}
          </View>
          <FlatList
            data={generateCalendarDays()}
            renderItem={({ item }) => (
              <CalendarDayItem item={item} onPress={selectDate} />
            )}
            keyExtractor={(item, index) =>
              `${item.fullDate.toISOString()}-${index}`
            }
            numColumns={7}
            scrollEnabled={false}
            contentContainerStyle={styles.calendarGrid}
          />
        </View>
        <View style={styles.scheduledServicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Service Booking ({displayedServices.length})
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AllBookings')}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {displayedServices.length > 0 ? (
            <FlatList
              data={displayedServices}
              renderItem={({ item }) => (
                <ScheduledServiceCard
                  item={item}
                  onMorePress={handleMoreOptionsPress}
                />
              )}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.servicesList}
            />
          ) : (
            <View style={styles.emptySchedule}>
              <MaterialCommunityIcons
                name="clipboard-text-off"
                size={80}
                color="rgba(255, 255, 255, 0.2)"
                style={styles.emptyScheduleIcon}
              />
              <Text style={styles.emptyScheduleTitle}>
                You have no service booking
              </Text>
              <Text style={styles.emptyScheduleText}>
                You don't have a service booking on this date
              </Text>
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
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleModalOptionPress('viewDetails')}
            >
              <Text style={styles.modalOptionText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleModalOptionPress('editBooking')}
            >
              <Text style={styles.modalOptionText}>Edit Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleModalOptionPress('rescheduleBooking')}
            >
              <Text style={styles.modalOptionText}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleModalOptionPress('cancelBooking')}
            >
              <Text
                style={[styles.modalOptionText, styles.modalOptionTextDanger]}
              >
                Cancel Booking
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  addButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  calendarCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#212121',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dayNamesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: '#B0BEC5',
    fontWeight: '600',
  },
  calendarGrid: {
    marginBottom: 10,
  },
  calendarDay: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    position: 'relative',
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayGradient: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  todayDay: {
    borderWidth: 1.5,
    borderColor: '#8B5CF6',
  },
  calendarDayText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  todayDayText: {
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
  outOfMonthDay: {
    opacity: 0.4,
  },
  outOfMonthDayText: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  bookingDot: {
    position: 'absolute',
    bottom: 5,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },
  bookingDotSelected: {
    backgroundColor: '#FFFFFF',
  },
  scheduledServicesSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  servicesList: {
    gap: 12,
  },
  serviceItem: {
    flexDirection: 'row',
    backgroundColor: '#212121',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
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
    resizeMode: 'cover',
  },
  serviceDetails: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    color: '#FFFFFF',
    fontWeight: '700',
  },
  providerName: {
    fontSize: 13,
    color: '#B0BEC5',
    marginBottom: 6,
  },
  serviceTimeAndDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#CFD8DC',
  },
  durationText: {
    fontSize: 12,
    color: '#B0BEC5',
  },
  detailIcon: {
    marginRight: 4,
  },
  moreButton: {
    padding: 8,
  },
  emptySchedule: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#212121',
    borderRadius: 12,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  emptyScheduleIcon: {
    marginBottom: 16,
  },
  emptyScheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E0E0E0',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyScheduleText: {
    fontSize: 14,
    color: '#B0BEC5',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#212121',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  modalOption: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalOptionText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  modalOptionTextDanger: {
    color: '#EF4444',
  },
});

export default Calendar;
