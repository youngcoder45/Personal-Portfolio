// Copy-to-clipboard for the `git clone` command. Uses the async clipboard API
// where available and falls back to a hidden textarea on insecure origins.

const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-copy]'));

for (const button of buttons) {
  const text = button.dataset.copy ?? '';
  if (!text) continue;

  const label = button.querySelector<HTMLElement>('[data-copy-label]');
  const status =
    button.closest('.clone-block')?.querySelector<HTMLElement>('[data-copy-status]') ?? null;
  let timer = 0;

  const announce = (message: string, ok: boolean) => {
    button.dataset.state = ok ? 'ok' : 'error';
    if (label) label.textContent = ok ? 'copied ✓' : 'copy failed';
    if (status) status.textContent = message;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      button.dataset.state = '';
      if (label) label.textContent = 'copy';
      if (status) status.textContent = '';
    }, 2200);
  };

  const legacyExecCommand = (
    document as unknown as { execCommand: (command: string) => boolean }
  ).execCommand.bind(document);

  const legacyCopy = () => {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    field.style.pointerEvents = 'none';
    document.body.appendChild(field);
    field.select();
    let ok = false;
    try {
      ok = legacyExecCommand('copy');
    } catch {
      ok = false;
    }
    field.remove();
    return ok;
  };

  button.addEventListener('click', async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      ok = legacyCopy();
    }
    announce(
      ok ? 'Clone command copied to the clipboard.' : 'Copy failed. Select the command and copy it manually.',
      ok,
    );
  });
}

export {};
