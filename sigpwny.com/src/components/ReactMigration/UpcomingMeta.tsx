import { useEffect, useState } from 'react';

export default function UpcomingMeta({ end }: { end: Date }) {
  const [isUpcoming, setIsUpcoming] = useState(end > new Date());
  useEffect(() => {
    setIsUpcoming(end > new Date());
    const interval = setInterval(() => {
      setIsUpcoming(end > new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, [end]);
  return (
    <div data-tag={isUpcoming ? "upcoming" : "past"} className="hidden" />
  )
}