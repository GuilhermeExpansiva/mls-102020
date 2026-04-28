/// <mls fileReference="_102020_/l2/skills/molecules/groupNotifyUser/usage.ts" enhancement="_blank"/>

export const skill = `
# notify + user — Usage

> Quick reference for using molecules in the **notify + user** group.
> Use this when the system needs to **inform the user** about an event, status, or result.
> Controlled via the \`visible\` property — page sets it to show/hide.

---

## Slot Tags

| Tag | Description |
|-----|-------------|
| \`Title\` | Notification title/heading |
| \`Message\` | Notification body content |
| \`Action\` | Actionable element (button, link) inside the notification |
| \`Icon\` | Custom icon content |

---

## Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| \`type\` | \`string\` | \`'info'\` | Notification type: \`'info'\`, \`'success'\`, \`'warning'\`, \`'error'\` |
| \`visible\` | \`boolean\` | \`false\` | Show or hide the notification |
| \`dismissible\` | \`boolean\` | \`true\` | Show a close/dismiss button |
| \`duration\` | \`number\` | \`0\` | Auto-dismiss after N ms (0 = manual dismiss only) |
| \`position\` | \`string\` | \`''\` | Position hint: \`'top'\`, \`'bottom'\`, \`'top-right'\`, etc. Empty = inline |

---

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| \`dismiss\` | \`{}\` | Fired when the notification is dismissed |
| \`action\` | \`{}\` | Fired when the Action slot is clicked |

---

## Examples

### Warning banner with action

\`\`\`html
<molecules--banner-102020
  type="warning"
  visible="{{ui.system.showUpdateBanner}}"
  position="top"
  dismissible="true">
  <Icon>⚠️</Icon>
  <Message>A new version is available.</Message>
  <Action>
    <button>Update Now</button>
  </Action>
</molecules--banner-102020>
\`\`\`


`;
