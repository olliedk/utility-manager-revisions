/* ── Data selector popover (Avatar) ─────────────── */
function toggleDataPopover(e) {
  e.stopPropagation();
  var pop    = document.getElementById('dataPopover');
  var isOpen = pop.classList.contains('open');
  closeAll();
  if (!isOpen) {
    pop.classList.add('open');
    showOverlay();
  }
}

function closeDataPopover() {
  document.getElementById('dataPopover').classList.remove('open');
  hideOverlay();
}
