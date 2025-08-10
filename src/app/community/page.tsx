'use client';
import BoardHeader from '@/components/common/BoardHeader';
import Searchbar from '@/components/common/Searchbar';

export default function CommunityPage() {
  return (
    <div>
      <BoardHeader />
      <main className="pt-25 flex flex-col items-center">
        <Searchbar />
        <div className="h-16" />
      </main>
    </div>
  );
}
