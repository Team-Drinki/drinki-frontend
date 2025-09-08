'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft } from 'lucide-react';
import RichTextEditor from '@/components/editor/RichTextEditor';

//게시판 종류 상수
const TOPIC_OPTIONS = [
  { value: 'general', label: '자유' },
  { value: 'question', label: '질문' },
] as const;

type TopicValue = (typeof TOPIC_OPTIONS)[number]['value'];

export default function CommunityWritePage() {
  const [selectedTopic, setSelectedTopic] = useState<TopicValue | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    // TODO: 글 작성 로직 구현
    console.log('글 작성:', { selectedTopic, title, content });
  };

  return (
    <div className="flex-1">
      <div className="container mx-auto px-6 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Link
            href="/community"
            className="flex items-center text-brown-800 hover:text-brown-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="text-head6 font-medium">Community</span>
          </Link>
        </div>

        {/* 글 작성 폼 */}
        <form
          className="max-w-4xl mx-auto px-5 md:px-6"
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* 주제 선택 및 제목 입력 */}
          <div className="bg-[#FFF1B8] p-5 md:p-6 rounded-xl mb-6">
            {/* 게시판 주제 선택 */}
            <div className="flex items-center justify-between">
              <Select value={selectedTopic} onValueChange={v => setSelectedTopic(v as TopicValue)}>
                <div className="relative inline-flex">
                  <SelectTrigger
                    className="
    w-[140px] h-9 pl-3 pr-6
    rounded-[10px] border border-brown-300 bg-transparent
    text-sm font-semibold text-brown-800
    shadow-none focus:ring-0 focus:outline-none
    hover:bg-transparent
    [&>svg]:hidden
  "
                    aria-label="게시판 주제 선택"
                  >
                    <span className="truncate">
                      <SelectValue placeholder="게시판 주제 선택" />
                    </span>
                  </SelectTrigger>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                    ▼
                  </span>
                </div>

                <SelectContent>
                  {TOPIC_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 제목 입력 */}
            <div className="mt-3">
              <Input
                type="text"
                placeholder="제목을 입력해주세요"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full h-12 md:h-[52px] rounded-lg bg-white px-4 border border-transparent
                   focus:border-brown-300 placeholder:text-gray-400 text-brown-900"
              />
            </div>
          </div>

          {/* 리치 텍스트 에디터*/}
          <div className="mb-6">
            <RichTextEditor content={content} onChange={setContent} className="w-full max-w-none" />
          </div>

          {/* 등록하기 버튼 */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-8 py-2 rounded-lg font-medium"
            >
              등록하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
