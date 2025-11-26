import { useEffect, useState } from "react";
import { StreamData } from "../types/Stream";
import { StreamCard } from "./StreamCard";
import { TwitchUser, TwitchUserResponse } from "../types/TwitchUser";
import {
  ArrowLeftIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
} from "@heroicons/react/16/solid";
import { getUsersInfo } from "@/api/twitch";
import { useTwitchAuth } from "@/context/TwitchAuthContext";
import { ExtensionMenu } from "./ExtensionMenu";
import { useDebounce } from "use-debounce";
import { SkeletonStreamCards } from "./SkeletonStreamCard";
import { PaginationButton } from "./PaginationButton";

import { motion, AnimatePresence } from "motion/react";

const scrollConfig = [
  "[&::-webkit-scrollbar]:w-2",
  "[&::-webkit-scrollbar-track]:rounded-full",
  "[&::-webkit-scrollbar-track]:bg-zinc-700",
  "[&::-webkit-scrollbar-thumb]:rounded-full",
  "[&::-webkit-scrollbar-thumb]:bg-zinc-500",
  "dark:[&::-webkit-scrollbar-track]:bg-neutral-700",
  "dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500",
];

function generatePagination(data: any[], numberPerPage: number) {
  const result = [];
  for (let i = 0; i < data.length; i += numberPerPage) {
    result.push(data.slice(i, i + numberPerPage));
  }
  return result;
}

export const PaginationComponent: React.FC<{
  streams: StreamData[];
  user: TwitchUser;
}> = ({ streams, user }) => {
  const { accessToken } = useTwitchAuth();
  const [pages, setPages] = useState<any[]>([]);
  const [streamIds, setStreamIds] = useState<TwitchUserResponse | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [debounceValue, { cancel, isPending }] = useDebounce(searchValue, 500);
  const [searchOpen, setSearchOpen] = useState(false);

  const pagesLength = pages.length - 1;

  useEffect(() => {
    async function getStreamersInfo() {
      if (!accessToken) return;
      if (streams.length === 0) return;

      const res = await getUsersInfo(accessToken.access_token, streams);
      if (res) setStreamIds(res);
    }

    getStreamersInfo();

    const splittedArray = generatePagination(streams, 8);
    setPages(splittedArray);
  }, [streams, accessToken]);

  return (
    <div className="flex flex-col h-screen">
      <header className="flex flex-col gap-2 px-4 py-2 bg-zinc-800">
        {/* Top bar com avatar, paginação e pesquisa */}
        <div className="flex w-full gap-2">
          {/* Avatar + Menu */}
          <ExtensionMenu
            profileUrl={user.profile_image_url}
            userName={user.display_name}
          />

          {/* Botão de busca e input */}
          <div className="relative flex items-center w-full gap-2">
            {/* Botão */}
            <button
              onClick={() => setSearchOpen((prev) => !prev)}
              className="p-1 border-2 rounded-md border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white"
            >
              {searchOpen ? (
                <XMarkIcon
                  className="size-6"
                  onClick={() => {
                    setSearchValue(null);
                    cancel();
                  }}
                />
              ) : (
                <MagnifyingGlassIcon className="size-6" />
              )}
            </button>

            <>
              <AnimatePresence>
                {searchOpen && (
                  <motion.input
                    key="search"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.1, ease: "easeInOut" }}
                    type="text"
                    value={searchValue || ""}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search for a streamer..."
                    className="w-full px-3 py-1 text-base border rounded bg-zinc-700 text-zinc-100 border-zinc-600 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/25"
                  />
                )}
              </AnimatePresence>
              {searchValue && (
                <XMarkIcon
                  onClick={() => {
                    setSearchValue(null);
                    cancel();
                  }}
                  className="absolute cursor-pointer right-2 text-zinc-400 size-5"
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                />
              )}

              {!searchOpen && !debounceValue && !isPending() && (
                <>
                  <div className="flex items-center space-x-1">
                    <PaginationButton
                      onClick={() => setCurrentPageIndex(0)}
                      disabled={currentPageIndex === 0}
                    >
                      <ChevronDoubleLeftIcon className="size-5" />
                    </PaginationButton>

                    <PaginationButton
                      onClick={() => setCurrentPageIndex(currentPageIndex - 1)}
                      disabled={currentPageIndex === 0}
                    >
                      <ArrowLeftIcon className="size-4" />
                    </PaginationButton>

                    <PaginationButton
                      onClick={() => setCurrentPageIndex(currentPageIndex + 1)}
                      disabled={currentPageIndex === pagesLength}
                    >
                      <ArrowRightIcon className="size-4" />
                    </PaginationButton>

                    <PaginationButton
                      onClick={() => setCurrentPageIndex(pagesLength)}
                      disabled={currentPageIndex === pagesLength}
                    >
                      <ChevronDoubleRightIcon className="size-5" />
                    </PaginationButton>
                  </div>
                  <div className="min-w-[100px] overflow-hidden text-sm font-medium text-center text-zinc-300 text-ellipsis whitespace-nowrap">
                    Page {currentPageIndex + 1} of {pagesLength + 1}
                  </div>
                </>
              )}
            </>
          </div>
        </div>
      </header>

      <div
        className={`grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 overflow-x-hidden overflow-y-auto py-2 pl-4 pr-2 w-full place-content-start ${scrollConfig.join(
          " "
        )}`}
      >
        {isPending() ? (
          <SkeletonStreamCards />
        ) : debounceValue ? (
          streams.filter((s) =>
            s.user_name.toLowerCase().includes(debounceValue.toLowerCase())
          ).length > 0 ? (
            streams
              .filter((s) =>
                s.user_name.toLowerCase().includes(debounceValue.toLowerCase())
              )
              .map((value) => {
                const streamerImage = streamIds?.data.find(
                  (s) => s.id === value.user_id
                )?.profile_image_url;

                return (
                  <StreamCard
                    streamData={value}
                    streamImage={streamerImage || ""}
                    key={value.user_id}
                  />
                );
              })
          ) : (
            <p className="text-base font-semibold text-zinc-400">
              No streamers found.
            </p>
          )
        ) : (
          pages[currentPageIndex]?.map((value: any) => {
            const streamerImage = streamIds?.data.find(
              (s) => s.id === value.user_id
            )?.profile_image_url;

            return (
              <StreamCard
                streamData={value}
                streamImage={streamerImage || ""}
                key={value.user_id}
              />
            );
          }) || null
        )}
      </div>
    </div>
  );
};
