import axios from "axios";
import { identity } from "webextension-polyfill";
import { TwitchUser, TwitchUserResponse } from "../types/TwitchUser";
import { StreamData, StreamResponse } from "../types/Stream";
import { TwitchAuthResponse } from "../types/TwitchAuthResponse";

const authApi = axios.create({
  baseURL: "https://id.twitch.tv/oauth2",
});

const dataApi = axios.create({
  baseURL: "https://api.twitch.tv/helix",
});

const getAccessToken = async (code: string): Promise<TwitchAuthResponse> => {
  const res = await authApi.post("/token", {
    client_id: import.meta.env.VITE_TWITCH_CLIENT_ID,
    client_secret: import.meta.env.VITE_TWITCH_CLIENT_SECRET,
    code: code,
    grant_type: "authorization_code",
    redirect_uri: identity.getRedirectURL(),
  });

  return res.data;
};

const isTokenValid = async (accessToken: string): Promise<boolean> => {
  try {
    await authApi.get("/validate", {
      headers: {
        Authorization: `OAuth ${accessToken}`,
      },
    });
  } catch (error: any) {
    return false;
  }

  return true;
};

const refreshAccessToken = async (
  refreshToken: string
): Promise<TwitchAuthResponse> => {
  const res = await authApi.post("/token", {
    client_id: import.meta.env.VITE_TWITCH_CLIENT_ID,
    client_secret: import.meta.env.VITE_TWITCH_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  return res.data;
};

const getUserInfo = async (access_token: string): Promise<TwitchUser> => {
  const res = await dataApi.get("/users", {
    headers: {
      "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID,
      Authorization: `Bearer ${access_token}`,
    },
  });

  return res.data.data[0];
};

const getUsersInfo = async (
  access_token: string,
  streams: StreamData[]
): Promise<TwitchUserResponse> => {
  const params = new URLSearchParams();
  streams.forEach((stream: StreamData) => {
    params.append("id", stream.user_id);
  });

  const res = await dataApi.get("/users", {
    params,
    headers: {
      "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID,
      Authorization: `Bearer ${access_token}`,
    },
  });

  return res.data;
};

const getFollowedStreams = async (
  access_token: string,
  user_id: string
): Promise<StreamResponse> => {
  const res = await dataApi.get("/streams/followed", {
    params: {
      user_id,
    },
    headers: {
      "Client-Id": import.meta.env.VITE_TWITCH_CLIENT_ID,
      Authorization: `Bearer ${access_token}`,
    },
  });

  return res.data;
};

export {
  getAccessToken,
  getUserInfo,
  getFollowedStreams,
  getUsersInfo,
  isTokenValid,
  refreshAccessToken,
};
