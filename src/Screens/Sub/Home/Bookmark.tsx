"use client"
import { useState, useEffect, useCallback } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Dimensions } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { useIsFocused } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useTranslation } from "react-i18next"
import type { BookmarkedService } from "../../Types/data"
import CustomAlert from "../../../Components/CustomAlert"

const { width, height } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (width * percentage) / 100
const responsiveHeight = (percentage: number) => (height * percentage) / 100
const responsiveFontSize = (size: number) => size * (width / 375)

const Bookmark = ({ navigation }: any) => {
  const isFocused = useIsFocused()
  const { t, i18n } = useTranslation()
  const [locale, setLocale] = useState<"en" | "az" | "ru">("en")
  const [activeTab, setActiveTab] = useState(t("all")) 
  const [bookmarkedServices, setBookmarkedServices] = useState<BookmarkedService[]>([])

  const [isAlertVisible, setIsAlertVisible] = useState(false)
  const [alertTitle, setAlertTitle] = useState("")
  const [alertMessage, setAlertMessage] = useState("")
  const [alertButtons, setAlertButtons] = useState<any[]>([])

  const loadBookmarks = useCallback(async () => {
    try {
      const savedBookmarks = await AsyncStorage.getItem("bookmarkedServices")
      if (savedBookmarks) {
        const parsedBookmarks: BookmarkedService[] = JSON.parse(savedBookmarks)
        setBookmarkedServices(parsedBookmarks)
      }
    } catch (error) {
      console.error("Failed to load bookmarks from storage", error)
    }
  }, [])

  const saveBookmarks = useCallback(async (bookmarks: BookmarkedService[]) => {
    try {
      await AsyncStorage.setItem("bookmarkedServices", JSON.stringify(bookmarks))
    } catch (error) {
      console.error("Failed to save bookmarks to storage", error)
    }
  }, [])

  useEffect(() => {
    const loadLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem("appLocale")
        if (savedLocale && (savedLocale === "en" || savedLocale === "az" || savedLocale === "ru")) {
          setLocale(savedLocale)
          await i18n.changeLanguage(savedLocale) 
        }
      } catch (error) {
        console.error("Failed to load locale from storage", error)
      }
    }
    if (isFocused) {
      loadLocale()
      loadBookmarks()
    }
  }, [isFocused, loadBookmarks, i18n])

  useEffect(() => {
    const currentCategories = [t("all"), ...new Set(bookmarkedServices.map((service) => service.category))]
    if (!currentCategories.includes(activeTab)) {
      setActiveTab(t("all"))
    }
  }, [bookmarkedServices, activeTab, t]) 
  const categories = [t("all"), ...new Set(bookmarkedServices.map((service) => service.category))]

  const getFilteredServices = () => {
    if (activeTab === t("all")) {
      return bookmarkedServices
    }
    return bookmarkedServices.filter((service) => service.category === activeTab)
  }

  const handleRemoveBookmark = (serviceId: string, serviceName: string) => {
    setAlertTitle(t("removeBookmarkTitle"))
    setAlertMessage(`${t("removeBookmarkMessage")} "${serviceName}" ${t("fromBookmarks")}?`)
    setAlertButtons([
      {
        text: t("cancel"),
        style: "cancel",
        onPress: () => setIsAlertVisible(false), 
      },
      {
        text: t("yesRemove"),
        style: "destructive",
        onPress: async () => {
          const updatedBookmarks = bookmarkedServices.filter((service) => service.id !== serviceId)
          setBookmarkedServices(updatedBookmarks)
          await saveBookmarks(updatedBookmarks)
          setIsAlertVisible(false) 
        },
      },
    ])
    setIsAlertVisible(true)
  }

  const renderServiceItem = (item: BookmarkedService) => (
    <TouchableOpacity key={item.id} style={styles.serviceItem}>
      <View style={[styles.serviceImage, { backgroundColor: item.backgroundColor }]}>
        <Image source={{ uri: item.image }} style={styles.providerImage} />
      </View>
      <View style={styles.serviceInfo}>
        <Text style={styles.providerName}>{item.providerName}</Text>
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <Text style={styles.servicePrice}>
          {item.price.toFixed(2)} {t("currency")}
        </Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={responsiveFontSize(16)} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviews}>
            ({item.reviews.toLocaleString()} {t("reviews")})
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bookmarkButton} onPress={() => handleRemoveBookmark(item.id, item.serviceName)}>
        <Icon name="bookmark" size={responsiveFontSize(20)} color="#8B5CF6" />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={responsiveFontSize(24)} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("myBookmark")}</Text>
        <View></View>
        {/* <TouchableOpacity style={styles.moreButton}>
          <Icon name="ellipsis-horizontal" size={responsiveFontSize(24)} color="#FFFFFF" />
        </TouchableOpacity> */}
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.tab, activeTab === category && styles.activeTab]}
              onPress={() => setActiveTab(category)}
            >
              <Text style={[styles.tabText, activeTab === category && styles.activeTabText]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.servicesList}>
          {getFilteredServices().length > 0 ? (
            getFilteredServices().map(renderServiceItem)
          ) : (
            <View style={styles.emptyState}>
              <Icon name="bookmark-outline" size={responsiveFontSize(80)} color="rgba(255, 255, 255, 0.3)" />
              <Text style={styles.emptyStateText}>{t("noBookmarkedServices")}</Text>
              <Text style={styles.emptyStateSubtext}>{t("servicesAppearHere")}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <CustomAlert
        isVisible={isAlertVisible}
        title={alertTitle}
        message={alertMessage}
        buttons={alertButtons}
        onClose={() => setIsAlertVisible(false)} 
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(7),
    paddingBottom: responsiveHeight(2.5),
  },
  backButton: {
    width: responsiveFontSize(40),
    height: responsiveFontSize(40),
    borderRadius: responsiveFontSize(20),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  moreButton: {
    width: responsiveFontSize(40),
    height: responsiveFontSize(40),
    borderRadius: responsiveFontSize(20),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: responsiveWidth(5),
    marginBottom: responsiveHeight(2.5),
    alignItems: "center", 
  },
  tab: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1),
    borderRadius: responsiveFontSize(20),
    marginRight: responsiveWidth(3),
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.5)",
  },
  activeTab: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  tabText: {
    fontSize: responsiveFontSize(14),
    color: "rgba(139, 92, 246, 0.8)",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  servicesList: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(5),
  },
  serviceItem: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: responsiveFontSize(16),
    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(2),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: responsiveHeight(0.5) },
    shadowOpacity: 0.3,
    shadowRadius: responsiveFontSize(5),
    elevation: 8,
  },
  serviceImage: {
    width: responsiveFontSize(80),
    height: responsiveFontSize(80),
    borderRadius: responsiveFontSize(16),
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsiveWidth(4),
    overflow: "hidden",
  },
  providerImage: {
    width: responsiveFontSize(60),
    height: responsiveFontSize(60),
    borderRadius: responsiveFontSize(12),
  },
  serviceInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: responsiveFontSize(14),
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: responsiveHeight(0.5),
  },
  serviceName: {
    fontSize: responsiveFontSize(18),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: responsiveHeight(0.5),
  },
  servicePrice: {
    fontSize: responsiveFontSize(18),
    fontWeight: "bold",
    color: "#8B5CF6",
    marginBottom: responsiveHeight(1),
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: responsiveFontSize(14),
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: responsiveWidth(1),
    marginRight: responsiveWidth(1),
  },
  reviews: {
    fontSize: responsiveFontSize(14),
    color: "rgba(255, 255, 255, 0.6)",
  },
  bookmarkButton: {
    width: responsiveFontSize(40),
    height: responsiveFontSize(40),
    borderRadius: responsiveFontSize(20),
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: responsiveHeight(10),
  },
  emptyStateText: {
    fontSize: responsiveFontSize(20),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: responsiveHeight(2.5),
    marginBottom: responsiveHeight(1),
  },
  emptyStateSubtext: {
    fontSize: responsiveFontSize(16),
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
})

export default Bookmark
