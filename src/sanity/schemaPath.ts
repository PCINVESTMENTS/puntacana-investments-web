import { type SchemaTypeDefinition } from 'sanity'

import { property } from './schemaTypes/property'
import { post } from './schemaTypes/post'
import { subscriber } from './schemaTypes/subscriber'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [property, post, subscriber],
}
