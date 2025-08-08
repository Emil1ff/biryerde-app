"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"
import type { ChatDetail } from "../../../Types/navigation"

interface ChatMessage {
  id: string
  message?: string
  timestamp: string
  isMe: boolean
  type: "text" | "image" | "voice"
  imageUrl?: string
}

const ChatDetailScreen: React.FC<ChatDetail> = ({ route, navigation }) => {
  const { chatId, senderName, senderImage, isOnline } = route.params
  const [newMessage, setNewMessage] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message: `Hi ${senderName}, good morning 😊`,
      timestamp: "10:00",
      isMe: false,
      type: "text",
    },
    {
      id: "2",
      message: "I have booked your house cleaning service for December 23 at 10 AM 😊",
      timestamp: "10:00",
      isMe: false,
      type: "text",
    },
    {
      id: "3",
      message: "Hi, morning too Andrew! 😊",
      timestamp: "10:00",
      isMe: true,
      type: "text",
    },
    {
      id: "4",
      message: "Yes, I have received your order. I will come on that date! 😊😊",
      timestamp: "10:00",
      isMe: true,
      type: "text",
    },
    {
      id: "5",
      message: "Good, thanks Jenny.",
      timestamp: "10:01",
      isMe: false,
      type: "text",
    },
    {
      id: "6",
      message: "Here I send a photo of room & my house 😊😊",
      timestamp: "10:02",
      isMe: true,
      type: "text",
    },
    {
      id: "7",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uXkSq1WfdxRtOtGiJ03aIeXTXApdps.png", // Placeholder image for chat
      timestamp: "10:02",
      isMe: true,
      type: "image",
    },
  ])
  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true })
    }
  }, [chatMessages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: ChatMessage = {
        id: String(chatMessages.length + 1),
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: true,
        type: "text",
      }
      setChatMessages((prevMessages) => [...prevMessages, newMsg])
      setNewMessage("")
    }
  }

  const renderChatMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.chatMessage, item.isMe ? styles.myMessage : styles.theirMessage]}>
      {item.type === "text" && (
        <Text style={[styles.chatMessageText, item.isMe ? styles.myMessageText : styles.theirMessageText]}>
          {item.message}
        </Text>
      )}
      {item.type === "image" && item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.chatImage} resizeMode="cover" />
      )}
      <Text style={[styles.chatTimestamp, item.isMe ? styles.myChatTimestamp : styles.theirChatTimestamp]}>
        {item.timestamp}
      </Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chatHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.chatUserInfo}>
          <View style={styles.chatAvatarContainer}>
            <Image source={{ uri: senderImage }} style={styles.chatAvatar} />
            {isOnline && <View style={styles.chatOnlineIndicator} />}
          </View>
          <View>
            <Text style={styles.chatUserName}>{senderName}</Text>
            <Text style={styles.chatUserStatus}>{isOnline ? "Online" : "Last seen recently"}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() =>
            navigation.navigate("CallScreen", {
              contactName: senderName,
              contactImage: senderImage,
            })
          }
        >
          <Icon name="call-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={chatMessages}
          renderItem={renderChatMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatMessagesList}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.messageInputContainer}>
          <View style={styles.messageInputWrapper}>
            {/* <TouchableOpacity style={styles.emojiButton}>
              <Icon name="happy-outline" size={24} color="rgba(255, 255, 255, 0.6)" />
            </TouchableOpacity> */}
            <TextInput
              style={styles.messageInput}
              placeholder="Message"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            {/* <TouchableOpacity style={styles.attachButton}>
              <Icon name="attach-outline" size={24} color="rgba(255, 255, 255, 0.6)" />
            </TouchableOpacity> */}
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <LinearGradient
              colors={["#8B5CF6", "#A855F7"]}
              style={styles.sendButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name={newMessage.trim() ? "send-outline" : "mic-outline"} size={24} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  chatUserInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  chatAvatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chatOnlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#000000",
  },
  chatUserName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  chatUserStatus: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  chatMessagesList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  chatMessage: {
    maxWidth: "80%",
    marginBottom: 16,
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#8B5CF6",
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderBottomLeftRadius: 4,
  },
  chatMessageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  myMessageText: {
    color: "#FFFFFF",
  },
  theirMessageText: {
    color: "#FFFFFF",
  },
  chatImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 4,
  },
  chatTimestamp: {
    fontSize: 12,
    alignSelf: "flex-end",
  },
  myChatTimestamp: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  theirChatTimestamp: {
    color: "rgba(255, 255, 255, 0.6)",
  },
  messageInputContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#000000",
    alignItems: "flex-end",
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    marginBottom: 20,
  },
  messageInputWrapper: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    alignItems: "flex-end",
  },
  emojiButton: {
    marginRight: 8,
    paddingVertical: 4,
  },
  messageInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  attachButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButton: {
    borderRadius: 24,
  },
  sendButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
})

export default ChatDetailScreen
