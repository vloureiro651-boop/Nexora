package com.agon.app.ui.screens

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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.outlined.Edit
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material.icons.outlined.Storage
import androidx.compose.material.icons.outlined.Backup
import androidx.compose.material.icons.outlined.Palette
import androidx.compose.material.icons.outlined.Shield
import androidx.compose.material.icons.outlined.Star
import androidx.compose.material.icons.outlined.VisibilityOff
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.material.icons.outlined.Help
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.agon.app.data.MockData
import com.agon.app.ui.theme.NexoraTeal
import com.agon.app.ui.theme.NexoraIndigo
import com.agon.app.ui.theme.NexoraGold
import com.agon.app.ui.theme.NexoraEmerald

@Composable
fun ProfileScreen(
    onNavigate: (String) -> Unit = {},
    modifier: Modifier = Modifier,
) {
    val user = MockData.currentUser
    val scrollState = rememberScrollState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(scrollState)
    ) {
        // Profile header
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(MaterialTheme.colorScheme.surface)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(88.dp)
                    .clip(CircleShape)
                    .background(NexoraTeal.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    user.name.firstOrNull()?.toString() ?: "A",
                    fontSize = 36.sp,
                    fontWeight = FontWeight.Bold,
                    color = NexoraTeal
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(user.name, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.width(6.dp))
                if (user.isVerified) {
                    Box(
                        modifier = Modifier
                            .size(20.dp)
                            .clip(CircleShape)
                            .background(NexoraIndigo),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("✓", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
                if (user.isPremium) {
                    Spacer(modifier = Modifier.width(4.dp))
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(NexoraGold)
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text("PRO", color = Color.White, style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Text("@${user.username}", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(modifier = Modifier.height(4.dp))
            Text(user.bio, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant, textAlign = androidx.compose.ui.text.style.TextAlign.Center)

            Spacer(modifier = Modifier.height(16.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                ProfileStat(count = "128", label = "Contacts")
                ProfileStat(count = "24", label = "Groups")
                ProfileStat(count = "1.2K", label = "Messages")
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Menu sections
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
        ) {
            Column {
                ProfileMenuItem(Icons.Outlined.Edit, "Edit Profile", NexoraTeal, onClick = { onNavigate("edit_profile") })
                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                ProfileMenuItem(Icons.Outlined.Notifications, "Notifications", NexoraTeal, onClick = { onNavigate("notifications") })
                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                ProfileMenuItem(Icons.Outlined.Lock, "Privacy & Security", NexoraIndigo, onClick = { onNavigate("security") })
                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                ProfileMenuItem(Icons.Outlined.VisibilityOff, "Invisible Mode", NexoraIndigo, onClick = { onNavigate("invisible") })
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
        ) {
            Column {
                ProfileMenuItem(Icons.Outlined.Storage, "Storage & Data", NexoraTeal, onClick = { onNavigate("storage") })
                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                ProfileMenuItem(Icons.Outlined.Backup, "Backup & Restore", NexoraTeal, onClick = { onNavigate("backup") })
                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                ProfileMenuItem(Icons.Outlined.Palette, "Personalization", NexoraGold, onClick = { onNavigate("customize") })
                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                ProfileMenuItem(Icons.Outlined.Star, "Nexora Premium", NexoraGold, onClick = { onNavigate("premium") })
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
        ) {
            Column {
                ProfileMenuItem(Icons.Outlined.Shield, "Admin Panel", NexoraIndigo, onClick = { onNavigate("admin") })
                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                ProfileMenuItem(Icons.Outlined.Settings, "App Settings", MaterialTheme.colorScheme.onSurfaceVariant, onClick = { onNavigate("settings") })
                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                ProfileMenuItem(Icons.Outlined.Help, "Help & Support", MaterialTheme.colorScheme.onSurfaceVariant, onClick = { })
                HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                ProfileMenuItem(Icons.Outlined.Info, "About Nexora", MaterialTheme.colorScheme.onSurfaceVariant, onClick = { })
            }
        }

        Spacer(modifier = Modifier.height(24.dp))
    }
}

@Composable
private fun ProfileStat(count: String, label: String, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(count, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = NexoraTeal)
        Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
private fun ProfileMenuItem(
    icon: ImageVector,
    label: String,
    tint: Color,
    onClick: () -> Unit = {},
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(tint.copy(alpha = 0.1f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, contentDescription = null, tint = tint, modifier = Modifier.size(18.dp))
        }
        Spacer(modifier = Modifier.width(12.dp))
        Text(label, style = MaterialTheme.typography.bodyLarge, modifier = Modifier.weight(1f))
        Icon(Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.3f), modifier = Modifier.size(18.dp))
    }
}