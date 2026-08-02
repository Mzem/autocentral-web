import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpRightFromSquare,
  faLocationDot,
  faPhone,
  faStar,
  faThumbsUp
} from '@fortawesome/free-solid-svg-icons'
import {
  faWhatsapp,
  faFacebookF,
  faInstagram
} from '@fortawesome/free-brands-svg-icons'
import { NAV_LINKS } from '../_lib/nav'

const PHONES = [
  { display: '98 192 053', intl: '21698192053' },
  { display: '24 660 559', intl: '21624660559' }
]

// Facebook recommendations (last names shortened to an initial).
const REVIEWS_URL = 'https://www.facebook.com/tunisiancarsgaragesousse/reviews'
const REVIEWS = [
  {
    name: 'Oussema Z.',
    initial: 'O',
    date: 'Févr. 2019',
    text: 'Excellente équipe, bonne continuation 😎'
  },
  {
    name: 'Jaber T.',
    initial: 'J',
    date: 'Nov. 2018',
    text: 'Les plus belles voitures qui circulent en Tunisie !'
  },
  {
    name: 'Kais M.',
    initial: 'K',
    date: 'Sept. 2018',
    text: 'The best.'
  }
]

const SOCIALS = [
  {
    label: 'Showroom',
    facebook: 'https://facebook.com/tunisiancars.tn',
    instagram: 'https://instagram.com/tunisiancars.tn'
  },
  {
    label: 'Atelier',
    facebook: 'https://facebook.com/tunisiancarsgaragesousse',
    instagram: 'https://instagram.com/tunisiancarsgarage'
  }
]

const MAPS_EMBED =
  'https://www.google.com/maps?q=Tunisian+CARS+Garage,35.8327698,10.5575226&z=16&hl=fr&output=embed'
const MAPS_LINK =
  'https://www.google.com/maps/place/Tunisian+CARS+Garage/@35.8327741,10.5549477,1013m/data=!3m2!1e3!4b1!4m6!3m5!1s0x12fd8be1837376ff:0xd84334e0a7b6d9a1!8m2!3d35.8327698!4d10.5575226!16s%2Fg%2F11yrkp1jbh'

export default function Footer() {
  return (
    <footer className='scroll-mt-16'>
      <div className='scroll-mt-16 border-t border-white/10 bg-black text-white'>
        <div className='mx-auto w-[92%] xl:max-w-6xl pt-6'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <div className='md:flex items-center gap-3'>
              <img
                src='/tunisiancars/logo_rect.png'
                alt='Tunisian Cars'
                className='h-9 w-auto brightness-0 invert lg:h-11'
              />
              <div className='flex items-center gap-2'>
                <span className='flex text-brand-500'>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className='h-3 w-3'
                    />
                  ))}
                </span>
                <span className='text-xs font-bold'>96% recommandent</span>
                <span className='text-[0.7rem] text-ink-500'>· 247 avis</span>
              </div>
            </div>
            <a
              href={REVIEWS_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-ink-50 px-3 py-1 text-[0.7rem] font-semibold text-ink-800 transition-colors hover:border-brand-500/40 hover:bg-brand-500/5'
            >
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className='h-3 w-3 text-brand-500'
              />
              Tous les avis
            </a>
          </div>

          <ul className='mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3'>
            {REVIEWS.map((review) => (
              <li
                key={review.name}
                className='rounded-lg border border-ink-100 bg-white p-3 shadow-card-light'
              >
                <div className='flex items-center gap-2'>
                  <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-xs font-bold text-brand-500'>
                    {review.initial}
                  </span>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-[0.8rem] font-semibold leading-tight'>
                      {review.name}
                    </p>
                    <p className='text-[0.6rem] text-ink-400'>{review.date}</p>
                  </div>
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    className='h-3.5 w-3.5 shrink-0 text-brand-500'
                  />
                </div>
                <p className='mt-1.5 text-[0.8rem] leading-snug text-ink-700'>
                  {review.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div
          className='mx-auto w-[92%] xl:max-w-6xl py-14 lg:py-16'
          id='contact'
        >
          <div className='grid gap-10 lg:grid-cols-2 lg:gap-14'>
            {/* Brand + contact */}
            <div>
              <p className='max-w-sm text-pretty leading-relaxed text-white/60'>
                Atelier & Showroom automobile d&apos;exception. Restauration,
                service mécanique premium, detailing, protection céramique et
                véhicules rares.
              </p>

              <p className='mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/85'>
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className='h-4 w-4 text-brand-500'
                />
                Sousse, Kalaa Sghira, Tunisie
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

              {/* Réseaux sociaux */}
              <div className='mt-7 space-y-3'>
                {SOCIALS.map((social) => (
                  <div key={social.label} className='flex items-center gap-3'>
                    <span className='min-w-[6rem] text-sm font-semibold text-white/85'>
                      {social.label}
                    </span>
                    <a
                      href={social.facebook}
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label={`Facebook ${social.label}`}
                      className='flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-white transition-opacity hover:opacity-90'
                    >
                      <FontAwesomeIcon icon={faFacebookF} className='h-4 w-4' />
                    </a>
                    <a
                      href={social.instagram}
                      target='_blank'
                      rel='noopener noreferrer'
                      aria-label={`Instagram ${social.label}`}
                      className='flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white transition-opacity hover:opacity-90'
                    >
                      <FontAwesomeIcon icon={faInstagram} className='h-4 w-4' />
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
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className='inline-flex items-center gap-1.5 transition-colors hover:text-white'
                >
                  <FontAwesomeIcon icon={link.icon} className='h-3.5 w-3.5' />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
