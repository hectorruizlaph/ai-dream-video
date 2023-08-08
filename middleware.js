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

  const res = new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version',
      'Access-Control-Max-Age': '86400',
    },
  })
  return res
}
