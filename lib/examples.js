module.exports = [
  {
    name: 'lipsum --help',
    description: 'Print help using the command module defaults'
  },
  {
    name: 'lipsum -lh',
    description: 'Print help and include mock latin options and commands'
  },
  {
    name: 'lipsum -jh',
    description: 'Print help as JSON'
  },
  {
    name: 'lipsum -eh',
    description: 'Include exit codes in the help ouput'
  },
  {
    name: 'lipsum --format markdown --help',
    description: 'Print help as markdown'
  },
  {
    name: 'lipsum -h --align flex',
    description: 'Switch to flex alignment'
  },
  {
    name: 'lipsum -lh --maximum 100',
    description: 'Increase maximum column width'
  },
  {
    name: 'lipsum -lh --sort null',
    description: 'Disable help option sort (natural order)'
  },
  {
    name: 'lipsum -lh --sort false',
    description: 'Use default sort order'
  },
  {
    name: 'lipsum -lh --sort true',
    description: 'Use lexicographic sort order'
  },
  {
    name: 'lipsum -lh --sort 1',
    description: 'Sort by length of option (longest first)'
  },
  {
    name: 'lipsum -lh --sort -1',
    description: 'Sort by length of option (shortest first)'
  },
  {
    name: 'lipsum --help --no-color',
    description: 'Disable terminal colors'
  },
  {
    name: 'lipsum --help > help.txt && cat help.txt',
    description: 'Verify ANSI escape sequences are not written to files'
  }
]
