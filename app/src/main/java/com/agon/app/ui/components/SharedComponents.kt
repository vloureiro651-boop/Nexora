package com.agon.app.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.DoneAll
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.agon.app.data.Message
import com.agon.app.data.MessageStatus
import com.agon.app.data.MessageType
import com.agon.app.ui.theme.BubbleReceivedDark
import com.agon.app.ui.theme.BubbleReceivedLight
import com.agon.app.ui.theme.BubbleSentDark
import com.agon.app.ui.theme.BubbleSentLight
import com.agon.app.ui.theme.NexoraEmerald
import com.agon.app.ui.theme.NexoraGold
import com.agon.app.ui.theme.NexoraIndigo
import com.agon.app.ui.theme.NexoraRose
import com.agon.app.ui.theme.NexoraTeal

@Composable
fun NexoraLogo(modifier: Modifier = Modifier, size: Int = 80) {
    Box(
        modifier = modifier
            .size(size.dp)
            .clip(RoundedCornerShape((size * 0.22).dp))
            .background(NexoraTeal),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "N",
            color = Color.White,
            fontSize = (size * 0.5).sp,
            fontWeight = FontWeight.Bold,
        )
    }
}

@Composable
fun OnlineIndicator(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .size(12.dp)
            .clip(CircleShape)
            .background(NexoraEmerald)
            .border(2.dp, MaterialTheme.colorScheme.surface, CircleShape)
    )
}

@Composable
fun UnreadBadge(count: Int, modifier: Modifier = Modifier) {
    if (count > 0) {
        Box(
            modifier = modifier
                .size(if (count > 99) 28.dp else 22.dp)
                .clip(CircleShape)
                .background(NexoraTeal),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = if (count > 99) "99+" else count.toString(),
                color = Color.White,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
            )
        }
    }
}

@Composable
fun MessageBubble(message: Message, modifier: Modifier = Modifier) {
    val isSent = message.isFromMe
    val isDark = !isSystemLight()
    val bubbleColor by animateColorAsState(
        targetValue = when {
            isSent -> if (isDark) BubbleSentDark else BubbleSentLight
            else -> if (isDark) BubbleReceivedDark else BubbleReceivedLight
        },
        animationSpec = tween(300), label = "bubbleColor"
    )
    val textColor = if (isSent) Color.White else MaterialTheme.colorScheme.onSurface
    val shape = RoundedCornerShape(
        topStart = 18.dp,
        topEnd = 18.dp,
        bottomStart = if (isSent) 18.dp else 4.dp,
        bottomEnd = if (isSent) 4.dp else 18.dp,
    )

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(
                start = if (isSent) 48.dp else 0.dp,
                end = if (!isSent) 48.dp else 0.dp,
            ),
        horizontalAlignment = if (isSent) Alignment.End else Alignment.Start
    ) {
        if (!isSent && message.senderName.isNotEmpty()) {
            Text(
                text = message.senderName,
                style = MaterialTheme.typography.labelSmall,
                color = NexoraTeal,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.padding(start = 12.dp, bottom = 2.dp)
            )
        }

        Box(
            modifier = Modifier
                .clip(shape)
                .background(bubbleColor)
                .padding(horizontal = 14.dp, vertical = 10.dp)
        ) {
            when (message.type) {
                MessageType.TEXT -> {
                    Text(
                        text = message.content,
                        color = textColor,
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
                MessageType.IMAGE -> {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(180.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (isDark) Color(0xFF2A2A2E) else Color(0xFFE5E7EB)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("📷 Photo", fontSize = 32.sp)
                    }
                }
                MessageType.VOICE -> {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Text("🎤", fontSize = 18.sp)
                        Box(
                            modifier = Modifier
                                .width(120.dp)
                                .height(4.dp)
                                .clip(RoundedCornerShape(2.dp))
                                .background(if (isSent) Color.White.copy(alpha = 0.3f) else MaterialTheme.colorScheme.outline)
                        )
                        Text(
                            text = message.voiceDuration,
                            color = textColor.copy(alpha = 0.7f),
                            style = MaterialTheme.typography.labelSmall
                        )
                    }
                }
                else -> {
                    Text(
                        text = message.content,
                        color = textColor,
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            }
        }

        Row(
            modifier = Modifier.padding(top = 2.dp, end = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = if (isSent) Arrangement.End else Arrangement.Start
        ) {
            Text(
                text = message.timestamp,
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
            )
            if (isSent) {
                Spacer(modifier = Modifier.width(4.dp))
                when (message.status) {
                    MessageStatus.SENT -> Icon(
                        Icons.Default.Check,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)
                    )
                    MessageStatus.DELIVERED -> Icon(
                        Icons.Default.DoneAll,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.5f)
                    )
                    MessageStatus.READ -> Icon(
                        Icons.Default.DoneAll,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp),
                        tint = NexoraTeal
                    )
                    else -> {}
                }
            }
        }

        if (message.reactions.isNotEmpty()) {
            Row(
                modifier = Modifier
                    .padding(top = 4.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant)
                    .padding(horizontal = 8.dp, vertical = 2.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                message.reactions.forEach { reaction ->
                    Text(reaction.emoji, fontSize = 14.sp)
                }
            }
        }
    }
}

@Composable
private fun isSystemLight(): Boolean {
    return MaterialTheme.colorScheme.background.luminance() > 0.5f
}

private fun Color.luminance(): Float {
    return 0.299f * red + 0.587f * green + 0.114f * blue
}

@Composable
fun SectionHeader(title: String, modifier: Modifier = Modifier) {
    Text(
        text = title,
        style = MaterialTheme.typography.labelLarge,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        modifier = modifier.padding(horizontal = 16.dp, vertical = 8.dp)
    )
}

@Composable
fun PremiumBadge(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(6.dp))
            .background(NexoraGold)
            .padding(horizontal = 6.dp, vertical = 2.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "PRO",
            color = Color.White,
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
fun PrivateModeBadge(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(6.dp))
            .background(NexoraIndigo)
            .padding(horizontal = 6.dp, vertical = 2.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "🔒",
            style = MaterialTheme.typography.labelSmall,
        )
    }
}

@Composable
fun EmptyStateView(icon: String, title: String, subtitle: String, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(icon, fontSize = 48.sp)
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = title,
            style = MaterialTheme.typography.titleMedium,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = subtitle,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )
    }
}
