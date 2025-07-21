"use client"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Dimensions } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import servicesData from "../../../data/services.json"

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
}

const { width } = Dimensions.get("window")
const numColumns = 2 

const AllServicesScreen = ({ navigation }: any) => {
  const [allCategories, setAllCategories] = useState<ServiceCategory[]>([])

  useEffect(() => {
    setAllCategories(servicesData.categories)
  }, [])

  const renderCategoryGridItem = ({ item }: { item: ServiceCategory }) => (
    <TouchableOpacity
      style={styles.categoryGridCard}
      onPress={() => navigation.navigate("ServiceListByCategory", { categoryId: item.id, categoryName: item.name })}
    >
      <View style={[styles.categoryGridIcon, { backgroundColor: item.color }]}>
        {item.iconFamily === "Ionicons" ? (
          <Icon name={item.icon} size={28} color="#FFFFFF" />
        ) : (
          <MaterialIcons name={item.icon} size={28} color="#FFFFFF" />
        )}
      </View>
      <Text style={styles.categoryGridName}>{item.name}</Text>
      <Text style={styles.categoryProvidersCount}>{item.providersCount} Providers</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Services</Text>
        <TouchableOpacity style={styles.searchButton} onPress={() => navigation.navigate("Search")}>
          <Icon name="search-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={allCategories}
        renderItem={renderCategoryGridItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.categoryGridList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A", 
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
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryGridList: {
    paddingHorizontal: 15, 
    paddingVertical: 15,
  },
  categoryGridCard: {
    width: (width - 30 - 15) / numColumns, 
    marginHorizontal: 7.5, 
    marginBottom: 15, 
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 25, 
    paddingHorizontal: 15,
    borderRadius: 16,
    backgroundColor: "#1A1A1A", 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  categoryGridIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12, 
  },
  categoryGridName: {
    fontSize: 16, 
    fontWeight: "700", 
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 8, 
  },
  categoryProvidersCount: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)", 
    marginTop: 4,
  },
})

export default AllServicesScreen
