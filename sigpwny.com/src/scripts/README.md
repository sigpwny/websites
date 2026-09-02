# Discord Event Sync

Create a `.env` in `websites/sigpwny.com/src` containing

```
DISCORD_TOKEN=XXX
DISCORD_SERVER_ID=YYY
```

# ACM Event Sync

Create a `.env` in `websites/sigpwny.com` containing an ACM Core API key with the `manage:events` role:

```
ACM_CORE_API_KEY=XXX
```

Run `npm run build && npm run sync-acm -- --dry-run` to preview changes without modifying the ACM calendar.

To sync one historical entry, pass its source ID explicitly, for example: `npm run sync-acm -- --include-past --source-id=meeting:fa2026/general/2026-08-30`.

# Kaltura to Youtube Sync

Requires

```
KALTURA_USERNAME
KALTURA_PASSWORD
YOUTUBE_OAUTH_CREDS
```

parameters to work.
