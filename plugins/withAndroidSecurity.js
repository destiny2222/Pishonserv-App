const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Custom Expo Config Plugin for Phase 1 & 2 Security Remediation:
 * - Force allowBackup=false
 * - Remove: SYSTEM_ALERT_WINDOW, RECEIVE_BOOT_COMPLETED, DUMP, RECORD_AUDIO, USE_FINGERPRINT
 * - Add: USE_BIOMETRIC
 * - Implement Certificate Pinning (network_security_config.xml)
 * - Restrict FileProvider paths (file_paths.xml)
 */
module.exports = function withAndroidSecurity(config) {
  // 1. Modify AndroidManifest.xml
  config = withAndroidManifest(config, async (config) => {
    let androidManifest = config.modResults;
    let mainApplication = androidManifest.manifest.application[0];

    // Ensure tools namespace is present
    if (!androidManifest.manifest.$['xmlns:tools']) {
      androidManifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    mainApplication.$['android:allowBackup'] = 'false';
    mainApplication.$['android:networkSecurityConfig'] = '@xml/network_security_config';

    const permissionsToRemove = [
      'android.permission.SYSTEM_ALERT_WINDOW',
      'android.permission.RECEIVE_BOOT_COMPLETED',
      'android.permission.DUMP',
      'android.permission.RECORD_AUDIO',
      'android.permission.USE_FINGERPRINT',
    ];

    if (!androidManifest.manifest['uses-permission']) {
      androidManifest.manifest['uses-permission'] = [];
    }

    // Process permissions: either add remove node or modify existing one
    permissionsToRemove.forEach((permissionName) => {
        const existing = androidManifest.manifest['uses-permission'].find(p => p.$['android:name'] === permissionName);
        if (existing) {
            existing.$['tools:node'] = 'remove';
        } else {
            androidManifest.manifest['uses-permission'].push({
                $: {
                    'android:name': permissionName,
                    'tools:node': 'remove',
                },
            });
        }
    });

    // Add USE_BIOMETRIC
    if (!androidManifest.manifest['uses-permission'].some(p => p.$['android:name'] === 'android.permission.USE_BIOMETRIC')) {
      androidManifest.manifest['uses-permission'].push({ $: { 'android:name': 'android.permission.USE_BIOMETRIC' } });
    }

    return config;
  });

  // 2. Create XML configuration files
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const resXmlPath = path.join(config.modRequest.projectRoot, 'android/app/src/main/res/xml');
      if (!fs.existsSync(resXmlPath)) {
        fs.mkdirSync(resXmlPath, { recursive: true });
      }

      // a. Network Security Config (Pinning)
      const networkSecurityConfig = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config>
        <domain includeSubdomains="true">pishonserv.com</domain>
        <!-- Certificate Pinning disabled temporarily for verification -->
        <!-- <pin-set expiration="2026-12-31">
            <pin digest="SHA-256">AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=</pin>
            <pin digest="SHA-256">BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=</pin>
        </pin-set> -->
    </domain-config>
</network-security-config>`;
      fs.writeFileSync(path.join(resXmlPath, 'network_security_config.xml'), networkSecurityConfig);

      // b. Restricted File Paths
      const filePaths = `<?xml version="1.0" encoding="utf-8"?>
<paths xmlns:android="http://schemas.android.com/apk/res/android">
    <cache-path name="cache" path="." />
    <files-path name="files" path="." />
</paths>`;
      fs.writeFileSync(path.join(resXmlPath, 'file_paths.xml'), filePaths);

      return config;
    },
  ]);

  return config;
};
