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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material.icons.outlined.Storage
import androidx.compose.material.icons.outlined.Backup
import androidx.compose.material.icons.outlined.Palette
import androidx.compose.material.icons.outlined.Language
import androidx.compose.material.icons.outlined.VisibilityOff
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.agon.app.ui.theme.NexoraTeal
import com.agon.app.ui.theme.NexoraIndigo
import com.agon.app.ui.theme.NexoraGold

@Composable
fun SettingsScreen(
    onBack: () -> Unit = {},
    onNavigate: (String) -> Unit = {},
    modifier: Modifier = Modifier,
) {
    var darkMode by remember { mutableStateOf(false) }
    var invisibleMode by remember { mutableStateOf(false) }
    var readReceipts by remember { mutableStateOf(true) }
    var onlineStatus by remember { mutableStateOf(true) }
    val scrollState = rememberScrollState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(scrollState)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text("Settings", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        }

        // Privacy section
        SettingsSectionHeader("Privacy & Security")
        SettingsToggleItem(Icons.Outlined.VisibilityOff, "Invisible Mode", "Appear offline to others", invisibleMode, NexoraIndigo, { invisibleMode = it })
        SettingsToggleItem(Icons.Outlined.Lock, "Read Receipts", "Show when you've read messages", readReceipts, NexoraTeal, { readReceipts = it })
        SettingsToggleItem(Icons.Outlined.Lock, "Online Status", "Show when you're active", onlineStatus, NexoraTeal, { onlineStatus = it })
        SettingsNavigateItem(Icons.Outlined.Lock, "Two-Factor Auth", NexoraIndigo, onClick = { onNavigate("2fa") })
        SettingsNavigateItem(Icons.Outlined.Lock, "Encryption Keys", NexoraTeal, onClick = { onNavigate("keys") })

        Spacer(modifier = Modifier.height(16.dp))

        // Notifications section
        SettingsSectionHeader("Notifications")
        SettingsNavigateItem(Icons.Outlined.Notifications, "Notification Preferences", NexoraTeal, onClick = { onNavigate("notif_prefs") })
        SettingsNavigateItem(Icons.Outlined.Notifications, "Sounds & Vibration", NexoraTeal, onClick = { onNavigate("sounds") })

        Spacer(modifier = Modifier.height(16.dp))

        // Data section
        SettingsSectionHeader("Data & Storage")
        SettingsNavigateItem(Icons.Outlined.Storage, "Storage Usage", NexoraTeal, onClick = { onNavigate("storage") })
        SettingsNavigateItem(Icons.Outlined.Backup, "Backup & Restore", NexoraTeal, onClick = { onNavigate("backup") })
        SettingsNavigateItem(Icons.Outlined.Language, "Network Usage", NexoraTeal, onClick = { onNavigate("network") })

        Spacer(modifier = Modifier.height(16.dp))

        // Appearance section
        SettingsSectionHeader("Appearance")
        SettingsToggleItem(Icons.Outlined.Palette, "Dark Mode", "Use dark theme", darkMode, NexoraIndigo, { darkMode = it })
        SettingsNavigateItem(Icons.Outlined.Palette, "Theme & Colors", NexoraGold, onClick = { onNavigate("theme") })
        SettingsNavigateItem(Icons.Outlined.Language, "Language", NexoraTeal, onClick = { onNavigate("language") })

        Spacer(modifier = Modifier.height(24.dp))

        // Report
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
                .height(48.dp)
                .clip(RoundedCornerShape(14.dp))
                .background(MaterialTheme.colorScheme.error.copy(alpha = 0.1f))
                .clickable { }
                .padding(horizontal = 16.dp),
            contentAlignment = Alignment.CenterStart
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text("⚠️", fontSize = 16.sp)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Report a Problem", style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.error, fontWeight = FontWeight.Medium)
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        Text("Nexora v1.0.0", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f), modifier = Modifier.fillMaxWidth(), textAlign = androidx.compose.ui.text.style.TextAlign.Center)
        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Composable
private fun SettingsSectionHeader(title: String, modifier: Modifier = Modifier) {
    Text(
        title,
        style = MaterialTheme.typography.labelLarge,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        modifier = modifier.padding(horizontal = 20.dp, vertical = 8.dp)
    )
}

@Composable
private fun SettingsToggleItem(
    icon: ImageVector,
    title: String,
    subtitle: String,
    checked: Boolean,
    tint: Color,
    onToggle: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onToggle(!checked) }
            .padding(horizontal = 20.dp, vertical = 12.dp),
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
        Column(modifier = Modifier.weight(1f)) {
            Text(title, style = MaterialTheme.typography.bodyLarge, fontWeight = FontWeight.Medium)
            Text(subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        Switch(
            checked = checked,
            onCheckedChange = onToggle,
            colors = SwitchDefaults.colors(checkedTrackColor = tint)
        )
    }
}

@Composable
private fun SettingsNavigateItem(
    icon: ImageVector,
    title: String,
    tint: Color,
    onClick: () -> Unit = {},
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(horizontal = 20.dp, vertical = 12.dp),
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
        Text(title, style = MaterialTheme.typography.bodyLarge, modifier = Modifier.weight(1f))
        Icon(Icons.AutoMirrored.Filled.ArrowForward, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.3f), modifier = Modifier.size(18.dp))
    }
}
