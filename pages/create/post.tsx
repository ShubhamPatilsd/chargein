// import { GoogleMap, useLoadScript } from "@react-google-maps/api";
// import { useMemo } from "react";
import axios from "axios";
import { useS3Upload } from "next-s3-upload";
import { useState } from "react";
import { getSession } from "next-auth/react";
import AutoComplete from "react-google-autocomplete";
import { db } from "../../db/db";
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
  lat: any;
  lng: any;
}

export default function CreatePost() {
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState<any>({});

  const [energyOutput, setEnergyOutput] = useState<number>();
  const [indoors, setIndoors] = useState<boolean>();
  const [teslaOnly, setTeslaOnly] = useState<boolean>();
  const [selfCheckIn, setSelfCheckIn] = useState<boolean>();
  const [pricePerHour, setPricePerHour] = useState<number>();
  const [description, setDescription] = useState<string>();
  let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

  const [imageUrl, setImageUrl] = useState(
    "https://v1.tailwindcss.com/_next/static/media/tailwind-ui-sidebar.2ccd3a8ec5f31f428204b5c3c4d9a485.png"
  );

  let handleFileChange = async (file: any) => {
    let { url } = await uploadToS3(file);

    setImageUrl(url);
  };

  return (
    <main>
      <div className="my-20 space-y-4 px-48">
        <h1 className="text-5xl font-bold">Create Post</h1>

        <div>
          <label className="font-bold">Location of Charger</label>
          <AutoComplete
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}
            onPlaceSelected={(place: GoogleMapsLocation) => {
              console.log(place);

              setAddress(
                `${place.address_components[0].short_name} ${place.address_components[1].short_name}`
              );

              setLocation(
                //   JSON.stringify(
                {
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                }
              );

              console.log(
                JSON.stringify({
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                })
              );

              // setAddress(place.);
            }}
            className={
              "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring mb-6 flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
          <div className="mb-4">
            <label className="font-bold">Energy output (kW)</label>
            <input
              required
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
          <div className="mb-4">
            <label className="font-bold">Price per hour ($)</label>

            <input
              placeholder="2.50"
              required
              onChange={(e) => {
                console.log(parseFloat(e.target.value));
                setPricePerHour(e.target.value);
              }}
              type={"number"}
              className={
                "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              }
            />
          </div>
          <div className="mb-4">
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
              required
              className={
                "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              }
            >
              <option value={"true"}>Indoors</option>
              <option value={"false"}>Covered</option>
            </select>
          </div>
          <div className="mb-4">
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
              required
            >
              <option value="yes">Only Teslas</option>
              <option value="no">All Cars</option>
            </select>
          </div>
          <div className="mb-4">
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
              required
            >
              <option value="yes">Check in with me first</option>
              <option value="no">Auto check in with PIN</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="font-bold">Description</label>
            <textarea
              required
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="mb-12 flex flex-col">
            <label className="font-bold">Upload Image</label>
            <div className="relative mt-1 rounded-md">
              <FileInput onChange={handleFileChange} />

              <button onClick={openFileDialog}>Browse files</button>

              {imageUrl && <img src={imageUrl} />}
            </div>
          </div>

          {address == "" || imageUrl == "" ? (
            <button
              //   type="submit"
              className={
                "focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md bg-black/90 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
              }
              disabled
            >
              Create Posting
            </button>
          ) : (
            <button
              onClick={async () => {
                await axios({
                  method: "POST",
                  url: "/api/create/post",
                  data: {
                    location: location,
                    kW: energyOutput,
                    indoor: indoors,
                    pricePerHour,
                    teslaOnly,
                    selfCheckIn,
                    description,
                    Address: address,
                    imageUrl,
                  },
                });
              }}
              className={
                "focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
              }
            >
              Create Posting hi
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    const email = session?.user?.email ?? undefined;

    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user?.isSeller) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    } else {
      return {
        props: {},
      };
    }
  }
}
