import Koa from 'koa'
import ip from 'ip'
import conf from './src/config'
import router from './src/router'
import middleware from './src/middleware'
import './src/mongodb'

const app = new Koa()
middleware(app)
router(app)
app.listen(conf.port, '0.0.0.0', () => {
  console.log(`server is running at http://${ip.address()}:${conf.port}`)
})
