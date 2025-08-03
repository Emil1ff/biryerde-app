"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, Easing } from "react-native"
import LinearGradient from "react-native-linear-gradient"

const { width, height } = Dimensions.get("window")

interface OnboardingContent2Props {
  onNext: () => void
  onGetStarted: () => void
  isActive: boolean
}

const Content2: React.FC<OnboardingContent2Props> = ({ onNext, isActive }) => {
  const imageAnim = useRef(new Animated.Value(0)).current
  const titleAnim = useRef(new Animated.Value(0)).current
  const buttonAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.timing(imageAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(titleAnim, {
          toValue: 1,
          duration: 900,
          delay: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim, {
          toValue: 1,
          duration: 800,
          delay: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      imageAnim.setValue(0)
      titleAnim.setValue(0)
      buttonAnim.setValue(0)
    }
  }, [isActive, imageAnim, titleAnim, buttonAnim])

  const imageTranslateY = imageAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  })
  const imageScale = imageAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  })
  const titleTranslateY = titleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  })
  const buttonTranslateY = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  })

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: imageAnim,
            transform: [{ translateY: imageTranslateY }, { scale: imageScale }],
          },
        ]}
      >
        <Image source={require("../../Assets/images/onboarding/2.png")} style={styles.image} resizeMode="contain" />
      </Animated.View>
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: titleAnim,
            transform: [{ translateY: titleTranslateY }],
          },
        ]}
      >
        The best results and your satisfaction is our top priority
      </Animated.Text>
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: buttonAnim,
            transform: [{ translateY: buttonTranslateY }],
          },
        ]}
      >
        <TouchableOpacity onPress={onNext} activeOpacity={0.8}>
          <LinearGradient colors={["#8B5CF6", "#A855F7"]} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginVertical: 30,
    lineHeight: 36,
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
})

export default Content2
