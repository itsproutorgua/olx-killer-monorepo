export function linkifyText(text: string) {
  const urlRegex = /((https?:\/\/[^\s]+))/g
  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          className='break-words underline'
          target='_blank'
          rel='noopener noreferrer'
        >
          {part}
        </a>
      )
    }
    return part
  })
}
