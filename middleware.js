import {NextResponse} from 'next/server'

const allowedOrigens = [
  'https://nft.protection',
  'https://www.nft.protection',
  'https://www.google.com',
  'http://localhost:3000',
]

export function middleware(req) {
  const origin = req.headers.get('origin')
  console.log('origin: ', origin)

  if (origin && !allowedOrigens.includes(origin)) {
    return new NextResponse(null, {
      status: 400,
      statusText: 'Bad Request',
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }
  const res = NextResponse.next()
  return res
}
