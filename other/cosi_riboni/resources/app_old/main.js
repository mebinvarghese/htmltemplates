const {app, BrowserWindow, ipcMain} = require('electron')
const shell = require('electron').shell;
const Nucleus = require("electron-nucleus")("5aa7b598bcaaac001bc09172", {
	disableInDev: false, // disable module while in development (default: false)
	userId: 'TPOS', // Set a custom identifier for this User
	version: '2.2.6' // Set a custom version
})
var path = require('path');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
	// Create the browser window.
	win = new BrowserWindow({titleBarStyle: 'hidden',width: 800, height: 600,show: false,icon:path.join(__dirname, 'img/favicon.ico')})//,fullscreen:true,kiosk:true})
	win.maximize()
	
	//win.setAlwaysOnTop(true, "floating");

	// and load the index.html of the app.
	win.loadURL(`file://${__dirname}/index.html`)

	// Open the DevTools.
	win.webContents.openDevTools()

	win.once('ready-to-show', () => {
	  win.show();
	})

	var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
	  // Someone tried to run a second instance, we should focus our window.
	  if (win) {
		if (win.isMinimized()) win.restore();
		win.focus();
	  }
	});

	if (shouldQuit) {
	  app.quit();
	  return;
	}

	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null
	})
  
    win.on('close', function(e){
		var choice = require('electron').dialog.showMessageBox(this,
        {
          type: 'question',
          buttons: ['Yes', 'No'],
          title: 'Confirm',
          message: 'Are you sure you want to quit the application?'
       });
       if(choice == 1){
         e.preventDefault();
       }
    });
	
	ipcMain.on('button-click', (event, arg) => {
		win.minimize();
	})

	win.webContents.on('new-window', (e, url,frameName,disposition,options) => {
		e.preventDefault();
		shell.openExternal(url);
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

