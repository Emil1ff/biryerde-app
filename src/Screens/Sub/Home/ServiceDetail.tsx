"use client"
import React, { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import servicesData from "../../../data/services.json"
import type { ServiceCategory, ServiceItem, BookmarkedService } from "../../Types/data"

// Tərcümə fayllarını import edin
import enTranslations from "../../../Assets/lang/en.json"
import azTranslations from "../../../Assets/lang/az.json"
import ruTranslations from "../../../Assets/lang/ru.json"

const { width, height } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (width * percentage) / 100
const responsiveHeight = (percentage: number) => (height * percentage) / 100
const responsiveFontSize = (size: number) => size * (width / 375)

const IMAGE_HEIGHT = responsiveHeight(38) // Slightly taller hero image
const GALLERY_ITEM_SIZE = (responsiveWidth(100) - responsiveWidth(5) * 2 - responsiveWidth(3)) / 2 // (width - paddingHorizontal * 2 - spacing) / 2

const allTranslations = {
  en: enTranslations,
  az: azTranslations,
  ru: ruTranslations,
}

const getVectorIcon = (iconName: string, iconFamily: "Ionicons" | "MaterialIcons") => {
  if (iconFamily === "Ionicons") {
    return <Icon name={iconName} size={responsiveFontSize(16)} color="#FFFFFF" />
  } else if (iconFamily === "MaterialIcons") {
    return <MaterialIcons name={iconName} size={responsiveFontSize(16)} color="#FFFFFF" />
  }
  return null
}

const ServiceDetailScreen = ({ route }: any) => {
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const defaultCategoryId = servicesData.categories[0]?.id || "cleaning"
  const defaultServiceId = servicesData.categories[0]?.services[0]?.id || "house-cleaning"
  const { serviceId = defaultServiceId, categoryId = defaultCategoryId } = route?.params || {}

  const [service, setService] = useState<ServiceItem | null>(null)
  const [category, setCategory] = useState<ServiceCategory | null>(null)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [locale, setLocale] = useState<"en" | "az" | "ru">("en")
  const [isLoading, setIsLoading] = useState(true)

  const t = (key: keyof typeof enTranslations) => {
    return allTranslations[locale][key] || key
  }

  const loadServiceData = useCallback(() => {
    setIsLoading(true)
    const foundCategory = servicesData.categories.find((cat) => cat.id === categoryId)
    if (foundCategory) {
      setCategory(foundCategory)
      const foundService = foundCategory.services.find((svc) => svc.id === serviceId)
      if (foundService) {
        setService(foundService)
      }
    }
    setIsLoading(false)
  }, [serviceId, categoryId])

  const loadLocaleAndBookmarks = useCallback(async () => {
    try {
      const savedLocale = await AsyncStorage.getItem("appLocale")
      if (savedLocale && (savedLocale === "en" || savedLocale === "az" || savedLocale === "ru")) {
        setLocale(savedLocale)
      }

      const savedBookmarks = await AsyncStorage.getItem("bookmarkedServices")
      if (savedBookmarks) {
        const parsedBookmarks: BookmarkedService[] = JSON.parse(savedBookmarks)
        setIsBookmarked(parsedBookmarks.some((s) => s.id === serviceId))
      }
    } catch (error) {
      console.error("Failed to load locale or bookmarks from storage", error)
    }
  }, [serviceId])

  useEffect(() => {
    loadServiceData()
  }, [loadServiceData])

  useEffect(() => {
    if (isFocused) {
      loadLocaleAndBookmarks()
    }
  }, [isFocused, loadLocaleAndBookmarks])

  const handleToggleBookmark = async () => {
    if (!service || !category) return

    let updatedBookmarks: BookmarkedService[] = []
    try {
      const currentBookmarksString = await AsyncStorage.getItem("bookmarkedServices")
      const currentBookmarks: BookmarkedService[] = currentBookmarksString ? JSON.parse(currentBookmarksString) : []

      const serviceToBookmark: BookmarkedService = {
        id: service.id,
        providerName: service.exampleProviderName || "Unknown Provider",
        serviceName: service.name,
        price: service.price,
        rating: service.rating,
        reviews: service.reviews,
        image: service.heroImage || service.image,
        backgroundColor: category.color,
        category: t(category.name.toLowerCase() as keyof typeof enTranslations),
      }

      if (isBookmarked) {
        updatedBookmarks = currentBookmarks.filter((s) => s.id !== service.id)
      } else {
        updatedBookmarks = [...currentBookmarks, serviceToBookmark]
      }

      await AsyncStorage.setItem("bookmarkedServices", JSON.stringify(updatedBookmarks))
      setIsBookmarked(!isBookmarked)
    } catch (error) {
      console.error("Failed to toggle bookmark:", error)
    }
  }

  if (isLoading || !service || !category) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>{t("loadingServiceDetails")}</Text>
        </View>
      </SafeAreaView>
    )
  }

  const displayDescription =
    showFullDescription || !service.longDescription || service.longDescription.length <= 150
      ? service.longDescription
      : service.longDescription?.substring(0, 150) + "..."

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroImageContainer}>
          <Image source={{ uri: service.heroImage || service.image }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.headerButtonsAbsolute}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={responsiveFontSize(24)} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bookmarkButton} onPress={handleToggleBookmark}>
              <Icon
                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                size={responsiveFontSize(24)}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.heroContent}>
            <Text style={styles.serviceTitle}>{service.name}</Text>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{service.exampleProviderName || "Provider Name"}</Text>
              <Icon name="star" size={responsiveFontSize(14)} color="#FFC107" style={styles.starIcon} />
              <Text style={styles.ratingText}>
                {service.rating} ({service.reviews.toLocaleString()} {t("reviews")})
              </Text>
            </View>
            <View style={styles.locationInfo}>
              {getVectorIcon(category.icon, category.iconFamily)}
              <Text style={styles.categoryText}>{t(category.name.toLowerCase() as keyof typeof enTranslations)}</Text>
              <Icon name="location-sharp" size={responsiveFontSize(16)} color="#FFFFFF" style={styles.locationIcon} />
              <Text style={styles.locationText}>{service.exampleProviderLocation || "Location"}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>
                {service.price.toFixed(2)} {t("currency")}
              </Text>
              <Text style={styles.priceLabel}>({t("floorPrice")})</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentCard}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("aboutMe")}</Text>
            <Text style={styles.descriptionText}>
              {displayDescription}
              {!showFullDescription && service.longDescription && service.longDescription.length > 150 && (
                <Text style={styles.readMore} onPress={() => setShowFullDescription(true)}>
                  {" "}
                  {t("readMore")}
                </Text>
              )}
              {showFullDescription && service.longDescription && service.longDescription.length > 150 && (
                <Text style={styles.readMore} onPress={() => setShowFullDescription(false)}>
                  {" "}
                  {t("showLess")}
                </Text>
              )}
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t("photosAndVideos")}</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("AllPhotosAndVideos", { serviceId: service.id, categoryId: category.id })
                }
              >
                <Text style={styles.seeAllText}>{t("seeAll")}</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={service.galleryImages}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => `gallery-${index}`}
              renderItem={({ item }) => <Image source={{ uri: item }} style={styles.galleryImage} resizeMode="cover" />}
              contentContainerStyle={styles.galleryContainer}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                <Icon name="star" size={responsiveFontSize(20)} color="#FFC107" /> {service.rating} (
                {service.reviews.toLocaleString()} {t("reviews")})
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("AllReviews", { serviceId: service.id, categoryId: category.id })}
              >
                <Text style={styles.seeAllText}>{t("seeAll")}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterButtonsContainer}
            >
              {["All", "5", "4", "3", "2", "1"].map((star, index) => (
                <TouchableOpacity key={star} style={styles.filterButton}>
                  {star !== "All" && (
                    <Icon
                      name="star"
                      size={responsiveFontSize(14)}
                      color="#FFC107"
                      style={{ marginRight: responsiveWidth(1) }}
                    />
                  )}
                  <Text style={styles.filterButtonText}>{star}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.reviewsContainer}>
              {service.exampleReviews?.map((review, index) => (
                <React.Fragment key={index}>
                  <View style={styles.reviewCard}>
                    <Image source={{ uri: review.avatar }} style={styles.reviewAvatar} />
                    <View style={styles.reviewContent}>
                      <View style={styles.reviewHeader}>
                        <View>
                          <Text style={styles.reviewUser}>{review.user}</Text>
                          <Text style={styles.reviewTime}>{review.timeAgo}</Text>
                        </View>
                        <View style={styles.reviewStars}>
                          {[...Array(5)].map((_, i) => (
                            <Icon
                              key={i}
                              name="star"
                              size={responsiveFontSize(14)}
                              color={i < review.rating ? "#FFC107" : "rgba(255, 255, 255, 0.3)"}
                            />
                          ))}
                        </View>
                      </View>
                      <Text style={styles.reviewText}>{review.text}</Text>
                      <View style={styles.reviewLikes}>
                        <Icon name="heart" size={responsiveFontSize(16)} color="#FF6B6B" />
                        <Text style={styles.reviewLikesCount}>{review.likes}</Text>
                      </View>
                    </View>
                  </View>
                  {index < (service.exampleReviews?.length || 0) - 1 && <View style={styles.separator} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.messageButton}>
          <Text style={styles.messageButtonText}>{t("message")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bookNowButton}
          onPress={() =>
            navigation.navigate("ServiceCustomization", { serviceId: service.id, categoryId: category.id })
          }
        >
          <Text style={styles.bookNowButtonText}>{t("bookNow")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A0A0A",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(18),
    marginTop: responsiveHeight(2),
  },
  heroImageContainer: {
    width: "100%",
    height: IMAGE_HEIGHT,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  headerButtonsAbsolute: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: responsiveHeight(5),
    left: responsiveWidth(5),
    right: responsiveWidth(5),
    zIndex: 10,
  },
  backButton: {
    width: responsiveFontSize(40),
    height: responsiveFontSize(40),
    borderRadius: responsiveFontSize(20),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  bookmarkButton: {
    width: responsiveFontSize(40),
    height: responsiveFontSize(40),
    borderRadius: responsiveFontSize(20),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: responsiveWidth(5),
    paddingBottom: responsiveHeight(3), // Add more padding at the bottom
  },
  serviceTitle: {
    fontSize: responsiveFontSize(30), // Larger title
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: responsiveHeight(1),
  },
  providerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsiveHeight(0.8), // Increased spacing
  },
  providerName: {
    fontSize: responsiveFontSize(16),
    color: "#FFFFFF",
    marginRight: responsiveWidth(2),
    fontWeight: "500", // Slightly bolder
  },
  starIcon: {
    marginRight: responsiveWidth(1),
  },
  ratingText: {
    fontSize: responsiveFontSize(14),
    color: "#FFFFFF",
    fontWeight: "400",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsiveHeight(2.5), // Increased spacing
  },
  categoryText: {
    fontSize: responsiveFontSize(14),
    color: "#FFFFFF",
    marginRight: responsiveWidth(2),
    fontWeight: "500",
  },
  locationIcon: {
    marginRight: responsiveWidth(1),
  },
  locationText: {
    fontSize: responsiveFontSize(14),
    color: "#FFFFFF",
    fontWeight: "400",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: responsiveHeight(1.5), // Increased spacing
  },
  priceText: {
    fontSize: responsiveFontSize(25),
    fontWeight: "bold",
    color: "#8B5CF6",
    marginRight: responsiveWidth(2),
  },
  priceLabel: {
    fontSize: responsiveFontSize(14),
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
  },
  contentCard: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: responsiveFontSize(30), // Larger radius
    borderTopRightRadius: responsiveFontSize(30), // Larger radius
    marginTop: -responsiveFontSize(30), // Overlap with hero image, adjusted for new radius
    paddingTop: responsiveHeight(4), // More padding at the top
    paddingBottom: responsiveHeight(5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -responsiveHeight(2) },
    shadowOpacity: 0.6, // More pronounced shadow
    shadowRadius: responsiveFontSize(25), // Larger shadow radius
    elevation: 25, // Increased elevation
  },
  section: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2.5), // Increased vertical padding
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsiveHeight(2),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(22), // Slightly larger title
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  descriptionText: {
    fontSize: responsiveFontSize(16),
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: responsiveFontSize(24),
  },
  readMore: {
    color: "#8B5CF6",
    fontWeight: "bold",
  },
  seeAllText: {
    color: "#8B5CF6",
    fontSize: responsiveFontSize(15), // Slightly larger
    fontWeight: "600",
  },
  galleryContainer: {
    paddingRight: responsiveWidth(5),
    paddingVertical: responsiveHeight(1), // Add vertical padding for consistency
  },
  galleryImage: {
    width: GALLERY_ITEM_SIZE,
    height: GALLERY_ITEM_SIZE,
    borderRadius: responsiveFontSize(15), // Slightly larger radius
    marginRight: responsiveWidth(3), // Adjusted spacing
  },
  filterButtonsContainer: {
    paddingRight: responsiveWidth(5),
    paddingVertical: responsiveHeight(1), // Add vertical padding
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: responsiveFontSize(25), // Larger radius
    paddingVertical: responsiveHeight(1.2), // Slightly more padding
    paddingHorizontal: responsiveWidth(4.5), // Slightly more padding
    marginRight: responsiveWidth(2.5), // Adjusted spacing
  },
  filterButtonText: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(14),
    fontWeight: "600",
  },
  reviewsContainer: {
    marginTop: responsiveHeight(2.5),
  },
  reviewCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: responsiveHeight(2),
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: responsiveFontSize(15), // Larger radius
    padding: responsiveWidth(4.5), // Slightly more padding
  },
  reviewAvatar: {
    width: responsiveFontSize(45), // Slightly larger avatar
    height: responsiveFontSize(45),
    borderRadius: responsiveFontSize(22.5), // Adjusted radius
    marginRight: responsiveWidth(3.5), // Adjusted spacing
    borderWidth: 1.5, // Slightly thicker border
    borderColor: "rgba(255, 255, 255, 0.25)", // Slightly more visible border
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: responsiveHeight(0.8), // Increased spacing
  },
  reviewUser: {
    fontSize: responsiveFontSize(17), // Slightly larger
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  reviewTime: {
    fontSize: responsiveFontSize(12),
    color: "rgba(255, 255, 255, 0.6)",
  },
  reviewStars: {
    flexDirection: "row",
  },
  reviewText: {
    fontSize: responsiveFontSize(15), // Slightly larger
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: responsiveFontSize(22), // Adjusted line height
    marginBottom: responsiveHeight(1.2), // Increased spacing
  },
  reviewLikes: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: responsiveHeight(0.5),
  },
  reviewLikesCount: {
    fontSize: responsiveFontSize(14),
    color: "rgba(255, 255, 255, 0.6)",
    marginLeft: responsiveWidth(1),
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: responsiveHeight(2.5), // Increased vertical margin
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: responsiveHeight(2.5), // More vertical padding
    paddingHorizontal: responsiveWidth(5),
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#1A1A2E",
  },
  messageButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1.5, // Slightly thicker border
    borderColor: "#8B5CF6",
    borderRadius: responsiveFontSize(15), // Larger radius
    paddingVertical: responsiveHeight(1.8),
    marginRight: responsiveWidth(2.5),
    alignItems: "center",
  },
  messageButtonText: {
    color: "#8B5CF6",
    fontSize: responsiveFontSize(17), // Slightly larger
    fontWeight: "bold",
  },
  bookNowButton: {
    flex: 1,
    backgroundColor: "#8B5CF6",
    borderRadius: responsiveFontSize(15), // Larger radius
    paddingVertical: responsiveHeight(1.8),
    marginLeft: responsiveWidth(2.5),
    alignItems: "center",
    shadowColor: "#8B5CF6", // Add shadow for prominence
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  bookNowButtonText: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(17), // Slightly larger
    fontWeight: "bold",
  },
})

export default ServiceDetailScreen
