package com.agon.app.data

object MockData {

    val currentUser = User(
        id = "me",
        name = "Alexandre Silva",
        username = "alexsilva",
        email = "alex@nexora.io",
        phone = "+351 912 345 678",
        avatarUrl = "",
        bio = "Building the future, one message at a time.",
        isOnline = true,
        isVerified = true,
        isPremium = true,
    )

    val conversations = listOf(
        Conversation(
            id = "1",
            name = "Sofia Mendes",
            lastMessage = "The presentation looks amazing! 🎨",
            lastMessageTime = "2 min",
            unreadCount = 3,
            isOnline = true,
            isPinned = true,
        ),
        Conversation(
            id = "2",
            name = "Design Team",
            lastMessage = "Rafael: New mockups are ready for review",
            lastMessageTime = "15 min",
            unreadCount = 8,
            isGroup = true,
            isPinned = true,
        ),
        Conversation(
            id = "3",
            name = "Marcos Oliveira",
            lastMessage = "Let me share the project files",
            lastMessageTime = "32 min",
            unreadCount = 1,
            isOnline = true,
        ),
        Conversation(
            id = "4",
            name = "Engineering Hub",
            lastMessage = "Camila: Deployment successful ✅",
            lastMessageTime = "1 h",
            unreadCount = 0,
            isGroup = true,
        ),
        Conversation(
            id = "5",
            name = "Ana Costa",
            lastMessage = "Voice message (0:42)",
            lastMessageTime = "2 h",
            unreadCount = 0,
            isOnline = false,
        ),
        Conversation(
            id = "6",
            name = "Ricardo Santos",
            lastMessage = "Thanks for the quick response!",
            lastMessageTime = "3 h",
            unreadCount = 0,
        ),
        Conversation(
            id = "7",
            name = "Product Launch",
            lastMessage = "Diana: Timeline updated for Q2",
            lastMessageTime = "5 h",
            unreadCount = 12,
            isGroup = true,
        ),
        Conversation(
            id = "8",
            name = "Joana Ferreira",
            lastMessage = "See you at the event tomorrow!",
            lastMessageTime = "Yesterday",
            unreadCount = 0,
            isOnline = true,
        ),
        Conversation(
            id = "9",
            name = "Nexora Updates",
            lastMessage = "New features available: Private Mode & Translation",
            lastMessageTime = "Yesterday",
            isGroup = true,
            isMuted = true,
        ),
        Conversation(
            id = "10",
            name = "Pedro Almeida",
            lastMessage = "🔒 Private message",
            lastMessageTime = "Yesterday",
            isPrivateMode = true,
        ),
    )

    val messages = listOf(
        Message(
            id = "m1",
            content = "Hey! Have you seen the new design system?",
            timestamp = "10:30",
            isFromMe = false,
            senderName = "Sofia Mendes",
            status = MessageStatus.READ,
        ),
        Message(
            id = "m2",
            content = "Yes, it looks incredible! The color palette is perfect.",
            timestamp = "10:31",
            isFromMe = true,
            status = MessageStatus.READ,
        ),
        Message(
            id = "m3",
            content = "I spent the whole weekend refining the components. Every detail matters.",
            timestamp = "10:32",
            isFromMe = false,
            senderName = "Sofia Mendes",
            status = MessageStatus.READ,
        ),
        Message(
            id = "m4",
            content = "That dedication really shows. The typography is on point 🔥",
            timestamp = "10:33",
            isFromMe = true,
            status = MessageStatus.READ,
        ),
        Message(
            id = "m5",
            content = "",
            timestamp = "10:34",
            isFromMe = false,
            senderName = "Sofia Mendes",
            type = MessageType.IMAGE,
            mediaUrl = "design_system_preview",
            status = MessageStatus.READ,
        ),
        Message(
            id = "m6",
            content = "The presentation looks amazing! 🎨",
            timestamp = "10:35",
            isFromMe = false,
            senderName = "Sofia Mendes",
            status = MessageStatus.READ,
            reactions = listOf(Reaction(emoji = "❤️", userId = "me")),
        ),
        Message(
            id = "m7",
            content = "",
            timestamp = "10:36",
            isFromMe = true,
            type = MessageType.VOICE,
            voiceDuration = "0:24",
            status = MessageStatus.READ,
        ),
        Message(
            id = "m8",
            content = "Can we schedule a review session for tomorrow?",
            timestamp = "10:37",
            isFromMe = true,
            status = MessageStatus.DELIVERED,
        ),
    )

    val calls = listOf(
        Call(id = "c1", callerName = "Sofia Mendes", type = CallType.VIDEO, status = CallStatus.MISSED, timestamp = "Today, 09:15"),
        Call(id = "c2", callerName = "Marcos Oliveira", type = CallType.AUDIO, status = CallStatus.OUTGOING, timestamp = "Today, 08:30", duration = "5:23", isFromMe = true),
        Call(id = "c3", callerName = "Ana Costa", type = CallType.VIDEO, status = CallStatus.INCOMING, timestamp = "Yesterday, 19:45", duration = "12:07"),
        Call(id = "c4", callerName = "Design Team", type = CallType.AUDIO, status = CallStatus.OUTGOING, timestamp = "Yesterday, 15:00", duration = "34:12", isFromMe = true),
        Call(id = "c5", callerName = "Ricardo Santos", type = CallType.AUDIO, status = CallStatus.MISSED, timestamp = "Yesterday, 11:20"),
        Call(id = "c6", callerName = "Joana Ferreira", type = CallType.VIDEO, status = CallStatus.INCOMING, timestamp = "Mon, 22:10", duration = "8:45"),
    )

    val statuses = listOf(
        Status(id = "s1", userName = "Sofia Mendes", content = "Working on something exciting! ✨", timestamp = "25 min ago", backgroundColor = "#0D9488"),
        Status(id = "s2", userName = "Marcos Oliveira", content = "", timestamp = "1 h ago", type = StatusType.IMAGE, mediaUrl = "project_update"),
        Status(id = "s3", userName = "Ana Costa", content = "Coffee break ☕", timestamp = "2 h ago", backgroundColor = "#6366F1"),
        Status(id = "s4", userName = "Ricardo Santos", content = "New milestone reached! 🚀", timestamp = "3 h ago", backgroundColor = "#D97706"),
        Status(id = "s5", userName = "Joana Ferreira", content = "", timestamp = "5 h ago", type = StatusType.VIDEO, mediaUrl = "event_highlight"),
    )

    val communities = listOf(
        Community(id = "com1", name = "Nexora Developers", description = "Official community for Nexora platform developers", members = 12847, groups = 5, isJoined = true, category = "Technology"),
        Community(id = "com2", name = "Design Systems Global", description = "Sharing design systems and component libraries", members = 8923, groups = 3, isJoined = true, category = "Design"),
        Community(id = "com3", name = "Startup Founders EU", description = "European startup ecosystem community", members = 5412, groups = 8, isJoined = false, category = "Business"),
        Community(id = "com4", name = "AI & Machine Learning", description = "Latest in AI research and applications", members = 24531, groups = 12, isJoined = false, category = "Technology"),
    )

    val contacts = listOf(
        Contact(id = "ct1", name = "Sofia Mendes", username = "sofiamendes", isOnline = true, phone = "+351 912 111 222"),
        Contact(id = "ct2", name = "Marcos Oliveira", username = "marcosoliveira", isOnline = true, phone = "+351 913 222 333"),
        Contact(id = "ct3", name = "Ana Costa", username = "anacosta", isOnline = false, phone = "+351 914 333 444"),
        Contact(id = "ct4", name = "Ricardo Santos", username = "ricardosantos", isOnline = false, phone = "+351 915 444 555"),
        Contact(id = "ct5", name = "Joana Ferreira", username = "joanaferreira", isOnline = true, phone = "+351 916 555 666"),
        Contact(id = "ct6", name = "Pedro Almeida", username = "pedroalmeida", isOnline = false, phone = "+351 917 666 777"),
        Contact(id = "ct7", name = "Diana Rocha", username = "dianarocha", isOnline = true, phone = "+351 918 777 888"),
        Contact(id = "ct8", name = "Rafael Moreira", username = "rafaelmoreira", isOnline = false, phone = "+351 919 888 999"),
        Contact(id = "ct9", name = "Camila Sousa", username = "camilasousa", isOnline = true, phone = "+351 920 999 000"),
        Contact(id = "ct10", name = "André Lopes", username = "andrelopes", isOnline = false, phone = "+351 921 000 111"),
    )

    val notifications = listOf(
        Notification(id = "n1", title = "Sofia Mendes", body = "The presentation looks amazing! 🎨", timestamp = "2 min", type = NotificationType.MESSAGE),
        Notification(id = "n2", title = "Design Team", body = "Rafael: New mockups are ready", timestamp = "15 min", type = NotificationType.GROUP),
        Notification(id = "n3", title = "Missed Call", body = "Sofia Mendes tried to video call you", timestamp = "30 min", type = NotificationType.CALL),
        Notification(id = "n4", title = "Marcos Oliveira", body = "Mentioned you in Engineering Hub", timestamp = "1 h", type = NotificationType.MENTION),
        Notification(id = "n5", title = "Nexora", body = "New security features available", timestamp = "2 h", type = NotificationType.SYSTEM),
    )
}
