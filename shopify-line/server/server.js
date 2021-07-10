import '@babel/polyfill'
import dotenv from 'dotenv'
import 'isomorphic-fetch'
import createShopifyAuth, { verifyRequest } from '@shopify/koa-shopify-auth'
import Shopify, { ApiVersion } from '@shopify/shopify-api'
import Koa from 'koa'
import next from 'next'
import Router from 'koa-router'

const {
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET,
  SCOPES,
  CLIENT_ID,
  CLIENT_SECRET,
  HOST,
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  PORT,
  NODE_ENV,
} = process.env


const MongoClient = require('mongodb').MongoClient

const Notify_SDK = require('../components/line-notify-sdk')
const sdk = new Notify_SDK(
  CLIENT_ID,
  CLIENT_SECRET,
  HOST + '/cb'
)

dotenv.config()
const port = parseInt(PORT, 10) || 8081
const dev = NODE_ENV !== 'production'
const app = next({
  dev,
})
const handle = app.getRequestHandler()

Shopify.Context.initialize({
  API_KEY: SHOPIFY_API_KEY,
  API_SECRET_KEY: SHOPIFY_API_SECRET,
  SCOPES: SCOPES.split(','),
  HOST_NAME: HOST.replace(/https:\/\//, ''),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
})

const ACTIVE_SHOPIFY_SHOPS = {}

// MongoDB設定
const uri =
  'mongodb+srv://' +
  DB_USER +
  ':' +
  DB_PASSWORD +
  '@' +
  DB_HOST +
  '/' +
  DB_NAME +
  '?retryWrites=true&w=majority'
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.prepare().then(async () => {
  const server = new Koa()
  const router = new Router()
  server.keys = [Shopify.Context.API_SECRET_KEY]
  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        const { shop, accessToken, scope } = ctx.state.shopify
        ACTIVE_SHOPIFY_SHOPS[shop] = scope

        // Webhook登録
        // アプリ削除
        const registrationUninstalled = await Shopify.Webhooks.Registry.register(
          {
            shop,
            accessToken,
            path: '/webhooks',
            topic: 'APP_UNINSTALLED',
            webhookHandler: async (topic, shop, body) => {
              console.log('App uninstalled')
              const obj = JSON.parse(body)
              console.log(obj)
              await store.deleteOne({ domain: shop })
              delete ACTIVE_SHOPIFY_SHOPS[shop]
            },
          }
        )
        if (registrationUninstalled.success) {
          console.log('Successfully registered uninstalled app webhook!')
        } else {
          console.log(
            'Failed to register uninstalled app webhook',
            registrationUninstalled.result
          )
        }

        // 支払い完了
        const registrationOrderPaid = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: '/webhooks',
          topic: 'ORDERS_PAID',
          webhookHandler: (_topic, shop, body) => {
            console.log('received order paid webhook: ')

            // データベースにstore存在確認
            store.findOne({ domain: shop }, function (error, result) {
              if (error) throw error

              const accessToken = result.accessToken
              const obj = JSON.parse(body)
              const order_status_url = obj.order_status_url
              const first_name = obj.customer.first_name
              const last_name = obj.customer.last_name
              let line_items = []
              obj.line_items.forEach(function (item) {
                line_items.push({
                  name: item.name,
                  price: item.price,
                })
              })

              // LINE通知
              sdk
                .notify(
                  accessToken,
                  `\nShopifyから注文がありました。\n注文ページ：${order_status_url}\nお客様名：${last_name} ${first_name}様\n商品名：${line_items[0].name}\n金額：${line_items[0].price}\nご確認をお願いします。`,
                  '',
                  '',
                  446,
                  1993
                )
                .then((body) => {
                  console.log(body)
                })
            })
          },
        })

        if (registrationOrderPaid.success) {
          console.log('Successfully registered Order Paid webhook!')
        } else {
          console.log(
            'Failed to register Order Paid webhook',
            registrationOrderPaid.result
          )
        }

        ctx.redirect(`/?shop=${shop}`)
      },
    })
  )

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
    ctx.res.statusCode = 200
  }

  router.get('/', async (ctx) => {
    const shop = ctx.query.shop

    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`)
    } else {
      await handleRequest(ctx)
    }
  })

  router.get('/cb', async (ctx) => {
    const shop = 'fullstackapp.myshopify.com'
    const client_code = ctx.query.code
    const accessToken = await sdk.get_token_by_code(CLIENT_SECRET, client_code)

    const query = { domain: shop }
    const update = { $set: { domain: shop, accessToken: accessToken } }
    const options = { upsert: true }

    await store.update(query, update, options, (error, result) => {
      if (error) {
        console.log('error1', error)
      } else {
        console.log('store detail inserted into db')
      }
    })

    ctx.redirect(`/?shop=${shop}`)
  })

  router.get('/line-notify', async (ctx) => {
    const get_Oauth_URL = sdk.set_Oauth_URL('code', 'notify', 'im_a_token')
    const Oauth_URL = get_Oauth_URL()
    ctx.redirect(Oauth_URL)
  })

  router.post('/webhooks', async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res)
      console.log(`Webhook processed, returned status code 200`)
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`)
    }
  })

  router.post(
    '/graphql',
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res)
    }
  )

  router.get('(/_next/static/.*)', handleRequest) // Static content is clear
  router.get('/_next/webpack-hmr', handleRequest) // Webpack content is clear
  router.get('(.*)', verifyRequest(), handleRequest) // Everything else must have sessions

  server.use(router.allowedMethods())
  server.use(router.routes())

  // ローカル
  // server.listen(port, () => {
  //   console.log(`> Ready on http://localhost:${port}`)
  // })

  // MongoDB
  server.listen(port, () => {
    client.connect((err) => {
      if (err) {
        console.log('Error in database connection ' + err)
        throw err
      }
      global.store = client.db(DB_NAME).collection('stores')
      console.log('Connected with db')
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
})
