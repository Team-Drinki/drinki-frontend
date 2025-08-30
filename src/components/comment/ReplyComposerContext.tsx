'use client';
import { createContext, useCallback, useContext, useState } from 'react';

type Ctx = {
  openId: string | null;
  openFor: (id: string) => void;
  close: () => void;
};
const ReplyCtx = createContext<Ctx | null>(null);

export function ReplyComposerProvider({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openFor = useCallback((id: string) => setOpenId(id), []);
  const close = useCallback(() => setOpenId(null), []);
  return <ReplyCtx.Provider value={{ openId, openFor, close }}>{children}</ReplyCtx.Provider>;
}

export function useReplyComposer() {
  const v = useContext(ReplyCtx);
  if (!v) throw new Error('useReplyComposer must be used within ReplyComposerProvider');
  return v;
}
