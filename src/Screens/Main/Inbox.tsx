"use client"

import { useState } from "react"
import type React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Animated, // Animated import edildi
} from "react-native"
import Icon from "react-native-vector-icons/Ionicons" // Import Ionicons
import { useNavigation } from "@react-navigation/native" // useNavigation hook'u eklendi
import type { InboxScreenProps } from "../../Types/navigation" // Adjusted path

interface Message {
  id: string
  senderName: string
  senderImage: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isOnline: boolean
  messageType: "text" | "image" | "voice"
}

interface Call {
  id: string
  contactName: string
  contactImage: string
  type: "incoming" | "outgoing" | "missed"
  date: string
  time: string
}

interface InboxPropsWithScroll {
  onScroll: (event: any) => void // onScroll prop'u eklendi
}

const Inbox: React.FC<InboxPropsWithScroll> = ({ onScroll }) => {
  const navigation = useNavigation<InboxScreenProps["navigation"]>() // useNavigation hook'u kullanıldı
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"chats" | "calls">("chats") // State for tabs

  const messages: Message[] = [
    {
      id: "1",
      senderName: "Jenny Wilson",
      senderImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      lastMessage: "I have booked your house cleaning service for December 23 at 10 AM.",
      timestamp: "13:29",
      unreadCount: 2,
      isOnline: true,
      messageType: "text",
    },
    {
      id: "2",
      senderName: "Alfonzo Schuessler",
      senderImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      lastMessage: "I just finished 😊😊",
      timestamp: "10:48",
      unreadCount: 0,
      isOnline: false,
      messageType: "text",
    },
    {
      id: "3",
      senderName: "Benny Spanbauer",
      senderImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      lastMessage: "Wow, this is amazing 🔥🔥🔥",
      timestamp: "09:25",
      unreadCount: 1,
      isOnline: true,
      messageType: "text",
    },
    {
      id: "4",
      senderName: "Marci Santer",
      senderImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      lastMessage: "Wow, this is really epic 🤩",
      timestamp: "Yesterday",
      unreadCount: 0,
      isOnline: false,
      messageType: "text",
    },
    {
      id: "5",
      senderName: "Kylee Danford",
      senderImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      lastMessage: "Just ideas for next time 😅",
      timestamp: "Dec 20, 2024",
      unreadCount: 0,
      isOnline: true,
      messageType: "text",
    },
    {
      id: "6",
      senderName: "Merrill Kervin",
      senderImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      lastMessage: "How are you? 😊😊",
      timestamp: "Dec 19, 2024",
      unreadCount: 0,
      isOnline: false,
      messageType: "text",
    },
    {
      id: "7",
      senderName: "Pedro Huard",
      senderImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      lastMessage: "Perfect! 👍👍👍",
      timestamp: "Dec 18, 2024",
      unreadCount: 0,
      isOnline: true,
      messageType: "text",
    },
    {
      id: "8",
      senderName: "Edgar Torrey",
      senderImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      lastMessage: "See you soon!",
      timestamp: "Dec 17, 2024",
      unreadCount: 0,
      isOnline: false,
      messageType: "text",
    },
  ]

  const calls: Call[] = [
    {
      id: "c1",
      contactName: "Lauralee Quintero",
      contactImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      type: "incoming",
      date: "Dec 19, 2024",
      time: "10:00",
    },
    {
      id: "c2",
      contactName: "Tanner Stafford",
      contactImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      type: "outgoing",
      date: "Dec 17, 2024",
      time: "11:30",
    },
    {
      id: "c3",
      contactName: "Augustina Midgett",
      contactImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      type: "missed",
      date: "Nov 28, 2024",
      time: "09:00",
    },
    {
      id: "c4",
      contactName: "Geoffrey Mott",
      contactImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      type: "outgoing",
      date: "Nov 24, 2024",
      time: "14:00",
    },
    {
      id: "c5",
      contactName: "Roselle Ehrman",
      contactImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      type: "incoming",
      date: "Nov 14, 2024",
      time: "16:00",
    },
    {
      id: "c6",
      contactName: "Thad Eddings",
      contactImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      type: "outgoing",
      date: "Oct 30, 2024",
      time: "10:00",
    },
    {
      id: "c7",
      contactName: "Daryl Nelis",
      contactImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      type: "incoming",
      date: "Oct 29, 2024",
      time: "12:00",
    },
    {
      id: "c8",
      contactName: "Francene Vandyne",
      contactImage:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/148380a44d57cc7efcc92023de6ed6d5007efe99.jpg-Ee3F4IckYQTXlqw16FxK7RHE7XJlR9.jpeg",
      type: "outgoing",
      date: "Oct 28, 2024",
      time: "15:00",
    },
  ]

  const filteredMessages = messages.filter((message) =>
    message.senderName.toLowerCase().includes(searchQuery.toLowerCase()),
  )
  const filteredCalls = calls.filter((call) => call.contactName.toLowerCase().includes(searchQuery.toLowerCase()))

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "voice":
        return <Icon name="mic-outline" size={14} color="rgba(255, 255, 255, 0.7)" />
      case "image":
        return <Icon name="image-outline" size={14} color="rgba(255, 255, 255, 0.7)" />
      default:
        return null
    }
  }

  const getCallIcon = (type: Call["type"]) => {
    switch (type) {
      case "incoming":
        return <Icon name="call-outline" size={16} color="#10B981" /> // Green for incoming
      case "outgoing":
        return <Icon name="call-made-outline" size={16} color="#8B5CF6" /> // Purple for outgoing
      case "missed":
        return <Icon name="call-missed-outline" size={16} color="#EF4444" /> // Red for missed
      default:
        return null
    }
  }

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() =>
        navigation.navigate("ChatDetail", {
          chatId: item.id,
          senderName: item.senderName,
          senderImage: item.senderImage,
          isOnline: item.isOnline,
        })
      }
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.senderImage }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.senderName}>{item.senderName}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.messagePreview}>
          <View style={styles.lastMessageContainer}>
            {getMessageIcon(item.messageType)}
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          </View>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderCallItem = ({ item }: { item: Call }) => (
    <TouchableOpacity
      style={styles.callItem}
      onPress={() =>
        navigation.navigate("CallScreen", {
          contactName: item.contactName,
          contactImage: item.contactImage,
        })
      }
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.contactImage }} style={styles.avatar} />
      </View>
      <View style={styles.callContent}>
        <Text style={styles.callContactName}>{item.contactName}</Text>
        <View style={styles.callDetails}>
          {getCallIcon(item.type)}
          <Text style={styles.callTypeAndDate}>
            {item.type === "incoming" && "Incoming"}
            {item.type === "outgoing" && "Outgoing"}
            {item.type === "missed" && "Missed"}
            {" | "}
            {item.date}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.callButtonSmall}>
        <Icon name="call-outline" size={24} color="#8B5CF6" />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Inbox</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="search-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Icon name="ellipsis-vertical-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "chats" && styles.activeTab]}
          onPress={() => setActiveTab("chats")}
        >
          <Text style={[styles.tabText, activeTab === "chats" && styles.activeTabText]}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "calls" && styles.activeTab]}
          onPress={() => setActiveTab("calls")}
        >
          <Text style={[styles.tabText, activeTab === "calls" && styles.activeTabText]}>Calls</Text>
        </TouchableOpacity>
      </View>
      {/* Content based on active tab */}
      {activeTab === "chats" ? (
        filteredMessages.length > 0 ? (
          <Animated.FlatList
            data={filteredMessages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
          />
        ) : (
          <View style={styles.emptyState}>
            <Icon name="chatbox-outline" size={80} color="rgba(255, 255, 255, 0.3)" />
            <Text style={styles.emptyStateTitle}>No Messages Found</Text>
            <Text style={styles.emptyStateDescription}>
              {searchQuery ? "No messages match your search." : "Start a conversation with service providers."}
            </Text>
          </View>
        )
      ) : filteredCalls.length > 0 ? (
        <Animated.FlatList
          data={filteredCalls}
          renderItem={renderCallItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="call-outline" size={80} color="rgba(255, 255, 255, 0.3)" />
          <Text style={styles.emptyStateTitle}>No Calls Found</Text>
          <Text style={styles.emptyStateDescription}>
            {searchQuery ? "No calls match your search." : "Your call history will appear here."}
          </Text>
        </View>
      )}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerIcons: {
    flexDirection: "row",
  },
  headerIcon: {
    marginLeft: 15,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: "#8B5CF6",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    paddingVertical: 12,
    marginLeft: 12,
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  messageItem: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  callItem: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#000000",
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  timestamp: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  messagePreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  lastMessage: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    flexShrink: 1,
    marginLeft: 4,
  },
  unreadBadge: {
    backgroundColor: "#8B5CF6",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 50,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyStateDescription: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: 24,
  },
  callContent: {
    flex: 1,
  },
  callContactName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  callDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  callTypeAndDate: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginLeft: 5,
  },
  callButtonSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default Inbox
