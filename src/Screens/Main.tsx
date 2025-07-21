"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  BackHandler,
  Platform,
  UIManager,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import PagerView from "react-native-pager-view"

import Home from "./Main/Home"
import Booking from "./Main/Booking"
import Calendar from "./Main/Calendar"
import Inbox from "./Main/Inbox"
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
  const scaleAnim = useRef(new Animated.Value(1)).current
  const opacityAnim = useRef(new Animated.Value(0.5)).current
  const indicatorOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2, 
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1, 
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(indicatorOpacity, {
          toValue: 1, 
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1, 
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.5, 
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(indicatorOpacity, {
          toValue: 0, 
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [focused, scaleAnim, opacityAnim, indicatorOpacity])

  const iconColor = focused ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)" 

  return (
    <TouchableOpacity style={styles.tabButton} activeOpacity={0.7} onPress={onPress}>
      <Animated.View
        style={[
          styles.tabIconWrapper, 
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {focused ? (
          <LinearGradient
            colors={["#8B5CF6", "#A855F7", "#D946EF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.activeTabIcon} 
          >
            <Icon name={iconName} size={28} color="#FFFFFF" /> 
          </LinearGradient>
        ) : (
          <Animated.View style={[styles.inactiveTabIcon, { opacity: opacityAnim }]}>
            <Icon name={iconName} size={26} color={iconColor} /> 
          </Animated.View>
        )}
      </Animated.View>

      <Animated.Text
        style={[
          styles.tabLabel,
          focused ? styles.activeTabLabel : styles.inactiveTabLabel,
          { opacity: focused ? 1 : 0.7 }, 
        ]}
      >
        {label}
      </Animated.Text>

      <Animated.View style={[styles.tabIndicator, { opacity: indicatorOpacity }]} />
    </TouchableOpacity>
  )
}

interface TabBarProps {
  state: any
  descriptors: any
  navigation: any
  activeTabIndex: number
  onTabPress: (index: number) => void
  tabBarTranslateY: Animated.Value 
  tabBarScale: Animated.Value 
  tabBarOpacity: Animated.Value 
}

const TabBar: React.FC<TabBarProps> = ({
  state,
  descriptors,
  navigation,
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
        {state.routes.map((route: any, index: number) => {
          const label = route.name
          const isFocused = activeTabIndex === index
          const onPress = () => {
            onTabPress(index)
          }
          let iconName = ""
          switch (route.name) {
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
  const tabBarTranslateY = useRef(new Animated.Value(0)).current // For bottom bar animation
  const tabBarScale = useRef(new Animated.Value(1)).current // New: Bottom bar scaling
  const tabBarOpacity = useRef(new Animated.Value(1)).current // New: Bottom bar opacity
  const compactIconTranslateX = useRef(new Animated.Value(-COMPACT_ICON_SIZE - 20)).current // New: Compact icon's starting position (off-screen)
  const compactIconOpacity = useRef(new Animated.Value(0)).current // New: Compact icon's opacity
  const lastScrollY = useRef(0)
  const isTabBarVisible = useRef(true) // Tracks if the bottom bar is fully visible
  const [isCompactMode, setIsCompactMode] = useState(false) // New: Tracks if in compact mode

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
      // Transition to compact mode
      Animated.parallel([
        Animated.timing(tabBarTranslateY, {
          toValue: TAB_BAR_HEIGHT, // Slide off-screen
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(tabBarScale, {
          toValue: 0.8, // Shrink slightly
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(tabBarOpacity, {
          toValue: 0, // Make fully transparent
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(compactIconTranslateX, {
          toValue: 20, // Bring into view
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(compactIconOpacity, {
          toValue: 1, // Make visible
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsCompactMode(true)
        isTabBarVisible.current = false
      })
    } else if (mode === "expand" && isCompactMode) {
      // Transition to expanded mode
      Animated.parallel([
        Animated.timing(tabBarTranslateY, {
          toValue: 0, // Slide into view
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(tabBarScale, {
          toValue: 1, // Return to original size
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(tabBarOpacity, {
          toValue: 1, // Make fully opaque
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(compactIconTranslateX, {
          toValue: -COMPACT_ICON_SIZE - 20, // Slide off-screen
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(compactIconOpacity, {
          toValue: 0, // Make transparent
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
      animateTabBar("expand") // Expand when a tab is pressed in compact mode
    }
  }

  const handlePageSelected = (e: any) => {
    setActiveTabIndex(e.nativeEvent.position)
  }

  // Function to handle scroll events
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y
    const scrollDiff = currentScrollY - lastScrollY.current

    if (scrollDiff > SCROLL_THRESHOLD && isTabBarVisible.current) {
      // Scrolling down and bar is visible, switch to compact mode
      animateTabBar("compact")
    } else if (scrollDiff < -SCROLL_THRESHOLD && !isTabBarVisible.current) {
      // Scrolling up and bar is in compact mode, expand
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
        scrollEnabled={true} // Enable swiping
      >
        {routes.map((route) => (
          <View key={route.key} style={{ flex: 1 }}>
            {/* Pass onScroll prop to each screen component */}
            <route.component onScroll={handleScroll} />
          </View>
        ))}
      </PagerView>

      {/* Custom TabBar */}
      <TabBar
        state={{ index: activeTabIndex, routes: routes }}
        descriptors={{}}
        navigation={{}}
        activeTabIndex={activeTabIndex}
        onTabPress={handleTabPress}
        tabBarTranslateY={tabBarTranslateY} // Pass animated value to TabBar
        tabBarScale={tabBarScale} // New: Scale value
        tabBarOpacity={tabBarOpacity} // New: Opacity value
      />

      {/* Compact Icon (Dynamic Island-like) */}
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
          onPress={() => animateTabBar("expand")} // Expand when clicked
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
    borderTopLeftRadius: 30, // Radius increased
    borderTopRightRadius: 30, // Radius increased
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -6, // More prominent shadow
    },
    shadowOpacity: 0.3, // Shadow opacity increased
    shadowRadius: 8, // Shadow radius increased
    elevation: 15, // Shadow for Android
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    // Background will be provided by LinearGradient, only overflow here
    overflow: "hidden", // Prevent content overflow
  },
  tabBarGradient: {
    flexDirection: "row",
    height: "100%",
    width: "100%",
    // Radii are applied to the container, not the gradient directly if overflow is hidden
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
    width: 60, // Size increased
    height: 60, // Size increased
    borderRadius: 30, // Proportional to size
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: {
      width: 0,
      height: 6, // More prominent shadow
    },
    shadowOpacity: 0.6, // Shadow opacity increased
    shadowRadius: 12, // Shadow radius increased
    elevation: 10,
  },
  inactiveTabIcon: {
    width: 54, // Size increased
    height: 54, // Size increased
    borderRadius: 27, // Proportional to size
    justifyContent: "center",
    alignItems: "center",
  },
  tabLabel: {
    fontSize: 13, // Font size increased
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
    height: 4, // Height increased
    width: 20, // Width increased
    backgroundColor: "#D946EF",
    bottom: -5,
    borderRadius: 8,
  },
  compactIconContainer: {
    position: "absolute",
    bottom: 30, // Slightly above the bottom bar
    left: 0,
    width: COMPACT_ICON_SIZE + 30, // Width for icon and spacing
    height: COMPACT_ICON_SIZE + 10, // Height for icon and spacing
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 15, // Left padding
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
