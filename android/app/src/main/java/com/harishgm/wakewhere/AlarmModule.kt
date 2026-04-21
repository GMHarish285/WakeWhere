package com.harishgm.wakewhere

import android.content.Intent
import com.facebook.react.bridge.*

class AlarmModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "AlarmModule"

    @ReactMethod
    fun startAlarm(uri: String) {
        val context = reactApplicationContext
        val intent = Intent(context, AlarmService::class.java)
        intent.putExtra("uri", uri)
        if (android.os.Build.VERSION.SDK_INT >= 26) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }
    }

    @ReactMethod
    fun stopAlarm() {
        val context = reactApplicationContext
        val intent = Intent(context, AlarmService::class.java)
        context.stopService(intent)
    }
}