"use server";

import { updateUser } from "../../lib/mongo/users";

export async function updateCalendarId(email: string, calendarId: string) {
  await updateUser(email, { calendarId });
}
