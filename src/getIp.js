import fs from 'fs'

import Axios from 'axios'
import { CronJob } from 'cron'

import config from '../config.prod.json'

const filePath = 'data/lastIp'

const callWebhook = (value1) => {
  Axios.post(`https://maker.ifttt.com/trigger/ip/with/key/${config.ifttt_user}`, { value1 })
    .then(() => fs.writeFileSync(filePath, value1))
    .catch((e) => console.log('Pixelle::index.js::40::e =>', e))
}

const job = new CronJob('* */1 * * * *', () =>
  Axios.get('https://api.ipify.org?format=json').then(({ data: { ip } }) => {
    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (ip !== data) callWebhook(ip)
      })
    } else callWebhook(ip)
  })
)

job.start()
