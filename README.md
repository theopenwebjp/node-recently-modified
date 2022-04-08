# Description

Simple Node js library for getting recently modified files.
Main goal is for having a way of getting modified files that need to be back-upped.
By default, gets only folders, but can set to get only files and both too.

## Usage

```bash
const nrm = ('node-recently-modified')
nrm.builder().path('./').exclude(['node_modules']).files(true).directories(false).newerThan(Date.now()).logging(true).exec()
.then(console.log)
```

## Info

- [fsstats][https://nodejs.org/api/fs.html#class-fsstats]: The stats object that includes modified time info.
- It seems that sometimes modifying info is not immediately applied to fsstats. Therefore, it is recommend to sleep at least 100ms before check if modified.
