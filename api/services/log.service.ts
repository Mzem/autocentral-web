import { apiPost } from '../apiClient'

export async function postLog(message: string): Promise<void> {
  await apiPost(`mylog`, { message })
}
