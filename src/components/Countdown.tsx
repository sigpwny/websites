import React, { useEffect, useState } from "react";

interface CountdownBadgeProps {
  time_start: string
  time_close: string
}

interface CountdownStatus {
  type: CountdownStatusType
  message: string
}

enum CountdownStatusType {
  Upcoming,
  Live,
  Complete
}

export const CountdownBadge = ({time_start, time_close}: CountdownBadgeProps) => {
  const [countdown, setCountdown] = useState<CountdownStatus | null>(null);
  useEffect(() => {
    function getCountdownStatusType(
      start_date: Date,
      close_date: Date,
      now: Date
    ): {
      status: CountdownStatus,
      interval: number
    } | null {
      if (now >= close_date) {
        return null;
      } else if (now >= start_date) {
        return {
          status: {
            type: CountdownStatusType.Live,
            message: "LIVE"
          },
          interval: 1000
        };
      }
      let diff = start_date.getTime() - now.getTime();
      let days = Math.floor(diff / (1000 * 60 * 60 * 24));
      let hours = Math.floor(diff / (1000 * 60 * 60));
      let minutes = Math.floor(diff / (1000 * 60));
      let result = {
        status: {
          type: CountdownStatusType.Complete,
          message: ""
        },
        interval: 1000
      };
      if (days > 7) {
        result.status.type = CountdownStatusType.Upcoming;
        result.status.message = `SCHEDULED`;
        result.interval = 1000 * 60 * 60; // Every hour
      } else if (days > 0) {
        result.status.type = CountdownStatusType.Upcoming;
        result.status.message = `in ${days} day${days === 1 ? "" : "s"}`;
        result.interval = 1000 * 60 * 60; // Every hour
      } else if (hours > 0) {
        result.status.type = CountdownStatusType.Upcoming;
        result.status.message = `in ${hours} hour${hours === 1 ? "" : "s"}`;
        result.interval = 1000 * 60; // Every minute
      } else if (minutes > 0) {
        result.status.type = CountdownStatusType.Upcoming;
        result.status.message = `in ${minutes} min`;
        result.interval = 1000; // Every second
      } else {
        result.status.type = CountdownStatusType.Upcoming;
        result.status.message = "in <1 min";
        result.interval = 1000; // Every second
      }
      return result;
    }

    // Update countdown
    function tick(start_date: Date, close_date: Date) {
      let now = new Date();
      let result = getCountdownStatusType(start_date, close_date, now);
      if (!result) {
        setCountdown(null);
        return;
      }
      setCountdown(result.status);
      setTimeout(() => {
        tick(start_date, close_date);
      }, result.interval);
    }

    // Initialize countdown
    let start_date = new Date(time_start);
    let close_date = new Date(time_close);
    let now = new Date();
    if (now < close_date) {
      let result = getCountdownStatusType(start_date, close_date, now);
      if (!result) {
        setCountdown(null);
        return;
      }
      setCountdown(result.status);
      setTimeout(() => {
        tick(start_date, close_date);
      }, result.interval);
    }
  }, [time_start, time_close]);
  return (
    <>
      {countdown ? (
        <div className={"inline-flex self-center px-1 text-sm font-mono select-none whitespace-nowrap rounded-md " + (() => {
          switch(countdown.type) {
            case CountdownStatusType.Upcoming:
              return "bg-gradient-to-r from-purple-500 to-blue-500";
            case CountdownStatusType.Live:
              return "bg-red-600";
            default:
              return "hidden";
          }
        })()}>
          {countdown.message}
        </div>
      ) : null}
    </>
  );
};
