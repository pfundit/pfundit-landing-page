'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';

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
  const [sourceCode, setSourceCode] = useState(value || '');
  const lastHtmlRef = useRef(value || '');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#D3A337] underline font-semibold hover:text-[#b49050]',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: value || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'tiptap-editor rich-text-content prose prose-sm max-w-none focus:outline-none p-4 text-[#0f1b3d] leading-relaxed',
        style: `min-height: ${minHeight};`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastHtmlRef.current = html;
      setSourceCode(html);
      onChange(html);
    },
  });

  // Sync external value changes safely without overriding cursor while typing
  useEffect(() => {
    if (editor && !editor.isFocused && value !== lastHtmlRef.current && !isSourceMode) {
      lastHtmlRef.current = value || '';
      editor.commands.setContent(value || '', { emitUpdate: false });
      setSourceCode(value || '');
    }
  }, [value, editor, isSourceMode]);

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value;
    lastHtmlRef.current = newHtml;
    setSourceCode(newHtml);
    onChange(newHtml);
  };

  const toggleSourceMode = () => {
    if (isSourceMode) {
      if (editor) {
        editor.commands.setContent(sourceCode, { emitUpdate: false });
        lastHtmlRef.current = sourceCode;
      }
      setIsSourceMode(false);
    } else {
      if (editor) {
        const current = editor.getHTML();
        setSourceCode(current);
        lastHtmlRef.current = current;
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
    `px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
      active
        ? 'bg-[#0f1b3d] text-white shadow-sm ring-1 ring-[#0f1b3d]'
        : 'text-[#0f1b3d]/75 hover:bg-[#0f1b3d]/8 hover:text-[#0f1b3d]'
    }`;

  const iconBtnClass = (active = false) =>
    `h-7 px-2 flex items-center justify-center text-xs font-semibold rounded-lg transition-all ${
      active
        ? 'bg-[#0f1b3d] text-white shadow-sm ring-1 ring-[#0f1b3d]'
        : 'text-[#0f1b3d]/75 hover:bg-[#0f1b3d]/8 hover:text-[#0f1b3d]'
    }`;

  return (
    <div className="overflow-hidden rounded-xl border border-[#0f1b3d]/15 bg-white shadow-sm transition-colors focus-within:border-[#D3A337]">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-[#0f1b3d]/10 bg-[#F8FAFF] p-2">
        <div className="flex flex-wrap items-center gap-1">
          {!isSourceMode && editor && (
            <>
              {/* Text Formats: Normal, H1, H2, H3 */}
              <div className="flex items-center rounded-lg border border-[#0f1b3d]/10 bg-white/80 p-0.5 shadow-xs">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setParagraph().run()}
                  className={`px-2 py-0.5 text-xs font-medium rounded-md transition-colors ${
                    editor.isActive('paragraph') && !editor.isActive('heading')
                      ? 'bg-[#0f1b3d] text-white font-semibold'
                      : 'text-[#0f1b3d]/70 hover:text-[#0f1b3d]'
                  }`}
                  title="Normal Paragraph"
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`px-2 py-0.5 text-xs font-medium rounded-md transition-colors ${
                    editor.isActive('heading', { level: 1 })
                      ? 'bg-[#0f1b3d] text-white font-semibold'
                      : 'text-[#0f1b3d]/70 hover:text-[#0f1b3d]'
                  }`}
                  title="Heading 1 (Main Title)"
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`px-2 py-0.5 text-xs font-medium rounded-md transition-colors ${
                    editor.isActive('heading', { level: 2 })
                      ? 'bg-[#0f1b3d] text-white font-semibold'
                      : 'text-[#0f1b3d]/70 hover:text-[#0f1b3d]'
                  }`}
                  title="Heading 2 (Section Title)"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`px-2 py-0.5 text-xs font-medium rounded-md transition-colors ${
                    editor.isActive('heading', { level: 3 })
                      ? 'bg-[#0f1b3d] text-white font-semibold'
                      : 'text-[#0f1b3d]/70 hover:text-[#0f1b3d]'
                  }`}
                  title="Heading 3 (Subsection)"
                >
                  H3
                </button>
              </div>

              <div className="mx-0.5 h-4 w-[1px] bg-[#0f1b3d]/15" />

              {/* Inline Styles: Bold, Italic, Underline, Strike */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={iconBtnClass(editor.isActive('bold'))}
                  title="Bold (Ctrl+B)"
                >
                  <strong className="px-0.5">B</strong>
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={iconBtnClass(editor.isActive('italic'))}
                  title="Italic (Ctrl+I)"
                >
                  <em className="px-0.5 font-serif">I</em>
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={iconBtnClass(editor.isActive('underline'))}
                  title="Underline (Ctrl+U)"
                >
                  <span className="underline px-0.5">U</span>
                </button>

                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  className={iconBtnClass(editor.isActive('strike'))}
                  title="Strikethrough"
                >
                  <span className="line-through px-0.5">S</span>
                </button>
              </div>

              <div className="mx-0.5 h-4 w-[1px] bg-[#0f1b3d]/15" />

              {/* Lists: Bullet & Ordered */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={btnClass(editor.isActive('bulletList'))}
                  title="Bullet List"
                >
                  • Bullet List
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={btnClass(editor.isActive('orderedList'))}
                  title="Numbered List"
                >
                  1. Numbered List
                </button>
              </div>

              <div className="mx-0.5 h-4 w-[1px] bg-[#0f1b3d]/15" />

              {/* Blocks: Quote & Divider */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={btnClass(editor.isActive('blockquote'))}
                  title="Callout Quote"
                >
                  &ldquo; Quote
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setHorizontalRule().run()}
                  className={btnClass(false)}
                  title="Horizontal Divider"
                >
                  ― Divider
                </button>
              </div>

              <div className="mx-0.5 h-4 w-[1px] bg-[#0f1b3d]/15" />

              {/* Link & Clear Format */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={setLink}
                  className={btnClass(editor.isActive('link'))}
                  title="Insert Link"
                >
                  🔗 Link
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                  className={btnClass(false)}
                  title="Clear formatting"
                >
                  Tx Clear
                </button>
              </div>

              <div className="mx-0.5 h-4 w-[1px] bg-[#0f1b3d]/15" />

              {/* Undo & Redo */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                  className={`h-7 px-1.5 flex items-center justify-center text-xs font-semibold rounded-lg transition-colors ${
                    editor.can().undo()
                      ? 'text-[#0f1b3d]/70 hover:bg-[#0f1b3d]/10'
                      : 'text-[#0f1b3d]/25 cursor-not-allowed'
                  }`}
                  title="Undo (Ctrl+Z)"
                >
                  ↺
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                  className={`h-7 px-1.5 flex items-center justify-center text-xs font-semibold rounded-lg transition-colors ${
                    editor.can().redo()
                      ? 'text-[#0f1b3d]/70 hover:bg-[#0f1b3d]/10'
                      : 'text-[#0f1b3d]/25 cursor-not-allowed'
                  }`}
                  title="Redo (Ctrl+Y)"
                >
                  ↻
                </button>
              </div>
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
