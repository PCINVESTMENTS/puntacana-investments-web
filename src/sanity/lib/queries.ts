import { defineQuery } from "next-sanity";

export const PROPERTIES_QUERY = defineQuery(`
  *[_type == "property" && !(_id in path("drafts.**")) && status != "draft"] {
    _id,
    id,
    title,
    slug,
    locationLabel,
    type,
    status,
    price,
    mainImage,
    beds,
    baths,
    area
  }
`);

export const HOME_PAGE_PROPERTIES_QUERY = defineQuery(`
  *[_type == "property" && !(_id in path("drafts.**")) && status != "draft"] {
    _id,
    id,
    title,
    slug,
    locationLabel,
    type,
    status,
    price,
    mainImage,
    beds,
    baths,
    area,
    descriptionEn,
    descriptionEs,
    featured
  }
`);

export const PROPERTY_BY_ID_QUERY = defineQuery(`
  *[_type == "property" && id == $id][0] {
    _id,
    id,
    title,
    slug,
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
    descriptionEn,
    descriptionEs,
    videoUrl,
    virtualTourUrl,
    coordinates,
    constructionStages,
    featured,
    seo
  }
`);

export const PROPERTY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "property" && slug.current == $slug][0] {
    _id,
    id,
    title,
    slug,
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
    descriptionEn,
    descriptionEs,
    videoUrl,
    virtualTourUrl,
    coordinates,
    constructionStages,
    featured,
    seo
  }
`);

export const POSTS_QUERY = defineQuery(`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
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
    slug,
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
