import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';

const paramPermission: string = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
}) as string;

const microphonePermission: string = Platform.select({
  ios: PERMISSIONS.IOS.MICROPHONE,
  android: PERMISSIONS.ANDROID.RECORD_AUDIO,
}) as string;

const cameraPermission: string = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
}) as string;

const filePermission: string = Platform.select({
  ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
  android:
    DeviceInfo.getSystemVersion() >= '13'
      ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
}) as string;

const notificationPermission: string = Platform.select({
  ios: '',
  android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
}) as string;

export async function requestLocationPermission(
  onSuccess: any,
  onFailure: any,
) {
  request(paramPermission).then(result => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        onFailure(result);
        break;
      case RESULTS.DENIED:
        onFailure(result);
        break;
      case RESULTS.GRANTED:
        onSuccess(result);
        break;
      case RESULTS.BLOCKED:
        onFailure(result);
        break;
    }
  });
}
export async function checkLocationPermission(onSuccess: any, onFailure: any) {
  check(paramPermission).then(result => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        requestLocationPermission(onSuccess, onFailure);
        break;
      case RESULTS.DENIED:
        requestLocationPermission(onSuccess, onFailure);
        break;
      case RESULTS.GRANTED:
        requestLocationPermission(onSuccess, onFailure);
        break;
      case RESULTS.BLOCKED:
        requestLocationPermission(onSuccess, onFailure);
        break;
    }
  });
}

export async function checkPermission(onSuccess: any, onFailure: any) {
  check(paramPermission).then(result => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        onFailure(result);
        break;
      case RESULTS.DENIED:
        onFailure(result);
        break;
      case RESULTS.GRANTED:
        onSuccess(result);
        break;
      case RESULTS.BLOCKED:
        onFailure(result);
        break;
    }
  });
}

export async function requestMicroPhonePermission(
  onSuccess: any,
  onFailure: any,
) {
  request(microphonePermission).then(result => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        onFailure(result);
        break;
      case RESULTS.DENIED:
        onFailure(result);
        break;
      case RESULTS.GRANTED:
        onSuccess(result);
        break;
      case RESULTS.BLOCKED:
        onFailure(result);
        break;
    }
  });
}
export async function checkMicroPhonePermission(
  onSuccess: any,
  onFailure: any,
) {
  check(microphonePermission).then(result => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        requestMicroPhonePermission(onSuccess, onFailure);
        break;
      case RESULTS.DENIED:
        requestMicroPhonePermission(onSuccess, onFailure);
        break;
      case RESULTS.GRANTED:
        requestMicroPhonePermission(onSuccess, onFailure);
        break;
      case RESULTS.BLOCKED:
        requestMicroPhonePermission(onSuccess, onFailure);
        break;
    }
  });
}

export async function requestCameraPhonePermission(
  onSuccess: any,
  onFailure: any,
) {
  request(cameraPermission).then(result => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        onFailure(result);
        break;
      case RESULTS.DENIED:
        onFailure(result);
        break;
      case RESULTS.GRANTED:
        onSuccess(result);
        break;
      case RESULTS.BLOCKED:
        onFailure(result);
        break;
    }
  });
}
export async function checkCameraPhonePermission(
  onSuccess: any,
  onFailure: any,
) {
  check(cameraPermission).then(result => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        requestCameraPhonePermission(onSuccess, onFailure);
        break;
      case RESULTS.DENIED:
        requestCameraPhonePermission(onSuccess, onFailure);
        break;
      case RESULTS.GRANTED:
        requestCameraPhonePermission(onSuccess, onFailure);
        break;
      case RESULTS.BLOCKED:
        requestCameraPhonePermission(onSuccess, onFailure);
        break;
    }
  });
}

export async function requestExternalFilePermission(
  onSuccess: any,
  onFailure: any,
) {
  request(filePermission).then(result => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        onFailure(result);
        break;
      case RESULTS.DENIED:
        onFailure(result);
        break;
      case RESULTS.GRANTED:
        onSuccess(result);
        break;
      case RESULTS.BLOCKED:
        onFailure(result);
        break;
    }
  });
}

export async function checkExternalFilePermission(
  onSuccess: any,
  onFailure: any,
) {
  check(filePermission).then(result => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        requestExternalFilePermission(onSuccess, onFailure);
        break;
      case RESULTS.DENIED:
        requestExternalFilePermission(onSuccess, onFailure);
        break;
      case RESULTS.GRANTED:
        requestExternalFilePermission(onSuccess, onFailure);
        break;
      case RESULTS.BLOCKED:
        requestExternalFilePermission(onSuccess, onFailure);
        break;
    }
  });
}

export async function requestNotificationPermission(
  onSuccess: any,
  onFailure: any,
) {
  request(notificationPermission).then(result => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        onFailure(result);
        break;
      case RESULTS.DENIED:
        onFailure(result);
        break;
      case RESULTS.GRANTED:
        onSuccess(result);
        break;
      case RESULTS.BLOCKED:
        onFailure(result);
        break;
    }
  });
}

export async function checkNotificationPermission(
  onSuccess: any,
  onFailure: any,
) {
  check(notificationPermission).then(result => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        requestNotificationPermission(onSuccess, onFailure);
        break;
      case RESULTS.DENIED:
        requestNotificationPermission(onSuccess, onFailure);
        break;
      case RESULTS.GRANTED:
        requestNotificationPermission(onSuccess, onFailure);
        break;
      case RESULTS.BLOCKED:
        requestNotificationPermission(onSuccess, onFailure);
        break;
    }
  });
}
