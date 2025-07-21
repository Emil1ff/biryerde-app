"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import LinearGradient from "react-native-linear-gradient"

interface ContactOption {
  id: string
  title: string
  icon: string
  color: string
  onPress: () => void
}

const Contact: React.FC<any> = ({ navigation }) => {
  const contactOptions: ContactOption[] = [
    {
      id: "1",
      title: "WhatsApp",
      icon: "logo-whatsapp",
      color: "#25D366",
      onPress: () => console.log("Open WhatsApp"),
    },
    {
      id: "2",
      title: "Website",
      icon: "globe-outline",
      color: "#3B82F6",
      onPress: () => console.log("Open Website"),
    },
    {
      id: "3",
      title: "Facebook",
      icon: "logo-facebook",
      color: "#1877F2",
      onPress: () => console.log("Open Facebook"),
    },
    {
      id: "4",
      title: "Twitter",
      icon: "logo-twitter",
      color: "#1DA1F2",
      onPress: () => console.log("Open Twitter"),
    },
    {
      id: "5",
      title: "Instagram",
      icon: "logo-instagram",
      color: "#C13584",
      onPress: () => console.log("Open Instagram"),
    },
  ]

  const renderContactOption = (option: ContactOption) => (
    <TouchableOpacity key={option.id} style={styles.contactItem} onPress={option.onPress} activeOpacity={0.7}>
      <View style={[styles.contactIconContainer, { backgroundColor: option.color + "20" }]}>
        <Icon name={option.icon} size={24} color={option.color} />
      </View>
      <Text style={styles.contactTitle}>{option.title}</Text>
      <Icon name="chevron-forward" size={24} color="rgba(255, 255, 255, 0.5)" />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Icon name="search-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate("HelpCenterFAQ")} // Navigate back to FAQ screen
        >
          <Text style={styles.tabText}>FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.activeTab]} onPress={() => {}}>
          <Text style={[styles.tabText, styles.activeTabText]}>Contact Us</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Service</Text>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => navigation.navigate("CustomerServiceChat")} // Navigate to chat screen
          >
            <LinearGradient
              colors={["#8B5CF6", "#A855F7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.chatButtonGradient}
            >
              <Icon name="chatbubble-ellipses-outline" size={24} color="#FFFFFF" />
              <Text style={styles.chatButtonText}>Chat with us</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Media</Text>
          <View style={styles.contactList}>{contactOptions.map(renderContactOption)}</View>
        </View>
      </ScrollView>
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
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "#8B5CF6",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 16,
  },
  chatButton: {
    borderRadius: 10,
    overflow: "hidden",
  },
  chatButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  chatButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 10,
  },
  contactList: {
    marginTop: 10,
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  contactTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#E0E0E0",
  },
})

export default Contact
