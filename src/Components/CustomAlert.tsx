"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, Pressable } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

const { width, height } = Dimensions.get("window")

interface CustomAlertButton {
  text: string
  onPress: () => void
  style?: "default" | "cancel" | "destructive"
}

interface CustomAlertProps {
  isVisible: boolean
  title: string
  message: string
  buttons?: CustomAlertButton[]
  onClose: () => void
}

const CustomAlert: React.FC<CustomAlertProps> = ({ isVisible, title, message, buttons, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.7)).current
  const [renderAlert, setRenderAlert] = useState(isVisible)

  useEffect(() => {
    if (isVisible) {
      setRenderAlert(true)
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setRenderAlert(false)
        if (isVisible === false) {
          onClose()
        }
      })
    }
  }, [isVisible, fadeAnim, scaleAnim, onClose])

  if (!renderAlert) {
    return null
  }

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.alertContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={width * 0.05} color="#FFFFFF" />
          </Pressable>
        </View>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonContainer}>
          {buttons && buttons.length > 0 ? (
            buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style === "cancel" && styles.cancelButton,
                  button.style === "destructive" && styles.destructiveButton,
                  buttons.length > 1 && index === 0 && styles.firstButton,
                  buttons.length > 1 && index === buttons.length - 1 && styles.lastButton,
                ]}
                onPress={() => {
                  button.onPress()
                  onClose()
                }}
              >
                <Text
                  style={[
                    styles.buttonText,
                    button.style === "cancel" && styles.cancelButtonText,
                    button.style === "destructive" && styles.destructiveButtonText,
                  ]}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  alertContainer: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: width * 0.06,
    width: "85%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 1,
    borderColor: "#333333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
    marginRight: width * 0.05,
  },
  closeButton: {
    padding: width * 0.01,
  },
  message: {
    fontSize: width * 0.04,
    color: "#E0E0E0",
    textAlign: "center",
    marginBottom: height * 0.03,
    lineHeight: width * 0.055,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    backgroundColor: "#8B5CF6",
    borderRadius: 15,
    paddingVertical: height * 0.018,
    flex: 1,
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  firstButton: {
    marginRight: 10,
  },
  lastButton: {
    marginLeft: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: width * 0.045,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#424242",
  },
  cancelButtonText: {
    color: "#E0E0E0",
  },
  destructiveButton: {
    backgroundColor: "#8B5CF6",
    shadowColor: "#8B5CF6",
  },
  destructiveButtonText: {
    color: "#FFFFFF",
  },
})

export default CustomAlert
