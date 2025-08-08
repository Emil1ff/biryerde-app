"use client"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Dimensions } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { useNavigation, useIsFocused } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { FilterState, RootStackParamList } from "../../../Types/data"
import type { StackNavigationProp } from "@react-navigation/stack"
import { useTranslation } from "react-i18next" // Import useTranslation

const { width, height } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (width * percentage) / 100
const responsiveHeight = (percentage: number) => (height * percentage) / 100
const responsiveFontSize = (size: number) => size * (width / 375)

const Filter = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const isFocused = useIsFocused()
  const { t, i18n } = useTranslation() // Use the t function and i18n instance
  const [locale, setLocale] = useState<"en" | "az" | "ru">("en")

  const [filters, setFilters] = useState<FilterState>({
    category: "",
    priceRange: [20, 80],
    rating: 4.0,
    sortBy: "",
  })

  useEffect(() => {
    const loadLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem("appLocale")
        if (savedLocale && (savedLocale === "en" || savedLocale === "az" || savedLocale === "ru")) {
          setLocale(savedLocale)
          await i18n.changeLanguage(savedLocale) // Ensure i18n instance updates
        }
      } catch (error) {
        console.error("Failed to load locale from storage", error)
      }
    }
    if (isFocused) {
      loadLocale()
    }
  }, [isFocused, i18n])

  useEffect(() => {
    // Initialize filters with translated default values once locale is loaded
    if (locale) {
      setFilters((prev) => ({
        ...prev,
        category: prev.category || t("cleaning"),
        sortBy: prev.sortBy || t("mostPopular"),
      }))
    }
  }, [locale, t]) // Depend on t to re-run when language changes

  const categories = [
    t("cleaning"),
    t("repairing"),
    t("painting"),
    t("laundry"),
    t("appliance"),
    t("plumbing"),
  ]
  const sortOptions = [
    t("mostPopular"),
    t("highestRating"),
    t("lowestPrice"),
    t("highestPrice"),
    t("newest"),
  ]
  const ratings = [1, 2, 3, 4, 5]
  const priceRanges = [
    { label: "$10 - $30", range: [10, 30] },
    { label: "$20 - $50", range: [20, 50] },
    { label: "$30 - $70", range: [30, 70] },
    { label: "$50 - $100", range: [50, 100] },
    { label: "$70 - $150", range: [70, 150] },
    { label: "$100+", range: [100, 500] },
  ]

  const handleCategorySelect = (category: string) => {
    setFilters((prev) => ({ ...prev, category }))
  }
  const handleRatingSelect = (rating: number) => {
    setFilters((prev) => ({ ...prev, rating }))
  }
  const handleSortSelect = (sortBy: string) => {
    setFilters((prev) => ({ ...prev, sortBy }))
  }
  const handlePriceRangeSelect = (range: [number, number]) => {
    setFilters((prev) => ({ ...prev, priceRange: range }))
  }
  const handleMinPriceChange = (text: string) => {
    const value = Number.parseInt(text) || 0
    setFilters((prev) => ({ ...prev, priceRange: [value, prev.priceRange[1]] }))
  }
  const handleMaxPriceChange = (text: string) => {
    const value = Number.parseInt(text) || 0
    setFilters((prev) => ({ ...prev, priceRange: [prev.priceRange[0], value] }))
  }
  const adjustPrice = (isMin: boolean, increment: boolean) => {
    const step = 10
    setFilters((prev) => {
      if (isMin) {
        const newMin = increment
          ? Math.min(prev.priceRange[0] + step, prev.priceRange[1] - step)
          : Math.max(prev.priceRange[0] - step, 0)
        return { ...prev, priceRange: [newMin, prev.priceRange[1]] }
      } else {
        const newMax = increment
          ? prev.priceRange[1] + step
          : Math.max(prev.priceRange[1] - step, prev.priceRange[0] + step)
        return { ...prev, priceRange: [prev.priceRange[0], newMax] }
      }
    })
  }
  const resetFilters = () => {
    setFilters({
      category: t("cleaning"),
      priceRange: [20, 80],
      rating: 4.0,
      sortBy: t("mostPopular"),
    })
  }
  const applyFilters = () => {
    navigation.navigate("FilteredResults", { filters })
  }
  const isPriceRangeSelected = (range: [number, number]) => {
    return filters.priceRange[0] === range[0] && filters.priceRange[1] === range[1]
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={responsiveFontSize(24)} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("filter")}</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>{t("category")}</Text>
          <View style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[styles.categoryChip, filters.category === category && styles.activeCategoryChip]}
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={[styles.categoryText, filters.category === category && styles.activeCategoryText]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>{t("priceRange")}</Text>
          <View style={styles.priceRangeContainer}>
            {priceRanges.map((priceRange, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.priceRangeChip,
                  isPriceRangeSelected(priceRange.range as [number, number]) && styles.activePriceRangeChip,
                ]}
                onPress={() => handlePriceRangeSelect(priceRange.range as [number, number])}
              >
                <Text
                  style={[
                    styles.priceRangeText,
                    isPriceRangeSelected(priceRange.range as [number, number]) && styles.activePriceRangeText,
                  ]}
                >
                  {priceRange.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.customPriceTitle}>{t("customRange")}</Text>
          <View style={styles.customPriceContainer}>
            <View style={styles.priceInputGroup}>
              <Text style={styles.priceLabel}>{t("minPrice")}</Text>
              <View style={styles.priceInputContainer}>
                <TouchableOpacity style={styles.priceButton} onPress={() => adjustPrice(true, false)}>
                  <Icon name="remove" size={responsiveFontSize(16)} color="#8B5CF6" />
                </TouchableOpacity>
                <TextInput
                  style={styles.priceInput}
                  value={filters.priceRange[0].toString()}
                  onChangeText={handleMinPriceChange}
                  keyboardType="numeric"
                  placeholder="Min"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                />
                <TouchableOpacity style={styles.priceButton} onPress={() => adjustPrice(true, true)}>
                  <Icon name="add" size={responsiveFontSize(16)} color="#8B5CF6" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.priceInputGroup}>
              <Text style={styles.priceLabel}>{t("maxPrice")}</Text>
              <View style={styles.priceInputContainer}>
                <TouchableOpacity style={styles.priceButton} onPress={() => adjustPrice(false, false)}>
                  <Icon name="remove" size={responsiveFontSize(16)} color="#8B5CF6" />
                </TouchableOpacity>
                <TextInput
                  style={styles.priceInput}
                  value={filters.priceRange[1].toString()}
                  onChangeText={handleMaxPriceChange}
                  keyboardType="numeric"
                  placeholder="Max"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                />
                <TouchableOpacity style={styles.priceButton} onPress={() => adjustPrice(false, true)}>
                  <Icon name="add" size={responsiveFontSize(16)} color="#8B5CF6" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>{t("minimumRating")}</Text>
          <View style={styles.ratingContainer}>
            {ratings.map((rating) => (
              <TouchableOpacity
                key={rating}
                style={[styles.ratingChip, filters.rating >= rating && styles.activeRatingChip]}
                onPress={() => handleRatingSelect(rating)}
              >
                <Icon
                  name="star"
                  size={responsiveFontSize(20)}
                  color={filters.rating >= rating ? "#FFFFFF" : "rgba(255, 255, 255, 0.3)"}
                />
                <Text style={[styles.ratingText, filters.rating >= rating && styles.activeRatingText]}>{rating}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>{t("sortBy")}</Text>
          <View style={styles.sortContainer}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.sortOption, filters.sortBy === option && styles.activeSortOption]}
                onPress={() => handleSortSelect(option)}
              >
                <Text style={[styles.sortText, filters.sortBy === option && styles.activeSortText]}>{option}</Text>
                {filters.sortBy === option && <Icon name="checkmark" size={responsiveFontSize(20)} color="#8B5CF6" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
          <Text style={styles.resetButtonText}>{t("reset")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>{t("applyFilter")}</Text>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2.5),
  },
  filterSection: {
    marginBottom: responsiveHeight(3),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: responsiveHeight(2),
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: responsiveWidth(3),
  },
  categoryChip: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1),
    borderRadius: responsiveFontSize(20),
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.5)",
    backgroundColor: "transparent",
  },
  activeCategoryChip: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  categoryText: {
    fontSize: responsiveFontSize(14),
    color: "rgba(139, 92, 246, 0.8)",
    fontWeight: "500",
  },
  activeCategoryText: {
    color: "#FFFFFF",
  },
  priceRangeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: responsiveWidth(3),
    marginBottom: responsiveHeight(2.5),
  },
  priceRangeChip: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1),
    borderRadius: responsiveFontSize(20),
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.5)",
    backgroundColor: "transparent",
  },
  activePriceRangeChip: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  priceRangeText: {
    fontSize: responsiveFontSize(14),
    color: "rgba(139, 92, 246, 0.8)",
    fontWeight: "500",
  },
  activePriceRangeText: {
    color: "#FFFFFF",
  },
  customPriceTitle: {
    fontSize: responsiveFontSize(16),
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: responsiveHeight(1.5),
  },
  customPriceContainer: {
    flexDirection: "row",
    gap: responsiveWidth(4),
  },
  priceInputGroup: {
    flex: 1,
  },
  priceLabel: {
    fontSize: responsiveFontSize(14),
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: responsiveHeight(1),
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: responsiveFontSize(12),
    paddingHorizontal: responsiveWidth(1),
  },
  priceButton: {
    width: responsiveFontSize(32),
    height: responsiveFontSize(32),
    borderRadius: responsiveFontSize(16),
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    margin: responsiveWidth(1),
  },
  priceInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: responsiveFontSize(16),
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: responsiveHeight(1.5),
  },
  ratingContainer: {
    flexDirection: "row",
    gap: responsiveWidth(3),
  },
  ratingChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveHeight(1),
    borderRadius: responsiveFontSize(20),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "transparent",
  },
  activeRatingChip: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  ratingText: {
    fontSize: responsiveFontSize(14),
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
    marginLeft: responsiveWidth(1),
  },
  activeRatingText: {
    color: "#FFFFFF",
  },
  sortContainer: {
    gap: responsiveHeight(1.5),
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: responsiveFontSize(12),
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  activeSortOption: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderWidth: 1,
    borderColor: "#8B5CF6",
  },
  sortText: {
    fontSize: responsiveFontSize(16),
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  activeSortText: {
    color: "#FFFFFF",
  },
  bottomActions: {
    flexDirection: "row",
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2.5),
    gap: responsiveWidth(4),
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#1A1A2E",
  },
  resetButton: {
    flex: 1,
    paddingVertical: responsiveHeight(2),
    borderRadius: responsiveFontSize(12),
    borderWidth: 1,
    borderColor: "#8B5CF6",
    backgroundColor: "transparent",
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: responsiveFontSize(16),
    color: "#8B5CF6",
    fontWeight: "bold",
  },
  applyButton: {
    flex: 1,
    paddingVertical: responsiveHeight(2),
    borderRadius: responsiveFontSize(12),
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  applyButtonText: {
    fontSize: responsiveFontSize(16),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
})

export default Filter
