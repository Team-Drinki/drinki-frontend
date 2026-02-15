'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
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
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!toastMsg) return;

    // 등장
    setShowToast(true);

    // 3초 유지 후 퇴장 시작
    const hideTimer = setTimeout(() => {
      setShowToast(false);
    }, 3000);

    // 퇴장 애니메이션 끝난 뒤 메시지 제거
    const clearTimer = setTimeout(() => {
      setToastMsg(null);
    }, 3300);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(clearTimer);
    };
  }, [toastMsg]);

  const handleSubmit = async () => {
    // 프론트 유효성 검사
    if (!selectedTopic) {
      setToastMsg('게시판 주제를 선택해주세요.');
      return;
    }
    if (!title.trim()) {
      setToastMsg('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      setToastMsg('내용을 입력해주세요.');
      return;
    }

    // 백엔드 category enum으로 변환
    const category = selectedTopic === 'general' ? 'FREE' : 'QUESTION'; // selectedTopic이 'question'인 경우

    // 요청 바디 구성
    const payload = {
      title: title.trim(),
      body: content,
      category, 
      // imageUrl: undefined,
    };

    setIsSubmitting(true);
    setToastMsg(null);

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/posts?category=${encodeURIComponent(category)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 개발용 임시 로그인
            'x-dev-user-id': '1',
          },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
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
      setToastMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1">
      {/* 팝업 토스트 */}
      {toastMsg && (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
          <div
            role="alert"
            className={[
              'pointer-events-none w-full max-w-sm rounded-xl border px-4 py-3 text-sm shadow-lg',
              'bg-red-50 border-red-200 text-red-800',
              'transition-all duration-300 ease-out',
              showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2',
            ].join(' ')}
          >
            {toastMsg}
          </div>
        </div>
      )}

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
