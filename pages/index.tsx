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
  const geolocation = useGeolocation();
  const libraries = useMemo(() => ["places"], []);

  const router = useRouter();

  const [mapCenter, setMapCenter] = useState<any>();
  // const [refList, setRefList] = useState<any>({});

  useEffect(() => {
    (async () => {
      let latitude, longitude: number;

      if (geolocation.error) {
        const result = await axios.get("https://ipapi.co/json/");

        const coordsResult = await axios.get(
          `http://ip-api.com/json/${result.data.ip}`
        );

        // latitude = ;
        // longitude = coordsResult.data.lon;

        setMapCenter({
          lat: coordsResult.data.lat,
          lng: coordsResult.data.lon,
        });

        console.log({
          lat: coordsResult.data.lat,
          lng: coordsResult.data.lon,
        });
      }
      // setMapCenter({
      //   lat: geolocation.latitude,
      //   lng: geolocation.longitude,
      // });

      // console.log({
      //   lat: geolocation.latitude,
      //   lng: geolocation.longitude,
      // });
    })();
  }, []);
  // const mapCenter = useMemo(async () => {
  //   let latitude, longitude: number;

  //   if (geolocation.error) {
  //     const result = await axios.get("https://ipapi.co/json/");

  //     const coordsResult = await axios.get(
  //       `http://ip-api.com/json/${result.data.ip}`
  //     );
  //   }
  //   return {
  //     lat: !geolocation.error ? geolocation.latitude : 27.672932021393862,
  //     lng: !geolocation.error ? geolocation.longitude : 85.31184012689732,
  //   };
  // }, []);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      // disableDefaultUI: true,
      clickableIcons: true,
      // scrollwheel: false,
    }),
    []
  );
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });

  return !isLoaded ? (
    <p>Loading...</p>
  ) : (
    <main>
      <GoogleMap
        options={mapOptions}
        zoom={14}
        center={
          geolocation.error
            ? { lat: 37.7749, lng: -122.4194 }
            : { lat: geolocation.latitude, lng: geolocation.longitude }
        }
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerClassName="w-screen absolute z-0 min-h-[92vh]"
        onLoad={() => console.log("Map Component Loaded...")}
      >
        {!geolocation.error &&
          props.places
            .filter((item) => {
              console.log(JSON.parse(item.location).lat);
              return (
                getDistance(
                  {
                    latitude: JSON.parse(item.location).lat,
                    longitude: JSON.parse(item.location).lng,
                  },
                  // geolocation.error
                  // ?
                  // { latitude: 37.7749, longitude: -122.4194 },
                  // :
                  {
                    latitude: geolocation.latitude || 0,
                    longitude: geolocation.longitude || 0,
                  },
                  1
                ) <= 16500
              );
            })
            .map((thing) => {
              console.log("aa", {
                lat: JSON.parse(thing.location).lat,
                lng: JSON.parse(thing.location).lng,
              });
              return (
                <Marker
                  icon={{
                    url: "/marker.png",
                    scaledSize: new google.maps.Size(30, 30),
                  }}
                  // label={thing.Address}
                  position={{
                    lat: JSON.parse(thing.location).lat,
                    lng: JSON.parse(thing.location).lng,
                  }}
                  onClick={() => {
                    router.push(`/post/${thing.id}`);
                  }}
                />
              );
            })}
      </GoogleMap>
      {/* <div className="flex"> */}
      <div className="z-1 divide-y-1 fixed bottom-0 left-0 h-[92vh] w-full max-w-lg space-y-4 divide-gray-100 overflow-y-scroll border-gray-100 bg-white p-4">
        {!geolocation.error &&
          props.places
            .filter((item) => {
              console.log(JSON.parse(item.location).lat);
              return (
                getDistance(
                  {
                    latitude: JSON.parse(item.location).lat,
                    longitude: JSON.parse(item.location).lng,
                  },
                  // geolocation.error
                  // ?
                  // { latitude: 37.7749, longitude: -122.4194 },
                  // :
                  {
                    latitude: geolocation.latitude || 0,
                    longitude: geolocation.longitude || 0,
                  },
                  1
                ) <= 16500
              );
            })
            .sort((b: any, a: any) => {
              return (
                getDistance(
                  {
                    latitude: JSON.parse(b.location).lat,
                    longitude: JSON.parse(b.location).lng,
                  },
                  // geolocation.error
                  // ?
                  // { latitude: 37.7749, longitude: -122.4194 },
                  // :
                  {
                    latitude: geolocation.latitude || 0,
                    longitude: geolocation.longitude || 0,
                  },
                  1
                ) -
                getDistance(
                  {
                    latitude: JSON.parse(a.location).lat,
                    longitude: JSON.parse(a.location).lng,
                  },
                  // geolocation.error
                  // ?
                  // { latitude: 37.7749, longitude: -122.4194 },
                  // :
                  {
                    latitude: geolocation.latitude || 0,
                    longitude: geolocation.longitude || 0,
                  },
                  1
                )
              );
            })
            .map((thing, i) => {
              // const refListCopy = [...refList];
              // const refListClone = { ...refList };

              // const reffy: any = React.createRef();

              // refListClone[thing.id] = reffy;

              // setRefList({ ...refListClone });

              return (
                <a href={`/post/${thing.id}`} rel="noopener">
                  <div className="flex space-x-[10px] rounded-lg px-4 py-4 pt-4 hover:bg-zinc-200">
                    <HiMapPin size={32} color="#FF6B00" />
                    <div>
                      <h1 className="text-2xl font-bold">{thing.Address}</h1>
                      {/* <p className="-mt-[4px] text-[15px] font-medium italic text-[#757575]">
                      ${thing.pricePerHour}/hr
                    </p> */}
                      <p className="-mt-[4px] text-[14px] font-bold text-[#636363]">
                        ${thing.pricePerHour}/hr •{" "}
                        {(
                          getDistance(
                            {
                              latitude: JSON.parse(thing.location).lat,
                              longitude: JSON.parse(thing.location).lng,
                            },
                            // geolocation.error
                            // ?
                            // { latitude: 37.7749, longitude: -122.4194 },
                            // :
                            {
                              latitude: geolocation.latitude || 0,
                              longitude: geolocation.longitude || 0,
                            },
                            1
                          ) * 0.000621371
                        ).toFixed(1)}
                        {" miles"} •{" "}
                        {thing.teslaOnly ? "Only Teslas" : "All EVs"}
                      </p>
                      <div className="mt-4 grid grid-cols-2">
                        <div className="">
                          <div className="flex space-x-3">
                            <HiLightningBolt size={20} />
                            <p className="font-medium">{thing.kW}kW</p>
                          </div>
                          <div className="flex space-x-3">
                            {thing.indoors ? (
                              <HiHome size={20} />
                            ) : (
                              <HiCloud size={20} />
                            )}
                            <p className="font-medium">
                              {thing.indoors ? "Indoors" : "Outdoors"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <div className="flex space-x-3">
                            <AiFillCar size={20} />
                            <p className="font-medium">
                              {thing.teslaOnly ? "Only Teslas" : "All Cars"}
                            </p>
                          </div>
                          <div className="flex space-x-3">
                            <HiLockClosed size={20} />
                            <p className="font-medium">
                              {thing.selfCheckIn
                                ? "Self Check-in with PIN"
                                : "Check-in with owner"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
      </div>
      {/* </div> */}
    </main>
  );
}

export async function getServerSideProps(context: any) {
  const places = await db.post.findMany({});
  console.log(places);
  return {
    props: {
      places,
      // coords: {
      //   lat: coordsResult.data.lat || null,
      //   lng: coordsResult.data.long || null,
      // },
    },
  };
}
