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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Videocam
import androidx.compose.material.icons.filled.ScreenShare
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.agon.app.data.Call
import com.agon.app.data.CallStatus
import com.agon.app.data.CallType
import com.agon.app.data.MockData
import com.agon.app.ui.theme.NexoraTeal
import com.agon.app.ui.theme.NexoraRose
import com.agon.app.ui.theme.NexoraEmerald
import com.agon.app.ui.theme.NexoraIndigo

@Composable
fun CallsScreen(
    modifier: Modifier = Modifier,
) {
    val calls = MockData.calls

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { },
                containerColor = NexoraTeal,
                shape = RoundedCornerShape(16.dp)
            ) {
                Icon(Icons.Default.Call, contentDescription = "New Call", tint = Color.White)
            }
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        Column(
            modifier = modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 16.dp)) {
                Text("Calls", style = MaterialTheme.typography.headlineLarge, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(4.dp))
                Text("${calls.size} recent calls", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }

            // Quick call actions
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                CallActionChip("🎙 Audio", NexoraTeal, Modifier.weight(1f))
                CallActionChip("📹 Video", NexoraIndigo, Modifier.weight(1f))
                CallActionChip("🖥 Screen", NexoraEmerald, Modifier.weight(1f))
            }

            Spacer(modifier = Modifier.height(8.dp))

            LazyColumn(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(2.dp)
            ) {
                items(calls) { call ->
                    CallItem(call = call)
                }
            }
        }
    }
}

@Composable
private fun CallActionChip(label: String, color: Color, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .height(40.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(color.copy(alpha = 0.1f))
            .clickable { },
        contentAlignment = Alignment.Center
    ) {
        Text(label, style = MaterialTheme.typography.labelMedium, color = color, fontWeight = FontWeight.SemiBold)
    }
}

@Composable
private fun CallItem(call: Call, modifier: Modifier = Modifier) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable { }
            .padding(horizontal = 20.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(48.dp)
                .clip(CircleShape)
                .background(NexoraTeal.copy(alpha = 0.1f)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                call.callerName.firstOrNull()?.toString() ?: "?",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = NexoraTeal
            )
        }

        Spacer(modifier = Modifier.width(12.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                call.callerName,
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.SemiBold,
                color = if (call.status == CallStatus.MISSED) NexoraRose else MaterialTheme.colorScheme.onSurface
            )
            Row(verticalAlignment = Alignment.CenterVertically) {
                val icon = when (call.status) {
                    CallStatus.MISSED -> "↙"
                    CallStatus.INCOMING -> "↙"
                    CallStatus.OUTGOING -> "↗"
                    CallStatus.ONGOING -> "●"
                }
                val statusColor = when (call.status) {
                    CallStatus.MISSED -> NexoraRose
                    CallStatus.ONGOING -> NexoraEmerald
                    else -> MaterialTheme.colorScheme.onSurfaceVariant
                }
                Text(icon, color = statusColor, fontSize = 12.sp)
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    call.timestamp,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                if (call.duration.isNotEmpty()) {
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("(${call.duration})", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
        }

        IconButton(onClick = { }) {
            Icon(
                if (call.type == CallType.VIDEO) Icons.Default.Videocam else Icons.Default.Call,
                contentDescription = "Call back",
                tint = NexoraTeal
            )
        }
    }
}