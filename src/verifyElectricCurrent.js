import { promises as fs } from 'fs'

import Axios from 'axios'
import { CronJob } from 'cron'
import moment from 'moment'

import config from '../config.prod.json'

const filePath = 'data/electric'

const sendSMS = (data) => {
  Axios.get(
    `https://smsapi.free-mobile.fr/sendmsg?user=${config.free.user}&pass=${
      config.free.pass
    }&msg=${encodeURIComponent(`Courant coupé depuis ${data}`)}`
  )
    .then(() => {
      fs.writeFileSync(filePath, moment().format())
    })
    .catch((e) => console.log('Pixelle::index.js::20::e =>', e))
}

const writeTime = () => fs.writeFile(filePath, moment().format()).catch(() => Promise.resolve())

const job = new CronJob('0 */1 * * * *', () =>
  fs
    .readFile(filePath, 'utf8')
    .then((data) => {
      if (moment().subtract(5, 'm') > moment(data)) sendSMS(data)
      else writeTime()
    })
    .catch(writeTime)
)

console.log('RESTART')
job.start()
