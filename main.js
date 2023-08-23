// JS Paint EXT extension

// Global resources
let entries = []

// Extension clicked
ext.runtime.onExtensionClick.addListener(async () => {
  try {
    // Get websession partition
    let partition = 1
    for (let i = 0; i < entries.length; i++) {
      if (entries[i][5] == partition) {
        partition++
        i = 0
      }
    }

    // Create window
    const window = await ext.windows.create({
      title: 'untitled - JS Paint #' + partition,
      icon: 'icon-128.png',
      titleBarStyle: 'inset',
      fullscreenable: true,
      roundedCorners: false,
      vibrancy: false,
      frame: false,
      minimizable: true,
      maximizable: true,
      fullscreenable: false,
    })

    // Create tab
    const tab = await ext.tabs.create({
      icon: 'icon-128.png',
      text: 'untitled - JS Paint #' + partition,
      mutable: false,
      closable: true,
    })

    // Create websession
    const websession = await ext.websessions.create({
      partition: partition.toString(),
      persistent: true,
      global: false,
    })

    // Create webviews
    const size = await ext.windows.getContentSize(window.id)
    // Load Header content
    const webviewHeader = await ext.webviews.create({ websession: websession })
    await ext.webviews.attach(webviewHeader.id, window.id)
    await ext.webviews.loadFile(webviewHeader.id, 'header.html')
    await ext.webviews.setBounds(webviewHeader.id, { x: 0, y: 0, width: size.width, height: size.height })
    await ext.webviews.setAutoResize(webviewHeader.id, { width: true, height: false })
    // Load JS Paint content
    const webview = await ext.webviews.create({ websession: websession })
    await ext.webviews.attach(webview.id, window.id)
    await ext.webviews.loadFile(webview.id, 'jspaint/index.html')
    await ext.webviews.setBounds(webview.id, { x: 4, y: 21, width: size.width - 8, height: size.height - 25 })
    await ext.webviews.setAutoResize(webview.id, { width: true, height: true })
    // Open devtools
    // await ext.webviews.openDevTools(webviewHeader.id, { mode: 'detach' })
    // await ext.webviews.openDevTools(webview.id, { mode: 'detach' })

    // Save entry
    entries.push([window, tab, websession, webview, webviewHeader, partition])
  } catch (error) {

    // Print error
    console.error('ext.runtime.onExtensionClick', JSON.stringify(error))

  }
})

// Get and optionally remove entry from tab id
function getEntryFromTabId(id, remove) {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    if (entry[1].id == id) {
      if (remove) entries.splice(i, 1)
      return entry
    }
  }
  return null
}

// Get and optionally remove entry from window id
function getEntryFromWindowId(id, remove) {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]
    if (entry[0].id == id) {
      if (remove) entries.splice(i, 1)
      return entry
    }
  }
  return null
}

// Tab was removed by another extension
ext.tabs.onRemoved.addListener(async (event) => {
  try {
    // Remove entry
    const entry = getEntryFromTabId(event.id, true)
    if (entry === null) return
    // Remove objects
    await ext.windows.remove(entry[0].id)
    await ext.websessions.remove(entry[2].id)
    await ext.webviews.remove(entry[3].id)
    await ext.webviews.remove(entry[4].id)
  } catch (error) {
    // Print error
    console.error('ext.tabs.onRemoved', JSON.stringify(error))
  }
})

// Tab was clicked
ext.tabs.onClicked.addListener(async (event) => {
  try {
    // Remove entry
    const entry = getEntryFromTabId(event.id, false)
    if (entry === null) return
    // Restore window
    await ext.windows.restore(entry[0].id)
    // Focus window
    await ext.windows.focus(entry[0].id)
  } catch (error) {
    // Print error
    console.error('ext.tabs.onClicked', JSON.stringify(error))
  }
})

// Tab was closed
ext.tabs.onClickedClose.addListener(async (event) => {
  try {
    // Remove entry
    const entry = getEntryFromTabId(event.id, true)
    if (entry === null) return
    // Remove objects
    await ext.windows.remove(entry[0].id)
    await ext.tabs.remove(entry[1].id)
    await ext.websessions.remove(entry[2].id)
    await ext.webviews.remove(entry[3].id)
    await ext.webviews.remove(entry[4].id)
  } catch (error) {
    // Print error
    console.error('ext.tabs.onClickedClose', JSON.stringify(error))
  }
})

// Window was removed by another extension
ext.windows.onRemoved.addListener(async (event) => {
  try {
    // Remove entry
    const entry = getEntryFromWindowId(event.id, true)
    if (entry === null) return
    // Remove objects
    await ext.tabs.remove(entry[1].id)
    await ext.websessions.remove(entry[2].id)
    await ext.webviews.remove(entry[3].id)
    await ext.webviews.remove(entry[4].id)
  } catch (error) {
    // Print error
    console.error('ext.windows.onRemoved', JSON.stringify(error))
  }
})

// Window was closed
ext.windows.onClosed.addListener(async (event) => {
  try {
    // Remove entry
    const entry = getEntryFromWindowId(event.id, true)
    if (entry === null) return
    // Remove objects
    await ext.tabs.remove(entry[1].id)
    await ext.websessions.remove(entry[2].id)
    await ext.webviews.remove(entry[3].id)
    await ext.webviews.remove(entry[4].id)
  } catch (error) {
    // Print error
    console.error('ext.windows.onClosed', JSON.stringify(error))
  }
})
