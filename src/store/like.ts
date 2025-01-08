import { create } from 'zustand';
import { api } from '@/libs/api';
import { toast } from 'react-toastify';

interface LikeStore {
  likes: Record<number, number>;
  initializeLikes: (threads: { id: number; likesCount: number }[]) => void;
  toggleLike: (threadId: number) => Promise<void>;
}

export const useLikeStore = create<LikeStore>((set, get) => ({
  likes: {},

  initializeLikes: (threads) => {
    const likesMap = threads.reduce((acc, thread) => {
      acc[thread.id] = thread.likesCount || 0; // Gunakan jumlah like dari API
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

      toast.success(
        updatedLikeStatus > 0 ? 'Like berhasil!' : 'Like dihapus!'
      );
    } catch (error) {
      toast.error('Gagal mengubah like.');
      console.error('Error toggling like:', error);
    }
  },
}));
