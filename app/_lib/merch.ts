// Messenger deep-link to the Tunisian Cars page with a pre-filled order message
// including the article title and its public link. (Messenger may not always
// render the pre-filled text depending on the client, but the conversation opens.)
export function messengerOrderUrl(item: { id: string; title: string }): string {
  const msg = `Bonjour, je veux commander cet article : ${item.title} — https://tunisiancars.com.tn/produits/${item.id}`
  return `https://m.me/tunisiancars.tn?text=${encodeURIComponent(msg)}`
}
