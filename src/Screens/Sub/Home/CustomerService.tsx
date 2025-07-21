import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import LinearGradient from "react-native-linear-gradient"
import Icon from "react-native-vector-icons/Ionicons"

interface ChatMessage {
  id: string
  message: string
  timestamp: string
  isMe: boolean
  type: "text" | "image" | "voice"
}

const CustomerService: React.FC<any> = ({ navigation }) => {
  const [newMessage, setNewMessage] = useState("")
  const flatListRef = useRef<FlatList>(null)

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message: "Hello, good morning. Is there anything I can help you with?",
      timestamp: "09:41",
      isMe: false,
      type: "text",
    },
    {
      id: "2",
      message: "Hi! I'm having problems with my service payment.",
      timestamp: "09:42",
      isMe: true,
      type: "text",
    },
    {
      id: "3",
      message: "Can you help me?",
      timestamp: "09:42",
      isMe: true,
      type: "text",
    },
    {
      id: "4",
      message: "Of course. Can you tell me the problem you're having? I can help solve it.",
      timestamp: "09:43",
      isMe: false,
      type: "text",
    },
  ])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true })
    }
  }, [chatMessages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
        isMe: true,
        type: "text",
      }
      setChatMessages((prevMessages) => [...prevMessages, newMsg])
      setNewMessage("")
    }
  }

  const renderChatMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.chatMessage, item.isMe ? styles.myMessage : styles.theirMessage]}>
      <Text style={[styles.chatMessageText, item.isMe ? styles.myMessageText : styles.theirMessageText]}>
        {item.message}
      </Text>
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
          <Text style={styles.chatUserName}>Customer Service</Text>
          <Text style={styles.chatUserStatus}>Online</Text>
        </View>

        <TouchableOpacity style={styles.callButton}>
          <Icon name="call-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.videoCallButton}>
          <Icon name="videocam-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
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
          <TouchableOpacity style={styles.micButton}>
            <Icon name="mic-outline" size={24} color="rgba(255, 255, 255, 0.6)" />
          </TouchableOpacity>
          <View style={styles.messageInputWrapper}>
            <TextInput
              style={styles.messageInput}
              placeholder="Message"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            <TouchableOpacity style={styles.attachButton}>
              <Icon name="attach-outline" size={24} color="rgba(255, 255, 255, 0.6)" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <LinearGradient
              colors={["#8B5CF6", "#A855F7"]}
              style={styles.sendButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Icon name="send-outline" size={24} color="#FFFFFF" />
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
  },
  chatUserName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  chatUserStatus: {
    fontSize: 13,
    color: "#10B981", 
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  videoCallButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
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
  },
  micButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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

export default CustomerService
