import { Booking } from "@prisma/client";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

const arrayofTimes = () => {
  const startingtime = DateTime.now().plus({
    minutes: Math.ceil(DateTime.now().minute / 15) - DateTime.now().minute,
  });

  let times = [];

  let count = 0;

  while (count <= 96) {
    times.push(startingtime);
    startingtime.plus({ minutes: 15 });
    count++;
  }

  return times;

  // DateTime.now().minute/15;
};

const availableTimes = (schedule: Booking[]) => {
  const times = arrayofTimes();

  let bookedTimes: DateTime[] = [];

  schedule
    .filter((item) => {
      return DateTime.fromJSDate(item.startTime) > DateTime.now();
    })
    .map((item) => {
      const starttime = DateTime.fromJSDate(item.startTime);

      while (starttime < DateTime.fromJSDate(item.endTime)) {
        bookedTimes.push(starttime);
        starttime.plus({ minutes: 15 });
      }
    });

  return times.filter((time) => !bookedTimes.includes(time));
};

export const BookTime = ({ schedule }: { schedule: Booking[] }) => {
  const [duration, setDuration] = useState(30);

  return (
    <div>
      <h3 className="text-2xl font-black">Book this charger 🔌⚡</h3>

      <div className="flex w-full flex-col md:flex-row">
        <div className="w-full md:w-1/5">
          <div className="flex flex-col gap-2 ">
            <p className="text-left text-lg font-medium">Duration</p>
            <button
              onClick={() => {
                setDuration(30);
              }}
              className={`${
                duration === 30
                  ? "bg-[#ff6b00] text-white"
                  : "bg-white text-[#ff6b00]"
              } rounded-lg border-2 border-[#ff6b00] px-4 py-2 font-medium transition  duration-300 hover:bg-[#ff6b00] hover:text-white`}
            >
              30 min
            </button>
            <button
              onClick={() => {
                setDuration(60);
              }}
              className={`${
                duration === 60
                  ? "bg-[#ff6b00] text-white"
                  : "bg-white text-[#ff6b00]"
              } rounded-lg border-2 border-[#ff6b00] px-4 py-2 font-medium transition  duration-300 hover:bg-[#ff6b00] hover:text-white`}
            >
              60 min
            </button>
          </div>
        </div>
        <div className="w-full">
          <p className="text-center text-lg font-medium">
            {DateTime.now().toFormat("MMM dd")}
          </p>

          <div>{availableTimes(schedule).toString()}</div>
        </div>
      </div>
    </div>
  );
};
