import { useEffect } from 'react';
import { Alert } from 'react-native';
import * as Updates from 'expo-updates';

export function UpdateChecker() {
  const { currentlyRunning, isUpdateAvailable, isUpdatePending } = Updates.useUpdates();

  useEffect(() => {
    async function checkForUpdates() {
      try {
        // Only check for updates in production (not in development mode)
        if (__DEV__) return;

        const update = await Updates.checkForUpdateAsync();
        
        if (update.isAvailable) {
          // Download the update in the background
          await Updates.fetchUpdateAsync();
          
          // Prompt the user to restart the app to apply the update
          Alert.alert(
            'Update Available',
            'A new version of the app is available. Restart to apply it?',
            [
              { text: 'Later', style: 'cancel' },
              { text: 'Restart Now', onPress: () => Updates.reloadAsync() },
            ]
          );
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    }

    checkForUpdates();
  }, []);

  return null;
}
