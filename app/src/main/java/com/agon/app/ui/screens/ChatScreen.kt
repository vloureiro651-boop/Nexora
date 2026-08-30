package com.agon.app.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material.icons.filled.AttachFile
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Translate
import androidx.compose.material.icons.filled.Videocam
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.outlined.Image
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.agon.app.data.Message
import com.agon.app.data.MessageType
import com.agon.app.data.MockData
import com.agon.app.ui.components.MessageBubble
import com.agon.app.ui.components.ReactionPicker
import com.agon.app.ui.theme.NexoraTeal
import com.agon.app.ui.theme.NexoraEmerald
import com.agon.app.ui.theme.NexoraIndigo

@Composable
fun ChatScreen(
    conversationId: String = "1",
    onBack: () -> Unit = {},
    onCall: () -> Unit = {},
    onVideoCall: () -> Unit = {},
    modifier: Modifier = Modifier,
) {
    val conversation = MockData.conversations.find { it.id == conversationId } ?: MockData.conversations.first()
    val messages = MockData.messages
    var messageText by remember { mutableStateOf("") }
    var showMenu by remember { mutableStateOf(false) }
    var showReactions by remember { mutableStateOf(false) }
    var isPrivateMode by remember { mutableStateOf(conversation.isPrivateMode) }
    val listState = rememberLazyListState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Chat header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(MaterialTheme.colorScheme.surface)
                .padding(horizontal = 8.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
            }

            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(NexoraTeal.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = if (conversation.isGroup) "👥" else conversation.name.firstOrNull()?.toString() ?: "?",
                    fontSize = if (conversation.isGroup) 18.sp else 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = NexoraTeal
                )
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = conversation.name,
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.SemiBold
                    )
                    if (isPrivateMode) {
                        Spacer(modifier = Modifier.width(6.dp))
                        Icon(
                            Icons.Default.Lock,
                            contentDescription = "Private",
                            modifier = Modifier.size(14.dp),
                            tint = NexoraIndigo
                        )
                    }
                }
                if (conversation.isOnline) {
                    Text(
                        text = "Online",
                        style = MaterialTheme.typography.labelSmall,
                        color = NexoraEmerald,
                        fontWeight = FontWeight.Medium
                    )
                } else {
                    Text(
                        text = "Last seen recently",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            IconButton(onClick = onCall) {
                Icon(Icons.Default.Call, contentDescription = "Call", tint = NexoraTeal)
            }
            IconButton(onClick = onVideoCall) {
                Icon(Icons.Default.Videocam, contentDescription = "Video", tint = NexoraTeal)
            }
            Box {
                IconButton(onClick = { showMenu = !showMenu }) {
                    Icon(Icons.Default.MoreVert, contentDescription = "More")
                }
                DropdownMenu(expanded = showMenu, onDismissRequest = { showMenu = false }) {
                    DropdownMenuItem(
                        text = { Text(if (isPrivateMode) "Disable Private Mode" else "Private Mode") },
                        onClick = { isPrivateMode = !isPrivateMode; showMenu = false },
                        leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null, tint = NexoraIndigo) }
                    )
                    DropdownMenuItem(
                        text = { Text("Translate Messages") },
                        onClick = { showMenu = false },
                        leadingIcon = { Icon(Icons.Default.Translate, contentDescription = null, tint = NexoraTeal) }
                    )
                    DropdownMenuItem(
                        text = { Text("Search in Chat") },
                        onClick = { showMenu = false },
                        leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) }
                    )
                }
            }
        }

        // Private mode banner
        AnimatedVisibility(
            visible = isPrivateMode,
            enter = fadeIn() + slideInVertically(),
            exit = fadeOut()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(NexoraIndigo.copy(alpha = 0.1f))
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.Lock, contentDescription = null, tint = NexoraIndigo, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Messages will disappear after viewing", style = MaterialTheme.typography.labelSmall, color = NexoraIndigo, fontWeight = FontWeight.Medium)
            }
        }

        // Messages
        LazyColumn(
            state = listState,
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(horizontal = 12.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            item {
                Spacer(modifier = Modifier.height(8.dp))
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        "Today",
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
            }
            items(messages) { message ->
                MessageBubble(message = message)
            }
        }

        // Reaction picker
        ReactionPicker(
            visible = showReactions,
            onReactionSelected = { showReactions = false },
            modifier = Modifier.padding(horizontal = 16.dp)
        )

        // Composer
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(MaterialTheme.colorScheme.surface)
                .padding(horizontal = 8.dp, vertical = 8.dp)
                .imePadding(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = { /* attach */ }) {
                Icon(Icons.Default.AttachFile, contentDescription = "Attach", tint = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            IconButton(onClick = { /* camera */ }) {
                Icon(Icons.Default.CameraAlt, contentDescription = "Camera", tint = MaterialTheme.colorScheme.onSurfaceVariant)
            }

            OutlinedTextField(
                value = messageText,
                onValueChange = { messageText = it },
                placeholder = { Text("Message", color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f)) },
                modifier = Modifier.weight(1f),
                shape = RoundedCornerShape(22.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = NexoraTeal.copy(alpha = 0.3f),
                    unfocusedBorderColor = MaterialTheme.colorScheme.outlineVariant,
                    focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f),
                    unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f),
                ),
                maxLines = 4,
                trailingIcon = {
                    if (messageText.isNotEmpty()) {
                        IconButton(onClick = { showReactions = !showReactions }) {
                            Text("😊", fontSize = 18.sp)
                        }
                    }
                }
            )

            if (messageText.isNotEmpty()) {
                IconButton(
                    onClick = { messageText = "" },
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)
                        .background(NexoraTeal)
                ) {
                    Icon(
                        Icons.AutoMirrored.Filled.Send,
                        contentDescription = "Send",
                        tint = Color.White,
                        modifier = Modifier.size(18.dp)
                    )
                }
            } else {
                IconButton(onClick = { /* voice */ }) {
                    Icon(Icons.Default.Mic, contentDescription = "Voice", tint = NexoraTeal)
                }
            }
        }
    }
}