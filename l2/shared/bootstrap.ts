import '/_102020_/l2/shared/shell.js';

function ensureShellRoot() {
  const existing = document.querySelector('collab-aura-shell');
  if (existing) {
    return existing;
  }

  const shell = document.createElement('collab-aura-shell');
  document.body.appendChild(shell);
  return shell;
}

ensureShellRoot();
