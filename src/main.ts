// JS Paint EXT extension

// Entry type
interface Entry {
  window: ext.windows.Window;
  tab: ext.tabs.Tab;
  websession: ext.websessions.Websession;
  webview: ext.webviews.Webview;
  webviewHeader: ext.webviews.Webview;
  partition: number;
}

// Global resources
const entries: Entry[] = [];

// Extension clicked
ext.runtime.onExtensionClick.addListener(async () => {
  try {
    // Get websession partition
    let partition = 1;
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].partition == partition) {
        partition++;
        i = 0;
      }
    }

    // Create window
    const window = await ext.windows.create({
      title: "untitled - JS Paint #" + partition,
      icon: "icon-128.png",
      titleBarStyle: "hidden",
      fullscreenable: false,
      roundedCorners: false,
      vibrancy: false,
      frame: false,
      minimizable: true,
      maximizable: true,
    });

    // Create tab
    const tab = await ext.tabs.create({
      icon: "icons/icon-128.png",
      icon_dark: "icons/icon-128-dark.png",
      text: "untitled - JS Paint #" + partition,
      mutable: false,
      closable: true,
    });

    // Create websession
    const websession = await ext.websessions.create({
      partition: partition.toString(),
      persistent: true,
      global: false,
    });

    // Create webviews
    const size = await ext.windows.getContentSize(window.id);

    // Load Header content
    const webviewHeader = await ext.webviews.create({ websession: websession });
    await ext.webviews.attach(webviewHeader.id, window.id);
    await ext.webviews.loadFile(webviewHeader.id, "header.html");
    await ext.webviews.setBounds(webviewHeader.id, {
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
    });
    await ext.webviews.setAutoResize(webviewHeader.id, {
      width: true,
      height: true,
    });

    // Load JS Paint content
    const webview = await ext.webviews.create({ websession: websession });
    await ext.webviews.attach(webview.id, window.id);
    await ext.webviews.loadFile(webview.id, "extension-jspaint-src/index.html");
    await ext.webviews.setBounds(webview.id, {
      x: 4,
      y: 21,
      width: size.width - 8,
      height: size.height - 25,
    });
    await ext.webviews.setAutoResize(webview.id, { width: true, height: true });

    // Open devtools
    // await ext.webviews.openDevTools(webviewHeader.id, { mode: 'detach' })
    // await ext.webviews.openDevTools(webview.id, { mode: 'detach' })

    // Save entry
    entries.push({
      window: window,
      tab: tab,
      websession: websession,
      webview: webview,
      webviewHeader: webviewHeader,
      partition: partition,
    });
  } catch (error) {
    // Print error
    console.error("ext.runtime.onExtensionClick", JSON.stringify(error));
  }
});

// Run on page load
ext.webviews.onDomReady.addListener(async (event) => {
  try {
    const entry = getEntryFromWebviewId(event.id, false);
    if (entry === null) return;
    const title = await ext.webviews.getTitle(entry.webview.id);
    const formattedTitle = title.replace(
      new RegExp(" - Paint$"),
      " - JS Paint #" + entry.partition,
    );
    await ext.runtime.sendMessage({
      type: "title",
      title: formattedTitle,
      id: entry.websession.id,
    });
  } catch (error) {
    // Print error
    console.error("ext.webviews.onDomReady", JSON.stringify(error));
  }
});

// Sync tab tiltes and header
ext.webviews.onPageTitleUpdated.addListener(async (event, details) => {
  try {
    const entry = getEntryFromWebviewId(event.id, false);
    if (entry === null) return;
    const title = details.title.replace(
      new RegExp(" - Paint$"),
      " - JS Paint #" + entry.partition,
    );
    await ext.runtime.sendMessage({
      type: "title",
      title: title,
      id: entry.websession.id,
    });
    await ext.tabs.update(entry.tab.id, { text: title });
    await ext.windows.update(entry.window.id, { title: title });
  } catch (error) {
    // Print error
    console.error("ext.webviews.onPageTitleUpdated", JSON.stringify(error));
  }
});

// Get and optionally remove entry from tab id
function getEntryFromTabId(id: string, remove: boolean): Entry | null {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.tab.id == id) {
      if (remove) entries.splice(i, 1);
      return entry;
    }
  }
  return null;
}

// Get and optionally remove entry from tab id
function getEntryFromWebviewId(id: string, remove: boolean): Entry | null {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.webview.id == id) {
      if (remove) entries.splice(i, 1);
      return entry;
    }
  }
  return null;
}

// Get and optionally remove entry from window id
function getEntryFromWindowId(id: string, remove: boolean): Entry | null {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.window.id == id) {
      if (remove) entries.splice(i, 1);
      return entry;
    }
  }
  return null;
}

// Remove entry objects
async function removeEntry(entry: Entry): Promise<void> {
  await ext.windows.remove(entry.window.id);
  await ext.tabs.remove(entry.tab.id);
  await ext.websessions.remove(entry.websession.id);
  await ext.webviews.remove(entry.webview.id);
  await ext.webviews.remove(entry.webviewHeader.id);
}

// Tab was removed by another extension
ext.tabs.onRemoved.addListener(async (event) => {
  try {
    // Find and remove entry
    const entry = getEntryFromTabId(event.id, true);
    if (entry !== null) await removeEntry(entry);
  } catch (error) {
    // Print error
    console.error("ext.tabs.onRemoved", JSON.stringify(error));
  }
});

// Tab was removed by another extension
ext.tabs.onRemoved.addListener(async (event) => {
  try {
    // Find and remove entry
    const entry = getEntryFromTabId(event.id, true);
    if (entry !== null) await removeEntry(entry);
  } catch (error) {
    // Print error
    console.error("ext.tabs.onRemoved", JSON.stringify(error));
  }
});

// Tab was clicked
ext.tabs.onClicked.addListener(async (event) => {
  try {
    // Remove entry
    const entry = getEntryFromTabId(event.id, false);
    if (entry === null) return;

    // Restore and focus window
    await ext.windows.restore(entry.window.id);
    await ext.windows.focus(entry.window.id);
  } catch (error) {
    // Print error
    console.error("ext.tabs.onClicked", JSON.stringify(error));
  }
});

// Tab was closed
ext.tabs.onClickedClose.addListener(async (event) => {
  try {
    // Remove entry
    const entry = getEntryFromTabId(event.id, true);
    if (entry !== null) await removeEntry(entry);
  } catch (error) {
    // Print error
    console.error("ext.tabs.onClickedClose", JSON.stringify(error));
  }
});

// Window was removed by another extension
ext.windows.onRemoved.addListener(async (event) => {
  try {
    // Remove entry
    const entry = getEntryFromWindowId(event.id, true);
    if (entry !== null) await removeEntry(entry);
  } catch (error) {
    // Print error
    console.error("ext.windows.onRemoved", JSON.stringify(error));
  }
});

// Window was closed
ext.windows.onClosed.addListener(async (event) => {
  try {
    // Remove entry
    const entry = getEntryFromWindowId(event.id, true);
    if (entry !== null) await removeEntry(entry);
  } catch (error) {
    // Print error
    console.error("ext.windows.onClosed", JSON.stringify(error));
  }
});
