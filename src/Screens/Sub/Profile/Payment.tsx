"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Alert } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import LinearGradient from "react-native-linear-gradient"

interface PaymentMethod {
  id: string
  name: string
  icon: string
  iconType?: "ionicon" | "material-community" 
  lastDigits?: string
  connected: boolean
  color: string
}

const Payment: React.FC<any> = ({ navigation }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      name: "PayPal",
      icon: "logo-paypal",
      connected: true,
      color: "#0070BA",
    },
    {
      id: "2",
      name: "Google Pay",
      icon: "logo-google",
      connected: true,
      color: "#4285F4",
    },
    {
      id: "3",
      name: "Apple Pay",
      icon: "logo-apple",
      connected: true,
      color: "#000000",
    },
    {
      id: "4",
      name: "Mastercard",
      icon: "card",
      lastDigits: "4679",
      connected: true,
      color: "#FF5F00", 
    },
  ])

  const handleDisconnect = (methodId: string, methodName: string) => {
    Alert.alert("Disconnect Payment Method", `Are you sure you want to disconnect ${methodName}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Disconnect",
        style: "destructive",
        onPress: () => {
          setPaymentMethods((prevMethods) =>
            prevMethods.map((method) => (method.id === methodId ? { ...method, connected: false } : method)),
          )
          console.log(`Disconnected ${methodName}`)
        },
      },
    ])
  }

  const renderPaymentMethod = (method: PaymentMethod) => (
    <View key={method.id} style={styles.paymentMethodItem}>
      <View style={styles.methodLeft}>
        <View style={[styles.methodIconContainer, { backgroundColor: method.color + "20" }]}>
          {method.iconType === "material-community" ? (
            // If you had MaterialCommunityIcons, you'd use it here
            <Icon name={method.icon} size={24} color={method.color} />
          ) : (
            <Icon name={method.icon} size={24} color={method.color} />
          )}
        </View>
        <Text style={styles.methodName}>
          {method.name} {method.lastDigits ? `(•••• ${method.lastDigits})` : ""}
        </Text>
      </View>
      {method.connected ? (
        <TouchableOpacity style={styles.connectedButton} onPress={() => handleDisconnect(method.id, method.name)}>
          <Text style={styles.connectedText}>Connected</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.connectButton}>
          <Text style={styles.connectText}>Connect</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.paymentMethodsList}>{paymentMethods.map(renderPaymentMethod)}</View>

        <TouchableOpacity
          style={styles.addNewCardButton}
          onPress={() => navigation.navigate("AddNewCard")} // Navigate to AddNewCardScreen
        >
          <LinearGradient
            colors={["#8B5CF6", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addNewCardGradient}
          >
            <Text style={styles.addNewCardText}>Add New Card</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  paymentMethodsList: {
    marginTop: 10,
    marginBottom: 30,
  },
  paymentMethodItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  methodLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  methodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  methodName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E0E0E0",
  },
  connectedButton: {
    backgroundColor: "rgba(16, 185, 129, 0.2)", 
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  connectedText: {
    fontSize: 13,
    color: "#10B981", 
    fontWeight: "bold",
  },
  connectButton: {
    backgroundColor: "rgba(139, 92, 246, 0.2)", 
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  connectText: {
    fontSize: 13,
    color: "#8B5CF6",
    fontWeight: "bold",
  },
  addNewCardButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 40,
  },
  addNewCardGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  addNewCardText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
})

export default Payment
