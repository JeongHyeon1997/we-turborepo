export interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatarColor: string;
  };
  content: string;
  image?: string | null;
  likes: number;
  comments: number;
  createdAt: string;
}
