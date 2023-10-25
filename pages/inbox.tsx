import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { getSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { db } from "../db/db";

// import Marker from "google-maps-react-markers";
import useGeolocation from "react-hook-geolocation";
import axios from "axios";
import { getDistance } from "geolib";
import { MdFollowTheSigns } from "react-icons/md";
import { HiMapPin } from "react-icons/hi2";
import {
  HiCloud,
  HiHome,
  HiLightningBolt,
  HiLockClosed,
  HiMap,
} from "react-icons/hi";
import { AiFillCar } from "react-icons/ai";
import React from "react";
import { useRouter } from "next/router";

export default function Home(props: any) {
  const router = useRouter();
  const data = JSON.parse(props.requests);

  return (
    <main className="mx-6 lg:mx-24">
      <div className="mt-24 mb-8 text-3xl font-bold lg:text-5xl">
        {" "}
        Upcoming Bookings
      </div>
      <div className="flex  flex-col rounded-lg border-2">
        <div className="-m-1.5 overflow-x-auto">
          <div className="inline-block min-w-full p-1.5 align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
                    >
                      Time
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data.map(
                    (
                      element: {
                        name: string;
                        start: Date;
                        end: Date;
                        address: string;
                        image: string;
                      },
                      index: number
                    ) => (
                      <tr
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        key={index}
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                          {element.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                          {new Date(element.start).toLocaleString("en-US", {
                            month: "numeric",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })}{" "}
                          -{" "}
                          {new Date(element.end).toLocaleString("en-US", {
                            month: "numeric",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-gray-200">
                          {element.address}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <a
                            className="text-blue-500 hover:text-blue-700"
                            href="#"
                          >
                            Delete
                          </a>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const incomingreq = await db.user.findUnique({
    where: {
      email: session?.user?.email || "",
    },
    include: {
      incomingRequests: true,
    },
  });

  const requests = incomingreq?.incomingRequests
    ? await Promise.all(
        incomingreq.incomingRequests.map(async function (element) {
          const requester = await db.user.findUnique({
            where: {
              id: element.requesterId,
            },
          });
          const post = await db.post.findUnique({
            where: {
              id: element.postId,
            },
          });

          return {
            name: requester?.name,
            picture: requester?.image,
            start: element.startTime,
            end: element.endTime,
            address: post?.Address,
          };
        })
      )
    : [];

  console.log(requests);

  return {
    props: {
      requests: JSON.stringify(requests),
    },
  };
}
