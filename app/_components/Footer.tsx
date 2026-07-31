import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLocationDot,
  faPhone,
  faScrewdriverWrench,
  faCartShopping
} from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

const PHONES = [
  { display: '98 192 053', intl: '21698192053' },
  { display: '24 660 559', intl: '21624660559' }
]

const MAPS_EMBED =
  'https://www.google.com/maps?q=Tunisian+CARS+Garage,35.8327698,10.5575226&z=16&hl=fr&output=embed'
const MAPS_LINK =
  'https://www.google.com/maps/place/Tunisian+CARS+Garage/@35.8327741,10.5549477,1013m/data=!3m2!1e3!4b1!4m6!3m5!1s0x12fd8be1837376ff:0xd84334e0a7b6d9a1!8m2!3d35.8327698!4d10.5575226!16s%2Fg%2F11yrkp1jbh'

export default function Footer() {
  return (
    <footer className='border-t border-white/10 bg-black text-white'>
      <div className='mx-auto w-[92%] xl:max-w-6xl py-14 lg:py-16'>
        <div className='grid gap-10 lg:grid-cols-2 lg:gap-14'>
          {/* Brand + contact */}
          <div>
            <img
              src='/tunisiancars/logo_rect.png'
              alt='Tunisian Cars'
              className='h-9 w-auto brightness-0 invert lg:h-11'
            />
            <p className='mt-4 max-w-sm text-pretty leading-relaxed text-white/60'>
              Atelier & showroom automobile d&apos;exception — restauration,
              detailing, protection céramique et véhicules rares.
            </p>

            <p className='mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/85'>
              <FontAwesomeIcon
                icon={faLocationDot}
                className='h-4 w-4 text-brand-500'
              />
              Sousse, Tunisie
            </p>

            <div className='mt-5 space-y-3'>
              {PHONES.map((phone) => (
                <div key={phone.intl} className='flex items-center gap-3'>
                  <span className='min-w-[7.5rem] font-semibold tracking-wide text-white'>
                    {phone.display}
                  </span>
                  <a
                    href={`tel:+${phone.intl}`}
                    aria-label={`Appeler le ${phone.display}`}
                    className='inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-600'
                  >
                    <FontAwesomeIcon icon={faPhone} className='h-3.5 w-3.5' />
                    Appeler
                  </a>
                  <a
                    href={`https://wa.me/${phone.intl}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label={`WhatsApp ${phone.display}`}
                    className='inline-flex items-center gap-1.5 rounded-full bg-whatsapp px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90'
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className='h-4 w-4' />
                    WhatsApp
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div>
            <a
              href={MAPS_LINK}
              target='_blank'
              rel='noopener noreferrer'
              className='block overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-card transition-shadow hover:shadow-card-hover'
            >
              <iframe
                title='Tunisian Cars Garage — Sousse'
                src={MAPS_EMBED}
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                className='h-64 w-full border-0 lg:h-full lg:min-h-[280px]'
              />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row'>
          <p>© 2026 Tunisian Cars. Tous droits réservés.</p>
          <nav aria-label='Pied de page' className='flex items-center gap-5'>
            <Link
              href='/atelier'
              className='inline-flex items-center gap-1.5 transition-colors hover:text-white'
            >
              <FontAwesomeIcon
                icon={faScrewdriverWrench}
                className='h-3.5 w-3.5'
              />
              Atelier
            </Link>
            <Link
              href='/produits'
              className='inline-flex items-center gap-1.5 transition-colors hover:text-white'
            >
              <FontAwesomeIcon icon={faCartShopping} className='h-3.5 w-3.5' />
              Boutique
            </Link>
            <a
              href='https://m.me/tunisiancars.tn'
              target='_blank'
              rel='noopener noreferrer'
              className='transition-colors hover:text-white'
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
