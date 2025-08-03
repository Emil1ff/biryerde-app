"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

interface FilterState {
  category: string
  priceRange: [number, number]
  rating: number
  sortBy: string
}

const Filter = ({ navigation }: any) => {
  const [filters, setFilters] = useState<FilterState>({
    category: "Cleaning",
    priceRange: [20, 80],
    rating: 4.0,
    sortBy: "Most Popular",
  })

  const categories = ["Cleaning", "Repairing", "Painting", "Laundry", "Appliance", "Plumbing"]
  const sortOptions = ["Most Popular", "Highest Rating", "Lowest Price", "Highest Price", "Newest"]
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
    const value = parseInt(text) || 0
    setFilters((prev) => ({ ...prev, priceRange: [value, prev.priceRange[1]] }))
  }

  const handleMaxPriceChange = (text: string) => {
    const value = parseInt(text) || 0
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
      category: "Cleaning",
      priceRange: [20, 80],
      rating: 4.0,
      sortBy: "Most Popular",
    })
  }

  const applyFilters = () => {
    navigation.navigate("Search", { filters })
  }

  const isPriceRangeSelected = (range: [number, number]) => {
    return filters.priceRange[0] === range[0] && filters.priceRange[1] === range[1]
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filter</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Category Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Category</Text>
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
          <Text style={styles.sectionTitle}>Price Range</Text>
          
          <View style={styles.priceRangeContainer}>
            {priceRanges.map((priceRange, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.priceRangeChip,
                  isPriceRangeSelected(priceRange.range as [number, number]) && styles.activePriceRangeChip
                ]}
                onPress={() => handlePriceRangeSelect(priceRange.range as [number, number])}
              >
                <Text style={[
                  styles.priceRangeText,
                  isPriceRangeSelected(priceRange.range as [number, number]) && styles.activePriceRangeText
                ]}>
                  {priceRange.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.customPriceTitle}>Custom Range</Text>
          <View style={styles.customPriceContainer}>
            <View style={styles.priceInputGroup}>
              <Text style={styles.priceLabel}>Min Price</Text>
              <View style={styles.priceInputContainer}>
                <TouchableOpacity 
                  style={styles.priceButton}
                  onPress={() => adjustPrice(true, false)}
                >
                  <Icon name="remove" size={16} color="#8B5CF6" />
                </TouchableOpacity>
                <TextInput
                  style={styles.priceInput}
                  value={filters.priceRange[0].toString()}
                  onChangeText={handleMinPriceChange}
                  keyboardType="numeric"
                  placeholder="Min"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                />
                <TouchableOpacity 
                  style={styles.priceButton}
                  onPress={() => adjustPrice(true, true)}
                >
                  <Icon name="add" size={16} color="#8B5CF6" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.priceInputGroup}>
              <Text style={styles.priceLabel}>Max Price</Text>
              <View style={styles.priceInputContainer}>
                <TouchableOpacity 
                  style={styles.priceButton}
                  onPress={() => adjustPrice(false, false)}
                >
                  <Icon name="remove" size={16} color="#8B5CF6" />
                </TouchableOpacity>
                <TextInput
                  style={styles.priceInput}
                  value={filters.priceRange[1].toString()}
                  onChangeText={handleMaxPriceChange}
                  keyboardType="numeric"
                  placeholder="Max"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                />
                <TouchableOpacity 
                  style={styles.priceButton}
                  onPress={() => adjustPrice(false, true)}
                >
                  <Icon name="add" size={16} color="#8B5CF6" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Minimum Rating</Text>
          <View style={styles.ratingContainer}>
            {ratings.map((rating) => (
              <TouchableOpacity
                key={rating}
                style={[styles.ratingChip, filters.rating >= rating && styles.activeRatingChip]}
                onPress={() => handleRatingSelect(rating)}
              >
                <Icon name="star" size={20} color={filters.rating >= rating ? "#FFFFFF" : "rgba(255, 255, 255, 0.3)"} />
                <Text style={[styles.ratingText, filters.rating >= rating && styles.activeRatingText]}>{rating}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.sortContainer}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.sortOption, filters.sortBy === option && styles.activeSortOption]}
                onPress={() => handleSortSelect(option)}
              >
                <Text style={[styles.sortText, filters.sortBy === option && styles.activeSortText]}>{option}</Text>
                {filters.sortBy === option && <Icon name="checkmark" size={20} color="#8B5CF6" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Apply Filter</Text>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.5)",
    backgroundColor: "transparent",
  },
  activeCategoryChip: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  categoryText: {
    fontSize: 14,
    color: "rgba(139, 92, 246, 0.8)",
    fontWeight: "500",
  },
  activeCategoryText: {
    color: "#FFFFFF",
  },
  priceRangeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  priceRangeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.5)",
    backgroundColor: "transparent",
  },
  activePriceRangeChip: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  priceRangeText: {
    fontSize: 14,
    color: "rgba(139, 92, 246, 0.8)",
    fontWeight: "500",
  },
  activePriceRangeText: {
    color: "#FFFFFF",
  },
  customPriceTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 12,
  },
  customPriceContainer: {
    flexDirection: "row",
    gap: 16,
  },
  priceInputGroup: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 8,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 4,
  },
  priceButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    margin: 4,
  },
  priceInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 12,
  },
  ratingChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "transparent",
  },
  activeRatingChip: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  ratingText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
    marginLeft: 4,
  },
  activeRatingText: {
    color: "#FFFFFF",
  },
  sortContainer: {
    gap: 12,
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  activeSortOption: {
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderWidth: 1,
    borderColor: "#8B5CF6",
  },
  sortText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  activeSortText: {
    color: "#FFFFFF",
  },
  bottomActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#8B5CF6",
    backgroundColor: "transparent",
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 16,
    color: "#8B5CF6",
    fontWeight: "bold",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
})

export default Filter
