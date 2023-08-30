/// <reference lib="dom" />

const _global = window as any

window.addEventListener('DOMContentLoaded', async (): Promise<void> => {
  const webview = await ext.webviews.getCurrent()
  const extwindow = await ext.webviews.getAttachedWindow(webview.id)
  if (extwindow === null) return
  const isFocused: boolean = await ext.windows.isFocused(extwindow.id)
  if (isFocused) {
    document.getElementsByClassName('window')[0].classList.add('focused')
  }
  ext.windows.onFocused.addListener(async (event: ext.windows.WindowEvent): Promise<void> => {
    if (extwindow?.id !== event.id) return
    document.getElementsByClassName('window')[0].classList.add('focused')
  })

  ext.windows.onUnfocused.addListener(async (event: ext.windows.WindowEvent): Promise<void> => {
    if (extwindow?.id !== event.id) return
    document.getElementsByClassName('window')[0].classList.remove('focused')
  })

  ext.runtime.onMessage.addListener(async (_event, message) => {
    if (message.type === 'title') {
      if (message.id !== webview.websession?.id) return
      document.getElementsByClassName('window-title')[0].innerHTML = message.title
    } else if (message.type === 'theme') {
      const themeElement = document.getElementById('stylesheet-theme')
      if (themeElement === null) return
      if (message.id !== webview.websession?.id) return
      themeElement.setAttribute('href', 'styles/header-theme-' + message.theme)
    }
  })
  await ext.runtime.sendMessage({ type: 'header' })
})

_global.clickClose = async () => {
  try {
    const webview = await ext.webviews.getCurrent()
    const extwindow = await ext.webviews.getAttachedWindow(webview.id)
    if (extwindow === null) return
    await ext.windows.remove(extwindow.id)
  } catch (error) {
    console.error(error)
  }
}

_global.clickMaximize = async () => {
  try {
    const webview = await ext.webviews.getCurrent()
    const extwindow = await ext.webviews.getAttachedWindow(webview.id)
    if (extwindow === null) return
    const isMaximized: boolean = await ext.windows.isMaximized(extwindow.id)
    if (isMaximized) {
      if (extwindow === null) return
      await ext.windows.unmaximize(extwindow.id)
      document.getElementsByClassName('window-action-restore')[0].classList.add('window-action-maximize')
      document.getElementsByClassName('window-action-restore')[0].classList.remove('window-action-restore')
      return
    }
    if (extwindow === null) return
    await ext.windows.maximize(extwindow.id)
    document.getElementsByClassName('window-action-maximize')[0].classList.add('window-action-restore')
    document.getElementsByClassName('window-action-maximize')[0].classList.remove('window-action-maximize')
  } catch (error) {
    console.error(error)
  }
}

_global.clickMinimize = async () => {
  try {
    const webview = await ext.webviews.getCurrent()
    const extwindow = await ext.webviews.getAttachedWindow(webview.id)
    if (extwindow === null) return
    await ext.windows.minimize(extwindow.id)
  } catch (error) {
    console.error(error)
  }
}
