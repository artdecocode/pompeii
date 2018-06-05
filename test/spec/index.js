import { equal } from 'zoroaster/assert'
import Context from '../context'
import pompeii from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof pompeii, 'function')
  },
  async 'calls package without error'() {
    await pompeii()
  },
  async 'calls test context method'({ example }) {
    await example()
  },
}

export default T
