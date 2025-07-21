"use client"

import { useState } from "react"

import type React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import LinearGradient from "react-native-linear-gradient"

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

interface ContactOption {
  id: string
  title: string
  icon: string
  color: string
  onPress: () => void
}

const allFaqs: FAQItem[] = [
  {
    id: "1",
    question: "What is Homeo?",
    answer:
      "Homeo is a service booking application that connects users with various service providers for home cleaning, repairs, painting, and more.",
    category: "General",
  },
  {
    id: "2",
    question: "How to use Homeo?",
    answer:
      "Simply browse through categories, select a service, choose a provider, and book your desired service at your convenience.",
    category: "General",
  },
  {
    id: "3",
    question: "How do I cancel a booking?",
    answer:
      "You can cancel a booking from the 'My Bookings' section by selecting the upcoming service and choosing the cancel option.",
    category: "Service",
  },
  {
    id: "4",
    question: "Is Homeo free for use?",
    answer: "The Homeo application is free to download and use. Service charges apply per booking.",
    category: "General",
  },
  {
    id: "5",
    question: "How to make offer in Homeo?",
    answer:
      "Special offers and promotions are regularly updated in the 'Special Offers' section of the app. Keep an eye out for new deals!",
    category: "Service",
  },
  {
    id: "6",
    question: "Why didn't payment working?",
    answer:
      "Please ensure your payment method details are correct and you have sufficient funds. You can also try another payment method or contact your bank.",
    category: "Account",
  },
  {
    id: "7",
    question: "Why are the service prices different?",
    answer:
      "Service prices may vary based on the provider, service type, duration, and additional requests. Always check the details before confirming.",
    category: "Service",
  },
  {
    id: "8",
    question: "Why can't I add new payment method?",
    answer:
      "Ensure you have a stable internet connection and that all card details are entered correctly. If the issue persists, contact support.",
    category: "Account",
  },
  {
    id: "9",
    question: "Why didn't I get the receipt after payment?",
    answer:
      "Receipts are usually sent to your registered email address shortly after payment. Check your spam folder or contact support if you don't receive it.",
    category: "Account",
  },
]

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

const HelpCenter: React.FC<any> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("FAQ")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("General")

  const categories = ["General", "Account", "Service", "Booking", "Payment"]

  const filteredFaqs = allFaqs.filter(
    (faq) =>
      faq.category === activeCategory &&
      (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const toggleFAQ = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }

  const renderFAQItem = (item: FAQItem) => (
    <View key={item.id} style={styles.faqItem}>
      <TouchableOpacity onPress={() => toggleFAQ(item.id)} style={styles.faqQuestionContainer}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Icon
          name={expandedFAQ === item.id ? "chevron-up" : "chevron-down"}
          size={20}
          color="rgba(255, 255, 255, 0.6)"
        />
      </TouchableOpacity>
      {expandedFAQ === item.id && <Text style={styles.faqAnswer}>{item.answer}</Text>}
    </View>
  )

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
        {/* <TouchableOpacity style={styles.searchButton}>
          <Icon name="search-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity> */}
        <View style={styles.bos}></View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "FAQ" && styles.activeTab]}
          onPress={() => setActiveTab("FAQ")}
        >
          <Text style={[styles.tabText, activeTab === "FAQ" && styles.activeTabText]}>FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Contact Us" && styles.activeTab]}
          onPress={() => setActiveTab("Contact Us")}
        >
          <Text style={[styles.tabText, activeTab === "Contact Us" && styles.activeTabText]}>Contact Us</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "FAQ" && (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.searchBarContainer}>
            <Icon name="search-outline" size={20} color="rgba(255, 255, 255, 0.5)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryChipsContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[styles.categoryChip, activeCategory === category && styles.activeCategoryChip]}
                onPress={() => setActiveCategory(category)}
              >
                <Text style={[styles.categoryChipText, activeCategory === category && styles.activeCategoryChipText]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.faqList}>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map(renderFAQItem)
            ) : (
              <View style={styles.emptyState}>
                <Icon name="help-circle-outline" size={80} color="rgba(255, 255, 255, 0.3)" />
                <Text style={styles.emptyStateText}>No FAQs found for this category or search.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {activeTab === "Contact Us" && (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Service</Text>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => console.log("Navigate to Customer Service Chat")}
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
      )}
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
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    paddingVertical: 12,
    marginLeft: 12,
  },
  categoryChipsContainer: {
    marginBottom: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.5)",
    marginRight: 10,
  },
  activeCategoryChip: {
    backgroundColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  categoryChipText: {
    fontSize: 14,
    color: "rgba(139, 92, 246, 0.8)",
    fontWeight: "500",
  },
  activeCategoryChipText: {
    color: "#FFFFFF",
  },
  faqList: {
    marginBottom: 30,
  },
  faqItem: {
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  faqQuestionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#E0E0E0",
    marginRight: 10,
  },
  faqAnswer: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 16,
    paddingBottom: 16,
    lineHeight: 22,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    marginTop: 10,
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
  bos: {
    width:35,
  }
})

export default HelpCenter
