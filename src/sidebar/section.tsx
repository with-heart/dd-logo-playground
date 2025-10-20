import type { ReactNode } from 'react'

export const Section = ({
  children,
  title,
}: {
  children: ReactNode
  title: string
}) => {
  return (
    <section className="flex flex-col gap-5">
      <h3 className="text-lg">{title}</h3>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}
