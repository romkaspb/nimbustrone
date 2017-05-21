var ipcRenderer = require('electron').ipcRenderer
const remote = require('electron').remote
const quickAddForm = document.getElementById('quickadd-form')

quickAddForm.addEventListener('submit', function (event) {
  ipcRenderer.send('create-text-note', document.getElementById('quickadd').value)
  remote.getCurrentWindow().hide()
})
