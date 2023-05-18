# the next right thing

<img src="https://github-production-user-asset-6210df.s3.amazonaws.com/68834278/239098242-efcc805b-84ef-4777-b0f1-83023108081d.gif" width="640" height="400"/>

## About
**the next right thing** (NRT) is a web app to help you decide what to do next. 

It's a combination stopwatch, to-do list, and analytics page, and it integrates with Google Calendar and Todoist.

## Frameworks

NRT is build with Next.js and deployed to Vercel.

It uses Tailwind for inline CSS and recharts for the insights page.

It fetches tasks from the Todoist API and reads/writes from/to the Google Calendar API.

## Running Locally

```bash
git clone https://github.com/rey-soleil/next-right-thing.git
cd next-right-thing
npm i
npm run dev
```

### Environment Variables
You'll need to `cp .env.example .env.local` and fill in the environment variables there.

You can get your Google Calendar API key using the process described [here](https://support.google.com/googleapi/answer/6158862?hl=en)

You can get your Todoist API key using the process described [here](https://developer.todoist.com/guides/#developing-with-todoist)

### About the Name

> If you do with conviction the next and most necessary thing, you are always doing something meaningful and intended by fate. 

-- Carl Jung
