import { ApiClient } from "infrastructure/api.client"
import { AuthRequest } from "infrastructure/api.requests"
import Link from "next/link"
import { ReactElement } from "react"

export const TopPage = (): ReactElement => {
  const requestLogin = async () => {
    const client = new ApiClient
    await client.request(new AuthRequest)
  }

  return (
    <div>
      <h1>Top</h1>
      <button onClick={() => requestLogin()}>
        Login
      </button>
      <Link href='/home/'>Home</Link>
    </div>
  )
}
