import { TwitchAuthResponse } from "@/types/TwitchAuthResponse";
import handleTokenRefresh from "@/api/handleTokenRefresh";
import axios from "axios";

const fetcher = async (
  url: string,
  accessToken: TwitchAuthResponse,
  user_id: string,
  saveAccessToken: (token: TwitchAuthResponse) => void
) => {
  try {
    const response = await axios.get(url, {
      params: {
        user_id,
      },
      headers: {
        "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID,
        Authorization: `Bearer ${accessToken?.access_token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      if (!accessToken) return;

      const token = await handleTokenRefresh(accessToken);
      saveAccessToken(token);
      return fetcher(url, token, user_id, saveAccessToken);
    } else {
      throw error;
    }
  }
};

export default fetcher;
