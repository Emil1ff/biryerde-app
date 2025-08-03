import type React from "react"
import { View, StyleSheet } from "react-native"

interface PaginationDotsProps {
  currentIndex: number
  totalDots: number
}

const PaginationDots: React.FC<PaginationDotsProps> = ({ currentIndex, totalDots }) => {
  return (
    <View style={styles.container}>
      {[...Array(totalDots)].map((_, index) => (
        <View key={index} style={[styles.dot, index === currentIndex ? styles.activeDot : styles.inactiveDot]} />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#8B5CF6",
    width: 24,
    borderRadius: 12,
  },
  inactiveDot: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
})

export default PaginationDots
