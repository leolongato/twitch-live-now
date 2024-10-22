import { isTokenValid, refreshAccessToken } from "@/api/twitch";
import { TwitchAuthResponse } from "@/types/TwitchAuthResponse";

const handleTokenRefresh = async (
  token: TwitchAuthResponse
): Promise<TwitchAuthResponse> => {
  const isValid = await isTokenValid(token.access_token);

  if (!isValid) {
    const newToken = await refreshAccessToken(token.refresh_token);

    return newToken;
  }

  return token;
};

export default handleTokenRefresh;
