import { create } from 'zustand';
import { api } from '@/libs/api';

interface LikeStore {
  likes: Record<number, number>;
  initializeLikes: (threads: { id: number; likesCount: number }[]) => void;
  toggleLike: (threadId: number) => Promise<void>;
}

export const useLikeStore = create<LikeStore>((set, get) => ({
  likes: {},

  initializeLikes: (threads) => {
    const likesMap = threads.reduce((acc, thread) => {
      acc[thread.id] = thread.likesCount || 0; // Ambil data likes dari API
      return acc;
    }, {} as Record<number, number>);
    set({ likes: likesMap });
  },

  toggleLike: async (threadId) => {
    try {
      const currentLikeStatus = get().likes[threadId] || 0;
      const response = await api.post(`/threads/${threadId}/like`, {
        likeStatus: currentLikeStatus === 0 ? 1 : 0,
      });

      const updatedLikeStatus = response.data.thread?._count.likes;
      if (updatedLikeStatus === undefined) {
        throw new Error('Tidak ada data status like dalam respons');
      }

      set((state) => ({
        likes: {
          ...state.likes,
          [threadId]: updatedLikeStatus,
        },
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  },
}));
