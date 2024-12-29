import { create } from 'zustand';
import { api } from '@/libs/api'; // Ganti dengan path API Anda
import { toast } from 'react-toastify'; // Notifikasi

interface LikeStore {
  likes: Record<number, number>; // Menyimpan jumlah like untuk setiap thread
  toggleLike: (threadId: number) => Promise<void>; // Fungsi toggle like
  loadLikes: () => void; // Fungsi untuk memuat likes dari localStorage
}

export const useLikeStore = create<LikeStore>((set, get) => {
  const savedLikes = JSON.parse(localStorage.getItem('likes') || '{}');

  return {
    likes: savedLikes, // Gunakan data yang disimpan jika ada
    loadLikes: () => {
      const savedLikes = JSON.parse(localStorage.getItem('likes') || '{}');
      set({ likes: savedLikes });
    },
    toggleLike: async (threadId) => {
      try {
        const currentLikeStatus = get().likes[threadId] || 0; // Dapatkan status like yang ada (0 jika tidak ada)
        const response = await api.post(`/threads/${threadId}/like`, {
          likeStatus: currentLikeStatus === 0 ? 1 : 0, // Kirimkan status like yang baru
        });

        // Ambil status like dari _count.likes dalam respons
        const updatedLikeStatus = response.data.thread?._count.likes;

        if (updatedLikeStatus === undefined) {
          throw new Error('Tidak ada data status like dalam respons');
        }

        // Update state likes dengan status terbaru
        set((state) => {
          const updatedLikes = {
            ...state.likes,
            [threadId]: updatedLikeStatus, // Update like untuk thread tertentu
          };

          // Simpan status likes terbaru ke localStorage
          localStorage.setItem('likes', JSON.stringify(updatedLikes));
          console.log('Updated Likes State:', updatedLikes); // Debug state setelah update
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
