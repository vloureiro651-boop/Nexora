package com.agon.app.data

import androidx.compose.ui.graphics.Color
import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: String = "",
    val name: String = "",
    val username: String = "",
    val email: String = "",
    val phone: String = "",
    val avatarUrl: String = "",
    val bio: String = "",
    val isOnline: Boolean = false,
    val lastSeen: String = "",
    val isVerified: Boolean = false,
    val isPremium: Boolean = false,
)

@Serializable
data class Conversation(
    val id: String = "",
    val name: String = "",
    val avatarUrl: String = "",
    val lastMessage: String = "",
    val lastMessageTime: String = "",
    val unreadCount: Int = 0,
    val isOnline: Boolean = false,
    val isGroup: Boolean = false,
    val isPinned: Boolean = false,
    val isMuted: Boolean = false,
    val isPrivateMode: Boolean = false,
    val members: List<User> = emptyList(),
    val lastMessageSender: String = "",
    val messageCount: Long = 0,
)

@Serializable
data class Message(
    val id: String = "",
    val conversationId: String = "",
    val senderId: String = "",
    val senderName: String = "",
    val senderAvatar: String = "",
    val content: String = "",
    val timestamp: String = "",
    val isFromMe: Boolean = false,
    val type: MessageType = MessageType.TEXT,
    val status: MessageStatus = MessageStatus.SENT,
    val reactions: List<Reaction> = emptyList(),
    val replyTo: Message? = null,
    val isTranslated: Boolean = false,
    val translatedContent: String = "",
    val isPrivate: Boolean = false,
    val mediaUrl: String = "",
    val voiceDuration: String = "",
)

enum class MessageType {
    TEXT, IMAGE, VIDEO, VOICE, FILE, LOCATION, CONTACT, LINK, SYSTEM
}

enum class MessageStatus {
    SENDING, SENT, DELIVERED, READ, FAILED
}

@Serializable
data class Reaction(
    val emoji: String = "",
    val userId: String = "",
    val timestamp: String = "",
)

@Serializable
data class Call(
    val id: String = "",
    val callerName: String = "",
    val callerAvatar: String = "",
    val type: CallType = CallType.AUDIO,
    val status: CallStatus = CallStatus.MISSED,
    val timestamp: String = "",
    val duration: String = "",
    val isFromMe: Boolean = false,
)

enum class CallType { AUDIO, VIDEO }

enum class CallStatus { MISSED, INCOMING, OUTGOING, ONGOING }

@Serializable
data class Status(
    val id: String = "",
    val userName: String = "",
    val userAvatar: String = "",
    val content: String = "",
    val mediaUrl: String = "",
    val timestamp: String = "",
    val type: StatusType = StatusType.TEXT,
    val isViewed: Boolean = false,
    val backgroundColor: String = "#0D9488",
)

enum class StatusType { TEXT, IMAGE, VIDEO }

@Serializable
data class Community(
    val id: String = "",
    val name: String = "",
    val description: String = "",
    val avatarUrl: String = "",
    val members: Int = 0,
    val groups: Int = 0,
    val isJoined: Boolean = false,
    val category: String = "",
)

@Serializable
data class Contact(
    val id: String = "",
    val name: String = "",
    val username: String = "",
    val avatarUrl: String = "",
    val isOnline: Boolean = false,
    val isOnNexora: Boolean = true,
    val phone: String = "",
)

@Serializable
data class Notification(
    val id: String = "",
    val title: String = "",
    val body: String = "",
    val timestamp: String = "",
    val type: NotificationType = NotificationType.MESSAGE,
    val isRead: Boolean = false,
    val senderAvatar: String = "",
)

enum class NotificationType { MESSAGE, CALL, GROUP, SYSTEM, MENTION }
