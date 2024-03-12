import {ApiResponse, ApisauceInstance, create} from 'apisauce';
import {ApiConfig, DEFAULT_API_CONFIG} from './api-config';
import {getGeneralApiProblem} from './api-problem';

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance;

  /**
   * Configurable options.
   */
  config: ApiConfig;

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config;
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: 'application/json',
      },
    });
  }
  get(url: string, baseUrl?: string, headers?: any) {
    let mainURL: string = this.config.url + url;
    if (baseUrl) mainURL = baseUrl + url;

    console.log('@@@GETURL', mainURL, JSON.stringify(headers));
    return new Promise((resolve, reject) => {
      this.apisauce
        .get(mainURL, {}, {headers: headers})
        .then((response: ApiResponse<any>) => {
          if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) reject(problem);
          } else {
            resolve(response.data);
          }
        });
    });
  }

  post(url: string, data?: any, baseUrl?: string) {
    let mainURL: string = this.config.url + url;
    if (baseUrl) mainURL = baseUrl + url;

    console.log('@@@POSTURL', mainURL, '@@@data', JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.apisauce.post(mainURL, data).then((response: ApiResponse<any>) => {
        if (!response.ok) {
          const problem = getGeneralApiProblem(response);
          if (problem) reject(problem);
        } else {
          resolve(response.data);
        }
      });
    });
  }

  put(url: string, data?: any, baseUrl?: string) {
    let mainURL: string = this.config.url + url;
    if (baseUrl) mainURL = baseUrl + url;

    console.log('@@@PUTURL', mainURL, '@@@data', JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.apisauce.put(url, data).then((response: ApiResponse<any>) => {
        if (!response.ok) {
          const problem = getGeneralApiProblem(response);
          if (problem) reject(problem);
        } else {
          resolve(response.data);
        }
      });
    });
  }

  delete(url: string, data?: any, baseUrl?: string) {
    let mainURL: string = this.config.url + url;
    if (baseUrl) mainURL = baseUrl + url;

    console.log('@@@DELETEURL', mainURL, '@@@data', JSON.stringify(data));
    return new Promise((resolve, reject) => {
      this.apisauce
        .delete(mainURL, data, {data: data})
        .then((response: ApiResponse<any>) => {
          if (!response.ok) {
            const problem = getGeneralApiProblem(response);
            if (problem) reject(problem);
          } else {
            resolve(response.data);
          }
        });
    });
  }
}
