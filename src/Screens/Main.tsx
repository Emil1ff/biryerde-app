'use client';
import type React from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  BackHandler,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import PagerView from 'react-native-pager-view';
import Home, { type HomeRef } from './Main/Home';
import Booking, { type BookingRef } from './Main/Booking';
import Inbox, { type InboxRef } from './Main/Inbox';
import Calendar, { type CalendarRef } from './Main/Calendar';
import Profile, { type ProfileRef } from './Main/Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const responsiveWidth = (percentage: number) =>
  (screenWidth * percentage) / 100;
const responsiveHeight = (percentage: number) =>
  (screenHeight * percentage) / 100;
const responsiveFontSize = (size: number) => size * (screenWidth / 375);

const TAB_BAR_HEIGHT = responsiveHeight(8);
const COMPACT_ICON_SIZE = responsiveFontSize(50);
const SCROLL_THRESHOLD = 10;

interface TabIconProps {
  iconName: string;
  label: string;
  focused: boolean;
  onPress: () => void;
}

const TabIcon: React.FC<TabIconProps> = ({
  iconName,
  label,
  focused,
  onPress,
}) => {
  const indicatorOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(indicatorOpacity, {
      toValue: focused ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [focused, indicatorOpacity]);

  const iconColor = focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)';

  return (
    <Pressable style={styles.tabButton} onPress={onPress}>
      <View style={styles.tabIconWrapper}>
        <Icon name={iconName} size={responsiveFontSize(26)} color={iconColor} />
      </View>

      <Animated.View
        style={[styles.tabIndicator, { opacity: indicatorOpacity }]}
      />
    </Pressable>
  );
};

interface TabBarProps {
  routes: { key: string; title: string; component: React.ComponentType<any> }[];
  activeTabIndex: number;
  onTabPress: (index: number) => void;
  tabBarTranslateY: Animated.Value;
  tabBarScale: Animated.Value;
  tabBarOpacity: Animated.Value;
}

const TabBar: React.FC<TabBarProps> = ({
  routes,
  activeTabIndex,
  onTabPress,
  tabBarTranslateY,
  tabBarScale,
  tabBarOpacity,
}) => {
  return (
    <Animated.View
      style={[
        styles.tabBarContainer,
        {
          transform: [{ translateY: tabBarTranslateY }, { scale: tabBarScale }],
          opacity: tabBarOpacity,
        },
      ]}
    >
      <LinearGradient
        colors={['#1A1A1A', '#0A0A0A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.tabBarGradient}
      >
        {routes.map((route: any, index: number) => {
          const label = route.title;
          const isFocused = activeTabIndex === index;
          const onPress = () => {
            onTabPress(index);
          };
          let iconName = '';
          switch (route.key) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Bookings':
              iconName = 'receipt';
              break;
            case 'Calendar':
              iconName = 'calendar';
              break;
            case 'Inbox':
              iconName = 'chatbox-ellipses';
              break;
            case 'Profile':
              iconName = 'person';
              break;
          }
          return (
            <TabIcon
              key={index}
              iconName={iconName}
              label={label}
              focused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </LinearGradient>
    </Animated.View>
  );
};

const Main: React.FC = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const tabBarTranslateY = useRef(new Animated.Value(0)).current;
  const tabBarScale = useRef(new Animated.Value(1)).current;
  const tabBarOpacity = useRef(new Animated.Value(1)).current;
  const compactIconTranslateX = useRef(
    new Animated.Value(-COMPACT_ICON_SIZE - responsiveWidth(5)),
  ).current;
  const compactIconOpacity = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const isTabBarVisible = useRef(true);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [locale, setLocale] = useState<'en' | 'az' | 'ru'>('en');
  const { t } = useTranslation();

  const homeRef = useRef<HomeRef>(null);
  const bookingRef = useRef<BookingRef>(null);
  const calendarRef = useRef<CalendarRef>(null);
  const inboxRef = useRef<InboxRef>(null);
  const profileRef = useRef<ProfileRef>(null);

  const pageRefs = useRef([
    homeRef,
    bookingRef,
    calendarRef,
    inboxRef,
    profileRef,
  ]);

  const animateTabBar = useCallback(
    (mode: 'compact' | 'expand') => {
      if (mode === 'compact' && !isCompactMode) {
        Animated.parallel([
          Animated.timing(tabBarTranslateY, {
            toValue: TAB_BAR_HEIGHT + responsiveHeight(2),
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(tabBarScale, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(tabBarOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(compactIconTranslateX, {
            toValue: responsiveWidth(5),
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(compactIconOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsCompactMode(true);
          isTabBarVisible.current = false;
        });
      } else if (mode === 'expand' && isCompactMode) {
        Animated.parallel([
          Animated.timing(tabBarTranslateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(tabBarScale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(tabBarOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(compactIconTranslateX, {
            toValue: -COMPACT_ICON_SIZE - responsiveWidth(5),
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(compactIconOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsCompactMode(false);
          isTabBarVisible.current = true;
        });
      }
    },
    [
      isCompactMode,
      tabBarTranslateY,
      tabBarScale,
      tabBarOpacity,
      compactIconTranslateX,
      compactIconOpacity,
    ],
  );

  const handleTabPress = (index: number) => {
    setActiveTabIndex(index);
    if (isCompactMode) {
      animateTabBar('expand');
    }
    pageRefs.current[index]?.current?.scrollToTop();
  };

  const handlePageSelected = (e: any) => {
    setActiveTabIndex(e.nativeEvent.position);
  };

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;
    if (scrollDiff > SCROLL_THRESHOLD && isTabBarVisible.current) {
      animateTabBar('compact');
    } else if (scrollDiff < -SCROLL_THRESHOLD && !isTabBarVisible.current) {
      animateTabBar('expand');
    }
    lastScrollY.current = currentScrollY;
  };

  const routes = [
    { key: 'Home', title: t('home'), component: Home },
    { key: 'Bookings', title: t('bookings'), component: Booking },
    { key: 'Calendar', title: t('calendar'), component: Calendar },
    { key: 'Inbox', title: t('inbox'), component: Inbox },
    { key: 'Profile', title: t('profile'), component: Profile },
  ];

  const getIconNameForIndex = (index: number) => {
    const routeName = routes[index]?.key;
    switch (routeName) {
      case 'Home':
        return 'home';
      case 'Bookings':
        return 'receipt';
      case 'Calendar':
        return 'calendar';
      case 'Inbox':
        return 'chatbox-ellipses';
      case 'Profile':
        return 'person';
      default:
        return 'home';
    }
  };

  useEffect(() => {
    const loadLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem('appLocale');
        if (
          savedLocale &&
          (savedLocale === 'en' || savedLocale === 'az' || savedLocale === 'ru')
        ) {
          setLocale(savedLocale);
          await i18n.changeLanguage(savedLocale);
        }
      } catch (error) {
        console.error('Failed to load locale from storage', error);
      }
    };
    loadLocale();
  }, []);

  useEffect(() => {
    if (pagerRef.current && pagerRef.current.setPage) {
      pagerRef.current.setPage(activeTabIndex);
    }
  }, [activeTabIndex]);

  useEffect(() => {
    const backAction = () => {
      if (isCompactMode) {
        animateTabBar('expand');
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [isCompactMode, animateTabBar]);

  const refs = {
    home: useRef(null),
    booking: useRef(null),
    calendar: useRef(null),
    inbox: useRef(null),
    profile: useRef(null),
    compactIconButton: useRef(null),
  };

  const compactIconButtonRef = useRef<View>(null);

  return (
    <View style={{ flex: 1 }}>
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={activeTabIndex}
        onPageSelected={handlePageSelected}
        scrollEnabled={true}
      >
        <View key="Home" style={{ flex: 1 }}>
          <Home ref={homeRef} onScroll={handleScroll} />
        </View>
        <View key="Bookings" style={{ flex: 1 }}>
          <Booking ref={bookingRef} onScroll={handleScroll} />
        </View>
        <View key="Calendar" style={{ flex: 1 }}>
          <Calendar ref={calendarRef} onScroll={handleScroll} />
        </View>
        <View key="Inbox" style={{ flex: 1 }}>
          <Inbox ref={inboxRef} onScroll={handleScroll} />
        </View>
        <View key="Profile" style={{ flex: 1 }}>
          <Profile ref={profileRef} onScroll={handleScroll} />
        </View>
      </PagerView>

      <TabBar
        routes={routes}
        activeTabIndex={activeTabIndex}
        onTabPress={handleTabPress}
        tabBarTranslateY={tabBarTranslateY}
        tabBarScale={tabBarScale}
        tabBarOpacity={tabBarOpacity}
      />

      <Animated.View
        ref={compactIconButtonRef}
        style={[
          styles.compactIconContainer,
          {
            transform: [{ translateX: compactIconTranslateX }],
            opacity: compactIconOpacity,
          },
        ]}
      >
        <Pressable
          style={styles.compactIconButton}
          onPress={() => animateTabBar('expand')}
        >
          <LinearGradient
            colors={['#8B5CF6', '#A855F7', '#D946EF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.compactIconGradient}
          >
            <Icon
              name={getIconNameForIndex(activeTabIndex)}
              size={responsiveFontSize(28)}
              color="#FFFFFF"
            />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  tabBarContainer: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    position: 'absolute',
    bottom: responsiveHeight(3),
    left: responsiveWidth(5),
    right: responsiveWidth(5),
    borderRadius: responsiveWidth(8),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 15,
    // backgroundColor: "red",
  },
  tabBarGradient: {
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    paddingBottom: responsiveHeight(1),
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: responsiveHeight(1),
  },
  tabIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: responsiveHeight(0.5),
  },
  tabLabel: {
    fontSize: responsiveFontSize(12),
    fontWeight: '600',
    marginTop: responsiveHeight(0.2),
  },
  activeTabLabel: {
    color: '#FFFFFF',
  },
  inactiveTabLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  tabIndicator: {
    position: 'absolute',
    height: responsiveHeight(0.5),
    width: responsiveWidth(8),
    backgroundColor: '#8B5CF6',
    bottom: responsiveHeight(0.5),
    borderRadius: responsiveHeight(0.25),
  },
  compactIconContainer: {
    position: 'absolute',
    bottom: responsiveHeight(4),
    left: 0,
    width: COMPACT_ICON_SIZE + responsiveWidth(5),
    height: COMPACT_ICON_SIZE + responsiveHeight(1),
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: responsiveWidth(3),
  },
  compactIconButton: {
    width: COMPACT_ICON_SIZE,
    height: COMPACT_ICON_SIZE,
    borderRadius: COMPACT_ICON_SIZE / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  compactIconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: COMPACT_ICON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Main;
