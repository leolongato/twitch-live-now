import { useTwitchAuth } from "../context/TwitchAuthContext";
import { identity } from "webextension-polyfill";
import { getAccessToken } from "../api/twitch";
import { FaTwitch } from "react-icons/fa";
import { Button } from "@headlessui/react";

const params = {
  response_type: "code",
  client_id: import.meta.env.VITE_TWITCH_CLIENT_ID,
  redirect_uri: identity.getRedirectURL(),
  scope: "user:read:follows",
};
const searchParams = new URLSearchParams(params);
const AUTH_URL = `https://id.twitch.tv/oauth2/authorize?${searchParams.toString()}`;

const TwitchLoginButton = () => {
  const { saveAccessToken } = useTwitchAuth();

  const handleLogin = async () => {
    const response: string = await identity.launchWebAuthFlow({
      url: AUTH_URL,
      interactive: true,
    });
    const url = new URL(response);
    const code = url.searchParams.get("code");
    if (code) {
      const accessToken = await getAccessToken(code);
      saveAccessToken(accessToken);
    }
  };

  return (
    <Button
      className="flex items-center justify-center gap-2 px-4 py-2 text-white bg-purple-600 rounded shadow-md shadow-purple-500/20 text-md hover:ring-2 hover:ring-offset-2 hover:ring-purple-500 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      onClick={handleLogin}
    >
      <FaTwitch className="size-8" />
      <span className="text-base font-bold">Login with Twitch</span>
    </Button>
  );
};

export default TwitchLoginButton;
