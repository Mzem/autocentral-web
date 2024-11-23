'use client'

import { forwardRef, useState } from 'react'

function CarPostUpdateModal(
  {
    onClose,
    carData
  }: {
    onClose: any
    carData: {
      id?: string
      km?: number
      year?: number
      price?: number
      estimation?: number
      make?: string
      model?: string
      cylinder?: string
      fuel?: string
    }
  },
  ref: any
) {
  const [success, setSuccess] = useState(true)
  const [formData, setFormData] = useState({
    authKey: '',
    km: carData.km || '',
    year: carData.year || '',
    price: carData.price || '',
    estimation: carData.estimation || '',
    make: carData.make || '',
    model: carData.model || '',
    cylinder: carData.cylinder || '',
    fuel: carData.fuel || ''
  })

  // Handle form data changes
  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  // Submit the form
  const handleSubmit = (e: any) => {
    e.preventDefault()
    try {
      fetch('/api/car-post', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: carData.id,
          authKey: formData.authKey || undefined,
          km: formData.km || undefined,
          year: formData.year || undefined,
          price: formData.price || undefined,
          estimation: formData.estimation || undefined,
          make: formData.make || undefined,
          model: formData.model || undefined,
          fuel: formData.fuel || undefined,
          cylinder: formData.cylinder || undefined
        })
      }).then((res) => {
        if (res.ok) {
          setSuccess(true)
          onClose(false) // Close the modal after submitting
        }
        setSuccess(false)
      })
    } catch (e) {
      setSuccess(false)
    }
  }

  return (
    <div
      ref={ref}
      className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'
    >
      <div className='bg-white w-full max-w-md p-6 rounded-lg shadow-lg'>
        <h2 className='text-xl font-semibold mb-1'>Modifier</h2>
        <form onSubmit={handleSubmit} className='space-y-2'>
          <div>
            <label className='block text-titan'>Kilométrage</label>
            <input
              type='number'
              name='km'
              value={formData.km}
              onChange={handleChange}
              className='w-full px-3 py-1 border border-black rounded focus:outline-none focus:ring focus:ring-vividred'
            />
          </div>
          <div>
            <label className='block text-titan'>Année</label>
            <input
              type='number'
              name='year'
              value={formData.year}
              onChange={handleChange}
              className='w-full px-3 py-1 border border-black rounded focus:outline-none focus:ring focus:ring-vividred'
            />
          </div>
          <div>
            <label className='block text-titan'>Prix</label>
            <input
              type='number'
              name='price'
              value={formData.price}
              onChange={handleChange}
              className='w-full px-3 py-1 border border-black rounded focus:outline-none focus:ring focus:ring-vividred'
            />
          </div>
          <div>
            <label className='block text-titan'>Estimation</label>
            <input
              type='number'
              name='estimation'
              value={formData.estimation}
              onChange={handleChange}
              className='w-full px-3 py-1 border border-black rounded focus:outline-none focus:ring focus:ring-vividred'
            />
          </div>
          <div>
            <label className='block text-titan'>Marque</label>
            <input
              type='text'
              name='make'
              value={formData.make}
              onChange={handleChange}
              className='w-full px-3 py-1 border border-black rounded focus:outline-none focus:ring focus:ring-vividred'
            />
          </div>
          <div>
            <label className='block text-titan'>Modèle</label>
            <input
              type='text'
              name='model'
              value={formData.model}
              onChange={handleChange}
              className='w-full px-3 py-1 border border-black rounded focus:outline-none focus:ring focus:ring-red'
            />
          </div>
          <div>
            <label className='block text-titan'>Cylindrée</label>
            <input
              type='text'
              name='cylinder'
              value={formData.cylinder}
              onChange={handleChange}
              className='w-full px-3 py-1 border border-black rounded focus:outline-none focus:ring focus:ring-red'
            />
          </div>
          <div>
            <label className='block text-titan'>Carburant</label>
            <input
              type='text'
              name='fuel'
              value={formData.fuel}
              onChange={handleChange}
              className='w-full px-3 py-1 border border-black rounded focus:outline-none focus:ring focus:ring-red'
            />
          </div>
          <div>
            <label className='block text-titan'>Clé utilisateur</label>
            <input
              type='text'
              name='authKey'
              value={formData.authKey}
              onChange={handleChange}
              className='w-full px-3 py-1 border border-black rounded focus:outline-none focus:ring focus:ring-red'
            />
          </div>
          <div className='flex justify-end space-x-4 items-center'>
            {!success && <p className='text-vividred'>Erreur</p>}
            <button
              type='button'
              onClick={() => onClose(false)}
              className='px-4 py-1 bg-black text-titan rounded-lg hover:bg-red'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-1 text-white rounded-lg bg-vividred hover:bg-titan'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default forwardRef(CarPostUpdateModal)
