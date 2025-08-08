"use client"
import type React from "react"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useServiceData } from "../../../hooks/useServiceData"
import type { RootStackParamList, ServiceItem, BookmarkedService } from "../Types/data"
import type { StackScreenProps } from "@react-navigation/stack"

import enTranslations from "../../../Assets/lang/en.json"
import azTranslations from "../../../Assets/lang/az.json"
import ruTranslations from "../../../Assets/lang/ru.json"
import { FilteredResultsScreenProps } from "../../../Types/navigation"

const { width, height } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (width * percentage) / 100
const responsiveHeight = (percentage: number) => (height * percentage) / 100
const responsiveFontSize = (size: number) => size * (width / 375)

const allTranslations = {
  en: enTranslations,
  az: azTranslations,
  ru: ruTranslations,
}


const FilteredResultsScreen: React.FC<FilteredResultsScreenProps> = () => {
  const navigation = useNavigation<FilteredResultsScreenProps["navigation"]>()
  const route = useRoute<FilteredResultsScreenProps["route"]>()
  const isFocused = useIsFocused()
  const { filters } = route.params

  const [locale, setLocale] = useState<"en" | "az" | "ru">("en")
  const { categories, isLoading, error } = useServiceData()
  const [filteredServices, setFilteredServices] = useState<BookmarkedService[]>([])

  const t = (key: keyof typeof enTranslations) => {
    return allTranslations[locale][key] || key
  }

  useEffect(() => {
    const loadLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem("appLocale")
        if (savedLocale && (savedLocale === "en" || savedLocale === "az" || savedLocale === "ru")) {
          setLocale(savedLocale)
        }
      } catch (error) {
        console.error("Failed to load locale from storage", error)
      }
    }

    if (isFocused) {
      loadLocale()
    }
  }, [isFocused])

  useEffect(() => {
    const translateCategoryName = (categoryName: string) => {
      return t(categoryName.toLowerCase() as keyof typeof enTranslations)
    }

    if (categories.length > 0 && filters) {
      let allServices: BookmarkedService[] = categories.flatMap((category) =>
        category.services.map((service: ServiceItem) => ({
          id: service.id,
          providerName: service.exampleProviderName || "Unknown Provider",
          serviceName: service.name,
          price: service.price,
          rating: service.rating,
          reviews: service.reviews,
          image: service.heroImage || "/placeholder.svg?height=300&width=400",
          backgroundColor: category.color,
          category: translateCategoryName(category.name),
        })),
      )

      if (filters.category && filters.category !== t("all")) {
        allServices = allServices.filter((service) => service.category === filters.category)
      }

      if (filters.priceRange) {
        allServices = allServices.filter(
          (service) => service.price >= filters.priceRange[0] && service.price <= filters.priceRange[1],
        )
      }

      if (filters.rating) {
        allServices = allServices.filter((service) => service.rating >= filters.rating)
      }

      if (filters.sortBy) {
        allServices.sort((a, b) => {
          switch (filters.sortBy) {
            case t("mostPopular"):
              return b.reviews - a.reviews 
            case t("highestRating"):
              return b.rating - a.rating
            case t("lowestPrice"):
              return a.price - b.price
            case t("highestPrice"):
              return b.price - a.price
            case t("newest"):
              return 0
            default:
              return 0
          }
        })
      }
      setFilteredServices(allServices)
    }
  }, [categories, filters, locale])

  const renderServiceItem = ({ item }: { item: BookmarkedService }) => {
    return (
      <TouchableOpacity style={styles.serviceItem}>
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
      </TouchableOpacity>
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>{t("loadingServices")}</Text>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => {}}>
          <Text style={styles.retryButtonText}>{t("retry")}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={responsiveFontSize(24)} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("filteredResults")}</Text>
        <View style={styles.placeholder} />
      </View>
      <FlatList
        data={filteredServices}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.servicesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Icon name="sad-outline" size={responsiveFontSize(80)} color="rgba(255, 255, 255, 0.3)" />
            <Text style={styles.emptyStateText}>{t("noMatchingServices")}</Text>
            <Text style={styles.emptyStateSubtext}>{t("tryDifferentFilters")}</Text>
          </View>
        )}
      />
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A0A0A",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: responsiveFontSize(18),
    textAlign: "center",
    marginBottom: responsiveHeight(2),
  },
  retryButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: responsiveFontSize(12),
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(5),
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: responsiveFontSize(16),
    fontWeight: "bold",
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
  placeholder: {
    width: responsiveFontSize(40),
  },
  servicesList: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2.5),
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
    width: "100%",
    height: "100%",
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
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: responsiveFontSize(16),
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    paddingHorizontal: responsiveWidth(10),
  },
})

export default FilteredResultsScreen
