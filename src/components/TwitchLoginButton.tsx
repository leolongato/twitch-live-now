import { useTwitchAuth } from "../context/TwitchAuthContext";
import { runtime } from "webextension-polyfill";
import { FaTwitch } from "react-icons/fa";
import { Button } from "@headlessui/react";
import { TwitchAuthResponse } from "@/types/TwitchAuthResponse";

const TwitchLoginButton = () => {
  const { saveAccessToken } = useTwitchAuth();

  const handleLogin = async () => {
    try {
      const response: {
        success: false;
        accessToken: TwitchAuthResponse;
        error: string;
      } = await runtime.sendMessage({
        action: "START_TWITCH_AUTH",
      });

      if (response) {
        saveAccessToken(response.accessToken);
      }
    } catch (error) {
      console.error("Error sending message or during login process:", error);
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
