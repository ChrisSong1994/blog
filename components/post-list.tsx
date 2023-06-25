import DateFormatter from "./date-formatter";
import Link from "next/link";

import Post from "../interfaces/post";

type Props = {
  data: Array<Post>;
};

const PostList = ({ data }: Props) => {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-4">文章列表</h2>
      {data.map((post) => {
        const { slug, title, date } = post;
        return (
          <div
            key={slug}
            className=" py-4 px-4 mb-20 hover:bg-slate-300  hover:border-l-8 hover:border-slate-500"
          >
            <Link as={`/posts/${slug}`} href="/posts/[slug]">
              <div className="flex ">
                <div className="text-lg mr-4">
                  <DateFormatter dateString={date} />
                </div>
                <h3 className="text-2xl leading-tight font-bold">{title}</h3>
              </div>
            </Link>
          </div>
        );
      })}
    </section>
  );
};

export default PostList;
