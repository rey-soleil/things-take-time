import { Task } from "@doist/todoist-api-typescript";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { Session } from "next-auth";
import { closeTodoistTaskAndToast } from "utils/task-logging";

export default function TaskCompleteDialog({
  task,
  isTaskConfirmationDialogOpen,
  setIsTaskConfirmationDialogOpen,
  session,
}: {
  task: Task | undefined;
  isTaskConfirmationDialogOpen: boolean;
  setIsTaskConfirmationDialogOpen: (isOpen: boolean) => void;
  session: Session | null;
}) {
  if (!task || !session) return <></>;

  return (
    <Dialog open={isTaskConfirmationDialogOpen}>
      <DialogContent>
        <p>
          Did you complete <b>{task.content}</b>?
        </p>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setIsTaskConfirmationDialogOpen(false);
          }}
          className="w-1/2"
        >
          No
        </Button>
        <Button
          onClick={() => {
            setIsTaskConfirmationDialogOpen(false);
            closeTodoistTaskAndToast(session, task!);
          }}
          // Hardcode the background color to MUI blue because Tailwind sets
          // button backgrounds to transparent by default
          className="w-1/2 bg-[#1976d2]"
          variant="contained"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
