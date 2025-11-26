//@ts-nocheck
import browser, { storage } from "webextension-polyfill";
import { useTwitchAuth } from "./context/TwitchAuthContext";
import { getAccessToken } from "./api/twitch";

if (!navigator.userAgent.toLowerCase().includes("firefox"))
  browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

async function initiateTwitchOAuth() {
  const params = {
    response_type: "code",
    client_id: import.meta.env.VITE_TWITCH_CLIENT_ID,
    redirect_uri: browser.identity.getRedirectURL(),
    scope: "user:read:follows",
  };
  const searchParams = new URLSearchParams(params);
  const AUTH_URL = `https://id.twitch.tv/oauth2/authorize?${searchParams.toString()}`;

  const response: string = await browser.identity.launchWebAuthFlow({
    url: AUTH_URL,
    interactive: true,
  });

  const url = new URL(response);
  const code = url.searchParams.get("code");

  const accessToken = await getAccessToken(code);
  storage.local.set({ "tw-access-token": accessToken });
  return { success: true, accessToken: accessToken };
}

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "START_TWITCH_AUTH") {
    initiateTwitchOAuth()
      .then((response) => {
        sendResponse(response);
      })
      .catch((error) => {
        console.error("Unexpected error during authentication:", error);
        sendResponse({ success: false, error: "Internal background error." });
      });
    return true;
  }
});
