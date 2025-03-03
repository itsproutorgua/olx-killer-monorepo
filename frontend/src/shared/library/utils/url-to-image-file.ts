export const urlToFile = (imageUrl: string, index: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)

      canvas.toBlob(blob => {
        if (!blob) return reject(new Error('Canvas conversion failed'))

        const file = new File([blob], `image_${index}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        })
        resolve(file)
      }, 'image/jpeg')
    }

    img.onerror = err => reject(err)
    img.src = imageUrl

    // Force URL reload for CORS
    if (img.src.indexOf('?') > -1) {
      img.src += '&' + Date.now()
    } else {
      img.src += '?' + Date.now()
    }
  })
}
