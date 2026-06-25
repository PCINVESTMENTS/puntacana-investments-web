import { createClient } from 'next-sanity'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
})

async function run() {
  try {
    const query = `*[_type == "property" && slug.current == "the-beach-punta-cana-city-place"]`
    const props = await client.fetch(query)
    if (props.length > 0) {
      console.log("Found property:", props[0]._id, props[0].videoUrl)
      await client.patch(props[0]._id).set({ videoUrl: "" }).commit()
      console.log("Video URL cleared!")
    } else {
      console.log("Property not found. Trying apartamentos-the-beach-punta-cana")
      const q2 = `*[_type == "property" && slug.current == "apartamentos-the-beach-punta-cana"]`
      const p2 = await client.fetch(q2)
      if (p2.length > 0) {
        console.log("Found property:", p2[0]._id, p2[0].videoUrl)
        await client.patch(p2[0]._id).set({ videoUrl: "" }).commit()
        console.log("Video URL cleared!")
      } else {
        console.log("Still not found.")
      }
    }
  } catch (err) {
    console.error(err)
  }
}
run()
