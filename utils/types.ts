export interface Auth {
  preferred_username: string;
  picture: string;
  name: string;
  isLocalUse?: boolean;
}

export interface LocalSettings {
  apiKey: string;
  apiUrl: string;
  model: string;
  openRouterApiKey: string;
  openRouterApiUrl: string;
  openRouterModel: string;
}
