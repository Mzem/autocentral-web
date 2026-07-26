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
    // Raised dark popover with a steel selected state and a lighter hover,
    // matching the sober dark filter panel the selects sit in.
    background: state.isSelected
      ? '#2b6d8e'
      : state.isFocused
      ? '#2b3040'
      : 'transparent',
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
    border: '1px solid rgba(255,255,255,0.12)',
    background: '#1e212a',
    boxShadow: '0 18px 48px rgba(0,0,0,0.55)'
  }),
  menuList: (base: object) => ({
    ...base,
    padding: '0px'
  })
}
