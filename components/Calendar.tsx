import { Booking } from "@prisma/client";
import { DateTime } from "luxon";

export const Calendar = ({ schedule }: { schedule: Booking[] }) => {
  return (
    <div className="grid">
      {new Array(24).fill(0).map((_, hour) => {
        return (
          <div className="flex items-end space-x-3">
            <span className="translate-y-[50%] whitespace-nowrap  text-xs uppercase ">
              {hour + 1 > 12 ? hour - 11 : hour + 1}{" "}
              {Math.floor((hour + 1) / 12) === 0 || hour + 1 >= 24
                ? "am"
                : "pm"}
            </span>
            <div className="relative h-12 w-full">
              <div className="">
                {schedule
                  .filter((item) => {
                    console.log(typeof item.startTime);
                    return (
                      DateTime.fromJSDate(new Date(item.startTime)).hour ===
                      hour
                    );
                  })
                  .map((item) => {
                    console.log(
                      `translate(0,${
                        ((DateTime.fromJSDate(new Date(item.startTime)).minute %
                          60) /
                          60) *
                        100
                      }%)`
                    );
                    return (
                      <div
                        className="absolute mx-2 h-0 w-full bg-[#ff6b00] px-2"
                        style={{
                          zIndex: 60,
                          height: `${
                            Math.abs(
                              DateTime.fromJSDate(new Date(item.startTime))
                                .diff(
                                  DateTime.fromJSDate(new Date(item.endTime))
                                )
                                .as("minutes") / 60
                            ) * 100
                          }%`,
                          top: `${
                            ((DateTime.fromJSDate(new Date(item.startTime))
                              .minute %
                              60) /
                              60) *
                            100
                          }%`,
                        }}
                      >
                        <p className="px-4 pt-4 font-black text-white">
                          Booking{" "}
                        </p>

                        <p className="px-4 text-sm font-medium text-white">
                          {DateTime.fromJSDate(
                            new Date(item.startTime)
                          ).toFormat("h:mm a")}{" "}
                          to{" "}
                          {DateTime.fromJSDate(new Date(item.endTime)).toFormat(
                            "h:mm a"
                          )}
                        </p>
                      </div>
                    );
                  })}
              </div>
              {DateTime.now().hour === hour && (
                <div
                  style={{
                    top: `${Math.floor((DateTime.now().minute / 60) * 100)}%`,
                    zIndex: 99,
                  }}
                  className={`absolute flex w-full items-center `}
                >
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <div className="h-[2px] w-full rounded-full bg-red-500"></div>
                </div>
              )}

              <div
                className="relative h-[0.9px] w-full bg-gray-200"
                style={{ zIndex: -200 }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
