'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const [selectedTopic, setSelectedTopic] = useState<TopicValue | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async () => {
    // 프론트 유효성 검사
    if (!selectedTopic) {
      setErrorMsg('게시판 주제를 선택해주세요.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      setErrorMsg('내용을 입력해주세요.');
      return;
    }

    // 백엔드 category enum으로 변환
    const category = selectedTopic === 'general' ? 'FREE' : 'QUESTION'; // selectedTopic이 'question'인 경우

    // 백엔드 요청 body 구성 (중요: content -> body)
    const payload = {
      title: title.trim(),
      category, // 'FREE' | 'QUESTION'
      body: content, // 백엔드는 body 필드명을 씀
      // imageUrl: undefined, // 지금은 필요 없으면 안 보내도 됨
    };

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('http://localhost:8000/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // 쿠키 기반 인증이면 필요. (필요 없으면 지워도 됨)
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // 서버가 json 에러를 줄 수도 있고, 텍스트만 줄 수도 있어서 둘 다 대비
        let msg = `요청 실패 (${res.status})`;
        try {
          const data = await res.json();
          msg = data?.message ?? data?.error ?? msg;
        } catch {
          const text = await res.text().catch(() => '');
          if (text) msg = text;
        }
        throw new Error(msg);
      }

      // 생성된 글 ID 파싱
      let createdId: number | undefined;
      try {
        const created = await res.json();
        createdId = created?.id;
      } catch {
        // 응답 바디가 비어있을 수도 있으니 무시
      }

      //  성공 후 이동
      if (createdId) {
        router.push(`/community/${createdId}`);
      } else {
        router.push('/community');
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1">
      <div className="mx-auto w-full max-w-4xl 2xl:max-w-5xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
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
          className="mx-auto w-full max-w-3xl lg:max-w-4xl px-4 sm:px-6"
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {/* 주제 선택 및 제목 입력 */}
          <div className="bg-[#FFF1B8] p-5 md:p-6 xl:p-4 rounded-xl mb-6">
            {/* 게시판 주제 선택 */}
            <div className="flex items-center justify-between">
              <Select value={selectedTopic} onValueChange={v => setSelectedTopic(v as TopicValue)}>
                <div className="relative inline-flex">
                  <SelectTrigger
                    className="w-[140px] h-9 pl-3 pr-6 rounded-[10px] border border-brown-300 bg-transparent text-sm font-semibold 
                    text-brown-800 shadow-none focus:ring-0 focus:outline-none hover:bg-transparent [&>svg]:hidden "
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
                className="w-full h-12 xl:h-11 md:h-[52px] rounded-lg bg-white px-4 border border-transparent 
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
              disabled={isSubmitting}
              className="bg-gray-300 hover:bg-gray-400 disabled:opacity-60 text-gray-700 px-8 xl:px-6 py-2 xl:py-1.5 rounded-lg font-medium text-base xl:text-sm"
            >
              {isSubmitting ? '등록 중...' : '등록하기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
