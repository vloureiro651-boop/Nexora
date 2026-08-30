package com.agon.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.AnimatedContentTransitionScope
import androidx.compose.animation.core.tween
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Chat
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Groups
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.outlined.Chat
import androidx.compose.material.icons.outlined.Call
import androidx.compose.material.icons.outlined.Groups
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.agon.app.ui.screens.CallsScreen
import com.agon.app.ui.screens.ChatScreen
import com.agon.app.ui.screens.ContactsScreen
import com.agon.app.ui.screens.HomeScreen
import com.agon.app.ui.screens.NotificationsScreen
import com.agon.app.ui.screens.PremiumScreen
import com.agon.app.ui.screens.ProfileScreen
import com.agon.app.ui.screens.RegisterScreen
import com.agon.app.ui.screens.SearchScreen
import com.agon.app.ui.screens.SecurityScreen
import com.agon.app.ui.screens.SettingsScreen
import com.agon.app.ui.screens.SplashScreen
import com.agon.app.ui.screens.StatusScreen
import com.agon.app.ui.screens.StorageScreen
import com.agon.app.ui.screens.WelcomeDoneScreen
import com.agon.app.ui.screens.WelcomeScreen
import com.agon.app.ui.theme.AgonAppTheme
import com.agon.app.ui.theme.NexoraTeal

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        setContent {
            AgonAppTheme {
                NexoraApp()
            }
        }
    }
}

@Composable
fun NexoraApp() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val showBottomBar = currentRoute in listOf(
        "home", "calls", "status", "communities", "profile"
    )

    val animDuration = 400

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        containerColor = MaterialTheme.colorScheme.background,
        bottomBar = {
            if (showBottomBar) {
                NexoraBottomNav(navController, currentRoute)
            }
        },
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = "splash",
            modifier = Modifier.padding(innerPadding),
            enterTransition = {
                slideIntoContainer(
                    AnimatedContentTransitionScope.SlideDirection.Start,
                    tween(animDuration)
                )
            },
            exitTransition = {
                slideOutOfContainer(
                    AnimatedContentTransitionScope.SlideDirection.Start,
                    tween(animDuration)
                )
            },
            popEnterTransition = {
                slideIntoContainer(
                    AnimatedContentTransitionScope.SlideDirection.End,
                    tween(animDuration)
                )
            },
            popExitTransition = {
                slideOutOfContainer(
                    AnimatedContentTransitionScope.SlideDirection.End,
                    tween(animDuration)
                )
            },
        ) {
            composable("splash") {
                SplashScreen(onFinished = { navController.navigate("welcome") { popUpTo("splash") { inclusive = true } } })
            }
            composable("welcome") {
                WelcomeScreen(
                    onLogin = { navController.navigate("home") { popUpTo("welcome") { inclusive = true } } },
                    onRegister = { navController.navigate("register") }
                )
            }
            composable("register") {
                RegisterScreen(
                    onBack = { navController.popBackStack() },
                    onComplete = { navController.navigate("welcome_done") { popUpTo("register") { inclusive = true } } }
                )
            }
            composable("welcome_done") {
                WelcomeDoneScreen(
                    onContinue = { navController.navigate("home") { popUpTo("welcome_done") { inclusive = true } } }
                )
            }
            composable("home") {
                HomeScreen(
                    onConversationClick = { id -> navController.navigate("chat/$id") },
                    onSearchClick = { navController.navigate("search") },
                    onNotificationsClick = { navController.navigate("notifications") }
                )
            }
            composable(
                "chat/{conversationId}",
                arguments = listOf(navArgument("conversationId") { type = NavType.StringType; defaultValue = "1" })
            ) { backStackEntry ->
                val convId = backStackEntry.arguments?.getString("conversationId") ?: "1"
                ChatScreen(
                    conversationId = convId,
                    onBack = { navController.popBackStack() },
                    onCall = { navController.navigate("call_screen") },
                    onVideoCall = { navController.navigate("call_screen") }
                )
            }
            composable("calls") {
                CallsScreen()
            }
            composable("status") {
                StatusScreen()
            }
            composable("communities") {
                com.agon.app.ui.screens.CommunitiesScreen()
            }
            composable("profile") {
                ProfileScreen(
                    onNavigate = { route -> navController.navigate(route) }
                )
            }
            composable("search") {
                SearchScreen(onBack = { navController.popBackStack() })
            }
            composable("notifications") {
                NotificationsScreen(onBack = { navController.popBackStack() })
            }
            composable("settings") {
                SettingsScreen(
                    onBack = { navController.popBackStack() },
                    onNavigate = { route -> navController.navigate(route) }
                )
            }
            composable("security") {
                SecurityScreen(onBack = { navController.popBackStack() })
            }
            composable("storage") {
                StorageScreen(onBack = { navController.popBackStack() })
            }
            composable("premium") {
                PremiumScreen(onBack = { navController.popBackStack() })
            }
            composable("contacts") {
                ContactsScreen()
            }
            composable("call_screen") {
                CallScreenUI(onBack = { navController.popBackStack() })
            }
            // Sub-screens from profile
            composable("edit_profile") {
                SimpleSubScreen("Edit Profile", "Update your profile information and avatar.", navController)
            }
            composable("invisible") {
                SecurityScreen(onBack = { navController.popBackStack() })
            }
            composable("backup") {
                StorageScreen(onBack = { navController.popBackStack() })
            }
            composable("customize") {
                SimpleSubScreen("Personalization", "Customize your Nexora experience with themes, colors, and chat wallpapers.", navController)
            }
            composable("admin") {
                SimpleSubScreen("Admin Panel", "Secure administration dashboard for managing your organization.", navController)
            }
            composable("2fa") {
                SimpleSubScreen("Two-Factor Auth", "Protect your account with an extra layer of security.", navController)
            }
            composable("keys") {
                SimpleSubScreen("Encryption Keys", "Manage your end-to-end encryption key pairs.", navController)
            }
            composable("notif_prefs") {
                NotificationsScreen(onBack = { navController.popBackStack() })
            }
            composable("sounds") {
                SimpleSubScreen("Sounds & Vibration", "Customize notification sounds and vibration patterns.", navController)
            }
            composable("network") {
                SimpleSubScreen("Network Usage", "Monitor your data usage across Wi-Fi and mobile.", navController)
            }
            composable("theme") {
                SimpleSubScreen("Theme & Colors", "Choose your preferred theme and accent colors.", navController)
            }
            composable("language") {
                SimpleSubScreen("Language", "Select your preferred language for the Nexora interface.", navController)
            }
        }
    }
}

@Composable
fun NexoraBottomNav(navController: NavHostController, currentRoute: String?) {
    NavigationBar(
        containerColor = MaterialTheme.colorScheme.surface,
        tonalElevation = 0.dp,
    ) {
        NavigationBarItem(
            icon = {
                Icon(
                    if (currentRoute == "home") Icons.Default.Chat else Icons.Outlined.Chat,
                    contentDescription = "Chats",
                    modifier = Modifier.size(24.dp)
                )
            },
            label = {
                Text(
                    "Chats",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = if (currentRoute == "home") FontWeight.SemiBold else FontWeight.Normal
                )
            },
            selected = currentRoute == "home",
            onClick = { navController.navigate("home") { popUpTo("home") { inclusive = true } } },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = NexoraTeal,
                selectedTextColor = NexoraTeal,
                indicatorColor = NexoraTeal.copy(alpha = 0.1f),
            )
        )
        NavigationBarItem(
            icon = {
                Icon(
                    if (currentRoute == "calls") Icons.Default.Call else Icons.Outlined.Call,
                    contentDescription = "Calls",
                    modifier = Modifier.size(24.dp)
                )
            },
            label = {
                Text(
                    "Calls",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = if (currentRoute == "calls") FontWeight.SemiBold else FontWeight.Normal
                )
            },
            selected = currentRoute == "calls",
            onClick = { navController.navigate("calls") { popUpTo("home") } },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = NexoraTeal,
                selectedTextColor = NexoraTeal,
                indicatorColor = NexoraTeal.copy(alpha = 0.1f),
            )
        )
        NavigationBarItem(
            icon = {
                Icon(
                    if (currentRoute == "status") Icons.Default.Groups else Icons.Outlined.Groups,
                    contentDescription = "Stories",
                    modifier = Modifier.size(24.dp)
                )
            },
            label = {
                Text(
                    "Stories",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = if (currentRoute == "status") FontWeight.SemiBold else FontWeight.Normal
                )
            },
            selected = currentRoute == "status",
            onClick = { navController.navigate("status") { popUpTo("home") } },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = NexoraTeal,
                selectedTextColor = NexoraTeal,
                indicatorColor = NexoraTeal.copy(alpha = 0.1f),
            )
        )
        NavigationBarItem(
            icon = {
                Icon(
                    if (currentRoute == "communities") Icons.Default.Groups else Icons.Outlined.Groups,
                    contentDescription = "Communities",
                    modifier = Modifier.size(24.dp)
                )
            },
            label = {
                Text(
                    "Groups",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = if (currentRoute == "communities") FontWeight.SemiBold else FontWeight.Normal
                )
            },
            selected = currentRoute == "communities",
            onClick = { navController.navigate("communities") { popUpTo("home") } },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = NexoraTeal,
                selectedTextColor = NexoraTeal,
                indicatorColor = NexoraTeal.copy(alpha = 0.1f),
            )
        )
        NavigationBarItem(
            icon = {
                Icon(
                    if (currentRoute == "profile") Icons.Default.Person else Icons.Outlined.Person,
                    contentDescription = "Profile",
                    modifier = Modifier.size(24.dp)
                )
            },
            label = {
                Text(
                    "Profile",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = if (currentRoute == "profile") FontWeight.SemiBold else FontWeight.Normal
                )
            },
            selected = currentRoute == "profile",
            onClick = { navController.navigate("profile") { popUpTo("home") } },
            colors = NavigationBarItemDefaults.colors(
                selectedIconColor = NexoraTeal,
                selectedTextColor = NexoraTeal,
                indicatorColor = NexoraTeal.copy(alpha = 0.1f),
            )
        )
    }
}

@Composable
fun SimpleSubScreen(title: String, description: String, navController: NavHostController) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(24.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(NexoraTeal.copy(alpha = 0.1f))
                    .clickable { navController.popBackStack() },
                contentAlignment = Alignment.Center
            ) {
                Text("←", fontSize = 18.sp, color = NexoraTeal)
            }
            Spacer(modifier = Modifier.width(12.dp))
            Text(title, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
        }
        Spacer(modifier = Modifier.height(24.dp))
        Text(description, style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Spacer(modifier = Modifier.height(16.dp))
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(120.dp)
                .clip(RoundedCornerShape(20.dp))
                .background(MaterialTheme.colorScheme.surfaceVariant),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("🚧", fontSize = 36.sp)
                Spacer(modifier = Modifier.height(8.dp))
                Text("Coming soon", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}

@Composable
fun CallScreenUI(onBack: () -> Unit = {}) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier
                .size(120.dp)
                .clip(CircleShape)
                .background(NexoraTeal.copy(alpha = 0.15f)),
            contentAlignment = Alignment.Center
        ) {
            Text("S", fontSize = 48.sp, fontWeight = FontWeight.Bold, color = NexoraTeal)
        }
        Spacer(modifier = Modifier.height(24.dp))
        Text("Sofia Mendes", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(8.dp))
        Text("Connecting...", style = MaterialTheme.typography.bodyLarge, color = NexoraTeal)
        Spacer(modifier = Modifier.height(48.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
            Box(
                modifier = Modifier.size(56.dp).clip(CircleShape).background(MaterialTheme.colorScheme.surfaceVariant).clickable { },
                contentAlignment = Alignment.Center
            ) { Text("🔇", fontSize = 24.sp) }
            Box(
                modifier = Modifier.size(56.dp).clip(CircleShape).background(MaterialTheme.colorScheme.surfaceVariant).clickable { },
                contentAlignment = Alignment.Center
            ) { Text("📹", fontSize = 24.sp) }
            Box(
                modifier = Modifier.size(56.dp).clip(CircleShape).background(MaterialTheme.colorScheme.surfaceVariant).clickable { },
                contentAlignment = Alignment.Center
            ) { Text("🔊", fontSize = 24.sp) }
        }
        Spacer(modifier = Modifier.height(24.dp))
        Box(
            modifier = Modifier.size(64.dp).clip(CircleShape).background(MaterialTheme.colorScheme.error).clickable { onBack() },
            contentAlignment = Alignment.Center
        ) { Text("📞", fontSize = 28.sp) }
        Spacer(modifier = Modifier.height(16.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
            Box(
                modifier = Modifier.size(48.dp).clip(CircleShape).background(MaterialTheme.colorScheme.surfaceVariant).clickable { },
                contentAlignment = Alignment.Center
            ) { Text("🖥", fontSize = 20.sp) }
            Box(
                modifier = Modifier.size(48.dp).clip(CircleShape).background(MaterialTheme.colorScheme.surfaceVariant).clickable { },
                contentAlignment = Alignment.Center
            ) { Text("➕", fontSize = 20.sp) }
        }
    }
}
