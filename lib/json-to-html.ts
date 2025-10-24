import { generateHTML, type JSONContent } from "@tiptap/react";
import { baseExtensions } from "@/components/rich-text-editor/extensions";

interface JsonToHtmlProps {
  jsonContent: JSONContent;
}

export const convertJsonToHtml = ({ jsonContent }: JsonToHtmlProps) => {
  try {
    const content = typeof jsonContent === "string" ? JSON.parse(jsonContent) : jsonContent;

    return generateHTML(content, baseExtensions);
  } catch {
    console.log("Error converting json to html");
    return "";
  }
};
