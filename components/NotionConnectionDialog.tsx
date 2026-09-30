import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

export default function NotionConnectionDialog({
  open,
  configured,
  dataSourceId,
  onClose,
  onSaved,
}: {
  open: boolean;
  configured: boolean;
  dataSourceId?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [token, setToken] = useState("");
  const [database, setDatabase] = useState(dataSourceId ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function save(disconnect = false) {
    setBusy(true);
    setError(undefined);
    try {
      const response = await fetch("/api/notion/connection", {
        method: disconnect ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        ...(!disconnect ? { body: JSON.stringify({ token, database }) } : {}),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Could not save the Notion connection.");
      }
      setToken("");
      onSaved();
      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Notion could not be connected."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="notion-title"
    >
      <DialogTitle id="notion-title">
        {configured ? "Notion connection" : "Connect Notion"}
      </DialogTitle>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        <DialogContent className="flex flex-col gap-5">
          <p className="text-sm">
            Create an internal connection in{" "}
            <a
              href="https://www.notion.so/profile/integrations"
              target="_blank"
              rel="noreferrer"
              className="text-blue-700 underline"
            >
              Notion
            </a>{" "}
            with permission to read and update content. In your Tasks database,
            open the ••• menu, choose Connections, and add it. Then paste its
            token and the database link below.
          </p>
          <TextField
            label="Notion connection token"
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            autoComplete="off"
            required={!configured}
            disabled={busy}
            fullWidth
            helperText={
              configured
                ? "Leave blank to keep the saved token."
                : "Saved privately to your account."
            }
          />
          <TextField
            label="Tasks database link or data source ID"
            value={database}
            onChange={(event) => setDatabase(event.target.value)}
            required
            disabled={busy}
            fullWidth
          />
          <p className="text-sm text-black/60">
            Unfinished tasks appear in the timer. Confirming completion fills in
            “Completed on?” in Notion. Stopping the timer logs time to Google
            Calendar.
          </p>
          {error && <Alert severity="error">{error}</Alert>}
        </DialogContent>
        <DialogActions>
          {configured && (
            <Button
              disabled={busy}
              color="error"
              onClick={() => void save(true)}
            >
              Disconnect
            </Button>
          )}
          <Button disabled={busy} onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={busy}
            variant="contained"
            className="bg-[#1976d2]"
          >
            {busy ? "Saving…" : "Save connection"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
