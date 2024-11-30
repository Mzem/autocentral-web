import React from 'react'
import { Fuel } from '../types'

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
    <div className='ml-3 flex space-x-[3px] items-center'>
      {label && (
        <span className='text-sm lg:text-base text-whiteBG mr-1'>{label}</span>
      )}
      {items.map((item) => (
        <label key={item} className='flex items-center cursor-pointer'>
          <input
            type='checkbox'
            checked={selectedItems.includes(item)}
            onChange={() => toggleItemSelection(item)}
            className='mt-[2px] rounded cursor-pointer mr-[1px] h-5 w-5'
          />
          <span className='text-sm lg:text-base mr-1'>
            {item === Fuel.HYBRID ? 'Hybride/Electrique' : item}
          </span>
        </label>
      ))}
    </div>
  )
}
