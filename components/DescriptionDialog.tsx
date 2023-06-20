import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Task } from "utils/tasks";

export default function DescriptionDialog({
  isDescriptionDialogOpen,
  setIsDescriptionDialogOpen,
  task,
  setTask,
}: {
  isDescriptionDialogOpen: boolean;
  setIsDescriptionDialogOpen: (isDescriptionDialogOpen: boolean) => void;
  task: Task;
  setTask: (task: Task) => void;
}) {
  return (
    <Dialog
      open={isDescriptionDialogOpen}
      onClose={() => setIsDescriptionDialogOpen(false)}
    >
      <DialogContent>
        <TextField
          value={task?.description}
          fullWidth
          multiline
          placeholder="You can add comments here and they'll get added to the Google Calendar event."
          onChange={(e) => {
            setTask({ ...task, description: e.target.value });
          }}
        ></TextField>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setIsDescriptionDialogOpen(false);
          }}
          // Hardcode the background color to MUI blue because Tailwind sets
          // button backgrounds to transparent by default
          className="w-1/2 bg-[#1976d2]"
          variant="contained"
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
