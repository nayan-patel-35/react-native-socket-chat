import Config from "react-native-config";

const BASE_URL: string | any = Config.BASE_URL;

export const getChannelListRequest = async (_id: string, token: string) => {
  return new Promise((resolve, reject) => {
    let url = `${BASE_URL}channel/chat-channel?skip=0&limit=10&userId=${_id}`;

    console.log(
      "getChannelListRequest",
      `${BASE_URL}channel/chat-channel?skip=0&limit=10&userId=${_id}`
    );
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getMessageListRequest = async (
  channelId: string,
  token: string
) => {
  return new Promise((resolve, reject) => {
    let url = `${BASE_URL}messages?channelId=${channelId}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
