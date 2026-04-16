export interface Token {
  getAccessToken(): Promise<string>;
  remove(): Promise<boolean>;
}
