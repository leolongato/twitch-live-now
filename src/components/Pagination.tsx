import { useEffect, useState } from "react";
import { StreamData } from "../types/Stream";
import { StreamCard } from "./StreamCard";
import { TwitchUser, TwitchUserResponse } from "../types/TwitchUser";
import { Input } from "@headlessui/react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import clsx from "clsx";
import { getUsersInfo } from "@/api/twitch";
import { useTwitchAuth } from "@/context/TwitchAuthContext";
import { ExtensionMenu } from "./ExtensionMenu";
import { useDebounce } from "use-debounce";
import { SkeletonStreamCards } from "./SkeletonStreamCard";

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

export const Pagination: React.FC<{
  streams: StreamData[];
  user: TwitchUser;
}> = ({ streams, user }) => {
  const { accessToken } = useTwitchAuth();
  const [pages, setPages] = useState<any[]>([]);
  const [streamIds, setStreamIds] = useState<TwitchUserResponse | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [debounceValue, { cancel, isPending }] = useDebounce(searchValue, 500);

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
  }, [streams]);

  return (
    <div>
      <div className="flex items-center justify-center py-2 pl-4 pr-2 space-x-2">
        <div className="relative flex items-center justify-center w-full">
          <MagnifyingGlassIcon className="absolute left-0 mx-2 text-zinc-400 size-6" />
          <Input
            className={clsx(
              "w-full block rounded-lg border-none bg-white/5 py-1.5 px-3 pl-9 text-sm/6 text-zinc-100",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
            )}
            placeholder="Search for a live stream..."
            value={searchValue || ""}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
          {searchValue && (
            <XMarkIcon
              onClick={() => {
                setSearchValue(null);
                cancel();
              }}
              className="absolute right-0 mx-2 cursor-pointer text-zinc-400 size-6"
            />
          )}
        </div>
        <ExtensionMenu
          profileUrl={user.profile_image_url}
          userName={user.display_name}
        />
      </div>
      {!debounceValue && !isPending() && (
        <div className="flex items-center mx-4 mb-2 space-x-2 bg-zinc-800 w-80">
          <button
            onClick={() => setCurrentPageIndex(currentPageIndex - 1)}
            disabled={currentPageIndex === 0}
            className="flex items-center justify-center rounded-lg size-8 bg-zinc-700 text-zinc-100 disabled:pointer-events-none disabled:bg-zinc-900/80"
          >
            <ArrowLeftIcon className="size-4" />
          </button>

          {pages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPageIndex(index)}
              disabled={index === currentPageIndex}
              className="flex items-center justify-center rounded-lg size-8 bg-zinc-700 text-zinc-100 disabled:pointer-events-none disabled:bg-fuchsia-800"
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPageIndex(currentPageIndex + 1)}
            disabled={currentPageIndex === pages.length - 1}
            className="flex items-center justify-center rounded-lg size-8 bg-zinc-700 text-zinc-100 disabled:pointer-events-none disabled:bg-zinc-900/80"
          >
            <ArrowRightIcon className="size-4" />
          </button>
        </div>
      )}
      <div
        className={[
          "h-screen overflow-x-hidden pt-1 pb-28 overflow-y-scroll w-full flex flex-col gap-4 items-center",
          scrollConfig.join(" "),
        ].join(" ")}
      >
        {isPending() ? (
          <SkeletonStreamCards />
        ) : debounceValue ? (
          streams
            .filter((s) => s.user_name.toLowerCase().includes(debounceValue))
            ?.map((value: any) => {
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
          })
        )}
      </div>
    </div>
  );
};
