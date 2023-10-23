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

  return <main>{props.msgs}</main>;
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

  console.log(incomingreq);

  return {
    props: {
      msgs: incomingreq?.incomingRequests ?? [],
    },
  };
}
