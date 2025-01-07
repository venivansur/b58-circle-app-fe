export interface User {
  email?: string;
  id: string;
  fullName: string;
  token: string;
  profilePicture: string;
  username: string;
  password: string;
  profile: Profile;
  followers: number;
  following: number;
  isFollowed: boolean;
}

export interface Profile {

  bio: string;
}

export interface UserJWTPayload {
  id: string;
  threads: string;
  fullName: string;
  following?: number; 
  followers?: number; 
  profilePicture?: string;
  username: string;
  profile?: {
    bio?: string;
  };
  email: string;
  iat: number;
  exp: number;
}

export interface UpdateUserPayload {
  fullName: string;
  username: string;
  profilePicture: string | null;
  profile: {
    bio: string;
   
  };
}
