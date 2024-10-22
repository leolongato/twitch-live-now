import { useThumbnail } from "@/context/ThumbnailContext";
import { Skeleton } from "./ui/skeleton";

function SkeletonStreamCard() {
  const { thumbnailEnabled } = useThumbnail();

  return (
    <div className="flex flex-col items-center justify-center px-4 space-y-2">
      {thumbnailEnabled && <Skeleton className="w-full h-48 rounded-md" />}
      <div className="flex items-center w-full space-x-4">
        <Skeleton className="w-16 h-12 rounded-full" />
        <div className="w-full space-y-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonStreamCards() {
  const { thumbnailEnabled } = useThumbnail();
  return (
    <div className="flex flex-col w-full space-y-3">
      {thumbnailEnabled ? (
        <>
          <SkeletonStreamCard />
          <SkeletonStreamCard />
          <SkeletonStreamCard />
        </>
      ) : (
        <>
          <SkeletonStreamCard />
          <SkeletonStreamCard />
          <SkeletonStreamCard />
          <SkeletonStreamCard />
          <SkeletonStreamCard />
          <SkeletonStreamCard />
        </>
      )}
    </div>
  );
}
