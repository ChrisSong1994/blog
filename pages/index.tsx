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
              <div key={slug} className="mx-6 mb-6">
                <Link as={`/posts/${slug}`} href="/posts/[slug]">
                  <div className="bg-white rounded-m py-4 px-4">
                    <h3 className="text-2xl leading-tight font-bold mb-2 ">
                      {title}
                    </h3>
                    <p className="text-gray-400 mb-2">{excerpt}</p>
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
