// src/services/authService.ts

export const login = async (username: string, password: string) => {
  const res = await fetch('https://api.belikoin.me/pusat/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'Login gagal')
  }

  return data // kita akan ambil data.data.access_token di pemanggil
}
