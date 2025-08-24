"use client"
import { useState, useRef, forwardRef, useImperativeHandle } from "react" 
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Switch,
  Animated,
  type ScrollView, 
  Dimensions, 
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import CustomAlert from "../../Components/CustomAlert"
import { StackNavigationProp } from "@react-navigation/stack"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (screenWidth * percentage) / 100
const responsiveHeight = (percentage: number) => (screenHeight * percentage) / 100
const responsiveFontSize = (size: number) => size * (screenWidth / 375)

type RootStackParamList = {
  Auth: undefined
  EditProfile: undefined
  NotificationSettings: undefined
  Payment: undefined
  Security: undefined
  Language: undefined
  PrivacyPolicy: undefined
  HelpCenterFAQ: undefined
  InviteFriends: undefined
  Wallet: undefined
  Rewards: undefined
  Achievements: undefined
  Analytics: undefined
}

interface ProfileOption {
  id: string
  title: string
  icon: string
  type: "navigation" | "switch" | "action"
  value?: boolean
  onPress?: () => void
  rightText?: string
}

interface ProfilePropsWithScroll {
  onScroll: (event: any) => void
}

export interface ProfileRef {
  scrollToTop: () => void
}

const Profile = forwardRef<ProfileRef, ProfilePropsWithScroll>(({ onScroll }, ref) => {
  const { t, i18n } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(true) 
  const [showAlert, setShowAlert] = useState(false) 
  const [alertTitle, setAlertTitle] = useState("")
  const [alertMessage, setAlertMessage] = useState("")
  const [alertButtons, setAlertButtons] = useState<any[]>([])

  const scrollViewRef = useRef<ScrollView>(null) 

  useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true })
    },
  }))

  const userInfo = {
    name: "Andrew Ainsley",
    email: "andrew_ainsley@yourdomain.com",
    profileImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg", // Using a placeholder image
    memberSince: "December 2023",
    completedBookings: 24,
    rating: 4.8,
  }

  const handleLogout = () => {
    setAlertTitle(t("logout"))
    setAlertMessage(t("logoutAlertMessage"))
    setAlertButtons([
      {
        text: t("cancelButton"),
        style: "cancel",
        onPress: () => setShowAlert(false),
      },
      {
        text: t("logout"),
        style: "destructive",
        onPress: confirmLogout,
      },
    ])
    setShowAlert(true)
  }

  const confirmLogout = () => {
    console.log("User logged out")
    navigation.reset({
      index: 0,
      routes: [{ name: "Auth" }],
    })
    setShowAlert(false)
  }

  const handleDarkModeToggle = () => {
    setAlertTitle(t("comingSoonTitle"))
    setAlertMessage(t("comingSoonMessage"))
    setAlertButtons([
      {
        text: t("ok"), // Use a generic "OK" translation
        onPress: () => setShowAlert(false),
      },
    ])
    setShowAlert(true)
  }

  const getCurrentLanguageDisplayName = () => {
    switch (i18n.language) {
      case "en":
        return t("language_en_display")
      case "az":
        return t("language_az_display")
      case "ru":
        return t("language_ru_display")
      default:
        return t("language_en_display") 
    }
  }

  const profileOptions: ProfileOption[] = [
    {
      id: "1",
      title: t("editProfile"),
      icon: "person-outline",
      type: "navigation",
      onPress: () => navigation.navigate("EditProfile"),
    },
    {
      id: "2",
      title: t("notification"),
      icon: "notifications-outline",
      type: "switch",
      value: notificationsEnabled,
      onPress: () => setNotificationsEnabled(!notificationsEnabled),
    },
    {
      id: "3",
      title: t("payment"),
      icon: "card-outline",
      type: "navigation",
      onPress: () => navigation.navigate("Payment"),
    },
    {
      id: "4",
      title: t("security"),
      icon: "shield-checkmark-outline",
      type: "navigation",
      onPress: () => navigation.navigate("Security"),
    },
    {
      id: "5",
      title: t("language"),
      icon: "language-outline",
      type: "navigation",
      rightText: getCurrentLanguageDisplayName(), 
      onPress: () => navigation.navigate("Language"),
    },
    {
      id: "6",
      title: t("darkMode"),
      icon: "eye-outline",
      type: "switch",
      value: darkModeEnabled, 
      onPress: handleDarkModeToggle, 
    },
    {
      id: "7",
      title: t("privacyPolicy"),
      icon: "lock-closed-outline",
      type: "navigation",
      onPress: () => navigation.navigate("PrivacyPolicy"),
    },
    {
      id: "8",
      title: t("helpCenter"),
      icon: "information-circle-outline",
      type: "navigation",
      onPress: () => navigation.navigate("HelpCenterFAQ"),
    },
    {
      id: "9",
      title: t("inviteFriends"),
      icon: "people-outline",
      type: "navigation",
      onPress: () => navigation.navigate("InviteFriends"),
    },
    {
      id: "10",
      title: t("logout"),
      icon: "log-out-outline",
      type: "action",
      onPress: () => handleLogout(),
    },
  ]

  const renderProfileOption = (option: ProfileOption) => (
    <TouchableOpacity
      key={option.id}
      style={[styles.optionItem, option.title === t("logout") && styles.logoutOption]}
      onPress={option.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionLeft}>
        <View style={[styles.optionIconContainer, option.title === t("logout") && styles.logoutIconContainer]}>
          <Icon
            name={option.icon}
            size={responsiveFontSize(22)}
            color={option.title === t("logout") ? "#F44336" : "#8B5CF6"}
          />
        </View>
        <Text style={[styles.optionTitle, option.title === t("logout") && styles.logoutTitle]}>{option.title}</Text>
      </View>
      <View style={styles.optionRight}>
        {option.type === "switch" ? (
          <Switch
            value={option.value}
            onValueChange={option.onPress} 
            trackColor={{ false: "#424242", true: "#8B5CF6" }}
            thumbColor={option.value ? "#FFFFFF" : "#E0E0E0"}
            ios_backgroundColor="#424242"
          />
        ) : (
          <>
            {option.rightText && <Text style={styles.optionRightText}>{option.rightText}</Text>}
            <Icon
              name="chevron-forward"
              size={responsiveFontSize(24)}
              color={option.title === t("logout") ? "#F44336" : "rgba(255, 255, 255, 0.5)"}
            />
          </>
        )}
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef} 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: responsiveHeight(12) }} 
      >
        <View style={styles.header}>
          <Text style={styles.title}>{t("profileTitle")}</Text>
        </View>
        <View style={styles.profileCard}>
          <LinearGradient
            colors={["#8B5CF6", "#00E5FF"]}
            style={styles.profileGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: userInfo.profileImage }} style={styles.profileImage} />
              <TouchableOpacity style={styles.editImageButton}>
                <Icon name="pencil-outline" size={responsiveFontSize(18)} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>{userInfo.name}</Text>
            <Text style={styles.profileEmail}>{userInfo.email}</Text>
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userInfo.completedBookings}</Text>
                <Text style={styles.statLabel}>{t("bookingsLabel")}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userInfo.rating}</Text>
                <Text style={styles.statLabel}>{t("ratingLabel")}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{t("yearsOfExperienceValue")}</Text>
                <Text style={styles.statLabel}>{t("yearsLabel")}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Wallet")}
          >
            <LinearGradient colors={["#4CAF50", "#8BC34A"]} style={styles.quickActionGradient}>
              <Icon name="wallet-outline" size={responsiveFontSize(28)} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.quickActionText}>{t("wallet")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Rewards")}
          >
            <LinearGradient colors={["#FFC107", "#FFEB3B"]} style={styles.quickActionGradient}>
              <Icon name="gift-outline" size={responsiveFontSize(28)} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.quickActionText}>{t("rewards")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Achievements")}
          >
            <LinearGradient colors={["#F44336", "#E57373"]} style={styles.quickActionGradient}>
              <Icon name="trophy-outline" size={responsiveFontSize(28)} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.quickActionText}>{t("achievements")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("Analytics")}
          >
            <LinearGradient colors={["#2196F3", "#64B5F6"]} style={styles.quickActionGradient}>
              <Icon name="bar-chart-outline" size={responsiveFontSize(28)} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.quickActionText}>{t("analytics")}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionsContainer}>{profileOptions.map(renderProfileOption)}</View>
        <View style={styles.appVersion}>
          <Text style={styles.versionText}>{t("appVersion", { version: "1.0.0" })}</Text>
        </View>
      </Animated.ScrollView>
      <CustomAlert
        isVisible={showAlert}
        title={alertTitle}
        message={alertMessage}
        buttons={alertButtons}
        onClose={() => setShowAlert(false)}
      />
    </SafeAreaView>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(5),
    marginTop: responsiveHeight(2.5),
    paddingBottom: responsiveHeight(1.8),
  },
  title: {
    fontSize: responsiveFontSize(28),
    fontWeight: "700",
    color: "#FFFFFF",
  },
  profileCard: {
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(2.5),
    marginBottom: responsiveHeight(3.8),
    borderRadius: responsiveFontSize(16),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: responsiveHeight(0.6) },
    shadowOpacity: 0.4,
    shadowRadius: responsiveFontSize(8),
    elevation: 12,
  },
  profileGradient: {
    padding: responsiveWidth(6),
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: responsiveHeight(2),
  },
  profileImage: {
    width: responsiveFontSize(110),
    height: responsiveFontSize(110),
    borderRadius: responsiveFontSize(55),
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: responsiveFontSize(36),
    height: responsiveFontSize(36),
    borderRadius: responsiveFontSize(18),
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileName: {
    fontSize: responsiveFontSize(26),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: responsiveHeight(0.5),
  },
  profileEmail: {
    fontSize: responsiveFontSize(15),
    color: "#CFD8DC",
    marginBottom: responsiveHeight(2.5),
  },
  profileStats: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: responsiveFontSize(10),
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(2.5),
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: responsiveWidth(3.8),
  },
  statNumber: {
    fontSize: responsiveFontSize(20),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: responsiveHeight(0.2),
  },
  statLabel: {
    fontSize: responsiveFontSize(13),
    color: "#E0E0E0",
  },
  statDivider: {
    width: 1,
    height: responsiveHeight(3.8),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: responsiveWidth(2.5),
    marginBottom: responsiveHeight(3.8),
  },
  quickActionItem: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: responsiveWidth(1.2),
  },
  quickActionGradient: {
    width: responsiveFontSize(64),
    height: responsiveFontSize(64),
    borderRadius: responsiveFontSize(32),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: responsiveHeight(1),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: responsiveHeight(0.3) },
    shadowOpacity: 0.25,
    shadowRadius: responsiveFontSize(4),
    elevation: 6,
  },
  quickActionText: {
    fontSize: responsiveFontSize(12),
    color: "#E0E0E0",
    fontWeight: "500",
    textAlign: "center",
  },
  optionsContainer: {
    paddingHorizontal: responsiveWidth(5),
    marginBottom: responsiveHeight(3.8),
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: responsiveFontSize(10),
    paddingVertical: responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(4),
    marginBottom: responsiveHeight(1.2),
  },
  logoutOption: {
    backgroundColor: "rgba(244, 67, 54, 0.1)",
    borderWidth: 1,
    borderColor: "#F44336",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIconContainer: {
    width: responsiveFontSize(40),
    height: responsiveFontSize(40),
    borderRadius: responsiveFontSize(20),
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsiveWidth(4),
  },
  logoutIconContainer: {
    backgroundColor: "rgba(244, 67, 54, 0.15)",
  },
  optionTitle: {
    fontSize: responsiveFontSize(16),
    fontWeight: "600",
    color: "#E0E0E0",
  },
  logoutTitle: {
    color: "#F44336",
  },
  optionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionRightText: {
    fontSize: responsiveFontSize(15),
    color: "rgba(255, 255, 255, 0.6)",
    marginRight: responsiveWidth(2),
  },
  appVersion: {
    alignItems: "center",
    paddingBottom: responsiveHeight(12), 
    marginTop: responsiveHeight(2.5),
  },
  versionText: {
    fontSize: responsiveFontSize(13),
    color: "#757575",
  },
})

export default Profile
