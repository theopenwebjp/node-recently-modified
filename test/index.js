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
      
      let date
      let paths
      try {
        await initialize()
        date = new Date()
        await Promise.all(CHANGED_FILE_PATHS.map(filePath => change(filePath)))

        paths = await nrm.builder().path(path.resolve(THIS_DIR, 'files')).newerThan(date).exec()
      } catch (error) {
        console.error('async error', error)
        chai.assert.fail(0, 1, 'Async Error')
        return error
      }

      console.log('paths', paths)
      chai.expect(paths).to.be.an('array')
      chai.expect(paths.sort()).to.deep.equal(CHANGED_FILE_PATHS)
    })
  })
})

async function initialize () {
  await fs.remove(path.resolve(THIS_DIR, 'files'))
  await fs.copy(path.resolve(THIS_DIR, 'base-files'), path.resolve(THIS_DIR, 'files'))
}

async function change (filePath) {
  await fs.appendFile(filePath, '+')
}