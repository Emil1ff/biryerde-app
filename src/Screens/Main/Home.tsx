"use client"
import type React from "react"
import { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  Animated,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../../Types/navigation"

const { width: screenWidth } = Dimensions.get("window")

interface Service {
  id: string
  name: string
  icon: string
  color: string
  iconFamily: "Ionicons" | "MaterialIcons"
}

interface PopularService {
  id: string
  providerName: string
  serviceName: string
  price: number
  rating: number
  reviews: number
  image: string
  backgroundColor: string
  category: string
}

interface OfferItem {
  id: string
  percentage: string
  title: string
  description: string
  colors: string[]
  image: string
}

interface HomeProps {
  onScroll: (event: any) => void
}

const numColumns = 4 // Xidmət gridi üçün sütun sayı
const INITIAL_DISPLAY_COUNT = 7 // Başlanğıcda göstəriləcək xidmətlərin sayı
const MORE_BUTTON_ID = "more-button" // "More" düyməsi üçün unikal ID

const Home: React.FC<HomeProps> = ({ onScroll }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0)
  const [displayedServiceCount, setDisplayedServiceCount] = useState(INITIAL_DISPLAY_COUNT) // Göstərilən xidmətlərin sayı

  const carouselRef = useRef<FlatList>(null)

  const offers: OfferItem[] = [
    {
      id: "1",
      percentage: "30%",
      title: "Today's Special!",
      description: "Get discount for every order, only valid for today",
      colors: ["#8B5CF6", "#A855F7"],
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    },
    {
      id: "2",
      percentage: "25%",
      title: "Friday Special!",
      description: "Get discount for every order, only valid for today",
      colors: ["#EF4444", "#F87171"],
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    },
    {
      id: "3",
      percentage: "40%",
      title: "New Promo!",
      description: "Get discount for every order, only valid for today",
      colors: ["#F59E0B", "#FBBF24"],
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    },
    {
      id: "4",
      percentage: "35%",
      title: "Weekend Special!",
      description: "Get discount for every order, only valid for today",
      colors: ["#10B981", "#34D399"],
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
    },
  ]

  const baseServices: Service[] = [
    { id: "1", name: "Cleaning", icon: "home-outline", color: "#8B5CF6", iconFamily: "Ionicons" },
    { id: "2", name: "Repairing", icon: "build-outline", color: "#F59E0B", iconFamily: "Ionicons" },
    { id: "3", name: "Painting", icon: "brush-outline", color: "#3B82F6", iconFamily: "Ionicons" },
    { id: "4", name: "Laundry", icon: "shirt-outline", color: "#F59E0B", iconFamily: "Ionicons" },
    { id: "5", name: "Appliance", icon: "tv-outline", color: "#EF4444", iconFamily: "Ionicons" },
    { id: "6", name: "Plumbing", icon: "water-outline", color: "#10B981", iconFamily: "Ionicons" },
    { id: "7", name: "Shifting", icon: "cube-outline", color: "#06B6D4", iconFamily: "Ionicons" },
    { id: "8", name: "Gardening", icon: "leaf-outline", color: "#22C55E", iconFamily: "Ionicons" },
    { id: "9", name: "Electrical", icon: "flash-outline", color: "#FBBF24", iconFamily: "Ionicons" },
    { id: "10", name: "Carpentry", icon: "hammer-outline", color: "#8B4513", iconFamily: "Ionicons" },
    { id: "11", name: "Beauty", icon: "cut-outline", color: "#EC4899", iconFamily: "Ionicons" },
  ]

  // Göstəriləcək xidmətlər siyahısını dinamik olaraq hazırlayın
  const services = baseServices.slice(0, displayedServiceCount)
  if (displayedServiceCount < baseServices.length) {
    services.push({
      id: MORE_BUTTON_ID,
      name: "More",
      icon: "ellipsis-horizontal",
      color: "#8B5CF6", // Bənövşəyi tema
      iconFamily: "Ionicons",
    })
  }

  const allPopularServices: PopularService[] = [
    {
      id: "1",
      providerName: "Jenny Wilson",
      serviceName: "House Cleaning",
      price: 25,
      rating: 4.8,
      reviews: 8289,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      backgroundColor: "#E0F2FE",
      category: "Cleaning",
    },
    {
      id: "2",
      providerName: "Robert Fox",
      serviceName: "Floor Cleaning",
      price: 20,
      rating: 4.9,
      reviews: 6182,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      backgroundColor: "#FEE2E2",
      category: "Cleaning",
    },
    {
      id: "3",
      providerName: "Kristin Watson",
      serviceName: "Washing Clothes",
      price: 22,
      rating: 4.7,
      reviews: 7938,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      backgroundColor: "#FEF3C7",
      category: "Cleaning",
    },
    {
      id: "4",
      providerName: "John Smith",
      serviceName: "AC Repairing",
      price: 35,
      rating: 4.6,
      reviews: 5421,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      backgroundColor: "#E0F2FE",
      category: "Repairing",
    },
    {
      id: "5",
      providerName: "Sarah Johnson",
      serviceName: "Wall Painting",
      price: 45,
      rating: 4.8,
      reviews: 3892,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      backgroundColor: "#F3E8FF",
      category: "Painting",
    },
  ]

  const getFilteredServices = () => {
    if (activeServiceTab === "All") {
      return allPopularServices
    }
    return allPopularServices.filter((service) => service.category === activeServiceTab)
  }

  const handleSearch = () => {
    navigation.navigate("Search", { query: searchQuery })
  }

  const handleServicePress = (item: Service) => {
    if (item.id === MORE_BUTTON_ID) {
      // "More" düyməsinə basıldıqda xidmətlərin sayını artır
      setDisplayedServiceCount((prevCount) => {
        const newCount = prevCount + numColumns // Bir sıra (4 ədəd) artır
        return Math.min(newCount, baseServices.length) // Ümumi xidmətlərin sayını keçməsin
      })
    } else {
      // Digər xidmətlərə basıldıqda ServiceListByCategory ekranına yönləndir
      // AllServicesScreen-dəki kimi categoryId və categoryName ötürülür
      navigation.navigate("ServiceListByCategory", { categoryId: item.id, categoryName: item.name })
    }
  }

  const handleSeeAllOffers = () => {
    navigation.navigate("SpecialOffers")
  }

  const handleSeeAllServices = () => {
    navigation.navigate("AllServices")
  }

  const handleSeeAllPopular = () => {
    navigation.navigate("MostPopularServices")
  }

  const handleNotificationPress = () => {
    navigation.navigate("Notification")
  }

  const handleBookmarkPress = () => {
    navigation.navigate("Bookmark")
  }

  const handleFilterPress = () => {
    navigation.navigate("Filter")
  }

  const onOfferScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width
    const index = event.nativeEvent.contentOffset.x / slideSize
    const roundIndex = Math.round(index)
    setCurrentOfferIndex(roundIndex)
  }

  const renderOfferItem = ({ item }: { item: OfferItem }) => (
    <TouchableOpacity style={[styles.offerCard, { width: screenWidth - 40 }]}>
      <LinearGradient colors={item.colors} style={styles.offerGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.offerContent}>
          <View style={styles.offerTextContainer}>
            <Text style={styles.offerPercentage}>{item.percentage}</Text>
            <Text style={styles.offerTitle}>{item.title}</Text>
            <Text style={styles.offerDescription}>{item.description}</Text>
          </View>
          <View style={styles.offerImageContainer}>
            <Image source={{ uri: item.image }} style={styles.offerImage} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )

  const renderServiceItem = ({ item }: { item: Service }) => (
    <TouchableOpacity style={styles.serviceItem} onPress={() => handleServicePress(item)}>
      <View style={[styles.serviceIcon, { backgroundColor: item.color }]}>
        {item.iconFamily === "Ionicons" ? (
          <Icon name={item.icon} size={28} color="#FFFFFF" />
        ) : (
          <MaterialIcons name={item.icon} size={28} color="#FFFFFF" />
        )}
      </View>
      <Text style={styles.serviceName}>{item.name}</Text>
    </TouchableOpacity>
  )

  const renderPopularServiceItem = ({ item }: { item: PopularService }) => (
    <TouchableOpacity style={styles.popularServiceItem}>
      <View style={[styles.popularServiceImage, { backgroundColor: item.backgroundColor }]}>
        <Image source={{ uri: item.image }} style={styles.serviceProviderImage} />
      </View>
      <View style={styles.popularServiceInfo}>
        <Text style={styles.providerName}>{item.providerName}</Text>
        <Text style={styles.popularServiceName}>{item.serviceName}</Text>
        <Text style={styles.servicePrice}>${item.price}</Text>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviews}>| {item.reviews.toLocaleString()} reviews</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.bookmarkButton}>
        <Icon name="bookmark-outline" size={20} color="#8B5CF6" />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  const serviceCategories = ["All", "Cleaning", "Repairing", "Painting"]
  const [activeServiceTab, setActiveServiceTab] = useState("All")

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView // Use Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll} // Pass onScroll prop
        scrollEventThrottle={16} // Important for smooth animation
        contentContainerStyle={{ paddingBottom: 100 }} // Alt çubuk üçün boşluq
      >
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{
                uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
              }}
              style={styles.profileImage}
            />
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Good Morning 👋</Text>
              <Text style={styles.userName}>Andrew Ainsley</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={handleNotificationPress}>
              <Icon name="notifications-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleBookmarkPress}>
              <Icon name="bookmark-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search-outline" size={20} color="rgba(255, 255, 255, 0.5)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
            <Icon name="options-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Special Offers</Text>
            <TouchableOpacity onPress={handleSeeAllOffers}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            ref={carouselRef}
            data={offers}
            renderItem={renderOfferItem}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onOfferScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.carouselContainer}
            snapToInterval={screenWidth - 40 + 20}
            decelerationRate="fast"
          />
          <View style={styles.dotsContainer}>
            {offers.map((_, index) => (
              <View key={index} style={[styles.dot, index === currentOfferIndex && styles.activeDot]} />
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Services</Text>
            <TouchableOpacity onPress={handleSeeAllServices}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={services} // Yenilənmiş xidmətlər siyahısı
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            scrollEnabled={false}
            contentContainerStyle={styles.servicesGrid}
          />
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Most Popular Services</Text>
            <TouchableOpacity onPress={handleSeeAllPopular}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.popularServiceTabs}>
            {serviceCategories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[styles.tab, activeServiceTab === category && styles.activeTab]}
                onPress={() => setActiveServiceTab(category)}
              >
                <Text style={[styles.tabText, activeServiceTab === category && styles.activeTabText]}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <FlatList
            data={getFilteredServices()}
            renderItem={renderPopularServiceItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.popularServicesList}
          />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingBottom: 30,
  },
  scrollView: {
    flex: 1,
    marginTop: 50,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerActions: {
    flexDirection: "row",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    paddingVertical: 12,
    marginLeft: 12,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  seeAllText: {
    fontSize: 16,
    color: "#8B5CF6",
    fontWeight: "600",
  },
  carouselContainer: {
    paddingLeft: 20,
  },
  offerCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 20,
  },
  offerGradient: {
    padding: 20,
  },
  offerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  offerTextContainer: {
    flex: 1,
  },
  offerPercentage: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  offerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  offerDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  offerImageContainer: {
    width: 120,
    height: 120,
  },
  offerImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#8B5CF6",
    width: 24,
  },
  servicesGrid: {
    paddingHorizontal: 20,
  },
  serviceItem: {
    flex: 1,
    alignItems: "center",
    marginBottom: 20,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "500",
  },
  popularServiceTabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.5)",
  },
  activeTab: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  tabText: {
    fontSize: 14,
    color: "rgba(139, 92, 246, 0.8)",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  popularServicesList: {
    paddingHorizontal: 20,
  },
  popularServiceItem: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  popularServiceImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  serviceProviderImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  popularServiceInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 4,
  },
  popularServiceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B5CF6",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 4,
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default Home
