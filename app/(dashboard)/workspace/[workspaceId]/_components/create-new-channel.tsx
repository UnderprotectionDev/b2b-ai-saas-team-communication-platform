"use client";

import { useState } from "react";
import {
  ChannelNameSchema,
  ChannelNameSchemaType,
  transformChannelName,
} from "@/app/schemas/channel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { isDefinedError } from "@orpc/client";
import { useParams, useRouter } from "next/navigation";

export const CreateNewChannel = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const router = useRouter();

  const { workspaceId } = useParams<{ workspaceId: string }>();

  const form = useForm<ChannelNameSchemaType>({
    resolver: zodResolver(ChannelNameSchema),
    defaultValues: {
      name: "",
    },
  });

  const createChannelMutation = useMutation(
    orpc.channel.create.mutationOptions({
      onSuccess: (newChannel) => {
        toast.success(`Channel ${newChannel.name} created successfully!`);

        queryClient.invalidateQueries({
          queryKey: orpc.channel.list.queryKey(),
        });

        form.reset();
        setOpen(false);

        router.push(`/workspace/${workspaceId}/channel/${newChannel.id}`);
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          toast.error(error.message);
          return;
        }
        toast.error("Failed to create channel. Please try again.");
      },
    })
  );

  function onSubmit(values: ChannelNameSchemaType) {
    createChannelMutation.mutate(values);
  }

  const watchedName = form.watch("name");
  const transformedName = watchedName ? transformChannelName(watchedName) : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <PlusIcon className="size-4" />
          Add Channel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>Create a new channel to get started!</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Channel" {...field} />
                  </FormControl>
                  {transformedName && transformedName !== watchedName && (
                    <p className="text-sm text-muted-foreground">
                      Channel will be created as:{" "}
                      <code className="bg-muted px-1 py-0.5 text-xs">{transformedName}</code>
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createChannelMutation.isPending}>
              {createChannelMutation.isPending ? "Creating..." : "Create Channel"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
