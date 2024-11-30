export default function Footer() {
  return (
    <div className=''>
      <footer className='flex flex-col justify-around items-center mt-1 lg:mt-2 text-xs lg:text-base text-white'>
        <p className=''>Service 100% gratuit - 2024</p>

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
    </div>
  )
}
