import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type CuteButtonProps = {
  onClick: () => void;
  icon: IconDefinition;
  text: string;
  large?: boolean;
  title?: string;
};

export default function CuteButton({
  onClick,
  icon,
  text,
  large,
  title,
}: CuteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="m-5 flex flex-col items-center"
      title={title}
    >
      <FontAwesomeIcon
        icon={icon}
        className={large ? "text-7xl" : "text-5xl"}
      />
      <span className="m-1 text-base">{text}</span>
    </button>
  );
}
