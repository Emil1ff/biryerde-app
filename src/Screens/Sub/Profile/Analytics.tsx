'use client';
import type React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { AnalyticsScreenProps } from '../../../Types/navigation';

const { width, height } = Dimensions.get('window');
const responsiveWidth = (percentage: number) => (width * percentage) / 100;
const responsiveHeight = (percentage: number) => (height * percentage) / 100;
const responsiveFontSize = (size: number) => size * (width / 375);

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <View style={styles.statCard}>
    <LinearGradient
      colors={[color, 'rgba(0,0,0,0.5)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.statCardGradient}
    >
      <MaterialCommunityIcons
        name={icon}
        size={responsiveFontSize(30)}
        color="#FFFFFF"
        style={styles.statIcon}
      />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </LinearGradient>
  </View>
);

const AnalyticsScreen: React.FC = () => {
  const navigation = useNavigation<AnalyticsScreenProps['navigation']>();
  const totalServices = 45;
  const totalSpending = 1250.0;
  const averageRating = 4.8;
  const completedBookings = 38;
  const pendingBookings = 7;
  const cancelledBookings = 5;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon
            name="arrow-back"
            size={responsiveFontSize(24)}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView
        style={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Services"
            value={totalServices.toString()}
            icon="briefcase-outline"
            color="#2196F3"
          />
          <StatCard
            title="Total Spending"
            value={`$${totalSpending.toFixed(2)}`}
            icon="cash-multiple"
            color="#4CAF50"
          />
          <StatCard
            title="Average Rating"
            value={averageRating.toFixed(1)}
            icon="star-outline"
            color="#FFC107"
          />
          <StatCard
            title="Completed Bookings"
            value={completedBookings.toString()}
            icon="check-circle-outline"
            color="#8B5CF6"
          />
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Booking Status</Text>
        </View>
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <MaterialCommunityIcons
              name="check-all"
              size={responsiveFontSize(24)}
              color="#4CAF50"
            />
            <Text style={styles.statusText}>Completed Bookings:</Text>
            <Text style={styles.statusValue}>{completedBookings}</Text>
          </View>
          <View style={styles.statusRow}>
            <MaterialCommunityIcons
              name="timer-sand"
              size={responsiveFontSize(24)}
              color="#FFC107"
            />
            <Text style={styles.statusText}>Pending Bookings:</Text>
            <Text style={styles.statusValue}>{pendingBookings}</Text>
          </View>
          <View style={styles.statusRow}>
            <MaterialCommunityIcons
              name="calendar-remove-outline"
              size={responsiveFontSize(24)}
              color="#EF4444"
            />
            <Text style={styles.statusText}>Cancelled Bookings:</Text>
            <Text style={styles.statusValue}>{cancelledBookings}</Text>
          </View>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Spending Distribution</Text>
        </View>
        <View style={styles.categorySpendingCard}>
          <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>Home Services</Text>
            <Text style={styles.categoryAmount}>$500.00</Text>
          </View>
          <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>Automotive</Text>
            <Text style={styles.categoryAmount}>$300.00</Text>
          </View>
          <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>Beauty & Spa</Text>
            <Text style={styles.categoryAmount}>$250.00</Text>
          </View>
          <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>Other</Text>
            <Text style={styles.categoryAmount}>$200.00</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: responsiveHeight(5),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(7),
    paddingBottom: responsiveHeight(2.5),
  },
  backButton: {
    padding: responsiveWidth(1),
  },
  headerTitle: {
    fontSize: responsiveFontSize(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: responsiveFontSize(24),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(3),
  },
  statCard: {
    width: responsiveWidth(43),
    height: responsiveHeight(20),
    marginBottom: responsiveHeight(2),
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  statCardGradient: {
    flex: 1,
    padding: responsiveWidth(4),
    justifyContent: 'space-between',
  },
  statIcon: {
    alignSelf: 'flex-end',
    opacity: 0.7,
  },
  statValue: {
    fontSize: responsiveFontSize(28),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statTitle: {
    fontSize: responsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(4),
    marginBottom: responsiveHeight(2),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(22),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statusCard: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: responsiveWidth(5),
    borderRadius: 16,
    padding: responsiveWidth(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(1.5),
  },
  statusText: {
    flex: 1,
    fontSize: responsiveFontSize(16),
    color: '#FFFFFF',
    marginLeft: responsiveWidth(2.5),
  },
  statusValue: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categorySpendingCard: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: responsiveWidth(5),
    borderRadius: 16,
    padding: responsiveWidth(5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1.5),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryName: {
    fontSize: responsiveFontSize(16),
    color: '#FFFFFF',
    fontWeight: '500',
  },
  categoryAmount: {
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default AnalyticsScreen;
