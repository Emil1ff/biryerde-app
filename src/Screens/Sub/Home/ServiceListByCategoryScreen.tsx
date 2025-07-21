"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Image } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons" // MaterialIcons for VIP badge
import servicesData from "../../../data/services.json" // Adjusted path

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
  exampleProviderName?: string // Added provider name
  isVIP?: boolean // Added VIP status
}

const ServiceListByCategoryScreen = ({ route, navigation }: any) => {
  const { categoryId, categoryName } = route.params
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    const category = servicesData.categories.find((cat) => cat.id === categoryId)
    if (category) {
      // Sort services by rating in descending order
      const sortedServices = [...category.services].sort((a, b) => b.rating - a.rating)
      setServices(sortedServices)
    }
  }, [categoryId])

  const renderServiceItem = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => {
        console.log("Navigating to service:", item.name)
        navigation.navigate("ServiceDetail", { serviceId: item.id, categoryId: categoryId })
      }}
    >
      <Image source={{ uri: item.image }} style={styles.serviceImage} />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        {item.exampleProviderName && (
          <View style={styles.providerContainer}>
            <Text style={styles.providerName}>{item.exampleProviderName}</Text>
            {item.isVIP && <MaterialIcons name="verified" size={16} color="#FFD700" style={styles.vipBadge} />}
          </View>
        )}
        <Text style={styles.servicePrice}>${item.price}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={14} color="#FFC107" />
          <Text style={styles.serviceRating}>{item.rating}</Text>
          <Text style={styles.serviceReviews}>({item.reviews.toLocaleString()} reviews)</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bookmarkButton}>
        <Icon name="bookmark-outline" size={20} color="rgba(255, 255, 255, 0.5)" />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
        <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate("Search")}>
          <Icon name="search-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.servicesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>No services found for this category.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A", // Darker background for consistency
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
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Consistent with ServiceDetailScreen
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Consistent with ServiceDetailScreen
    justifyContent: "center",
    alignItems: "center",
  },
  servicesList: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20, // Add some bottom padding for scrollability
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A", // Darker card background
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000", // Subtle shadow for depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
    borderWidth: 1, // Added border for consistency
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  providerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)", // Slightly lighter grey
    marginRight: 5,
  },
  vipBadge: {
    marginLeft: 5,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B5CF6", // Purple color
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceRating: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 4,
    marginRight: 4,
  },
  serviceReviews: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  bookmarkButton: {
    padding: 8,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyListText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 16,
  },
})

export default ServiceListByCategoryScreen
