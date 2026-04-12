"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube, { isValidYoutubeUrl } from "@tiptap/extension-youtube";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
  Youtube as YoutubeIcon,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { useCallback } from "react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const t = useTranslations("RichTextEditor");

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt(t("link_prompt"), previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor, t]);

  const insertYoutube = useCallback(() => {
    if (!editor) return;
    const url = window.prompt(t("youtube_prompt"), "");

    if (url === null || url.trim() === "") return;

    const trimmed = url.trim();

    if (!isValidYoutubeUrl(trimmed)) {
      window.alert(t("youtube_invalid"));

      return;
    }

    editor.chain().focus().setYoutubeVideo({ src: trimmed }).run();
  }, [editor, t]);

  if (!editor) return null;

  const buttons = [
    {
      icon: <Bold size={16} />,
      title: t("bold"),
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
    },
    {
      icon: <Italic size={16} />,
      title: t("italic"),
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
    },
    {
      icon: <UnderlineIcon size={16} />,
      title: t("underline"),
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
    },
    {
      icon: <List size={16} />,
      title: t("bullet_list"),
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered size={16} />,
      title: t("ordered_list"),
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
    },
    {
      icon: <LinkIcon size={16} />,
      title: t("insert_link"),
      action: setLink,
      isActive: editor.isActive("link"),
    },
    {
      icon: <YoutubeIcon size={16} />,
      title: t("insert_youtube"),
      action: insertYoutube,
      isActive: editor.isActive("youtube"),
    },
    {
      icon: <Unlink size={16} />,
      title: t("remove_link"),
      action: () => editor.chain().focus().unsetLink().run(),
      isDisabled: !editor.isActive("link"),
    },
    {
      icon: <Undo size={16} />,
      title: t("undo"),
      action: () => editor.chain().focus().undo().run(),
      isDisabled: !editor.can().undo(),
    },
    {
      icon: <Redo size={16} />,
      title: t("redo"),
      action: () => editor.chain().focus().redo().run(),
      isDisabled: !editor.can().redo(),
    },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-1 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
      {buttons.map((btn, index) => (
        <Tooltip key={index} content={btn.title} delay={500}>
          <Button
            isIconOnly
            className={cn(
              "h-8 w-8 min-w-8 bg-transparent hover:bg-white dark:hover:bg-slate-800 transition-all",
              btn.isActive &&
                "bg-white dark:bg-slate-800 text-primary shadow-sm",
            )}
            isDisabled={btn.isDisabled}
            radius="lg"
            size="sm"
            onPress={btn.action}
          >
            {btn.icon}
          </Button>
        </Tooltip>
      ))}
    </div>
  );
};

export const RichTextEditor = ({
  value,
  onChange,
  placeholder,
  label,
  className,
}: RichTextEditorProps) => {
  const t = useTranslations("RichTextEditor");
  const resolvedPlaceholder = placeholder ?? t("placeholder");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Youtube.configure({
        nocookie: true,
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: "max-w-full",
        },
      }),
      Placeholder.configure({
        placeholder: resolvedPlaceholder,
      }),
    ],
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4 text-sm",
      },
    },
  });

  if (editor && value !== editor.getHTML() && !editor.isFocused) {
    editor.commands.setContent(value);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
          {label}
        </label>
      )}
      <div className="border-2 border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden focus-within:border-primary transition-colors bg-white dark:bg-slate-900">
        <MenuBar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
