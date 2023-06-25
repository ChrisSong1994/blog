import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Layout from "../../components/layout";
import { getPostBySlug, getAllPosts } from "../../lib/api";
import Head from "next/head";
import DateFormatter from "../../components/date-formatter";
import markdownToHtml from "../../lib/markdownToHtml";
import type PostType from "../../interfaces/post";
import markdownStyles from "./markdown-styles.module.css";

type Props = {
  post: PostType;
  morePosts: PostType[];
};

export default function Post({ post }: Props) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout>
      {router.isFallback ? (
        <div>Loading…</div>
      ) : (
        <>
          <article className="mb-32">
            <Head>
              <title>{post.title}</title>
            </Head>
            <h1 className="text-5xl  font-bold tracking-tighter leading-tight  mb-12 text-left">
              {post.title}
            </h1>

            <div className="mb-6 text-lg">
              <DateFormatter dateString={post.date} />
            </div>
            <div
              className={markdownStyles["markdown"]}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </>
      )}
    </Layout>
  );
}

type Params = {
  params: {
    slug: string;
  };
};

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, ["title", "date", "slug", "content"]);
  const content = await markdownToHtml(post.content || "");

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"]);

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
