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
import { Node, mergeAttributes } from '@tiptap/core';
import './tiptap.css';
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
  Plus,
  X,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useState, useEffect, useRef } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [textStyle, setTextStyle] = useState('본문');
  const [fontFamily, setFontFamily] = useState('기본서체');
  const [fontSize, setFontSize] = useState('15');
  const [fontSizeMode, setFontSizeMode] = useState<'select' | 'custom'>('select');
  const fontSizeInputRef = useRef<HTMLInputElement>(null);
  const previousFontSizeRef = useRef<string>('15');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 텍스트 스타일 활성화 상태 (선택된 텍스트가 없어도 활성화 가능)
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);
  const [isUnderlineActive, setIsUnderlineActive] = useState(false);
  const [isStrikeActive, setIsStrikeActive] = useState(false);

  // 이미지 편집 상태
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [imageWidth, setImageWidth] = useState<string>('');
  const [imageHeight, setImageHeight] = useState<string>('');

  // 투표 팝업 상태
  const [isPollDialogOpen, setIsPollDialogOpen] = useState(false);
  const [pollTitle, setPollTitle] = useState('');
  const [pollItems, setPollItems] = useState<string[]>(['', '', '']);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [pollEndTime, setPollEndTime] = useState('');

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

  // 이미지 확장에 width, height 속성 추가
  const CustomImage = Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        width: {
          default: null,
          parseHTML: element => {
            const width = element.getAttribute('width') || element.style.width;
            return width ? width.replace('px', '') : null;
          },
        },
        height: {
          default: null,
          parseHTML: element => {
            const height = element.getAttribute('height') || element.style.height;
            return height ? height.replace('px', '') : null;
          },
        },
      };
    },
    renderHTML({ HTMLAttributes }) {
      const { width, height, ...rest } = HTMLAttributes;
      const style: string[] = [];
      
      if (width) {
        style.push(`width: ${width}px`);
      }
      if (height) {
        style.push(`height: ${height}px`);
      }
      
      return [
        'img',
        {
          ...rest,
          ...(width && { width: width }),
          ...(height && { height: height }),
          ...(style.length > 0 && { style: style.join('; ') }),
        },
      ];
    },
  });

  // 비디오 노드 생성 
  const VideoNode = Node.create({
    name: 'video',
    group: 'block',
    atom: true,
    addAttributes() {
      return {
        src: {
          default: null,
          parseHTML: element => {
            const video = element.querySelector('video');
            return video?.getAttribute('src') || element.getAttribute('src') || null;
          },
          renderHTML: attrs => {
            if (!attrs.src) return {};
            return { src: attrs.src };
          },
        },
      };
    },
    parseHTML() {
      return [
        {
          tag: 'div.video-wrapper',
          getAttrs: (node) => {
            if (typeof node === 'string') return false;
            const el = node as HTMLElement;
            const video = el.querySelector('video');
            if (video) {
              const src = video.getAttribute('src');
              return src ? { src } : false;
            }
            return false;
          },
        },
        {
          tag: 'div[class*="video-wrapper"]',
          getAttrs: (node) => {
            if (typeof node === 'string') return false;
            const el = node as HTMLElement;
            const video = el.querySelector('video');
            if (video) {
              const src = video.getAttribute('src');
              return src ? { src } : false;
            }
            return false;
          },
        },
        {
          tag: 'video',
          getAttrs: (node) => {
            if (typeof node === 'string') return false;
            const el = node as HTMLElement;
            const src = el.getAttribute('src');
            return src ? { src } : false;
          },
        },
      ];
    },
    renderHTML({ HTMLAttributes }) {
      if (!HTMLAttributes.src) {
        return ['div', { class: 'video-wrapper' }];
      }
      
      return [
        'div',
        {
          class: 'video-wrapper',
          style: 'position: relative; padding-bottom: 56.25%; height: 0; margin: 1rem 0; overflow: hidden; border-radius: 8px;',
        },
        [
          'video',
          {
            src: HTMLAttributes.src,
            controls: 'true',
            style: 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;',
            preload: 'metadata',
          },
        ],
      ];
    },
  });

  // 파일 노드 생성 (임베디드 형식)
  const FileNode = Node.create({
    name: 'file',
    group: 'block',
    atom: true,
    addAttributes() {
      return {
        fileName: {
          default: null,
          parseHTML: element => element.getAttribute('data-file-name') || element.querySelector('.file-name')?.textContent || null,
          renderHTML: attrs => (attrs.fileName ? { 'data-file-name': attrs.fileName } : {}),
        },
        fileSize: {
          default: null,
          parseHTML: element => {
            const size = element.getAttribute('data-file-size');
            return size ? parseInt(size, 10) : null;
          },
          renderHTML: attrs => (attrs.fileSize ? { 'data-file-size': attrs.fileSize } : {}),
        },
        fileType: {
          default: null,
          parseHTML: element => element.getAttribute('data-file-type') || null,
          renderHTML: attrs => (attrs.fileType ? { 'data-file-type': attrs.fileType } : {}),
        },
        fileUrl: {
          default: null,
          parseHTML: element => {
            const link = element.querySelector('.file-download');
            return link?.getAttribute('href') || element.getAttribute('data-file-url') || null;
          },
          renderHTML: attrs => (attrs.fileUrl ? { 'data-file-url': attrs.fileUrl } : {}),
        },
      };
    },
    parseHTML() {
      return [
        {
          tag: 'div[data-type="file"]',
        },
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return [
        'div',
        mergeAttributes(HTMLAttributes, { 'data-type': 'file', class: 'file-wrapper' }),
      ];
    },
    addNodeView() {
      return ({ node }) => {
        const dom = document.createElement('div');
        dom.setAttribute('data-type', 'file');
        dom.className = 'file-wrapper';
        dom.setAttribute('data-file-name', node.attrs.fileName || '');
        dom.setAttribute('data-file-size', node.attrs.fileSize || '');
        dom.setAttribute('data-file-type', node.attrs.fileType || '');
        dom.setAttribute('data-file-url', node.attrs.fileUrl || '');

        // 파일 크기 포맷팅
        const formatFileSize = (bytes: number | null) => {
          if (!bytes) return '';
          if (bytes < 1024) return bytes + ' B';
          if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
          return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        };

        const fileSize = formatFileSize(node.attrs.fileSize);
        const fileName = node.attrs.fileName || '';
        const fileUrl = node.attrs.fileUrl || '';

        if (!fileUrl || !fileName) {
          return { dom };
        }

        const content = document.createElement('div');
        content.className = 'file-content';

        const icon = document.createElement('div');
        icon.className = 'file-icon';
        icon.textContent = '📎';
        content.appendChild(icon);

        const info = document.createElement('div');
        info.className = 'file-info';

        const nameDiv = document.createElement('div');
        nameDiv.className = 'file-name';
        nameDiv.textContent = fileName;
        info.appendChild(nameDiv);

        if (fileSize) {
          const sizeDiv = document.createElement('div');
          sizeDiv.className = 'file-size';
          sizeDiv.textContent = fileSize;
          info.appendChild(sizeDiv);
        }

        content.appendChild(info);

        const downloadLink = document.createElement('a');
        downloadLink.href = fileUrl;
        downloadLink.download = fileName;
        downloadLink.className = 'file-download';
        downloadLink.textContent = '다운로드';
        content.appendChild(downloadLink);

        dom.appendChild(content);

        return { dom };
      };
    },
  });

  // 투표 노드 생성
  const PollNode = Node.create({
    name: 'poll',
    group: 'block',
    atom: true,
    addAttributes() {
      return {
        title: {
          default: null,
        },
        items: {
          default: [],
          parseHTML: element => {
            const itemsAttr = element.getAttribute('data-items');
            return itemsAttr ? JSON.parse(itemsAttr) : [];
          },
          renderHTML: attrs => {
            return attrs.items ? { 'data-items': JSON.stringify(attrs.items) } : {};
          },
        },
        allowMultiple: {
          default: false,
          parseHTML: element => element.getAttribute('data-allow-multiple') === 'true',
          renderHTML: attrs => {
            return attrs.allowMultiple ? { 'data-allow-multiple': 'true' } : {};
          },
        },
        endTime: {
          default: null,
        },
      };
    },
    parseHTML() {
      return [
        {
          tag: 'div[data-type="poll"]',
        },
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return [
        'div',
        mergeAttributes(HTMLAttributes, { 'data-type': 'poll', class: 'poll-wrapper' }),
      ];
    },
    addNodeView() {
      return ({ node }) => {
        const dom = document.createElement('div');
        dom.setAttribute('data-type', 'poll');
        dom.className = 'poll-wrapper';
        dom.setAttribute('data-items', JSON.stringify(node.attrs.items || []));
        dom.setAttribute('data-allow-multiple', node.attrs.allowMultiple ? 'true' : 'false');
        
        const title = node.attrs.title || '투표';
        const items = node.attrs.items || [];
        const allowMultiple = node.attrs.allowMultiple;
        const endTime = node.attrs.endTime;

        const pollContainer = document.createElement('div');
        pollContainer.className = 'poll-content';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'poll-title';
        titleDiv.textContent = title;
        pollContainer.appendChild(titleDiv);

        if (endTime) {
          const endTimeDiv = document.createElement('div');
          endTimeDiv.className = 'poll-end-time';
          endTimeDiv.textContent = `종료: ${new Date(endTime).toLocaleString('ko-KR')}`;
          pollContainer.appendChild(endTimeDiv);
        }

        const itemsList = document.createElement('div');
        itemsList.className = 'poll-items';

        items.forEach((item: string, index: number) => {
          if (!item) return;
          
          const itemDiv = document.createElement('div');
          itemDiv.className = 'poll-item';
          
          const input = document.createElement('input');
          input.type = allowMultiple ? 'checkbox' : 'radio';
          input.name = 'poll-option';
          input.id = `poll-option-${index}`;
          input.disabled = true;
          
          const label = document.createElement('label');
          label.htmlFor = `poll-option-${index}`;
          label.textContent = item;
          
          itemDiv.appendChild(input);
          itemDiv.appendChild(label);
          itemsList.appendChild(itemDiv);
        });

        pollContainer.appendChild(itemsList);
        dom.appendChild(pollContainer);

        return { dom };
      };
    },
  });

  // 북마크 노드 생성 (Notion 스타일)
  /*
    addAttributes() : url, title, description, image, favicon 속성 정의 
    parseHTML() : data-type="bookmark" 태그 파싱
    renderHTML() : data-type="bookmark" 태그 렌더링
    addNodeView() : bookmark-wrapper 요소 생성 및 하위 요소 추가
    isValidUrl() : URL 유효성 검증
    convertUrlToBookmark() : URL를 북마크 데이터로 변환 -> domain, favicon 추출

    handlePaste() : URL 붙여넣기 시 북마크 변환
    handleDrop() : URL 드래그 앤 드롭 시 북마크 변환
    hnadleKeyDown() : Enter 키를 눌렀을 때 URL인지 확인 -> 북마크 변환

  */
  const Bookmark = Node.create({
    name: 'bookmark',
    group: 'block',
    atom: true,
    addAttributes() {
      return {
        url: {
          default: null,
        },
        title: {
          default: null,
        },
        description: {
          default: null,
        },
        image: {
          default: null,
        },
        favicon: {
          default: null,
        },
      };
    },
    parseHTML() {
      return [
        {
          tag: 'div[data-type="bookmark"]',
        },
      ];
    },
    renderHTML({ HTMLAttributes }) {
      return [
        'div',
        mergeAttributes(HTMLAttributes, { 'data-type': 'bookmark' }),
        [
          'a',
          {
            href: HTMLAttributes.url,
            target: '_blank',
            rel: 'noopener noreferrer',
            class: 'bookmark-link',
          },
          [
            'div',
            { class: 'bookmark-content' },
            [
              'div',
              { class: 'bookmark-info' },
              HTMLAttributes.favicon
                ? ['img', { src: HTMLAttributes.favicon, class: 'bookmark-favicon', alt: '' }]
                : null,
              [
                'div',
                { class: 'bookmark-text' },
                HTMLAttributes.title
                  ? ['div', { class: 'bookmark-title' }, HTMLAttributes.title]
                  : null,
                HTMLAttributes.description
                  ? ['div', { class: 'bookmark-description' }, HTMLAttributes.description]
                  : null,
                ['div', { class: 'bookmark-url' }, HTMLAttributes.url],
              ],
            ],
            HTMLAttributes.image
              ? ['img', { src: HTMLAttributes.image, class: 'bookmark-image', alt: HTMLAttributes.title || '' }]
              : null,
          ],
        ],
      ];
    },
    addNodeView() {
      return ({ node, HTMLAttributes }) => {
        const dom = document.createElement('div');
        dom.setAttribute('data-type', 'bookmark');
        dom.className = 'bookmark-wrapper';

        const link = document.createElement('a');
        link.href = node.attrs.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'bookmark-link';

        const content = document.createElement('div');
        content.className = 'bookmark-content';

        const info = document.createElement('div');
        info.className = 'bookmark-info';

        if (node.attrs.favicon) {
          const favicon = document.createElement('img');
          favicon.src = node.attrs.favicon;
          favicon.className = 'bookmark-favicon';
          favicon.alt = '';
          info.appendChild(favicon);
        }

        const text = document.createElement('div');
        text.className = 'bookmark-text';

        if (node.attrs.title) {
          const title = document.createElement('div');
          title.className = 'bookmark-title';
          title.textContent = node.attrs.title;
          text.appendChild(title);
        }

        if (node.attrs.description) {
          const description = document.createElement('div');
          description.className = 'bookmark-description';
          description.textContent = node.attrs.description;
          text.appendChild(description);
        }

        const url = document.createElement('div');
        url.className = 'bookmark-url';
        url.textContent = node.attrs.url;
        text.appendChild(url);

        info.appendChild(text);
        content.appendChild(info);

        if (node.attrs.image) {
          const image = document.createElement('img');
          image.src = node.attrs.image;
          image.className = 'bookmark-image';
          image.alt = node.attrs.title || '';
          content.appendChild(image);
        }

        link.appendChild(content);
        dom.appendChild(link);

        return {
          dom,
        };
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

  // 투표 팝업 열기
  const addPoll = () => {
    setIsPollDialogOpen(true);
    setPollTitle('');
    setPollItems(['', '', '']);
    setAllowMultiple(false);
    setPollEndTime('');
  };

  // 투표 항목 추가
  const addPollItem = () => {
    setPollItems([...pollItems, '']);
  };

  // 투표 항목 제거
  const removePollItem = (index: number) => {
    if (pollItems.length > 1) {
      setPollItems(pollItems.filter((_, i) => i !== index));
    }
  };

  // 투표 항목 변경
  const updatePollItem = (index: number, value: string) => {
    const newItems = [...pollItems];
    newItems[index] = value;
    setPollItems(newItems);
  };

  // 투표 생성
  const createPoll = () => {
    if (!pollTitle.trim()) {
      alert('투표 제목을 입력해주세요.');
      return;
    }

    const validItems = pollItems.filter(item => item.trim());
    if (validItems.length < 2) {
      alert('최소 2개 이상의 항목이 필요합니다.');
      return;
    }

    editor
      ?.chain()
      .focus()
      .insertContent({
        type: 'poll',
        attrs: {
          title: pollTitle,
          items: validItems,
          allowMultiple: allowMultiple,
          endTime: pollEndTime || null,
        },
      })
      .run();

    setIsPollDialogOpen(false);
  };

  // URL 감지 함수 
  const isValidUrl = (string: string): boolean => {
    try {
      const trimmed = string.trim();
      if (!trimmed || trimmed.length < 4) return false; // 너무 짧으면 URL이 아님
      
      // http:// 또는 https://로 시작하는 경우
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        new URL(trimmed);
        return true;
      }
      
      // 공백이 포함되어 있으면 URL이 아님
      if (trimmed.includes(' ')) return false;
      
      // 도메인 형식인 경우 (www.naver.com 같은) - 더 엄격한 패턴
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.\-~!*'();:@&=+$,?#[\]%]*)*\/?$/i;
      const matches = urlPattern.test(trimmed);
      
      // 패턴 매칭 후 실제 URL 객체로 검증
      if (matches) {
        const testUrl = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
        new URL(testUrl);
        return true;
      }
      
      return false;
    } catch (_) {
      return false;
    }
  };

  // URL 감지 및 변환 함수
  const convertUrlToBookmark = async (url: string) => {
    try {
      const trimmedUrl = url.trim();
      if (!isValidUrl(trimmedUrl)) return null;

      // http:// 또는 https://가 없으면 추가
      let fullUrl = trimmedUrl;
      if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
        fullUrl = `https://${fullUrl}`;
      }

      // URL 객체 생성으로 유효성 최종 검증
      const urlObj = new URL(fullUrl);
      const domain = urlObj.hostname;
      
      return {
        url: fullUrl,
        title: domain.replace('www.', ''),
        description: null,
        image: null,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      };
    } catch (error) {
      console.error('URL 변환 실패:', error);
      return null;
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      FontStyle,
      CustomImage,
      Link.configure({
        openOnClick: false,
        autolink: false, // 자동 링크 변환 비활성화
      }),
      VideoNode,
      FileNode,
      Bookmark,
      PollNode,
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
      
      // 선택된 텍스트가 있으면 스타일 상태 동기화
      if (editor.state.selection.empty) {
        // 커서만 있을 때는 state 유지 (다음 입력에 적용)
      } else {
        // 선택된 텍스트가 있을 때는 실제 스타일 상태로 동기화
        setIsBoldActive(editor.isActive('bold'));
        setIsItalicActive(editor.isActive('italic'));
        setIsUnderlineActive(editor.isActive('underline'));
        setIsStrikeActive(editor.isActive('strike'));
      }
    },
    
    
    onSelectionUpdate: ({ editor }) => {
      // 선택 영역 변경 시 스타일 상태 업데이트
      if (!editor.state.selection.empty) {
        setIsBoldActive(editor.isActive('bold'));
        setIsItalicActive(editor.isActive('italic'));
        setIsUnderlineActive(editor.isActive('underline'));
        setIsStrikeActive(editor.isActive('strike'));
      }
      
      // 이미지 선택 상태 업데이트
      const isImageActive = editor.isActive('image');
      setIsImageSelected(isImageActive);
      
      if (isImageActive) {
        const attrs = editor.getAttributes('image');
        
        // 이미지의 실제 크기를 가져오기
        const getImageActualSize = () => {
          // 선택된 이미지 DOM 요소 찾기 (ProseMirror-selectednode 클래스 사용)
          const selectedImg = editor.view.dom.querySelector('img.ProseMirror-selectednode') as HTMLImageElement;
          
          if (selectedImg) {
            // 이미지가 로드되었는지 확인
            if (selectedImg.complete && selectedImg.naturalWidth > 0) {
              // width/height 속성이 설정되어 있으면 그것을 사용, 없으면 기본값 800x400 사용
              return {
                width: attrs.width || '800',
                height: attrs.height || '400',
              };
            } else {
              // 이미지가 아직 로드되지 않았으면 로드 대기
              const handleLoad = () => {
                if (editor.isActive('image')) {
                  const currentAttrs = editor.getAttributes('image');
                  if (!currentAttrs.width && !currentAttrs.height) {
                    setImageWidth('800');
                    setImageHeight('400');
                  }
                }
                selectedImg.removeEventListener('load', handleLoad);
              };
              selectedImg.addEventListener('load', handleLoad);
              
              // 이미 로드된 경우에도 확인
              if (selectedImg.naturalWidth > 0) {
                return {
                  width: attrs.width || '800',
                  height: attrs.height || '400',
                };
              }
            }
          }
          
          // DOM 요소를 찾지 못한 경우: 속성에 있으면 사용, 없으면 기본값 800x400
          return {
            width: attrs.width || '800',
            height: attrs.height || '400',
          };
        };
        
        const sizes = getImageActualSize();
        setImageWidth(sizes.width);
        setImageHeight(sizes.height);
      } else {
        setImageWidth('');
        setImageHeight('');
      }
    },
    editorProps: {
      attributes: { class: 'ProseMirror max-w-none focus:outline-none' },
      handlePaste: (view, event) => {
        if (!editor) return false;
        
        // HTML이 있으면 기본 동작 허용 (이미지, 서식 등)
        const html = event.clipboardData?.getData('text/html');
        if (html && html.trim().length > 0) {
          return false; // 기본 붙여넣기 허용
        }
        
        const text = event.clipboardData?.getData('text/plain');
        // URL인 경우에만 처리하고, 그 외에는 기본 동작 허용
        if (text && text.trim() && isValidUrl(text.trim())) {
          // 단일 URL만 붙여넣는 경우에만 북마크로 변환
          const trimmedText = text.trim();
          if (trimmedText.split('\n').length === 1 && isValidUrl(trimmedText)) {
            event.preventDefault();
            convertUrlToBookmark(trimmedText).then(bookmarkData => {
              if (bookmarkData && editor) {
                editor.chain().focus().insertContent({
                  type: 'bookmark',
                  attrs: bookmarkData,
                }).run();
              } else if (editor) {
                // 북마크 변환 실패 시 일반 텍스트로 삽입
                editor.chain().focus().insertContent(trimmedText).run();
              }
            });
            return true;
          }
        }
        // URL이 아닌 경우 기본 붙여넣기 동작 허용
        return false;
      },
      handleDrop: (view, event, slice, moved) => {
        if (!editor || moved) return false;
        const text = event.dataTransfer?.getData('text/plain');
        if (text && isValidUrl(text)) {
          event.preventDefault();
          convertUrlToBookmark(text).then(bookmarkData => {
            if (bookmarkData && editor) {
              editor.chain().focus().insertContent({
                type: 'bookmark',
                attrs: bookmarkData,
              }).run();
            }
          });
          return true;
        }
        return false;
      },
      handleKeyDown: (view, event) => {
        if (!editor) return false;
        // Enter 키를 눌렀을 때 현재 줄이 URL인지 확인
        if (event.key === 'Enter') {
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;
          const line = $from.nodeBefore;
          
          if (line && line.type.name === 'paragraph') {
            const text = line.textContent.trim();
            if (isValidUrl(text)) {
              event.preventDefault();
              convertUrlToBookmark(text).then(bookmarkData => {
                if (bookmarkData && editor) {
                  // 현재 paragraph를 삭제하고 북마크 삽입
                  const start = $from.start($from.depth);
                  const end = $from.end($from.depth);
                  editor.chain().focus().deleteRange({ from: start - 1, to: end }).insertContent({
                    type: 'bookmark',
                    attrs: bookmarkData,
                  }).run();
                }
              });
              return true;
            }
          }
        }
        // Space 키를 눌렀을 때도 URL인지 확인
        if (event.key === ' ') {
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;
          const textBefore = $from.nodeBefore?.textContent || '';
          const textAfter = $from.nodeAfter?.textContent || '';
          const fullText = (textBefore + textAfter).trim();
          
          if (isValidUrl(fullText)) {
            // Space 입력을 일시적으로 막고 URL을 북마크로 변환
            setTimeout(() => {
              if (editor) {
                const currentState = editor.state;
                const currentSelection = currentState.selection;
                const currentFrom = currentSelection.$from;
                const paragraph = currentFrom.node(currentFrom.depth);
                if (paragraph && paragraph.type.name === 'paragraph') {
                  const text = paragraph.textContent.trim();
                  if (isValidUrl(text)) {
                    convertUrlToBookmark(text).then(bookmarkData => {
                      if (bookmarkData && editor) {
                        const start = currentFrom.start(currentFrom.depth);
                        const end = currentFrom.end(currentFrom.depth);
                        editor.chain().focus().deleteRange({ from: start, to: end }).insertContent({
                          type: 'bookmark',
                          attrs: bookmarkData,
                        }).run();
                      }
                    });
                  }
                }
              }
            }, 100);
          }
        }
        return false;
      },
    },
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
            {/* 추후 추가
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-brown-700 hover:bg-brown-100"
              disabled
            >
              <Smile className="w-4 h-4 mr-1" />
              스티커
            </Button>
            */}
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
              <LinkIcon className="w-4 h-4 mr-1" />
              링크
            </Button>
            {/*<Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-brown-700 hover:bg-brown-100"
              disabled
            >
              <MapPin className="w-4 h-4 mr-1" />
              장소
            </Button>
            */}

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
      // 직접 입력 모드로 전환할 때 현재 값을 저장
      previousFontSizeRef.current = fontSize;
      setFontSizeMode('custom');
      setTimeout(() => fontSizeInputRef.current?.focus(), 100);
      return;
    }
    setFontSize(value);
    previousFontSizeRef.current = value;
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
  };

  const handleFontSizeInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 모든 키 이벤트를 입력 필드에서 처리하고 에디터로 전파되지 않도록 함
    e.stopPropagation();
    
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = fontSize.trim();
      if (value && !isNaN(Number(value)) && Number(value) > 0) {
        // 유효한 값이면 에디터에 적용
        if (editor) {
          editor
            .chain()
            .focus()
            .extendMarkRange('textStyle')
            .setMark('textStyle', { fontSize: `${value}px` })
            .run();
        }
        previousFontSizeRef.current = value;
        setFontSizeMode('select');
      } else {
        // 유효하지 않은 값이면 이전 값으로 복원
        setFontSize(previousFontSizeRef.current);
        setFontSizeMode('select');
      }
    } else if (e.key === 'Escape') {
      // ESC 키를 누르면 이전 값으로 복원
      e.preventDefault();
      setFontSize(previousFontSizeRef.current);
      setFontSizeMode('select');
    }
    // 다른 키(백스페이스, Delete 등)는 기본 동작 허용하되 에디터로 전파는 막음
  };

  const handleFontSizeInputBlur = () => {
    const value = fontSize.trim();
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      // 유효하지 않은 값이면 이전 값으로 복원
      setFontSize(previousFontSizeRef.current);
    } else {
      // 유효한 값이면 에디터에 적용하고 저장
      if (editor) {
        editor
          .chain()
          .focus()
          .extendMarkRange('textStyle')
          .setMark('textStyle', { fontSize: `${value}px` })
          .run();
      }
      previousFontSizeRef.current = value;
    }
    setFontSizeMode('select');
  };

  const addImage = () => {
    imageInputRef.current?.click();
  };

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }

    // 파일 크기 제한 
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    // Blob URL 생성
    const imageUrl = URL.createObjectURL(file);
    
    // 이미지를 에디터에 삽입 (기본 크기 800x400)
    editor.chain().focus().setImage({ 
      src: imageUrl, 
      alt: '이미지',
      width: '800',
      height: '400'
    } as any).run();

    // input 초기화 (같은 파일을 다시 선택할 수 있도록)
    e.target.value = '';
  };

  const addVideo = () => {
    videoInputRef.current?.click();
  };

  const addFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 제한 (예: 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('파일 크기는 50MB 이하여야 합니다.');
      return;
    }

    // Blob URL 생성
    const fileUrl = URL.createObjectURL(file);
    
    // 파일 노드로 삽입
    editor.chain().focus().insertContent({
      type: 'file',
      attrs: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileUrl: fileUrl,
      },
    }).run();

    // input 초기화
    e.target.value = '';
  };

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 비디오 파일인지 확인
    if (!file.type.startsWith('video/')) {
      alert('비디오 파일만 업로드할 수 있습니다.');
      return;
    }

    // 파일 크기 제한 (예: 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      alert('파일 크기는 100MB 이하여야 합니다.');
      return;
    }

    // Blob URL 생성
    const videoUrl = URL.createObjectURL(file);
    
    // 비디오 노드로 삽입
    editor.chain().focus().insertContent({
      type: 'video',
      attrs: { src: videoUrl },
    }).run();

    // input 초기화 (같은 파일을 다시 선택할 수 있도록)
    e.target.value = '';
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

  // 이미지 크기 변경
  const handleImageSizeChange = () => {
    if (!editor || !isImageSelected) return;
    
    const width = imageWidth.trim();
    const height = imageHeight.trim();
    
    // 현재 이미지 속성 가져오기
    const currentAttrs = editor.getAttributes('image');
    
    const attrs: any = {
      ...currentAttrs,
    };
    
    if (width && !isNaN(Number(width)) && Number(width) > 0) {
      attrs.width = width;
    } else if (width === '') {
      // 빈 값이면 width 제거
      attrs.width = null;
    }
    
    if (height && !isNaN(Number(height)) && Number(height) > 0) {
      attrs.height = height;
    } else if (height === '') {
      // 빈 값이면 height 제거
      attrs.height = null;
    }
    
    editor.chain().focus().setImage(attrs).run();
  };

  const handleImageWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageWidth(e.target.value);
  };

  const handleImageHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageHeight(e.target.value);
  };

  const handleImageSizeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleImageSizeChange();
    }
  };

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
          <Button
            variant="ghost"
            size="sm"
            onClick={addFile}
            className="h-8 px-2 text-brown-700 hover:bg-brown-100"
          >
            <FileText className="w-4 h-4 mr-1" />
            파일
          </Button>
          {/* 추후 추가
          <Button variant="ghost" size="sm" className="h-8 px-2 text-brown-700 hover:bg-brown-100">
            <Smile className="w-4 h-4 mr-1" />
            스티커
          </Button>
          */}
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
          <Button
            variant="ghost"
            size="sm"
            onClick={setLink}
            className={`h-8 px-2 text-brown-700 hover:bg-brown-100 ${editor.isActive('link') ? 'bg-brown-100' : ''}`}
          >
            <LinkIcon className="w-4 h-4 mr-1" />
            링크
          </Button>
          {/* <Button variant="ghost" size="sm" className="h-8 px-2 text-brown-700 hover:bg-brown-100">
            <MapPin className="w-4 h-4 mr-1" />
            장소
          </Button> */}

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
                  <SelectValue placeholder={fontSize || '15'}>
                    {fontSize || '15'}
                  </SelectValue>
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
                  {/* 직접 입력한 값이 목록에 없으면 동적으로 추가 */}
                  {fontSize && 
                   !['12', '14', '15', '16', '18', '20', '24', '28', '32', 'custom'].includes(fontSize) && 
                   !isNaN(Number(fontSize)) && 
                   Number(fontSize) > 0 && (
                    <SelectItem value={fontSize}>{fontSize}</SelectItem>
                  )}
                  <SelectItem value="custom">직접 입력</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input
                ref={fontSizeInputRef}
                type="number"
                value={fontSize}
                onChange={handleFontSizeInput}
                onBlur={handleFontSizeInputBlur}
                onKeyDown={handleFontSizeInputKeyDown}
                onKeyUp={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
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
            variant={editor.isActive('bold') || isBoldActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              setIsBoldActive(!isBoldActive);
              editor.chain().focus().toggleBold().run();
            }}
            className="h-8 w-8 p-0 font-bold"
          >
            B
          </Button>
          <Button
            variant={editor.isActive('italic') || isItalicActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              setIsItalicActive(!isItalicActive);
              editor.chain().focus().toggleItalic().run();
            }}
            className="h-8 w-8 p-0 italic"
          >
            I
          </Button>
          <Button
            variant={editor.isActive('underline') || isUnderlineActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              setIsUnderlineActive(!isUnderlineActive);
              editor.chain().focus().toggleUnderline().run();
            }}
            className="h-8 w-8 p-0 underline"
          >
            U
          </Button>
          <Button
            variant={editor.isActive('strike') || isStrikeActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              setIsStrikeActive(!isStrikeActive);
              editor.chain().focus().toggleStrike().run();
            }}
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

      {/* 이미지 편집 UI */}
      {isImageSelected && (
        <div className="p-3 border-b border-brown-200 bg-gray-50">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-brown-700">이미지 크기:</span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={imageWidth}
                onChange={handleImageWidthChange}
                onBlur={handleImageSizeChange}
                onKeyDown={handleImageSizeKeyDown}
                placeholder="800"
                className="w-20 h-8 text-xs text-center image-size-input"
                min="1"
              />
              <span className="text-sm text-brown-500">×</span>
              <Input
                type="number"
                value={imageHeight}
                onChange={handleImageHeightChange}
                onBlur={handleImageSizeChange}
                onKeyDown={handleImageSizeKeyDown}
                placeholder="400"
                className="w-20 h-8 text-xs text-center image-size-input"
                min="1"
              />
            </div>
          </div>
        </div>
      )}

      {/* 에디터 본문 */}
      <div className="p-4 min-h-96">
        <EditorContent editor={editor} className="ProseMirror max-w-none focus:outline-none" />
      </div>

      {/* 숨겨진 이미지 파일 입력 */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFileSelect}
      />

      {/* 숨겨진 비디오 파일 입력 */}
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleVideoFileSelect}
      />
      
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* 투표 팝업 */}
      <Dialog open={isPollDialogOpen} onOpenChange={setIsPollDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>투표 만들기</DialogTitle>
            <DialogDescription>
              투표 제목과 항목을 입력하고 설정을 선택하세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 투표 제목 */}
            <div className="space-y-2">
              <Label htmlFor="poll-title">투표 제목</Label>
              <Input
                id="poll-title"
                value={pollTitle}
                onChange={(e) => setPollTitle(e.target.value)}
                placeholder="투표 제목을 입력하세요"
              />
            </div>

            {/* 투표 항목 */}
            <div className="space-y-2">
              <Label>투표 항목</Label>
              <div className="space-y-2">
                {pollItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updatePollItem(index, e.target.value)}
                      placeholder={`항목 ${index + 1}`}
                      className="flex-1"
                    />
                    {pollItems.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePollItem(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPollItem}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                항목 추가
              </Button>
            </div>

            {/* 복수선택 설정 */}
            <div className="space-y-2">
              <Label>선택 방식</Label>
              <RadioGroup
                value={allowMultiple ? 'multiple' : 'single'}
                onValueChange={(value) => setAllowMultiple(value === 'multiple')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single" className="font-normal cursor-pointer">
                    단일 선택 (라디오 버튼)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multiple" id="multiple" />
                  <Label htmlFor="multiple" className="font-normal cursor-pointer">
                    복수 선택 (체크박스)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* 투표 종료시간 */}
            <div className="space-y-2">
              <Label htmlFor="poll-end-time">투표 종료시간 (선택사항)</Label>
              <Input
                id="poll-end-time"
                type="datetime-local"
                value={pollEndTime}
                onChange={(e) => setPollEndTime(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPollDialogOpen(false)}
            >
              취소
            </Button>
            <Button type="button" onClick={createPoll}>
              생성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
