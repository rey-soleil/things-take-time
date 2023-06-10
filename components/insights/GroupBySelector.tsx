export enum GroupBy {
  Date,
  Task,
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
          groupBy === GroupBy.Task && "underline"
        } hover:cursor-pointer`}
        onClick={() => setGroupBy(GroupBy.Task)}
      >
        by task
      </span>
    </div>
  );
}
