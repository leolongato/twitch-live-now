import { TwitchAuthResponse } from "@/types/TwitchAuthResponse";
import handleTokenRefresh from "@/api/handleTokenRefresh";
import axios from "axios";

//twitch mock-api start
const TWITCH_API_URL =
  import.meta.env.VITE_USE_TWITCH_MOCK_API === "true"
    ? "http://localhost:8080/units/streams"
    : "https://api.twitch.tv/helix/streams/followed";

const fetcher = async (
  accessToken: TwitchAuthResponse,
  user_id: string,
  saveAccessToken: (token: TwitchAuthResponse) => void
) => {
  try {
    const response = await axios.get(TWITCH_API_URL, {
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
      return fetcher(token, user_id, saveAccessToken);
    } else {
      throw error;
    }
  }
};

export default fetcher;
