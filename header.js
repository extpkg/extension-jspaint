window.addEventListener('DOMContentLoaded', async () => {
    const webview = await ext.webviews.getCurrent();
    const window = await ext.webviews.getAttachedWindow(webview.id);
    console.log('window', window);
    const isFocused = await ext.windows.isFocused(window.id);
    if (isFocused) {
        document.getElementsByClassName('window')[0].classList.add('focused');
    }
    ext.windows.onFocused.addListener(async (event) => {
        if (window.id !== event.id) return;
        document.getElementsByClassName('window')[0].classList.add('focused');
    });

    ext.windows.onUnfocused.addListener(async (event) => {
        if (window.id !== event.id) return;
        document.getElementsByClassName('window')[0].classList.remove('focused');
    });
});

async function clickClose() {
    try {
        const webview = await ext.webviews.getCurrent();
        const window = await ext.webviews.getAttachedWindow(webview.id);
        await ext.windows.remove(window.id);
    } catch (error) {
        console.error(error);
    }
}

async function clickMaximize() {
    try {
        const webview = await ext.webviews.getCurrent();
        const window = await ext.webviews.getAttachedWindow(webview.id);
        const isMaximized = await ext.windows.isMaximized(window.id);
        if (isMaximized) {
            await ext.windows.unmaximize(window.id);
            return;
        }
        await ext.windows.maximize(window.id);
    } catch (error) {
        console.error(error);
    }
}

async function clickMinimize() {
    try {
        const webview = await ext.webviews.getCurrent();
        const window = await ext.webviews.getAttachedWindow(webview.id);
        await ext.windows.minimize(window.id);
    } catch (error) {
        console.error(error);
    }
}

