export type post = {
  id: string;
  text: string;
  views?: number;
  writtenBy: string;
  title: string;
  createdAt?: Date | undefined | string;
  updatedAt?: Date | undefined | string;
  authorId: string;
  imgUrl: string;
  audioUrl?: string;
  postedBy: string | null | undefined;
};

export type Subs = {
  email: string;
  subscribedAt: Date;
};
