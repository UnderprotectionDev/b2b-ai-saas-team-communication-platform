"use client";

import { useParams } from "next/navigation";
import { ChannelHeader } from "./_components/channel-header";
import { MessageInputForm } from "./_components/message/message-input-form";
import { MessagesList } from "./_components/messages-list";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChannelPage() {
  const { channelId } = useParams<{ channelId: string }>();
  const { data, isLoading, error } = useQuery(
    orpc.channel.get.queryOptions({
      input: { channelId: channelId },
    })
  );

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="flex h-screen w-full">
      {/* Main Channel Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Fixed Header */}
        {isLoading ? (
          <div className="flex items-center justify-between h-14 px-4 border-b">
            <Skeleton className="h-5 w-40" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="size-8" />
            </div>
          </div>
        ) : (
          <ChannelHeader channelName={data?.channelName} />
        )}
        {/* Scrollable Messages Area */}
        <div className="flex-1 overflow-hidden mb-4">
          <MessagesList />
        </div>

        {/* Fixed Input */}
        <div className="border-t bg-background p-4">
          <MessageInputForm
            channelId={channelId}
            user={data?.currentUser as KindeUser<Record<string, unknown>>}
          />
        </div>
      </div>
    </div>
  );
}
