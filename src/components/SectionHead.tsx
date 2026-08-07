import { Reveal } from './Reveal'

type Props = {
  index: string
  eyebrow: string
  title: string
}

export function SectionHead({ index, eyebrow, title }: Props) {
  return (
    <Reveal>
      <div className="rule flex flex-col gap-4 pt-6 sm:flex-row sm:items-baseline sm:gap-10">
        <span className="tag shrink-0 text-draft">
          {index} / {eyebrow}
        </span>
        <h2 className="font-display text-3xl leading-[1.1] text-chalk sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </div>
    </Reveal>
  )
}
