'use client'

import dynamic from 'next/dynamic'

const GrandTourPlaza = dynamic(
  () => import('@/components/mun-os/GrandTourPlaza'),
  { ssr: false }
)

export default function PlazaPage() {
  return <GrandTourPlaza />
}
