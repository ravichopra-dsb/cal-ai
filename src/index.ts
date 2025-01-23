import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { createGoogleEvent, main } from './functions.js'

const app = new Hono()

app.get('/', async (c) => {
  try{
    await main()
    return c.text('Hello Hono!')
  }catch(err){
    return c.text("error")
  }
})
app.get('/create', async (c) => {
  try{
    await createGoogleEvent()
    return c.text('Hello Hono!')
  }catch(err){
    return c.text("error")
  }
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
