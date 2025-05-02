// Augment the global Window interface
declare global {
  interface Window {
    MSStream?: unknown
  }
}

export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
}

export const setViewportForIOS = () => {
  const viewportMeta = document.querySelector('meta[name="viewport"]')
  if (isIOS()) {
    viewportMeta?.setAttribute(
      'content',
      'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
    )
  } else {
    viewportMeta?.setAttribute('content', 'width=device-width, initial-scale=1')
  }
}
