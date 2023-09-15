import { parseISO, format } from "date-fns";

type Props = {
  date: string;
  prefix?: string;
  className?: string;
};

const DateDisplay = ({ className = "", prefix = "", date }: Props) => {
  const value = parseISO(date);
  return (
    <time dateTime={date} className={`${className}`} style={{color:'#8c8c8c'}} >
      {prefix} {format(value, "yyyy-MM-dd")}
    </time>
  );
};

export default DateDisplay;
