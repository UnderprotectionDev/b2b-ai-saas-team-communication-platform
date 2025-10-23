/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { editorExtensions } from "./extensions";
import { MenuBar } from "./menu-bar";

interface RichTextEditorProps {
  field: any;
  sendButton: React.ReactNode;
  footerLeft?: React.ReactNode;
}

export const RichTextEditor = ({ field, sendButton, footerLeft }: RichTextEditorProps) => {
  const editor = useEditor({
    content: (() => {
      try {
        return JSON.parse(field.value);
      } catch {
        return "";
      }
    })(),
    onUpdate: ({ editor }) => {
      if (field?.onChange) {
        field.onChange(JSON.stringify(editor.getJSON()));
      }
    },
    extensions: editorExtensions,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "max-w-none min-h-[125px] focus:outline-none p-4 prose dark:prose-invert",
      },
    },
  });

  return (
    <div className="relative w-full border border-input rounded-lg overflow-hidden dark:bg-input/30 flex flex-col">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="max-h-[400px] overflow-y-auto marker:text-primary"
      />

      <div className="flex items-center justify-between gap-2 ox-3 py-2 border-t border-input bg-card">
        <div className="min-h-8 flex items-center">{footerLeft}</div>
        <div className="shing-0">{sendButton}</div>
      </div>
    </div>
  );
};
