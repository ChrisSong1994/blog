type PostType = {
  slug: string; // file name
  title: string;
  date: string;
  excerpt: string;
  content: string;
  cover?: string;
  tags?: Array<string>;
};

export default PostType;
