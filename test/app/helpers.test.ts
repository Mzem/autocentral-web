import {
  fromQueryParamsToGetCarPostsFilters,
  sortByStringField
} from '../../app/helpers'
import { expect } from '../test-utils'

describe('sortByStringField', () => {
  it('sorts an array of objects in ascending order by a string field', () => {
    // Given
    const array = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }]

    // When
    const result = sortByStringField(array, 'name', 'asc')

    // Then
    expect(result).to.deep.equal([
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' }
    ])
  })

  it('sorts an array of objects in descending order by a string field', () => {
    // Given
    const array = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }]

    // When
    const result = sortByStringField(array, 'name', 'desc')

    // Then
    expect(result).to.deep.equal([
      { name: 'Charlie' },
      { name: 'Bob' },
      { name: 'Alice' }
    ])
  })

  it('handles undefined field values by placing them at the end', () => {
    // Given
    const array = [{ name: 'Charlie' }, { name: undefined }, { name: 'Alice' }]

    // When
    const result = sortByStringField(array, 'name', 'asc')

    // Then
    expect(result).to.deep.equal([
      { name: 'Alice' },
      { name: 'Charlie' },
      { name: undefined }
    ])
  })

  it('returns an empty array when input is an empty array', () => {
    // When
    const result = sortByStringField([], 'name', 'asc')

    // Then
    expect(result).to.deep.equal([])
  })
})

describe('fromQueryParamsToGetCarPostsFilters', () => {
  it('extracts string and number fields from searchParamsRecord', () => {
    // Given
    const searchParamsRecord = {
      make: 'Toyota',
      model: 'Corolla',
      maxPrice: '30000',
      minYear: '2010'
    }

    // When
    const result = fromQueryParamsToGetCarPostsFilters(searchParamsRecord)

    // Then
    expect(result).to.deep.include({
      make: 'Toyota',
      model: 'Corolla',
      maxPrice: 30000,
      minYear: 2010
    })
  })

  it('extracts array values from URLSearchParams', () => {
    // Given
    const searchParamsURL = new URLSearchParams()
    searchParamsURL.append('regionIds', '1')
    searchParamsURL.append('regionIds', '2')
    searchParamsURL.append('regionIds', '3')

    // When
    const result = fromQueryParamsToGetCarPostsFilters(
      undefined,
      searchParamsURL
    )

    // Then
    expect(result.regionIds).to.deep.equal(['1', '2', '3'])
  })

  it('handles boolean values correctly from searchParamsRecord', () => {
    // Given
    const searchParamsRecord = {
      alarm: 'true',
      camera: 'false',
      keyless: 'true'
    }

    // When
    const result = fromQueryParamsToGetCarPostsFilters(searchParamsRecord)

    // Then
    expect(result).to.include({
      alarm: true,
      camera: false,
      keyless: true
    })
  })

  it('returns default values for unspecified filters', () => {
    // When
    const result = fromQueryParamsToGetCarPostsFilters()

    // Then
    expect(result.page).to.equal(1)
    expect(result.q).to.equal('')
  })

  it('prioritizes values from searchParamsRecord over URLSearchParams', () => {
    // Given
    const searchParamsRecord = { make: 'Toyota' }
    const searchParamsURL = new URLSearchParams({ make: 'Honda' })

    // When
    const result = fromQueryParamsToGetCarPostsFilters(
      searchParamsRecord,
      searchParamsURL
    )

    // Then
    expect(result.make).to.equal('Toyota')
  })
})
