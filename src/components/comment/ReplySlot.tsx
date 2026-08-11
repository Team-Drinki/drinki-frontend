'use client';

import { useEffect, useRef } from 'react';

import CommentForm from './CommentForm';
import { useReplyComposer } from './ReplyComposerContext';

interface ReplySlotProps {
  postId: string;
  parentId: string | number;
  depth?: number;
  nickname?: string;
  disabled?: boolean;
  submitLabel?: string;
  placeholder?: string;
  onSubmitComment?: (content: string) => Promise<void> | void;
}

export default function ReplySlot({
  postId,
  parentId,
  depth = 0,
  nickname = '작성자 닉네임',
  disabled = false,
  submitLabel = '등록',
  placeholder = '댓글을 작성해주세요.',
  onSubmitComment,
}: ReplySlotProps) {
  const { openId, close } = useReplyComposer();

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const isTopLevelComment = depth === 0;
  const isOpenHere = isTopLevelComment && String(openId) === String(parentId);

  useEffect(() => {
    if (!isOpenHere) {
      return;
    }

    const anchorElement = anchorRef.current;

    if (!anchorElement) {
      return;
    }

    anchorElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    const animationFrameId = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpenHere]);

  if (!isTopLevelComment || !isOpenHere) {
    return null;
  }

  return (
    <div
      id={`reply-slot-${parentId}`}
      ref={anchorRef}
      className="flex scroll-mt-6 gap-4.5 border-t-1 border-grey-400 py-6"
    >
      <div className="pl-3">
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M1 1V13C1 17.4183 4.58172 21 9 21H21"
            stroke="#BEBEBA"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <CommentForm
        nickname={nickname}
        postId={postId}
        parentId={String(parentId)}
        onSubmitted={close}
        onCancel={close}
        onSubmitComment={onSubmitComment}
        disabled={disabled}
        submitLabel={submitLabel}
        placeholder={placeholder}
        className="flex-1 p-0"
        inputRef={inputRef}
      />
    </div>
  );
}
