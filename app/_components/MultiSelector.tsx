import React from 'react'
import { fuelLabel } from '../types'

export default function MultiSelectList({
  label,
  items,
  selectedItems,
  setSelectedItems
}: {
  label?: string
  items: string[]
  selectedItems: string[]
  setSelectedItems: (items: any[]) => void
}) {
  const toggleItemSelection = (item: string) => {
    if (selectedItems.includes(item)) {
      // Remove item if it is already selected
      setSelectedItems(selectedItems.filter((i) => i !== item))
    } else {
      // Add item if it is not selected
      setSelectedItems([...selectedItems, item])
    }
  }

  return (
    <div className='ml-3 flex flex-wrap items-center gap-x-3 gap-y-1'>
      {label && (
        <span className='text-sm lg:text-base text-white mr-1'>{label}</span>
      )}
      {items.map((item) => (
        <label key={item} className='flex items-center cursor-pointer'>
          <input
            type='checkbox'
            checked={selectedItems.includes(item)}
            onChange={() => toggleItemSelection(item)}
            className='rounded cursor-pointer mr-[3px] h-5 w-5 border-white/30'
          />
          <span className='text-sm lg:text-base mr-1'>{fuelLabel(item)}</span>
        </label>
      ))}
    </div>
  )
}
