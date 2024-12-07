export default function Footer() {
  return (
    <div className=''>
      <footer className='flex flex-col justify-around items-center mt-1 lg:mt-2 text-xs lg:text-base text-white'>
        <p className=''>Site web non-commercial 100% gratuit - 2024</p>

        <div className='flex flex-row space-x-2 m-2 lg:m-4'>
          <a
            href='https://www.instagram.com/autocentral.tn'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src='/instagram.svg'
              alt='Instagram'
              className='h-5 w-5 hover:text-white hover:filter hover:brightness-50 '
            />
          </a>
          <a
            href='https://www.facebook.com/autocentral.tn'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img
              src='/facebook.svg'
              alt='Facebook'
              className='h-5 w-5 hover:text-white hover:filter hover:brightness-50 '
            />
          </a>
        </div>
      </footer>
      {/* <footer className='md:hidden fixed bottom-0 w-full flex justify-center items-center bg-blacknotopac'>
        <Link
          href='/'
          className='bg-blacknotopac w-[14%] border-r border-titanopac'
        >
          <img src='car_white.svg' className='h-9 mx-auto p-1' />
        </Link>
        <Link href='/' className='bg-blacknotopac w-[14%] flex items-center'>
          <img src='man.svg' className='h-9 mx-auto p-1' />
          <img src='badge.svg' className='h-3 mx-auto -ml-3' />
        </Link>
        <Link href='/' className='w-[16%]'>
          <span className='h-9 mx-auto bg-vividred text-white flex items-center justify-center w-full font-semibold text-[2.2rem] rounded-full'>
            +
          </span>
        </Link>
        <Link
          href='/'
          className='bg-blacknotopac w-[14%] border-r border-titanopac'
        >
          <img src='mechanic.svg' className='h-9 mx-auto p-1' />
        </Link>
        <Link href='/' className='bg-blacknotopac w-[14%]'>
          <img src='shirt.svg' className='h-9 mx-auto p-1' />
        </Link>
      </footer> */}
    </div>
  )
}
