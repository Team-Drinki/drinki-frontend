'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { getPostById, toApiErrorMessage, updatePost, type PostCategory } from '@/api/posts';

const TOPIC_OPTIONS = [
  { value: 'general', label: '자유' },
  { value: 'question', label: '질문' },
] as const;

type TopicValue = (typeof TOPIC_OPTIONS)[number]['value'];

export default function CommunityEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // /community/edit?postId=123
  const postId = searchParams.get('postId') ?? searchParams.get('id');

  const [selectedTopic, setSelectedTopic] = useState<TopicValue | undefined>(undefined);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!postId) {
      setIsLoading(false);
      setErrorMsg('postId가 없습니다. /community/edit?postId=123 형태로 접근해주세요.');
      return;
    }

    const run = async () => {
      setIsLoading(true);
      setErrorMsg(null);

      try {
        // 상세 조회도 공통 posts API 계층을 사용해 base URL/헤더 처리를 통일
        const data = await getPostById(postId);

        const topic: TopicValue = data?.category === 'QUESTION' ? 'question' : 'general';
        setSelectedTopic(topic);

        setTitle(typeof data.title === 'string' ? data.title : '');
        setContent(typeof data.body === 'string' ? data.body : '');
      } catch (e) {
        const msg = await toApiErrorMessage(e);
        setErrorMsg(msg);
      } finally {
        setIsLoading(false);
      }
    };

    void run();
  }, [postId]);

  const handleCancel = () => {
    router.back();
  };

  const handleSave = async () => {
    if (isSaving) return;
    if (!postId) {
      setErrorMsg('postId를 찾을 수 없습니다. (URL 경로를 확인해주세요)');
      return;
    }
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

    setIsSaving(true);
    setErrorMsg(null);

    try {
      const category: PostCategory = selectedTopic === 'question' ? 'QUESTION' : 'FREE';
      // 요청 바디 구성
      const payload = {
        title: title.trim(),
        body: content,
        category,
      };

      // 직접 fetch 호출을 제거하고 공통 posts API 계층으로 수정 요청 통일.
      await updatePost(postId, payload);

      // 저장 성공 시 상세로 이동
      router.push(`/community/${postId}`);
    } catch (e) {
      const msg = await toApiErrorMessage(e);
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1">
      <div className="mx-auto w-full max-w-4xl 2xl:max-w-5xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="mb-6">
          <Link
            href="/community"
            className="flex items-center text-brown-800 hover:text-brown-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="text-head6 font-medium">Community</span>
          </Link>
        </div>

        <form
          className="mx-auto w-full max-w-3xl lg:max-w-4xl px-4 sm:px-6"
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="bg-[#FFF1B8] p-5 md:p-6 xl:p-4 rounded-xl mb-6">
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

            {errorMsg && <p className="mt-3 text-sm text-red-600 whitespace-pre-wrap">{errorMsg}</p>}
          </div>

          <div className="mb-6">
            <RichTextEditor content={content} onChange={setContent} className="w-full max-w-none" />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="px-8 xl:px-6 py-2 xl:py-1.5 rounded-lg font-medium text-base xl:text-sm"
            >
              취소
            </Button>

            <Button
              type="submit"
              disabled={isSaving || isLoading}
              className="bg-gray-300 hover:bg-gray-400 disabled:opacity-60 text-gray-700 px-8 xl:px-6 py-2 xl:py-1.5 rounded-lg font-medium text-base xl:text-sm"
            >
              {isLoading ? '불러오는 중...' : isSaving ? '저장 중...' : '수정 저장'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
