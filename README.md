# Things Take Time

<img src="https://github-production-user-asset-6210df.s3.amazonaws.com/68834278/260510785-0b9f3b52-26b8-4b9f-9235-5970a78e720b.gif" width="576" height="360"/>

## About

Things Take Time (TTT) is a web app for time tracking. 

With TTT, you can choose tasks from Todoist or Notion, time your work, and log the actual elapsed time to Google Calendar. Confirming completion updates the task in its original app; you can also log time without completing it.

You can also see charts breaking down your time usage by category on the `/insights` page.

## Frameworks
- `Next.js`: for full-stack development
- `NextAuth`: for user sign in using OAuth 2.0
- `MongoDB`: to store user session data
- `Todoist API`: to fetch users' tasks
- `Notion API`: to fetch and complete tasks in a connected Tasks database
- `Google Calendar API`: to write completed tasks
- `Recharts`: to render the insights chart
- `Tailwind CSS`: for styling!
- `React`
- `TypeScript`

## Connect Notion

Sign in and select **Connect Notion** beneath the task picker. Create an internal connection in [Notion's developer portal](https://www.notion.so/profile/integrations) with Read content and Update content capabilities. Add that connection to your Tasks database using its **••• → Connections** menu, then enter the connection token and database link in Things Take Time. You can also supply the specific data source ID.

The Tasks database uses these existing fields:

| Field | Type | Use |
| --- | --- | --- |
| Name | Title | Task and calendar event title; required |
| Completed on? | Date | Empty means unfinished; confirmation sets the completion timestamp; required |
| Active? | Checkbox | Active tasks appear ahead of other Notion tasks |
| Needs to be completed by | Date | Deadline and ordering within a group |
| Number of minutes (estimated) | Number | Optional estimate shown in the picker |

All unfinished Notion tasks are available, including those without a deadline. Todoist's existing today/routine grouping is preserved. Each source loads independently. Refresh the list with **Refresh tasks**, or return to the app window to refresh automatically. Completing a task refreshes the list too.

The connection belongs to the signed-in user and is stored encrypted in the existing MongoDB users collection using `NEXTAUTH_SECRET`. No Notion token is included in client sessions, public environment variables, or responses. Existing `MONGODB_URI` and `NEXTAUTH_SECRET` configuration is required; changing the secret requires reconnecting Notion. Disconnect removes the saved connection without changing any Notion tasks. A ChatGPT Notion connection does not automatically authorize this separate web app.

## Checks

Run `npm test` for Notion filtering, pagination, authorization, completion, and provider-routing regressions. Run `npm run build` for the production build and type checking.
