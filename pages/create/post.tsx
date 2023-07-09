// import { GoogleMap, useLoadScript } from "@react-google-maps/api";
// import { useMemo } from "react";
import { useState } from "react";
import AutoComplete from "react-google-autocomplete";

export interface GoogleMapsLocation {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  html_attributions: any[];
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface Geometry {
  location: Location;
}

export interface Location {
  //   hi: number;
  lat: number;
  lng: number;
}

export default function CreatePost() {
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");

  const [energyOutput, setEnergyOutput] = useState<number>();
  const [indoors, setIndoors] = useState<boolean>();
  const [teslaOnly, setTeslaOnly] = useState<boolean>();
  const [selfCheckIn, setSelfCheckIn] = useState<boolean>();
  const [pricePerHour, setPricePerHour] = useState<number>();

  return (
    <main>
      <div>
        <h1 className="text-5xl font-bold">Create Post</h1>

        <AutoComplete
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}
          onPlaceSelected={(place: GoogleMapsLocation) => {
            console.log(place);
            setAddress(
              `${place.address_components[0].short_name}, ${place.address_components[1].short_name}`
            );

            setLocation(
              JSON.stringify({
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
              })
            );

            // setAddress(place.);
          }}
          className={
            "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          }
          options={{
            types: ["address"],
          }}
        />

        {/* <ReactGoogleAutocomplete
            placeholder="5353 Sunol Blvd, Pleasanton"
            className="appearance-none rounded-lg border-2 border-gray-100 px-4 py-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}
            onPlaceSelected={(place) => {
              setFormattedName(place.formatted_address);
              setLatitude(place.geometry.location.lat);
              setLongitude(place.geometry.location.lng);
            }}
            defaultValue={formattedName}
           
          /> */}

        <div>
          <label className="font-bold">Energy output (kW)</label>
          <input
            placeholder="45"
            onChange={(e) => {
              setEnergyOutput(parseInt(e.target.value));
            }}
            type={"number"}
            className={
              "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            }
          />
        </div>

        <div>
          <label className="font-bold">Price per hour ($)</label>

          <input
            placeholder="$2.50"
            onChange={(e) => {
              setPricePerHour(parseFloat(e.target.value));
            }}
            type={"number"}
            className={
              "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            }
          />
        </div>

        <div>
          <label className="font-bold">
            Is this charging point covered or indoors?
          </label>

          {/* <input
            placeholder="$2.50"
            type={"sel"}
            className={
              "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            }
          /> */}

          <select
            onChange={(e) => {
              setIndoors(e.target.value === "true");
            }}
            className={
              "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            }
          >
            <option value={"true"}>Indoors</option>
            <option value={"false"}>Covered</option>
          </select>
        </div>

        <div>
          <label className="font-bold">Charger Compatibility?</label>

          {/* <input
            placeholder="$2.50"
            type={"sel"}
            className={
              "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            }
          /> */}

          <select
            onChange={(e) => {
              setTeslaOnly(e.target.value === "yes");
            }}
            className={
              "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            }
          >
            <option value="yes">Only Teslas</option>
            <option value="no">All Cars</option>
          </select>
        </div>

        <div>
          <label className="font-bold">Check In Options</label>

          {/* <input
            placeholder="$2.50"
            type={"sel"}
            className={
              "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            }
          /> */}

          <select
            onChange={(e) => {
              setSelfCheckIn(e.target.value == "no");
            }}
            className={
              "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            }
          >
            <option value="yes">Check in with me first</option>
            <option value="no">Auto check in with PIN</option>
          </select>
        </div>

        <button
          onClick={() => {}}
          className="focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
        >
          Create Posting
        </button>
      </div>
    </main>
  );
}
