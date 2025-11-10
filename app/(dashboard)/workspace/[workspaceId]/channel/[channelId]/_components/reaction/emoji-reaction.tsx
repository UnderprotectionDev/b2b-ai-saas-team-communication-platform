import { Button } from "@/components/ui/button";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { SmilePlusIcon } from "lucide-react";
import { useState } from "react";

interface EmojiReactionProps {
  onSelect: (emoji: string) => void;
}

export const EmojiReaction = ({ onSelect }: EmojiReactionProps) => {
  const [open, setOpen] = useState(false);

  const handleEmojiSelect = (emoji: string) => {
    onSelect(emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="size-6">
          <SmilePlusIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" align="start">
        <EmojiPicker className="h-[324px]" onEmojiSelect={(e) => handleEmojiSelect(e.emoji)}>
          <EmojiPickerSearch />
          <EmojiPickerContent />
          <EmojiPickerFooter />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  );
};
