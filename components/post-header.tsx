import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  date: string;
};

const PostHeader = ({ title, date }: Props) => {
  return (
    <>
      <h1 className="text-5xl  font-bold tracking-tighter leading-tight  mb-12 text-left">
        {title}
      </h1>

      <div className="mb-6 text-lg">
        <DateFormatter dateString={date} />
      </div>
    </>
  );
};

export default PostHeader;
