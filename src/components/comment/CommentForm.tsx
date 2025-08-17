'use client';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import SubmitButton from '../buttons/SubmitButton';

interface CommentFormProps {
  nickname: string;
}
export default function CommentForm({ nickname }: CommentFormProps) {
  const schema = z.object({
    comment: z.string().min(1, { message: '댓글이 입력되지 않았습니다.' }),
  });
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { comment: '' } });
  return (
    <div className="flex flex-col gap-4 p-6 bg-grey-100 rounded-lg">
      <span className="text-head6 text-black">{nickname}</span>
      <Form {...form}>
        <form className="flex gap-2.5">
          <FormField
            name="comment"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <input
                    placeholder="댓글을 작성해주세요."
                    {...field}
                    className="px-2"
                    autoComplete="off"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <SubmitButton>등록</SubmitButton>
        </form>
      </Form>
    </div>
  );
}
