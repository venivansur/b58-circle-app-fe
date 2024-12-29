export interface User {
  id: string;
  fullName: string;
  profilePicture: string;
}

export interface Reply {
  id: string;
  content: string;
  fileUrl?: string;
  user: User;
}

export interface Thread {
  id: number;
  content: string;
  fileUrl: string
  createdAt: string;
  _count: {
    replies: number;
    likes: number;
  };
  user: User;
  replies: Reply[];
  isLikedByUser?: boolean; // Properti baru untuk status "like"
  likesCount: number
}
