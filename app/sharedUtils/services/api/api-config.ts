import Config from 'react-native-config';

const PMS_BASE_URL: string | any = Config.PMS_BASE_URL;
const BASE_URL: string | any = Config.BASE_URL;

export const API_URL = PMS_BASE_URL;
/**
 * The options used to configure the API.
 */
export interface ApiConfig {
  /**
   * The URL of the api.
   */
  url: string;
  /**
   * Milliseconds before we timeout the request.
   */
  timeout: number;
}

/**
 * The default configuration for the app.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: API_URL,
  timeout: 10000,
};
