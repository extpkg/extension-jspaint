/// <reference lib="dom" />

interface FocusEvent {
    id: string;
}

window.addEventListener('DOMContentLoaded', async (): Promise<void> => {
  const webview = await ext.webviews.getCurrent()
  const extwindow = await ext.webviews.getAttachedWindow(webview.id)
  if (extwindow === null) return
  const isFocused: boolean = await ext.windows.isFocused(extwindow.id)
  if (isFocused) {
    document.getElementsByClassName('window')[0].classList.add('focused')
  }
  ext.windows.onFocused.addListener(async (event: FocusEvent): Promise<void> => {
    if (extwindow?.id !== event.id) return
    document.getElementsByClassName('window')[0].classList.add('focused')
  })

  ext.windows.onUnfocused.addListener(async (event: FocusEvent): Promise<void> => {
    if (extwindow?.id !== event.id) return
    document.getElementsByClassName('window')[0].classList.remove('focused')
  })
})

export async function clickClose(): Promise<void> {
  try {
    const webview = await ext.webviews.getCurrent()
    const extwindow = await ext.webviews.getAttachedWindow(webview.id)
    if (extwindow === null) return
    await ext.windows.remove(extwindow.id)
  } catch (error) {
    console.error(error)
  }
}

export async function clickMaximize(): Promise<void> {
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

export async function clickMinimize(): Promise<void> {
  try {
    const webview = await ext.webviews.getCurrent()
    const extwindow = await ext.webviews.getAttachedWindow(webview.id)
    if (extwindow === null) return
    await ext.windows.minimize(extwindow.id)
  } catch (error) {
    console.error(error)
  }
}
