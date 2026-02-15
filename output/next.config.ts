import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    /* 술 상세페이지에 쓰이는 더미 이미지 (추후 제거 예정) */
    domains: ['fastly.picsum.photos'],
  },
};

export default nextConfig;
