import { create } from 'zustand';
import { api } from '@/libs/api'; 
import { toast } from 'react-toastify';

interface LikeStore {
  likes: Record<number, number>;
  toggleLike: (threadId: number) => Promise<void>; 
  loadLikes: () => void; 
}

export const useLikeStore = create<LikeStore>((set, get) => {
  const savedLikes = JSON.parse(localStorage.getItem('likes') || '{}');

  return {
    likes: savedLikes, 
    loadLikes: () => {
      const savedLikes = JSON.parse(localStorage.getItem('likes') || '{}');
      set({ likes: savedLikes });
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

        
        set((state) => {
          const updatedLikes = {
            ...state.likes,
            [threadId]: updatedLikeStatus, 
          };

          
          localStorage.setItem('likes', JSON.stringify(updatedLikes));
        
          return { likes: updatedLikes };
        });

        toast.success(updatedLikeStatus > 0 ? 'Like berhasil!' : 'Like dihapus!');
      } catch (error) {
        toast.error('Gagal mengubah like.');
        console.error('Error toggling like:', error);
      }
    },
  };
});
