import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";

export default function Home() {
  const libraries = useMemo(() => ["places"], []);
  const mapCenter = useMemo(
    () => ({ lat: 27.672932021393862, lng: 85.31184012689732 }),
    []
  );

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
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
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerClassName="w-screen absolute z-0 min-h-screen"
        onLoad={() => console.log("Map Component Loaded...")}
      />
      {/* <div className="flex"> */}
      <div className="z-1 fixed top-0 left-0 h-screen w-full max-w-xs bg-white p-4">
        <div>
          <h1 className="text-3xl font-bold">5353 Sunol Blvd</h1>
        </div>
      </div>
      {/* </div> */}
    </main>
  );
}
