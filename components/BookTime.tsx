import { Booking } from "@prisma/client";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Calendar } from "./Calendar";
import { ConfigProvider, TimePicker } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { useRouter } from "next/router";
import { RangePickerProps } from "antd/es/date-picker";

const arrayofTimes = () => {
  let startingtime = DateTime.now().plus({
    minutes: Math.ceil(DateTime.now().minute / 15) * 15 - DateTime.now().minute,
  });

  startingtime = startingtime.minus({
    seconds: startingtime.second,
    milliseconds: startingtime.millisecond,
  });

  let times = [];

  let count = 0;

  while (count <= 96) {
    times.push(startingtime);
    startingtime = startingtime.plus({ minutes: 15 });
    count++;
  }

  return times;

  // DateTime.now().minute/15;
};

const startingTime = () => {
  let startingtime = DateTime.now().plus({
    minutes: Math.ceil(DateTime.now().minute / 15) * 15 - DateTime.now().minute,
  });

  return startingtime.toJSDate();
};

const availableTimes = (schedule: Booking[]) => {
  const times = arrayofTimes();

  //   console.log(times);

  let bookedTimes: DateTime[] = [];

  schedule
    .filter((item) => {
      return (
        DateTime.fromJSDate(new Date(item.startTime)) >= DateTime.now() ||
        DateTime.fromJSDate(new Date(item.endTime)) >= DateTime.now()
      );
    })
    .map((item) => {
      let starttime = DateTime.fromJSDate(new Date(item.startTime));

      starttime = starttime.minus({
        seconds: starttime.second,
        milliseconds: starttime.millisecond,
      });

      while (starttime < DateTime.fromJSDate(new Date(item.endTime))) {
        bookedTimes.push(starttime);

        starttime = starttime.plus({ minutes: 15 });
      }
    });

  //   console.log(
  //     "sup man",
  //     bookedTimes.map((booked) => {
  //       return new Date(booked.toMillis()).toLocaleString();
  //     }),
  //     times.map((booked) => {
  //       return new Date(booked.toMillis()).toLocaleString();
  //     })
  //   );

  //   console.log(
  //     bookedTimes,
  //     times.filter((time) => {
  //       console.log(
  //         bookedTimes.map((booked) => {
  //           console.log(new Date(booked.toMillis()));
  //         })
  //       );
  //       bookedTimes.forEach((bookedTime) => {
  //         if (bookedTime === time) {
  //           console.log("hi");
  //           return true;
  //         }
  //       });

  //       return false;
  //     })
  //   );
  return times.filter((time) => {
    let itsThere = false;
    bookedTimes.filter((bookedTime) => {
      if (
        new Date(bookedTime.toMillis()).toLocaleString() ===
        new Date(time.toMillis()).toLocaleString()
      ) {
        itsThere = true;
        return true;
      }
    });

    return itsThere;
  });
};

export const BookTime = ({
  schedule,
  postId,
}: {
  schedule: Booking[];
  postId: string;
}) => {
  const [times, setTimes] = useState<DateTime[]>([
    DateTime.fromJSDate(startingTime()),
    DateTime.fromJSDate(startingTime()).plus({ hour: 1 }),
  ]);
  const [openSlots, setOpenSlots] = useState(availableTimes(schedule));
  const [duration, setDuration] = useState("");
  const router = useRouter();

  const closedSlots: RangePickerProps["disabledTime"] = () => {
    const times = availableTimes(schedule);

    return {
      //   disabledHours: () => {
      //     // Get hours that are currently booked
      //     const bookedHours = times.map((time) => time.hour);

      //     return Array.from({ length: 24 }, (_, i) => i).filter((hour) =>
      //       bookedHours.includes(hour)
      //     );
      //   },
      disabledMinutes: (hour) => {
        // Get minutes that are currently booked for the given hour
        const bookedMinutes = times
          .filter((time) => time.hour === hour)
          .map((time) => time.minute);

        const past45Minutes = times
          .filter((time) => time.hour === hour + 1)
          .map((time) => time.minute);

        return Array.from({ length: 60 }, (_, i) => i).filter((minute) =>
          bookedMinutes.includes(minute)
        );
      },
    };
  };

  useEffect(() => {
    // console.log(availableTimes(schedule));

    setDuration(
      times[0] && times[1]
        ? times[1].hasSame(times[0], "minute")
          ? "less than a minute"
          : times[1].diff(times[0]).as("hours") > 1 ||
            times[1].diff(times[0]).as("minutes") >= 60
          ? `${Math.floor(times[1].diff(times[0]).as("hours"))}h ${
              Math.floor(times[1].diff(times[0]).as("minutes")) % 60 !== 0
                ? (Math.floor(times[1].diff(times[0]).as("minutes")) % 60) + "m"
                : ""
            }`
          : `${times[1].diff(times[0]).toFormat("mm")}m`
        : ""
    );
  }, [times]);

  return (
    <div>
      <h3 className="text-2xl font-black">Book this charger 🔌⚡</h3>

      <div className="flex w-full flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
        <div className="w-full md:w-1/5">
          <div className="flex flex-col gap-2 ">
            {/* <div className="flex flex-col gap-2 ">
              <p className="text-left text-lg font-medium">Times</p>
              
            </div> */}
            <p className="text-left text-lg font-medium">Duration</p>
            {/* <button
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
            </button> */}

            <ConfigProvider
              theme={{
                token: {
                  controlItemBgActive: "#ffe6d1",
                  colorPrimary: "#ff6b00",
                },
                components: {
                  DatePicker: {
                    activeBorderColor: "#ff6b00",
                    hoverBorderColor: "#ff6b00",
                    cellRangeBorderColor: "#ff6b00",
                    // cellHoverBg: "#ffe6d1",
                    // cellActiveWithRangeBg: "#ffe6d1",
                  },
                },
              }}
            >
              <TimePicker.RangePicker
                changeOnBlur
                //   style={{ borderColor: "#ff6b00" }}
                onBlur={(event) => {
                  console.log(event.target.value);
                }}
                defaultValue={[
                  dayjs(startingTime()),
                  dayjs(
                    DateTime.fromJSDate(startingTime())
                      .plus({ hour: 1 })
                      .toJSDate()
                  ),
                ]}
                format={"h:mm a"}
                onChange={(values) => {
                  // setTimes(values);
                  values?.[0] &&
                    values?.[1] &&
                    setTimes([
                      DateTime.fromJSDate(values?.[0]?.toDate()),
                      DateTime.fromJSDate(values?.[1]?.toDate()),
                    ]);
                  //   console.log(
                  //     DateTime.fromJSDate(values?.[1]?.toDate())
                  //       .diff(DateTime.fromJSDate(values?.[0]?.toDate()))
                  //       .as("seconds")
                  //   );
                }}
                minuteStep={15}
                disabledTime={closedSlots}
                showSecond={false}
              />
            </ConfigProvider>

            <button
              onClick={async () => {
                await axios({
                  method: "POST",
                  url: "/api/booking/create",
                  data: {
                    postId: postId,
                    startTime: times[0],
                    endTime: times[1],
                  },
                });

                router.reload();
              }}
              disabled={!times[0] || !times[1]}
              className={`${
                times[0] && times[1]
                  ? "bg-[#ff6b00] text-white"
                  : "bg-white text-[#ff6b00]"
              } rounded-lg border-2 border-[#ff6b00] px-4 py-2 font-medium transition  duration-300 hover:bg-[#ff6b00] hover:text-white`}
            >
              Book {duration}
              {/* {times[0] && times[1]
                ? times[1].diff(times[0]).as("seconds")
                : ""} */}
            </button>

            {/* {times[0] &&
              times[1] && ? 
              times[0]
                .diff(DateTime.fromJSDate(times[0]))
                .as("seconds") : ""} */}
          </div>
        </div>
        <div className="w-full">
          <p className="text-center text-lg font-medium">
            {DateTime.now().toFormat("MMM dd")}
          </p>

          <div>{<Calendar schedule={schedule} />}</div>
        </div>
      </div>
    </div>
  );
};
