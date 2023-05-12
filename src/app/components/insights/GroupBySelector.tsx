export enum GroupBy {
  Date,
  Activity,
}

type GroupBySelectorProps = {
  groupBy: GroupBy;
  setGroupBy: (groupBy: GroupBy) => void;
};

export default function GroupBySelector({
  groupBy,
  setGroupBy,
}: GroupBySelectorProps) {
  return (
    <div>
      <span
        className={`${
          groupBy === GroupBy.Date && "underline"
        } hover:cursor-pointer`}
        onClick={() => setGroupBy(GroupBy.Date)}
      >
        by date
      </span>{" "}
      |{" "}
      <span
        className={`${
          groupBy === GroupBy.Activity && "underline"
        } hover:cursor-pointer`}
        onClick={() => setGroupBy(GroupBy.Activity)}
      >
        by activity
      </span>
    </div>
  );
}
