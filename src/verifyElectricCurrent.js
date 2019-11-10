import fs from 'fs'

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
    .catch((e) => console.log('Pixelle::index.js::40::e =>', e))
}

const job = new CronJob('* */1 * * * *', () => {
  const isExistingFile = fs.existsSync(filePath)

  if (isExistingFile) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (moment().subtract(5, 'm') > moment(data)) {
        sendSMS(data)
      } else {
        fs.writeFileSync(filePath, moment().format())
      }
    })
  } else {
    fs.writeFileSync(filePath, moment().format())
  }
})

job.start()
