"use client";

import { orpc } from "@/lib/orpc";
import { MessageItem } from "./message/message-item";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Message } from "@/lib/generated/prisma";

export const MessagesList = () => {
  const { channelId } = useParams<{ channelId: string }>();

  const { data: messages } = useQuery(
    orpc.message.list.queryOptions({
      input: { channelId },
    })
  );

  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-4">
        {messages?.map((message: Message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};
