import { defineField, defineType } from "sanity";

export const subscriber = defineType({
    name: "subscriber",
    title: "Subscribers",
    type: "document",
    fields: [
        defineField({
            name: "email",
            title: "Email",
            type: "string",
            validation: (Rule) => Rule.required().email(),
        }),
        defineField({
            name: "source",
            title: "Source",
            type: "string",
            initialValue: "Website",
        }),
        defineField({
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Active", value: "active" },
                    { title: "Unsubscribed", value: "unsubscribed" },
                ],
            },
            initialValue: "active",
        }),
        defineField({
            name: "subscribedAt",
            title: "Subscribed At",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
        }),
    ],
    preview: {
        select: {
            title: "email",
            subtitle: "source",
        },
    },
});
