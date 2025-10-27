"use client";

import { useCallback, useMemo, useState } from "react";

export function useAttachmentUpload() {
  const [isOpen, setIsOpen] = useState(false);
  const [stagedImageUrl, setStagedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onUploaded = useCallback((url: string) => {
    setStagedImageUrl(url);
    setIsUploading(false);
    setIsOpen(false);
  }, []);

  const clear = useCallback(() => {
    setStagedImageUrl(null);
    setIsUploading(false);
  }, []);

  return useMemo(
    () => ({
      isOpen,
      setIsOpen,
      onUploaded,
      stagedImageUrl,
      isUploading,
      clear,
    }),
    [isOpen, setIsOpen, onUploaded, stagedImageUrl, isUploading, clear]
  );
}

export type UseAttachmentUploadType = ReturnType<typeof useAttachmentUpload>;
