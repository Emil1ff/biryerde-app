"use client"
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

const AllPhotosAndVideosScreen = ({ navigation, route }: any) => {
  const { serviceId, categoryId } = route.params
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Photos & Videos</Text>
        <View style={{ width: 40 }} /> 
      </View>
      <View style={styles.content}>
        <Text style={styles.contentText}>
          Displaying all photos and videos for Service ID: {serviceId} in Category ID: {categoryId}
        </Text>
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
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  contentText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
  },
})

export default AllPhotosAndVideosScreen
