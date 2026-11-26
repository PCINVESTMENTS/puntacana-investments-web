import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn } from '../env'

const realClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    perspective: 'published',
})

const isLocalSandboxProject =
    projectId === 'local-sandbox' || Boolean(process.env.LOCAL_PROPERTIES_SANDBOX_FILE)

export const client = isLocalSandboxProject
    ? ({
          ...realClient,
          fetch: async () => [],
      } as unknown as typeof realClient)
    : realClient
