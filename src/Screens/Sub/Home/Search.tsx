import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SearchResult {
  id: string;
  providerName: string;
  serviceName: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  backgroundColor: string;
  category: string;
}

interface RecentSearch {
  id: string;
  query: string;
  timestamp: string;
}

const Search = ({ navigation, route }: any) => {
  const [searchQuery, setSearchQuery] = useState(route?.params?.query || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const recentSearches: RecentSearch[] = [
    { id: '1', query: 'Washing Repairing', timestamp: '2 hours ago' },
    { id: '2', query: 'Painting the Wall', timestamp: '1 day ago' },
    { id: '3', query: 'Water Faucet Repairing', timestamp: '2 days ago' },
    { id: '4', query: 'Window Cleaning', timestamp: '3 days ago' },
    { id: '5', query: 'Plumbing Services', timestamp: '1 week ago' },
    { id: '6', query: 'Computer Repairing', timestamp: '1 week ago' },
    { id: '7', query: 'Cloth Laundry', timestamp: '2 weeks ago' },
  ];

  const allServices: SearchResult[] = [
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
    },
    {
      id: '4',
      providerName: 'John Smith',
      serviceName: 'Window Cleaning',
      price: 18,
      rating: 4.6,
      reviews: 5421,
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg',
      backgroundColor: '#E0F2FE',
      category: 'Cleaning',
    },
  ];

  const handleSearch = (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    
    // Simulate search delay
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
    handleSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const renderSearchResult = (item: SearchResult) => (
    <TouchableOpacity key={item.id} style={styles.resultItem}>
      <View style={[styles.resultImage, { backgroundColor: item.backgroundColor }]}>
        <Image source={{ uri: item.image }} style={styles.providerImage} />
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.providerName}>{item.providerName}</Text>
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <Text style={styles.servicePrice}>${item.price}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviews}>| {item.reviews.toLocaleString()} reviews</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bookmarkButton}>
        <Icon name="bookmark-outline" size={20} color="#8B5CF6" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderRecentSearch = (item: RecentSearch) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.recentItem}
      onPress={() => handleRecentSearchPress(item.query)}
    >
      <Icon name="time-outline" size={20} color="rgba(255, 255, 255, 0.5)" />
      <View style={styles.recentTextContainer}>
        <Text style={styles.recentQuery}>{item.query}</Text>
        <Text style={styles.recentTime}>{item.timestamp}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton}>
        <Icon name="close" size={16} color="rgba(255, 255, 255, 0.5)" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderNotFound = () => (
    <View style={styles.notFoundContainer}>
      <View style={styles.notFoundIcon}>
        <Icon name="search-outline" size={80} color="#8B5CF6" />
      </View>
      <Text style={styles.notFoundTitle}>Not Found</Text>
      <Text style={styles.notFoundDescription}>
        Sorry, the keyword you entered cannot be found. Please check again or search with another keyword.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color="rgba(255, 255, 255, 0.5)" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => handleSearch(searchQuery)}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <Icon name="close" size={20} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => navigation.navigate('Filter')}
        >
          <Icon name="options-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {!searchQuery && !isSearching && searchResults.length === 0 && (
          <View style={styles.recentContainer}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recent</Text>
              <TouchableOpacity>
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            {recentSearches.map(renderRecentSearch)}
          </View>
        )}

        {isSearching && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        )}

        {!isSearching && searchQuery && searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>
              Results for "{searchQuery}"
            </Text>
            <Text style={styles.resultsCount}>
              {searchResults.length} results found
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 12,
    marginLeft: 12,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  recentContainer: {
    marginTop: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  clearAllText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  recentTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  recentQuery: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  recentTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  deleteButton: {
    padding: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  resultsContainer: {
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  resultsCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 20,
  },
  resultItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  resultImage: {
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
  resultInfo: {
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
  notFoundContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  notFoundIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  notFoundDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});

export default Search;