import { RichTextEditor } from "@/components/rich-text-editor/editor";
import { Button } from "@/components/ui/button";
import { ImageIcon, SendIcon } from "lucide-react";

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
}

export const MessageComposer = ({ value, onChange }: MessageComposerProps) => {
  return (
    <>
      <RichTextEditor
        field={{ value, onChange }}
        sendButton={
          <Button size="sm" type="submit" className="mr-2">
            <SendIcon className="size-4 mr-1" />
            Send
          </Button>
        }
        footerLeft={
          <Button size="sm" type="button" variant="outline" className="ml-2">
            <ImageIcon className="size-4 mr-1" />
            Attach
          </Button>
        }
      />
    </>
  );
};
