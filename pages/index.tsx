import Link from "next/link";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const TagsDisplay = dynamic(() => import("../components/tags-display"), {
  // 仅client 渲染
  ssr: false,
});
import Layout from "components/layout";
import DateDisplay from "components/date-display";
import { getAllPosts } from "lib/api";
import Post from "../interfaces/post";

type Props = {
  posts: Post[];
};

export default function Index({ posts }: Props) {
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag");

  return (
    <Layout>
      <section>
        {posts
          .filter(({ tags }) => !tag || tags.includes(tag))
          .map((post) => {
            const { slug, title, date, excerpt, tags } = post;
            return (
              <div key={slug} style={{ margin: "0 1.5rem 1.5rem" }}>
                <Link as={`/posts/${slug}`} href="/posts/[slug]">
                  <div
                    style={{
                      padding: "1rem",
                      backgroundColor: "#fff",
                    }}
                  >
                    <h3
                      style={{
                        fontWeight: 700,
                        fontSize: "1.5rem",
                        margin:0,
                        marginBottom: "0.5rem",
                      }}
                    >
                      {title}
                    </h3>
                    <p
                      style={{
                        color: "#BFBFBF",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {excerpt}
                    </p>
                    <div>
                      <DateDisplay prefix="发布于 " date={date} />
                      <TagsDisplay data={tags} />
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
      </section>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const posts = getAllPosts([
    "title",
    "date",
    "slug",
    "excerpt",
    "tags",
    "cover",
  ]);

  return {
    props: { posts },
  };
};
