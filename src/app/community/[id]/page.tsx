'use client';
import Image from 'next/image';
import BackButton from '@/components/common/BackButton';
import { EllipsisVertical } from 'lucide-react';
import ClickTooltip from '@/components/common/CustomTooltip';
import CommentSection from '@/components/comment/CommentSection';

export default function CommunityDetailPage() {
  return (
    <main className="flex flex-col justify-center gap-10 mx-31">
      <BackButton>Community</BackButton>
      <section className="flex flex-col">
        <div className="flex flex-col align-start gap-2.5 mx-4 mb-10">
          <h6 className="text-head6 text-sub-1">자유</h6>
          <h3 className="text-head3 text-black">커뮤니티 제목</h3>
          <div className="flex items-center place-content-between">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/avatar.png"
                alt="profile"
                width={50}
                height={50}
                className="rounded-full"
              />
              <span className="text-head6 text-black">작성자</span>
            </div>
            <div>
              <dl className="flex gap-10 items-center text-black">
                <div className="flex gap-2.5 items-center">
                  <dt className="text-head6">작성</dt>
                  <dd className="text-body2">2025.07.22. 2:15</dd>
                </div>
                <div className="flex gap-2.5 items-center">
                  <dt className="text-head6">조회수</dt>
                  <dd className="text-body2">372</dd>
                </div>
                <ClickTooltip
                  trigger={<EllipsisVertical size={24} />}
                  options={[
                    { key: 'edit', label: '수정', onSelect: () => console.log('수정') },
                    { key: 'delete', label: '삭제', onSelect: () => console.log('삭제') },
                  ]}
                />
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
          <span className="text-body1 text-black">
            위스키에 진짜 관심 하나도 없다가, 최근에 지인이 글렌피딕 12년을 선물해줘서 처음
            마셔봤어요. 그냥 알코올 센 술일 줄 알았는데… 아니 이게 무슨 디저트 같은 느낌이 나네요?
            다크 초콜릿이랑 같이 먹으니까 향이 진짜 풍부하게 올라오고, 달달한 여운까지 남아서 약간
            몰트 커피 먹는 기분이었어요. 저처럼 입문하시는 분들한테 이 조합 강추합니다 😆 다음엔
            치즈 플래터랑 같이 먹어보려고 해요. 혹시 이런 입문자 조합 또 있을까요?? 추천 좀
            부탁드려요!
          </span>
        </div>
        <CommentSection />
      </section>
    </main>
  );
}
