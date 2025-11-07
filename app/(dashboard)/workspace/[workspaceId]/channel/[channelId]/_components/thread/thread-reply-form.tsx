"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createMessageSchema, CreateMessageSchemaType } from "@/app/schemas/message";
import { useParams } from "next/navigation";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { MessageComposer } from "../message/message-composer";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";
import { useEffect, useState } from "react";
import { orpc } from "@/lib/orpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Message } from "@/lib/generated/prisma";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { getAvatar } from "@/lib/get-avatar";

interface ThreadReplyFormProps {
  threadId: string;
  user: KindeUser<Record<string, unknown>>;
}

export const ThreadReplyForm = ({ threadId, user }: ThreadReplyFormProps) => {
  const { channelId } = useParams<{ channelId: string }>();
  const upload = useAttachmentUpload();
  const [editorKey, setEditorKey] = useState(0);
  const queryClient = useQueryClient();

  const form = useForm<CreateMessageSchemaType>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      content: "",
      channelId: channelId,
      threadId: threadId,
    },
  });

  useEffect(() => {
    form.setValue("threadId", threadId);
  }, [threadId, form]);

  const createMessageMutation = useMutation(
    orpc.message.create.mutationOptions({
      onMutate: async (data) => {
        const listOptions = orpc.message.thread.list.queryOptions({
          input: {
            messageId: threadId,
          },
        });
        await queryClient.cancelQueries({ queryKey: listOptions.queryKey });

        const previous = queryClient.getQueryData(listOptions.queryKey);

        const optimistic: Message = {
          id: `optimistic: ${crypto.randomUUID()}`,
          content: data.content,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: user.id,
          authorEmail: user.email!,
          authorName: user.given_name ?? "John Fisher",
          authorAvatar: getAvatar(user.picture, user.email!),
          channelId: channelId,
          threadId: threadId,
          imageUrl: data.imageUrl ?? null,
        };

        queryClient.setQueryData(listOptions.queryKey, (old) => {
          if (!old) return old;

          return {
            ...old,
            messages: [...old.messages, optimistic],
          };
        });

        return { listOptions, previous };
      },
      onSuccess: (_data, _vars, ctx) => {
        queryClient.invalidateQueries({
          queryKey: ctx.listOptions.queryKey,
        });

        form.reset({ channelId, content: "", threadId });
        upload.clear();
        setEditorKey((prev) => prev + 1);

        return toast.success("Message sent successfully!");
      },
      onError: (_err, _vars, ctx) => {
        if (!ctx) return;

        const { listOptions, previous } = ctx;

        if (previous) {
          queryClient.setQueryData(listOptions.queryKey, previous);
        }

        return toast.error("Failed to send message.");
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
                  upload={upload}
                  onSubmit={() => onSubmit(form.getValues())}
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
