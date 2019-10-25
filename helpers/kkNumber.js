
export default function kkNum(num, {startFrom = 1, K = 1000, decimal = 10} = {}) {
  let kS = ''
  let nums = num

  while (nums >= (K * startFrom)) {
    nums = Math.floor((nums / K) * decimal) / decimal
    kS += 'K'
    kS = kS.replace(/KK/g, 'M')
  }

  return nums + kS
}