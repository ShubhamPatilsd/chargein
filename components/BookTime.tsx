import { Booking } from "@prisma/client";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Calendar } from "./Calendar";
import { ConfigProvider, TimePicker } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import { useRouter } from "next/router";

const arrayofTimes = () => {
  let startingtime = DateTime.now().plus({
    minutes: Math.ceil(DateTime.now().minute / 15) - DateTime.now().minute,
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

  let bookedTimes: DateTime[] = [];

  schedule
    .filter((item) => {
      return DateTime.fromJSDate(item.startTime) > DateTime.now();
    })
    .map((item) => {
      let starttime = DateTime.fromJSDate(item.startTime);

      while (starttime < DateTime.fromJSDate(item.endTime)) {
        bookedTimes.push(starttime);
        starttime = starttime.plus({ minutes: 15 });
      }
    });

  return times.filter((time) => !bookedTimes.includes(time));
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

  useEffect(() => {
    // console.log(availableTimes(schedule));

    setDuration(
      times[0] && times[1]
        ? times[1].hasSame(times[0], "minute")
          ? "less than a minute"
          : times[1].diff(times[0]).as("hours") > 1 ||
            times[1].diff(times[0]).as("minutes") >= 60
          ? `${Math.floor(times[1].diff(times[0]).as("hours"))}h ${
              times[1].diff(times[0]).as("minutes") % 60 !== 0
                ? (times[1].diff(times[0]).as("minutes") % 60) + "m"
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
                  console.log(
                    DateTime.fromJSDate(values?.[1]?.toDate())
                      .diff(DateTime.fromJSDate(values?.[0]?.toDate()))
                      .as("seconds")
                  );
                }}
                minuteStep={15}
                disabledDate={(currentDate) =>
                  currentDate.isSame(dayjs(times[0].toJSDate())) &&
                  availableTimes(schedule).includes(
                    DateTime.fromJSDate(currentDate.toDate())
                  )
                }
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
