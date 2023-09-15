import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";
import "highlight.js/styles/github.css";

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
        <article
          style={{
            backgroundColor: "#fff",
            padding: "1rem",
          }}
        >
          <h1
            style={{
              fontWeight: 700,
              fontSize: "2.5rem",
              textAlign: "left",
              margin: "1rem 0",
            }}
          >
            {post.title}
          </h1>

          <div
            style={{
              margin: "0.5rem 0",
              fontSize: "1.125rem",
              lineHeight: "1.75rem",
            }}
          >
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
