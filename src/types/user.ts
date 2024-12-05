export interface User {
    email: string;
    username: string;
    password: string;
    profile: Profile;
    post: Post;
    followers: number;
    following: number;
    isFollowed: boolean;
  }
  export interface Profile {
    fullName: string;
    address: string;
    profilePicture: string;
    bio: string;
  }


  export interface Post {
    id: number;
    timeAgo: string;
  postText: string;
  postPicture: any
  replies: number;
  likes?: number;
  }