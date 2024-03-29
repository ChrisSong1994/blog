import Link from "next/link";

type Props = {
  data: Array<string>;
};

export default function TagsDisplay({ data = [] }: Props) {
  return (
    <span style={{padding:'0 12'}}>
      {data.map((tag) => {
        return (
          <Link
            key={tag}
            href={`/?tag=${tag}`}
            style={{ color: "#1890FF", padding: "0 0.5rem" }}
          >
            #{tag}
          </Link>
        );
      })}
    </span>
  );
}
