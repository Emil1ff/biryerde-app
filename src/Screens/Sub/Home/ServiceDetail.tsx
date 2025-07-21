"use client"

import React, { useState, useEffect } from "react"
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
} from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import servicesData from "../../../data/services.json"

const { width } = Dimensions.get("window")
const IMAGE_HEIGHT = 300
const GALLERY_ITEM_SIZE = (width - 20 * 3) / 2 

interface ServiceCategory {
  id: string
  name: string
  icon: string
  color: string
  iconFamily: "Ionicons" | "MaterialIcons"
  description: string
  providersCount: number
  services: Service[]
}

interface Service {
  id: string
  name: string
  price: number
  rating: number
  reviews: number
  image: string
  heroImage?: string
  longDescription?: string
  exampleProviderName?: string
  exampleProviderLocation?: string
  galleryImages?: string[]
  exampleReviews?: Review[]
}

interface Review {
  user: string
  rating: number
  text: string
  likes: number
  timeAgo: string
  avatar: string
}

const getVectorIcon = (iconName: string, iconFamily: "Ionicons" | "MaterialIcons") => {
  if (iconFamily === "Ionicons") {
    return <Icon name={iconName} size={16} color="#FFFFFF" />
  } else if (iconFamily === "MaterialIcons") {
    return <MaterialIcons name={iconName} size={16} color="#FFFFFF" />
  }
  return null
}

const ServiceDetailScreen = ({ route, navigation }: any) => {
  const defaultCategoryId = servicesData.categories[0]?.id || "cleaning"
  const defaultServiceId = servicesData.categories[0]?.services[0]?.id || "house-cleaning"
  const { serviceId = defaultServiceId, categoryId = defaultCategoryId } = route?.params || {}
  const [service, setService] = useState<Service | null>(null)
  const [category, setCategory] = useState<ServiceCategory | null>(null)
  const [showFullDescription, setShowFullDescription] = useState(false)

  useEffect(() => {
    const foundCategory = servicesData.categories.find((cat) => cat.id === categoryId)
    if (foundCategory) {
      setCategory(foundCategory)
      const foundService = foundCategory.services.find((svc) => svc.id === serviceId)
      if (foundService) {
        setService(foundService)
      }
    }
  }, [serviceId, categoryId])

  if (!service || !category) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading service details...</Text>
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
              <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bookmarkButton}>
              <Icon name="bookmark-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.heroContent}>
            <Text style={styles.serviceTitle}>{service.name}</Text>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{service.exampleProviderName || "Provider Name"}</Text>
              <Icon name="star" size={14} color="#FFC107" style={styles.starIcon} />
              <Text style={styles.ratingText}>
                {service.rating} ({service.reviews.toLocaleString()} reviews)
              </Text>
            </View>
            <View style={styles.locationInfo}>
              {getVectorIcon(category.icon, category.iconFamily)}
              <Text style={styles.categoryText}>{category.name}</Text>
              <Icon name="location-sharp" size={16} color="#FFFFFF" style={styles.locationIcon} />
              <Text style={styles.locationText}>{service.exampleProviderLocation || "Location"}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>${service.price}</Text>
              <Text style={styles.priceLabel}>(Floor price)</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About me</Text>
          <Text style={styles.descriptionText}>
            {displayDescription}
            {!showFullDescription && service.longDescription && service.longDescription.length > 150 && (
              <Text style={styles.readMore} onPress={() => setShowFullDescription(true)}>
                {" "}
                Read more
              </Text>
            )}
            {showFullDescription && service.longDescription && service.longDescription.length > 150 && (
              <Text style={styles.readMore} onPress={() => setShowFullDescription(false)}>
                {" "}
                Show less
              </Text>
            )}
          </Text>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Photos & Videos</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AllPhotosAndVideos", { serviceId: service.id, categoryId: category.id })
              }
            >
              <Text style={styles.seeAllText}>See All</Text>
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
              <Icon name="star" size={20} color="#FFC107" /> {service.rating} ({service.reviews.toLocaleString()}{" "}
              reviews)
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AllReviews", { serviceId: service.id, categoryId: category.id })}
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterButtonsContainer}
          >
            {["All", "5", "4", "3", "2", "1"].map((star, index) => (
              <TouchableOpacity key={star} style={styles.filterButton}>
                {star !== "All" && <Icon name="star" size={14} color="#FFC107" style={{ marginRight: 4 }} />}
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
                            size={14}
                            color={i < review.rating ? "#FFC107" : "rgba(255, 255, 255, 0.3)"}
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewText}>{review.text}</Text>
                    <View style={styles.reviewLikes}>
                      <Icon name="heart" size={16} color="#FF6B6B" />
                      <Text style={styles.reviewLikesCount}>{review.likes}</Text>
                    </View>
                  </View>
                </View>
                {index < (service.exampleReviews?.length || 0) - 1 && <View style={styles.separator} />}
              </React.Fragment>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.messageButton}>
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bookNowButton}
          onPress={() =>
            navigation.navigate("ServiceCustomization", { serviceId: service.id, categoryId: category.id })
          }
        >
          <Text style={styles.bookNowButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:'red',
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 18,
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
    top: 40,
    left: 20,
    right: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  serviceTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  providerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  providerName: {
    fontSize: 16,
    color: "#FFFFFF",
    marginRight: 8,
  },
  starIcon: {
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginRight: 8,
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  priceText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#8B5CF6", 
    marginRight: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  descriptionText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 24,
  },
  readMore: {
    color: "#8B5CF6", 
    fontWeight: "bold",
  },
  seeAllText: {
    color: "#8B5CF6", 
    fontSize: 14,
    fontWeight: "600",
  },
  galleryContainer: {
    paddingRight: 20, 
  },
  galleryImage: {
    width: GALLERY_ITEM_SIZE,
    height: GALLERY_ITEM_SIZE,
    borderRadius: 12,
    marginRight: 10,
  },
  filterButtonsContainer: {
    paddingRight: 20,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  filterButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  reviewsContainer: {
    marginTop: 20,
  },
  reviewCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  reviewTime: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  reviewStars: {
    flexDirection: "row",
  },
  reviewText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewLikes: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  reviewLikesCount: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginLeft: 4,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 16,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#1A1A2E", 
  },
  messageButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#8B5CF6", 
    borderRadius: 12,
    paddingVertical: 14,
    marginRight: 10,
    alignItems: "center",
  },
  messageButtonText: {
    color: "#8B5CF6", 
    fontSize: 16,
    fontWeight: "bold",
  },
  bookNowButton: {
    flex: 1,
    backgroundColor: "#8B5CF6", 
    borderRadius: 12,
    paddingVertical: 14,
    marginLeft: 10,
    alignItems: "center",
  },
  bookNowButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default ServiceDetailScreen
