// "use client"
// import { useState } from "react"
// import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Image, ScrollView } from "react-native"
// import Icon from "react-native-vector-icons/Ionicons"

// const AddressLocationScreen = ({ route, navigation }: any) => {
//   const { serviceId, categoryId, selectedItems, totalPrice, selectedDate, selectedTime, workingHours, appliedPromo } =
//     route.params
//   const [address, setAddress] = useState("255 Grand Park Avenue, New York") 
//   const [locationDetails, setLocationDetails] = useState("") 

//   const handleContinue = () => {
//     navigation.navigate("PaymentMethods", {
//       serviceId,
//       categoryId,
//       selectedItems,
//       totalPrice,
//       selectedDate,
//       selectedTime,
//       workingHours,
//       appliedPromo,
//       address,
//       locationDetails,
//     })
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color="#FFFFFF" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Your Address/Location</Text>
//         <View style={{ width: 40 }} /> 
//       </View>

//       <ScrollView style={styles.scrollView}>
//         <View style={styles.mapContainer}>
//           <Image source={{ uri: "/placeholder.svg?height=200&width=300" }} style={styles.mapImage} resizeMode="cover" />
//           <View style={styles.mapPin}>
//             <Icon name="location-sharp" size={30} color="#8B5CF6" />
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Location Details</Text>
//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.textInput}
//               placeholder="Enter your address"
//               placeholderTextColor="rgba(255, 255, 255, 0.5)"
//               value={address}
//               onChangeText={setAddress}
//             />
//             <TouchableOpacity>
//               <Icon name="pencil-outline" size={20} color="rgba(255, 255, 255, 0.5)" />
//             </TouchableOpacity>
//           </View>
//           <TextInput
//             style={[styles.textInput, styles.multilineInput]}
//             placeholder="Additional details (e.g., apartment number, gate code)"
//             placeholderTextColor="rgba(255, 255, 255, 0.5)"
//             value={locationDetails}
//             onChangeText={setLocationDetails}
//             multiline
//             numberOfLines={3}
//           />
//         </View>
//       </ScrollView>

//       <View style={styles.bottomBar}>
//         <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
//           <Text style={styles.continueButtonText}>Continue</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000000",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingTop: 60,
//     paddingBottom: 20,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "rgba(255, 255, 255, 0.1)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#FFFFFF",
//   },
//   scrollView: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   mapContainer: {
//     width: "100%",
//     height: 200,
//     borderRadius: 16,
//     overflow: "hidden",
//     marginBottom: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(255, 255, 255, 0.05)", 
//   },
//   mapImage: {
//     width: "100%",
//     height: "100%",
//   },
//   mapPin: {
//     position: "absolute",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingBottom: 10, 
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#FFFFFF",
//     marginBottom: 15,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(255, 255, 255, 0.05)",
//     borderRadius: 16,
//     paddingHorizontal: 15,
//     height: 50,
//     marginBottom: 12,
//   },
//   textInput: {
//     flex: 1,
//     color: "#FFFFFF",
//     fontSize: 16,
//   },
//   multilineInput: {
//     height: 100, 
//     paddingTop: 15, 
//     textAlignVertical: "top",
//   },
//   bottomBar: {
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderTopWidth: 1,
//     borderTopColor: "rgba(255, 255, 255, 0.1)",
//     backgroundColor: "#1A1A2E",
//   },
//   continueButton: {
//     backgroundColor: "#8B5CF6",
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: "center",
//   },
//   continueButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// })

// export default AddressLocationScreen


"use client"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Image, ScrollView } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

const AddressLocationScreen = ({ route, navigation }: any) => {
  const { serviceId, categoryId, selectedItems, totalPrice, selectedDate, selectedTime, workingHours, appliedPromo } =
    route.params
  const [address, setAddress] = useState("255 Grand Park Avenue, New York") 
  const [locationDetails, setLocationDetails] = useState("") 
  const handleContinue = () => {
    navigation.navigate("PaymentMethods", {
      serviceId,
      categoryId,
      selectedItems,
      totalPrice,
      selectedDate,
      selectedTime,
      workingHours,
      appliedPromo,
      address,
      locationDetails,
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Address/Location</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.mapContainer}>
          <Image source={{ uri: "/placeholder.svg?height=200&width=300" }} style={styles.mapImage} resizeMode="cover" />
          <View style={styles.mapPin}>
            <Icon name="location-sharp" size={36} color="#8B5CF6" />
          </View>
          <TouchableOpacity style={styles.changeMapButton}>
            <Text style={styles.changeMapButtonText}>Change Location</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Details</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your address"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={address}
              onChangeText={setAddress}
            />
            <TouchableOpacity>
              <Icon name="pencil-outline" size={20} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            placeholder="Additional details (e.g., apartment number, gate code)"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={locationDetails}
            onChangeText={setLocationDetails}
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A", 
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  mapContainer: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 25, 
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  mapPin: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10, 
  },
  changeMapButton: {
    position: "absolute",
    bottom: 15,
    backgroundColor: "rgba(139, 92, 246, 0.8)", 
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  changeMapButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginBottom: 25, 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A", 
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 55, 
    marginBottom: 12,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  textInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  multilineInput: {
    height: 120, 
    paddingTop: 15, 
    textAlignVertical: "top",
    backgroundColor: "#1A1A1A", 
    borderRadius: 16,
    paddingHorizontal: 15,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  bottomBar: {
    paddingVertical: 18, 
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#1A1A2E",
  },
  continueButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 16, 
    paddingHorizontal: 35, 
    alignItems: "center",
    shadowColor: "#8B5CF6", 
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 17, 
    fontWeight: "bold",
  },
})

export default AddressLocationScreen
