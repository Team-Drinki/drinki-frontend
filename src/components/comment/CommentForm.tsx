'use client';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SubmitButton from '../buttons/SubmitButton';
import CustomButton from '../common/CustomButton';
import { cn } from '@/lib/utils';
import { RefObject } from 'react';

interface CommentFormProps {
  nickname: string;
  postId: string;
  parentId?: string;
  className?: string;
  inputRef?: RefObject<HTMLTextAreaElement | null>;
  onSubmitted?: () => void;
  onCancel?: () => void;
}
export default function CommentForm({
  nickname,
  postId,
  parentId,
  className,
  inputRef,
  onSubmitted,
  onCancel,
}: CommentFormProps) {
  const schema = z.object({
    comment: z.string().min(1, { message: '댓글이 입력되지 않았습니다.' }),
  });
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { comment: '' } });
  const submit = form.handleSubmit(async data => {
    // 댓글 등록 로직 추가 예정
    console.log('댓글 등록:', data.comment, '포스트 ID:', postId, '부모 ID:', parentId);
    onSubmitted?.();
    form.reset();
  });
  return (
    <div className={cn('flex flex-col gap-4 p-6 bg-grey-100 rounded-lg', className)}>
      <span className="text-head6 text-black">{nickname}</span>
      <Form {...form}>
        <form className="flex items-end gap-2.5" onSubmit={submit}>
          <FormField
            name="comment"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <textarea
                    {...field}
                    ref={el => {
                      field.ref(el);
                      if (inputRef) inputRef.current = el;
                    }}
                    placeholder="댓글을 작성해주세요."
                    className="p-2 min-h-10"
                    autoComplete="off"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            {parentId && (
              <CustomButton
                className="px-3 py-2 rouned-lg bg-yellow-200 hover:bg-yellow-300 text-button text-brown"
                onClick={onCancel}
              >
                취소
              </CustomButton>
            )}
            <SubmitButton>등록</SubmitButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
