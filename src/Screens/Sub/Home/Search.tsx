import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList, ServiceItem, BookmarkedService } from '../../../Types/data';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useServiceData } from '../../../hooks/useServiceData';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const responsiveWidth = (percentage: number) => (screenWidth * percentage) / 100;
const responsiveHeight = (percentage: number) => (screenHeight * percentage) / 100;
const responsiveFontSize = (size: number) => size * (screenWidth / 375);

interface RecentSearch {
  id: string;
  query: string;
  timestamp: string;
}

const Search = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const { categories, isLoading, error } = useServiceData();

  const [searchQuery, setSearchQuery] = useState(route?.params?.query || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<BookmarkedService[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

  const getCategoryTranslation = useCallback(
    (categoryName: string) => {
      const key = categoryName.toLowerCase().replace(/\s+/g, '_');
      return t(key, categoryName);
    },
    [t],
  );

  const allServices: BookmarkedService[] = categories.flatMap((category) =>
    category.services.map((service: ServiceItem) => ({
      id: service.id,
      providerName: service.exampleProviderName || t("unknownProvider"),
      serviceName: service.name,
      price: service.price,
      rating: service.rating,
      reviews: service.reviews,
      image: service.heroImage || "/placeholder.svg?height=300&width=400",
      backgroundColor: category.color,
      category: getCategoryTranslation(category.name),
    })),
  );

  // Load recent searches from AsyncStorage on component mount
  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const storedSearches = await AsyncStorage.getItem('recentSearches');
        if (storedSearches) {
          setRecentSearches(JSON.parse(storedSearches));
        }
      } catch (e) {
        console.error('Failed to load recent searches:', e);
      }
    };
    loadRecentSearches();
  }, []);

  // Perform search when searchQuery or categories change
  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      setSearchResults([]); // Clear results if query is empty
    }
  }, [searchQuery, categories]); // Re-run when categories data is loaded/changed

  const saveRecentSearch = async (query: string) => {
    if (!query.trim()) return;

    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      query: query,
      timestamp: new Date().toLocaleString(), // You might want a more dynamic timestamp
    };

    // Remove duplicate if exists and add to the top
    const updatedSearches = [
      newSearch,
      ...recentSearches.filter((s) => s.query.toLowerCase() !== query.toLowerCase()),
    ].slice(0, 7); // Keep only the latest 7 searches

    setRecentSearches(updatedSearches);
    try {
      await AsyncStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (e) {
      console.error('Failed to save recent search:', e);
    }
  };

  const handleSearch = (query: string) => {
    setIsSearching(true);
    saveRecentSearch(query); // Save the search query

    setTimeout(() => {
      if (query.trim()) {
        const filtered = allServices.filter(service =>
          service.serviceName.toLowerCase().includes(query.toLowerCase()) ||
          service.providerName.toLowerCase().includes(query.toLowerCase()) ||
          service.category.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
      } else {
        setSearchResults([]);
      }
      setIsSearching(false);
    }, 500);
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
    // handleSearch will be called by the useEffect when searchQuery changes
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const clearAllRecentSearches = async () => {
    setRecentSearches([]);
    try {
      await AsyncStorage.removeItem('recentSearches');
    } catch (e) {
      console.error('Failed to clear all recent searches:', e);
    }
  };

  const renderSearchResult = (item: BookmarkedService) => (
    <TouchableOpacity key={item.id} style={styles.resultItem}>
      <View style={[styles.resultImage, { backgroundColor: item.backgroundColor }]}>
        <Image source={{ uri: item.image }} style={styles.providerImage} />
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.providerName}>{item.providerName}</Text>
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <Text style={styles.servicePrice}>{item.price.toFixed(2)} {t("currency")}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={responsiveFontSize(16)} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviews}>| {item.reviews.toLocaleString()} {t("reviews")}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bookmarkButton}>
        <Icon name="bookmark-outline" size={responsiveFontSize(20)} color="#8B5CF6" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderRecentSearch = (item: RecentSearch) => (
    <TouchableOpacity
      key={item.id}
      style={styles.recentItem}
      onPress={() => handleRecentSearchPress(item.query)}
    >
      <Icon name="time-outline" size={responsiveFontSize(20)} color="rgba(255, 255, 255, 0.5)" />
      <View style={styles.recentTextContainer}>
        <Text style={styles.recentQuery}>{item.query}</Text>
        <Text style={styles.recentTime}>{item.timestamp}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton}>
        <Icon name="close" size={responsiveFontSize(16)} color="rgba(255, 255, 255, 0.5)" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderNotFound = () => (
    <View style={styles.notFoundContainer}>
      <View style={styles.notFoundIcon}>
        <Icon name="search-outline" size={responsiveFontSize(80)} color="#8B5CF6" />
      </View>
      <Text style={styles.notFoundTitle}>{t("notFound")}</Text>
      <Text style={styles.notFoundDescription}>
        {t("notFoundDescription")}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>{t("loading")}</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {t("error")}: {error}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => { /* retry logic */ }}>
          <Text style={styles.retryButtonText}>{t("retry")}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={responsiveFontSize(24)} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={responsiveFontSize(20)} color="rgba(255, 255, 255, 0.5)" />
          <TextInput
            style={styles.searchInput}
            placeholder={t("searchPlaceholder")}
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Icon name="close" size={responsiveFontSize(20)} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => navigation.navigate('Filter')}
        >
          <Icon name="options-outline" size={responsiveFontSize(24)} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {!searchQuery && !isSearching && searchResults.length === 0 && (
          <View style={styles.recentContainer}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>{t("recentSearches")}</Text>
              <TouchableOpacity onPress={clearAllRecentSearches}>
                <Text style={styles.clearAllText}>{t("clearAll")}</Text>
              </TouchableOpacity>
            </View>
            {recentSearches.map(renderRecentSearch)}
          </View>
        )}
        {isSearching && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={styles.loadingText}>{t("searching")}</Text>
          </View>
        )}
        {!isSearching && searchQuery && searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>
              {t("resultsFor", { query: searchQuery })}
            </Text>
            <Text style={styles.resultsCount}>
              {t("resultsFound", { count: searchResults.length })}
            </Text>
            {searchResults.map(renderSearchResult)}
          </View>
        )}
        {!isSearching && searchQuery && searchResults.length === 0 && renderNotFound()}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(18),
    marginTop: responsiveHeight(2),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: responsiveFontSize(18),
    textAlign: 'center',
    marginBottom: responsiveHeight(2),
  },
  retryButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: responsiveFontSize(12),
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(5),
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(6),
    paddingBottom: responsiveHeight(2),
  },
  backButton: {
    width: responsiveFontSize(40),
    height: responsiveFontSize(40),
    borderRadius: responsiveFontSize(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsiveWidth(3),
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: responsiveFontSize(12),
    paddingHorizontal: responsiveWidth(4),
    marginRight: responsiveWidth(3),
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: responsiveFontSize(16),
    paddingVertical: responsiveHeight(1.5),
    marginLeft: responsiveWidth(3),
  },
  filterButton: {
    width: responsiveFontSize(48),
    height: responsiveFontSize(48),
    borderRadius: responsiveFontSize(12),
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
  },
  recentContainer: {
    marginTop: responsiveHeight(2),
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  recentTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  clearAllText: {
    fontSize: responsiveFontSize(16),
    color: '#8B5CF6',
    fontWeight: '600',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(1.5),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  recentTextContainer: {
    flex: 1,
    marginLeft: responsiveWidth(3),
  },
  recentQuery: {
    fontSize: responsiveFontSize(16),
    color: '#FFFFFF',
    marginBottom: responsiveHeight(0.2),
  },
  recentTime: {
    fontSize: responsiveFontSize(12),
    color: 'rgba(255, 255, 255, 0.5)',
  },
  deleteButton: {
    padding: responsiveWidth(2),
  },
  resultsContainer: {
    marginTop: responsiveHeight(2),
  },
  resultsTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: responsiveHeight(1),
  },
  resultsCount: {
    fontSize: responsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: responsiveHeight(2.5),
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: responsiveFontSize(16),
    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(2),
    alignItems: 'center',
  },
  resultImage: {
    width: responsiveFontSize(80),
    height: responsiveFontSize(80),
    borderRadius: responsiveFontSize(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: responsiveWidth(4),
  },
  providerImage: {
    width: responsiveFontSize(60),
    height: responsiveFontSize(60),
    borderRadius: responsiveFontSize(12),
  },
  resultInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: responsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: responsiveHeight(0.5),
  },
  serviceName: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: responsiveHeight(0.5),
  },
  servicePrice: {
    fontSize: responsiveFontSize(18),
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: responsiveHeight(1),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: responsiveFontSize(14),
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: responsiveWidth(1),
    marginRight: responsiveWidth(1),
  },
  reviews: {
    fontSize: responsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.6)',
  },
  bookmarkButton: {
    width: responsiveFontSize(40),
    height: responsiveFontSize(40),
    borderRadius: responsiveFontSize(20),
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveHeight(10),
  },
  notFoundIcon: {
    width: responsiveFontSize(120),
    height: responsiveFontSize(120),
    borderRadius: responsiveFontSize(60),
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(3),
  },
  notFoundTitle: {
    fontSize: responsiveFontSize(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: responsiveHeight(1.5),
  },
  notFoundDescription: {
    fontSize: responsiveFontSize(16),
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: responsiveFontSize(24),
    paddingHorizontal: responsiveWidth(5),
  },
});

export default Search;
