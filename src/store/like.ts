import { create } from 'zustand';
import { api } from '@/libs/api'; 
import { toast } from 'react-toastify';

interface LikeStore {
  likes: Record<number, number>;
  toggleLike: (threadId: number) => Promise<void>; 
  loadLikes: () => void; 
}

// Di dalam useLikeStore, pastikan status likes diambil dari server
export const useLikeStore = create<LikeStore>((set, get) => {
  const userId = localStorage.getItem('userId'); // Pastikan userId ada

  return {
    likes: {},
    loadLikes: async () => {
      if (!userId) return;
      try {
        // Ambil likes pengguna dari server
        const response = await api.get(`/users/${userId}/likes`);
        set({ likes: response.data });
      } catch (error) {
        console.error('Failed to load likes:', error);
      }
    },
    toggleLike: async (threadId) => {
      try {
        const currentLikeStatus = get().likes[threadId] || 0;
        const response = await api.post(`/threads/${threadId}/like`, {
          likeStatus: currentLikeStatus === 0 ? 1 : 0,
        });

        const updatedLikeStatus = response.data?.likeStatus;
        if (updatedLikeStatus !== undefined) {
          set((state) => ({
            likes: {
              ...state.likes,
              [threadId]: updatedLikeStatus,
            },
          }));
          toast.success(updatedLikeStatus > 0 ? 'Like berhasil!' : 'Like dihapus!');
        }
      } catch (error) {
        toast.error('Gagal mengubah like.');
        console.error('Error toggling like:', error);
      }
    },
  };
});

