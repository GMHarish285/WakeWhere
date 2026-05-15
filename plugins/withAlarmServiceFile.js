const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withAlarmServiceFile(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const pkg = config.android.package;

      const dirPath = path.join(
        projectRoot,
        "android/app/src/main/java",
        ...pkg.split("."),
      );

      const filePath = path.join(dirPath, "AlarmService.kt");

      const content = `package ${pkg}

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.media.MediaPlayer
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

class AlarmService : Service() {

    private var mediaPlayer: MediaPlayer? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startForeground(1, createNotification())

        val uri = intent?.getStringExtra("uri")

        if (uri != null) {
            mediaPlayer?.let {
                try {
                    if (it.isPlaying) it.stop()
                } catch (e: Exception) {}
                it.release()
            }
            mediaPlayer = null

            mediaPlayer = MediaPlayer().apply {
                setDataSource(applicationContext, android.net.Uri.parse(uri))
                setOnPreparedListener {
                    it.isLooping = true
                    it.start()
                }
                prepareAsync()
            }
        }

        return START_STICKY
    }

    private fun createNotification(): Notification {
        val channelId = "alarm_channel"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Alarm",
                NotificationManager.IMPORTANCE_HIGH
            )

            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }

        return NotificationCompat.Builder(this, channelId)
            .setContentTitle("Alarm Ringing")
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setOngoing(true)
            .build()
    }

    override fun onDestroy() {
        mediaPlayer?.stop()
        mediaPlayer?.release()
        mediaPlayer = null
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
`;

      fs.mkdirSync(dirPath, { recursive: true });

      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content);
      }

      return config;
    },
  ]);
};
