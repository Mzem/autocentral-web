import type { Metadata } from 'next'
import LoginForm from '../../_components/LoginForm'

export const metadata: Metadata = {
  title: 'Espace vendeur | Autocentral',
  robots: { index: false, follow: false }
}

export default function AcLoginPage() {
  return (
    <div className='bg-black pb-16 pt-16 lg:pt-20'>
      <LoginForm
        nextPath='/'
        subtitle='Connectez-vous pour gérer les annonces à la une (connexion valable aussi sur tunisiancars.com.tn).'
      />
    </div>
  )
}
