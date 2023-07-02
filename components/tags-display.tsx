import Link from "next/link";

type Props = {
  data: Array<string>;
};

export default function TagsDisplay({ data = [] }: Props) {
  return (
    <span className="px-2">
      {data.map((tag) => {
        return (
          <Link key={tag}  href={`/?tag=${tag}`} className="text-blue-500 px-2">
            #{tag}
          </Link>
        );
      })}
    </span>
  );
}
