import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { Session } from "next-auth";
import { useState } from "react";
import { closeTaskAndToast } from "utils/task-logging";
import { Task, taskSourceLabel } from "utils/tasks";

export default function TaskCompleteDialog({
  task,
  onCompleted,
  isTaskConfirmationDialogOpen,
  setIsTaskConfirmationDialogOpen,
  session,
}: {
  task: Task;
  onCompleted: (task: Task) => void;
  isTaskConfirmationDialogOpen: boolean;
  setIsTaskConfirmationDialogOpen: (isOpen: boolean) => void;
  session: Session | null;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();
  if (!session) return <></>;

  return (
    <Dialog open={isTaskConfirmationDialogOpen}>
      <DialogContent>
        <p>
          Did you complete <b>{task.content}</b>?
        </p>
        <p className="mt-2 text-sm text-black/60">
          Yes marks it complete in {taskSourceLabel(task)}.
        </p>
        {error && (
          <Alert severity="error" className="mt-3">
            {error} Your calendar log is separate; retrying here only updates{" "}
            {taskSourceLabel(task)}.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setError(undefined);
            setIsTaskConfirmationDialogOpen(false);
          }}
          disabled={saving}
          className="w-1/2"
        >
          No
        </Button>
        <Button
          onClick={async () => {
            setSaving(true);
            setError(undefined);
            try {
              await closeTaskAndToast(session, task);
              onCompleted(task);
              setIsTaskConfirmationDialogOpen(false);
            } catch (error) {
              setError(
                error instanceof Error
                  ? error.message
                  : "Could not complete the task. Please try again."
              );
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving}
          // Hardcode the background color to MUI blue because Tailwind sets
          // button backgrounds to transparent by default
          className="w-1/2 bg-[#1976d2]"
          variant="contained"
        >
          {saving ? "Saving…" : "Yes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
