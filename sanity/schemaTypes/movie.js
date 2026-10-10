import {defineType, defineField} from 'sanity';

export default defineType({
    name: 'movie',
    title: 'Movies & TV Shows',
    type: 'document',

    fields: [
        defineField({
            name: 'name',
            title: 'Movie/TV Show Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'contentType',
            title: 'Content Type',
            type: 'string',
            options: {
                list: [
                    {title: 'Movie', value: 'movie'},
                    {title: 'TV Show', value: 'series'},
                ],
                layout: 'radio',
            },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
                options: {
                    source: 'name',
                    maxLenght: 96,
                },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'summary',
            title: 'Summary',
            type: 'text',
            rows: 4,
            validation: (Rule) => Rule.required(),
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
            name: 'year',
            title: 'Release Year',
            type: 'number',
            validation: (Rule) => Rule.required().integer().min(1888),
        }),

        defineField({
            name: 'runtime',
            title: 'Runtime (minutes)',
            type: 'number',
            hidden: ({document}) => document?.contentType !== 'movie',
            validation: (Rule) =>
                Rule.integer().positive().custom((value, context) => {
                if (context.document?.contentType === 'movie' && value == null) {
                    return 'Runtime is required for movies'
                }
                return true
                }),
        }),

        defineField({
            name: 'episodes',
            title: 'Number of Episodes',
            type: 'number',
            hidden: ({document}) => document?.contentType !== 'series',
            validation: (Rule) =>
                Rule.integer().positive().custom((value, context) => {
                if (context.document?.contentType === 'series' && value == null) {
                    return 'Number of episodes is required for TV shows'
                }
                return true
                }),
        }),

        defineField({
            name: 'imdbRating',
            title: 'IMDb Rating',
            type: 'number',
            validation: (Rule) =>
                Rule.required().min(0).max(10).precision(1),
        }),

        defineField({
            name: 'trending',
            title: 'Trending',
            type: 'boolean',
            initialValue: false,
        }),

        defineField({
            name: 'hot',
            title: 'Featured Hot',
            type: 'boolean',
            initialValue: false,
        }),

        defineField({
            name: 'heroImage',
            title: 'Hero Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'trailerUrl',
            title: 'YouTube Trailer URL',
            type: 'url',
            validation: (Rule) =>
                Rule.required().uri({
                scheme: ['http', 'https'],
                }),
        }),

        defineField({
            name: 'paragraphOne',
            title: 'Paragraph One',
            type: 'text',
            rows: 5,
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'paragraphTwo',
            title: 'Paragraph Two',
            type: 'text',
            rows: 5,
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'paragraphThree',
            title: 'Paragraph Three',
            type: 'text',
            rows: 5,
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'credits',
            title: 'Credits',
            type: 'object',
            fields: [
                defineField({
                name: 'directors',
                title: 'Directors',
                type: 'string',
                validation: (Rule) => Rule.required(),
                }),
                defineField({
                name: 'writers',
                title: 'Writers',
                type: 'string',
                validation: (Rule) => Rule.required(),
                }),
                defineField({
                name: 'stars',
                title: 'Stars',
                type: 'string',
                validation: (Rule) => Rule.required(),
                }),
            ],
            validation: (Rule) => Rule.required(),
        }),

    ],
})