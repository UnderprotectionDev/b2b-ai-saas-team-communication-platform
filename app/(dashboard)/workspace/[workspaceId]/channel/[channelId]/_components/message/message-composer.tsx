import { RichTextEditor } from "@/components/rich-text-editor/editor";
import { ImageUploadModal } from "@/components/rich-text-editor/image-upload-modal";
import { Button } from "@/components/ui/button";
import { UseAttachmentUploadType } from "@/hooks/use-attachment-upload";
import { ImageIcon, SendIcon } from "lucide-react";
import { AttachmentChip } from "./attachment-chip";

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  upload: UseAttachmentUploadType;
}

export const MessageComposer = ({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  upload,
}: MessageComposerProps) => {
  return (
    <>
      <RichTextEditor
        field={{ value, onChange }}
        sendButton={
          <Button size="sm" type="button" onClick={onSubmit} disabled={isSubmitting}>
            <SendIcon className="size-4 mr-1" />
            Send
          </Button>
        }
        footerLeft={
          upload.stagedImageUrl ? (
            <AttachmentChip url={upload.stagedImageUrl} onRemove={upload.clear} />
          ) : (
            <Button
              onClick={() => upload.setIsOpen(true)}
              size="sm"
              type="button"
              variant="outline"
            >
              <ImageIcon className="size-4 mr-1" />
              Attach
            </Button>
          )
        }
      />

      <ImageUploadModal
        open={upload.isOpen}
        onOpenChange={upload.setIsOpen}
        onUploaded={(url) => upload.onUploaded(url)}
      />
    </>
  );
};
