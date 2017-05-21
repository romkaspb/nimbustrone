var ipcRenderer = require('electron').ipcRenderer;
const quickAddForm = document.getElementById('quickadd-form')

quickAddForm.addEventListener('submit', function (event) {
  ipcRenderer.send('create-new-note', document.getElementById('quickadd').value)
})
