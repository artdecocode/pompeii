import { request } from 'https'
import AWS from 'aws-sdk'
import { stringify } from 'querystring'

const sns = new AWS.SNS()
const { env: { TOPIC_ARN: TopicArn, SERVER: server, KEY: key = 'super-secret-key' } } = process

const NPM_FROM = /support@npmjs\.com/

export const handler = async ({ Records }) => {
  const [{ ses: { mail } }] = Records
  const { commonHeaders: { from, subject } } = mail
  if (!NPM_FROM.test(from)) {
    console.log('not publishing')
    return
  }

  if (server) {
    console.log('pinging server')
    notify(server, subject)
  }
  if (TopicArn) {
    console.log('publishing %s', subject)
    await publish(subject)
  }
}

const notify = (ser, Message) => {
  const q = stringify({ 'secret-key': key, subject: Message })
  const req = request(`${ser}?${q}`, (res) => {
    console.log('Server responded with', res.statusCode)
  })
  req.end()
}

const publish = async (Message) => {
  await sns.publish({
    TopicArn,
    Message,
  })
}
