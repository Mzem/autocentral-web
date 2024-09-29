export function sortByStringField<T extends Record<string, any>>(
  array: Array<T>,
  fieldName: string,
  order = 'asc'
): Array<T> {
  return array.sort((a, b) => {
    const fieldA =
      a[fieldName] && typeof a[fieldName] === 'string'
        ? a[fieldName].toLowerCase()
        : undefined
    const fieldB =
      b[fieldName] && typeof b[fieldName] === 'string'
        ? b[fieldName].toLowerCase()
        : undefined

    if (!fieldA) {
      return 1
    }
    if (!fieldB) {
      return -1
    }

    if (fieldA < fieldB) {
      return order === 'asc' ? -1 : 1
    }
    if (fieldA > fieldB) {
      return order === 'asc' ? 1 : -1
    }
    return 0
  })
}
