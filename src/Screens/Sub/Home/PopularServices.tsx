'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useServiceData } from '../../../hooks/useServiceData';
import type {
  RootStackParamList,
  ServiceItem,
  BookmarkedService,
} from '../../Types/data';
import type { StackNavigationProp } from '@react-navigation/stack';

import enTranslations from '../../../Assets/lang/en.json';
import azTranslations from '../../../Assets/lang/az.json';
import ruTranslations from '../../../Assets/lang/ru.json';

const { width, height } = Dimensions.get('window');
const responsiveWidth = (percentage: number) => (width * percentage) / 100;
const responsiveHeight = (percentage: number) => (height * percentage) / 100;
const responsiveFontSize = (size: number) => size * (width / 375);

const allTranslations = {
  en: enTranslations,
  az: azTranslations,
  ru: ruTranslations,
};

const MostPopularServicesScreen = ({
  navigation,
}: {
  navigation: StackNavigationProp<RootStackParamList>;
}) => {
  const isFocused = useIsFocused();
  const [locale, setLocale] = useState<'en' | 'az' | 'ru'>('en');
  const [activeTab, setActiveTab] = useState<string>('');
  const [bookmarkedServices, setBookmarkedServices] = useState<string[]>([]);
  const { categories, isLoading, error } = useServiceData();

  const t = (key: keyof typeof enTranslations) => {
    return allTranslations[locale][key] || key;
  };

  const loadBookmarks = useCallback(async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem('bookmarkedServices');
      if (savedBookmarks) {
        setBookmarkedServices(
          JSON.parse(savedBookmarks).map((s: BookmarkedService) => s.id),
        );
      }
    } catch (error) {
      console.error('Failed to load bookmarks from storage', error);
    }
  }, []);

  const saveBookmarks = useCallback(async (bookmarks: BookmarkedService[]) => {
    try {
      await AsyncStorage.setItem(
        'bookmarkedServices',
        JSON.stringify(bookmarks),
      );
    } catch (error) {
      console.error('Failed to save bookmarks to storage', error);
    }
  }, []);

  useEffect(() => {
    const loadLocaleAndBookmarks = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem('appLocale');
        if (
          savedLocale &&
          (savedLocale === 'en' || savedLocale === 'az' || savedLocale === 'ru')
        ) {
          setLocale(savedLocale);
        }
        await loadBookmarks();
      } catch (error) {
        console.error('Failed to load locale or bookmarks from storage', error);
      }
    };
    if (isFocused) {
      loadLocaleAndBookmarks();
    }
  }, [isFocused, loadBookmarks]);

  useEffect(() => {
    if (categories.length > 0 && locale && activeTab === '') {
      setActiveTab(t('all'));
    }
  }, [categories, locale]);

  const allPopularServices: BookmarkedService[] = categories.flatMap(category =>
    category.services.map((service: ServiceItem) => ({
      id: service.id,
      providerName: service.exampleProviderName || 'Unknown Provider',
      serviceName: service.name,
      price: service.price,
      rating: service.rating,
      reviews: service.reviews,
      image: service.heroImage || '/placeholder.svg?height=300&width=400',
      backgroundColor: category.color,
      category: t(category.name.toLowerCase() as keyof typeof enTranslations),
    })),
  );

  const categoriesForTabs = [
    t('all'),
    ...new Set(
      categories.map(cat =>
        t(cat.name.toLowerCase() as keyof typeof enTranslations),
      ),
    ),
  ];

  const getFilteredServices = () => {
    if (activeTab === t('all')) {
      return allPopularServices;
    }
    return allPopularServices.filter(service => service.category === activeTab);
  };

  const toggleBookmark = async (service: BookmarkedService) => {
    const isBookmarked = bookmarkedServices.includes(service.id);
    let updatedBookmarks: BookmarkedService[] = [];
    try {
      const currentBookmarksString = await AsyncStorage.getItem(
        'bookmarkedServices',
      );
      const currentBookmarks: BookmarkedService[] = currentBookmarksString
        ? JSON.parse(currentBookmarksString)
        : [];
      if (isBookmarked) {
        updatedBookmarks = currentBookmarks.filter(s => s.id !== service.id);
      } else {
        updatedBookmarks = [...currentBookmarks, service];
      }
      await saveBookmarks(updatedBookmarks);
      setBookmarkedServices(updatedBookmarks.map(s => s.id));
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const handleServicePress = (item: BookmarkedService) => {
    navigation.navigate('ServiceDetail', {
      serviceId: item.id,
      categoryId:
        categories.find(
          cat =>
            t(cat.name.toLowerCase() as keyof typeof enTranslations) ===
            item.category,
        )?.id || item.category,
      serviceName: item.serviceName,
    });
  };

  const renderServiceItem = (item: BookmarkedService) => {
    const isBookmarked = bookmarkedServices.includes(item.id);
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.serviceItem}
        onPress={() => handleServicePress(item)}
      >
        <View style={styles.serviceImageContainer}>
          <View
            style={[
              styles.serviceImage,
              { backgroundColor: item.backgroundColor },
            ]}
          >
            <Image source={{ uri: item.image }} style={styles.providerImage} />
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
        </View>
        <View style={styles.serviceInfo}>
          <View style={styles.serviceHeader}>
            <View style={styles.serviceTextContainer}>
              <Text style={styles.providerName}>{item.providerName}</Text>
              <Text style={styles.serviceName}>{item.serviceName}</Text>
            </View>
            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={() => toggleBookmark(item)}
            >
              <Icon
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={responsiveFontSize(22)}
                color={isBookmarked ? '#FF6B6B' : '#8B5CF6'}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.serviceFooter}>
            <View style={styles.ratingContainer}>
              <View style={styles.starContainer}>
                <Icon
                  name="star"
                  size={responsiveFontSize(16)}
                  color="#FFD700"
                />
                <Text style={styles.rating}>{item.rating}</Text>
              </View>
              <Text style={styles.reviews}>
                ({item.reviews.toLocaleString()} {t('reviews')})
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.servicePrice}>${item.price.toFixed(2)}</Text>
              <Text style={styles.currency}>{t('currency')}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading popular services...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <Icon
            name="alert-circle-outline"
            size={responsiveFontSize(64)}
            color="#FF6B6B"
          />
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => {}}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>{t('mostPopularServices')}</Text>
          <Text style={styles.headerSubtitle}>Discover top-rated services</Text>
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Icon
            name="search-outline"
            size={responsiveFontSize(24)}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {categoriesForTabs.map(category => (
            <TouchableOpacity
              key={category}
              style={[styles.tab, activeTab === category && styles.activeTab]}
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
              {activeTab === category && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.servicesList}>
          <View style={styles.servicesHeader}>
            <Text style={styles.servicesCount}>
              {getFilteredServices().length} services found
            </Text>
          </View>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(18),
    marginTop: responsiveHeight(2),
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0F0F23',
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: responsiveFontSize(18),
    textAlign: 'center',
    marginVertical: responsiveHeight(2),
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(8),
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(7),
    paddingBottom: responsiveHeight(3),
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  backButton: {
    width: responsiveFontSize(44),
    height: responsiveFontSize(44),
    borderRadius: responsiveFontSize(22),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: responsiveWidth(3),
  },
  headerTitle: {
    fontSize: responsiveFontSize(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: responsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: responsiveHeight(0.5),
  },
  searchButton: {
    width: responsiveFontSize(44),
    height: responsiveFontSize(44),
    borderRadius: responsiveFontSize(22),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2),
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(1.2),
    borderRadius: responsiveFontSize(25),
    marginRight: responsiveWidth(3),
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabText: {
    fontSize: responsiveFontSize(14),
    color: 'rgba(139, 92, 246, 0.8)',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -2,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  servicesList: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(5),
  },
  servicesHeader: {
    marginBottom: responsiveHeight(2),
  },
  servicesCount: {
    fontSize: responsiveFontSize(16),
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  serviceItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: responsiveFontSize(20),
    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(2.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: responsiveFontSize(16),
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  serviceImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  serviceImage: {
    width: responsiveFontSize(100),
    height: responsiveFontSize(100),
    borderRadius: responsiveFontSize(20),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  providerImage: {
    width: responsiveFontSize(80),
    height: responsiveFontSize(80),
    borderRadius: responsiveFontSize(16),
  },
  categoryBadge: {
    position: 'absolute',
    top: -8,
    right: responsiveWidth(25),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveHeight(0.5),
    borderRadius: responsiveFontSize(12),
  },
  categoryBadgeText: {
    fontSize: responsiveFontSize(12),
    color: '#333',
    fontWeight: '600',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: responsiveHeight(1.5),
  },
  serviceTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  providerName: {
    fontSize: responsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: responsiveHeight(0.5),
    textAlign: 'center',
  },
  serviceName: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: responsiveFontSize(24),
  },
  bookmarkButton: {
    width: responsiveFontSize(44),
    height: responsiveFontSize(44),
    borderRadius: responsiveFontSize(22),
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: -8,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(0.5),
  },
  rating: {
    fontSize: responsiveFontSize(16),
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: responsiveWidth(1),
  },
  reviews: {
    fontSize: responsiveFontSize(13),
    color: 'rgba(255, 255, 255, 0.6)',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  servicePrice: {
    fontSize: responsiveFontSize(24),
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  currency: {
    fontSize: responsiveFontSize(12),
    color: 'rgba(139, 92, 246, 0.7)',
    marginTop: responsiveHeight(0.2),
  },
});

export default MostPopularServicesScreen;
