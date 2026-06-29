export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export const resizeImage = (base64, maxWidth = 400, maxHeight = 200) =>
  new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let { width, height } = img
      if (width > maxWidth) { height = (height * maxWidth) / width; width = maxWidth }
      if (height > maxHeight) { width = (width * maxHeight) / height; height = maxHeight }
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/png'))
    }
    img.src = base64
  })
