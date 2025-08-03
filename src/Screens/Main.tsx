import React, { useEffect, useRef, useState } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  BackHandler,
  Platform,
  UIManager,
  Text, 
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import PagerView from "react-native-pager-view"
import Home from "./Main/Home"
import Booking from "./Main/Booking"
import Inbox from "./Main/Inbox"
import Calendar from "./Main/Calendar"
import EditProfile from "./Sub/Profile/EditProfile"
import Profile from "./Main/Profile"


if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
const TAB_BAR_HEIGHT = 90
const COMPACT_ICON_SIZE = 60
const SCROLL_THRESHOLD = 10

export type BottomTabParamList = {
  Home: undefined
  Bookings: undefined
  Calendar: undefined
  Inbox: undefined
  Profile: undefined
}

interface TabIconProps {
  iconName: string
  label: string
  focused: boolean
  onPress: () => void
}

const TabIcon: React.FC<TabIconProps> = ({ iconName, label, focused, onPress }) => {
  const indicatorOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(indicatorOpacity, {
      toValue: focused ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [focused, indicatorOpacity])

  const iconColor = focused ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)"

  return (
    <TouchableOpacity style={styles.tabButton} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.tabIconWrapper}>
        {focused ? (
          <LinearGradient
            colors={["#ffffff2c", "#00000074", "#000000ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.activeTabIcon}
          >
            <Icon name={iconName} size={28} color="#FFFFFF" />
          </LinearGradient>
        ) : (
          <View style={styles.inactiveTabIcon}>
            <Icon name={iconName} size={26} color={iconColor} />
          </View>
        )}
      </View>
      <Text
        style={[
          styles.tabLabel,
          focused ? styles.activeTabLabel : styles.inactiveTabLabel,
          { opacity: focused ? 1 : 0.7 },
        ]}
      >
        {label}
      </Text>
      <Animated.View style={[styles.tabIndicator, { opacity: indicatorOpacity }]} />
    </TouchableOpacity>
  )
}

interface TabBarProps {
  routes: { key: string; title: string; component: React.ComponentType<any> }[]
  activeTabIndex: number
  onTabPress: (index: number) => void
  tabBarTranslateY: Animated.Value
  tabBarScale: Animated.Value
  tabBarOpacity: Animated.Value
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
      <LinearGradient colors={["rgba(15, 15, 20, 0.9)", "#272727b2"]} style={styles.tabBarGradient}>
        {routes.map((route: any, index: number) => {
          const label = route.title 
          const isFocused = activeTabIndex === index
          const onPress = () => {
            onTabPress(index)
          }
          let iconName = ""
          switch (route.key) {
            case "Home":
              iconName = "home"
              break
            case "Bookings":
              iconName = "receipt"
              break
            case "Calendar":
              iconName = "calendar"
              break
            case "Inbox":
              iconName = "chatbox-ellipses"
              break
            case "Profile":
              iconName = "person"
              break
          }
          return <TabIcon key={index} iconName={iconName} label={label} focused={isFocused} onPress={onPress} />
        })}
      </LinearGradient>
    </Animated.View>
  )
}

const Main: React.FC = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const pagerRef = useRef<PagerView>(null)
  const tabBarTranslateY = useRef(new Animated.Value(0)).current 
  const tabBarScale = useRef(new Animated.Value(1)).current 
  const tabBarOpacity = useRef(new Animated.Value(1)).current 
  const compactIconTranslateX = useRef(new Animated.Value(-COMPACT_ICON_SIZE - 20)).current 
  const compactIconOpacity = useRef(new Animated.Value(0)).current 
  const lastScrollY = useRef(0)
  const isTabBarVisible = useRef(true) 
  const [isCompactMode, setIsCompactMode] = useState(false) 

  useEffect(() => {
    if (pagerRef.current && pagerRef.current.setPage) {
      pagerRef.current.setPage(activeTabIndex)
    }
  }, [activeTabIndex])

  // For Android back button
  useEffect(() => {
    const backAction = () => {
      if (isCompactMode) {
        animateTabBar("expand")
        return true // Event handled
      }
      return false // Allow default back button behavior
    }
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
    return () => backHandler.remove()
  }, [isCompactMode])

  const getIconNameForIndex = (index: number) => {
    const routeName = routes[index]?.key
    switch (routeName) {
      case "Home":
        return "home"
      case "Bookings":
        return "receipt"
      case "Calendar":
        return "calendar"
      case "Inbox":
        return "chatbox-ellipses"
      case "Profile":
        return "person"
      default:
        return "home"
    }
  }

  const animateTabBar = (mode: "compact" | "expand") => {
    if (mode === "compact" && !isCompactMode) {
      Animated.parallel([
        Animated.timing(tabBarTranslateY, {
          toValue: TAB_BAR_HEIGHT, 
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
          toValue: 20, 
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(compactIconOpacity, {
          toValue: 1, 
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsCompactMode(true)
        isTabBarVisible.current = false
      })
    } else if (mode === "expand" && isCompactMode) {
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
          toValue: -COMPACT_ICON_SIZE - 20, 
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(compactIconOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsCompactMode(false)
        isTabBarVisible.current = true
      })
    }
  }

  const handleTabPress = (index: number) => {
    setActiveTabIndex(index)
    if (isCompactMode) {
      animateTabBar("expand") 
    }
  }

  const handlePageSelected = (e: any) => {
    setActiveTabIndex(e.nativeEvent.position)
  }

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y
    const scrollDiff = currentScrollY - lastScrollY.current
    if (scrollDiff > SCROLL_THRESHOLD && isTabBarVisible.current) {
      animateTabBar("compact")
    } else if (scrollDiff < -SCROLL_THRESHOLD && !isTabBarVisible.current) {
      animateTabBar("expand")
    }
    lastScrollY.current = currentScrollY
  }

  const routes = [
    { key: "Home", title: "Home", component: Home },
    { key: "Bookings", title: "Bookings", component: Booking },
    { key: "Calendar", title: "Calendar", component: Calendar },
    { key: "Inbox", title: "Inbox", component: Inbox },
    { key: "Profile", title: "Profile", component: Profile },
  ]

  return (
    <View style={{ flex: 1 }}>
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={activeTabIndex}
        onPageSelected={handlePageSelected}
        scrollEnabled={true} 
      >
        {routes.map((route) => (
          <View key={route.key} style={{ flex: 1 }}>
            <route.component onScroll={handleScroll} />
          </View>
        ))}
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
        style={[
          styles.compactIconContainer,
          {
            transform: [{ translateX: compactIconTranslateX }],
            opacity: compactIconOpacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.compactIconButton}
          activeOpacity={0.7}
          onPress={() => animateTabBar("expand")} 
        >
          <LinearGradient
            colors={["#8B5CF6", "#A855F7", "#D946EF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.compactIconGradient}
          >
            <Icon name={getIconNameForIndex(activeTabIndex)} size={28} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  tabBarContainer: {
    flexDirection: "row",
    height: TAB_BAR_HEIGHT,
    paddingBottom: 20,
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    
    overflow: "hidden",
  },
  tabBarGradient: {
    flexDirection: "row",
    height: "100%",
    width: "100%",
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  tabIconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  activeTabIcon: {
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: {
      width: 0,
      height: 6, 
    },
    shadowOpacity: 0.6, 
    shadowRadius: 12, 
    elevation: 10,
  },
  inactiveTabIcon: {
    width: 54, 
    height: 54, 
    borderRadius: 27, 
    justifyContent: "center",
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 13, 
    fontWeight: "600",
    marginTop: 2,
  },
  activeTabLabel: {
    color: "#D946EF",
  },
  inactiveTabLabel: {
    color: "rgba(255, 255, 255, 0.6)",
  },
  tabIndicator: {
    position: "absolute",
    height: 4,
    width: 20, 
    backgroundColor: "#D946EF",
    bottom: -5,
    borderRadius: 8,
  },
  compactIconContainer: {
    position: "absolute",
    bottom: 30, 
    left: 0,
    width: COMPACT_ICON_SIZE + 30,
    height: COMPACT_ICON_SIZE + 10, 
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 15, 
  },
  compactIconButton: {
    width: COMPACT_ICON_SIZE,
    height: COMPACT_ICON_SIZE,
    borderRadius: COMPACT_ICON_SIZE / 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  compactIconGradient: {
    width: "100%",
    height: "100%",
    borderRadius: COMPACT_ICON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default Main