const nameSplit = (frameworkName) => {
  const names = frameworkName.split('/')
  return names[1]
}

module.exports = { nameSplit }
