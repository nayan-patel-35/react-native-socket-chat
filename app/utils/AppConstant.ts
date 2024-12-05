import {Dimensions, Linking, Platform} from 'react-native';

export const DEVICE_HEIGHT = Dimensions.get('screen').height;
export const DEVICE_WEIGHT = Dimensions.get('screen').width;
export const BASE_TOP_IOS = '-20%';

export const DUMMY_AVTAR_URL =
  'https://ant-stream.s3.amazonaws.com/ef3-placeholder-image.webp';
export const DUMMY_PLACEHOLDER =
  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

export const CHAT_MESSAGE_TYPE = {
  ATTACHMENT_IMAGE: 'attachment: image',
  ATTACHMENT_VIDEO: 'attachment: video',
  ATTACHMENT_FILE: 'attachment: file',
};

export const CHAT_MESSAGE_STRING_TYPE = {
  Image_Type: 'Image',
  Video_Type: 'Video',
  File_Type: 'File',
};

export const SOCKET_EVENT_TYPE = {
  JOIN_CHAT: 'join chat',
  MESSAGE: 'message',
};

export const CHANNEL_TYPE = {
  CHAT: 'Chat',
  GROUP: 'Group',
};

export const FILES_TYPES = {
  JPEG: 'image/jpeg',
  JPG: 'image/jpg',
  PNG: 'image/png',
  MP4: 'video/mp4',
  MKV: 'video/mkv',
  PDF: 'application/pdf',
};

export const EMOJIS = ['🤘', '🤪', '😡', '😂', '😭'];

export function isIphoneWithNotch() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTV &&
    (dimen.height === 780 ||
      dimen.width === 780 ||
      dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 844 ||
      dimen.width === 844 ||
      dimen.height === 896 ||
      dimen.width === 896 ||
      dimen.height === 926 ||
      dimen.width === 926)
  );
}

export const isEmpty = (data: any) => {
  if (
    data !== null &&
    data !== '' &&
    data !== undefined &&
    data !== 'undefined' &&
    data !== 'null'
  ) {
    return false;
  }
  return true;
};

export const checkArrayOjectIsEmpty = (array: any) => {
  let isNullish = array.map((item: any) => {
    let isNull = Object.values(item).some(value => {
      if (isEmpty(value)) {
        return true;
      }
      return false;
    });
    return isNull;
  });
  let callbackStatus =
    isNullish?.length > 0 && isNullish.find((item: any) => item);
  return callbackStatus === true ? true : false;
};

export const toFixed = (x: any, n: any) => {
  // // var re = new RegExp('^-?\\d+(?:.\\d{0,' + (n || -1) + '})?');
  // let tempNum = x.toString().match(/^\d+(?:\.\d{0,2})?/)[0];
  // return tempNum === 0 || tempNum === '0' ? '0.00' : tempNum;

  const v = (typeof x === 'string' ? x : x.toString()).split('.');
  if (n <= 0) return v[0];
  let f = v[1] || '';
  if (f.length > n) return `${v[0]}.${f.substr(0, n)}`;
  while (f.length < n) f += '0';
  return `${v[0]}.${f}`;
};

export const formatedCurrency = (currency: string) => {
  let tempCurrency = Number(currency);
  return (
    tempCurrency &&
    tempCurrency.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
    })
  );
};

export const isValidUrl = (urlString: any) => {
  let returnIsValidUrl = false;
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', // fragment locator
    'i',
  );

  if (pattern.test(urlString)) {
    if (
      ((urlString?.startsWith('http://') ||
        urlString?.startsWith('https://')) &&
        (!urlString?.startsWith('www.') || !urlString?.startsWith('www')) &&
        urlString?.startsWith('http://www')) ||
      urlString?.startsWith('https://www.')
    ) {
      returnIsValidUrl = true; // IF url is valid and not start with www
    } else {
      returnIsValidUrl = false; // IF url is valid and not start with www
    }
  } else {
    returnIsValidUrl = false;
  }
  return returnIsValidUrl;
};

export const IsOpenURL = (urlString: string) => {
  try {
    const supported: any = Linking.canOpenURL(urlString);
    if (supported) {
      Linking.openURL(urlString);
    } else {
      return false;
      // Alert.alert('URL is not supported', `${urlString}`);
    }
  } catch (error) {
    return false;
  }
};

export const generateAvatar = (name: string) => {
  if (/\s/?.test(name)) {
    let spiltString = name?.toString()?.split(' ');
    if (spiltString?.length > 0) {
      return (
        spiltString[0]?.toString()?.trim()?.charAt(0)?.toUpperCase() +
        spiltString[1]?.toString()?.trim()?.charAt(0)?.toUpperCase()
      );
    } else {
      return name?.toString()?.trim()?.charAt(0)?.toUpperCase();
    }
  } else {
    return name?.toString()?.trim()?.charAt(0)?.toUpperCase();
  }
};

export const getFileTypeFromUrl = (fileUrl: string): string | null => {
  const {JPEG, JPG, PNG, MKV, MP4, PDF} = FILES_TYPES;

  const mimeTypes: Record<string, string> = {
    jpeg: JPEG,
    jpg: JPG,
    png: PNG,
    pdf: PDF,
    mp4: MP4,
    mkv: MKV,
  };

  try {
    const fileNameWithExtension = fileUrl.split('/').pop();
    if (!fileNameWithExtension) {
      throw new Error('File name could not be extracted from the URL.');
    }

    const extension = fileNameWithExtension.split('.').pop()?.toLowerCase();
    if (!extension) {
      throw new Error('File extension could not be determined.');
    }

    return mimeTypes[extension] || null;
  } catch (error) {
    console.error('Error determining file type:', error);
    return null;
  }
};

export const getUrlExtension = (url: any) => {
  return url
    ?.toString()
    ?.toLowerCase()
    ?.split(/[#?]/)[0]
    .split('.')
    .pop()
    .trim();
};
