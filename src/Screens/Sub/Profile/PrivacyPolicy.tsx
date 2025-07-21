"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

const PrivacyPolicy: React.FC<any> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>1. Types of Data We Collect</Text>
          <Text style={styles.paragraph}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Text>
          <Text style={styles.paragraph}>
            We collect information you provide directly to us, such as when you create or modify your account, request
            on-demand services, contact customer support, or otherwise communicate with us. This information may include
            your name, email address, phone number, postal address, profile picture, payment method, and other
            information you choose to provide.
          </Text>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>2. Use of Your Personal Data</Text>
          <Text style={styles.paragraph}>
            Magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Text>
          <Text style={styles.paragraph}>
            We may use the information we collect about you to: provide, maintain, and improve our Services, including,
            for example, to facilitate payments, send receipts, provide products and services you request (and send
            related information), develop new features, provide customer support to users, authenticate users, and send
            product updates and administrative messages.
          </Text>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>3. Disclosure of Your Personal Data</Text>
          <Text style={styles.paragraph}>
            Consequat id pariatur. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit
            officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
          </Text>
          <Text style={styles.paragraph}>
            We may share your information with third parties who provide services on our behalf, such as payment
            processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
            These service providers may have access to your personal information needed to perform their functions but
            are not permitted to share or use such information for any other purposes.
          </Text>
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 24,
    marginBottom: 10,
  },
})

export default PrivacyPolicy
