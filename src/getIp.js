import { promises as fs } from 'fs'

import Axios from 'axios'
import { CronJob } from 'cron'

import config from '../config.prod.json'

const filePath = 'data/lastIp'

const callWebhook = (value1) => {
  Axios.post(`https://maker.ifttt.com/trigger/ip/with/key/${config.ifttt_user}`, { value1 })
    .then(() => fs.writeFile(filePath, value1))
    .catch((e) => console.error('Pixelle::index.js::13::e =>', e))
}

let ipStock
const job = new CronJob('0 */5 * * * *', () =>
  Axios.get('https://api.ipify.org?format=json')
    .then(({ data: { ip } }) => {
      ipStock = ip
      return fs.readFile(filePath, 'utf8').catch(() => Promise.resolve())
    })
    .then((content) => {
      if (ipStock !== content) callWebhook(ipStock)
    })
    .catch((e) => console.error('Pixelle::index.js::25::e =>', e))
)

console.log('RESTART')
job.start()
