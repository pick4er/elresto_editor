
export default function isNumber(possibleNumber) {
  return !isNaN(parseFloat(possibleNumber)) && 
    isFinite(possibleNumber);
}
