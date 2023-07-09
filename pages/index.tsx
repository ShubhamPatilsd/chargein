import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { getSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { db } from "../db/db";
import useGeolocation from "react-hook-geolocation";
import axios from "axios";

export default function Home(props: any) {
  const geolocation = useGeolocation();
  const libraries = useMemo(() => ["places"], []);

  const [mapCenter, setMapCenter] = useState<any>();

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
        mapContainerClassName="w-screen absolute z-0 min-h-screen"
        onLoad={() => console.log("Map Component Loaded...")}
      />
      {/* <div className="flex"> */}
      <div className="z-1 fixed top-0 left-0 h-screen w-full max-w-xs bg-white p-4">
        {/* {props.places.filter((item)=>{return }).map(()=><div>
          <h1 className="text-2xl font-bold">5353 Sunol Blvd</h1>
        </div>)} */}
      </div>
      {/* </div> */}
    </main>
  );
}

export async function getServerSideProps(context: any) {
  const places = await db.post.findMany({});

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
