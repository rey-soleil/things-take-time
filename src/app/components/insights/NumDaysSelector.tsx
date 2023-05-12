"use client";

const options = [
  { name: "day", value: 1 },
  { name: "week", value: 7 },
  { name: "month", value: 30 },
];

type TaskSelectorProps = {
  selectedNumDays: number;
  setSelectedNumDays: (numDays: number) => void;
};

export default function NumDaysSelector({
  selectedNumDays,
  setSelectedNumDays,
}: TaskSelectorProps) {
  return (
    <div className="flex flex-col">
      <div>
        Insights for the last{" "}
        <select
          value={selectedNumDays}
          onChange={({ target }) => setSelectedNumDays(Number(target.value))}
        >
          {options.map(({ name, value }) => (
            <option key={name} value={value}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
