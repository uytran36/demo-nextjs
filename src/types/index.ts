export type Meta = {
  id: string;
  title: string;
  date: string;
  tags: string[];
};

export type BlogPost = {
  meata: Meta;
  content: any;
};
