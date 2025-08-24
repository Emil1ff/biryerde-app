'use client';
import {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  Animated,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type {
  RootStackParamList,
  ServiceItem,
  BookmarkedService,
  Service,
} from '../../Types/data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useServiceData } from '../../hooks/useServiceData';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const responsiveWidth = (percentage: number) =>
  (screenWidth * percentage) / 100;
const responsiveHeight = (percentage: number) =>
  (screenHeight * percentage) / 100;
const responsiveFontSize = (size: number) => size * (screenWidth / 375);

interface HomeProps {
  onScroll: (event: any) => void;
}

export interface HomeRef {
  scrollToTop: () => void;
}
interface BookmarkedServiceWithTyping extends BookmarkedService {
  type: 'service';
}

const NUM_COLUMNS_CATEGORIES = 4;
const INITIAL_DISPLAY_COUNT_CATEGORIES = 7;
const INITIAL_DISPLAY_COUNT_POPULAR = 10;
const LOAD_BATCH_SIZE = 10;
const MORE_BUTTON_ID = 'more-button';
const SCROLL_THRESHOLD_FOR_LOAD = responsiveHeight(50);
const INITIAL_DISPLAY_COUNT_POPULAR_TABS = 4;
const LOAD_MORE_TABS_BATCH_SIZE = 3;
const Home = forwardRef<HomeRef, HomeProps>(({ onScroll }, ref) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const { categories, isLoading, error } = useServiceData();
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedServiceCount, setDisplayedServiceCount] = useState(
    INITIAL_DISPLAY_COUNT_CATEGORIES,
  );
  const [locale, setLocale] = useState<'en' | 'az' | 'ru'>('en');
  const [activeServiceTab, setActiveServiceTab] = useState('All');
  const [bookmarkedServices, setBookmarkedServices] = useState<string[]>([]);
  const [loadedPopularServiceCount, setLoadedPopularServiceCount] = useState(
    INITIAL_DISPLAY_COUNT_POPULAR,
  );
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [displayedPopularTabCount, setDisplayedPopularTabCount] = useState(
    INITIAL_DISPLAY_COUNT_POPULAR_TABS,
  );
  const [isLoadingMoreTabs, setIsLoadingMoreTabs] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const currentPlaceholderIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const isTypingRef = useRef(true);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const placeholderTexts = [
    t('searchPlaceholder_cleaning', 'Search for cleaning services...'),
    t('searchPlaceholder_repair', 'Find repair experts...'),
    t('searchPlaceholder_beauty', 'Discover beauty salons...'),
  ];
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState('');
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetweenPhrases = 1500;
  useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    },
  }));
  const getCategoryTranslation = useCallback(
    (categoryName: string) => {
      const key = categoryName.toLowerCase().replace(/\s+/g, '_');
      return t(key, categoryName);
    },
    [t],
  );

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

  const changeLanguage = useCallback(async (lng: 'en' | 'az' | 'ru') => {
    try {
      await i18n.changeLanguage(lng);
      await AsyncStorage.setItem('appLocale', lng);
      setLocale(lng);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  }, []);

  const startAnimation = useCallback(() => {
    const animate = () => {
      const fullText = placeholderTexts[currentPlaceholderIndexRef.current];

      if (isTypingRef.current) {
        if (charIndexRef.current < fullText.length) {
          setAnimatedPlaceholder(
            fullText.substring(0, charIndexRef.current + 1),
          );
          charIndexRef.current++;
          animationTimeoutRef.current = setTimeout(animate, typingSpeed);
        } else {
          isTypingRef.current = false;
          animationTimeoutRef.current = setTimeout(
            animate,
            delayBetweenPhrases,
          );
        }
      } else {
        if (charIndexRef.current > 0) {
          setAnimatedPlaceholder(
            fullText.substring(0, charIndexRef.current - 1),
          );
          charIndexRef.current--;
          animationTimeoutRef.current = setTimeout(animate, deletingSpeed);
        } else {
          isTypingRef.current = true;
          currentPlaceholderIndexRef.current =
            (currentPlaceholderIndexRef.current + 1) % placeholderTexts.length;
          animationTimeoutRef.current = setTimeout(animate, typingSpeed);
        }
      }
    };

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    animate();
  }, [placeholderTexts, typingSpeed, deletingSpeed, delayBetweenPhrases]);
  useEffect(() => {
    const loadInitialData = async () => {
      if (isFocused) {
        await loadBookmarks();
        try {
          const savedLocale = await AsyncStorage.getItem('appLocale');
          if (
            savedLocale &&
            (savedLocale === 'en' ||
              savedLocale === 'az' ||
              savedLocale === 'ru')
          ) {
            setLocale(savedLocale);
            await i18n.changeLanguage(savedLocale);
          }
        } catch (error) {
          console.error('Failed to load locale from storage', error);
        }
      }
    };
    loadInitialData();
  }, [isFocused, loadBookmarks]);

  useEffect(() => {
    if (!searchQuery) {
      startAnimation();
    } else {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      setAnimatedPlaceholder('');
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [searchQuery, startAnimation]);

  useEffect(() => {
    if (categories.length > 0 && activeServiceTab === 'All') {
      setActiveServiceTab(t('all'));
    }
  }, [categories, activeServiceTab, t]);

  const servicesForGrid = categories.map(cat => ({
    id: cat.id,
    name: getCategoryTranslation(cat.name),
    icon: cat.icon,
    color: cat.color,
    iconFamily: cat.iconFamily,
  }));

  const displayedCategoryServices = servicesForGrid.slice(
    0,
    displayedServiceCount,
  );
  const showMoreCategoriesButton =
    displayedServiceCount < servicesForGrid.length;
  const showLessCategoriesButton =
    displayedServiceCount === servicesForGrid.length &&
    servicesForGrid.length > INITIAL_DISPLAY_COUNT_CATEGORIES;

  if (showMoreCategoriesButton) {
    displayedCategoryServices.push({
      id: MORE_BUTTON_ID,
      name: t('more'),
      icon: 'ellipsis-horizontal',
      color: '#8B5CF6',
      iconFamily: 'Ionicons',
    });
  } else if (showLessCategoriesButton) {
    displayedCategoryServices.push({
      id: MORE_BUTTON_ID,
      name: t('less'),
      icon: 'chevron-up',
      color: '#8B5CF6',
      iconFamily: 'Ionicons',
    });
  }

  const allPopularServices: BookmarkedServiceWithTyping[] = categories.flatMap(
    category =>
      category.services.map((service: ServiceItem) => ({
        id: service.id,
        providerName: service.exampleProviderName || 'Unknown Provider',
        serviceName: service.name,
        price: service.price,
        rating: service.rating,
        reviews: service.reviews,
        image: service.heroImage || '/placeholder.svg?height=300&width=400',
        backgroundColor: category.color,
        category: getCategoryTranslation(category.name),
        type: 'service', // Explicitly set type
      })),
  );

  const allServiceCategoriesTabs = [
    t('all'),
    ...new Set(categories.map(cat => getCategoryTranslation(cat.name))),
  ];
  const displayedServiceCategoriesTabs = allServiceCategoriesTabs.slice(
    0,
    displayedPopularTabCount,
  );
  const showMoreTabsButton =
    displayedPopularTabCount < allServiceCategoriesTabs.length;

  if (showMoreTabsButton) {
    displayedServiceCategoriesTabs.push(t('more'));
  }

  const getFilteredPopularServices = useCallback(() => {
    const allTabTranslation = t('all');
    let servicesToFilter = allPopularServices;
    if (activeServiceTab !== allTabTranslation) {
      servicesToFilter = allPopularServices.filter(
        service => service.category === activeServiceTab,
      );
    }
    return servicesToFilter.slice(0, loadedPopularServiceCount); // Slice here as banners are removed
  }, [activeServiceTab, allPopularServices, loadedPopularServiceCount, t]);

  const handleSearch = useCallback(() => {
    navigation.navigate('Search', { query: searchQuery });
  }, [navigation, searchQuery]);

  const handleServicePress = useCallback(
    (item: { id: string; name: string; color: string }) => {
      if (item.id === MORE_BUTTON_ID) {
        if (displayedServiceCount < servicesForGrid.length) {
          setDisplayedServiceCount(servicesForGrid.length);
        } else {
          setDisplayedServiceCount(INITIAL_DISPLAY_COUNT_CATEGORIES);
        }
      } else {
        navigation.navigate('ServiceListByCategory', {
          categoryId: item.id,
          categoryName: item.name,
        });
      }
    },
    [displayedServiceCount, servicesForGrid.length, navigation],
  );

  const handlePopularServicePress = useCallback(
    (item: BookmarkedService) => {
      navigation.navigate('ServiceDetail', {
        serviceId: item.id,
        categoryId:
          categories.find(
            cat => getCategoryTranslation(cat.name) === item.category,
          )?.id || item.category,
        serviceName: item.serviceName,
      });
    },
    [navigation, categories, getCategoryTranslation],
  );

  const handleToggleBookmark = useCallback(
    async (service: BookmarkedService) => {
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
    },
    [bookmarkedServices, saveBookmarks],
  );

  const handleSeeAllServices = useCallback(() => {
    navigation.navigate('AllServices');
  }, [navigation]);

  const handleSeeAllPopular = useCallback(() => {
    navigation.navigate('MostPopularServices');
  }, [navigation]);

  const handleNotificationPress = useCallback(() => {
    navigation.navigate('Notification');
  }, [navigation]);

  const handleBookmarkPress = useCallback(() => {
    navigation.navigate('Bookmark');
  }, [navigation]);

  const handleFilterPress = useCallback(() => {
    navigation.navigate('Filter');
  }, [navigation]);

  const handleLoadMorePopularServices = useCallback(async () => {
    const totalFilteredServices = allPopularServices.filter(service =>
      activeServiceTab === t('all')
        ? true
        : service.category === activeServiceTab,
    ).length;
    if (isLoadingMore || loadedPopularServiceCount >= totalFilteredServices) {
      return;
    }
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoadedPopularServiceCount(prevCount =>
      Math.min(prevCount + LOAD_BATCH_SIZE, totalFilteredServices),
    );
    setIsLoadingMore(false);
  }, [
    isLoadingMore,
    loadedPopularServiceCount,
    activeServiceTab,
    allPopularServices,
    t,
  ]);

  const handleLoadMorePopularTabs = useCallback(async () => {
    if (isLoadingMoreTabs) {
      return;
    }
    setIsLoadingMoreTabs(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setDisplayedPopularTabCount(prevCount =>
      Math.min(
        prevCount + LOAD_MORE_TABS_BATCH_SIZE,
        allServiceCategoriesTabs.length,
      ),
    );
    setIsLoadingMoreTabs(false);
  }, [isLoadingMoreTabs, allServiceCategoriesTabs.length]);

  const handleMainScroll = useCallback(
    (event: any) => {
      onScroll(event);
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - SCROLL_THRESHOLD_FOR_LOAD;
      const totalFilteredServices = allPopularServices.filter(service =>
        activeServiceTab === t('all')
          ? true
          : service.category === activeServiceTab,
      ).length;
      if (
        isCloseToBottom &&
        !isLoadingMore &&
        loadedPopularServiceCount < totalFilteredServices
      ) {
        handleLoadMorePopularServices();
      }
    },
    [
      onScroll,
      allPopularServices,
      activeServiceTab,
      t,
      isLoadingMore,
      loadedPopularServiceCount,
      handleLoadMorePopularServices,
    ],
  );

  const handleRetry = useCallback(() => {}, []);

  const renderServiceItem = useCallback(
    ({ item }: { item: Service }) => (
      <Pressable
        style={styles.serviceItem}
        onPress={() => handleServicePress(item)}
      >
        <View style={[styles.serviceIcon, { backgroundColor: item.color }]}>
          {item.iconFamily === 'Ionicons' ? (
            <Icon
              name={item.icon}
              size={responsiveFontSize(30)}
              color="#FFFFFF"
            />
          ) : (
            <MaterialIcons
              name={item.icon}
              size={responsiveFontSize(30)}
              color="#FFFFFF"
            />
          )}
        </View>
        <Text style={styles.serviceName}>{item.name}</Text>
      </Pressable>
    ),
    [handleServicePress],
  );

  const renderPopularServiceItem = useCallback(
    ({ item }: { item: BookmarkedServiceWithTyping }) => {
      const isBookmarked = bookmarkedServices.includes(item.id);
      return (
        <Pressable
          style={styles.popularServiceItem}
          onPress={() => handlePopularServicePress(item)}
        >
          <View
            style={[
              styles.popularServiceImage,
              { backgroundColor: item.backgroundColor },
            ]}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.serviceProviderImage}
            />
          </View>
          <View style={styles.popularServiceInfo}>
            <Text style={styles.providerName}>{item.providerName}</Text>
            <Text style={styles.popularServiceName}>{item.serviceName}</Text>
            <Text style={styles.servicePrice}>
              {item.price.toFixed(2)} {t('currency')}
            </Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={responsiveFontSize(16)} color="#FFD700" />
              <Text style={styles.rating}>{item.rating}</Text>
              <Text style={styles.reviews}>
                ({item.reviews} {t('reviews')})
              </Text>
            </View>
          </View>
          <Pressable
            style={styles.bookmarkButton}
            onPress={() => handleToggleBookmark(item)}
          >
            <Icon
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={responsiveFontSize(24)}
              color="#FFFFFF"
            />
          </Pressable>
        </Pressable>
      );
    },
    [bookmarkedServices, handlePopularServicePress, handleToggleBookmark, t],
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>
          {t('loading', 'Loading services...')}
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {t('error', 'Error')}: {error}
        </Text>
        <Pressable style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>{t('retry', 'Retry')}</Text>
        </Pressable>
      </SafeAreaView>
    );
  }
  const knyaz = '../../Assets/images/knyaz.png';

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={handleMainScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: responsiveHeight(12) }}
      >
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri: knyaz,
              }}
              style={styles.profileImage}
            />
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Emil</Text>
              <Text style={styles.userName}>Hesenov</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              style={styles.headerButton}
              onPress={handleNotificationPress}
            >
              <Icon
                name="notifications-outline"
                size={responsiveFontSize(24)}
                color="#FFFFFF"
              />
            </Pressable>
            <Pressable
              style={styles.headerButton}
              onPress={handleBookmarkPress}
            >
              <Icon
                name="bookmark-outline"
                size={responsiveFontSize(24)}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon
              name="search-outline"
              size={responsiveFontSize(20)}
              color="rgba(255, 255, 255, 0.5)"
            />
            <TextInput
              style={styles.searchInput}
              placeholder={searchQuery || animatedPlaceholder}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>
          <Pressable style={styles.filterButton} onPress={handleFilterPress}>
            <Icon
              name="options-outline"
              size={responsiveFontSize(24)}
              color="#FFFFFF"
            />
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('services')}</Text>
            <Pressable onPress={handleSeeAllServices}>
              <Text style={styles.seeAllText}>{t('seeAll')}</Text>
            </Pressable>
          </View>
          <FlatList
            data={displayedCategoryServices}
            renderItem={renderServiceItem}
            keyExtractor={item => item.id}
            numColumns={NUM_COLUMNS_CATEGORIES}
            scrollEnabled={false}
            contentContainerStyle={styles.servicesGrid}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('mostPopularServices')}</Text>
            <Pressable onPress={handleSeeAllPopular}>
              <Text style={styles.seeAllText}>{t('seeAll')}</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularServiceTabs}
          >
            {displayedServiceCategoriesTabs.map(category => (
              <Pressable
                key={category}
                style={[
                  styles.tab,
                  (activeServiceTab === category ||
                    (category === t('more') && isLoadingMoreTabs)) &&
                    styles.activeTab,
                ]}
                onPress={() => {
                  if (category === t('more')) {
                    handleLoadMorePopularTabs();
                  } else {
                    setActiveServiceTab(category);
                  }
                }}
                disabled={
                  isLoadingMoreTabs ||
                  (category === t('more') && !showMoreTabsButton)
                }
              >
                {isLoadingMoreTabs && category === t('more') ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text
                    style={[
                      styles.tabText,
                      activeServiceTab === category && styles.activeTabText,
                    ]}
                  >
                    {category}
                  </Text>
                )}
              </Pressable>
            ))}
          </ScrollView>
          <FlatList
            data={getFilteredPopularServices()}
            renderItem={renderPopularServiceItem}
            keyExtractor={item => item.id} 
            scrollEnabled={false}
            contentContainerStyle={styles.popularServicesList}
            numColumns={2} 
          />
          {isLoadingMore && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color="#8B5CF6" />
              <Text style={styles.loadingMoreText}>{t('loadingMore')}</Text>
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
});

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
    borderRadius: 12,
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(5),
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(16),
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    marginTop: responsiveHeight(6),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(3),
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: responsiveFontSize(50),
    height: responsiveFontSize(50),
    borderRadius: responsiveFontSize(25),
    marginRight: responsiveWidth(3),
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  greetingContainer: {
    flex: 1,
    // justifyContent: 'center',.
    // alignItems:"center",
    gap:5,
    flexDirection:"row"
  },
  greeting: {
    fontSize: responsiveFontSize(17),
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: responsiveHeight(0.2),
  },
  userName: {
    fontSize: responsiveFontSize(17),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: responsiveFontSize(40),
    height: responsiveFontSize(40),
    borderRadius: responsiveFontSize(20),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: responsiveWidth(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(5),
    marginBottom: responsiveHeight(3),
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: responsiveFontSize(12),
    paddingHorizontal: responsiveWidth(4),
    marginRight: responsiveWidth(3),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
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
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  section: {
    marginBottom: responsiveHeight(3),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    marginBottom: responsiveHeight(2),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(20),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: responsiveFontSize(16),
    color: '#8B5CF6',
    fontWeight: '600',
  },
  servicesGrid: {
    paddingHorizontal: responsiveWidth(5),
  },
  serviceItem: {
    flex: 1,
    alignItems: 'center',
    marginBottom: responsiveHeight(2.5),
    marginHorizontal: responsiveWidth(1.5),
  },
  serviceIcon: {
    width: responsiveFontSize(60),
    height: responsiveFontSize(60),
    borderRadius: responsiveFontSize(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  serviceName: {
    fontSize: responsiveFontSize(14),
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  popularServiceTabs: {
    paddingHorizontal: responsiveWidth(5),
    marginBottom: responsiveHeight(2.5),
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1),
    borderRadius: responsiveFontSize(20),
    marginRight: responsiveWidth(3),
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  tabText: {
    fontSize: responsiveFontSize(14),
    color: 'rgba(139, 92, 246, 0.8)',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  popularServicesList: {
    paddingHorizontal: responsiveWidth(3),
    justifyContent: 'space-between',
  },
  popularServiceItem: {
    flexDirection: 'column',
    backgroundColor: '#1A1A1A',
    borderRadius: responsiveFontSize(16),
    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(2),
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    width: responsiveWidth(44),
    marginHorizontal: responsiveWidth(2),
  },
  popularServiceImage: {
    width: '100%',
    height: responsiveHeight(15),
    borderRadius: responsiveFontSize(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(1.5),
    overflow: 'hidden',
  },
  serviceProviderImage: {
    width: '100%',
    height: '100%',
    borderRadius: responsiveFontSize(12),
  },
  popularServiceInfo: {
    flex: 1,
    width: '100%',
  },
  providerName: {
    fontSize: responsiveFontSize(14),
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: responsiveHeight(0.5),
  },
  popularServiceName: {
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
    position: 'absolute',
    top: responsiveHeight(2),
    right: responsiveWidth(2),
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: responsiveHeight(2),
    marginTop: responsiveHeight(1),
  },
  loadingMoreText: {
    color: '#FFFFFF',
    fontSize: responsiveFontSize(16),
    marginLeft: responsiveWidth(2),
  },
});

export default Home;
