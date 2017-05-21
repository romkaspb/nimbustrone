const electron = require('electron');
const app = electron.app;  // Модуль контролирующей жизненный цикл нашего приложения.
const Tray = electron.Tray
const Menu = electron.Menu
const ipc = electron.ipcMain
const request = require('request')

const dialog = electron.dialog
const globalShortcut = electron.globalShortcut
const BrowserWindow = electron.BrowserWindow;  // Модуль создающий браузерное окно.

var mainWindow = null;
var quickAddWindow = null;

// Проверяем что все окна закрыты и закрываем приложение.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

let tray = null

// Этот метод будет вызван когда Electron закончит инициализацию
// и будет готов к созданию браузерных окон.
app.on('ready', function() {
  // Создаем окно браузера.
  createMainWindow()
  createTray()
  globalShortcut.register('CommandOrControl+Shift+Alt+N', function (event) {
    createQuickAdd();
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

}

function createQuickAdd () {
  if( quickAddWindow == null ){
      quickAddWindow = new BrowserWindow(
        {
          width: 540,
          height: 80,
          // webPreferences:
          //   {
          //     nodeIntegration: false
          //   },
          modal: true,
          frame: false,
          parent: mainWindow,
        }
      );
      quickAddWindow.on('closed', function() {
        if ( quickAddWindow != null ){
          quickAddWindow = null;
        }
      })
    }
    quickAddWindow.loadURL('file://' + __dirname + '/html/quickadd.html');
    quickAddWindow.show()



    ipc.on('create-new-note', function(event, store){
      console.log(store)
      if( quickAddWindow != null ){
        quickAddWindow.hide()
      }
      request('https://nimbus.everhelper.me/api/me', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
      });
      // дергаем апи для сохранения заметки
      // https://nimbus.everhelper.me/api/notes/cXmYOJUTpzMWYKfB/text
    });
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
      {label: 'Item1', type: 'radio'},
      {label: 'Item2', type: 'radio'},
      {label: 'Item3', type: 'radio', checked: true},
      {label: 'Item4', type: 'radio'}
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
}
