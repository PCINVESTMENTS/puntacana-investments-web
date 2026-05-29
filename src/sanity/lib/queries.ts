/** Revision: 2024-02-17-02 */
import { defineQuery } from "next-sanity";

export const PROPERTIES_QUERY = defineQuery(`
  *[_type == "property" && !(_id in path("drafts.**")) && status != "draft"] {
    _id,
    id,
    title,
    titleEn,
    titleEs,
    "slug": slug.current,
    locationLabel,
    type,
    status,
    price,
    mainImage,
    imageUrl,
    galleryUrls,
    beds,
    baths,
    area,
    is_rental_active,
    rental_price,
    preLaunch,
    preConstruction,
    isResale
  }
`);

export const HOME_PAGE_PROPERTIES_QUERY = defineQuery(`
  *[_type == "property" && !(_id in path("drafts.**")) && status != "draft"] {
    _id,
    id,
    title,
    titleEn,
    titleEs,
    "slug": slug.current,
    locationLabel,
    type,
    status,
    price,
    mainImage,
    imageUrl,
    galleryUrls,
    beds,
    baths,
    area,
    descriptionEn,
    descriptionEs,
    descriptionFr,
    featured,
    is_rental_active,
    rental_price,
    preLaunch,
    preConstruction,
    isResale
  }
`);

export const PROPERTY_BY_ID_QUERY = defineQuery(`
  *[_type == "property" && id == $id][0] {
    _id,
    id,
    title,
    titleEn,
    titleEs,
    "slug": slug.current,
    location,
    locationLabel,
    type,
    status,
    price,
    completionPercent,
    mainImage,
    imageUrl,
    gallery,
    galleryUrls,
    beds,
    baths,
    area,
    featuresEn,
    featuresEs,
    featuresFr,
    descriptionEn,
    descriptionEs,
    descriptionFr,
    videoUrl,
    virtualTourUrl,
    coordinates,
    constructionStages,
    featured,
    seo,
    is_rental_active,
    rental_price,
    preLaunch,
    preConstruction,
    isResale
  }
`);

export const PROPERTY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "property" && slug.current == $slug][0] {
    _id,
    id,
    title,
    titleEn,
    titleEs,
    "slug": slug.current,
    location,
    locationLabel,
    type,
    status,
    price,
    completionPercent,
    mainImage,
    imageUrl,
    gallery,
    galleryUrls,
    beds,
    baths,
    area,
    featuresEn,
    featuresEs,
    featuresFr,
    descriptionEn,
    descriptionEs,
    descriptionFr,
    videoUrl,
    virtualTourUrl,
    coordinates,
    constructionStages,
    featured,
    seo,
    is_rental_active,
    rental_price,
    preLaunch,
    preConstruction,
    isResale
  }
`);

export const POSTS_QUERY = defineQuery(`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    imageUrl, // Fallback
    excerptEn,
    excerptEs,
    author,
    readTime,
    category
  }
`);

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    imageUrl, // Fallback
    excerptEn,
    excerptEs,
    contentEn,
    contentEs,
    author,
    readTime,
    authorRole,
    authorBio,
    authorImage,
    category,
    seo
  }
`);
