import AWS from 'aws-sdk'

const sns = new AWS.SNS()
const { env: { TOPIC_ARN: TopicArn } } = process

const NPM_FROM = /support@npmjs\.com/

export const handler = async ({ Records }) => {
  const [{ ses: { mail } }] = Records
  const { commonHeaders: { from, subject } } = mail
  if (!NPM_FROM.test(from)) {
    console.log('not publishing')
    return
  }
  console.log('publishing %s', subject)

  await publish(subject)
}

const publish = async (Message) => {
  await sns.publish({
    TopicArn,
    Message,
  })
}
