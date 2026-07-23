export const reactSelectFilterStyle = {
  control: (base: object) => ({
    ...base,
    minHeight: '25px', // Make the control smaller
    padding: '0px', // Adjust padding to make it compact
    fontSize: '16px', // Smaller font for dropdown options
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
  option: (
    base: object,
    state: { isFocused: boolean; isSelected: boolean }
  ) => ({
    ...base,
    // ink-950 surface with a lighter hover/selected state, matching the
    // dark filter panel the selects sit in.
    background: state.isSelected
      ? '#dc1c1c'
      : state.isFocused
      ? '#343a47'
      : '#0f1218',
    color: '#ffffff',
    cursor: 'pointer',
    padding: '8px 10px',
    fontSize: '16px',
    '@media (min-width: 1024px)': {
      fontSize: '16px'
    }
  }),
  menu: (base: object) => ({
    ...base,
    marginTop: '4px',
    overflow: 'hidden',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: '#0f1218',
    boxShadow: '0 12px 32px rgba(15,18,24,0.45)'
  }),
  menuList: (base: object) => ({
    ...base,
    padding: '0px'
  })
}
