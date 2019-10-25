import curry from 'lodash.curry'

export default curry((word, _endings, _number) => {
  const endings = _endings.length === 2 ? [..._endings, _endings[1]] : _endings
  const number = Math.abs(_number)
  const mod10 = number % 10
  const mod100 = number % 100
  let idx = 2

  if (mod10 === 1 && mod100 !== 11) {
    idx = 0
  }

  if (mod10 > 1 && mod10 < 5 && (mod100 < 10 || mod100 >= 20)) {
    idx = 1
  }

  return word + endings[idx]
}, 3)
