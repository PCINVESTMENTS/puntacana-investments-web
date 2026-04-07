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
    // If it's already an absolute URL or a local static path, bypass the sanity image builder
    if (src.startsWith('http') || src.startsWith('/')) {
        return src;
    }
    try {
        return imageBuilder.image(src).width(width).auto('format').quality(quality || 75).url();
    } catch (e) {
        return src; // Fallback to raw string if sanity builder fails
    }
}
