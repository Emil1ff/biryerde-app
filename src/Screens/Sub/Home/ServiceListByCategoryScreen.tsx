import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Pressable, SafeAreaView, FlatList, Image, Dimensions } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import servicesData from "../../../data/services.json"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

const responsiveWidth = (percentage: number) => (screenWidth * percentage) / 100
const responsiveHeight = (percentage: number) => (screenHeight * percentage) / 100
const responsiveFontSize = (size: number) => size * (screenWidth / 375)

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
  exampleProviderName?: string
  isVIP?: boolean
}

const ServiceListByCategoryScreen = ({ route, navigation }: any) => {
  const { categoryId, categoryName } = route.params
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    const category = servicesData.categories.find((cat) => cat.id === categoryId)
    if (category) {
      const sortedServices = [...category.services].sort((a, b) => b.rating - a.rating)
      setServices(sortedServices)
    }
  }, [categoryId])

  const renderServiceItem = ({ item }: { item: Service }) => (
    <Pressable
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
            {item.isVIP && (
              <MaterialIcons name="verified" size={responsiveFontSize(16)} color="#FFD700" style={styles.vipBadge} />
            )}
          </View>
        )}
        <Text style={styles.servicePrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={responsiveFontSize(14)} color="#FFC107" />
          <Text style={styles.serviceRating}>{item.rating}</Text>
          <Text style={styles.serviceReviews}>({item.reviews.toLocaleString()} reviews)</Text>
        </View>
      </View>
      <Pressable style={styles.bookmarkButton}>
        {/* <Icon name="bookmark-outline" size={responsiveFontSize(20)} color="rgba(255, 255, 255, 0.5)" /> */}
      </Pressable>
    </Pressable>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={responsiveFontSize(24)} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>{categoryName}</Text>
        <Pressable style={styles.searchButton} onPress={() => navigation.navigate("Search")}>
          <Icon name="search-outline" size={responsiveFontSize(24)} color="#FFFFFF" />
        </Pressable>
      </View>
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.servicesList}
        showsVerticalScrollIndicator={false}
        numColumns={2} 
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
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(6),
    paddingBottom: responsiveHeight(2),
  },
  backButton: {
    width: responsiveFontSize(40),
    height: responsiveFontSize(40),
    borderRadius: responsiveFontSize(20),
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  searchButton: {
    width: responsiveFontSize(40),
    height: responsiveFontSize(40),
    borderRadius: responsiveFontSize(20),
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  servicesList: {
    paddingHorizontal: responsiveWidth(2.5), // Adjust padding for spacing between cards
    paddingTop: responsiveHeight(1),
    paddingBottom: responsiveHeight(2),
    justifyContent: "space-between", // Distribute items evenly
  },
  serviceCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: responsiveFontSize(16),
    padding: responsiveWidth(3),
    marginBottom: responsiveHeight(2),
    width: responsiveWidth(46), // Approximately 2 cards per row with spacing
    height: responsiveHeight(30), // Fixed height for consistent card size
    marginHorizontal: responsiveWidth(1.5), // Spacing between cards
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    alignItems: "center", // Center content horizontally
    position: "relative", // For absolute positioning of bookmark button
  },
  serviceImage: {
    width: "100%", // Image takes full width of the card
    height: responsiveHeight(12), // Fixed height for the image
    borderRadius: responsiveFontSize(12),
    marginBottom: responsiveHeight(1.5),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    resizeMode: "cover", // Ensure image covers the area
  },
  serviceInfo: {
    flex: 1,
    width: "100%", // Ensure info takes full width
  },
  serviceName: {
    fontSize: responsiveFontSize(16),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: responsiveHeight(0.5),
  },
  providerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsiveHeight(0.5),
  },
  providerName: {
    fontSize: responsiveFontSize(12),
    color: "rgba(255, 255, 255, 0.7)",
    marginRight: responsiveWidth(1),
  },
  vipBadge: {
    marginLeft: responsiveWidth(1),
  },
  servicePrice: {
    fontSize: responsiveFontSize(16),
    fontWeight: "600",
    color: "#8B5CF6",
    marginBottom: responsiveHeight(0.5),
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceRating: {
    fontSize: responsiveFontSize(12),
    color: "#FFFFFF",
    marginLeft: responsiveWidth(1),
    marginRight: responsiveWidth(1),
  },
  serviceReviews: {
    fontSize: responsiveFontSize(12),
    color: "rgba(255, 255, 255, 0.6)",
  },
  bookmarkButton: {
    position: "absolute",
    top: responsiveHeight(1.5),
    right: responsiveWidth(3),
    padding: responsiveWidth(1.5),
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    borderRadius: responsiveFontSize(15),
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: responsiveHeight(5),
  },
  emptyListText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: responsiveFontSize(16),
  },
})

export default ServiceListByCategoryScreen
