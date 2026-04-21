/// <mls fileReference="_102020_/l2/molecules/groupShowProgress/progressBar.defs.ts" enhancement="_blank" />

// Do not change – automatically generated code. 

export const group = 'groupShowProgress';
export const skill = `# Metadata
- TagName: molecules--group-show-progress--progress-bar-102020

# Objective
Display a progress bar that visually and textually indicates the progress of file uploads, supporting both known and unknown progress states, and providing real-time feedback to users.

# Responsibilities
- Display a horizontal progress bar that fills according to the provided progress percentage (0 to 100).
- Show the current progress percentage as text (e.g., '57%') visible to the user.
- Support an indeterminate state when progress is unknown, with a distinct visual indication.
- Indicate when the upload is complete (e.g., when progress reaches 100%).
- Allow for a label or description to be displayed with the progress bar.
- Support a disabled or inactive state to reflect paused or canceled uploads.
- Emit an event or notification when progress reaches 100% (upload complete).
- Ensure accessibility, including appropriate ARIA attributes for progress indication.

# Constraints
- Progress percentage input must be a number between 0 and 100; values outside this range must be ignored or clamped.
- Indeterminate state must not display a specific percentage value.
- Disabled or inactive state must prevent user interaction and visually indicate inactivity.
- Completion state must be clearly distinguishable from other states.
- Label or description must be optional and not required for basic operation.
- Accessibility requirements must be met for all states (determinate, indeterminate, disabled, complete).
- Only one state (determinate, indeterminate, disabled) can be active at a time.

# Notes
- The molecule is intended for use in upload flows but can be used for other progress indications.
- Visual feedback for each state must be clear and unambiguous to users.`;

