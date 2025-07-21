"use client"

import type React from "react"
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Platform } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import { useEffect, useState } from "react"
import { CallScreenProps } from "../../Types/navigation"

const Call: React.FC<CallScreenProps> = ({ navigation, route }) => {
  const { contactName, contactImage } = route.params
  const [callDuration, setCallDuration] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((prevDuration) => prevDuration + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: contactImage }} style={styles.profileImage} />
          <View style={styles.bubbleContainer}>
            {Array.from({ length: 15 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.bubble,
                  {
                    top: Math.random() * 100 + "%",
                    left: Math.random() * 100 + "%",
                    width: Math.random() * 10 + 5,
                    height: Math.random() * 10 + 5,
                    opacity: Math.random() * 0.5 + 0.3,
                  },
                ]}
              />
            ))}
          </View>
        </View>
        <Text style={styles.contactName}>{contactName}</Text>
        <Text style={styles.callDuration}>{formatDuration(callDuration)} minutes</Text>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton}>
          <LinearGradient
            colors={["#EF4444", "#DC2626"]} // Red gradient for end call
            style={styles.controlButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon name="close-outline" size={30} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <LinearGradient
            colors={["#8B5CF6", "#A855F7"]}
            style={styles.controlButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon name="volume-mute-outline" size={30} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <LinearGradient
            colors={["#8B5CF6", "#A855F7"]}
            style={styles.controlButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon name="volume-high-outline" size={30} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "android" ? 40 : 60,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginTop:30,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  profileImageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
  },
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    zIndex: 2,
  },
  bubbleContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 100,
    overflow: "hidden",
    backgroundColor: "#8B5CF6", // Background for bubbles
    zIndex: 1,
  },
  bubble: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 999,
  },
  contactName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  callDuration: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.7)",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 50 : 30,
  },
  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
  },
  controlButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default Call
