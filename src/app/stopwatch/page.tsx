import { Roboto } from "next/font/google";
import styles from "../page.module.css";

const roboto = Roboto({ subsets: ["latin"], weight: "700" });

type StopwatchParams = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function Stopwatch({ searchParams }: StopwatchParams) {
  let { eventName, task } = searchParams;

  if (eventName === "undefined") eventName = undefined;
  task = JSON.parse(task);

  console.log({ task, eventName });

  return (
    <main className={styles.main}>
      <div className={styles.eventNameChip}>
        <h1 className={roboto.className}>
          {eventName ? eventName : task ? task.content : ""}
        </h1>
      </div>
    </main>
  );
}
