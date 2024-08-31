import CarReg from './_components/CarReg'
import Header from './_components/Header'

export default function Home() {
  return (
    <div>
      <Header />
      <div className='pt-14'>
        <CarReg />
        {/* catagolgue marques avec logo Autotech */}
        {/* <CarMakes /> */}
      </div>
    </div>
  )
}
