import { defineField, defineType } from 'sanity'

export const partner = defineType({
    name: 'partner',
    title: 'Asociados / Partners',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Nombre de la Empresa',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'logo',
            title: 'Logo de la Empresa',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description_es',
            title: 'Descripción (Español)',
            type: 'text',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description_en',
            title: 'Descripción (Inglés)',
            type: 'text',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'description_fr',
            title: 'Descripción (Francés)',
            type: 'text',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'website_url',
            title: 'Enlace al Sitio Web (URL)',
            type: 'url',
            validation: (Rule) => Rule.required().uri({
                scheme: ['http', 'https']
            }),
        }),
        defineField({
            name: 'order',
            title: 'Orden de Visualización',
            type: 'number',
            description: 'Número para ordenar los partners (ej. 1, 2, 3). Menor número aparece primero.',
            initialValue: 99,
        })
    ],
    preview: {
        select: {
            title: 'name',
            media: 'logo',
            subtitle: 'website_url'
        },
    },
})
