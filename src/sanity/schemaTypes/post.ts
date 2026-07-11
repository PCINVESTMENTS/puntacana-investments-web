import { defineField, defineType } from 'sanity'

export const post = defineType({
    name: 'post',
    title: 'Blog Post',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
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
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
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
            name: 'imageUrl',
            title: 'Legacy Image URL (Fallback)',
            type: 'string',
        }),
        defineField({
            name: 'excerptEn',
            title: 'Excerpt (English)',
            type: 'text',
            rows: 3
        }),
        defineField({
            name: 'excerptEs',
            title: 'Excerpt (Spanish)',
            type: 'text',
            rows: 3
        }),
        defineField({
            name: 'contentEn',
            title: 'Content (English)',
            type: 'array',
            of: [
                { type: 'block' },
                { type: 'image' },
                {
                    type: 'object',
                    name: 'legacyImage',
                    title: 'Legacy Image (URL)',
                    fields: [
                        { name: 'url', type: 'string', title: 'Image URL' },
                        { name: 'caption', type: 'string', title: 'Caption' }
                    ]
                }
            ]
        }),
        defineField({
            name: 'contentEs',
            title: 'Content (Spanish)',
            type: 'array',
            of: [
                { type: 'block' },
                { type: 'image' },
                {
                    type: 'object',
                    name: 'legacyImage',
                    title: 'Legacy Image (URL)',
                    fields: [
                        { name: 'url', type: 'string', title: 'Image URL' },
                        { name: 'caption', type: 'string', title: 'Caption' }
                    ]
                }
            ]
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'string'
        }),
        defineField({
            name: 'readTime',
            title: 'Read Time (e.g. 5 min)',
            type: 'string'
        }),
        defineField({
            name: 'seoKeywordsEs',
            title: 'SEO Keywords (Spanish)',
            description: 'Palabras clave separadas por comas. Ej: invertir punta cana, bienes raíces, villas',
            type: 'string',
        }),
        defineField({
            name: 'seoKeywordsEn',
            title: 'SEO Keywords (English)',
            description: 'Comma separated keywords. E.g: invest punta cana, real estate, villas',
            type: 'string',
        }),
        defineField({
            name: 'seoKeywordsFr',
            title: 'SEO Keywords (French)',
            description: 'Mots-clés séparés par des virgules. Ex: investir punta cana, immobilier, villas',
            type: 'string',
        })
    ]
})
