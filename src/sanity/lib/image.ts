import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from '../env'

const imageBuilder = createImageUrlBuilder({
    projectId: projectId || '',
    dataset: dataset || '',
})

export const urlFor = (source: any) => {
    return imageBuilder.image(source).auto('format').quality(75)
}

export const sanityLoader = ({ src, width, quality }: { src: string, width: number, quality?: number }) => {
    return imageBuilder.image(src).width(width).auto('format').quality(quality || 75).url();
}
