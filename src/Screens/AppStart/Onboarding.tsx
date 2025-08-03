"use client"
import type React from "react"
import { useState, useRef } from "react"
import { View, StyleSheet, Dimensions, SafeAreaView } from "react-native"
import type { OnboardingProps } from "../../Types/navigation"
import Content1 from "../../Components/Onboarding/Content1"
import Content2 from "../../Components/Onboarding/Content2"
import Content3 from "../../Components/Onboarding/Content3"
import PaginationDots from "../../Components/Onboarding/PaginationDots"
import PagerView from "react-native-pager-view"

const { width } = Dimensions.get("window")

interface OnboardingContentProps {
  onNext: () => void
  onGetStarted: () => void
  isActive: boolean
}

interface OnboardingData {
  id: number
  component: React.ComponentType<OnboardingContentProps>
}

const Onboarding: React.FC<OnboardingProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const pagerRef = useRef<PagerView>(null)

  const onboardingData: OnboardingData[] = [
    { id: 1, component: Content1 },
    { id: 2, component: Content2 },
    { id: 3, component: Content3 },
  ]

  const handleNext = (): void => {
    if (currentIndex < onboardingData.length - 1) {
      pagerRef.current?.setPage(currentIndex + 1)
    } else {
      handleGetStarted()
    }
  }

  const handleGetStarted = (): void => {
    navigation.navigate("Auth", { fromOnboarding: true })
  }

  return (
    <SafeAreaView style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCurrentIndex(e.nativeEvent.position)}
      >
        {onboardingData.map((item, index) => {
          const CurrentComponent = item.component
          return (
            <View key={item.id} style={styles.page}>
              <CurrentComponent onNext={handleNext} onGetStarted={handleGetStarted} isActive={index === currentIndex} />
            </View>
          )
        })}
      </PagerView>

      <PaginationDots currentIndex={currentIndex} totalDots={onboardingData.length} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
    width: width,
  },
})

export default Onboarding
