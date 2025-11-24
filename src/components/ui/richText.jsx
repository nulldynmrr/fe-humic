"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Image as ImageIcon,
  Eraser,
} from "lucide-react";

export default function RichText({ value, onChange, placeholder }) {
  const [mounted, setMounted] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    setMounted(true); // Hanya render editor di client
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder || "Tulis sesuatu..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image,
      Link,
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "border border-input rounded-md min-h-[200px] p-3 bg-background focus:outline-none focus:ring-2 focus:ring-ring prose prose-sm max-w-none",
        style: `
          ul { list-style-type: disc; margin-left: 1rem; }
          ol { list-style-type: decimal; margin-left: 1rem; }
          li { margin-bottom: 0.5rem; }
        `,
      },
    },
    immediatelyRender: false, // wajib untuk SSR
  });

  // Update content jika value berubah
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  const onUploadImage = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target.result;
        editor.chain().focus().setImage({ src }).run();
        setImageFile(file);
        onChange?.(editor.getHTML());
      };
      reader.readAsDataURL(file);
    }
  };

  const ToolbarButton = ({ icon: Icon, onClick, active }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`h-8 w-8 p-0 ${active ? "bg-gray/10" : ""}`}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  if (!mounted) return null; // jangan render editor di server

  return (
    <div>
      {editor && (
        <div className="flex flex-wrap items-center gap-1 mb-2 p-2 border border-input rounded-md mt-2">
          <ToolbarButton
            icon={Bold}
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
          />
          <ToolbarButton
            icon={Italic}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
          />
          <ToolbarButton
            icon={Underline}
            onClick={() => editor.chain().focus().toggleUnderline?.().run()}
            active={editor.isActive("underline")}
          />
          <ToolbarButton
            icon={Strikethrough}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
          />
          <div className="w-px h-6 bg-border mx-1" />
          <ToolbarButton
            icon={List}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
          />
          <ToolbarButton
            icon={ListOrdered}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
          />
          <div className="w-px h-6 mx-1" />
          <ToolbarButton
            icon={AlignLeft}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          />
          <ToolbarButton
            icon={AlignCenter}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          />
          <ToolbarButton
            icon={AlignRight}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          />
          <ToolbarButton
            icon={AlignJustify}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          />
          <div className="w-px h-6 bg-border mx-1" />
          <ToolbarButton
            icon={Eraser}
            onClick={() =>
              editor.chain().focus().unsetAllMarks().clearNodes().run()
            }
          />
          <ToolbarButton
            icon={ImageIcon}
            onClick={() => document.getElementById("image-upload").click()}
          />
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={onUploadImage}
            className="hidden"
          />
        </div>
      )}
    <EditorContent
  editor={editor}
  className="rounded-md p-2 min-h-[200px] bg-background focus:outline-none focus:ring-0 border-0"
 />
    </div>
  );
}
