package com.mindease.app;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.webkit.WebStorage;
import com.getcapacitor.BridgeActivity;
import java.io.File;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Limpiar datos de WebView una vez para eliminar el Service Worker roto
        clearOldServiceWorkerData();
        super.onCreate(savedInstanceState);
    }

    private void clearOldServiceWorkerData() {
        SharedPreferences prefs = getSharedPreferences("MindEasePrefs", MODE_PRIVATE);
        if (!prefs.getBoolean("sw_cleared_v3", false)) {
            try {
                // Limpiar Web Storage (localStorage, sessionStorage)
                WebStorage.getInstance().deleteAllData();
                // Limpiar directorio interno de WebView (incluye Service Workers)
                File webViewDir = new File(getApplicationInfo().dataDir, "app_webview");
                if (webViewDir.exists()) {
                    deleteRecursive(webViewDir);
                }
            } catch (Exception e) {
                // Ignorar errores - la limpieza es best-effort
            }
            prefs.edit().putBoolean("sw_cleared_v3", true).apply();
        }
    }

    private void deleteRecursive(File file) {
        if (file.isDirectory()) {
            File[] children = file.listFiles();
            if (children != null) {
                for (File child : children) {
                    deleteRecursive(child);
                }
            }
        }
        file.delete();
    }
}
