/**
 * main.js
 * Author: cmlin
 */
const path = require('path');
const electron = require('electron');
const http = require('http');
const BrowserWindow = electron.BrowserWindow;
const Tray = electron.Tray;
const Menu = electron.Menu;
const app = electron.app;


const debug = false;
let mainWindow = null;
let appIcon = null;
let configName = "config.json";

app.setName('复旦校园网自动连接工具');

function initialize() {
    function createWindow() {
        var windowOptions = {
            width: 600,
            height: 400,
            maximizable: false,
            center: true,
            resizable: false,
            useContentSize: true,
            title: app.getName()
        };

        mainWindow = new BrowserWindow(windowOptions);
        mainWindow.setMenu(null);
        mainWindow.loadURL(path.join('file://', __dirname, '/index.html'));
        if (debug) {
            mainWindow.webContents.openDevTools();
        }
        mainWindow.on('closed', function () {
            mainWindow = null;
        });

        mainWindow.on('close', function(e) {
            mainWindow.hide();
            e.preventDefault();
        });
    }
    function createTray() {
        const iconName = 'windows-icon.png';
        const iconPath = path.join(__dirname, iconName);
        appIcon = new Tray(iconPath);
        appIcon.setToolTip('复旦校园网自动连接工具');
        appIcon.on('click', () => {
            mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
        });
        const trayMenu = Menu.buildFromTemplate([
            {label: '显示', click: function() { mainWindow.show(); }},
            {label: '退出', click: function() { mainWindow.destroy(); appIcon.destroy(); }}
        ]);
        appIcon.setContextMenu(trayMenu);
    }
    app.on('ready', function () {
        createWindow();
        createTray();
    });

    app.on('window-all-closed', function () {
        if (appIcon) appIcon.destroy();
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', function () {
        if (mainWindow === null) {
            createWindow();
        }
    });

}

initialize();


