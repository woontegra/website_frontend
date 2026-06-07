type StaticImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  alt: string
}

/** Bundle asset görseli — skeleton/API yok, anında render. */
export function StaticImage({ src, alt, className = '', ...props }: StaticImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="eager"
      decoding="sync"
      {...props}
    />
  )
}
