import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface PopularService {
  id: string;
  providerName: string;
  serviceName: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  backgroundColor: string;
  category: string;
  isBookmarked: boolean;
}

const PopularServices = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState('All');
  const [services, setServices] = useState<PopularService[]>([
    {
      id: '1',
      providerName: 'Jenny Wilson',
      serviceName: 'House Cleaning',
      price: 25,
      rating: 4.8,
      reviews: 8289,
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg',
      backgroundColor: '#E0F2FE',
      category: 'Cleaning',
      isBookmarked: true,
    },
    {
      id: '2',
      providerName: 'Robert Fox',
      serviceName: 'Floor Cleaning',
      price: 20,
      rating: 4.9,
      reviews: 6182,
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg',
      backgroundColor: '#FEE2E2',
      category: 'Cleaning',
      isBookmarked: false,
    },
    {
      id: '3',
      providerName: 'Kristin Watson',
      serviceName: 'Washing Clothes',
      price: 22,
      rating: 4.7,
      reviews: 7938,
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg',
      backgroundColor: '#FEF3C7',
      category: 'Cleaning',
      isBookmarked: false,
    },
    {
      id: '4',
      providerName: 'John Smith',
      serviceName: 'AC Repairing',
      price: 35,
      rating: 4.6,
      reviews: 5421,
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg',
      backgroundColor: '#E0F2FE',
      category: 'Repairing',
      isBookmarked: true,
    },
    {
      id: '5',
      providerName: 'Sarah Johnson',
      serviceName: 'Wall Painting',
      price: 45,
      rating: 4.8,
      reviews: 3892,
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg',
      backgroundColor: '#F3E8FF',
      category: 'Painting',
      isBookmarked: false,
    },
    {
      id: '6',
      providerName: 'Mike Davis',
      serviceName: 'Bathroom Cleaning',
      price: 18,
      rating: 4.5,
      reviews: 4521,
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg',
      backgroundColor: '#ECFDF5',
      category: 'Cleaning',
      isBookmarked: false,
    },
  ]);

  const categories = ['All', 'Cleaning', 'Repairing', 'Painting'];

  const getFilteredServices = () => {
    if (activeTab === 'All') {
      return services;
    }
    return services.filter(service => service.category === activeTab);
  };

  const toggleBookmark = (serviceId: string) => {
    setServices(prev =>
      prev.map(service =>
        service.id === serviceId
          ? { ...service, isBookmarked: !service.isBookmarked }
          : service
      )
    );
  };

  const renderServiceItem = (item: PopularService) => (
    <TouchableOpacity key={item.id} style={styles.serviceItem}>
      <View style={[styles.serviceImage, { backgroundColor: item.backgroundColor }]}>
        <Image source={{ uri: item.image }} style={styles.providerImage} />
      </View>
      <View style={styles.serviceInfo}>
        <Text style={styles.providerName}>{item.providerName}</Text>
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <Text style={styles.servicePrice}>${item.price}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviews}>| {item.reviews.toLocaleString()} reviews</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.bookmarkButton}
        onPress={() => toggleBookmark(item.id)}
      >
        <Icon 
          name={item.isBookmarked ? "bookmark" : "bookmark-outline"} 
          size={20} 
          color="#8B5CF6" 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Most Popular Services</Text>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Icon name="search-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.tab,
              activeTab === category && styles.activeTab,
            ]}
            onPress={() => setActiveTab(category)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === category && styles.activeTabText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.servicesList}>
          {getFilteredServices().map(renderServiceItem)}
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 14,
    color: 'rgba(139, 92, 246, 0.8)',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  servicesList: {
    paddingHorizontal: 20,
  },
  serviceItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  providerImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PopularServices;