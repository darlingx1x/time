export interface TelegramAuthData {
  id: number | string;
  username: string;
  first_name: string;
  last_name?: string;
  hash: string;
  photo_url?: string;
  bio?: string;
  phone_number?: string;
  [key: string]: string | number | undefined;
}
