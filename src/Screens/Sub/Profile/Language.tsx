"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

interface LanguageOption {
  id: string
  name: string
  isSuggested?: boolean
}

const Language: React.FC<any> = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("English (US)")

  const suggestedLanguages: LanguageOption[] = [
    { id: "1", name: "English (US)", isSuggested: true },
    { id: "2", name: "English (UK)", isSuggested: true },
  ]

  const otherLanguages: LanguageOption[] = [
    { id: "3", name: "Mandarin" },
    { id: "4", name: "Hindi" },
    { id: "5", name: "Spanish" },
    { id: "6", name: "French" },
    { id: "7", name: "Arabic" },
    { id: "8", name: "Bengali" },
    { id: "9", name: "Russian" },
    { id: "10", name: "Indonesian" },
  ]

  const renderLanguageOption = (lang: LanguageOption) => (
    <TouchableOpacity
      key={lang.id}
      style={styles.languageItem}
      onPress={() => setSelectedLanguage(lang.name)}
      activeOpacity={0.7}
    >
      <Text style={styles.languageName}>{lang.name}</Text>
      {selectedLanguage === lang.name ? (
        <Icon name="radio-button-on" size={24} color="#8B5CF6" />
      ) : (
        <Icon name="radio-button-off" size={24} color="rgba(255, 255, 255, 0.4)" />
      )}
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested</Text>
          <View style={styles.optionsContainer}>{suggestedLanguages.map(renderLanguageOption)}</View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          <View style={styles.optionsContainer}>{otherLanguages.map(renderLanguageOption)}</View>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 16,
  },
  optionsContainer: {
    marginTop: 10,
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E0E0E0",
  },
})

export default Language
