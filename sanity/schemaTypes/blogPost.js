import {defineType, defineField} from 'sanity';

export default defineType({
    name: 'blogPost',
    title: 'Blog Posts',
    type: 'document',

    fields: [


        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
                options: {
                    source: 'title',
                    maxLenght: 96,
                },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'summarySlider',
            title: 'summarySlider',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'readingTime',
            title: 'Reading Time',
            type: 'number',
            validation: (Rule) => Rule.required().integer().positive(),
        }),

        defineField({
            name: 'genres',
            title: 'Genres',
            type: 'array',
            of: [
                {
                type: 'string',
                options: {
                    list: [
                    {title: 'Action', value: 'action'},
                    {title: 'Drama', value: 'drama'}, 
                    {title: 'Horror', value: 'horror'}, 
                    {title: 'Biography', value: 'biography'},  
                    {title: 'Comedy', value: 'comedy'},
                    {title: 'Crime', value: 'crime'},           
                    {title: 'Mystery', value: 'mystery'},
                    {title: 'Romance', value: 'romance'},

                    ],
                },
                },
            ],
            validation: (Rule) => Rule.required().min(1).max(3).unique(),
        }),

        defineField({
            name: 'heroImage',
            title: 'Hero Image Desktop',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'heroImageTablet',
            title: 'Hero Image Tablet',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'heroImageMobile',
            title: 'Hero Image Mobile',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'thumbnailImage',
            title: 'Thumbnail Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'thumbnailImageRelated',
            title: 'Thumbnail Image Related',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'introHeading',
            title: 'Heading',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'introParagraph',
            title: 'Intro Paragraph',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'sectionOneHeadingOne',
            title: 'Section One Heading One',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'sectionOneParagraphOne',
            title: 'Section One Paragraph One',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'sectionOneHeadingTwo',
            title: 'Section One Heading Two',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'sectionOneParagraphTwo',
            title: 'Section One Paragraph Two',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'sectionOneImage',
            title: 'Section One Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'sectionTwoHeadingOne',
            title: 'Section Two Heading One',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'sectionTwoParagraphOne',
            title: 'Section Two Paragraph One',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'sectionTwoHeadingTwo',
            title: 'Section Two Heading Two',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'sectionTwoParagraphTwo',
            title: 'Section Two Paragraph Two',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'sectionTwoImage',
            title: 'Section Two Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'sectionThreeHeadingOne',
            title: 'Section Three Heading One',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'sectionThreeParagraphOne',
            title: 'Section Three Paragraph One',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'sectionThreeHeadingTwo',
            title: 'Section Three Heading Two',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'sectionThreeParagraphTwo',
            title: 'Section Three Paragraph Two',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'sectionThreeImage',
            title: 'Section Three Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),




    ],
})