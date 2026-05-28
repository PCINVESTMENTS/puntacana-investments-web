import { defineField, defineType } from 'sanity'

export const property = defineType({
    name: 'property',
    title: 'Property',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'titleEn',
            title: 'Title (English)',
            type: 'string',
        }),
        defineField({
            name: 'titleEs',
            title: 'Title (Spanish)',
            type: 'string',
        }),
        defineField({
            name: 'id',
            title: 'Legacy ID (Optional)',
            type: 'number',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'location',
            title: 'Location Key (e.g., puntacana)',
            type: 'string',
            options: {
                list: [
                    { title: 'Punta Cana', value: 'puntacana' },
                    { title: 'Cap Cana', value: 'capcana' },
                    { title: 'Bávaro', value: 'bavaro' },
                    { title: 'La Romana', value: 'laromana' },
                    { title: 'Casa de Campo', value: 'casacampo' },
                    { title: 'Miches', value: 'miches' },
                ]
            }
        }),
        defineField({
            name: 'locationLabel',
            title: 'Location Label',
            type: 'string',
        }),
        defineField({
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Condo', value: 'condo' },
                    { title: 'Villa', value: 'villa' },
                    { title: 'Penthouse', value: 'penthouse' },
                    { title: 'Townhouse', value: 'townhouse' },
                    { title: 'Land', value: 'land' },
                    { title: 'Commercial', value: 'commercial' },
                    { title: 'Resorts', value: 'resorts' },
                    { title: 'Condo Hotel', value: 'condohotel' },
                ]
            }
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'For Sale', value: 'sale' },
                    { title: 'For Rent', value: 'rent' },
                ]
            }
        }),
        defineField({
            name: 'price',
            title: 'Price',
            type: 'number',
        }),
        defineField({
            name: 'completionPercent',
            title: 'Completion Percent',
            type: 'number',
        }),
        defineField({
            name: 'mainImage',
            title: 'Main Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'gallery',
            title: 'Gallery',
            type: 'array',
            of: [{ type: 'image' }]
        }),
        defineField({
            name: 'beds',
            title: 'Beds',
            type: 'number',
        }),
        defineField({
            name: 'baths',
            title: 'Baths',
            type: 'number',
        }),
        defineField({
            name: 'area',
            title: 'Area (m²)',
            type: 'number',
        }),
        defineField({
            name: 'featuresEn',
            title: 'Features (English)',
            type: 'array',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'featuresEs',
            title: 'Features (Spanish)',
            type: 'array',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'descriptionEn',
            title: 'Description (English)',
            type: 'text',
            rows: 4
        }),
        defineField({
            name: 'descriptionEs',
            title: 'Description (Spanish)',
            type: 'text',
            rows: 4
        }),
        defineField({
            name: 'videoUrl',
            title: 'Video URL',
            type: 'url',
        }),
        defineField({
            name: 'virtualTourUrl',
            title: 'Virtual Tour URL',
            type: 'url',
        }),
        defineField({
            name: 'coordinates',
            title: 'Coordinates',
            type: 'object',
            fields: [
                defineField({ name: 'lat', title: 'Latitude', type: 'number' }),
                defineField({ name: 'lng', title: 'Longitude', type: 'number' })
            ]
        }),
        defineField({
            name: 'constructionStages',
            title: 'Construction Stages',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    defineField({ name: 'date', title: 'Date', type: 'string' }),
                    defineField({ name: 'titleEn', title: 'Title (EN)', type: 'string' }),
                    defineField({ name: 'titleEs', title: 'Title (ES)', type: 'string' }),
                    defineField({ name: 'descriptionEn', title: 'Description (EN)', type: 'string' }),
                    defineField({ name: 'descriptionEs', title: 'Description (ES)', type: 'string' }),
                    defineField({ name: 'status', title: 'Status', type: 'string', options: { list: ['completed', 'in-progress', 'pending'] } }),
                ]
            }]
        }),
        defineField({
            name: 'featured',
            title: 'Featured Property',
            type: 'boolean'
        }),
        defineField({
            name: 'imageUrl',
            title: 'Legacy Image URL (Fallback)',
            type: 'string',
        }),
        defineField({
            name: 'galleryUrls',
            title: 'Legacy Gallery URLs (Fallback)',
            type: 'array',
            of: [{ type: 'string' }]
        })
    ]
})
