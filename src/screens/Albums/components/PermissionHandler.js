import * as MediaLibrary from 'expo-media-library';
import { useEffect } from 'react';
import { Alert, Linking } from 'react-native';

export default function PermissionHandler({ setHasPermission }) {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    if (permissionResponse == null) return;

    if (permissionResponse.granted) {
      setHasPermission(true);
      return;
    }

    if (permissionResponse.canAskAgain) {
      Alert.alert(
        'Media Access',
        'This app needs to access images and videos on your device to work properly.',
        [
          {
            text: 'Grant Access',
            onPress: requestPermission
          }
        ]
      );
    } else {
      Linking.openSettings();
    }
  }, [permissionResponse, requestPermission]);

  return null;
}