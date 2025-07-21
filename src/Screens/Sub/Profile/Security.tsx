"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Switch } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

interface SecurityOption {
  id: string
  title: string
  icon: string
  type: "switch" | "navigation" | "action"
  value?: boolean
  onPress?: () => void
}

const Security: React.FC<any> = ({ navigation }) => {
  const [rememberMe, setRememberMe] = useState(true)
  const [faceId, setFaceId] = useState(false)
  const [biometricId, setBiometricId] = useState(false)

  const securityOptions: SecurityOption[] = [
    {
      id: "1",
      title: "Remember Me",
      icon: "person-outline",
      type: "switch",
      value: rememberMe,
      onPress: () => setRememberMe(!rememberMe),
    },
    {
      id: "2",
      title: "Face ID",
      icon: "happy-outline",
      type: "switch",
      value: faceId,
      onPress: () => setFaceId(!faceId),
    },
    {
      id: "3",
      title: "Biometric ID",
      icon: "finger-print-outline",
      type: "switch",
      value: biometricId,
      onPress: () => setBiometricId(!biometricId),
    },
    {
      id: "4",
      title: "Google Authenticator",
      icon: "key-outline",
      type: "navigation",
      onPress: () => console.log("Navigate to Google Authenticator settings"),
    },
    {
      id: "5",
      title: "Change PIN",
      icon: "lock-closed-outline",
      type: "navigation",
      onPress: () => console.log("Navigate to Change PIN screen"),
    },
    {
      id: "6",
      title: "Change Password",
      icon: "lock-open-outline",
      type: "navigation",
      onPress: () => console.log("Navigate to Change Password screen"),
    },
  ]

  const renderSecurityOption = (option: SecurityOption) => (
    <TouchableOpacity key={option.id} style={styles.optionItem} onPress={option.onPress} activeOpacity={0.7}>
      <View style={styles.optionLeft}>
        <View style={styles.optionIconContainer}>
          <Icon name={option.icon} size={22} color="#8B5CF6" />
        </View>
        <Text style={styles.optionTitle}>{option.title}</Text>
      </View>
      <View style={styles.optionRight}>
        {option.type === "switch" ? (
          <Switch
            value={option.value}
            onValueChange={option.onPress}
            trackColor={{ false: "#424242", true: "#8B5CF6" }}
            thumbColor={option.value ? "#FFFFFF" : "#E0E0E0"}
            ios_backgroundColor="#424242"
          />
        ) : (
          <Icon name="chevron-forward" size={24} color="rgba(255, 255, 255, 0.5)" />
        )}
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsContainer}>{securityOptions.map(renderSecurityOption)}</View>
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
  optionsContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(139, 92, 246, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E0E0E0",
  },
  optionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
})

export default Security
