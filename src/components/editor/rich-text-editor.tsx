'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter detailed role description, requirements, and application instructions...',
  minHeight = '220px',
}: RichTextEditorProps) {
  const [isSourceMode, setIsSourceMode] = useState(false);
  const [sourceCode, setSourceCode] = useState(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#D4A437] underline font-semibold hover:text-[#b49050]',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none focus:outline-none p-4 text-[#0f1b3d] leading-relaxed',
        style: `min-height: ${minHeight};`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setSourceCode(html);
      onChange(html);
    },
  });

  // Sync external value changes if not in source mode
  useEffect(() => {
    if (editor && value !== editor.getHTML() && !isSourceMode) {
      editor.commands.setContent(value, { emitUpdate: false });
      setSourceCode(value);
    }
  }, [value, editor, isSourceMode]);

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value;
    setSourceCode(newHtml);
    onChange(newHtml);
  };

  const toggleSourceMode = () => {
    if (isSourceMode) {
      if (editor) {
        editor.commands.setContent(sourceCode, { emitUpdate: false });
      }
      setIsSourceMode(false);
    } else {
      if (editor) {
        setSourceCode(editor.getHTML());
      }
      setIsSourceMode(true);
    }
  };

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL (e.g. https://... or mailto:...)', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  if (!editor && !isSourceMode) {
    return (
      <div className="w-full rounded-xl border border-[#0f1b3d]/15 bg-[#F0F5FF]/60 p-4 text-xs text-[#0f1b3d]/50">
        Loading rich text editor...
      </div>
    );
  }

  const btnClass = (active = false) =>
    `px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
      active
        ? 'bg-[#0f1b3d] text-white shadow-sm'
        : 'text-[#0f1b3d]/70 hover:bg-[#0f1b3d]/5 hover:text-[#0f1b3d]'
    }`;

  return (
    <div className="overflow-hidden rounded-xl border border-[#0f1b3d]/15 bg-white shadow-sm transition-colors focus-within:border-[#D4A437]">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1 border-b border-[#0f1b3d]/10 bg-[#F8FAFF] p-2">
        <div className="flex flex-wrap items-center gap-1">
          {!isSourceMode && (
            <>
              {/* Bold */}
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={btnClass(editor?.isActive('bold'))}
                title="Bold"
              >
                <strong>B</strong>
              </button>

              {/* Italic */}
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={btnClass(editor?.isActive('italic'))}
                title="Italic"
              >
                <em>I</em>
              </button>

              {/* Underline */}
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                className={btnClass(editor?.isActive('underline'))}
                title="Underline"
              >
                <span className="underline">U</span>
              </button>

              {/* Strike */}
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                className={btnClass(editor?.isActive('strike'))}
                title="Strikethrough"
              >
                <span className="line-through">S</span>
              </button>

              <div className="mx-1 h-4 w-[1px] bg-[#0f1b3d]/15" />

              {/* Headings */}
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className={btnClass(editor?.isActive('heading', { level: 2 }))}
                title="Heading 2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                className={btnClass(editor?.isActive('heading', { level: 3 }))}
                title="Heading 3"
              >
                H3
              </button>

              <div className="mx-1 h-4 w-[1px] bg-[#0f1b3d]/15" />

              {/* Lists */}
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={btnClass(editor?.isActive('bulletList'))}
                title="Bullet List"
              >
                • List
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={btnClass(editor?.isActive('orderedList'))}
                title="Numbered List"
              >
                1. List
              </button>

              <div className="mx-1 h-4 w-[1px] bg-[#0f1b3d]/15" />

              {/* Link */}
              <button
                type="button"
                onClick={setLink}
                className={btnClass(editor?.isActive('link'))}
                title="Insert Link"
              >
                🔗 Link
              </button>
            </>
          )}
        </div>

        {/* Mode Toggle */}
        <div>
          <button
            type="button"
            onClick={toggleSourceMode}
            className="px-2.5 py-1 text-xs font-bold rounded-lg transition-colors bg-[#0f1b3d]/5 hover:bg-[#0f1b3d]/10 text-[#0f1b3d] border border-[#0f1b3d]/10"
          >
            {isSourceMode ? 'Visual Editor' : '</> HTML'}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {isSourceMode ? (
        <textarea
          rows={10}
          value={sourceCode}
          onChange={handleSourceChange}
          placeholder="Paste or edit raw HTML markup..."
          className="w-full p-4 font-mono text-xs text-[#0f1b3d] bg-white outline-none resize-y"
          style={{ minHeight }}
        />
      ) : (
        <div className="bg-white">
          <EditorContent editor={editor} />
        </div>
      )}
    </div>
  );
}
