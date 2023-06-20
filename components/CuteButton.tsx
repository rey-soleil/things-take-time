import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "@mui/material";

export default function CuteButton({
  onClick,
  icon,
  title,
  disabled,
  hidden,
  large,
}: {
  onClick: () => void;
  icon: IconDefinition;
  title: string;
  disabled?: boolean;
  hidden?: boolean;
  large?: boolean;
}) {
  return (
    <Tooltip title={title}>
      <div>
        <button
          onClick={onClick}
          className={`m-5 flex flex-col items-center ${hidden && "invisible"}`}
          disabled={disabled}
        >
          <FontAwesomeIcon
            icon={icon}
            className={large ? "text-7xl" : "text-5xl"}
            color={disabled ? "gray" : "black"}
          />
        </button>
      </div>
    </Tooltip>
  );
}
