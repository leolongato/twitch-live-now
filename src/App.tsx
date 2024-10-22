import { useEffect, useState } from "react";
import TwitchLoginButton from "./components/TwitchLoginButton";
import { useTwitchAuth } from "./context/TwitchAuthContext";
import { getUserInfo } from "./api/twitch";
import { TwitchUser } from "./types/TwitchUser";
import useSWR from "swr";
import LoadingSpinner from "./components/Spinner";
import { storage } from "webextension-polyfill";
import { TwitchAuthResponse } from "./types/TwitchAuthResponse";
import handleTokenRefresh from "./api/handleTokenRefresh";
import fetcher from "./api/fetcher";
import { Pagination } from "./components/Pagination";

const App = () => {
  const { accessToken, saveAccessToken } = useTwitchAuth();
  const [user, setUser] = useState<TwitchUser | null>(null);
  const [authFailed, setAuthFailed] = useState(false);

  const fetchUserInfo = async (token: string) => {
    try {
      const usr = await getUserInfo(token);
      setUser(usr);
      setAuthFailed(false);
    } catch (error) {
      setAuthFailed(true);
    }
  };

  const handleAuthFlow = async () => {
    const result: { "tw-access-token"?: TwitchAuthResponse } =
      await storage.local.get("tw-access-token");

    const currToken = result["tw-access-token"];
    if (currToken) {
      const newToken = await handleTokenRefresh(currToken);
      saveAccessToken(newToken);
      await fetchUserInfo(newToken.access_token);
    } else {
      setAuthFailed(true);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      handleAuthFlow();
    } else {
      fetchUserInfo(accessToken.access_token);
    }
  }, [accessToken]);

  const { data, error, isLoading } = useSWR(
    user && accessToken
      ? [
          "https://api.twitch.tv/helix/streams/followed",
          accessToken,
          user.id,
          saveAccessToken,
        ]
      : null,
    ([url, token, user_id, saveAccessToken]) =>
      fetcher(url, token, user_id, saveAccessToken),
    {
      errorRetryCount: 3,
      errorRetryInterval: 3000,
      refreshInterval: 30000,
    }
  );

  if (authFailed) return <TwitchLoginButton />;

  if (!user) return <LoadingSpinner />;

  return (
    <div className="w-[360px] h-full">
      {data && <Pagination streams={data.data} user={user} />}
      {error && (
        <h1 className="text-lg font-semibold text-zinc-100">
          Error while loading live streams.
        </h1>
      )}
    </div>
  );
};

export default App;
