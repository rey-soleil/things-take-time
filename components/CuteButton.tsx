import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type CuteButtonProps = {
  onClick: () => void;
  icon: IconDefinition;
  text: string;
  disabled?: boolean;
};

export default function CuteButton({
  onClick,
  icon,
  text,
  disabled,
}: CuteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="m-5 flex flex-col items-center"
      disabled={disabled}
    >
      <FontAwesomeIcon
        icon={icon}
        className="text-6xl"
        color={disabled ? "gray" : "black"}
      />
    </button>
  );
}
