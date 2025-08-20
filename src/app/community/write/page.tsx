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

export default function CommunityWritePage() {
  const [selectedTopic, setSelectedTopic] = useState('');
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
        <div className="max-w-4xl mx-auto">
          {/* 주제 선택 및 제목 입력 */}
          <div className="bg-yellow-50 p-6 rounded-lg mb-6">
            <div className="space-y-4">
              {/* 게시판 주제 선택 */}
              <div>
                <label className="block text-sm font-medium text-brown-800 mb-2">
                  게시판 주제 선택
                </label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger className="w-full bg-white border-brown-200 focus:border-brown-400">
                    <SelectValue placeholder="주제를 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">일반</SelectItem>
                    <SelectItem value="whisky">위스키</SelectItem>
                    <SelectItem value="wine">와인</SelectItem>
                    <SelectItem value="cocktail">칵테일</SelectItem>
                    <SelectItem value="beer">맥주</SelectItem>
                    <SelectItem value="sake">사케</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 제목 입력 */}
              <div>
                <label className="block text-sm font-medium text-brown-800 mb-2">제목</label>
                <Input
                  type="text"
                  placeholder="제목을 입력해주세요"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-white border-brown-200 focus:border-brown-400"
                />
              </div>
            </div>
          </div>

          {/* 리치 텍스트 에디터 */}
          <div className="mb-6">
            <RichTextEditor content={content} onChange={setContent} />
          </div>

          {/* 등록하기 버튼 */}
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-8 py-2 rounded-lg font-medium"
            >
              등록하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
