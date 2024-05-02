import { useEffect, useRef } from "react";
import { formatAsHHMMSS, prettyFormat } from "utils/time";

const regex = /^(?:([0-5]?\d):)?([0-5]?\d):([0-5]\d)$/;

export default function Clock({ startTime, msElapsed, msUntilAlarm, setMsUntilAlarm }: { startTime: number | undefined, msElapsed: number, msUntilAlarm: number, setMsUntilAlarm: (msUntilAlarm: number) => void }) {
  const audioRef = useRef(new Audio('/ring.mp3'))

  useEffect(() => {
    if (msUntilAlarm === 0 || msElapsed < msUntilAlarm) return
    audioRef.current.play()
    setMsUntilAlarm(0)
  }, [msElapsed, msUntilAlarm])

  if (!startTime) return <EditableTime msUntilAlarm={msUntilAlarm} setMsUntilAlarm={setMsUntilAlarm} />

  if (msElapsed < msUntilAlarm) return <Timer msElapsed={msElapsed} msUntilAlarm={msUntilAlarm} />

  return <Stopwatch msElapsed={msElapsed} />
}

// A HH:MM:SS div that can be edited by the user before they start the timer
function EditableTime({ msUntilAlarm, setMsUntilAlarm }: { msUntilAlarm: number, setMsUntilAlarm: (msUntilAlarm: number) => void }) {

  function handleDurationChange(e: React.KeyboardEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>) {
    e.preventDefault()

    const duration = e.currentTarget.textContent || ""

    // Is duration in the format HH:MM:SS?
    const match = duration.match(regex)

    if (!match) {
      // If not, reset the timer to 0:00
      e.currentTarget.textContent = formatAsHHMMSS(msUntilAlarm)
    } else {
      // If so, set the timer to the duration
      const hours = parseInt(match[1] || "0")
      const minutes = parseInt(match[2])
      const seconds = parseInt(match[3])
      setMsUntilAlarm(hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000)
    }

    // Remove focus from the div
    e.currentTarget.blur()
  }

  return (
    <div className="font-mono text-8xl font-medium"
      contentEditable={true}
      onKeyDown={(e) => e.key === "Enter" && handleDurationChange(e)}
      onBlur={handleDurationChange}
    >
      {formatAsHHMMSS(0)}
    </div>
  );
}

function Timer({ msElapsed, msUntilAlarm }: { msElapsed: number, msUntilAlarm: number }) {
  return (
    <div className='flex flex-col space-y-6 items-center'>
      <div className="font-mono text-8xl font-medium">
        {formatAsHHMMSS(msUntilAlarm - msElapsed)}
      </div>
      <div className="font-mono text-2xl font-medium !mt-3">
        {prettyFormat(msUntilAlarm)}
      </div>
    </div>
  );
}

function Stopwatch({ msElapsed }: { msElapsed: number }) {
  return (
    <div>
      <div className="font-mono text-8xl font-medium">
        {formatAsHHMMSS(msElapsed)}
      </div>
    </div>
  )
}