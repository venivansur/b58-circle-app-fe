export interface User {
  email: string;
  id:string;
  fullName: string;
  token:string;
  username: string;
  password: string;
  profile: Profile;
  followers: number;
  following: number;
  isFollowed: boolean;
  profilePicture: string;
}

export interface Profile {
  
  profilePicture: string;
  bio: string;
}

export interface UserJWTPayload {
  id: number;
  threads:string;
  fullName: string;
  following?: string;
  followers?: string;
  profilePicture?: string;
  username: string;
  profile?: {
    bio?: string;
    
  };
  email: string;
  iat: number;
  exp: number;
};
export interface UpdateUserPayload {
  id: string;
  fullName: string;
  username: string;
  bio: string;
  profilePicture: string; 
  following?: string; 
  followers?: string; 
  profile?: {
    bio: string;
    profilePicture: string | null;
  };
}