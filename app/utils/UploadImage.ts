import { Config } from 'react-native-config';

export const uploadImage = (body: any) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('files', body);

    let url = `${Config?.SOCKET_BASE_URL}api/v1/aws/upload-file`;

    console.log('uploadImage',url);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson);
      })
      .catch(error => {
        reject('error');
      });
  });
};
