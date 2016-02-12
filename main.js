'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let prefWindow;
let print_win

const ipcMain = require('electron').ipcMain;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800
        , height: 800
        , 'web-preferences': {
            'web-security': false
            , 'allowDisplayingInsecureContent': true
            , 'allowRunningInsecureContent': true
        }
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/views/index.html');
    
    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });  
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('toggle-dev-tools', function(event, args){
    if(mainWindow.webContents.isDevToolsOpened())
        mainWindow.webContents.closeDevTools()
    else
        mainWindow.webContents.openDevTools()
})

ipcMain.on('show-prefs', function() {
    prefWindow = new BrowserWindow({
       'auto-hide-menu-bar':true,
        width: 450,
        height: 540,
        show: false
    }) 
    prefWindow.loadURL('file://' + __dirname + '/views/preferences.html') 
    prefWindow.show()
})

ipcMain.on('start-print', function(event, width, height) {
    print_win = new BrowserWindow({
        'auto-hide-menu-bar':true
        , width: width
        , height: height
    }) 
    print_win.loadURL('file://' + __dirname + '/views/printContent.html')
    print_win.show()
    print_win.webContents.on("did-finish-load", function() {
      print_win.webContents.print()  
    })
    print_win.on('closed', function() {
        print_win = null
    })
})
