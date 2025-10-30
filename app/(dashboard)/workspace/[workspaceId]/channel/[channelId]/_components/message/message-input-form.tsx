"use client";

import { createMessageSchema, CreateMessageSchemaType } from "@/app/schemas/message";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MessageComposer } from "./message-composer";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { useState } from "react";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";
import { Message } from "@/lib/generated/prisma";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { getAvatar } from "@/lib/get-avatar";

interface MessageInputFormProps {
  channelId: string;
  user: KindeUser<Record<string, unknown>>;
}

type MessageProps = {
  items: Message[];
  nextCursor?: string;
};
type InfiniteMessages = InfiniteData<MessageProps>;

export const MessageInputForm = ({ channelId, user }: MessageInputFormProps) => {
  const queryClient = useQueryClient();
  const [editorKey, setEditorKey] = useState(0);
  const upload = useAttachmentUpload();

  const form = useForm<CreateMessageSchemaType>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      channelId: channelId,
      content: "",
    },
  });

  const createMessageMutation = useMutation(
    orpc.message.create.mutationOptions({
      onMutate: async (data) => {
        await queryClient.cancelQueries({
          queryKey: ["message.list", channelId],
        });

        const previousData = queryClient.getQueryData<InfiniteMessages>([
          "message.list",
          channelId,
        ]);

        const tempId = `optimistic-${crypto.randomUUID()}`;

        const optimisticMessage: Message = {
          id: tempId,
          content: data.content,
          imageUrl: data.imageUrl ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: user.id,
          authorName: user.given_name || "John Doe",
          authorEmail: user.email!,
          authorAvatar: getAvatar(user.picture, user.email!),
          channelId: channelId,
        };

        queryClient.setQueryData<InfiniteMessages>(["message.list", channelId], (old) => {
          if (!old) {
            return {
              pages: [
                {
                  items: [optimisticMessage],
                  nextCursor: undefined,
                },
              ],
              pageParams: [undefined],
            } as InfiniteMessages;
          }

          const firstPage = old.pages[0] ?? {
            items: [],
            nextCursor: undefined,
          };

          const updatedFirstPage = {
            ...firstPage,
            items: [optimisticMessage, ...firstPage.items],
          };

          return {
            ...old,
            pages: [updatedFirstPage, ...old.pages.slice(1)],
          };
        });

        return { previousData, tempId };
      },

      onSuccess: (data, _variablies, context) => {
        queryClient.setQueryData<InfiniteMessages>(["message.list", channelId], (old) => {
          if (!old) return old;

          const updatedPages = old.pages.map((page) => ({
            ...page,
            items: page.items.map((message) =>
              message.id === context.tempId
                ? {
                    ...data,
                  }
                : message
            ),
          }));
          return { ...old, pages: updatedPages };
        });

        form.reset({ channelId, content: "" });
        upload.clear();
        setEditorKey((prev) => prev + 1);

        return toast.success("message created successfully");
      },
      onError: (_err, _variablies, context) => {
        if (context?.previousData) {
          queryClient.setQueryData<InfiniteMessages>(
            ["message.list", channelId],
            context.previousData
          );
        }
        return toast.error("failed to create message");
      },
    })
  );

  function onSubmit(values: CreateMessageSchemaType) {
    createMessageMutation.mutate({
      ...values,
      imageUrl: upload.stagedImageUrl ?? undefined,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MessageComposer
                  key={editorKey}
                  value={field.value}
                  onChange={field.onChange}
                  onSubmit={() => onSubmit(form.getValues())}
                  isSubmitting={createMessageMutation.isPending}
                  upload={upload}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
