/// <reference lib="dom" />

const test = () => {
  console.log('header-overlay.js LOADED')
}

test()

const _overlay = window as any

_overlay.clickMaximize = async () => {
  console.log('clickMaximize')
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