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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface ThreadReplyFormProps {
  threadId: string;
}

export const ThreadReplyForm = ({ threadId }: ThreadReplyFormProps) => {
  const { channelId } = useParams<{ channelId: string }>();
  const upload = useAttachmentUpload();
  const [editorKey, setEditorKey] = useState(0);

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
      onSuccess: () => {
        form.reset({ channelId, content: "", threadId });
        upload.clear();
        setEditorKey((prev) => prev + 1);
        return toast.success("Message sent successfully!");
      },
      onError: () => {
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
