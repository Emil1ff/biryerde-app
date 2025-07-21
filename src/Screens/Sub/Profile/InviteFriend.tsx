"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Image } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import LinearGradient from "react-native-linear-gradient"

interface FriendContact {
  id: string
  name: string
  phoneNumber: string
  image: string
  invited: boolean
}

const InviteFriends: React.FC<any> = ({ navigation }) => {
  const [contacts, setContacts] = useState<FriendContact[]>([
    {
      id: "1",
      name: "Tynisha Obey",
      phoneNumber: "+1-XXX-XXX-0198",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      invited: false,
    },
    {
      id: "2",
      name: "Florence Donovan",
      phoneNumber: "+1-XXX-XXX-0199",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      invited: false,
    },
    {
      id: "3",
      name: "Chantel Shelburne",
      phoneNumber: "+1-XXX-XXX-0200",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      invited: false,
    },
    {
      id: "4",
      name: "Maryland Winkles",
      phoneNumber: "+1-XXX-XXX-0201",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      invited: false,
    },
    {
      id: "5",
      name: "Rodolfo Goode",
      phoneNumber: "+1-XXX-XXX-0202",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      invited: false,
    },
    {
      id: "6",
      name: "Barry Sprowls",
      phoneNumber: "+1-XXX-XXX-0203",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      invited: false,
    },
    {
      id: "7",
      name: "Tyra Dillon",
      phoneNumber: "+1-XXX-XXX-0204",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      invited: false,
    },
    {
      id: "8",
      name: "Jamal Esabio",
      phoneNumber: "+1-XXX-XXX-0205",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      invited: false,
    },
    {
      id: "9",
      name: "Pedro Haced",
      phoneNumber: "+1-XXX-XXX-0206",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      invited: false,
    },
    {
      id: "10",
      name: "Clinton McClure",
      phoneNumber: "+1-XXX-XXX-0207",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      invited: false,
    },
  ])

  const handleInvite = (id: string) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) => (contact.id === id ? { ...contact, invited: true } : contact)),
    )
    console.log(`Invited friend with ID: ${id}`)
  }

  const renderFriendItem = ({ item }: { item: FriendContact }) => (
    <View style={styles.friendItem}>
      <Image source={{ uri: item.image }} style={styles.friendImage} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendPhone}>{item.phoneNumber}</Text>
      </View>
      <TouchableOpacity
        style={[styles.inviteButton, item.invited && styles.invitedButton]}
        onPress={() => handleInvite(item.id)}
        disabled={item.invited}
      >
        {item.invited ? (
          <Text style={styles.invitedButtonText}>Invited</Text>
        ) : (
          <LinearGradient
            colors={["#8B5CF6", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.inviteButtonGradient}
          >
            <Text style={styles.inviteButtonText}>Invite</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite Friends</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={contacts}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.friendsList}
        showsVerticalScrollIndicator={false}
      />
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
  friendsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E0E0E0",
    marginBottom: 4,
  },
  friendPhone: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
  },
  inviteButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  inviteButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
  },
  inviteButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  invitedButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
  },
  invitedButtonText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "bold",
  },
})

export default InviteFriends
