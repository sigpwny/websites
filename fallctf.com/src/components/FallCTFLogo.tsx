interface Props {
  year?: number;
  color?: string;
}

export default function FallCTFLogo({ year, color }: Props) {
  return (
    <>
      <p className="font-bold text-8xl">
        <span>Fall CTF</span>
        {year ? <span>&nbsp;{year}</span> : null}
      </p>
    </>
  )
}