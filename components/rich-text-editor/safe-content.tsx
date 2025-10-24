import { convertJsonToHtml } from "@/lib/json-to-html";
import { JSONContent } from "@tiptap/react";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

interface SafeContentProps {
  content: JSONContent;
  className?: string;
}

export const SafeContent = ({ content, className }: SafeContentProps) => {
  const html = convertJsonToHtml({ jsonContent: content });

  const clean = DOMPurify.sanitize(html);

  return <div className={className}>{parse(clean)}</div>;
};
