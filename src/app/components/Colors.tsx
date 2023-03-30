import styles from "../page.module.css";

const colors = {
  1: "#7986cb",
  2: "#33b679",
  3: "#8e24aa",
  4: "#e67c73",
  5: "#f6c026",
  6: "#f5511d",
  7: "#039be5",
  8: "#616161",
  9: "#3f51b5",
  10: "#0b8043",
  11: "#d60000",
};

export default function Colors() {
  return (
    <div>
      {Object.entries(colors).map(([colorId, hex]) => {
        console.log({ colorId, hex });
        return (
          <div
            key={colorId}
            style={{ backgroundColor: hex, width: "50px", height: "50px" }}
            className={styles.colorCircle}
          ></div>
        );
      })}
    </div>
  );
}
