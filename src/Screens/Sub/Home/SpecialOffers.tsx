import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width: screenWidth } = Dimensions.get('window');

interface OfferItem {
  id: string;
  percentage: string;
  title: string;
  description: string;
  colors: string[];
  image: string;
  validUntil: string;
}

const SpecialOffers = ({ navigation }: any) => {
  const offers: OfferItem[] = [
    {
      id: '1',
      percentage: '30%',
      title: "Today's Special!",
      description: 'Get discount for every order, only valid for today',
      colors: ['#8B5CF6', '#A855F7'],
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg',
      validUntil: 'Valid until 11:59 PM',
    },
    {
      id: '2',
      percentage: '25%',
      title: 'Friday Special!',
      description: 'Get discount for every order, only valid for today',
      colors: ['#EF4444', '#F87171'],
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg',
      validUntil: 'Valid until Friday',
    },
    {
      id: '3',
      percentage: '40%',
      title: 'New Promo!',
      description: 'Get discount for every order, only valid for today',
      colors: ['#F59E0B', '#FBBF24'],
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg',
      validUntil: 'Valid for 3 days',
    },
    {
      id: '4',
      percentage: '35%',
      title: 'Weekend Special!',
      description: 'Get discount for every order, only valid for today',
      colors: ['#10B981', '#34D399'],
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg',
      validUntil: 'Valid this weekend',
    },
    {
      id: '5',
      percentage: '20%',
      title: 'First Time User!',
      description: 'Special discount for new customers',
      colors: ['#06B6D4', '#0891B2'],
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg',
      validUntil: 'Valid for 30 days',
    },
    {
      id: '6',
      percentage: '50%',
      title: 'Mega Sale!',
      description: 'Biggest discount of the year',
      colors: ['#DC2626', '#EF4444'],
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg',
      validUntil: 'Limited time offer',
    },
  ];

  const renderOfferItem = (item: OfferItem) => (
    <TouchableOpacity key={item.id} style={styles.offerCard}>
      <LinearGradient
        colors={item.colors}
        style={styles.offerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.offerContent}>
          <View style={styles.offerTextContainer}>
            <Text style={styles.offerPercentage}>{item.percentage}</Text>
            <Text style={styles.offerTitle}>{item.title}</Text>
            <Text style={styles.offerDescription}>{item.description}</Text>
            <Text style={styles.validUntil}>{item.validUntil}</Text>
          </View>
          <View style={styles.offerImageContainer}>
            <Image source={{ uri: item.image }} style={styles.offerImage} />
          </View>
        </View>
        <TouchableOpacity style={styles.claimButton}>
          <Text style={styles.claimButtonText}>Claim Now</Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Special Offers</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Icon name="ellipsis-horizontal" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.offersContainer}>
          {offers.map(renderOfferItem)}
        </View>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  offersContainer: {
    paddingHorizontal: 20,
  },
  offerCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  offerGradient: {
    padding: 20,
  },
  offerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  offerTextContainer: {
    flex: 1,
  },
  offerPercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  offerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  offerDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 8,
  },
  validUntil: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },
  offerImageContainer: {
    width: 120,
    height: 120,
  },
  offerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  claimButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SpecialOffers;