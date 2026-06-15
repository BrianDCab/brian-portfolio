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
  | "Outside";
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
  "rounded-[2rem] border border-cyan-300/25 bg-cyan-950/[0.16] shadow-2xl shadow-cyan-950/30 backdrop-blur-md";

const glassCard =
  "rounded-3xl border border-cyan-300/20 bg-cyan-950/[0.14] shadow-2xl shadow-black/20 backdrop-blur-md";

const locatorUrl =
  "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";

const demoLocation: SelectedLocation = {
  latitude: 33.9425,
  longitude: -117.2297,
  label: "Moreno Valley, California demo point",
  source: "Demo",
};

function formatCoordinates(value: number) {
  return value.toFixed(5);
}

function formatMiles(value: number | null) {
  if (value === null) return "Not available";
  if (value < 0.1) return `${Math.round(value * 5280)} feet`;
  return `${value.toFixed(2)} miles`;
}

function formatElevation(value: number | null) {
  if (value === null) return "Loading terrain";
  const feet = value * 3.28084;
  return `${Math.round(value).toLocaleString()} m  •  ${Math.round(
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

  return 2 * earthRadiusMiles * Math.asin(Math.sqrt(a));
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
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition ${
        active
          ? "bg-cyan-400 text-black shadow-[0_0_22px_rgba(34,211,238,0.28)]"
          : "border border-cyan-300/25 bg-black/25 text-cyan-100 hover:border-cyan-300/55 hover:bg-cyan-300/10"
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
      className={`min-w-0 rounded-2xl border p-4 ${
        accent
          ? "border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_24px_rgba(34,211,238,0.10)]"
          : "border-cyan-300/15 bg-black/25"
      }`}
    >
      <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300/80">
        {label}
      </p>

      <p
        className={`mt-2 break-words font-black leading-tight ${
          accent ? "text-2xl text-cyan-100" : "text-xl text-white"
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
      <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
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
    "The ArcGIS map is paused until you choose to load it."
  );
  const [basemap, setBasemap] = useState<BasemapChoice>("satellite");
  const [clickSelectionEnabled, setClickSelectionEnabled] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);

  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);
  const [elevationMeters, setElevationMeters] = useState<number | null>(null);

  const [consentState, setConsentState] =
    useState<ConsentState>("not-asked");
  const [deviceLocation, setDeviceLocation] =
    useState<DeviceLocation | null>(null);
  const [locationMessage, setLocationMessage] = useState(
    "Location is off. I do not request it until you press a location button."
  );
  const [liveTracking, setLiveTracking] = useState(false);

  const [geofenceRadiusMiles, setGeofenceRadiusMiles] = useState(1);
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
          "The ArcGIS API key is missing. Add NEXT_PUBLIC_ARCGIS_API_KEY before loading the map."
        );
        setMapLoading(false);
        return;
      }

      try {
        const [
          configModule,
          mapModule,
          sceneViewModule,
          graphicsLayerModule,
          graphicModule,
          pointModule,
          circleModule,
          locatorModule,
        ] = await Promise.all([
          import("@arcgis/core/config.js"),
          import("@arcgis/core/Map.js"),
          import("@arcgis/core/views/SceneView.js"),
          import("@arcgis/core/layers/GraphicsLayer.js"),
          import("@arcgis/core/Graphic.js"),
          import("@arcgis/core/geometry/Point.js"),
          import("@arcgis/core/geometry/Circle.js"),
          import("@arcgis/core/rest/locator.js"),
        ]);

        if (cancelled || !mapContainerRef.current) return;

        const esriConfig = configModule.default;
        const ArcGISMap = mapModule.default;
        const SceneView = sceneViewModule.default;
        const GraphicsLayer = graphicsLayerModule.default;
        const Graphic = graphicModule.default;
        const Point = pointModule.default;
        const Circle = circleModule.default;

        esriConfig.apiKey = apiKey;
        esriConfig.applicationName = "BrianCabrera.io Geo Lab";

        ArcGISPointRef.current = Point;
        ArcGISCircleRef.current = Circle;
        ArcGISGraphicRef.current = Graphic;
        locatorRef.current = locatorModule;

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
          qualityProfile: "medium",
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
          setElevationMeters(null);

          if (selectedGraphicRef.current) {
            graphicsLayer.remove(selectedGraphicRef.current);
          }

          const selectedPoint = new Point({
            latitude,
            longitude,
          });

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

          for (let attempt = 0; attempt < 8; attempt += 1) {
            const sampler = view.groundView?.elevationSampler;

            if (sampler) {
              const elevatedPoint = sampler.queryElevation(selectedPoint);
              const elevation = Number(elevatedPoint?.z);

              if (Number.isFinite(elevation)) {
                setElevationMeters(elevation);
                break;
              }
            }

            await new Promise((resolve) => window.setTimeout(resolve, 250));
          }

          setMapMessage(
            `${label} is selected. The map is tilted so the terrain surface is easier to see.`
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
          "The terrain view is ready. Search an address, choose the demo point, or select a point directly on the map."
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
          setMapMessage(
            "The map could not start. Check the ArcGIS package, API key, and browser console."
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
    };
  }, [apiKey, mapRequested]);

  useEffect(() => {
    if (
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
      radius: geofenceRadiusMiles,
      radiusUnit: "miles",
      numberOfPoints: 120,
    });

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

    previousGeofenceStateRef.current = null;
  }, [
    selectedLocation?.latitude,
    selectedLocation?.longitude,
    geofenceRadiusMiles,
  ]);

  useEffect(() => {
    if (
      !deviceLocation ||
      !graphicsLayerRef.current ||
      !ArcGISPointRef.current ||
      !ArcGISGraphicRef.current
    ) {
      return;
    }

    const graphicsLayer = graphicsLayerRef.current;

    if (deviceGraphicRef.current) {
      graphicsLayer.remove(deviceGraphicRef.current);
    }

    const Point = ArcGISPointRef.current;
    const Graphic = ArcGISGraphicRef.current;

    const point = new Point({
      latitude: deviceLocation.latitude,
      longitude: deviceLocation.longitude,
    });

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
  }, [deviceLocation]);

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

    if (distanceFromBoundaryCenter <= geofenceRadiusMiles) return "Inside";

    if (distanceFromBoundaryCenter <= geofenceRadiusMiles * 1.25) {
      return "Approaching";
    }

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

    if (elevationMeters === null) {
      return "The scene is showing the terrain surface, but the point elevation is still loading.";
    }

    const feet = elevationMeters * 3.28084;

    if (feet >= 5000) {
      return `The selected point is about ${Math.round(
        feet
      ).toLocaleString()} feet above sea level. That is a high elevation setting, so road grade, weather, emergency access, and seasonal conditions deserve a closer look. Elevation by itself does not tell us whether the land is safe to build on.`;
    }

    if (feet >= 1500) {
      return `The selected point is about ${Math.round(
        feet
      ).toLocaleString()} feet above sea level. The tilted scene can help reveal surrounding ridges and valleys. I would compare this with slope, road, drainage, and fire hazard layers before making a planning decision.`;
    }

    if (feet >= 300) {
      return `The selected point is about ${Math.round(
        feet
      ).toLocaleString()} feet above sea level. This gives useful context for the surrounding terrain, but elevation alone does not prove whether the site is flat, flood prone, or easy to access.`;
    }

    return `The selected point is about ${Math.round(
      feet
    ).toLocaleString()} feet above sea level. Lower elevation does not automatically mean higher flood risk. A proper review would still need flood zones, drainage, slope, and nearby water data.`;
  }, [selectedLocation, elevationMeters]);

  const geofenceExplanation = useMemo(() => {
    if (!selectedLocation) {
      return "No geofence exists yet because no center point has been selected.";
    }

    if (!deviceLocation || distanceFromBoundaryCenter === null) {
      return `A ${geofenceRadiusMiles.toFixed(
        1
      )} mile geofence is drawn around the selected point. Device location is still off, so the page cannot compare the visitor with the boundary.`;
    }

    if (geofenceState === "Inside") {
      return `The current device reading is ${formatMiles(
        distanceFromBoundaryCenter
      )} from the center, which places it inside the ${geofenceRadiusMiles.toFixed(
        1
      )} mile boundary.`;
    }

    if (geofenceState === "Approaching") {
      return `The current device reading is ${formatMiles(
        distanceFromBoundaryCenter
      )} from the center. It is outside the boundary but close enough to be treated as approaching.`;
    }

    return `The current device reading is ${formatMiles(
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
          "No matching place was found. Try a more complete address or a nearby landmark."
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

  async function useDemoPoint() {
    if (!ArcGISPointRef.current) return;

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
        ? "Location permission was denied. Address search, map selection, and the demo point still work."
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
          "The green marker shows the device reading. The cyan geofence center stayed where you selected it so the page can compare the two locations."
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
    if (!selectedLocation) {
      setLocationMessage(
        "Choose a geofence center before starting live tracking."
      );
      return;
    }

    if (!navigator.geolocation) {
      setLocationMessage(
        "This browser does not support live device location."
      );
      return;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setConsentState("accepted");
    setLiveTracking(true);
    previousGeofenceStateRef.current = null;
    setLocationMessage(
      "Live geofence tracking is active while this page stays open. The first valid reading is logged, then another entry is added only when the status changes between outside, approaching, and inside."
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
      "Live tracking is off. The last reading stays visible only in this page state until the page is refreshed or closed."
    );
  }

  function runEventLogDemo() {
    const now = Date.now();
    const radius = geofenceRadiusMiles;

    const demoEvents: GeofenceEvent[] = [
      {
        id: `${now + 2}-demo-inside`,
        time: new Date(now + 2000).toLocaleTimeString(),
        state: "Inside",
        distanceMiles: Math.max(0.02, radius * 0.65),
        source: "Demo",
      },
      {
        id: `${now + 1}-demo-approaching`,
        time: new Date(now + 1000).toLocaleTimeString(),
        state: "Approaching",
        distanceMiles: radius * 1.12,
        source: "Demo",
      },
      {
        id: `${now}-demo-outside`,
        time: new Date(now).toLocaleTimeString(),
        state: "Outside",
        distanceMiles: radius * 1.6,
        source: "Demo",
      },
    ];

    setEventLog((current) => [...demoEvents, ...current].slice(0, 12));
    setLocationMessage(
      "Three simulated entries were added so you can confirm that the event log display works. Live entries still require location permission and an actual boundary status change."
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
      "Loading ArcGIS only for this page. The first load can take a moment because the three dimensional mapping tools are large."
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
      "Terrain view switched to satellite imagery, zoomed to the selected point, and tilted the camera to 70 degrees. Drag the scene to inspect ridges, valleys, and elevation changes."
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
      "Overhead view is active. This is useful for reading distance and boundary shape without the terrain angle."
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
      void useDemoPoint();
    }
  }

  const geofenceTone =
    geofenceState === "Inside"
      ? "border-green-300/30 bg-green-300/10 text-green-100"
      : geofenceState === "Approaching"
        ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-100"
        : geofenceState === "Outside"
          ? "border-red-300/30 bg-red-300/10 text-red-100"
          : "border-cyan-300/20 bg-black/25 text-cyan-100";

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16 lg:py-24">
        <div className={`${glassPanel} overflow-hidden p-6 md:p-10`}>
          <div className="relative">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />

            <div className="relative">
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-black/25 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                  <Globe2 size={15} />
                  Geo Lab
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-yellow-100">
                  <Construction size={15} />
                  Work in Progress
                </div>
              </div>

              <h1 className="mt-6 max-w-5xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
                A three dimensional map for terrain, location, and geofence
                testing
              </h1>

              <p className="mt-5 max-w-4xl text-base leading-8 text-zinc-300 md:text-lg">
                Most of my data work has involved rows, exports, reporting, and
                segmentation. I built this page because I wanted to work with
                the same kind of questions geographically. I wanted to see what
                a place looks like, read its elevation, draw a boundary around
                it, and compare a device location with that boundary. This is
                still an active build, so I am testing browser behavior,
                location accuracy, and additional public map layers before I
                call it finished.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-black shadow-[0_0_22px_rgba(34,211,238,0.25)] transition hover:bg-cyan-300"
                >
                  View Projects
                  <MapPinned size={16} />
                </Link>

                {mapReady ? (
                  <Button onClick={focusTerrain}>
                    <Mountain size={16} />
                    Tilt to Show Terrain
                  </Button>
                ) : (
                  <Button onClick={requestMapLoad} disabled={mapLoading}>
                    <Mountain size={16} />
                    {mapLoading ? "Loading Map" : "Load Interactive Map"}
                  </Button>
                )}

                <Button onClick={resetPage}>
                  <RefreshCcw size={16} />
                  Reset Demo
                </Button>
              </div>

              <div className="mt-5 flex max-w-4xl items-start gap-3 rounded-2xl border border-cyan-300/15 bg-black/25 p-4">
                <Mountain className="mt-0.5 shrink-0 text-cyan-300" size={19} />
                <p className="text-sm leading-7 text-zinc-400">
                  <span className="font-black text-cyan-100">
                    What the terrain button does:
                  </span>{" "}
                  the map stays unloaded until you choose to open it. After it
                  loads, this control switches to satellite imagery, moves the
                  camera to the selected point, and tilts the view so the ArcGIS
                  elevation surface is easier to see. It does not create new
                  terrain data. It changes the camera angle used to inspect the
                  terrain that is already loaded.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className={`${glassPanel} mt-8 p-5 md:p-7`}>
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-1 shrink-0 text-cyan-300" size={24} />

            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                Location and privacy
              </p>

              <h2 className="mt-3 text-2xl font-black text-white md:text-3xl">
                Location stays off until the visitor chooses to use it
              </h2>

              <p className="mt-4 max-w-5xl text-sm leading-7 text-zinc-300 md:text-base">
                This page does not request device location when it loads. It
                does not read, display, or save an IP address. A location
                request only starts after the visitor presses a location
                button. Device coordinates are kept in browser memory for the
                current page session and are not written to my database.
              </p>

              <p className="mt-3 max-w-5xl text-sm leading-7 text-zinc-400">
                ArcGIS still receives the normal map, imagery, elevation, and
                address search requests needed to run the map. My code does not
                create a location history or attach coordinates to an account.
                Closing or refreshing the page clears the React state.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_420px]">
          <div className={`${glassPanel} overflow-hidden p-4 md:p-5`}>
            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                  ArcGIS Scene
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Satellite imagery is placed over the ArcGIS world elevation
                  surface so hills, valleys, and ridges have real depth.
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

            <div className="relative overflow-hidden rounded-[1.5rem] border border-cyan-300/20 bg-black">
              <div
                ref={mapContainerRef}
                className="h-[500px] w-full md:h-[620px]"
              />

              {!mapReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6 text-center">
                  <div className="max-w-lg">
                    {mapLoading ? (
                      <Activity
                        className="mx-auto animate-pulse text-cyan-300"
                        size={30}
                      />
                    ) : (
                      <Mountain className="mx-auto text-cyan-300" size={34} />
                    )}

                    <h3 className="mt-4 text-2xl font-black text-white">
                      {mapLoading
                        ? "Loading the interactive terrain map"
                        : "Load the interactive ArcGIS map when you are ready"}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-zinc-300">
                      {mapMessage}
                    </p>

                    {!mapLoading && (
                      <button
                        type="button"
                        onClick={requestMapLoad}
                        className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-black text-black transition hover:bg-cyan-300"
                      >
                        <Mountain size={16} />
                        Load Interactive Map
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 rounded-2xl border border-cyan-300/15 bg-black/25 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                Map status
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {mapMessage}
              </p>
              <p className="mt-2 text-xs leading-5 text-zinc-500">
                The ArcGIS SDK and three dimensional scene are loaded only after
                you press the map button. This keeps the rest of the portfolio
                lighter and avoids using the browser GPU before the map is needed.
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
              <div className="flex items-center gap-2 text-cyan-300">
                <Search size={18} />
                <p className="text-xs font-black uppercase tracking-[0.24em]">
                  Choose a place
                </p>
              </div>

              <form onSubmit={searchAddress} className="mt-5">
                <label className="block">
                  <span className="text-sm font-bold text-zinc-300">
                    Address, city, or landmark
                  </span>

                  <input
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Moreno Valley, CA"
                    className="mt-3 w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300"
                  />
                </label>

                <button
                  type="submit"
                  disabled={searching || !mapReady}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 px-4 py-3 text-sm font-black text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Search size={15} />
                  {searching ? "Searching" : "Search ArcGIS"}
                </button>
              </form>

              <div className="mt-3">
                <Button onClick={useDemoPoint} disabled={!mapReady}>
                  <MapPinned size={15} />
                  Use Demo Point
                </Button>
              </div>
            </div>

            <div className={`${glassCard} p-5`}>
              <div className="flex items-center gap-2 text-cyan-300">
                <LocateFixed size={18} />
                <p className="text-xs font-black uppercase tracking-[0.24em]">
                  Device location consent
                </p>
              </div>

              <p className="mt-4 text-sm leading-7 text-zinc-300">
                Pressing the button below tells the browser to ask for one
                location reading. I use that reading to place the green device
                marker and compare it with the cyan geofence center. The
                geofence center does not move onto the device. I do not request
                an IP address and I do not save the coordinates.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={requestOneTimeLocation}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-4 py-3 text-sm font-black text-black transition hover:bg-cyan-300"
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
                <span className="font-bold text-zinc-300">
                  {consentState === "not-asked"
                    ? "No choice yet"
                    : consentState === "accepted"
                      ? "Location use accepted"
                      : "Location declined"}
                </span>
              </p>
            </div>

            <div className={`${glassCard} p-5`}>
              <div className="flex items-center gap-2 text-cyan-300">
                <Radio size={18} />
                <p className="text-xs font-black uppercase tracking-[0.24em]">
                  Live geofence consent
                </p>
              </div>

              <p className="mt-4 text-sm leading-7 text-zinc-300">
                Live tracking is a separate choice. It requests updated device
                readings while this page stays open so the boundary status can
                change from outside to approaching or inside. Press Stop
                tracking at any time or close the page to end it.
              </p>

              <div className="mt-5">
                {liveTracking ? (
                  <button
                    type="button"
                    onClick={stopLiveTracking}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-300/30 bg-red-300/10 px-4 py-3 text-sm font-black text-red-100 transition hover:bg-red-300/20"
                  >
                    <StopCircle size={16} />
                    Stop Tracking
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startLiveTracking}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-green-300/30 bg-green-300/10 px-4 py-3 text-sm font-black text-green-100 transition hover:bg-green-300/20"
                  >
                    <Navigation size={16} />
                    I Agree, Start Live Tracking
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
            title="What the map knows about this point"
            text="The selected point becomes the center for terrain reading and geofence analysis. The cyan marker shows the selected point. The green marker shows the device reading after permission is granted."
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
              value={formatElevation(elevationMeters)}
            />
          </div>

          <div className="mt-6 rounded-3xl border border-cyan-300/15 bg-black/25 p-5">
            <div className="flex items-start gap-3">
              <Mountain className="mt-1 shrink-0 text-cyan-300" size={21} />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                  What the terrain reading means
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
              text="The selected map point is the center. The radius controls the size of the boundary. This is browser based boundary detection while the page is open. It is not background tracking and it does not send notifications after the page closes."
            />

            <label className="mt-7 block">
              <span className="flex items-center justify-between gap-3 text-sm font-bold text-zinc-300">
                <span>Boundary radius</span>
                <span className="text-cyan-300">
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
                className="mt-4 w-full accent-cyan-300"
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
              <div className={`rounded-2xl border p-4 ${geofenceTone}`}>
                <p className="text-xs font-black uppercase tracking-[0.2em]">
                  Boundary Status
                </p>
                <p className="mt-2 text-2xl font-black">{geofenceState}</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-cyan-300/15 bg-black/25 p-5">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                What this result means
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                {geofenceExplanation}
              </p>
            </div>
          </div>

          <div className={`${glassPanel} p-6 md:p-8`}>
            <div className="flex items-center gap-3">
              <CircleDot className="text-cyan-300" size={22} />
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                  Geofence event log
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">
                  Status changes during live tracking
                </h3>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-black/25 p-4">
              <p className="text-sm leading-7 text-zinc-300">
                The live log does not add a row for every GPS reading. It adds
                the first valid result, then adds another row only when the
                device changes between outside, approaching, and inside. A
                desktop computer often reports one fixed location, so the
                status may never change while you sit still.
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

              <p className="mt-3 text-xs leading-6 text-zinc-500">
                Test Event Log creates clearly labeled sample entries. It does
                not pretend that the device moved.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-cyan-300/15 bg-black/25 px-4 py-3">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
                Live tracking
              </p>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-black ${
                  liveTracking
                    ? "border-green-300/30 bg-green-300/10 text-green-100"
                    : "border-zinc-300/20 bg-white/5 text-zinc-300"
                }`}
              >
                {liveTracking ? "Active" : "Off"}
              </span>
            </div>

            {eventLog.length === 0 ? (
              <div className="mt-4 rounded-3xl border border-cyan-300/15 bg-black/25 p-5 text-sm leading-7 text-zinc-400">
                No events have been recorded yet. Start live tracking for real
                readings or press Test Event Log to confirm the display.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {eventLog.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-cyan-300/15 bg-black/25 p-4"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-black text-white">
                          {event.state}
                        </p>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.14em] ${
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

                    <p className="text-sm font-bold text-cyan-200">
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
            eyebrow="What the map says"
            title="A map gives context, not a final decision"
            text="The page can show where a point is, what the surrounding terrain looks like, its approximate elevation, and whether a device reading falls inside a chosen boundary. That is useful evidence, but it is not enough to decide whether land is safe, buildable, accessible, or suitable for a specific use."
          />

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {[
              {
                title: "What I can reasonably say",
                text: "I can describe the selected elevation, the visible terrain shape, the boundary radius, and the current inside or outside result.",
                icon: CheckCircle2,
              },
              {
                title: "What I would check next",
                text: "For a real land review I would add parcel boundaries, zoning, slope, flood zones, fire hazard, roads, utilities, public facilities, and the date and source of each layer.",
                icon: Compass,
              },
              {
                title: "What I should not assume",
                text: "A high point is not automatically unsafe. A low point is not automatically a flood zone. Being near a road does not prove legal access. The next layer needs to answer the next question.",
                icon: ShieldCheck,
              },
              {
                title: "How geofencing could be used",
                text: "The same boundary logic could support arrival checks, service areas, field inspections, asset monitoring, delivery zones, or a reminder that only runs while the user has actively enabled tracking.",
                icon: Waves,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-cyan-300/15 bg-black/25 p-5"
                >
                  <Icon className="text-cyan-300" size={22} />
                  <h3 className="mt-4 text-xl font-black text-white">
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

        <section className={`${glassPanel} mt-10 p-6 md:p-8`}>
          <SectionHeading
            eyebrow="How I made this page"
            title="The map is ArcGIS, but the workflow and interface are mine"
            text="I built the page as a Next.js client component because the map, camera, browser location, and live controls need to run in the browser. The ArcGIS Maps SDK is now loaded only after the visitor presses the map button. That keeps the rest of the site lighter, then creates a SceneView with satellite imagery and the ArcGIS world elevation surface only when it is actually needed."
          />

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                title: "Three dimensional terrain",
                text: "ArcGIS SceneView renders the map in three dimensions. The world elevation ground layer gives the surface height, while the camera tilt makes terrain changes visible instead of flattening everything into a normal overhead map. I use the medium quality profile to balance detail with browser performance.",
              },
              {
                title: "Address search",
                text: "The search box sends the visitor's typed place name to the ArcGIS World Geocoding Service. I take the best returned point, place a cyan marker, move the camera, and update the interpretation section.",
              },
              {
                title: "Device location",
                text: "The page uses the browser Geolocation API only after a visitor presses a consent button. One button requests a single reading. A separate button starts repeated readings for the live geofence demo.",
              },
              {
                title: "Geofence drawing",
                text: "The cyan boundary is an ArcGIS Circle geometry centered on the selected point. The radius slider rebuilds the circle so the visitor can see exactly how the boundary changes.",
              },
              {
                title: "Inside and outside logic",
                text: "I calculate the distance between the selected center and the device reading, then compare that distance with the chosen radius. React state updates the status and the event log when the result changes.",
              },
              {
                title: "Privacy choices",
                text: "I left location off by default, added one time and live consent separately, included a Stop tracking control, avoided IP collection, and kept the coordinates out of my database.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-cyan-300/15 bg-black/25 p-5"
              >
                <h3 className="text-xl font-black text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className={`${glassPanel} mt-10 p-6 md:p-8`}>
          <SectionHeading
            eyebrow="Why I built this"
            title="I wanted to move beyond rows and charts"
            text="Data Lab works with columns, distributions, validation rules, and correlations. Geo Lab asks a different set of questions. Where is the point? What is around it? What does the ground look like? What falls inside a boundary? How should the result be explained without pretending the map proves more than it actually does?"
          />

          <p className="mt-5 max-w-5xl text-sm leading-7 text-zinc-400 md:text-base">
            I also wanted to show that I can connect a large third party SDK to
            the same design system as the rest of my site, manage browser
            permissions responsibly, keep the interface understandable, and
            turn raw spatial output into language a normal person can use.
          </p>
        </section>
      </section>
    </main>
  );
}
