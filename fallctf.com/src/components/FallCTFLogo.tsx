import { motion } from 'framer-motion';

interface Props {
  year?: string;
  color?: string;
}

export default function FallCTFLogo({ year, color }: Props) {
  return (
    <motion.div
      layoutId={"fallctf-logo"}
    >
      <p className="font-bold text-8xl">
        <span>Fall CTF</span>
        {year ? <span>&nbsp;{year}</span> : null}
      </p>
    </motion.div>
  )
}