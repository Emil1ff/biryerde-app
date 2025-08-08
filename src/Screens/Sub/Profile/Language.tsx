"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"

import enTranslations from "../../../Assets/lang/en.json"
import azTranslations from "../../../Assets/lang/az.json"
import ruTranslations from "../../../Assets/lang/ru.json"

const { width, height } = Dimensions.get("window")
const responsiveWidth = (percentage: number) => (width * percentage) / 100
const responsiveHeight = (percentage: number) => (height * percentage) / 100
const responsiveFontSize = (size: number) => size * (width / 375)

const allTranslations = {
  en: enTranslations,
  az: azTranslations,
  ru: ruTranslations,
}

interface LanguageOption {
  id: string
  name: string
  localeKey: "en" | "az" | "ru"
  isSuggested?: boolean
}

const Language: React.FC<any> = ({ navigation }) => {
  const [selectedLanguageKey, setSelectedLanguageKey] = useState<"en" | "az" | "ru">("en")
  const nav = useNavigation()

  const t = (key: keyof typeof enTranslations) => {
    return allTranslations[selectedLanguageKey][key] || key
  }

  useEffect(() => {
    const loadLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem("appLocale")
        if (savedLocale && (savedLocale === "en" || savedLocale === "az" || savedLocale === "ru")) {
          setSelectedLanguageKey(savedLocale)
        }
      } catch (error) {
        console.error("Failed to load locale from storage", error)
      }
    }
    loadLocale()
  }, [])

  const handleLanguageSelect = async (localeKey: "en" | "az" | "ru") => {
    setSelectedLanguageKey(localeKey)
    try {
      await AsyncStorage.setItem("appLocale", localeKey)
    } catch (error) {
      console.error("Failed to save locale to storage", error)
    }
  }

  const suggestedLanguages: LanguageOption[] = [
    { id: "1", name: t("englishUS"), localeKey: "en", isSuggested: true },
    { id: "2", name: t("azerbaijan"), localeKey: "az", isSuggested: true },
    { id: "3", name: t("russian"), localeKey: "ru", isSuggested: true },
  ]

  const renderLanguageOption = (lang: LanguageOption) => (
    <TouchableOpacity
      key={lang.id}
      style={styles.languageItem}
      onPress={() => handleLanguageSelect(lang.localeKey)}
      activeOpacity={0.7}
    >
      <Text style={styles.languageName}>{lang.name}</Text>
      {selectedLanguageKey === lang.localeKey ? (
        <Icon name="radio-button-on" size={responsiveFontSize(24)} color="#8B5CF6" />
      ) : (
        <Icon name="radio-button-off" size={responsiveFontSize(24)} color="rgba(255, 255, 255, 0.4)" />
      )}
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={responsiveFontSize(24)} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("language")}</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("selectLanguage")}</Text>
          <View style={styles.optionsContainer}>{suggestedLanguages.map(renderLanguageOption)}</View>
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
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(7),
    paddingBottom: responsiveHeight(2.5),
  },
  backButton: {
    width: responsiveFontSize(40),
    height: responsiveFontSize(40),
    borderRadius: responsiveFontSize(20),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  placeholder: {
    width: responsiveFontSize(40),
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
  },
  section: {
    marginBottom: responsiveHeight(3),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(18),
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: responsiveHeight(2),
  },
  optionsContainer: {
    marginTop: responsiveHeight(1),
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: responsiveFontSize(10),
    paddingVertical: responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(4),
    marginBottom: responsiveHeight(1.5),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  languageName: {
    fontSize: responsiveFontSize(16),
    fontWeight: "600",
    color: "#E0E0E0",
  },
})

export default Language
