import LoginForm from '../../_components/LoginForm'

export default function LoginPage() {
  return (
    <LoginForm
      nextPath='/vente'
      subtitle='Connectez-vous pour gérer vos véhicules et vos articles en vente (connexion valable aussi sur autocentral.tn).'
    />
  )
}
