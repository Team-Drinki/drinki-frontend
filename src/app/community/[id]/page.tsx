import Image from 'next/image';
import BackButton from '@/components/common/BackButton';
import CommentSection from '@/components/comment/CommentSection';
import PostActionMenu from '@/components/common/PostActionMenu';
import { communityPostsDetail } from '@/app/mockup';
export default async function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // 현재 포스트 id
  const data = communityPostsDetail.find(post => post.id === id); // 현재 포스트 데이터

  const currentUserId = '1'; // 현재 로그인한 사용자 id (자신이 작성한 포스트/댓글일 경우 더보기 버튼 툴팁이 바뀜)

  return (
    <main className="flex flex-col justify-center gap-10 mx-31">
      <BackButton>Community</BackButton>
      <section className="flex flex-col">
        <div className="flex flex-col align-start gap-2.5 mx-4 mb-10">
          <h6 className="text-head6 text-sub-1">자유</h6>
          <h3 className="text-head3 text-black">{data?.title}</h3>
          <div className="flex items-center place-content-between">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/avatar.png"
                alt="profile"
                width={50}
                height={50}
                className="rounded-full"
              />
              <span className="text-head6 text-black">{data?.author}</span>
            </div>
            <div>
              <dl className="flex gap-10 items-center text-black">
                <div className="flex gap-2.5 items-center">
                  <dt className="text-head6">작성</dt>
                  <dd className="text-body2">{data?.createdAt}</dd>
                </div>
                <div className="flex gap-2.5 items-center">
                  <dt className="text-head6">조회수</dt>
                  <dd className="text-body2">{data?.views}</dd>
                </div>
                <PostActionMenu postId={id} isOwner={id === currentUserId} />
              </dl>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 p-5">
          <div className="aspect-[4/3] relative max-h-[40vh]">
            <Image
              src="/images/communityimg.png"
              alt="community"
              fill
              className="object-contain object-left"
            />
          </div>
          <span className="text-body1 text-black">{data?.content}</span>
        </div>
        <CommentSection postId={id} />
      </section>
    </main>
  );
}
