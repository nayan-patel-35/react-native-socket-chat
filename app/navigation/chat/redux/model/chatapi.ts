import {Api} from '../../../../sharedUtils/services/api/api';

export default new (class API extends Api {
  constructor() {
    super();
  }

  getChannelsList(params: any, baseUrl?: string) {
    let parameters = '?sortType=desc&sort=updatedAt';
    params?.skip && (parameters += '&skip=' + params?.skip);
    params?.limit &&
      (parameters += '&limit=' + params?.limit ? params?.limit : 10);
    params?.search && (parameters += '&search=' + params?.search);
    return this.get(
      `channel/chat-channel?skip=0&limit=10&userId=${params?._id}`,
      baseUrl,
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${params?.token}`,
      },
    );
  }

  getMessage(params: any) {
    return this.post('messages', params);
  }
})();
