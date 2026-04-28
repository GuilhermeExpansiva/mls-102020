/// <mls fileReference="_102020_/l2/skills/molecules/groupPlayMedia/usage.ts" enhancement="_blank"/>

export const skill = `
# play + media — Usage

> Quick reference for using molecules in the **play + media** group.
> Use this when the user needs to **play audio or video content**.
> All implementations share the same slot tag contract — swap the tag for a different player style.

---

## Slot Tags

| Tag | Description |
|-----|-------------|
| \`Label\` | Title or description displayed alongside the player |
| \`Source\` | Media source. Attributes: \`src\` (required), \`type\` (e.g. \`"video/mp4"\`, \`"audio/mpeg"\`). Multiple allowed for fallback formats |
| \`Track\` | Subtitle/caption track. Attributes: \`src\`, \`kind\` (\`"subtitles"\`, \`"captions"\`), \`lang\`, \`label\` |

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`poster\` | \`string\` | \`''\` | Thumbnail image URL (video only, ignored by audio) |
| \`autoplay\` | \`boolean\` | \`false\` | Start playback automatically |
| \`loop\` | \`boolean\` | \`false\` | Restart playback when ended |
| \`muted\` | \`boolean\` | \`false\` | Start muted |
| \`preload\` | \`string\` | \`'metadata'\` | Preload strategy: \`'none'\`, \`'metadata'\`, \`'auto'\` |
| \`disabled\` | \`boolean\` | \`false\` | Disables all controls |
| \`loading\` | \`boolean\` | \`false\` | Shows a loading indicator |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| \`play\` | \`{}\` | Playback started |
| \`pause\` | \`{}\` | Playback paused |
| \`ended\` | \`{}\` | Playback reached the end |
| \`timeUpdate\` | \`{ currentTime: number, duration: number }\` | Playback position changed |
| \`error\` | \`{ message: string }\` | Media failed to load or play |

---

## Examples


\`\`\`html
<molecules--video-player-102020
  poster="thumbnail.jpg"
  preload="metadata">
  <Label>Product Demo</Label>
  <Source src="demo.webm" type="video/webm" />
  <Source src="demo.mp4" type="video/mp4" />
  <Track src="subs-en.vtt" kind="subtitles" lang="en" label="English" />
  <Track src="subs-pt.vtt" kind="subtitles" lang="pt" label="Português" />
</molecules--video-player-102020>
\`\`\`

`;