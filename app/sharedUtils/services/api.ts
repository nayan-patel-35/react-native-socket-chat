import {BASE_URL, PMS_BASE_URL} from '../../utils/AppConstant';

export const isLoggedInRequest = async () => {
  return new Promise((resolve, reject) => {
    let url = `${PMS_BASE_URL}auth/isLoggedIn`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      redirect: 'follow',
    })
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const loginRequest = async (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    console.log('formDataCheckStepperRedirection', email, password);

    let url = `${PMS_BASE_URL}auth/login`;

    const raw = JSON.stringify({
      email: email,
      password: password,
    });

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: raw,
      redirect: 'follow',
    })
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const getTokenRequest = async (_id: string, clientId: string) => {
  return new Promise((resolve, reject) => {
    let url = `${BASE_URL}get-token?userId=${_id}&clientId=${clientId}`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      redirect: 'follow',
    })
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const getChannelListRequest = async (_id: string) => {
  return new Promise((resolve, reject) => {
    let url = `${BASE_URL}channel/chat-channel?skip=0&limit=10&userId=${_id}`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${global.token}`,
      },
      redirect: 'follow',
    })
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const getMessageListRequest = async (channelId: string) => {
  return new Promise((resolve, reject) => {
    let url = `${BASE_URL}messages?channelId=${channelId}`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${global.token}`,
      },
      redirect: 'follow',
    })
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson);
      })
      .catch(error => {
        reject(error);
      });
  });
};
