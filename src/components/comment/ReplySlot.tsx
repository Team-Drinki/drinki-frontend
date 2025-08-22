'use client';
import { useReplyComposer } from './ReplyComposerContext';
import CommentForm from './CommentForm';
import { useEffect, useRef } from 'react';

export default function ReplySlot({
  postId,
  parentId,
  depth = 0,
}: {
  postId: string;
  parentId: string | number;
  depth?: number;
}) {
  if (depth > 0) return null;

  const { openId, close } = useReplyComposer();
  const isOpenHere = String(openId) === String(parentId);

  const anchorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!isOpenHere) return;
    const el = anchorRef.current;
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [isOpenHere]);
  if (!isOpenHere) return null;

  return (
    <div
      className="flex gap-4.5 py-6 border-t-1 border-grey-400 scroll-mt-6"
      ref={anchorRef}
      id={`reply-slot-${parentId}`}
    >
      {/* 대댓글 기호 */}
      <div className="pl-3 ">
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
        nickname="작성자 닉네임"
        postId={postId}
        parentId={String(parentId)}
        onSubmitted={close}
        onCancel={close}
        className="flex-1 p-0"
        inputRef={inputRef}
      />
    </div>
  );
}
