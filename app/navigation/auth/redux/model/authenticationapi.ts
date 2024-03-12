import {Api} from '../../../../sharedUtils/services/api/api';

export default new (class API extends Api {
  constructor() {
    super();
  }

  getToken(_id: string, clientId: string, baseUrl?: string) {
    return this.get(`get-token?userId=${_id}&clientId=${clientId}`, baseUrl);
  }

  userRegister(body: any) {
    return this.post('register', body);
  }

  userLogin(body: any) {
    return this.post('auth/login', body);
  }

  isLoggedIn() {
    return this.get('auth/isLoggedIn');
  }

  logout() {
    return this.get(`auth/logout`);
  }
})();
