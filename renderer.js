const $ = selector => document.querySelector(selector)

const $button = $('#descargar')
const $console = $('#console')

$button.addEventListener('click', () => {
  window.electronAPI.downloadSetups()
})

window.electronAPI.downloadSetupsReply((event, message) => {
  const $span = document.createElement('span')
  $span.className = 'log'
  $span.textContent = message
  $console.appendChild($span)
})
