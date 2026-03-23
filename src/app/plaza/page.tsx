'use client'

import dynamic from 'next/dynamic'

// Plaza with mobile touch controls
const Plaza = dynamic(
  () => import('@/components/mun-os/Plaza'),
  { ssr: false }
)

export default function PlazaPage() {
  return <Plaza />
}
