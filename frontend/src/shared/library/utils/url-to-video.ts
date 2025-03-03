export const urlToVideoFile = async (videoUrl: string): Promise<File> => {
  try {
    const response = await fetch(videoUrl, { mode: 'cors' })
    if (!response.ok) throw new Error('Failed to fetch video')

    const blob = await response.blob()
    const fileType = blob.type || 'video/mp4' // Defaulting to MP4 if type is missing

    return new File([blob], 'video.mp4', {
      type: fileType,
      lastModified: Date.now(),
    })
  } catch (error) {
    throw new Error(`Error converting video: ${error}`)
  }
}
