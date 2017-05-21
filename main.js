const electron = require('electron')
const app = electron.app
const Tray = electron.Tray
const Menu = electron.Menu
const ipc = electron.ipcMain

const shell = electron.shell
const globalShortcut = electron.globalShortcut
const BrowserWindow = electron.BrowserWindow

var mainWindow = null
var quickAddWindow = null

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

let tray = null

app.on('ready', function() {
  createMainWindow()
  createTray()

  globalShortcut.register('CommandOrControl+Shift+Alt+N', function (event) {
    toggleQuickAddWindow()
  })


});

function createMainWindow() {
   mainWindow = new BrowserWindow(
    {
      width: 1500,
      height: 900,
      webPreferences:
        {
          nodeIntegration: false
        },
      icon: __dirname + '/png/everhelper-4.png',
    }
  );

  mainWindow.loadURL('https://nimbus.everhelper.me/client/');

  // Этот метод будет выполнен когда генерируется событие закрытия окна.
  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  mainWindow.on('close', function(e){
    e.preventDefault()
    mainWindow.hide()
  })

}

function createQuickAddWindow () {
  quickAddWindow = new BrowserWindow(
    {
      width: 540,
      height: 80,
      modal: true,
      frame: false,
      parent: mainWindow,
      alwaysOnTop: true,
    }
  );

  quickAddWindow.loadURL('file://' + __dirname + '/html/quickadd.html');
  quickAddWindow.show()

  ipc.on('create-text-note', function(event, text){
    createTextNote(text)
    // request('https://nimbus.everhelper.me/api/me', function (error, response, body) {
    //   console.log('error:', error); // Print the error if one occurred
    //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //   console.log('body:', body); // Print the HTML for the Google homepage.
    // });
    // дергаем апи для сохранения заметки
    // https://nimbus.everhelper.me/api/notes/cXmYOJUTpzMWYKfB/text
  });
}

function createTextNote(text){
  console.log(text)
}

function toggleQuickAddWindow(){
  if( quickAddWindow == null ){
    createQuickAddWindow()
  }else{
    quickAddWindow.show()
  }
}

function toggleMainWindow(){
  if( mainWindow == null ){
    createMainWindow()
  }else{
    mainWindow.show()
  }
}

function createTray () {
    //create tray icon
    // tray = new Tray(path.join(__dirname, 'tray/18x18.png'))

    // //Create context menu
    // contextMenu = Menu.buildFromTemplate([
    //     {label: "Open Whatever", click() {
    //         if ( mainWindow == null ) { createWindow() }
    //     }},
    //     //{label: "New note", click() { newNote() }},
    //     {label: "Account settings", click() { openSettings() }},
    //     {label: "App settings", click() { openConfig() }},
    //     {label: "Quit", click() { app.quit() }},
    //     {type: "separator"},
    //     {label: "GitHub", click() {
    //         shell.openExternal('https://github.com/CellarD0-0r/whatever')
    //     }}
    // ])

    // tray.setContextMenu(contextMenu)
    tray = new Tray(__dirname + '/png/everhelper-1.png')
    const contextMenu = Menu.buildFromTemplate([
      {label: 'Open Nimbus', click(){
        if ( mainWindow == null ) { createWindow() }
      }},
      {label: 'Quickadd', click(){
        toggleQuickAddWindow()
      }},
      {label: "Quit", click() { mainWindow.close() }},
      {label: "GitHub", click() {
        shell.openExternal('https://github.com/romkaspb/nimbustrone')
      }}
    ])

    tray.setContextMenu(contextMenu)
}
