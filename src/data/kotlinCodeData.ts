import { KotlinFile } from '../types';

export const KOTLIN_PROJECT_FILES: KotlinFile[] = [
  {
    filename: 'MainActivity.kt',
    path: 'app/src/main/java/com/muslim/dailyroutine/MainActivity.kt',
    language: 'kotlin',
    description: 'نقطة الانطلاق الرئيسية للتطبيق مع Jetpack Compose و Material 3 وطلب أذونات الإشعارات للأندرويد 13+',
    code: `package com.muslim.dailyroutine

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.*
import com.muslim.dailyroutine.ui.screens.*
import com.muslim.dailyroutine.ui.theme.MuslimTheme
import com.muslim.dailyroutine.viewmodel.MuslimHabitsViewModel

class MainActivity : ComponentActivity() {

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            // Notification permission granted for Android 13+
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Request POST_NOTIFICATIONS permission on Android 13+ (Tiramisu)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.POST_NOTIFICATIONS
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                requestPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }

        setContent {
            MuslimTheme {
                MainAppScaffold()
            }
        }
    }
}

@Composable
fun MainAppScaffold(viewModel: MuslimHabitsViewModel = viewModel()) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: "prayer_times"

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp
            ) {
                NavigationBarItem(
                    selected = currentRoute == "prayer_times",
                    onClick = { navController.navigate("prayer_times") },
                    icon = { Icon(Icons.Default.Schedule, contentDescription = "الصلاة") },
                    label = { Text("الصلوات") }
                )
                NavigationBarItem(
                    selected = currentRoute == "daily_tasks",
                    onClick = { navController.navigate("daily_tasks") },
                    icon = { Icon(Icons.Default.CheckCircle, contentDescription = "المهام") },
                    label = { Text("المهام اليومية") }
                )
                NavigationBarItem(
                    selected = currentRoute == "azkar",
                    onClick = { navController.navigate("azkar") },
                    icon = { Icon(Icons.Default.AutoStories, contentDescription = "الأذكار") },
                    label = { Text("الأذكار") }
                )
                NavigationBarItem(
                    selected = currentRoute == "routine_table",
                    onClick = { navController.navigate("routine_table") },
                    icon = { Icon(Icons.Default.CalendarMonth, contentDescription = "الجدول") },
                    label = { Text("الجدول المنظم") }
                )
            }
        }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = "prayer_times",
            modifier = Modifier.padding(paddingValues)
        ) {
            composable("prayer_times") {
                PrayerTimesScreen(viewModel = viewModel)
            }
            composable("daily_tasks") {
                DailyTasksScreen(viewModel = viewModel)
            }
            composable("azkar") {
                AzkarScheduleScreen(viewModel = viewModel)
            }
            composable("routine_table") {
                RoutineTableScreen(viewModel = viewModel)
            }
        }
    }
}`
  },
  {
    filename: 'PrayerTimesWorker.kt',
    path: 'app/src/main/java/com/muslim/dailyroutine/worker/PrayerTimesWorker.kt',
    language: 'kotlin',
    description: 'عامل الخلفية في أندرويد (WorkManager & NotificationManager) لجدولة التنبيهات والأذان بدقة',
    code: `package com.muslim.dailyroutine.worker

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.work.*
import com.muslim.dailyroutine.MainActivity
import com.muslim.dailyroutine.R
import java.util.concurrent.TimeUnit

class PrayerTimesWorker(
    private val context: Context,
    workerParams: WorkerParameters
) : Worker(context, workerParams) {

    override fun doWork(): Result {
        val prayerName = inputData.getString("PRAYER_NAME") ?: "الصلاة"
        val prayerMessage = inputData.getString("PRAYER_MESSAGE") ?: "حان الآن موعد أداء الصلاة المفروضة"

        showPrayerNotification(prayerName, prayerMessage)
        return Result.success()
    }

    private fun showPrayerNotification(title: String, message: String) {
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "prayer_reminders_channel"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "تنبيهات مواقيت الصلاة والأذكار",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "قناة إشعارات مواقيت الصلوات الخمس مع صوت الأذان"
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 500, 200, 500, 200, 1000)
            }
            notificationManager.createNotificationChannel(channel)
        }

        val intent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        }
        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle("🕌 حان موعد: $title")
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .build()

        notificationManager.notify(title.hashCode(), notification)
    }

    companion object {
        fun schedulePrayerReminder(context: Context, prayerName: String, delayMinutes: Long) {
            val data = Data.Builder()
                .putString("PRAYER_NAME", prayerName)
                .putString("PRAYER_MESSAGE", "الله أكبر، الله أكبر.. حيّ على الصلاة حيّ على الفلاح")
                .build()

            val request = OneTimeWorkRequestBuilder<PrayerTimesWorker>()
                .setInitialDelay(delayMinutes, TimeUnit.MINUTES)
                .setInputData(data)
                .addTag("prayer_$prayerName")
                .build()

            WorkManager.getInstance(context).enqueueUniqueWork(
                "prayer_$prayerName",
                ExistingWorkPolicy.REPLACE,
                request
            )
        }
    }
}`
  },
  {
    filename: 'AzkarScheduleScreen.kt',
    path: 'app/src/main/java/com/muslim/dailyroutine/ui/screens/AzkarScheduleScreen.kt',
    language: 'kotlin',
    description: 'واجهة جدول الأذكار اليومية بـ Jetpack Compose مع عداد مسبحة تفاعلي وتغذية لمسية (Haptic Feedback)',
    code: `package com.muslim.dailyroutine.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.muslim.dailyroutine.viewmodel.MuslimHabitsViewModel

data class ZikrModel(
    val id: String,
    val text: String,
    val virtue: String,
    val source: String,
    val targetCount: Int,
    var currentCount: Int = 0,
    var completed: Boolean = false
)

@Composable
fun AzkarScheduleScreen(viewModel: MuslimHabitsViewModel) {
    val haptic = LocalHapticFeedback.current
    var selectedCategory by remember { mutableStateOf("morning") }

    val categories = listOf(
        "morning" to "أذكار الصباح",
        "evening" to "أذكار المساء",
        "post_prayer" to "بعد الصلاة",
        "sleep" to "أذكار النوم",
        "tasbeeh" to "المسبحة والاستغفار"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp)
    ) {
        Text(
            text = "جدول الأذكار اليومية",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Category Filter Tabs
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            items(categories) { (key, title) ->
                FilterChip(
                    selected = selectedCategory == key,
                    onClick = { selectedCategory = key },
                    label = { Text(title) }
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Azkar List with interactive counters
        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(sampleAzkarList.filter { it.first == selectedCategory }) { (_, zikr) ->
                var count by remember { mutableStateOf(zikr.currentCount) }
                val isDone = count >= zikr.targetCount

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (isDone) Color(0xFF064E3B).copy(alpha = 0.15f)
                        else MaterialTheme.colorScheme.surfaceVariant
                    )
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = zikr.text,
                            style = MaterialTheme.typography.bodyLarge,
                            lineHeight = 28.sp,
                            textAlign = TextAlign.Right
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "فضل الذكر: \${zikr.virtue}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.secondary
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "المصدر: \${zikr.source}",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )

                            // Tap Counter Button with Haptic Vibration
                            Button(
                                onClick = {
                                    if (count < zikr.targetCount) {
                                        count++
                                        haptic.performHapticFeedback(HapticFeedbackType.LongPress)
                                    }
                                },
                                shape = RoundedCornerShape(20.dp),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (isDone) Color(0xFF10B981) else MaterialTheme.colorScheme.primary
                                )
                            ) {
                                if (isDone) {
                                    Icon(Icons.Default.Check, contentDescription = null)
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("تم بحمد الله")
                                } else {
                                    Text("\$count / \${zikr.targetCount}")
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

val sampleAzkarList = listOf(
    "morning" to ZikrModel(
        "m1",
        "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ...",
        "حفظ وتوفيق ونور لليوم كله",
        "صحيح مسلم",
        1
    ),
    "morning" to ZikrModel(
        "m2",
        "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        "حطت خطاياه وإن كانت مثل زبد البحر",
        "البخاري ومسلم",
        100
    ),
    "evening" to ZikrModel(
        "e1",
        "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ...",
        "تحصين من كل شر وهامة",
        "صحيح مسلم",
        1
    ),
    "tasbeeh" to ZikrModel(
        "t1",
        "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
        "كلمتان خفيفتان على اللسان ثقيلتان في الميزان",
        "متفق عليه",
        33
    )
)`
  },
  {
    filename: 'DailyTasksScreen.kt',
    path: 'app/src/main/java/com/muslim/dailyroutine/ui/screens/DailyTasksScreen.kt',
    language: 'kotlin',
    description: 'واجهة مهام المسلم اليومية مع تعقب الالتزام، نسبة الإنجاز، وتقسيم أوقات اليوم',
    code: `package com.muslim.dailyroutine.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.muslim.dailyroutine.viewmodel.MuslimHabitsViewModel

data class TaskItem(
    val id: String,
    val title: String,
    val period: String,
    val reward: String,
    var isDone: Boolean = false
)

@Composable
fun DailyTasksScreen(viewModel: MuslimHabitsViewModel) {
    var tasks by remember {
        mutableStateOf(
            listOf(
                TaskItem("t1", "صلاة الفجر في جماعة والسنن الراتبة", "الفجر", "من صلى الصبح فهو في ذمة الله"),
                TaskItem("t2", "أذكار الصباح وورد القرآن اليومي", "الصباح", "حفظ وبركة ونور في الصدر"),
                TaskItem("t3", "صلاة الضحى (ركعتان إلى أربع)", "الضحى", "تجزئ عن صدقة 360 مفصلاً"),
                TaskItem("t4", "صلاة الظهر وسنن الرواتب", "الظهر", "بيت في الجنة لمن واظب على 12 ركعة"),
                TaskItem("t5", "صلاة العصر في وقتها", "العصر", "الصلاة الوسطى والنجاة من النار"),
                TaskItem("t6", "أذكار المساء وصلاة المغرب", "المساء", "تحصين تام ودعاء مستجاب"),
                TaskItem("t7", "صلاة العشاء وسنتها والوتر", "العشاء", "أوتروا فإن الله وتر يحب الوتر"),
                TaskItem("t8", "قيام الليل وأذكار النوم ومحاسبة النفس", "الليل", "شرف المؤمن قيامه بالليل")
            )
        )
    }

    val completedCount = tasks.count { it.isDone }
    val progress = if (tasks.isNotEmpty()) completedCount.toFloat() / tasks.size else 0f

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp)
    ) {
        // Daily Progress Summary Header Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Text(
                    text = "مهامي اليومية كمسلم",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onPrimaryContainer
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "أنجزت $completedCount من أصل \${tasks.size} مهام اليوم",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                )
                Spacer(modifier = Modifier.height(12.dp))
                LinearProgressIndicator(
                    progress = { progress },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp),
                    color = Color(0xFF10B981)
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(tasks) { task ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (task.isDone) Color(0xFF064E3B).copy(alpha = 0.1f)
                        else MaterialTheme.colorScheme.surface
                    )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = task.isDone,
                            onCheckedChange = { checked ->
                                tasks = tasks.map {
                                    if (it.id == task.id) it.copy(isDone = checked) else it
                                }
                            }
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = task.title,
                                style = MaterialTheme.typography.bodyLarge,
                                fontWeight = FontWeight.SemiBold
                            )
                            Text(
                                text = task.reward,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.secondary
                            )
                        }
                    }
                }
            }
        }
    }
}`
  },
  {
    filename: 'PrayerCalculationHelper.kt',
    path: 'app/src/main/java/com/muslim/dailyroutine/utils/PrayerCalculationHelper.kt',
    language: 'kotlin',
    description: 'حساب مواقيت الصلاة الفلكية بلغة كوتلن الصافية اعتماداً على خط العرض والطول واليوم الميلادي',
    code: `package com.muslim.dailyroutine.utils

import java.util.Calendar
import kotlin.math.*

data class PrayerTimesResult(
    val fajr: String,
    val sunrise: String,
    val dhuhr: String,
    val asr: String,
    val maghrib: String,
    val isha: String
)

object PrayerCalculationHelper {

    fun calculateTimes(lat: Double, lng: Double, calendar: Calendar = Calendar.getInstance()): PrayerTimesResult {
        val dayOfYear = calendar.get(Calendar.DAY_OF_YEAR)

        // Solar Declination & Equation of time
        val b = 2 * Math.PI * (dayOfYear - 81) / 365
        val eot = 9.87 * sin(2 * b) - 7.53 * cos(b) - 1.5 * sin(b) // minutes
        val declination = 23.45 * sin(Math.toRadians(360.0 / 365.0 * (284 + dayOfYear)))

        val decRad = Math.toRadians(declination)
        val latRad = Math.toRadians(lat)

        val timeZoneOffset = calendar.timeZone.rawOffset / (1000.0 * 3600.0)
        val solarNoonUtc = 12.0 - lng / 15.0 - eot / 60.0
        val solarNoonLocal = solarNoonUtc + timeZoneOffset

        fun hourAngle(angle: Double): Double {
            val aRad = Math.toRadians(angle)
            val cosH = (sin(aRad) - sin(latRad) * sin(decRad)) / (cos(latRad) * cos(decRad))
            return if (cosH > 1.0) 0.0 else if (cosH < -1.0) 180.0 else Math.toDegrees(acos(cosH))
        }

        val fajrHA = hourAngle(-18.0) / 15.0
        val sunriseHA = hourAngle(-0.833) / 15.0
        val asrAltRad = atan(1.0 / (1.0 + tan(abs(latRad - decRad))))
        val asrHA = hourAngle(Math.toDegrees(asrAltRad)) / 15.0
        val ishaHA = hourAngle(-17.5) / 15.0

        fun formatHours(decimalHours: Double): String {
            var h = decimalHours
            while (h < 0) h += 24.0
            while (h >= 24) h -= 24.0
            val hours = h.toInt()
            val minutes = ((h - hours) * 60).toInt()
            return String.format("%02d:%02d", hours, minutes)
        }

        return PrayerTimesResult(
            fajr = formatHours(solarNoonLocal - fajrHA),
            sunrise = formatHours(solarNoonLocal - sunriseHA),
            dhuhr = formatHours(solarNoonLocal + 2.0 / 60.0),
            asr = formatHours(solarNoonLocal + asrHA),
            maghrib = formatHours(solarNoonLocal + sunriseHA),
            isha = formatHours(solarNoonLocal + ishaHA)
        )
    }
}`
  },
  {
    filename: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    description: 'ملف الاعتماديات وإعدادات البناء Gradle مع Jetpack Compose و WorkManager و Room',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.muslim.dailyroutine"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.muslim.dailyroutine"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    // AndroidX & Lifecycle
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)

    // Jetpack Compose BOM & UI
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)
    implementation(libs.androidx.navigation.compose)

    // Background Scheduling (Prayer Reminders)
    implementation(libs.androidx.work.runtime.ktx)

    // Local Storage & Coroutines
    implementation(libs.androidx.datastore.preferences)
    implementation(libs.kotlinx.coroutines.android)
}
`
  },
  {
    filename: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'ملف بيان الأندرويد مع أذونات الإشعارات والمنبه الدقيق والاهتزاز وحفظ الطاقة',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permissions for Prayer Times Reminders & Adhan Alarms -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.USE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MuslimDailyRoutine">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.MuslimDailyRoutine">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Receiver to reschedule alarms when device reboots -->
        <receiver
            android:name=".receiver.BootCompletedReceiver"
            android:enabled="true"
            android:exported="false">
            <intent-filter>
                <action android:name="android.intent.action.BOOT_COMPLETED" />
            </intent-filter>
        </receiver>

    </application>

</manifest>`
  }
];
