'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Table as TableExtension } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Image as ImageIcon,
  Link as LinkIcon,
  Quote,
  Minus,
  FileText,
  MapPin,
  Calendar,
  BarChart3,
  Code,
  SquareDot,
  Table,
  Video,
  Smile,
  Cloud,
  FolderPlus,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useRef } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [textStyle, setTextStyle] = useState('본문');
  const [fontFamily, setFontFamily] = useState('기본서체');
  const [fontSize, setFontSize] = useState('15');
  const [fontSizeMode, setFontSizeMode] = useState<'select' | 'custom'>('select');
  const fontSizeInputRef = useRef<HTMLInputElement>(null);

  // TextStyle 마크에 fontSize / fontFamily 속성을 붙이는 커스텀 확장
  const FontStyle = TextStyle.extend({
    addAttributes() {
      return {
        fontSize: {
          default: null,
          parseHTML: element => element.style.fontSize || null,
          renderHTML: attrs => (attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {}),
        },
        fontFamily: {
          default: null,
          parseHTML: element => element.style.fontFamily || null,
          renderHTML: attrs =>
            attrs.fontFamily ? { style: `font-family: ${attrs.fontFamily}` } : {},
        },
      };
    },
  });

  // 에디터 상태에 따른 드롭다운 값 업데이트
  const updateDropdownValues = () => {
    if (editor) {
      if (editor.isActive('heading', { level: 1 })) setTextStyle('제목1');
      else if (editor.isActive('heading', { level: 2 })) setTextStyle('제목2');
      else setTextStyle('본문');
    }
  };

  // 투표
  const addPoll = () => {
    editor
      ?.chain()
      .focus()
      .insertContent({
        type: 'taskList',
        content: [
          {
            type: 'taskItem',
            attrs: { checked: false },
            content: [{ type: 'paragraph', content: [{ type: 'text', text: '선택지 1' }] }],
          },
          {
            type: 'taskItem',
            attrs: { checked: false },
            content: [{ type: 'paragraph', content: [{ type: 'text', text: '선택지 2' }] }],
          },
        ],
      })
      .run();
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      FontStyle,
      Image,
      Link,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Color,
      Highlight,
      TableExtension.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content,

    onCreate: ({ editor }) => {
      (window as any).tiptap = editor;
      try {
        (window.top as any).tiptap = editor;
      } catch {}
      console.log(
        'tiptap attached:',
        editor.extensionManager.extensions.map(e => e.name)
      );
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      updateDropdownValues();
    },
    editorProps: { attributes: { class: 'ProseMirror max-w-none focus:outline-none' } },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;

    (window as any).tiptap = editor;
    try {
      (window.top as any).tiptap = editor;
    } catch {}

    updateDropdownValues();

    return () => {
      try {
        delete (window as any).tiptap;
      } catch {}
      try {
        delete (window.top as any).tiptap;
      } catch {}
    };
  }, [editor]);

  if (!editor) {
    return (
      <div className="border border-brown-200 rounded-lg overflow-hidden">
        {/* 도구 모음 - 첫 번째 줄 */}
        <div className="p-3 border-b border-brown-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-brown-700 hover:bg-brown-100"
              disabled
            >
              <ImageIcon className="w-4 h-4 mr-1" />
              사진
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-brown-700 hover:bg-brown-100"
              disabled
            >
              <Cloud className="w-4 h-4 mr-1" />
              MYBOX
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-brown-700 hover:bg-brown-100"
              disabled
            >
              <Video className="w-4 h-4 mr-1" />
              동영상
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-brown-700 hover:bg-brown-100"
              disabled
            >
              <Smile className="w-4 h-4 mr-1" />
              스티커
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-brown-700 hover:bg-brown-100"
              disabled
            >
              <Quote className="w-4 h-4 mr-1" />
              인용구
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-brown-700 hover:bg-brown-100"
              disabled
            >
              <Minus className="w-4 h-4 mr-1" />
              구분선
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-brown-700 hover:bg-brown-100"
              disabled
            >
              <FolderPlus className="w-4 h-4 mr-1" />
              파일
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-brown-700 hover:bg-brown-100"
              disabled
            >
              <LinkIcon className="w-4 h-4 mr-1" />
              링크
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-brown-700 hover:bg-brown-100"
              disabled
            >
              <MapPin className="w-4 h-4 mr-1" />
              장소
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={addPoll}
              className="h-8 px-2 text-brown-700 hover:bg-brown-100"
              disabled
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              투표
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-brown-700 hover:bg-brown-100"
              disabled
            >
              <Table className="w-4 h-4 mr-1" />표
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-brown-700 hover:bg-brown-100"
              disabled
            >
              <Code className="w-4 h-4 mr-1" />
              소스코드
            </Button>
          </div>
        </div>

        {/* 도구 모음 - 두 번째 줄 */}
        <div className="p-3 border-b border-brown-200 bg-gray-50">
          <div className="flex flex-wrap items-center gap-2">
            <Select disabled>
              <SelectTrigger className="w-24 h-8 text-xs" onMouseDown={e => e.preventDefault()}>
                <SelectValue defaultValue="본문" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="본문">본문</SelectItem>
                <SelectItem value="제목1">제목1</SelectItem>
                <SelectItem value="제목2">제목2</SelectItem>
              </SelectContent>
            </Select>

            <Select disabled>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue defaultValue="기본서체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="기본서체">기본서체</SelectItem>
                <SelectItem value="굴림">굴림</SelectItem>
                <SelectItem value="바탕">바탕</SelectItem>
              </SelectContent>
            </Select>

            <Select disabled>
              <SelectTrigger className="w-12 h-8 text-xs">
                <SelectValue defaultValue="15" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="14">14</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="18">18</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 font-bold" disabled>
              B
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 italic" disabled>
              I
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 underline" disabled>
              U
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 line-through" disabled>
              T
            </Button>

            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
              <AlignRight className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
              <List className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
              <ListOrdered className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 에디터 본문 */}
        <div className="p-4 min-h-96">
          <div className="prose prose-sm max-w-none focus:outline-none min-h-80">
            <p className="text-brown-400">에디터를 로딩 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 텍스트 스타일 변경
  const handleTextStyleChange = (value: string) => {
    setTextStyle(value);
    switch (value) {
      case '본문':
        editor.chain().focus().setParagraph().run();
        break;
      case '제목1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case '제목2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
    }
  };

  // 폰트 패밀리 변경
  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
    const fontMap: Record<string, string> = {
      기본서체: 'inherit',
      굴림: 'Gulim, sans-serif',
      바탕: 'Batang, serif',
    };
    editor
      .chain()
      .focus()
      .extendMarkRange('textStyle')
      .setMark('textStyle', { fontFamily: fontMap[value] })
      .run();
  };

  // 폰트 크기 변경
  const handleFontSizeChange = (value: string) => {
    if (value === 'custom') {
      setFontSizeMode('custom');
      setTimeout(() => fontSizeInputRef.current?.focus(), 100);
      return;
    }
    setFontSize(value);
    setFontSizeMode('select');
    if (editor && value) {
      editor
        .chain()
        .focus()
        .extendMarkRange('textStyle')
        .setMark('textStyle', { fontSize: `${value}px` })
        .run();
    }
  };

  // 폰트 크기 직접 입력
  const handleFontSizeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFontSize(value);
    if (editor && value && !isNaN(Number(value))) {
      editor
        .chain()
        .focus()
        .extendMarkRange('textStyle')
        .setMark('textStyle', { fontSize: `${value}px` })
        .run();
    }
  };

  const handleFontSizeInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && fontSize) setFontSizeMode('select');
  };

  const addImage = () => {
    const url = window.prompt('이미지 URL을 입력하세요:');
    if (url) editor.chain().focus().setImage({ src: url, alt: '이미지' }).run();
  };

  const addVideo = () => {
    const url = window.prompt('동영상 URL을 입력하세요 (YouTube, Vimeo 등):');
    if (!url) return;
    let embedUrl = url;
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1];
      if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }
    const videoHtml = `<div class="video-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; margin: 1rem 0;"><iframe src="${embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe></div>`;
    editor.chain().focus().insertContent(videoHtml).run();
  };

  const addQuote = () => editor.chain().focus().toggleBlockquote().run();
  const addDivider = () => editor.chain().focus().setHorizontalRule().run();
  const setLink = () => {
    const url = window.prompt('링크 URL을 입력하세요:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };
  const addCodeBlock = () => editor.chain().focus().toggleCodeBlock().run();
  const addTable = () =>
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();

  return (
    <div className="border border-brown-200 rounded-lg overflow-hidden">
      {/* 도구 모음 - 첫 번째 줄 */}
      <div className="p-3 border-b border-brown-200 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={addImage}
            className="h-8 px-2 text-brown-700 hover:bg-brown-100"
          >
            <ImageIcon className="w-4 h-4 mr-1" />
            사진
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={addVideo}
            className="h-8 px-2 text-brown-700 hover:bg-brown-100"
          >
            <Video className="w-4 h-4 mr-1" />
            동영상
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-brown-700 hover:bg-brown-100">
            <Smile className="w-4 h-4 mr-1" />
            스티커
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={addQuote}
            className={`h-8 px-2 text-brown-700 hover:bg-brown-100 ${editor.isActive('blockquote') ? 'bg-brown-100' : ''}`}
          >
            <Quote className="w-4 h-4 mr-1" />
            인용구
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={addDivider}
            className="h-8 px-2 text-brown-700 hover:bg-brown-100"
          >
            <Minus className="w-4 h-4 mr-1" />
            구분선
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-brown-700 hover:bg-brown-100">
            <FolderPlus className="w-4 h-4 mr-1" />
            파일
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={setLink}
            className={`h-8 px-2 text-brown-700 hover:bg-brown-100 ${editor.isActive('link') ? 'bg-brown-100' : ''}`}
          >
            <LinkIcon className="w-4 h-4 mr-1" />
            링크
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-brown-700 hover:bg-brown-100">
            <MapPin className="w-4 h-4 mr-1" />
            장소
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={addPoll}
            className={`h-8 px-2 text-brown-700 hover:bg-brown-100 ${editor.isActive('taskList') ? 'bg-brown-100' : ''}`}
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            투표
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={addTable}
            className={`h-8 px-2 text-brown-700 hover:bg-brown-100 ${editor.isActive('table') ? 'bg-brown-100' : ''}`}
          >
            <Table className="w-4 h-4 mr-1" />표
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={addCodeBlock}
            className={`h-8 px-2 text-brown-700 hover:bg-brown-100 ${editor.isActive('codeBlock') ? 'bg-brown-100' : ''}`}
          >
            <Code className="w-4 h-4 mr-1" />
            소스코드
          </Button>
        </div>
      </div>

      {/* 도구 모음 - 두 번째 줄 */}
      <div className="p-3 border-b border-brown-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={textStyle} onValueChange={handleTextStyleChange}>
            <SelectTrigger className="w-20 h-8 text-xs" onMouseDown={e => e.preventDefault()}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="본문">본문</SelectItem>
              <SelectItem value="제목1">제목1</SelectItem>
              <SelectItem value="제목2">제목2</SelectItem>
            </SelectContent>
          </Select>

          <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
            <SelectTrigger className="w-24 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="기본서체">기본서체</SelectItem>
              <SelectItem value="굴림">굴림</SelectItem>
              <SelectItem value="바탕">바탕</SelectItem>
            </SelectContent>
          </Select>

          {/* 크기 드롭다운 + 직접 입력 */}
          <div className="flex items-center gap-1">
            {fontSizeMode === 'select' ? (
              <Select value={fontSize} onValueChange={handleFontSizeChange}>
                <SelectTrigger className="w-24 h-8 text-xs" onMouseDown={e => e.preventDefault()}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="14">14</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="16">16</SelectItem>
                  <SelectItem value="18">18</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="28">28</SelectItem>
                  <SelectItem value="32">32</SelectItem>
                  <SelectItem value="custom">직접 입력</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                ref={fontSizeInputRef}
                type="number"
                value={fontSize}
                onChange={handleFontSizeInput}
                onBlur={() => setFontSizeMode('select')}
                onKeyDown={handleFontSizeInputKeyDown}
                className="w-20 h-8 text-xs text-center"
                placeholder="직접입력"
                min="8"
                max="72"
                autoFocus
              />
            )}
          </div>

          {/* 텍스트 스타일 버튼들 */}
          <Button
            variant={editor.isActive('bold') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="h-8 w-8 p-0 font-bold"
          >
            B
          </Button>
          <Button
            variant={editor.isActive('italic') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="h-8 w-8 p-0 italic"
          >
            I
          </Button>
          <Button
            variant={editor.isActive('underline') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className="h-8 w-8 p-0 underline"
          >
            U
          </Button>
          <Button
            variant={editor.isActive('strike') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className="h-8 w-8 p-0 line-through"
          >
            T
          </Button>

          {/* 정렬 */}
          <Button
            variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className="h-8 w-8 p-0"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className="h-8 w-8 p-0"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className="h-8 w-8 p-0"
          >
            <AlignRight className="w-4 h-4" />
          </Button>

          {/* 리스트 */}
          <Button
            variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="h-8 w-8 p-0"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="h-8 w-8 p-0"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 에디터 본문 */}
      <div className="p-4 min-h-96">
        <EditorContent editor={editor} className="ProseMirror max-w-none focus:outline-none" />
      </div>
    </div>
  );
}
