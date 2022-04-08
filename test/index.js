const chai = require('chai')

const nrm = require('../index.js')
const fs = require('fs-extra')
const path = require('path')

const THIS_DIR = __dirname
const CHANGED_FILE_PATHS = [
  path.resolve(THIS_DIR, 'files', 'changed1.txt'),
  path.resolve(THIS_DIR, 'files', 'changed2.txt'),
  path.resolve(THIS_DIR, 'files', 'changed3.txt'),
  path.resolve(THIS_DIR, 'files', 'changed4.txt')
]

describe('NodeRecentlyModified', () => {
  describe('exec', () => {
    it('Only modified files are detected', async function () {
      this.timeout(10000); // Required for longer sleep handling.
      try {
        await initialize() // Setup
        const date = new Date() // After setup BUT before change date
        await sleep(100) // time issue bug.
        await Promise.all(CHANGED_FILE_PATHS.map(filePath => change(filePath))) // Modify files

        const paths = await nrm.builder().path(path.resolve(THIS_DIR, 'files')).newerThan(date).exec()
        console.log('date', date)
        console.log('paths', paths)

        // TESTS
        chai.expect(paths).to.be.an('array') // Type check
        chai.expect(paths.sort()).to.deep.equal(CHANGED_FILE_PATHS) // Only those that were modified.

      } catch (error) {
        console.error('async error', error)
        chai.assert.fail(0, 1, 'Async Error')
        return error
      }
    })
  })
})

/**
 * Deletes directory and then populates with base files.
 */
async function initialize () {
  await fs.remove(path.resolve(THIS_DIR, 'files'))
  await fs.copy(path.resolve(THIS_DIR, 'base-files'), path.resolve(THIS_DIR, 'files'))
}

/**
 * @param {string} filePath 
 */
async function change (filePath) {
  await fs.appendFile(filePath, '+')
}

/**
 * @param {number} ms 
 * @return {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}
