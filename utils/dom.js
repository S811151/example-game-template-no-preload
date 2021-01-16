export function setWindowTitle(title) {
  document.head.getElementsByTagName('title')[0].innerText = title || ''
}
