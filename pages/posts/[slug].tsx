import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";

import Layout from "components/layout";
import { getPostBySlug, getAllPosts } from "lib/api";
import DateDdisplay from "components/date-display";
import TagsDisplay from "components/tags-display";
import markdownToHtml from "lib/markdownToHtml";
import type PostType from "interfaces/post";
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
      <Head>
        <title>{post.title}</title>
      </Head>
      {router.isFallback ? (
        <div>Loading…</div>
      ) : (
        <article className="bg-white rounded py-4 px-4">
          <h1 className="text-5xl  font-bold tracking-tighter leading-tight  my-4 text-left">
            {post.title}
          </h1>

          <div className="my-2 text-lg">
            <DateDdisplay prefix="发布于" date={post.date} />
            <TagsDisplay data={post.tags} />
          </div>
          <div
            className={markdownStyles["markdown"]}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
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
  const post = getPostBySlug(params.slug, [
    "title",
    "date",
    "slug",
    "content",
    "tags",
  ]);
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
