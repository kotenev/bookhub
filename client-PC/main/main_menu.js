import {
  Menu,
  app,
} from 'electron';

function createMainMenu(
  switchToAddBooks,
  switchToPreferences,
  switchToSearchBooks,
  switchToRecentlyReads,
) {
  const mainMenuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Add Books',
          accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
          click() {
            switchToAddBooks();
          },
        },
        {
          label: 'Search Books',
          accelerator: process.platform === 'darwin' ? 'Command+l' : 'Ctrl+l',
          click() {
            switchToSearchBooks();
          },
        },
        {
          label: 'Recently Read',
          accelerator: process.platform === 'darwin' ? 'Command+h' : 'Ctrl+h',
          click() {
            switchToRecentlyReads();
          },
        },
        {
          label: 'Preferences',
          accelerator: process.platform === 'darwin' ? 'Command+,' : 'Ctrl+,',
          click() {
            switchToPreferences();
          },
        },
        {
          label: 'Close Current Window',
          accelerator: process.platform === 'darwin' ? 'Command+W' : 'Ctrl+W',
          click(item, focusedWindow) {
            focusedWindow.close();
          },
        },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
          click() {
            app.quit();
          },
        },
      ],
    },
  ];

  // if Mac, add empty object to menu
  if (process.platform === 'darwin') {
    mainMenuTemplate.unshift({});
  }

  // Add developer tools if not in prod
  if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
      label: 'Developer Tools',
      submenu: [
        {
          label: 'Toggle DevTools',
          accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
          click(item, focusedWindow) {
            focusedWindow.toggleDevTools();
          },
        },
        {
          role: 'reload',
        },
      ],
    });
  }

  return Menu.buildFromTemplate(mainMenuTemplate);
}

export default createMainMenu;
