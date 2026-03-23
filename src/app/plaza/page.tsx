'use client'

import dynamic from 'next/dynamic'

// 🦋 MÜN OS Plaza with Mobile Touch Controls
// Left joystick: Move | Right joystick: Camera
const Plaza = dynamic(
  () => import('@/components/mun-os/Plaza'),
  { ssr: false }
)

export default function PlazaPage() {
  return <Plaza />
}
