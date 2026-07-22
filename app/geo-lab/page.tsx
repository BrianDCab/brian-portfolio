/* eslint-disable @typescript-eslint/no-explicit-any -- ArcGIS loads from the CDN at runtime so there are no local types for it */
"use client";

import Link from "next/link";
import {
  Activity,
  CheckCircle2,
  CircleDot,
  Compass,
  Construction,
  Crosshair,
  Eye,
  Globe2,
  LocateFixed,
  MapPinned,
  Mountain,
  Navigation,
  Radio,
  RefreshCcw,
  Search,
  ShieldCheck,
  SquareMousePointer,
  StopCircle,
  Waves,
} from "lucide-react";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

type ConsentState = "not-asked" | "accepted" | "declined";

type GeofenceState =
  | "No boundary"
  | "Waiting for location"
  | "Inside"
  | "Approaching"
  | "Outside"
  | "Uncertain";

type BasemapChoice = "satellite" | "topo-vector" | "streets-3d";

type SelectedLocation = {
  latitude: number;
  longitude: number;
  label: string;
  source: "Address search" | "Map selection" | "Device location" | "Demo";
};

type DeviceLocation = {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  timestamp: number;
};

type ElevationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; meters: number }
  | { status: "error"; message: string };

type GeofenceEvent = {
  id: string;
  time: string;
  state: Exclude<GeofenceState, "No boundary" | "Waiting for location">;
  distanceMiles: number;
  source: "Live" | "Demo";
};

type ArcGISSelectionHandler = (
  point: unknown,
  source: SelectedLocation["source"],
  label: string
) => Promise<void>;

const glassPanel =
  "rounded-lg border border-white/10 bg-zinc-950/70 shadow-2xl shadow-black/40 backdrop-blur-md";

const glassCard =
  "rounded-lg border border-white/10 bg-zinc-950/60 backdrop-blur-md";

const locatorUrl =
  "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";

const demoLocation: SelectedLocation = {
  latitude: 33.9425,
  longitude: -117.2297,
  label: "Moreno Valley, California demo point",
  source: "Demo",
};

const METERS_PER_MILE = 1609.344;

type ArcGISRequire = (
  modules: string[],
  onLoad: (...loadedModules: any[]) => void,
  onError?: (error: unknown) => void
) => void;

type ArcGISRuntime = {
  esriConfig: any;
  ArcGISMap: any;
  SceneView: any;
  GraphicsLayer: any;
  Graphic: any;
  Point: any;
  Circle: any;
  locator: any;
};

const ARCGIS_VERSION = "4.32";
const ARCGIS_SCRIPT_ID = "arcgis-runtime-script";
const ARCGIS_CSS_ID = "arcgis-runtime-css";

let arcGISRuntimePromise: Promise<ArcGISRuntime> | null = null;

function getArcGISRequire() {
  return (window as typeof window & { require?: ArcGISRequire }).require;
}

function loadArcGISCssOnce() {
  if (document.getElementById(ARCGIS_CSS_ID)) return;

  const link = document.createElement("link");
  link.id = ARCGIS_CSS_ID;
  link.rel = "stylesheet";
  link.href = `https://js.arcgis.com/${ARCGIS_VERSION}/esri/themes/dark/main.css`;
  document.head.appendChild(link);
}

function requireArcGISModules(): Promise<ArcGISRuntime> {
  return new Promise((resolve, reject) => {
    const arcGISRequire = getArcGISRequire();

    if (!arcGISRequire) {
      reject(new Error("The ArcGIS runtime loaded without an AMD module loader."));
      return;
    }

    arcGISRequire(
      [
        "esri/config",
        "esri/Map",
        "esri/views/SceneView",
        "esri/layers/GraphicsLayer",
        "esri/Graphic",
        "esri/geometry/Point",
        "esri/geometry/Circle",
        "esri/rest/locator",
      ],
      (
        esriConfig,
        ArcGISMap,
        SceneView,
        GraphicsLayer,
        Graphic,
        Point,
        Circle,
        locator
      ) => {
        resolve({
          esriConfig,
          ArcGISMap,
          SceneView,
          GraphicsLayer,
          Graphic,
          Point,
          Circle,
          locator,
        });
      },
      reject
    );
  });
}

function loadArcGISRuntime(): Promise<ArcGISRuntime> {
  if (arcGISRuntimePromise) return arcGISRuntimePromise;

  arcGISRuntimePromise = new Promise<ArcGISRuntime>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("ArcGIS can only load in the browser."));
      return;
    }

    loadArcGISCssOnce();

    const loadModules = () => {
      void requireArcGISModules().then(resolve).catch(reject);
    };

    if (getArcGISRequire()) {
      loadModules();
      return;
    }

    const existingScript = document.getElementById(
      ARCGIS_SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", loadModules, { once: true });
      existingScript.addEventListener(
        "error",
        () => {
          existingScript.remove();
          reject(new Error("The ArcGIS CDN script failed to load."));
        },
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.id = ARCGIS_SCRIPT_ID;
    script.src = `https://js.arcgis.com/${ARCGIS_VERSION}/`;
    script.async = true;
    script.addEventListener("load", loadModules, { once: true });
    script.addEventListener(
      "error",
      () => {
        script.remove();
        reject(new Error("The ArcGIS CDN script failed to load."));
      },
      { once: true }
    );
    document.head.appendChild(script);
  }).catch((error) => {
    arcGISRuntimePromise = null;
    throw error;
  });

  return arcGISRuntimePromise;
}

function formatCoordinates(value: number) {
  return value.toFixed(5);
}

function formatMiles(value: number | null) {
  if (value === null) return "Not available";
  if (value < 0.1) return `${Math.round(value * 5280)} feet`;
  return `${value.toFixed(2)} miles`;
}

function formatElevation(elevation: ElevationState) {
  if (elevation.status === "idle") return "Not selected";
  if (elevation.status === "loading") return "Loading terrain";
  if (elevation.status === "error") return "Unavailable";

  const feet = elevation.meters * 3.28084;

  return `${Math.round(elevation.meters).toLocaleString()} m • ${Math.round(
    feet
  ).toLocaleString()} ft`;
}

function haversineMiles(
  firstLatitude: number,
  firstLongitude: number,
  secondLatitude: number,
  secondLongitude: number
) {
  const earthRadiusMiles = 3958.7613;
  const toRadians = (value: number) => (value * Math.PI) / 180;

  const latitudeDifference = toRadians(secondLatitude - firstLatitude);
  const longitudeDifference = toRadians(secondLongitude - firstLongitude);

  const firstLatitudeRadians = toRadians(firstLatitude);
  const secondLatitudeRadians = toRadians(secondLatitude);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(firstLatitudeRadians) *
      Math.cos(secondLatitudeRadians) *
      Math.sin(longitudeDifference / 2) ** 2;

  const clampedA = Math.min(1, Math.max(0, a));

  return 2 * earthRadiusMiles * Math.asin(Math.sqrt(clampedA));
}

function Button({
  children,
  onClick,
  active = false,
  disabled = false,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
        active
          ? "border border-accent-400/60 bg-accent-500/90 text-white shadow-[0_0_22px_rgba(34,211,238,0.28)]"
          : "border border-accent-300/25 bg-black/25 text-accent-100 hover:border-accent-300/55 hover:bg-accent-400/10"
      } disabled:cursor-not-allowed disabled:opacity-45`}
    >
      {children}
    </button>
  );
}

function StatBox({
  label,
  value,
  accent = false,
  description,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  description?: string;
}) {
  return (
    <div
      className={`min-w-0 rounded-md border p-4 ${
        accent
          ? "border-accent-300/40 bg-accent-300/10 shadow-[0_0_24px_rgba(34,211,238,0.10)]"
          : "border-accent-300/15 bg-black/25"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300/80">
        {label}
      </p>

      <p
        className={`mt-2 break-words font-semibold leading-tight ${
          accent ? "text-2xl text-accent-100" : "text-xl text-white"
        }`}
      >
        {value}
      </p>

      {description && (
        <p className="mt-2 text-xs leading-5 text-zinc-400">{description}</p>
      )}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
        {title}
      </h2>

      <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-300 md:text-base">
        {text}
      </p>
    </div>
  );
}

export default function GeoLabPage() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const graphicsLayerRef = useRef<any>(null);
  const selectedGraphicRef = useRef<any>(null);
  const deviceGraphicRef = useRef<any>(null);
  const geofenceGraphicRef = useRef<any>(null);
  const ArcGISPointRef = useRef<any>(null);
  const ArcGISCircleRef = useRef<any>(null);
  const ArcGISGraphicRef = useRef<any>(null);
  const locatorRef = useRef<any>(null);
  const selectionHandlerRef = useRef<ArcGISSelectionHandler | null>(null);
  const clickSelectionEnabledRef = useRef(false);
  const watchIdRef = useRef<number | null>(null);
  const previousGeofenceStateRef = useRef<
    Exclude<GeofenceState, "No boundary" | "Waiting for location"> | null
  >(null);

  const [mapRequested, setMapRequested] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapMessage, setMapMessage] = useState(
    "ArcGIS is fully paused. No map runtime, map CSS, scene, or map service is loaded until activation."
  );
  const [basemap, setBasemap] = useState<BasemapChoice>("satellite");
  const [clickSelectionEnabled, setClickSelectionEnabled] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);

  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);
  const [elevation, setElevation] = useState<ElevationState>({
    status: "idle",
  });

  const [consentState, setConsentState] =
    useState<ConsentState>("not-asked");
  const [deviceLocation, setDeviceLocation] =
    useState<DeviceLocation | null>(null);
  const [locationMessage, setLocationMessage] = useState(
    "Location is off. I do not request it until you press a location button."
  );
  const [liveTracking, setLiveTracking] = useState(false);

  const [geofenceRadiusMiles, setGeofenceRadiusMiles] = useState(1);
  const deferredGeofenceRadiusMiles = useDeferredValue(geofenceRadiusMiles);
  const [eventLog, setEventLog] = useState<GeofenceEvent[]>([]);

  const apiKey = process.env.NEXT_PUBLIC_ARCGIS_API_KEY;

  useEffect(() => {
    clickSelectionEnabledRef.current = clickSelectionEnabled;
  }, [clickSelectionEnabled]);

  useEffect(() => {
    let cancelled = false;
    let clickHandle: { remove: () => void } | null = null;

    async function initializeMap() {
      if (!mapRequested || !mapContainerRef.current) return;

      setMapLoading(true);

      if (!apiKey) {
        setMapMessage(
          "The ArcGIS API key is missing. Add NEXT_PUBLIC_ARCGIS_API_KEY before activating the map."
        );
        setMapLoading(false);
        setMapRequested(false);
        return;
      }

      try {
        const {
          esriConfig,
          ArcGISMap,
          SceneView,
          GraphicsLayer,
          Graphic,
          Point,
          Circle,
          locator,
        } = await loadArcGISRuntime();

        if (cancelled || !mapContainerRef.current) return;

        esriConfig.apiKey = apiKey;
        esriConfig.applicationName = "BrianCabrera.io Geo Lab";

        ArcGISPointRef.current = Point;
        ArcGISCircleRef.current = Circle;
        ArcGISGraphicRef.current = Graphic;
        locatorRef.current = locator;

        const graphicsLayer = new GraphicsLayer({
          title: "Geo Lab graphics",
          elevationInfo: {
            mode: "on-the-ground",
          },
        });

        const map = new ArcGISMap({
          basemap: "satellite",
          ground: "world-elevation",
          layers: [graphicsLayer],
        });

        const view = new SceneView({
          container: mapContainerRef.current,
          map,
          qualityProfile: window.matchMedia("(max-width: 768px)").matches
            ? "low"
            : "medium",
          camera: {
            position: {
              longitude: -117.2297,
              latitude: 33.9425,
              z: 18000,
            },
            heading: 15,
            tilt: 58,
          },
          popupEnabled: false,
        });

        viewRef.current = view;
        mapRef.current = map;
        graphicsLayerRef.current = graphicsLayer;

        selectionHandlerRef.current = async (
          pointValue: unknown,
          source: SelectedLocation["source"],
          label: string
        ) => {
          const point = pointValue as {
            latitude?: number;
            longitude?: number;
            z?: number;
          };

          const latitude = Number(point.latitude);
          const longitude = Number(point.longitude);

          if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
            setMapMessage("I could not read a valid point from that selection.");
            return;
          }

          setSelectedLocation({
            latitude,
            longitude,
            label,
            source,
          });

          setElevation({ status: "loading" });

          const selectedPoint = new Point({
            latitude,
            longitude,
          });

          if (selectedGraphicRef.current) {
            selectedGraphicRef.current.geometry = selectedPoint;
          } else {
            const selectedGraphic = new Graphic({
              geometry: selectedPoint,
              symbol: {
                type: "simple-marker",
                color: [34, 211, 238, 1],
                size: 13,
                outline: {
                  color: [255, 255, 255, 1],
                  width: 2,
                },
              },
            });

            selectedGraphicRef.current = selectedGraphic;
            graphicsLayer.add(selectedGraphic);
          }

          await view.goTo(
            {
              target: selectedPoint,
              zoom: 14,
              tilt: 65,
              heading: 20,
            },
            {
              duration: 1200,
            }
          );

          let elevationFound = false;

          for (let attempt = 0; attempt < 8; attempt += 1) {
            const sampler = view.groundView?.elevationSampler;

            if (sampler) {
              const elevatedPoint = sampler.queryElevation(selectedPoint);
              const elevationMeters = Number(elevatedPoint?.z);

              if (Number.isFinite(elevationMeters)) {
                setElevation({
                  status: "success",
                  meters: elevationMeters,
                });
                elevationFound = true;
                break;
              }
            }

            await new Promise((resolve) => window.setTimeout(resolve, 250));
          }

          if (!elevationFound) {
            setElevation({
              status: "error",
              message: "Elevation was unavailable for this point.",
            });
          }

          setMapMessage(
            `${label} is selected. The scene is tilted so the terrain surface is easier to inspect.`
          );
        };

        clickHandle = view.on("click", (event: { mapPoint?: unknown }) => {
          if (!clickSelectionEnabledRef.current || !event.mapPoint) return;

          void selectionHandlerRef.current?.(
            event.mapPoint,
            "Map selection",
            "Point selected directly from the map"
          );

          setClickSelectionEnabled(false);
        });

        await view.when();

        if (cancelled) return;

        setMapReady(true);
        setMapLoading(false);
        setMapMessage(
          "Geo Lab is active. Search an address, use the demo point, or select directly on the map."
        );

        await selectionHandlerRef.current?.(
          new Point({
            latitude: demoLocation.latitude,
            longitude: demoLocation.longitude,
          }),
          demoLocation.source,
          demoLocation.label
        );
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setMapLoading(false);
          setMapRequested(false);
          setMapMessage(
            "The map could not start. Check the ArcGIS key, allowed referrers, connection, and browser console."
          );
        }
      }
    }

    void initializeMap();

    return () => {
      cancelled = true;
      clickHandle?.remove();

      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      viewRef.current?.destroy();
      viewRef.current = null;
      mapRef.current = null;
      graphicsLayerRef.current = null;
    };
  }, [apiKey, mapRequested]);

  useEffect(() => {
    if (
      !mapReady ||
      !selectedLocation ||
      !graphicsLayerRef.current ||
      !ArcGISCircleRef.current ||
      !ArcGISGraphicRef.current
    ) {
      return;
    }

    const graphicsLayer = graphicsLayerRef.current;

    if (geofenceGraphicRef.current) {
      graphicsLayer.remove(geofenceGraphicRef.current);
    }

    const Circle = ArcGISCircleRef.current;
    const Graphic = ArcGISGraphicRef.current;

    const circle = new Circle({
      center: [selectedLocation.longitude, selectedLocation.latitude],
      geodesic: true,
      radius: deferredGeofenceRadiusMiles,
      radiusUnit: "miles",
      numberOfPoints: 72,
    });

    if (geofenceGraphicRef.current) {
      geofenceGraphicRef.current.geometry = circle;
    } else {
      const graphic = new Graphic({
        geometry: circle,
        symbol: {
          type: "simple-fill",
          color: [34, 211, 238, 0.11],
          outline: {
            color: [34, 211, 238, 0.95],
            width: 2,
          },
        },
      });

      geofenceGraphicRef.current = graphic;
      graphicsLayer.add(graphic);
    }

    previousGeofenceStateRef.current = null;
  }, [
    mapReady,
    selectedLocation?.latitude,
    selectedLocation?.longitude,
    deferredGeofenceRadiusMiles,
  ]);

  useEffect(() => {
    if (
      !mapReady ||
      !deviceLocation ||
      !graphicsLayerRef.current ||
      !ArcGISPointRef.current ||
      !ArcGISGraphicRef.current
    ) {
      return;
    }

    const graphicsLayer = graphicsLayerRef.current;

    const Point = ArcGISPointRef.current;
    const Graphic = ArcGISGraphicRef.current;

    const point = new Point({
      latitude: deviceLocation.latitude,
      longitude: deviceLocation.longitude,
    });

    if (deviceGraphicRef.current) {
      deviceGraphicRef.current.geometry = point;
    } else {
      const graphic = new Graphic({
        geometry: point,
        symbol: {
          type: "simple-marker",
          color: [74, 222, 128, 1],
          size: 12,
          outline: {
            color: [255, 255, 255, 1],
            width: 2,
          },
        },
      });

      deviceGraphicRef.current = graphic;
      graphicsLayer.add(graphic);
    }
  }, [deviceLocation, mapReady]);

  const distanceFromBoundaryCenter = useMemo(() => {
    if (!selectedLocation || !deviceLocation) return null;

    return haversineMiles(
      selectedLocation.latitude,
      selectedLocation.longitude,
      deviceLocation.latitude,
      deviceLocation.longitude
    );
  }, [selectedLocation, deviceLocation]);

  const geofenceState = useMemo<GeofenceState>(() => {
    if (!selectedLocation) return "No boundary";

    if (!deviceLocation || distanceFromBoundaryCenter === null) {
      return "Waiting for location";
    }

    const radiusMeters = geofenceRadiusMiles * METERS_PER_MILE;
    const distanceMeters = distanceFromBoundaryCenter * METERS_PER_MILE;
    const distanceFromEdgeMeters = Math.abs(distanceMeters - radiusMeters);

    if (deviceLocation.accuracyMeters >= distanceFromEdgeMeters) {
      return "Uncertain";
    }

    if (distanceMeters <= radiusMeters) return "Inside";

    if (distanceMeters <= radiusMeters * 1.25) return "Approaching";

    return "Outside";
  }, [
    selectedLocation,
    deviceLocation,
    distanceFromBoundaryCenter,
    geofenceRadiusMiles,
  ]);

  useEffect(() => {
    if (
      !liveTracking ||
      distanceFromBoundaryCenter === null ||
      geofenceState === "No boundary" ||
      geofenceState === "Waiting for location"
    ) {
      return;
    }

    const currentState: GeofenceEvent["state"] = geofenceState;
    const previousState = previousGeofenceStateRef.current;

    if (previousState === currentState) return;

    previousGeofenceStateRef.current = currentState;

    const nextEvent: GeofenceEvent = {
      id: `${Date.now()}-${currentState}`,
      time: new Date().toLocaleTimeString(),
      state: currentState,
      distanceMiles: distanceFromBoundaryCenter,
      source: "Live",
    };

    setEventLog((current) => [nextEvent, ...current].slice(0, 12));
  }, [liveTracking, geofenceState, distanceFromBoundaryCenter]);

  const terrainExplanation = useMemo(() => {
    if (!selectedLocation) {
      return "Choose a point before interpreting the terrain.";
    }

    if (elevation.status === "loading") {
      return "The scene is showing the terrain surface, but the point elevation is still loading.";
    }

    if (elevation.status === "error") {
      return elevation.message;
    }

    if (elevation.status !== "success") {
      return "No elevation has been read yet.";
    }

    const feet = elevation.meters * 3.28084;

    if (feet >= 5000) {
      return `This point is about ${Math.round(
        feet
      ).toLocaleString()} feet above sea level. High elevation can affect weather, road grade, emergency access, and seasonal conditions.`;
    }

    if (feet >= 1500) {
      return `This point is about ${Math.round(
        feet
      ).toLocaleString()} feet above sea level. The tilted scene can help reveal nearby ridges, valleys, and access challenges.`;
    }

    if (feet >= 300) {
      return `This point is about ${Math.round(
        feet
      ).toLocaleString()} feet above sea level. Elevation helps with context, but slope, drainage, roads, and hazards still matter.`;
    }

    return `This point is about ${Math.round(
      feet
    ).toLocaleString()} feet above sea level. Low elevation does not automatically mean flood risk, but flood zones and drainage would be important follow-up layers.`;
  }, [selectedLocation, elevation]);

  const geofenceExplanation = useMemo(() => {
    if (!selectedLocation) {
      return "No geofence exists yet because no center point has been selected.";
    }

    if (!deviceLocation || distanceFromBoundaryCenter === null) {
      return `A ${geofenceRadiusMiles.toFixed(
        1
      )} mile boundary is drawn around the selected point. Device location is off, so the page cannot compare the visitor with the boundary.`;
    }

    if (geofenceState === "Uncertain") {
      return `The device reading is ${formatMiles(
        distanceFromBoundaryCenter
      )} from the center, but the browser reports about ${Math.round(
        deviceLocation.accuracyMeters
      )} meters of possible error. The reading is too close to the boundary edge to call confidently.`;
    }

    if (geofenceState === "Inside") {
      return `The device reading is ${formatMiles(
        distanceFromBoundaryCenter
      )} from the center, which places it inside the ${geofenceRadiusMiles.toFixed(
        1
      )} mile boundary.`;
    }

    if (geofenceState === "Approaching") {
      return `The device reading is ${formatMiles(
        distanceFromBoundaryCenter
      )} from the center. It is outside the boundary but close enough to be treated as approaching.`;
    }

    return `The device reading is ${formatMiles(
      distanceFromBoundaryCenter
    )} from the center, which places it outside the ${geofenceRadiusMiles.toFixed(
      1
    )} mile boundary.`;
  }, [
    selectedLocation,
    deviceLocation,
    distanceFromBoundaryCenter,
    geofenceRadiusMiles,
    geofenceState,
  ]);

  async function searchAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!mapReady) {
      setMapMessage("Activate Geo Lab before using ArcGIS search.");
      return;
    }

    if (!searchText.trim()) {
      setMapMessage("Enter an address, city, landmark, or place name.");
      return;
    }

    if (!locatorRef.current || !ArcGISPointRef.current) {
      setMapMessage("The ArcGIS search service is still loading.");
      return;
    }

    setSearching(true);
    setMapMessage(`Searching for ${searchText.trim()}.`);

    try {
      const candidates = await locatorRef.current.addressToLocations(
        locatorUrl,
        {
          address: {
            SingleLine: searchText.trim(),
          },
          outFields: ["Match_addr", "Addr_type"],
          maxLocations: 5,
        }
      );

      const firstCandidate = candidates?.[0];

      if (!firstCandidate?.location) {
        setMapMessage(
          "No matching place was found. Try a more complete address or nearby landmark."
        );
        return;
      }

      await selectionHandlerRef.current?.(
        firstCandidate.location,
        "Address search",
        firstCandidate.address || searchText.trim()
      );
    } catch (error) {
      console.error(error);
      setMapMessage(
        "The address search failed. Check the API key privileges and try again."
      );
    } finally {
      setSearching(false);
    }
  }

  async function loadDemoPoint() {
    if (!mapReady || !ArcGISPointRef.current) return;

    const Point = ArcGISPointRef.current;

    await selectionHandlerRef.current?.(
      new Point({
        latitude: demoLocation.latitude,
        longitude: demoLocation.longitude,
      }),
      demoLocation.source,
      demoLocation.label
    );
  }

  function updateDeviceLocation(position: GeolocationPosition) {
    const nextLocation: DeviceLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracyMeters: position.coords.accuracy,
      timestamp: position.timestamp,
    };

    setDeviceLocation(nextLocation);
    setLocationMessage(
      `Location received with an estimated accuracy of ${Math.round(
        position.coords.accuracy
      )} meters.`
    );
  }

  function handleLocationError(error: GeolocationPositionError) {
    const message =
      error.code === error.PERMISSION_DENIED
        ? "Location permission was denied. Search, demo point, and manual map selection still work."
        : error.code === error.POSITION_UNAVAILABLE
          ? "The device could not provide a location right now."
          : "The location request timed out. Try again or use the map manually.";

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setLocationMessage(message);
    setLiveTracking(false);
  }

  function requestOneTimeLocation() {
    if (!mapReady) {
      setLocationMessage("Activate Geo Lab before using device location.");
      return;
    }

    setConsentState("accepted");

    if (!navigator.geolocation) {
      setLocationMessage(
        "This browser does not support device location. Use address search or select a point on the map."
      );
      return;
    }

    setLocationMessage(
      "Waiting for the browser permission prompt and one location reading."
    );

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        updateDeviceLocation(position);

        if (!ArcGISPointRef.current || !viewRef.current) return;

        const Point = ArcGISPointRef.current;
        const devicePoint = new Point({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        await viewRef.current.goTo(
          {
            target: devicePoint,
            zoom: 14,
            tilt: 62,
            heading: 20,
          },
          {
            duration: 1000,
          }
        );

        setMapMessage(
          "The green marker shows the device reading. The cyan marker remains the selected geofence center."
        );
      },
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  }

  function declineLocation() {
    stopLiveTracking();
    setConsentState("declined");
    setLocationMessage(
      "Location remains off. You can still search, use the demo point, or select a point directly on the map."
    );
  }

  function startLiveTracking() {
    if (!mapReady) {
      setLocationMessage("Activate Geo Lab before starting live tracking.");
      return;
    }

    if (!selectedLocation) {
      setLocationMessage(
        "Choose a geofence center before starting live tracking."
      );
      return;
    }

    if (!navigator.geolocation) {
      setLocationMessage("This browser does not support live device location.");
      return;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setConsentState("accepted");
    setLiveTracking(true);
    previousGeofenceStateRef.current = null;
    setLocationMessage(
      "Live tracking is active while this page stays open. A new entry is added only when the boundary status changes."
    );

    watchIdRef.current = navigator.geolocation.watchPosition(
      updateDeviceLocation,
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 2000,
      }
    );
  }

  function stopLiveTracking() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setLiveTracking(false);
    previousGeofenceStateRef.current = null;
    setLocationMessage(
      "Live tracking is off. The last reading stays visible only until the page refreshes or closes."
    );
  }

  function runEventLogDemo() {
    const now = Date.now();
    const radius = geofenceRadiusMiles;

    const demoEvents: GeofenceEvent[] = [
      {
        id: `${now}-demo-inside`,
        time: new Date(now).toLocaleTimeString(),
        state: "Inside",
        distanceMiles: Math.max(0.02, radius * 0.65),
        source: "Demo",
      },
      {
        id: `${now - 10000}-demo-approaching`,
        time: new Date(now - 10000).toLocaleTimeString(),
        state: "Approaching",
        distanceMiles: radius * 1.12,
        source: "Demo",
      },
      {
        id: `${now - 20000}-demo-outside`,
        time: new Date(now - 20000).toLocaleTimeString(),
        state: "Outside",
        distanceMiles: radius * 1.6,
        source: "Demo",
      },
    ];

    setEventLog((current) => [...demoEvents, ...current].slice(0, 12));
    setLocationMessage(
      "Three simulated entries were added so you can confirm the event log display works."
    );
  }

  function clearEventLog() {
    setEventLog([]);
    previousGeofenceStateRef.current = null;
  }

  function changeBasemap(nextBasemap: BasemapChoice) {
    if (!mapRef.current) return;

    mapRef.current.basemap = nextBasemap;
    setBasemap(nextBasemap);

    const readableName =
      nextBasemap === "satellite"
        ? "satellite imagery"
        : nextBasemap === "topo-vector"
          ? "topographic mapping"
          : "three dimensional streets";

    setMapMessage(`The map now uses ${readableName}.`);
  }

  function requestMapLoad() {
    if (mapRequested) return;

    setMapRequested(true);
    setMapMessage(
      "Activating Geo Lab now. The ArcGIS browser runtime, map CSS, services, and 3D scene start only after this click."
    );
  }

  async function focusTerrain() {
    if (!viewRef.current) return;

    changeBasemap("satellite");

    const target =
      selectedLocation && ArcGISPointRef.current
        ? new ArcGISPointRef.current({
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
          })
        : viewRef.current.center;

    await viewRef.current.goTo(
      {
        target,
        zoom: selectedLocation ? 14 : 9,
        tilt: 70,
        heading: 25,
      },
      {
        duration: 1000,
      }
    );

    setMapMessage(
      "Terrain view switched to satellite imagery and tilted the camera to reveal surface shape."
    );
  }

  async function overheadView() {
    if (!viewRef.current) return;

    const target =
      selectedLocation && ArcGISPointRef.current
        ? new ArcGISPointRef.current({
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
          })
        : viewRef.current.center;

    await viewRef.current.goTo(
      {
        target,
        zoom: selectedLocation ? 14 : 9,
        tilt: 0,
        heading: 0,
      },
      {
        duration: 900,
      }
    );

    setMapMessage(
      "Overhead view is active. This is useful for reading distance and boundary shape."
    );
  }

  function resetPage() {
    stopLiveTracking();
    setConsentState("not-asked");
    setDeviceLocation(null);
    setEventLog([]);
    setGeofenceRadiusMiles(1);
    setSearchText("");
    setClickSelectionEnabled(false);
    setLocationMessage(
      "Location is off. I do not request it until you press a location button."
    );

    if (mapReady) {
      void loadDemoPoint();
    } else {
      setSelectedLocation(null);
      setElevation({ status: "idle" });
    }
  }

  function exportSnapshot() {
    const rows = [
      ["field", "value"],
      ["selected_label", selectedLocation?.label ?? ""],
      ["latitude", selectedLocation?.latitude ?? ""],
      ["longitude", selectedLocation?.longitude ?? ""],
      [
        "elevation_meters",
        elevation.status === "success" ? elevation.meters : "",
      ],
      [
        "elevation_feet",
        elevation.status === "success" ? elevation.meters * 3.28084 : "",
      ],
      ["geofence_radius_miles", geofenceRadiusMiles],
      ["device_latitude", deviceLocation?.latitude ?? ""],
      ["device_longitude", deviceLocation?.longitude ?? ""],
      ["device_accuracy_meters", deviceLocation?.accuracyMeters ?? ""],
      ["device_distance_miles", distanceFromBoundaryCenter ?? ""],
      ["boundary_status", geofenceState],
      ["captured_at", new Date().toISOString()],
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "geo-lab-site-snapshot.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const geofenceTone =
    geofenceState === "Inside"
      ? "border-green-300/30 bg-green-300/10 text-green-100"
      : geofenceState === "Approaching"
        ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-100"
        : geofenceState === "Outside"
          ? "border-red-300/30 bg-red-300/10 text-red-100"
          : geofenceState === "Uncertain"
            ? "border-orange-300/30 bg-orange-300/10 text-orange-100"
            : "border-accent-300/20 bg-black/25 text-accent-100";

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
        <div className={`${glassPanel} overflow-hidden p-6 md:p-10`}>
          <div className="relative">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-sm bg-accent-300/10 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-sm bg-emerald-300/10 blur-3xl" />

            <div className="relative">
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 rounded-sm border border-accent-300/20 bg-black/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
                  <Globe2 size={15} />
                  Geo Lab
                </div>

                <div className="inline-flex items-center gap-2 rounded-sm border border-yellow-300/30 bg-yellow-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-yellow-100">
                  <Construction size={15} />
                  Work in Progress
                </div>
              </div>

              <h1 className="mt-6 max-w-5xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Terrain, location, and geofence testing in one interactive map
              </h1>

              <p className="mt-5 max-w-4xl text-base leading-8 text-zinc-300 md:text-lg">
                I built this Geo Lab to connect map data, browser location,
                terrain elevation, and boundary logic. ArcGIS stays completely
                unloaded until the visitor activates the lab. The mapping SDK
                is fetched from the ArcGIS CDN at runtime instead of being
                bundled into the rest of my portfolio.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center gap-2 rounded-sm border border-accent-400/60 bg-accent-500/90 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-400"
                >
                  View Projects
                  <MapPinned size={16} />
                </Link>

                {mapReady ? (
                  <Button onClick={focusTerrain}>
                    <Mountain size={16} />
                    Tilt Terrain
                  </Button>
                ) : (
                  <Button onClick={requestMapLoad} disabled={mapLoading}>
                    <Mountain size={16} />
                    {mapLoading ? "Activating Lab" : "Activate Geo Lab"}
                  </Button>
                )}

                <Button onClick={resetPage}>
                  <RefreshCcw size={16} />
                  Reset Demo
                </Button>

                <Button onClick={exportSnapshot}>
                  <Activity size={16} />
                  Export Snapshot
                </Button>
              </div>
            </div>
          </div>
        </div>

        <section className={`${glassPanel} mt-8 p-5 md:p-7`}>
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-1 shrink-0 text-accent-300" size={24} />

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
                Location and privacy
              </p>

              <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
                Nothing location-related starts on page load
              </h2>

              <p className="mt-4 max-w-5xl text-sm leading-7 text-zinc-300 md:text-base">
                My application code does not request device location, download
                the ArcGIS runtime, or create the 3D scene until the visitor
                chooses to activate the lab. Device coordinates stay in
                temporary page state and are not sent to my own database.
              </p>

              <p className="mt-3 max-w-5xl text-sm leading-7 text-zinc-400">
                After activation, ArcGIS receives the normal map, imagery,
                elevation, and address-search requests required to run the map.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_420px]">
          <div className={`${glassPanel} overflow-hidden p-4 md:p-5`}>
            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
                  ArcGIS Scene
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  The 3D map appears only after activation.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  active={basemap === "satellite"}
                  onClick={() => changeBasemap("satellite")}
                  disabled={!mapReady}
                >
                  Satellite
                </Button>

                <Button
                  active={basemap === "topo-vector"}
                  onClick={() => changeBasemap("topo-vector")}
                  disabled={!mapReady}
                >
                  Topographic
                </Button>

                <Button
                  active={basemap === "streets-3d"}
                  onClick={() => changeBasemap("streets-3d")}
                  disabled={!mapReady}
                >
                  Streets
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.5rem] border border-accent-300/20 bg-black">
              <div
                ref={mapContainerRef}
                className="h-[500px] w-full md:h-[620px]"
              />

              {!mapReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/85 p-6 text-center">
                  <div className="max-w-lg">
                    {mapLoading ? (
                      <Activity
                        className="mx-auto animate-pulse text-accent-300"
                        size={30}
                      />
                    ) : (
                      <Mountain className="mx-auto text-accent-300" size={34} />
                    )}

                    <h3 className="mt-4 text-2xl font-semibold text-white">
                      {mapLoading
                        ? "Activating the interactive terrain map"
                        : "ArcGIS is currently unloaded"}
                    </h3>

                    <p
                      role="status"
                      aria-live="polite"
                      className="mt-3 text-sm leading-7 text-zinc-300"
                    >
                      {mapMessage}
                    </p>

                    {!mapLoading && (
                      <button
                        type="button"
                        onClick={requestMapLoad}
                        className="mt-5 inline-flex items-center justify-center gap-2 rounded-sm border border-accent-400/60 bg-accent-500/90 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      >
                        <Mountain size={16} />
                        Activate Geo Lab
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div
              role="status"
              aria-live="polite"
              className="mt-4 rounded-md border border-accent-300/15 bg-black/25 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-300">
                Map status
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {mapMessage}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={focusTerrain} disabled={!mapReady}>
                <Mountain size={15} />
                Tilt Terrain View
              </Button>

              <Button onClick={overheadView} disabled={!mapReady}>
                <Eye size={15} />
                Overhead View
              </Button>

              <Button
                active={clickSelectionEnabled}
                onClick={() =>
                  setClickSelectionEnabled((current) => !current)
                }
                disabled={!mapReady}
              >
                <SquareMousePointer size={15} />
                {clickSelectionEnabled
                  ? "Click the Map Now"
                  : "Select Point on Map"}
              </Button>
            </div>
          </div>

          <aside className="space-y-5">
            <div className={`${glassCard} p-5`}>
              <div className="flex items-center gap-2 text-accent-300">
                <Search size={18} />
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Choose a place
                </p>
              </div>

              <form onSubmit={searchAddress} className="mt-5">
                <label className="block">
                  <span className="text-sm font-semibold text-zinc-300">
                    Address, city, or landmark
                  </span>

                  <input
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Moreno Valley, CA"
                    className="mt-3 w-full rounded-md border border-accent-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-accent-300"
                  />
                </label>

                <button
                  type="submit"
                  disabled={searching || !mapReady}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-accent-400/60 bg-accent-500/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Search size={15} />
                  {searching ? "Searching" : "Search ArcGIS"}
                </button>
              </form>

              <div className="mt-3">
                <Button onClick={loadDemoPoint} disabled={!mapReady}>
                  <MapPinned size={15} />
                  Use Demo Point
                </Button>
              </div>
            </div>

            <div className={`${glassCard} p-5`}>
              <div className="flex items-center gap-2 text-accent-300">
                <LocateFixed size={18} />
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Device location
                </p>
              </div>

              <p className="mt-4 text-sm leading-7 text-zinc-300">
                This requests one browser location reading, places the green
                device marker, and compares it with the selected boundary.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={requestOneTimeLocation}
                  disabled={!mapReady}
                  className="inline-flex items-center justify-center gap-2 rounded-sm border border-accent-400/60 bg-accent-500/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Crosshair size={15} />
                  Use My Location Once
                </button>

                <Button onClick={declineLocation}>
                  <ShieldCheck size={15} />
                  Not Now
                </Button>
              </div>

              <p className="mt-4 text-xs leading-6 text-zinc-500">
                Consent status:{" "}
                <span className="font-semibold text-zinc-300">
                  {consentState === "not-asked"
                    ? "No choice yet"
                    : consentState === "accepted"
                      ? "Location use accepted"
                      : "Location declined"}
                </span>
              </p>
            </div>

            <div className={`${glassCard} p-5`}>
              <div className="flex items-center gap-2 text-accent-300">
                <Radio size={18} />
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Live geofence
                </p>
              </div>

              <p className="mt-4 text-sm leading-7 text-zinc-300">
                Live tracking requests updated readings only while this page is
                open. Stop tracking at any time.
              </p>

              <div className="mt-5">
                {liveTracking ? (
                  <button
                    type="button"
                    onClick={stopLiveTracking}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-red-300/30 bg-red-300/10 px-4 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-300/20"
                  >
                    <StopCircle size={16} />
                    Stop Tracking
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startLiveTracking}
                    disabled={!mapReady}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-green-300/30 bg-green-300/10 px-4 py-3 text-sm font-semibold text-green-100 transition hover:bg-green-300/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Navigation size={16} />
                    Start Live Tracking
                  </button>
                )}
              </div>

              <p className="mt-4 text-xs leading-6 text-zinc-500">
                {locationMessage}
              </p>
            </div>
          </aside>
        </section>

        <section className={`${glassPanel} mt-10 p-6 md:p-8`}>
          <SectionHeading
            eyebrow="Selected location"
            title="Site snapshot"
            text="The selected point becomes the center for terrain reading and geofence analysis. Cyan marks the selected point. Green marks the device reading after permission."
          />

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatBox
              label="Place"
              value={selectedLocation?.label ?? "No point selected"}
              accent
            />
            <StatBox
              label="Latitude"
              value={
                selectedLocation
                  ? formatCoordinates(selectedLocation.latitude)
                  : "Not available"
              }
            />
            <StatBox
              label="Longitude"
              value={
                selectedLocation
                  ? formatCoordinates(selectedLocation.longitude)
                  : "Not available"
              }
            />
            <StatBox
              label="Terrain Elevation"
              value={formatElevation(elevation)}
            />
          </div>

          <div className="mt-6 rounded-lg border border-accent-300/15 bg-black/25 p-5">
            <div className="flex items-start gap-3">
              <Mountain className="mt-1 shrink-0 text-accent-300" size={21} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
                  Terrain reading
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  {terrainExplanation}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className={`${glassPanel} p-6 md:p-8`}>
            <SectionHeading
              eyebrow="Geofence demo"
              title="Draw a boundary and compare the device with it"
              text="The selected map point is the center. The radius controls the boundary. GPS accuracy is considered before the page calls a result confidently inside or outside."
            />

            <label className="mt-7 block">
              <span className="flex items-center justify-between gap-3 text-sm font-semibold text-zinc-300">
                <span>Boundary radius</span>
                <span className="text-accent-300">
                  {geofenceRadiusMiles.toFixed(1)} miles
                </span>
              </span>

              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={geofenceRadiusMiles}
                onChange={(event) =>
                  setGeofenceRadiusMiles(Number(event.target.value))
                }
                className="mt-4 w-full accent-accent-300"
              />
            </label>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <StatBox
                label="Boundary"
                value={`${geofenceRadiusMiles.toFixed(1)} mi`}
                accent
              />
              <StatBox
                label="Device Distance"
                value={formatMiles(distanceFromBoundaryCenter)}
              />
              <div className={`rounded-md border p-4 ${geofenceTone}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Boundary Status
                </p>
                <p className="mt-2 text-2xl font-semibold">{geofenceState}</p>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-accent-300/15 bg-black/25 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
                Result
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                {geofenceExplanation}
              </p>
            </div>
          </div>

          <div className={`${glassPanel} p-6 md:p-8`}>
            <div className="flex items-center gap-3">
              <CircleDot className="text-accent-300" size={22} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
                  Event log
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  Boundary status changes
                </h3>
              </div>
            </div>

            <div className="mt-5 rounded-md border border-accent-300/15 bg-black/25 p-4">
              <p className="text-sm leading-7 text-zinc-300">
                The log adds the first live result, then another entry only when
                the status changes.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={runEventLogDemo}>
                  <Activity size={15} />
                  Test Event Log
                </Button>

                <Button onClick={clearEventLog} disabled={eventLog.length === 0}>
                  <RefreshCcw size={15} />
                  Clear Log
                </Button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-md border border-accent-300/15 bg-black/25 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Live tracking
              </p>
              <span
                className={`rounded-sm border px-3 py-1 text-xs font-semibold ${
                  liveTracking
                    ? "border-green-300/30 bg-green-300/10 text-green-100"
                    : "border-zinc-300/20 bg-white/5 text-zinc-300"
                }`}
              >
                {liveTracking ? "Active" : "Off"}
              </span>
            </div>

            {eventLog.length === 0 ? (
              <div className="mt-4 rounded-lg border border-accent-300/15 bg-black/25 p-5 text-sm leading-7 text-zinc-400">
                No events recorded yet. Start live tracking or press Test Event
                Log.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {eventLog.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start justify-between gap-4 rounded-md border border-accent-300/15 bg-black/25 p-4"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-white">
                          {event.state}
                        </p>
                        <span
                          className={`rounded-sm border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                            event.source === "Live"
                              ? "border-green-300/30 bg-green-300/10 text-green-100"
                              : "border-yellow-300/30 bg-yellow-300/10 text-yellow-100"
                          }`}
                        >
                          {event.source}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">{event.time}</p>
                    </div>

                    <p className="text-sm font-semibold text-accent-200">
                      {formatMiles(event.distanceMiles)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className={`${glassPanel} mt-10 p-6 md:p-8`}>
          <SectionHeading
            eyebrow="How I built it"
            title="ArcGIS map, browser permissions, and spatial calculations"
            text="This page downloads the ArcGIS browser runtime only after activation, then uses React state to manage selected points, terrain readings, location permission, distance calculation, and event logging. ArcGIS is not bundled into the main Next.js build."
          />

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                title: "Runtime only loading",
                text: "ArcGIS JavaScript and CSS come from the ArcGIS CDN only after activation. The main Next.js build no longer has to compile the entire mapping SDK.",
                icon: CheckCircle2,
              },
              {
                title: "3D terrain",
                text: "SceneView uses satellite imagery with world elevation so the selected location can be inspected in context.",
                icon: Mountain,
              },
              {
                title: "Location consent",
                text: "One-time location and live tracking are separate actions, with tracking stopped when the page closes or resets.",
                icon: ShieldCheck,
              },
              {
                title: "Geofence logic",
                text: "The page calculates distance with the Haversine formula and accounts for reported GPS accuracy near the boundary edge.",
                icon: Compass,
              },
              {
                title: "Snapshot export",
                text: "The selected point, elevation, device reading, distance, accuracy, and boundary result can be exported as CSV.",
                icon: Activity,
              },
              {
                title: "Future layers",
                text: "The next useful layers would be parcel boundaries, zoning, flood risk, fire hazard, roads, utilities, and slope.",
                icon: Waves,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-lg border border-accent-300/15 bg-black/25 p-5"
                >
                  <Icon className="text-accent-300" size={22} />
                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}