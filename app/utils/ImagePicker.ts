import { Platform } from 'react-native';
import { Video } from 'react-native-compressor';
import DocumentPicker, { types } from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import RNHeicConverter from 'react-native-heic-converter';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';

export const getFileInfo = RNFS.stat;

export async function GetCameraImage(onSuccess:any, onFailure:any) {
  ImagePicker.clean()
    .then(() => {
      ImagePicker.openCamera({
        width: 2000,
        height: 2500,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true,
        useFrontCamera: true,
        waitAnimationEnd: false,
        compressImageQuality: 1,
        freeStyleCropEnabled: true,
      })
        .then(image => {
          onSuccess(image);
        })
        .catch(error => {
          if (error?.toString()?.includes('permission')) {
            Toast.show({
              type: 'error',
              text1: 'Please grant camera permission!',
            });
          }
          onFailure(error);
        });
    })
    .catch(error => {
      onFailure(error);
    });
}

export function GetGalleryImage(onSuccess:any, onFailure:any, width?:any, height?:any) {
  ImagePicker.clean()
    .then(() => {
      ImagePicker.openPicker({
        width: 2000,
        height: 2500,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true,
        useFrontCamera: true,
        waitAnimationEnd: true,
        compressImageQuality: 1,
        freeStyleCropEnabled: true,
      })
        .then(image => {
          onSuccess(image);
        })
        .catch(error => {
          if (error?.toString()?.includes('permission')) {
            Toast.show({
              type: 'error',
              text1: 'Please grant storage permission!',
            });
          }
          onFailure(error);
        });
    })
    .catch(error => {
      onFailure(error);
    });
}

export function GetMultipleGalleryImage(onSuccess:any, onFailure:any) {
  ImagePicker.clean()
    .then(() => {
      ImagePicker.openPicker({
        width: 2000,
        height: 2500,
        maxFiles: 10,
        multiple: true,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true,
        useFrontCamera: true,
        waitAnimationEnd: true,
        compressImageQuality: 1,
        freeStyleCropEnabled: true,
      })
        .then(image => {
          onSuccess(image);
        })
        .catch(error => {
          if (error?.toString()?.includes('permission')) {
            Toast.show({
              type: 'error',
              text1: 'Please grant storage permission!',
            });
          }
          onFailure(error);
        });
    })
    .catch(error => {
      onFailure(error);
    });
}

export async function GetImageParams(image:any, onSuccess:any, onFailure:any) {
  const uriParts = image[0].fileName
    ? image[0].fileName.split('.')
    : image[0].path.split('.');
  let strURIToUse;
  if (Platform.OS == 'ios') {
    if (image[0].sourceURL) {
      strURIToUse = image[0].sourceURL.replace('file:/', '');
    } else if (image[0].uri) {
      strURIToUse = image[0].uri.replace('file:/', '');
    } else {
      strURIToUse = image[0].path;
    }
  } else {
    strURIToUse = image[0].path;
  }
  if (strURIToUse?.endsWith('.HEIC')) {
    await RNHeicConverter.convert({
      path: strURIToUse,
    }).then(async (result:any) => {
      let imageParam = {
        uri: result.path,
        name:
          Math.round(new Date().getTime() / 1000) +
          '.' +
          uriParts[uriParts.length - 1],
        type: image[0].mime,
      };
      if (imageParam) {
        await onSuccess(imageParam);
      } else {
        onFailure(null);
      }
    });
  } else {
    let imageParam = {
      uri: strURIToUse,
      name:
        image[0].fileName ||
        Math.round(new Date().getTime() / 1000) +
          '.' +
          uriParts[uriParts.length - 1],
      type: image[0].mime,
    };
    if (imageParam) {
      await onSuccess(imageParam);
    } else {
      onFailure(null);
    }
  }
}

export function GetCameraVideo(onSuccess:any, onFailure:any) {
  ImagePicker.clean()
    .then(() => {
      ImagePicker.openCamera({
        mediaType: 'video',
        includeBase64: true,
        compressVideoPreset: 'HighestQuality',
        useFrontCamera: true,
      })
        .then(async (video:any) => {
          const dstUrl = await Video.compress(
            Platform.OS == 'ios' ? video.sourceURL : video.path,
            {
              compressionMethod: 'auto',
              minimumFileSizeForCompress: 0,
            },
          );
          let strURIToUse;
          let details = await getFileInfo(dstUrl);
          if (!dstUrl.includes('file:///') && Platform.OS === 'android') {
            strURIToUse = dstUrl.replace('file://', 'file:///');
          } else {
            strURIToUse = dstUrl;
          }
          let OB = {
            ...video,
            path: strURIToUse,
            sourceURL: dstUrl,
            size: details.size,
          };
          onSuccess(OB);
        })
        .catch(error => {
          if (error?.toString()?.includes('permission')) {
            Toast.show({
              type: 'error',
              text1: 'Please grant camera permission!',
            });
          }
          onFailure(error);
        });
    })
    .catch(error => {
      if (error?.toString()?.includes('permission')) {
        Toast.show({
          type: 'error',
          text1: 'Please grant camera permission!',
        });
      }
    });
}

export async function GetGalleryVideo(onSuccess:any, onFailure:any) {
  ImagePicker.openPicker({
    mediaType: 'video',
  })
    .then(async (video:any) => {
      try {
        const dstUrl = await Video.compress(
          Platform.OS == 'ios' ? video.sourceURL : video.path,
          {
            compressionMethod: 'auto',
            minimumFileSizeForCompress: 0,
          },
        );

        let strURIToUse;
        let details = await getFileInfo(dstUrl);
        if (!dstUrl.includes('file:///') && Platform.OS === 'android') {
          strURIToUse = dstUrl.replace('file://', 'file:///');
        } else {
          strURIToUse = dstUrl;
        }
        let OB = {
          ...video,
          path: strURIToUse,
          sourceURL: dstUrl,
          size: details.size,
        };
        onSuccess(OB);
      } catch (error) {
        if (error?.toString()?.includes('permission')) {
          Toast.show('Please grant storage permission!', Toast.LONG);
        }
        onFailure(error);
      }
    })
    .catch(error => {
      if (error?.toString()?.includes('permission')) {
        Toast.show('Please grant storage permission!', Toast.LONG);
      }
      onFailure(error);
    });
}

export function GetDocuments(onSuccess:any, onFailure:any) {
  DocumentPicker.pick({
    allowMultiSelection: false,
    type: types.pdf,
  })
    .then(document => {
      onSuccess(document);
    })
    .catch(error => {
      if (error?.toString()?.includes('permission')) {
        Toast.show({
          type: 'error',
          text1: 'Please grant external file permission!',
        });
      }
      onFailure(error);
    });
}

export async function GetDoucmentParams(document:any, onSuccess:any, onFailure:any) {
  const uriParts = document[0].name
    ? document[0].name.split('.')
    : document[0].uri.split('.');
  let strURIToUse;
  if (Platform.OS == 'ios') {
    if (document[0].sourceURL) {
      strURIToUse = document[0].sourceURL.replace('file:/', '');
    } else if (document[0].uri) {
      strURIToUse = document[0].uri.replace('file:/', '');
    } else {
      strURIToUse = document[0].path;
    }
  } else {
    strURIToUse = document[0].uri;
  }
  if (strURIToUse?.endsWith('.HEIC')) {
    await RNHeicConverter.convert({
      path: strURIToUse,
    }).then(async (result:any) => {
      let imageParam = {
        uri: result.path,
        name:
          Math.round(new Date().getTime() / 1000) +
          '.' +
          uriParts[uriParts.length - 1],
        type: document[0].mime,
      };
      if (imageParam) {
        await onSuccess(imageParam);
      } else {
        onFailure(null);
      }
    });
  } else {
    let imageParam = {
      uri: strURIToUse,
      name:
        document[0].name ||
        Math.round(new Date().getTime() / 1000) +
          '.' +
          uriParts[uriParts.length - 1],
      type: document[0].type,
    };
    if (imageParam) {
      await onSuccess(imageParam);
    } else {
      onFailure(null);
    }
  }
}
