import { Platform } from 'react-native';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';

let paramPermission =
  Platform.OS == 'ios'
    ? PERMISSIONS.IOS.LOCATION_ALWAYS
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

let microphonePermission =
  Platform.OS === 'android'
    ? PERMISSIONS.ANDROID.RECORD_AUDIO
    : PERMISSIONS.IOS.MICROPHONE;

let cameraPermission =
  Platform.OS === 'android'
    ? PERMISSIONS.ANDROID.CAMERA
    : PERMISSIONS.IOS.CAMERA;

let filePermission =
  Platform.OS === 'android'
    ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    : PERMISSIONS.IOS.PHOTO_LIBRARY;

export async function requestLocationPermission(onSuccess:any, onFailure:any) {
  request(paramPermission).then((result:any) => {
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
export async function checkLocationPermission(onSuccess:any, onFailure:any) {
  check(paramPermission).then((result:any) => {
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

export async function checkPermission(onSuccess:any, onFailure:any) {
  check(paramPermission).then((result:any) => {
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

export async function requestMicroPhonePermission(onSuccess:any, onFailure:any) {
  request(microphonePermission).then((result:any) => {
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
export async function checkMicroPhonePermission(onSuccess:any, onFailure:any) {
  check(microphonePermission).then((result:any) => {
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

export async function requestCameraPhonePermission(onSuccess:any, onFailure:any) {
  request(cameraPermission).then((result:any) => {
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
export async function checkCameraPhonePermission(onSuccess:any, onFailure:any) {
  check(cameraPermission).then((result:any) => {
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

export async function requestExternalFilePermission(onSuccess:any, onFailure:any) {
  request(filePermission).then((result:any) => {
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

export async function checkExternalFilePermission(onSuccess:any, onFailure:any) {
  check(filePermission).then((result:any) => {
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
