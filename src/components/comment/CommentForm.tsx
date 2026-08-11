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
  onSubmitComment?: (content: string) => Promise<void> | void;
  placeholder?: string;
  submitLabel?: string;
  disabled?: boolean;
}
export default function CommentForm({
  nickname,
  parentId,
  className,
  inputRef,
  onSubmitted,
  onCancel,
  onSubmitComment,
  placeholder = '댓글을 작성해주세요.',
  submitLabel = '등록',
  disabled = false,
}: CommentFormProps) {
  const schema = z.object({
    comment: z
      .string()
      .trim()
      .min(1, { message: '댓글이 입력되지 않았습니다.' })
      .max(1000, { message: '댓글은 1,000자 이하로 입력해주세요.' }),
  });
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { comment: '' } });
  const submit = form.handleSubmit(async data => {
    if (!onSubmitComment) {
      form.setError('comment', { message: '댓글 등록 기능이 아직 연결되지 않았습니다.' });
      return;
    }

    await onSubmitComment(data.comment.trim());
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
                    placeholder={placeholder}
                    className="min-h-10 p-2 disabled:opacity-60"
                    autoComplete="off"
                    disabled={disabled || !onSubmitComment || form.formState.isSubmitting}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            {parentId && (
              <CustomButton
                type="button"
                className="rounded-lg bg-yellow-200 px-3 py-2 text-button text-brown hover:bg-yellow-300"
                onClick={onCancel}
              >
                취소
              </CustomButton>
            )}
            <SubmitButton disabled={disabled || !onSubmitComment || form.formState.isSubmitting}>
              {submitLabel}
            </SubmitButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
