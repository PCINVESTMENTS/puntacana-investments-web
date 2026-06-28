import { createImageUrlBuilder } from '@sanity/image-url'
import { dataset, projectId } from '../env'

const imageBuilder = createImageUrlBuilder({
    projectId: projectId || '',
    dataset: dataset || '',
})

export const urlFor = (source: any) => {
    return imageBuilder.image(source).auto('format').quality(75)
}

export const sanityLoader = ({ src, width, quality }: { src: string, width: number, quality?: number }) => {
    // If it's a raw sanity object or reference string
    if (!src.startsWith('http') && !src.startsWith('/')) {
        try {
            return imageBuilder.image(src).width(width).auto('format').quality(quality || 75).url();
        } catch (e) {
            return src;
        }
    }

    // If it's an already resolved Sanity URL or Unsplash URL, append responsive width parameters natively
    if (src.includes('cdn.sanity.io') || src.includes('images.unsplash.com')) {
        try {
            const url = new URL(src);
            url.searchParams.set('w', width.toString());
            url.searchParams.set('auto', 'format');
            url.searchParams.set('q', (quality || 75).toString());
            return url.toString();
        } catch (e) {
            return src;
        }
    }

    // Otherwise, bypass (local files, etc.)
    return src;
}
