const { app, BrowserWindow, globalShortcut, getCurrentWindow } = require('electron')

function createWindow() {
  window = new BrowserWindow({
    width: 700, 
    height: 600, 
    minHeight: 450, 
    minWidth: 500, 
    resizable: false,
    backgroundColor: '#16213e',
    webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true
    }
})
  window.loadFile('src/index.html')
}


app.on('ready', () => {
  createWindow();
  globalShortcut.register('CommandOrControl+X', openTools);
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('browser-window-created',function(e,window) {
  window.setMenu(null);
});

function openTools(){
  window.webContents.openDevTools();
}