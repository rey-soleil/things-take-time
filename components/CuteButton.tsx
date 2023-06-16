import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type CuteButtonProps = {
  onClick: () => void;
  icon: IconDefinition;
  text: string;
};

export default function CuteButton({ onClick, icon, text }: CuteButtonProps) {
  return (
    <button onClick={onClick} className="m-5 flex flex-col items-center">
      <FontAwesomeIcon icon={icon} className="text-6xl" />
      <span className="m-1 text-base">{text}</span>
    </button>
  );
}
