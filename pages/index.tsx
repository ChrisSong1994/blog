import PostList from "../components/post-list";
import Layout from "../components/layout";
import Intro from "../components/intro";
import { getAllPosts } from "../lib/api";
import Post from "../interfaces/post";

type Props = {
  posts: Post[];
};

export default function Index({ posts }: Props) {
  return (
    <>
      <Layout>
        <Intro />
        <PostList data={posts} />
      </Layout>
    </>
  );
}

export const getStaticProps = async () => {
  const posts = getAllPosts(["title", "date", "slug", "excerpt"]);

  return {
    props: { posts },
  };
};
