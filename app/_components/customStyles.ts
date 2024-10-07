export const reactSelectFilterStyle = {
  control: (base: object) => ({
    ...base,
    minHeight: '25px', // Make the control smaller
    padding: '0px', // Adjust padding to make it compact
    fontSize: '12px', // Smaller font for dropdown options
    '@media (min-width: 1024px)': {
      fontSize: '16px' // Larger font size for screens >= 1024px (like Tailwind's lg:)
    }
  }),
  dropdownIndicator: (base: object) => ({
    ...base,
    padding: '0px' // Remove extra padding from the dropdown arrow
  }),
  clearIndicator: (base: object) => ({
    ...base,
    padding: '0px' // Remove extra padding from the clear button
  }),
  valueContainer: (base: object) => ({
    ...base,
    padding: '0px 6px' // Reduce padding within the value container
  }),
  input: (base: object) => ({
    ...base,
    margin: '0px', // Remove margin inside input
    padding: '0px' // Remove padding inside input
  }),
  option: (base: object) => ({
    ...base,
    background: '#151515',
    padding: '4px 10px', // Adjust the padding for options
    fontSize: '12px', // Smaller font for dropdown options
    '@media (min-width: 1024px)': {
      fontSize: '16px' // Larger font size for screens >= 1024px (like Tailwind's lg:)
    }
  }),
  menu: (base: object) => ({
    ...base,
    marginTop: '0px' // Remove the gap between the dropdown and the selector
  })
}
