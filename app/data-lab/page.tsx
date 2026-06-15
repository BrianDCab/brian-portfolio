"use client";

import { useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import Link from "next/link";
import {
  BarChart3,
  CloudSun,
  Download,
  ExternalLink,
  FileDown,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Table2,
  TrendingDown,
  TrendingUp,
  Upload,
} from "lucide-react";

type LabKey = "offers" | "weather";
type Flag = "Y" | "N";
type Status = "Pass" | "Review" | "Fail";
type MetricFormat = "number" | "money" | "percent";

type PlayerOfferRow = {
  PlayerID: string;
  UniversalID: string;
  FirstName: string;
  LastName: string;
  TierRank: string;
  PlayerStatus: string;
  ActiveInactive: "Active" | "Inactive";
  HostName: string;
  TotalTrips: number;
  TripsMonth: number;
  TripsLast3Months: number;
  TripsLast6Months: number;
  LastTripDate: string;
  DaysSinceLastTrip: number;
  CoinIn: number;
  TheoWin: number;
  ActualWin: number;
  NetWinLoss: number;
  ADT: number;
  NetADT: number;
  MonthlyTheo: number;
  MonthlyActual: number;
  SegmentName: string;
  OfferGroup: string;
  WorthGroup: string;
  VIPFlag: Flag;
  NewMemberFlag: Flag;
  BirthdayMonth: string;
  MailableFlag: Flag;
  EmailableFlag: Flag;
  AppEligibleFlag: Flag;
  DoNotMail: Flag;
  DoNotEmail: Flag;
  BadAddressFlag: Flag;
  ExcludedFlag: Flag;
  OfferFSP: number;
  OfferTG: number;
  OfferHotel: string;
  OfferHotelCode: string;
  OfferFood: number;
  OfferGift: string;
  OfferBonusEntries: number;
  BirthdayOffer: string;
  FSPValidStart: string;
  FSPValidEnd: string;
  TGValidStart: string;
  TGValidEnd: string;
  HotelValidStart: string;
  HotelValidEnd: string;
  FoodValidStart: string;
  FoodValidEnd: string;
  GiftValidStart: string;
  GiftValidEnd: string;
  RedeemedFSP: Flag;
  RedeemedTG: Flag;
  RedeemedHotel: Flag;
  RedeemedFood: Flag;
  RedeemedGift: Flag;
  TotalRedeemedValue: number;
  RedemptionCount: number;
  FirstRedeemDate: string;
  LastRedeemDate: string;
  OfferCost: number;
  PostOfferTrips: number;
  PostOfferTheo: number;
  PostOfferActual: number;
  CampaignID: string;
  CampaignName: string;
  ExportMonth: string;
  ExportDate: string;
  SourceSystem: string;
  SourceFile: string;
  ScriptVersion: string;
  ValidationStatus: Status;
  ValidationNotes: string;
  DuplicateFlag: Flag;
  MissingIDFlag: Flag;
  MissingOfferFlag: Flag;
};

type OfferDisplayRow = PlayerOfferRow & {
  HotelNights: string;
  HotelRoomType: string;
};

type WeatherTrafficRow = {
  Date: string;
  DayOfWeek: string;
  WeekendFlag: Flag;
  EventFlag: Flag;
  PromoFlag: Flag;
  WeatherCondition: string;
  TempHigh: number;
  TempLow: number;
  HeatIndex: number;
  RainChance: number;
  RainInches: number;
  WindMPH: number;
  WeatherRiskScore: number;
  ExpectedTrips: number;
  ActualTrips: number;
  TripDelta: number;
  TripDeltaPercent: number;
  FSPRedemptions: number;
  TGRedemptions: number;
  HotelBookings: number;
  FoodRedemptions: number;
  TheoWin: number;
  ActualWin: number;
  Recommendation: string;
};

type MetricOption = {
  label: string;
  key: string;
  format: MetricFormat;
  description: string;
};

type CorrelationMetric = {
  key: string;
  label: string;
  format: MetricFormat;
};

type CorrelationPair = {
  left: CorrelationMetric;
  right: CorrelationMetric;
  value: number;
};

type InterpretationFinding = {
  label: string;
  value: string;
  text: string;
  trend?: "up" | "down" | "neutral";
};

type CorrelationGuidance = {
  meaning: string;
  nextCheck: string;
  possibleAction: string;
  caution: string;
};

const glassPanel =
  "rounded-[2rem] border border-cyan-300/25 bg-cyan-950/[0.16] shadow-2xl shadow-cyan-950/30 backdrop-blur-md";

const glassCard =
  "rounded-3xl border border-cyan-300/20 bg-cyan-950/[0.14] shadow-2xl shadow-black/20 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-300/45 hover:bg-cyan-300/[0.07]";

const offerBase: PlayerOfferRow = {
  PlayerID: "",
  UniversalID: "",
  FirstName: "Demo",
  LastName: "Player",
  TierRank: "Gold",
  PlayerStatus: "Good Standing",
  ActiveInactive: "Active",
  HostName: "Unhosted",
  TotalTrips: 0,
  TripsMonth: 0,
  TripsLast3Months: 0,
  TripsLast6Months: 0,
  LastTripDate: "",
  DaysSinceLastTrip: 0,
  CoinIn: 0,
  TheoWin: 0,
  ActualWin: 0,
  NetWinLoss: 0,
  ADT: 0,
  NetADT: 0,
  MonthlyTheo: 0,
  MonthlyActual: 0,
  SegmentName: "",
  OfferGroup: "",
  WorthGroup: "",
  VIPFlag: "N",
  NewMemberFlag: "N",
  BirthdayMonth: "",
  MailableFlag: "Y",
  EmailableFlag: "Y",
  AppEligibleFlag: "Y",
  DoNotMail: "N",
  DoNotEmail: "N",
  BadAddressFlag: "N",
  ExcludedFlag: "N",
  OfferFSP: 0,
  OfferTG: 0,
  OfferHotel: "NONE",
  OfferHotelCode: "NONE",
  OfferFood: 0,
  OfferGift: "",
  OfferBonusEntries: 0,
  BirthdayOffer: "",
  FSPValidStart: "2026-07-01",
  FSPValidEnd: "2026-07-31",
  TGValidStart: "2026-07-01",
  TGValidEnd: "2026-07-31",
  HotelValidStart: "",
  HotelValidEnd: "",
  FoodValidStart: "2026-07-01",
  FoodValidEnd: "2026-07-31",
  GiftValidStart: "",
  GiftValidEnd: "",
  RedeemedFSP: "N",
  RedeemedTG: "N",
  RedeemedHotel: "N",
  RedeemedFood: "N",
  RedeemedGift: "N",
  TotalRedeemedValue: 0,
  RedemptionCount: 0,
  FirstRedeemDate: "",
  LastRedeemDate: "",
  OfferCost: 0,
  PostOfferTrips: 0,
  PostOfferTheo: 0,
  PostOfferActual: 0,
  CampaignID: "JUL26-DEMO",
  CampaignName: "July Demo Offers",
  ExportMonth: "July 2026",
  ExportDate: "2026-06-10",
  SourceSystem: "Demo Oasis Export",
  SourceFile: "casino_offer_export_demo.csv",
  ScriptVersion: "v2.3",
  ValidationStatus: "Pass",
  ValidationNotes: "Eligible and complete.",
  DuplicateFlag: "N",
  MissingIDFlag: "N",
  MissingOfferFlag: "N",
};

const weatherBase: WeatherTrafficRow = {
  Date: "",
  DayOfWeek: "",
  WeekendFlag: "N",
  EventFlag: "N",
  PromoFlag: "N",
  WeatherCondition: "",
  TempHigh: 0,
  TempLow: 0,
  HeatIndex: 0,
  RainChance: 0,
  RainInches: 0,
  WindMPH: 0,
  WeatherRiskScore: 0,
  ExpectedTrips: 0,
  ActualTrips: 0,
  TripDelta: 0,
  TripDeltaPercent: 0,
  FSPRedemptions: 0,
  TGRedemptions: 0,
  HotelBookings: 0,
  FoodRedemptions: 0,
  TheoWin: 0,
  ActualWin: 0,
  Recommendation: "",
};

const offerColumns = Object.keys(offerBase) as Array<keyof PlayerOfferRow>;
const weatherColumns = Object.keys(weatherBase) as Array<keyof WeatherTrafficRow>;
const requiredOfferColumns = [
  "PlayerID",
  "TierRank",
  "ActiveInactive",
  "TripsMonth",
  "DaysSinceLastTrip",
  "NetADT",
  "SegmentName",
  "OfferFSP",
  "OfferTG",
  "OfferHotel",
  "OfferFood",
  "OfferGift",
  "MailableFlag",
  "AppEligibleFlag",
  "ValidationStatus",
];

const requiredWeatherColumns = [
  "Date",
  "DayOfWeek",
  "WeatherCondition",
  "TempHigh",
  "RainChance",
  "WeatherRiskScore",
  "ExpectedTrips",
  "ActualTrips",
  "TripDelta",
  "TripDeltaPercent",
  "FSPRedemptions",
  "HotelBookings",
  "FoodRedemptions",
  "Recommendation",
];

const numericOfferColumns = new Set([
  "TotalTrips",
  "TripsMonth",
  "TripsLast3Months",
  "TripsLast6Months",
  "DaysSinceLastTrip",
  "CoinIn",
  "TheoWin",
  "ActualWin",
  "NetWinLoss",
  "ADT",
  "NetADT",
  "MonthlyTheo",
  "MonthlyActual",
  "OfferFSP",
  "OfferTG",
  "OfferFood",
  "OfferBonusEntries",
  "TotalRedeemedValue",
  "RedemptionCount",
  "OfferCost",
  "PostOfferTrips",
  "PostOfferTheo",
  "PostOfferActual",
]);

const numericWeatherColumns = new Set([
  "TempHigh",
  "TempLow",
  "HeatIndex",
  "RainChance",
  "RainInches",
  "WindMPH",
  "WeatherRiskScore",
  "ExpectedTrips",
  "ActualTrips",
  "TripDelta",
  "TripDeltaPercent",
  "FSPRedemptions",
  "TGRedemptions",
  "HotelBookings",
  "FoodRedemptions",
  "TheoWin",
  "ActualWin",
]);

const flagOfferColumns = new Set([
  "VIPFlag",
  "NewMemberFlag",
  "MailableFlag",
  "EmailableFlag",
  "AppEligibleFlag",
  "DoNotMail",
  "DoNotEmail",
  "BadAddressFlag",
  "ExcludedFlag",
  "RedeemedFSP",
  "RedeemedTG",
  "RedeemedHotel",
  "RedeemedFood",
  "RedeemedGift",
  "DuplicateFlag",
  "MissingIDFlag",
  "MissingOfferFlag",
]);

const flagWeatherColumns = new Set(["WeekendFlag", "EventFlag", "PromoFlag"]);

const offerRowsDefault: PlayerOfferRow[] = [
  {
    ...offerBase,
    PlayerID: "P100284",
    UniversalID: "U778201",
    TierRank: "Platinum",
    TotalTrips: 88,
    TripsMonth: 9,
    TripsLast3Months: 24,
    TripsLast6Months: 51,
    LastTripDate: "2026-06-07",
    DaysSinceLastTrip: 3,
    CoinIn: 84500,
    TheoWin: 3920,
    ActualWin: -850,
    NetWinLoss: 850,
    ADT: 435,
    NetADT: 412,
    MonthlyTheo: 3915,
    MonthlyActual: 740,
    SegmentName: "Core Active",
    OfferGroup: "FSP-High",
    WorthGroup: "W4",
    BirthdayMonth: "June",
    OfferFSP: 125,
    OfferTG: 70,
    OfferHotel: "2DLX",
    OfferHotelCode: "2DLX",
    OfferFood: 45,
    OfferGift: "Premium Tumbler",
    OfferBonusEntries: 2500,
    BirthdayOffer: "$25 Birthday FSP",
    HotelValidStart: "2026-07-07",
    HotelValidEnd: "2026-07-28",
    GiftValidStart: "2026-07-12",
    GiftValidEnd: "2026-07-12",
    RedeemedFSP: "Y",
    RedeemedFood: "Y",
    TotalRedeemedValue: 170,
    RedemptionCount: 2,
    FirstRedeemDate: "2026-07-03",
    LastRedeemDate: "2026-07-15",
    OfferCost: 170,
    PostOfferTrips: 4,
    PostOfferTheo: 1440,
    PostOfferActual: 320,
    CampaignID: "JUL26-ACT-W4",
    SourceFile: "active_offers_july_demo.csv",
  },
  {
    ...offerBase,
    PlayerID: "P100918",
    UniversalID: "U778475",
    TierRank: "Gold",
    TotalTrips: 42,
    TripsMonth: 5,
    TripsLast3Months: 14,
    TripsLast6Months: 28,
    LastTripDate: "2026-06-01",
    DaysSinceLastTrip: 9,
    CoinIn: 42100,
    TheoWin: 1840,
    ActualWin: 620,
    NetWinLoss: -620,
    ADT: 265,
    NetADT: 248,
    MonthlyTheo: 1325,
    MonthlyActual: -220,
    SegmentName: "Mid Active",
    OfferGroup: "FSP-Mid",
    WorthGroup: "W3",
    BirthdayMonth: "October",
    OfferFSP: 75,
    OfferTG: 35,
    OfferHotel: "1DLX",
    OfferHotelCode: "1DLX",
    OfferFood: 30,
    OfferGift: "Kitchen Set",
    OfferBonusEntries: 1000,
    HotelValidStart: "2026-07-08",
    HotelValidEnd: "2026-07-29",
    GiftValidStart: "2026-07-19",
    GiftValidEnd: "2026-07-19",
    CampaignID: "JUL26-ACT-W3",
    SourceFile: "active_offers_july_demo.csv",
  },
  {
    ...offerBase,
    PlayerID: "P101337",
    UniversalID: "U779044",
    TierRank: "Diamond",
    HostName: "Hosted",
    TotalTrips: 134,
    TripsMonth: 12,
    TripsLast3Months: 39,
    TripsLast6Months: 78,
    LastTripDate: "2026-06-09",
    DaysSinceLastTrip: 1,
    CoinIn: 156900,
    TheoWin: 8450,
    ActualWin: -3120,
    NetWinLoss: 3120,
    ADT: 704,
    NetADT: 690,
    MonthlyTheo: 8448,
    MonthlyActual: 1880,
    SegmentName: "VIP Active",
    OfferGroup: "VIP-FSP",
    WorthGroup: "W5",
    VIPFlag: "Y",
    BirthdayMonth: "July",
    OfferFSP: 250,
    OfferTG: 175,
    OfferHotel: "2MS",
    OfferHotelCode: "2MS",
    OfferFood: 75,
    OfferGift: "VIP Gift",
    OfferBonusEntries: 5000,
    BirthdayOffer: "$100 Birthday FSP",
    HotelValidStart: "2026-07-01",
    HotelValidEnd: "2026-07-31",
    GiftValidStart: "2026-07-26",
    GiftValidEnd: "2026-07-26",
    RedeemedFSP: "Y",
    RedeemedTG: "Y",
    RedeemedHotel: "Y",
    RedeemedFood: "Y",
    RedeemedGift: "Y",
    TotalRedeemedValue: 500,
    RedemptionCount: 5,
    FirstRedeemDate: "2026-07-02",
    LastRedeemDate: "2026-07-26",
    OfferCost: 500,
    PostOfferTrips: 8,
    PostOfferTheo: 5520,
    PostOfferActual: 1425,
    CampaignID: "JUL26-VIP-W5",
    CampaignName: "July VIP Offers",
    SourceFile: "vip_offers_july_demo.csv",
    ValidationNotes: "Hosted VIP. Offer package complete.",
  },
  {
    ...offerBase,
    PlayerID: "P102014",
    UniversalID: "U779821",
    LastName: "Inactive",
    TierRank: "Silver",
    ActiveInactive: "Inactive",
    TotalTrips: 18,
    TripsMonth: 0,
    TripsLast3Months: 1,
    TripsLast6Months: 3,
    LastTripDate: "2026-02-18",
    DaysSinceLastTrip: 112,
    CoinIn: 13200,
    TheoWin: 410,
    ActualWin: 130,
    NetWinLoss: -130,
    ADT: 92,
    NetADT: 88,
    SegmentName: "Reactivation",
    OfferGroup: "Reactivation-FSP",
    WorthGroup: "W2",
    BirthdayMonth: "April",
    EmailableFlag: "N",
    DoNotEmail: "Y",
    OfferFSP: 25,
    OfferTG: 35,
    OfferHotel: "NONE",
    OfferHotelCode: "NONE",
    OfferFood: 15,
    OfferGift: "Comeback Gift",
    OfferBonusEntries: 500,
    GiftValidStart: "2026-07-20",
    GiftValidEnd: "2026-07-20",
    CampaignID: "JUL26-REACT-W2",
    CampaignName: "July Reactivation Offers",
    SourceFile: "inactive_offers_july_demo.csv",
    ValidationStatus: "Review",
    ValidationNotes: "Email suppressed. Mail/app only.",
  },
  {
    ...offerBase,
    PlayerID: "P102880",
    UniversalID: "",
    FirstName: "Needs",
    LastName: "Review",
    TotalTrips: 31,
    TripsMonth: 4,
    TripsLast3Months: 12,
    TripsLast6Months: 22,
    LastTripDate: "2026-06-04",
    DaysSinceLastTrip: 6,
    CoinIn: 28400,
    TheoWin: 1180,
    ActualWin: -430,
    NetWinLoss: 430,
    ADT: 195,
    NetADT: 188,
    MonthlyTheo: 780,
    MonthlyActual: 210,
    SegmentName: "Mid Active",
    OfferGroup: "FSP-Mid",
    WorthGroup: "W3",
    AppEligibleFlag: "N",
    BirthdayMonth: "January",
    OfferFSP: 50,
    OfferTG: 35,
    OfferHotel: "NONE",
    OfferHotelCode: "NONE",
    OfferFood: 30,
    OfferGift: "Mystery Gift",
    OfferBonusEntries: 750,
    GiftValidStart: "2026-07-13",
    GiftValidEnd: "2026-07-13",
    CampaignID: "JUL26-ACT-W3",
    ValidationStatus: "Review",
    ValidationNotes: "Missing UniversalID. Review before app import.",
    MissingIDFlag: "Y",
  },
  {
    ...offerBase,
    PlayerID: "P103552",
    UniversalID: "U780455",
    FirstName: "Excluded",
    LastName: "Demo",
    PlayerStatus: "Suppressed",
    TotalTrips: 25,
    TripsMonth: 3,
    TripsLast3Months: 8,
    TripsLast6Months: 19,
    LastTripDate: "2026-05-28",
    DaysSinceLastTrip: 13,
    CoinIn: 21900,
    TheoWin: 930,
    ActualWin: 190,
    NetWinLoss: -190,
    ADT: 155,
    NetADT: 149,
    MonthlyTheo: 465,
    MonthlyActual: -90,
    SegmentName: "Suppressed",
    WorthGroup: "W2",
    MailableFlag: "N",
    EmailableFlag: "N",
    AppEligibleFlag: "N",
    DoNotMail: "Y",
    DoNotEmail: "Y",
    BadAddressFlag: "Y",
    ExcludedFlag: "Y",
    OfferHotel: "NONE",
    OfferHotelCode: "NONE",
    CampaignID: "JUL26-SUPPRESS",
    CampaignName: "July Suppression Review",
    SourceFile: "suppression_review_july_demo.csv",
    ValidationStatus: "Fail",
    ValidationNotes: "Excluded due to suppression and bad address.",
    MissingOfferFlag: "Y",
  },
];
const weatherRowsDefault: WeatherTrafficRow[] = [
  {
    ...weatherBase,
    Date: "2026-07-03",
    DayOfWeek: "Friday",
    WeekendFlag: "Y",
    EventFlag: "Y",
    PromoFlag: "Y",
    WeatherCondition: "Clear",
    TempHigh: 86,
    TempLow: 67,
    HeatIndex: 88,
    RainChance: 5,
    WindMPH: 7,
    WeatherRiskScore: 18,
    ExpectedTrips: 1280,
    ActualTrips: 1395,
    TripDelta: 115,
    TripDeltaPercent: 9,
    FSPRedemptions: 226,
    TGRedemptions: 91,
    HotelBookings: 44,
    FoodRedemptions: 138,
    TheoWin: 182400,
    ActualWin: 60400,
    Recommendation: "Strong traffic signal. Keep floor coverage high.",
  },
  {
    ...weatherBase,
    Date: "2026-07-04",
    DayOfWeek: "Saturday",
    WeekendFlag: "Y",
    EventFlag: "Y",
    PromoFlag: "Y",
    WeatherCondition: "Hot",
    TempHigh: 103,
    TempLow: 78,
    HeatIndex: 108,
    RainChance: 3,
    WindMPH: 9,
    WeatherRiskScore: 72,
    ExpectedTrips: 1510,
    ActualTrips: 1328,
    TripDelta: -182,
    TripDeltaPercent: -12.1,
    FSPRedemptions: 241,
    TGRedemptions: 84,
    HotelBookings: 71,
    FoodRedemptions: 164,
    TheoWin: 171800,
    ActualWin: 52200,
    Recommendation: "Heat may suppress trips but lift hotel demand.",
  },
  {
    ...weatherBase,
    Date: "2026-07-05",
    DayOfWeek: "Sunday",
    WeekendFlag: "Y",
    PromoFlag: "Y",
    WeatherCondition: "Hot",
    TempHigh: 101,
    TempLow: 77,
    HeatIndex: 106,
    RainChance: 4,
    WindMPH: 8,
    WeatherRiskScore: 68,
    ExpectedTrips: 1180,
    ActualTrips: 1044,
    TripDelta: -136,
    TripDeltaPercent: -11.5,
    FSPRedemptions: 184,
    TGRedemptions: 63,
    HotelBookings: 52,
    FoodRedemptions: 119,
    TheoWin: 139200,
    ActualWin: 41100,
    Recommendation: "Push app visibility and monitor food usage.",
  },
  {
    ...weatherBase,
    Date: "2026-07-06",
    DayOfWeek: "Monday",
    WeatherCondition: "Mild",
    TempHigh: 82,
    TempLow: 64,
    HeatIndex: 83,
    RainChance: 8,
    WindMPH: 6,
    WeatherRiskScore: 20,
    ExpectedTrips: 820,
    ActualTrips: 846,
    TripDelta: 26,
    TripDeltaPercent: 3.2,
    FSPRedemptions: 91,
    TGRedemptions: 31,
    HotelBookings: 18,
    FoodRedemptions: 54,
    TheoWin: 88200,
    ActualWin: 20400,
    Recommendation: "Use as a baseline against promo-heavy dates.",
  },
  {
    ...weatherBase,
    Date: "2026-07-07",
    DayOfWeek: "Tuesday",
    PromoFlag: "Y",
    WeatherCondition: "Rain",
    TempHigh: 74,
    TempLow: 62,
    HeatIndex: 74,
    RainChance: 78,
    RainInches: 0.42,
    WindMPH: 16,
    WeatherRiskScore: 81,
    ExpectedTrips: 930,
    ActualTrips: 734,
    TripDelta: -196,
    TripDeltaPercent: -21.1,
    FSPRedemptions: 112,
    TGRedemptions: 44,
    HotelBookings: 29,
    FoodRedemptions: 72,
    TheoWin: 74300,
    ActualWin: 18100,
    Recommendation: "Rain likely reduced trips. Compare app engagement.",
  },
  {
    ...weatherBase,
    Date: "2026-07-08",
    DayOfWeek: "Wednesday",
    PromoFlag: "Y",
    WeatherCondition: "Cloudy",
    TempHigh: 79,
    TempLow: 63,
    HeatIndex: 80,
    RainChance: 35,
    RainInches: 0.05,
    WindMPH: 10,
    WeatherRiskScore: 38,
    ExpectedTrips: 970,
    ActualTrips: 948,
    TripDelta: -22,
    TripDeltaPercent: -2.3,
    FSPRedemptions: 126,
    TGRedemptions: 39,
    HotelBookings: 24,
    FoodRedemptions: 81,
    TheoWin: 100700,
    ActualWin: 26700,
    Recommendation: "Slight weather drag. Promo appears stable.",
  },
  {
    ...weatherBase,
    Date: "2026-07-09",
    DayOfWeek: "Thursday",
    EventFlag: "Y",
    PromoFlag: "Y",
    WeatherCondition: "Clear",
    TempHigh: 84,
    TempLow: 66,
    HeatIndex: 85,
    RainChance: 6,
    WindMPH: 7,
    WeatherRiskScore: 16,
    ExpectedTrips: 1120,
    ActualTrips: 1248,
    TripDelta: 128,
    TripDeltaPercent: 11.4,
    FSPRedemptions: 177,
    TGRedemptions: 72,
    HotelBookings: 38,
    FoodRedemptions: 102,
    TheoWin: 152900,
    ActualWin: 48200,
    Recommendation: "Clear weather plus event activity produced lift.",
  },
  {
    ...weatherBase,
    Date: "2026-07-10",
    DayOfWeek: "Friday",
    WeekendFlag: "Y",
    PromoFlag: "Y",
    WeatherCondition: "Wind",
    TempHigh: 88,
    TempLow: 68,
    HeatIndex: 89,
    RainChance: 12,
    WindMPH: 28,
    WeatherRiskScore: 55,
    ExpectedTrips: 1210,
    ActualTrips: 1136,
    TripDelta: -74,
    TripDeltaPercent: -6.1,
    FSPRedemptions: 168,
    TGRedemptions: 58,
    HotelBookings: 35,
    FoodRedemptions: 94,
    TheoWin: 130400,
    ActualWin: 31800,
    Recommendation: "Moderate weather risk. Weekend demand remains healthy.",
  },
];
const visibleOfferColumns: Array<keyof OfferDisplayRow> = [
  "PlayerID",
  "TierRank",
  "ActiveInactive",
  "TripsMonth",
  "DaysSinceLastTrip",
  "NetADT",
  "SegmentName",
  "OfferFSP",
  "OfferTG",
  "OfferHotel",
  "HotelNights",
  "HotelRoomType",
  "OfferFood",
  "OfferGift",
  "MailableFlag",
  "AppEligibleFlag",
  "ValidationStatus",
  "ValidationNotes",
];

const visibleWeatherColumns: Array<keyof WeatherTrafficRow> = [
  "Date",
  "DayOfWeek",
  "WeekendFlag",
  "EventFlag",
  "PromoFlag",
  "WeatherCondition",
  "TempHigh",
  "RainChance",
  "WeatherRiskScore",
  "ExpectedTrips",
  "ActualTrips",
  "TripDelta",
  "TripDeltaPercent",
  "FSPRedemptions",
  "HotelBookings",
  "FoodRedemptions",
  "Recommendation",
];

const offerMetricOptions: MetricOption[] = [
  {
    label: "Net ADT",
    key: "NetADT",
    format: "money",
    description: "Player value after adjustments.",
  },
  {
    label: "Trips This Month",
    key: "TripsMonth",
    format: "number",
    description: "Trips during the selected export month.",
  },
  {
    label: "Days Since Last Trip",
    key: "DaysSinceLastTrip",
    format: "number",
    description: "How long it has been since the player last visited.",
  },
  {
    label: "Total Trips",
    key: "TotalTrips",
    format: "number",
    description: "Total recorded trips in the demo player profile.",
  },
  {
    label: "Monthly Theo",
    key: "MonthlyTheo",
    format: "money",
    description: "Monthly theoretical win estimate.",
  },
  {
    label: "Coin In",
    key: "CoinIn",
    format: "money",
    description: "Total wagered amount represented in the demo row.",
  },
  {
    label: "Offer FSP",
    key: "OfferFSP",
    format: "money",
    description: "Assigned free slot play offer value.",
  },
  {
    label: "Offer TG",
    key: "OfferTG",
    format: "money",
    description: "Assigned table games offer value.",
  },
  {
    label: "Offer Food",
    key: "OfferFood",
    format: "money",
    description: "Assigned food offer value.",
  },
  {
    label: "Bonus Entries",
    key: "OfferBonusEntries",
    format: "number",
    description: "Assigned drawing or promotion entry amount.",
  },
  {
    label: "Redeemed Value",
    key: "TotalRedeemedValue",
    format: "money",
    description: "Total value redeemed after the offer period.",
  },
  {
    label: "Redemption Count",
    key: "RedemptionCount",
    format: "number",
    description: "Number of offer types redeemed.",
  },
  {
    label: "Post-Offer Trips",
    key: "PostOfferTrips",
    format: "number",
    description: "Trips recorded after offer assignment.",
  },
  {
    label: "Post-Offer Theo",
    key: "PostOfferTheo",
    format: "money",
    description: "Theo generated after offer assignment.",
  },
];

const weatherMetricOptions: MetricOption[] = [
  {
    label: "Weather Risk",
    key: "WeatherRiskScore",
    format: "number",
    description: "Modeled risk from heat, rain, wind, or weather friction.",
  },
  {
    label: "Temp High",
    key: "TempHigh",
    format: "number",
    description: "Daily high temperature.",
  },
  {
    label: "Rain Chance",
    key: "RainChance",
    format: "percent",
    description: "Chance of rain during the traffic window.",
  },
  {
    label: "Wind MPH",
    key: "WindMPH",
    format: "number",
    description: "Wind speed used as a travel friction signal.",
  },
  {
    label: "Expected Trips",
    key: "ExpectedTrips",
    format: "number",
    description: "Baseline expected player trips for the day.",
  },
  {
    label: "Actual Trips",
    key: "ActualTrips",
    format: "number",
    description: "Observed or simulated player trips.",
  },
  {
    label: "Trip Delta",
    key: "TripDelta",
    format: "number",
    description: "Actual trips minus expected trips.",
  },
  {
    label: "Trip Delta %",
    key: "TripDeltaPercent",
    format: "percent",
    description: "Percent difference between expected and actual trips.",
  },
  {
    label: "FSP Redemptions",
    key: "FSPRedemptions",
    format: "number",
    description: "Free slot play redemptions during the weather window.",
  },
  {
    label: "TG Redemptions",
    key: "TGRedemptions",
    format: "number",
    description: "Table games offer redemptions during the weather window.",
  },
  {
    label: "Hotel Bookings",
    key: "HotelBookings",
    format: "number",
    description: "Hotel demand signal during the weather window.",
  },
  {
    label: "Food Redemptions",
    key: "FoodRedemptions",
    format: "number",
    description: "Food offer redemptions during the weather window.",
  },
  {
    label: "Theo Win",
    key: "TheoWin",
    format: "money",
    description: "Theoretical win during the weather window.",
  },
  {
    label: "Actual Win",
    key: "ActualWin",
    format: "money",
    description: "Actual win during the weather window.",
  },
];

const offerInterpretationMetrics: CorrelationMetric[] = [
  { key: "NetADT", label: "Net ADT", format: "money" },
  { key: "TripsMonth", label: "Trips This Month", format: "number" },
  {
    key: "DaysSinceLastTrip",
    label: "Days Since Last Trip",
    format: "number",
  },
  { key: "MonthlyTheo", label: "Monthly Theo", format: "money" },
  { key: "OfferFSP", label: "Offer FSP", format: "money" },
  { key: "OfferTG", label: "Offer TG", format: "money" },
  { key: "OfferFood", label: "Offer Food", format: "money" },
  {
    key: "TotalRedeemedValue",
    label: "Redeemed Value",
    format: "money",
  },
  {
    key: "PostOfferTrips",
    label: "Post-Offer Trips",
    format: "number",
  },
  {
    key: "PostOfferTheo",
    label: "Post-Offer Theo",
    format: "money",
  },
];

const weatherInterpretationMetrics: CorrelationMetric[] = [
  {
    key: "WeatherRiskScore",
    label: "Weather Risk",
    format: "number",
  },
  { key: "TempHigh", label: "Temperature High", format: "number" },
  { key: "RainChance", label: "Rain Chance", format: "percent" },
  { key: "WindMPH", label: "Wind Speed", format: "number" },
  { key: "ExpectedTrips", label: "Expected Trips", format: "number" },
  { key: "ActualTrips", label: "Actual Trips", format: "number" },
  {
    key: "TripDeltaPercent",
    label: "Trip Delta Percent",
    format: "percent",
  },
  {
    key: "FSPRedemptions",
    label: "FSP Redemptions",
    format: "number",
  },
  {
    key: "HotelBookings",
    label: "Hotel Bookings",
    format: "number",
  },
  {
    key: "FoodRedemptions",
    label: "Food Redemptions",
    format: "number",
  },
  { key: "TheoWin", label: "Theo Win", format: "money" },
  { key: "ActualWin", label: "Actual Win", format: "money" },
];

const offerSchemaGroups = [
  {
    title: "Identity",
    fields: [
      "PlayerID",
      "UniversalID",
      "FirstName",
      "LastName",
      "TierRank",
      "PlayerStatus",
      "ActiveInactive",
      "HostName",
    ],
  },
  {
    title: "Player Value",
    fields: [
      "TotalTrips",
      "TripsMonth",
      "TripsLast3Months",
      "TripsLast6Months",
      "LastTripDate",
      "DaysSinceLastTrip",
      "CoinIn",
      "TheoWin",
      "ActualWin",
      "NetWinLoss",
      "ADT",
      "NetADT",
      "MonthlyTheo",
      "MonthlyActual",
    ],
  },
  {
    title: "Eligibility",
    fields: [
      "SegmentName",
      "OfferGroup",
      "WorthGroup",
      "VIPFlag",
      "NewMemberFlag",
      "BirthdayMonth",
      "MailableFlag",
      "EmailableFlag",
      "AppEligibleFlag",
      "DoNotMail",
      "DoNotEmail",
      "BadAddressFlag",
      "ExcludedFlag",
    ],
  },
  {
    title: "Offers",
    fields: [
      "OfferFSP",
      "OfferTG",
      "OfferHotel",
      "OfferHotelCode",
      "OfferFood",
      "OfferGift",
      "OfferBonusEntries",
      "BirthdayOffer",
    ],
  },
  {
    title: "Valid Dates",
    fields: [
      "FSPValidStart",
      "FSPValidEnd",
      "TGValidStart",
      "TGValidEnd",
      "HotelValidStart",
      "HotelValidEnd",
      "FoodValidStart",
      "FoodValidEnd",
      "GiftValidStart",
      "GiftValidEnd",
    ],
  },
  {
    title: "Redemption",
    fields: [
      "RedeemedFSP",
      "RedeemedTG",
      "RedeemedHotel",
      "RedeemedFood",
      "RedeemedGift",
      "TotalRedeemedValue",
      "RedemptionCount",
      "FirstRedeemDate",
      "LastRedeemDate",
      "OfferCost",
      "PostOfferTrips",
      "PostOfferTheo",
      "PostOfferActual",
    ],
  },
  {
    title: "Audit",
    fields: [
      "CampaignID",
      "CampaignName",
      "ExportMonth",
      "ExportDate",
      "SourceSystem",
      "SourceFile",
      "ScriptVersion",
      "ValidationStatus",
      "ValidationNotes",
      "DuplicateFlag",
      "MissingIDFlag",
      "MissingOfferFlag",
    ],
  },
];

const weatherSchemaGroups = [
  {
    title: "Calendar",
    fields: ["Date", "DayOfWeek", "WeekendFlag", "EventFlag", "PromoFlag"],
  },
  {
    title: "Weather",
    fields: [
      "WeatherCondition",
      "TempHigh",
      "TempLow",
      "HeatIndex",
      "RainChance",
      "RainInches",
      "WindMPH",
      "WeatherRiskScore",
    ],
  },
  {
    title: "Traffic",
    fields: ["ExpectedTrips", "ActualTrips", "TripDelta", "TripDeltaPercent"],
  },
  {
    title: "Redemption Demand",
    fields: [
      "FSPRedemptions",
      "TGRedemptions",
      "HotelBookings",
      "FoodRedemptions",
    ],
  },
  {
    title: "Gaming Result",
    fields: ["TheoWin", "ActualWin", "Recommendation"],
  },
];
function csvValue(value: unknown) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replaceAll('"', '""')}"`;
}

function downloadCsv<T extends object>(
  fileName: string,
  rows: T[],
  columns?: string[]
) {
  const headers = columns ?? Object.keys((rows[0] ?? {}) as object);

  const csv = [
    headers.map(csvValue).join(","),
    ...rows.map((row) => {
      const record = row as Record<string, unknown>;
      return headers.map((header) => csvValue(record[header])).join(",");
    }),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

function parseCsvText(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"' && nextChar === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") index += 1;

      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell);
  rows.push(row);

  const cleanRows = rows.filter((cells) =>
    cells.some((value) => value.trim() !== "")
  );

  const headers = cleanRows[0]?.map((header) => header.trim()) ?? [];

  const records = cleanRows.slice(1).map((cells) => {
    const record: Record<string, string> = {};

    headers.forEach((header, index) => {
      record[header] = cells[index]?.trim() ?? "";
    });

    return record;
  });

  return { headers, records };
}

function normalizeRecordToColumns(
  record: Record<string, string>,
  columns: string[]
) {
  const lookup = Object.fromEntries(
    Object.entries(record).map(([key, value]) => [
      key.trim().toLowerCase(),
      value,
    ])
  );

  const normalized: Record<string, string> = {};

  columns.forEach((column) => {
    normalized[column] = lookup[column.toLowerCase()] ?? "";
  });

  return normalized;
}

function parseNumber(value: unknown) {
  const cleaned = String(value ?? "")
    .replaceAll("$", "")
    .replaceAll("%", "")
    .replaceAll(",", "");

  const parsed = Number(cleaned);

  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeFlag(value: unknown): Flag {
  const cleaned = String(value ?? "").trim().toLowerCase();

  if (["y", "yes", "true", "1"].includes(cleaned)) return "Y";
  return "N";
}

function normalizeStatus(value: unknown): Status {
  const cleaned = String(value ?? "").trim().toLowerCase();

  if (cleaned.startsWith("fail")) return "Fail";
  if (cleaned.startsWith("review")) return "Review";
  return "Pass";
}

function normalizeActiveInactive(value: unknown): "Active" | "Inactive" {
  const cleaned = String(value ?? "").trim().toLowerCase();

  if (cleaned.startsWith("inactive")) return "Inactive";
  return "Active";
}

function normalizeHotelCode(value: unknown) {
  const cleaned = String(value ?? "").trim().toUpperCase().replace(/\s+/g, "");

  if (
    cleaned === "" ||
    cleaned === "0" ||
    cleaned === "NO" ||
    cleaned === "NONE"
  ) {
    return "NONE";
  }

  return cleaned;
}

function getHotelDetails(code: string) {
  const normalized = normalizeHotelCode(code);

  if (normalized === "NONE") {
    return {
      nights: "0",
      roomType: "No hotel offer",
    };
  }

  const nights = normalized.startsWith("2") ? "2" : "1";
  const roomCode = normalized.replace(/^\d+/, "");

  const roomType =
    roomCode === "DLX"
      ? "Deluxe"
      : roomCode === "PT"
        ? "Penthouse"
        : roomCode === "MS"
          ? "Master Suite"
          : "Custom hotel code";

  return { nights, roomType };
}

function parseOfferRow(record: Record<string, string>): PlayerOfferRow {
  const row = { ...offerBase } as Record<string, string | number>;

  offerColumns.forEach((column) => {
    const columnName = String(column);
    const incoming = record[columnName];
    const value =
      incoming === "" || incoming === undefined ? row[columnName] : incoming;

    if (numericOfferColumns.has(columnName)) {
      row[columnName] = parseNumber(value);
    } else if (flagOfferColumns.has(columnName)) {
      row[columnName] = normalizeFlag(value);
    } else if (columnName === "ValidationStatus") {
      row[columnName] = normalizeStatus(value);
    } else if (columnName === "ActiveInactive") {
      row[columnName] = normalizeActiveInactive(value);
    } else if (columnName === "OfferHotel" || columnName === "OfferHotelCode") {
      row[columnName] = normalizeHotelCode(value);
    } else {
      row[columnName] = String(value ?? "");
    }
  });

  const hotelCode = normalizeHotelCode(row.OfferHotel || row.OfferHotelCode);

  row.OfferHotel = hotelCode;
  row.OfferHotelCode = hotelCode;

  return row as unknown as PlayerOfferRow;
}

function parseWeatherRow(record: Record<string, string>): WeatherTrafficRow {
  const row = { ...weatherBase } as Record<string, string | number>;

  weatherColumns.forEach((column) => {
    const columnName = String(column);
    const incoming = record[columnName];
    const value =
      incoming === "" || incoming === undefined ? row[columnName] : incoming;

    if (numericWeatherColumns.has(columnName)) {
      row[columnName] = parseNumber(value);
    } else if (flagWeatherColumns.has(columnName)) {
      row[columnName] = normalizeFlag(value);
    } else {
      row[columnName] = String(value ?? "");
    }
  });

  return row as unknown as WeatherTrafficRow;
}

function validateRequiredColumns(headers: string[], requiredColumns: string[]) {
  const lowerHeaders = new Set(headers.map((header) => header.toLowerCase()));

  return requiredColumns.filter(
    (column) => !lowerHeaders.has(column.toLowerCase())
  );
}

function addHotelDisplayFields(row: PlayerOfferRow): OfferDisplayRow {
  const details = getHotelDetails(row.OfferHotel);

  return {
    ...row,
    HotelNights: details.nights,
    HotelRoomType: details.roomType,
  };
}

function formatMoney(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

function formatNumber(value: number) {
  return Math.round(value).toLocaleString();
}

function formatPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function formatCellValue(value: unknown) {
  if (typeof value === "number") return value.toLocaleString();
  if (value === "" || value === undefined || value === null) return "—";
  return String(value);
}

function getMetricNumber(row: object, key: string) {
  const value = (row as Record<string, unknown>)[key];

  if (typeof value === "number") return value;

  return parseNumber(value);
}

function formatMetricValue(value: number, format: MetricFormat) {
  if (format === "money") return formatMoney(value);
  if (format === "percent") return formatPercent(value);
  return formatNumber(value);
}
function getMetricStats(rows: object[], metric: MetricOption) {
  const values = rows.map((row) => getMetricNumber(row, metric.key));
  const sorted = [...values].sort((a, b) => a - b);

  const total = values.reduce((sum, value) => sum + value, 0);
  const average = values.length === 0 ? 0 : total / values.length;
  const min = sorted[0] ?? 0;
  const max = sorted[sorted.length - 1] ?? 0;

  const middle = Math.floor(sorted.length / 2);
  const median =
    sorted.length === 0
      ? 0
      : sorted.length % 2 === 0
        ? ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2
        : sorted[middle] ?? 0;

  return { values, total, average, median, min, max };
}

function averageValues(values: number[]) {
  if (values.length === 0) return 0;

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function calculateCorrelation(
  rows: object[],
  leftKey: string,
  rightKey: string
) {
  const pairs = rows
    .map((row) => ({
      left: getMetricNumber(row, leftKey),
      right: getMetricNumber(row, rightKey),
    }))
    .filter(
      (pair) => Number.isFinite(pair.left) && Number.isFinite(pair.right)
    );

  if (pairs.length < 3) return null;

  const leftMean = averageValues(pairs.map((pair) => pair.left));
  const rightMean = averageValues(pairs.map((pair) => pair.right));

  const numerator = pairs.reduce(
    (sum, pair) =>
      sum + (pair.left - leftMean) * (pair.right - rightMean),
    0
  );

  const leftVariance = pairs.reduce(
    (sum, pair) => sum + (pair.left - leftMean) ** 2,
    0
  );

  const rightVariance = pairs.reduce(
    (sum, pair) => sum + (pair.right - rightMean) ** 2,
    0
  );

  const denominator = Math.sqrt(leftVariance * rightVariance);

  if (denominator === 0) return null;

  return Math.max(-1, Math.min(1, numerator / denominator));
}

function buildCorrelationPairs(
  rows: object[],
  metrics: CorrelationMetric[]
): CorrelationPair[] {
  const pairs: CorrelationPair[] = [];

  for (let leftIndex = 0; leftIndex < metrics.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < metrics.length;
      rightIndex += 1
    ) {
      const left = metrics[leftIndex];
      const right = metrics[rightIndex];

      if (!left || !right) continue;

      const value = calculateCorrelation(rows, left.key, right.key);

      if (value === null) continue;

      pairs.push({ left, right, value });
    }
  }

  return pairs.sort(
    (first, second) => Math.abs(second.value) - Math.abs(first.value)
  );
}

function correlationStrength(value: number) {
  const absoluteValue = Math.abs(value);

  if (absoluteValue >= 0.8) return "Very strong";
  if (absoluteValue >= 0.6) return "Strong";
  if (absoluteValue >= 0.4) return "Moderate";
  if (absoluteValue >= 0.2) return "Weak";
  return "Little or no";
}

function correlationDirection(value: number) {
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "neutral";
}

function formatCorrelation(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}`;
}

function describeCorrelation(pair: CorrelationPair) {
  const direction = correlationDirection(pair.value);
  const movement =
    pair.value >= 0
      ? "higher values generally appear alongside higher values"
      : "higher values generally appear alongside lower values";

  return `${correlationStrength(pair.value)} ${direction} relationship: ${movement} in the currently loaded rows.`;
}


function pairIncludes(pair: CorrelationPair, keys: string[]) {
  return keys.includes(pair.left.key) || keys.includes(pair.right.key);
}

function metricLabelForKeys(pair: CorrelationPair, keys: string[]) {
  if (keys.includes(pair.left.key)) return pair.left.label;
  if (keys.includes(pair.right.key)) return pair.right.label;
  return "the selected metric";
}

function buildCorrelationGuidance(
  pair: CorrelationPair,
  lab: LabKey
): CorrelationGuidance {
  const positive = pair.value >= 0;
  const strength = correlationStrength(pair.value).toLowerCase();
  const leftLabel = pair.left.label;
  const rightLabel = pair.right.label;

  const offerValueKeys = ["NetADT", "MonthlyTheo", "TripsMonth"];
  const assignedOfferKeys = ["OfferFSP", "OfferTG", "OfferFood"];
  const redemptionKeys = ["TotalRedeemedValue"];
  const responseKeys = ["PostOfferTrips", "PostOfferTheo"];
  const recencyKeys = ["DaysSinceLastTrip"];

  const weatherPressureKeys = [
    "WeatherRiskScore",
    "TempHigh",
    "RainChance",
    "WindMPH",
  ];
  const trafficKeys = ["ActualTrips", "TripDeltaPercent"];
  const demandKeys = [
    "FSPRedemptions",
    "HotelBookings",
    "FoodRedemptions",
  ];
  const revenueKeys = ["TheoWin", "ActualWin"];

  if (lab === "offers") {
    if (
      pairIncludes(pair, offerValueKeys) &&
      pairIncludes(pair, assignedOfferKeys)
    ) {
      const valueMetric = metricLabelForKeys(pair, offerValueKeys);
      const offerMetric = metricLabelForKeys(pair, assignedOfferKeys);

      return positive
        ? {
            meaning: `In these rows, higher ${valueMetric} generally appears with higher ${offerMetric}. That is consistent with a tiered offer strategy where stronger player value receives a larger incentive.`,
            nextCheck: `Break the rows out by SegmentName, WorthGroup, and TierRank. Then compare the average ${offerMetric} with baseline ${valueMetric}, redemption, and post-offer results inside each group.`,
            possibleAction: `Keep the tiered structure if the higher offers also produce acceptable post-offer trips or theo. Add caps or review rules where offer value rises faster than player response.`,
            caution: `This does not prove the larger offer caused better behavior. The same player-value rule may be driving both metrics.`,
          }
        : {
            meaning: `In these rows, higher ${valueMetric} tends to appear with lower ${offerMetric}. That may mean the assignment rules are not scaling with player value, or that a reactivation or exception group is receiving larger offers than active high-value players.`,
            nextCheck: `Review the offer matrix by SegmentName, WorthGroup, active/inactive status, and exception flags. Look for reversed tiers, manual overrides, missing values, or special campaigns.`,
            possibleAction: `Flag mismatched rows for review before export. If the pattern is intentional, document the business rule so it is not mistaken for a bad assignment.`,
            caution: `A negative relationship can be valid when the campaign intentionally targets lower-value or lapsed players.`,
          };
    }

    if (
      pairIncludes(pair, assignedOfferKeys) &&
      pairIncludes(pair, redemptionKeys)
    ) {
      const offerMetric = metricLabelForKeys(pair, assignedOfferKeys);

      return positive
        ? {
            meaning: `Larger ${offerMetric} values are appearing with more redeemed value. That may show that the larger packages are being used, but raw redeemed dollars will naturally rise when the assigned amount is larger.`,
            nextCheck: `Calculate redemption rate, cost per redeemer, and post-offer theo by segment instead of comparing redeemed dollars alone. Compare similar players who received different offer levels where possible.`,
            possibleAction: `Keep the offer level only where utilization and post-offer value justify the cost. Reduce or test lower amounts in groups with high assigned cost but weak response.`,
            caution: `This relationship is partly mechanical because a larger available offer creates a larger possible redeemed amount.`,
          }
        : {
            meaning: `Larger ${offerMetric} values are appearing with lower redeemed value. That can point to weak utilization, poor delivery timing, eligibility friction, or offers that are too large for the segment receiving them.`,
            nextCheck: `Check app, mail, and email eligibility; valid dates; redemption flags; player recency; and whether the offer was actually delivered. Compare redemption rate by segment and channel.`,
            possibleAction: `Test smaller or differently timed offers, fix delivery problems, and review rows with large assignments but no redemption activity.`,
            caution: `Low redeemed value may reflect delivery or tracking gaps rather than a weak offer.`,
          };
    }

    if (
      pairIncludes(pair, redemptionKeys) &&
      pairIncludes(pair, responseKeys)
    ) {
      const responseMetric = metricLabelForKeys(pair, responseKeys);

      return positive
        ? {
            meaning: `Players with more redeemed value also show higher ${responseMetric}. That is a useful response signal and may indicate that the campaign is reaching players who return and generate activity.`,
            nextCheck: `Compare redeemers with non-redeemers who had similar NetADT, MonthlyTheo, trips, tier, and recency before the offer. Also compare the result against a pre-offer period.`,
            possibleAction: `Prioritize the segments where redemption is followed by meaningful trips or theo, then test whether the same pattern holds in another month or campaign.`,
            caution: `More active or valuable players may be more likely both to redeem and to return, so this is not proof that redemption caused the response.`,
          }
        : {
            meaning: `More redeemed value is appearing with lower ${responseMetric}. That may indicate expensive redemptions without enough follow-up activity, or a small set of unusual rows pulling the result downward.`,
            nextCheck: `Inspect the individual high-redemption rows, compare offer cost with post-offer theo, and separate reactivation, VIP, and active-player campaigns.`,
            possibleAction: `Review the economics of the affected segments before repeating the same package. Consider lower-cost tests or different eligibility thresholds.`,
            caution: `A short observation window can understate later trips or revenue, especially for infrequent players.`,
          };
    }

    if (
      pairIncludes(pair, recencyKeys) &&
      (pairIncludes(pair, ["TripsMonth"]) || pairIncludes(pair, responseKeys))
    ) {
      const activityMetric = pairIncludes(pair, ["TripsMonth"])
        ? "Trips This Month"
        : metricLabelForKeys(pair, responseKeys);

      return positive
        ? {
            meaning: `More days since the last trip is appearing with higher ${activityMetric}. That can happen when a reactivation campaign successfully brings back lapsed players, but it can also be driven by a few outliers.`,
            nextCheck: `Separate active and inactive segments, inspect the lapsed-player rows, and compare medians as well as averages.`,
            possibleAction: `If the pattern holds for reactivation players, preserve that campaign logic and track repeat visits after the first return.`,
            caution: `Recency and post-offer activity need a clear time window. Mixed campaign dates can make this relationship misleading.`,
          }
        : {
            meaning: `As days since the last trip increase, ${activityMetric} tends to decrease. That is the expected pattern when recent visitors remain more active than lapsed players.`,
            nextCheck: `Create recency bands such as 0–30, 31–60, 61–90, and 90+ days, then compare offer response and post-offer value inside each band.`,
            possibleAction: `Use different offer levels and messaging for recent, cooling, and lapsed players instead of treating all rows as one audience.`,
            caution: `Recent activity can be a stronger predictor than the offer itself, so compare within similar recency groups.`,
          };
    }

    if (
      pairIncludes(pair, offerValueKeys) &&
      pairIncludes(pair, responseKeys)
    ) {
      const valueMetric = metricLabelForKeys(pair, offerValueKeys);
      const responseMetric = metricLabelForKeys(pair, responseKeys);

      return positive
        ? {
            meaning: `Higher baseline ${valueMetric} is appearing with higher ${responseMetric}. The strongest players in the file are also producing stronger post-offer activity.`,
            nextCheck: `Compare response within narrow value bands so the result is not only describing the existing value hierarchy.`,
            possibleAction: `Use baseline value to forecast response, but measure incremental lift separately so high-value players are not over-credited to the campaign.`,
            caution: `This may reflect normal player value persistence rather than an effect from the assigned offer.`,
          }
        : {
            meaning: `Higher baseline ${valueMetric} is appearing with lower ${responseMetric}. That may point to fatigue, a weak offer fit for top players, or a small sample with unusual outcomes.`,
            nextCheck: `Review high-value rows individually, verify the post-offer window, and compare hosted, VIP, and standard segments separately.`,
            possibleAction: `Test a different benefit, channel, or timing for the affected high-value group rather than simply increasing the dollar amount.`,
            caution: `Small VIP samples can swing correlations sharply, so row-level review matters.`,
          };
    }
  }

  if (lab === "weather") {
    if (
      pairIncludes(pair, weatherPressureKeys) &&
      pairIncludes(pair, trafficKeys)
    ) {
      const weatherMetric = metricLabelForKeys(pair, weatherPressureKeys);
      const trafficMetric = metricLabelForKeys(pair, trafficKeys);

      return positive
        ? {
            meaning: `Higher ${weatherMetric} is appearing with higher ${trafficMetric}. That is not the usual weather-drag pattern, so another factor such as an event, promotion, weekend, or holiday may be overpowering the weather signal.`,
            nextCheck: `Split event and non-event days, promo and non-promo days, and weekends versus weekdays. Review the same relationship inside each group.`,
            possibleAction: `Do not increase staffing or marketing solely because of this correlation. First identify which event or promotion conditions are offsetting the weather risk.`,
            caution: `Weather and event activity can move together in a small sample and create a misleading positive relationship.`,
          }
        : {
            meaning: `Higher ${weatherMetric} is appearing with lower ${trafficMetric}. That supports the working idea that difficult weather is associated with traffic falling below the normal baseline.`,
            nextCheck: `Compare high-risk and low-risk days with similar weekday, event, and promotion conditions. Check whether the effect is driven by heat, rain, wind, or one extreme day.`,
            possibleAction: `Prepare staffing, app messaging, hotel, and food plans for high-risk days. Use the relationship as an operating threshold to test, not as a final rule.`,
            caution: `The relationship does not prove weather caused the traffic change; events, holidays, road conditions, and campaign intensity may also matter.`,
          };
    }

    if (
      pairIncludes(pair, weatherPressureKeys) &&
      pairIncludes(pair, ["HotelBookings"])
    ) {
      const weatherMetric = metricLabelForKeys(pair, weatherPressureKeys);

      return positive
        ? {
            meaning: `Higher ${weatherMetric} is appearing with more hotel bookings. Poor travel conditions may be reducing day trips while increasing the value of staying on property.`,
            nextCheck: `Compare local versus non-local guests, same-day bookings, occupancy, cancellations, and whether event dates are driving both hotel demand and weather exposure.`,
            possibleAction: `Consider hotel-focused messaging or stay packages on forecasted high-risk dates, then measure incremental bookings and total property value.`,
            caution: `Major events can increase hotel bookings regardless of weather, so control for the event calendar.`,
          }
        : {
            meaning: `Higher ${weatherMetric} is appearing with fewer hotel bookings. That may mean difficult conditions are discouraging travel altogether rather than shifting guests into overnight stays.`,
            nextCheck: `Review booking lead time, cancellations, drive-market distance, and event status. Compare forecasts with actual conditions.`,
            possibleAction: `Use earlier weather-triggered communication, flexible booking messages, or targeted offers for guests close enough to travel safely.`,
            caution: `Hotel bookings may be made days or weeks before the weather occurs, so same-day correlation can miss the true timing.`,
          };
    }

    if (
      pairIncludes(pair, trafficKeys) &&
      (pairIncludes(pair, demandKeys) || pairIncludes(pair, revenueKeys))
    ) {
      const trafficMetric = metricLabelForKeys(pair, trafficKeys);
      const outcomeMetric = pairIncludes(pair, demandKeys)
        ? metricLabelForKeys(pair, demandKeys)
        : metricLabelForKeys(pair, revenueKeys);

      return positive
        ? {
            meaning: `Higher ${trafficMetric} is appearing with higher ${outcomeMetric}. Busier days are also producing more of this demand or revenue measure.`,
            nextCheck: `Convert the outcome to a per-trip rate. For example, compare redemptions or theo per 100 trips so volume is separated from guest behavior.`,
            possibleAction: `Align staffing and inventory with forecast traffic, but use per-guest rates to decide whether the day was actually more productive.`,
            caution: `Total outcomes usually rise with total traffic. The per-trip result may tell a different story.`,
          }
        : {
            meaning: `Higher ${trafficMetric} is appearing with lower ${outcomeMetric}. That can signal lower-value traffic, capacity friction, a promotion mix change, or a few unusual days.`,
            nextCheck: `Review the rows with the largest traffic counts and compare per-trip redemptions, theo, actual win, event type, and operational notes.`,
            possibleAction: `Investigate whether busy days need different staffing, floor coverage, food capacity, or offer design rather than assuming more traffic automatically means more value.`,
            caution: `Actual win is volatile and may move opposite traffic over short periods even when theoretical value is healthy.`,
          };
    }

    if (
      pairIncludes(pair, ["ExpectedTrips"]) &&
      pairIncludes(pair, ["ActualTrips"])
    ) {
      return positive
        ? {
            meaning: `Expected and actual trips move together, which suggests the baseline forecast is tracking the general shape of demand.`,
            nextCheck: `Review the residuals: the days where actual trips differ most from expected trips. Then test whether weather, events, promotions, or weekdays explain those misses.`,
            possibleAction: `Keep the baseline model, but add the strongest residual drivers as adjustment factors and validate them on a later period.`,
            caution: `A high correlation can still hide a consistent over-forecast or under-forecast bias.`,
          }
        : {
            meaning: `Expected and actual trips are not moving together. The baseline may be missing important drivers or may be built on a different period than the rows being reviewed.`,
            nextCheck: `Check date alignment, event and promotion flags, weekday patterns, seasonality, and whether the expected values were generated before or after the actual period.`,
            possibleAction: `Rebuild or recalibrate the baseline before using weather adjustments for staffing or campaign decisions.`,
            caution: `A short or unusual period can make a reasonable long-run forecast look weak.`,
          };
    }
  }

  return {
    meaning: `${leftLabel} and ${rightLabel} show a ${strength} ${
      positive ? "positive" : "negative"
    } relationship in the loaded rows. That means they tend to move ${
      positive ? "in the same direction" : "in opposite directions"
    }, but the pattern does not explain why.`,
    nextCheck: `Plot the individual rows, inspect outliers, split the data into meaningful groups, and check whether the pattern remains after controlling for dates, segments, events, or other business rules.`,
    possibleAction: `Use this relationship to form a testable hypothesis. Make a small operational or campaign test, define the success metric in advance, and compare the result with a similar group or period.`,
    caution: `Correlation is a screening signal. It should narrow the investigation, not end it.`,
  };
}

function describeDistribution(
  stats: ReturnType<typeof getMetricStats>,
  metric: MetricOption
) {
  if (stats.values.length === 0) {
    return `No values are loaded for ${metric.label}.`;
  }

  const comparisonBase = Math.max(Math.abs(stats.median), 1);
  const averageMedianGap =
    Math.abs(stats.average - stats.median) / comparisonBase;

  if (averageMedianGap < 0.1) {
    return `${metric.label} is fairly balanced around its center because the average and median are close.`;
  }

  if (stats.average > stats.median) {
    return `${metric.label} is pulled upward by larger values because the average is above the median.`;
  }

  return `${metric.label} is pulled downward by smaller values because the average is below the median.`;
}

function buildHistogramBins(values: number[], metric: MetricOption) {
  if (values.length === 0) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return [
      {
        label: formatMetricValue(min, metric.format),
        count: values.length,
      },
    ];
  }

  const binCount = 6;
  const step = (max - min) / binCount;

  const bins = Array.from({ length: binCount }, (_, index) => {
    const start = min + step * index;
    const end = index === binCount - 1 ? max : min + step * (index + 1);

    return {
      label: `${formatMetricValue(start, metric.format)}–${formatMetricValue(
        end,
        metric.format
      )}`,
      count: 0,
    };
  });

  values.forEach((value) => {
    const index = Math.min(binCount - 1, Math.floor((value - min) / step));
    const bin = bins[index];

    if (bin) bin.count += 1;
  });

  return bins;
}

function PageButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-black shadow-[0_0_22px_rgba(34,211,238,0.25)] transition hover:-translate-y-0.5 hover:bg-cyan-300"
    >
      {children}
    </Link>
  );
}

function GhostButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/25 bg-black/25 px-4 py-2 text-sm font-bold text-cyan-200 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-300/10"
    >
      {children}
    </button>
  );
}

function ImportButton({
  id,
  onChange,
}: {
  id: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <label
        htmlFor={id}
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-cyan-300/25 bg-black/25 px-4 py-2 text-sm font-bold text-cyan-200 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-300/10"
      >
        <Upload size={15} />
        Import CSV
      </label>

      <input
        id={id}
        type="file"
        accept=".csv,text/csv"
        onChange={onChange}
        className="hidden"
      />
    </>
  );
}

function StatBox({
  label,
  value,
  accent = false,
  trend,
  description,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  trend?: "up" | "down" | "neutral";
  description?: string;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent
          ? "border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_25px_rgba(34,211,238,0.10)]"
          : "border-cyan-300/15 bg-black/25"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/80">
          {label}
        </p>

        {trend === "up" && <TrendingUp size={16} className="text-green-300" />}
        {trend === "down" && (
          <TrendingDown size={16} className="text-red-300" />
        )}
        {trend === "neutral" && (
          <BarChart3 size={16} className="text-cyan-300" />
        )}
      </div>

      <p
        className={
          accent
            ? "mt-2 text-3xl font-black text-cyan-200"
            : "mt-2 text-2xl font-black text-white"
        }
      >
        {value}
      </p>

      {description && (
        <p className="mt-2 text-xs leading-5 text-zinc-400">{description}</p>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const statusClass =
    status === "Pass" || status === "Y"
      ? "border-green-300/30 bg-green-400/10 text-green-200"
      : status === "Review"
        ? "border-yellow-300/30 bg-yellow-400/10 text-yellow-200"
        : status === "Fail" || status === "N"
          ? "border-red-300/30 bg-red-400/10 text-red-200"
          : "border-cyan-300/25 bg-cyan-300/10 text-cyan-200";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${statusClass}`}
    >
      {status}
    </span>
  );
}

function RequiredColumnsPanel({
  title,
  columns,
}: {
  title: string;
  columns: string[];
}) {
  return (
    <div className="rounded-[2rem] border border-yellow-300/20 bg-yellow-300/10 p-5">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-300">
        Required Import Columns
      </p>

      <h3 className="mt-2 text-xl font-black text-white">{title}</h3>

      <div className="mt-4 flex flex-wrap gap-2">
        {columns.map((column) => (
          <span
            key={column}
            className="rounded-full border border-yellow-300/35 bg-yellow-300/15 px-3 py-1 text-xs font-black text-yellow-100"
          >
            {column}
          </span>
        ))}
      </div>
    </div>
  );
}

function DataTable<T extends object>({
  columns,
  rows,
  requiredColumns = [],
}: {
  columns: Array<keyof T>;
  rows: T[];
  requiredColumns?: string[];
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-black/25">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="border-b border-cyan-300/15 bg-cyan-300/10 text-xs uppercase tracking-[0.16em] text-cyan-200">
            <tr>
              {columns.map((column) => {
                const columnName = String(column);
                const isRequired = requiredColumns.includes(columnName);

                return (
                  <th
                    key={columnName}
                    className={`whitespace-nowrap px-4 py-4 ${
                      isRequired ? "bg-yellow-300/10 text-yellow-200" : ""
                    }`}
                  >
                    {columnName}
                    {isRequired && (
                      <span className="ml-2 rounded-full border border-yellow-300/30 px-2 py-0.5 text-[10px] text-yellow-100">
                        Required
                      </span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-cyan-300/10 text-zinc-300 last:border-b-0"
              >
                {columns.map((column) => {
                  const columnName = String(column);
                  const value = (row as Record<string, unknown>)[columnName];
                  const isRequired = requiredColumns.includes(columnName);

                  return (
                    <td
                      key={columnName}
                      className={`whitespace-nowrap px-4 py-4 ${
                        isRequired ? "bg-yellow-300/5 text-yellow-50" : ""
                      }`}
                    >
                      {columnName.includes("Flag") ||
                      columnName.includes("Status") ? (
                        <StatusPill status={String(value)} />
                      ) : (
                        formatCellValue(value)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricDropdown({
  value,
  options,
  onChange,
}: {
  value: MetricOption;
  options: MetricOption[];
  onChange: (option: MetricOption) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
        Analyze Metric
      </span>

      <select
        value={value.key}
        onChange={(event) => {
          const next =
            options.find((option) => option.key === event.target.value) ??
            value;

          onChange(next);
        }}
        className="mt-3 w-full rounded-full border border-cyan-300/25 bg-black px-5 py-4 text-lg font-black text-cyan-100 outline-none transition focus:border-cyan-300"
      >
        {options.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function HistogramCard({
  title,
  rows,
  metric,
}: {
  title: string;
  rows: object[];
  metric: MetricOption;
}) {
  const stats = getMetricStats(rows, metric);
  const bins = buildHistogramBins(stats.values, metric);
  const maxCount = Math.max(...bins.map((bin) => bin.count), 1);

  return (
    <div className="rounded-[2rem] border border-cyan-300/15 bg-black/25 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            Histogram
          </p>

          <h3 className="mt-2 text-2xl font-black text-white">{title}</h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            {metric.description}
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 px-4 py-3 text-right">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
            Avg
          </p>
          <p className="text-2xl font-black text-cyan-100">
            {formatMetricValue(stats.average, metric.format)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <StatBox
          label="Min"
          value={formatMetricValue(stats.min, metric.format)}
        />
        <StatBox
          label="Median"
          value={formatMetricValue(stats.median, metric.format)}
          accent
        />
        <StatBox
          label="Max"
          value={formatMetricValue(stats.max, metric.format)}
        />
        <StatBox
          label="Total"
          value={formatMetricValue(stats.total, metric.format)}
        />
      </div>

      <div className="mt-7 rounded-3xl border border-cyan-300/10 bg-black/30 p-5">
        {bins.length === 0 ? (
          <div className="flex min-h-[230px] items-center justify-center text-sm text-zinc-500">
            Import rows to generate a histogram.
          </div>
        ) : (
          <div
            className="grid min-h-[230px] items-end gap-3"
            style={{
              gridTemplateColumns: `repeat(${bins.length}, minmax(0, 1fr))`,
            }}
          >
            {bins.map((bin) => {
              const height = Math.max(8, (bin.count / maxCount) * 100);

              return (
                <div
                  key={bin.label}
                  className="flex h-full flex-col justify-end"
                >
                  <p className="mb-2 text-center text-sm font-black text-cyan-100">
                    {bin.count}
                  </p>

                  <div className="flex h-44 items-end rounded-2xl border border-cyan-300/10 bg-black/30 p-1">
                    <div
                      className="w-full rounded-xl bg-cyan-300 shadow-[0_0_22px_rgba(34,211,238,0.28)] transition-all"
                      style={{ height: `${height}%` }}
                    />
                  </div>

                  <p className="mt-3 min-h-10 text-center text-[10px] font-bold leading-4 text-zinc-400">
                    {bin.label}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
function CorrelationSummaryCard({
  title,
  pair,
  icon,
  lab,
}: {
  title: string;
  pair?: CorrelationPair;
  icon: ReactNode;
  lab: LabKey;
}) {
  if (!pair) {
    return (
      <div className="rounded-3xl border border-cyan-300/15 bg-black/25 p-5">
        <div className="flex items-center gap-2 text-cyan-300">
          {icon}
          <p className="text-xs font-black uppercase tracking-[0.2em]">
            {title}
          </p>
        </div>

        <p className="mt-4 text-sm leading-6 text-zinc-400">
          There is not enough variation in the loaded rows to calculate a
          useful relationship here. Import more rows or check whether one of
          the columns contains the same value throughout the file.
        </p>
      </div>
    );
  }

  const isPositive = pair.value >= 0;
  const guidance = buildCorrelationGuidance(pair, lab);

  return (
    <div className="rounded-3xl border border-cyan-300/15 bg-black/25 p-5">
      <div className="flex items-center gap-2 text-cyan-300">
        {icon}
        <p className="text-xs font-black uppercase tracking-[0.2em]">{title}</p>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="break-words text-lg font-black text-white">
            {pair.left.label} ↔ {pair.right.label}
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {describeCorrelation(pair)}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-sm font-black ${
            isPositive
              ? "border-green-300/30 bg-green-400/10 text-green-200"
              : "border-red-300/30 bg-red-400/10 text-red-200"
          }`}
        >
          {formatCorrelation(pair.value)}
        </span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full ${
            isPositive ? "bg-green-300" : "bg-red-300"
          }`}
          style={{
            width: `${Math.max(4, Math.abs(pair.value) * 100)}%`,
          }}
        />
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
            What this may mean
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            {guidance.meaning}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-300">
            What I would check next
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            {guidance.nextCheck}
          </p>
        </div>
      </div>
    </div>
  );
}

function DataInterpretationPanel({
  title,
  summary,
  rowCount,
  correlations,
  findings,
  lab,
}: {
  title: string;
  summary: string;
  rowCount: number;
  correlations: CorrelationPair[];
  findings: InterpretationFinding[];
  lab: LabKey;
}) {
  const strongestPositive = [...correlations]
    .filter((pair) => pair.value > 0)
    .sort((first, second) => second.value - first.value)[0];

  const strongestNegative = [...correlations]
    .filter((pair) => pair.value < 0)
    .sort((first, second) => first.value - second.value)[0];

  const topRelationships = correlations.slice(0, 6);
  const leadPair = correlations[0];
  const leadGuidance = leadPair
    ? buildCorrelationGuidance(leadPair, lab)
    : null;

  return (
    <section className={`${glassPanel} p-6 md:p-8`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
            <Sparkles size={14} />
            My Read of the Data
          </div>

          <h3 className="mt-5 text-3xl font-black text-white md:text-4xl">
            {title}
          </h3>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-300 md:text-base">
            {summary}
          </p>
        </div>

        <div className="rounded-3xl border border-cyan-300/20 bg-black/25 px-5 py-4 text-right">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
            Rows Reviewed
          </p>
          <p className="mt-2 text-3xl font-black text-white">{rowCount}</p>
          <p className="mt-1 text-xs text-zinc-500">
            This section recalculates when a CSV is imported.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        <CorrelationSummaryCard
          title="Strongest Positive Relationship"
          pair={strongestPositive}
          icon={<TrendingUp size={16} />}
          lab={lab}
        />

        <CorrelationSummaryCard
          title="Strongest Negative Relationship"
          pair={strongestNegative}
          icon={<TrendingDown size={16} />}
          lab={lab}
        />
      </div>

      {leadPair && leadGuidance && (
        <div className="mt-7 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/[0.06] p-5 md:p-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            How I would use the strongest signal
          </p>

          <h4 className="mt-3 text-2xl font-black text-white">
            {leadPair.left.label} and {leadPair.right.label} are the first place
            I would investigate
          </h4>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-cyan-300/15 bg-black/25 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                Working hypothesis
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {leadGuidance.meaning}
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-300/15 bg-black/25 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                Next comparison
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {leadGuidance.nextCheck}
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-300/15 bg-black/25 p-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                Possible action
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {leadGuidance.possibleAction}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
              Before acting on it
            </p>
            <p className="mt-2 text-sm leading-6 text-yellow-50/85">
              {leadGuidance.caution}
            </p>
          </div>
        </div>
      )}

      <div className="mt-7">
        <div className="flex items-center gap-2">
          <BarChart3 size={17} className="text-cyan-300" />
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            Other relationships worth reviewing
          </p>
        </div>

        {topRelationships.length === 0 ? (
          <div className="mt-4 rounded-3xl border border-cyan-300/15 bg-black/25 p-5 text-sm leading-6 text-zinc-400">
            Add at least three rows with real variation to calculate
            correlations. A column filled with the same value cannot produce a
            useful relationship.
          </div>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {topRelationships.map((pair) => {
              const guidance = buildCorrelationGuidance(pair, lab);

              return (
                <div
                  key={`${pair.left.key}-${pair.right.key}`}
                  className="rounded-2xl border border-cyan-300/15 bg-black/25 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-black leading-5 text-white">
                      {pair.left.label} ↔ {pair.right.label}
                    </p>
                    <span
                      className={
                        pair.value >= 0
                          ? "text-sm font-black text-green-300"
                          : "text-sm font-black text-red-300"
                      }
                    >
                      {formatCorrelation(pair.value)}
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-bold leading-5 text-zinc-400">
                    {correlationStrength(pair.value)}{" "}
                    {correlationDirection(pair.value)} association
                  </p>

                  <p className="mt-3 text-xs leading-5 text-zinc-300">
                    {guidance.meaning}
                  </p>

                  <div className="mt-3 border-t border-white/10 pt-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-300">
                      Practical next step
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-400">
                      {guidance.possibleAction}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-7">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
          File-level findings
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {findings.map((finding) => (
            <StatBox
              key={finding.label}
              label={finding.label}
              value={finding.value}
              trend={finding.trend}
              description={finding.text}
            />
          ))}
        </div>
      </div>

      <div className="mt-7 rounded-3xl border border-yellow-300/20 bg-yellow-300/10 p-5">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-300">
          What correlation can and cannot tell us
        </p>

        <p className="mt-3 text-sm leading-7 text-yellow-50/85">
          A correlation tells me which columns move together strongly enough to
          investigate. It does not tell me that one column caused the other. I
          would use the result to form a working hypothesis, split the data into
          fair comparison groups, inspect outliers, confirm the time window, and
          test the decision on a later campaign or period before turning it into
          a production rule.
        </p>
      </div>
    </section>
  );
}

function OfferExportModel() {
  const [rows, setRows] = useState<PlayerOfferRow[]>(offerRowsDefault);
  const [importMessage, setImportMessage] = useState(
    "Using demo data. Download the template, fill it out, then import it here."
  );
  const [selectedMetric, setSelectedMetric] = useState<MetricOption>(
    offerMetricOptions[0]!
  );

  const displayRows = useMemo(() => rows.map(addHotelDisplayFields), [rows]);

  const stats = useMemo(() => {
    return {
      totalRows: rows.length,
      passRows: rows.filter((row) => row.ValidationStatus === "Pass").length,
      reviewRows: rows.filter((row) => row.ValidationStatus === "Review")
        .length,
      failRows: rows.filter((row) => row.ValidationStatus === "Fail").length,
      totalFsp: rows.reduce((sum, row) => sum + row.OfferFSP, 0),
      totalFood: rows.reduce((sum, row) => sum + row.OfferFood, 0),
      totalRedeemed: rows.reduce(
        (sum, row) => sum + row.TotalRedeemedValue,
        0
      ),
      appEligible: rows.filter((row) => row.AppEligibleFlag === "Y").length,
    };
  }, [rows]);

  const interpretation = useMemo(() => {
    const metricStats = getMetricStats(rows, selectedMetric);
    const correlations = buildCorrelationPairs(
      rows,
      offerInterpretationMetrics
    );

    const passRate =
      rows.length === 0 ? 0 : (stats.passRows / rows.length) * 100;

    const appEligibleRate =
      rows.length === 0 ? 0 : (stats.appEligible / rows.length) * 100;

    const totalOfferCost = rows.reduce(
      (sum, row) => sum + row.OfferCost,
      0
    );

    const redemptionRate =
      totalOfferCost === 0
        ? 0
        : (stats.totalRedeemed / totalOfferCost) * 100;

    const missingIdentityRows = rows.filter(
      (row) => row.MissingIDFlag === "Y" || !row.UniversalID
    ).length;

    const inactiveRows = rows.filter(
      (row) => row.ActiveInactive === "Inactive"
    ).length;

    const summary = `I am reviewing ${rows.length} player rows. ${stats.passRows} rows pass validation, ${stats.reviewRows} need review, and ${stats.failRows} fail, which puts the current pass rate at ${passRate.toFixed(
      1
    )}%. ${stats.appEligible} rows are app eligible (${appEligibleRate.toFixed(
      1
    )}%). For ${selectedMetric.label}, the average is ${formatMetricValue(
      metricStats.average,
      selectedMetric.format
    )}, the median is ${formatMetricValue(
      metricStats.median,
      selectedMetric.format
    )}, and the range runs from ${formatMetricValue(
      metricStats.min,
      selectedMetric.format
    )} to ${formatMetricValue(
      metricStats.max,
      selectedMetric.format
    )}. ${describeDistribution(
      metricStats,
      selectedMetric
    )} I would read the validation counts first, then use the relationships below to decide which assignment rules, segments, delivery flags, or response measures deserve a row-level review.`;

    const findings: InterpretationFinding[] = [
      {
        label: "Validation Ready",
        value: `${passRate.toFixed(1)}%`,
        text: `${stats.passRows} of ${rows.length} rows currently pass validation.`,
        trend: passRate >= 80 ? "up" : passRate >= 60 ? "neutral" : "down",
      },
      {
        label: "App Eligible",
        value: `${appEligibleRate.toFixed(1)}%`,
        text: `${stats.appEligible} rows can currently be used for app delivery.`,
        trend:
          appEligibleRate >= 80
            ? "up"
            : appEligibleRate >= 60
              ? "neutral"
              : "down",
      },
      {
        label: "Offer Utilization",
        value:
          totalOfferCost === 0 ? "No Cost Data" : `${redemptionRate.toFixed(1)}%`,
        text:
          totalOfferCost === 0
            ? "Add OfferCost values to compare assigned cost with redeemed value."
            : `${formatMoney(stats.totalRedeemed)} redeemed against ${formatMoney(
                totalOfferCost
              )} of recorded offer cost.`,
        trend:
          totalOfferCost === 0
            ? "neutral"
            : redemptionRate >= 70
              ? "up"
              : redemptionRate >= 40
                ? "neutral"
                : "down",
      },
      {
        label: "Rows Needing Attention",
        value: formatNumber(
          stats.reviewRows + stats.failRows + missingIdentityRows
        ),
        text: `${stats.reviewRows} review, ${stats.failRows} fail, ${missingIdentityRows} missing identity signals, and ${inactiveRows} inactive rows.`,
        trend:
          stats.reviewRows + stats.failRows + missingIdentityRows === 0
            ? "up"
            : "down",
      },
    ];

    return { summary, correlations, findings };
  }, [rows, selectedMetric, stats]);

  async function importOfferCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const parsed = parseCsvText(text);
    const missing = validateRequiredColumns(
      parsed.headers,
      requiredOfferColumns
    );

    if (missing.length > 0) {
      setImportMessage(`Missing required columns: ${missing.join(", ")}`);
      event.target.value = "";
      return;
    }

    const importedRows = parsed.records.map((record) =>
      parseOfferRow(normalizeRecordToColumns(record, offerColumns.map(String)))
    );

    setRows(importedRows);
    setImportMessage(
      `Imported ${importedRows.length} casino offer rows from ${file.name}.`
    );
    event.target.value = "";
  }

  return (
    <div className="space-y-8">
      <div className={`${glassPanel} p-6 md:p-8`}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
              Offer File Review
            </p>

            <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">
              Check the file before it reaches production
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
              I built this around the kind of monthly file review I actually did:
              pull the rows, confirm the required fields, inspect assignments,
              find exceptions, and understand what the response data is saying
              before anything moves forward.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <GhostButton
              onClick={() =>
                downloadCsv(
                  "casino-offer-template.csv",
                  [offerRowsDefault[0] ?? offerBase],
                  offerColumns.map(String)
                )
              }
            >
              <FileDown size={15} />
              Download Template
            </GhostButton>

            <ImportButton id="offer-import" onChange={importOfferCsv} />

            <GhostButton
              onClick={() => downloadCsv("casino-offer-export.csv", rows)}
            >
              <Download size={15} />
              Export CSV
            </GhostButton>

            <GhostButton
              onClick={() => {
                setRows(offerRowsDefault);
                setImportMessage("Reset to demo casino offer data.");
              }}
            >
              <RefreshCcw size={15} />
              Reset
            </GhostButton>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-black/25 p-4 text-sm text-cyan-100">
          {importMessage}
        </div>

        <div className="mt-7 grid items-start gap-5 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4 rounded-[2rem] border border-cyan-300/15 bg-black/25 p-5">
            <MetricDropdown
              value={selectedMetric}
              options={offerMetricOptions}
              onChange={setSelectedMetric}
            />

            <RequiredColumnsPanel
              title="Casino offer import"
              columns={requiredOfferColumns}
            />
          </div>

          <HistogramCard
            title={`${selectedMetric.label} distribution`}
            rows={rows}
            metric={selectedMetric}
          />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatBox label="Rows" value={stats.totalRows} accent />
          <StatBox label="Passed" value={stats.passRows} trend="up" />
          <StatBox label="Review" value={stats.reviewRows} trend="neutral" />
          <StatBox label="Failed" value={stats.failRows} trend="down" />
          <StatBox label="Total FSP" value={formatMoney(stats.totalFsp)} />
          <StatBox label="Total Food" value={formatMoney(stats.totalFood)} />
          <StatBox
            label="Redeemed Value"
            value={formatMoney(stats.totalRedeemed)}
          />
          <StatBox label="App Eligible" value={stats.appEligible} accent />
        </div>
      </div>

      <div className={`${glassPanel} p-5 md:p-6`}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
              Rows Behind the Result
            </p>
            <h3 className="mt-2 text-2xl font-black text-white">
              The records and fields behind the summary
            </h3>
          </div>

          <Table2 className="text-cyan-300" size={24} />
        </div>

        <DataTable
          columns={visibleOfferColumns}
          rows={displayRows}
          requiredColumns={requiredOfferColumns}
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {offerSchemaGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-3xl border border-cyan-300/15 bg-black/25 p-5"
            >
              <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                {group.title}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {group.fields.map((field) => {
                  const isRequired = requiredOfferColumns.includes(field);

                  return (
                    <span
                      key={field}
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${
                        isRequired
                          ? "border-yellow-300/35 bg-yellow-300/15 text-yellow-100"
                          : "border-cyan-300/15 bg-cyan-300/10 text-zinc-300"
                      }`}
                    >
                      {field}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <DataInterpretationPanel
        title="Offer quality, player value, and response signals"
        summary={interpretation.summary}
        rowCount={rows.length}
        correlations={interpretation.correlations}
        findings={interpretation.findings}
        lab="offers"
      />
    </div>
  );
}

function WeatherTrafficModel() {
  const [rows, setRows] = useState<WeatherTrafficRow[]>(weatherRowsDefault);
  const [importMessage, setImportMessage] = useState(
    "Using demo data. Download the template, fill it out, then import it here."
  );
  const [selectedMetric, setSelectedMetric] = useState<MetricOption>(
    weatherMetricOptions[0]!
  );

  const stats = useMemo(() => {
    const safeRows = rows.length > 0 ? rows : [weatherBase];
    const totalExpected = rows.reduce((sum, row) => sum + row.ExpectedTrips, 0);
    const totalActual = rows.reduce((sum, row) => sum + row.ActualTrips, 0);
    const totalTripDelta = totalActual - totalExpected;
    const totalTripDeltaPercent =
      totalExpected === 0 ? 0 : (totalTripDelta / totalExpected) * 100;

    const averageRisk =
      rows.length === 0
        ? 0
        : rows.reduce((sum, row) => sum + row.WeatherRiskScore, 0) /
          rows.length;

    return {
      averageRisk: Math.round(averageRisk),
      totalTripDelta,
      totalTripDeltaPercent,
      hotelDemandSignal: rows.reduce((sum, row) => sum + row.HotelBookings, 0),
      bestTrafficDay: safeRows.reduce((best, row) =>
        row.TripDelta > best.TripDelta ? row : best
      ),
      worstTrafficDay: safeRows.reduce((worst, row) =>
        row.TripDelta < worst.TripDelta ? row : worst
      ),
      highestRedemptionDay: safeRows.reduce((best, row) =>
        row.FSPRedemptions + row.FoodRedemptions >
        best.FSPRedemptions + best.FoodRedemptions
          ? row
          : best
      ),
    };
  }, [rows]);

  const interpretation = useMemo(() => {
    const metricStats = getMetricStats(rows, selectedMetric);
    const correlations = buildCorrelationPairs(
      rows,
      weatherInterpretationMetrics
    );

    const highRiskRows = rows.filter(
      (row) => row.WeatherRiskScore >= 60
    );

    const lowRiskRows = rows.filter(
      (row) => row.WeatherRiskScore <= 30
    );

    const eventRows = rows.filter((row) => row.EventFlag === "Y");
    const nonEventRows = rows.filter((row) => row.EventFlag === "N");

    const highRiskAverageDelta = averageValues(
      highRiskRows.map((row) => row.TripDeltaPercent)
    );

    const lowRiskAverageDelta = averageValues(
      lowRiskRows.map((row) => row.TripDeltaPercent)
    );

    const eventAverageTrips = averageValues(
      eventRows.map((row) => row.ActualTrips)
    );

    const nonEventAverageTrips = averageValues(
      nonEventRows.map((row) => row.ActualTrips)
    );

    const eventLift =
      nonEventAverageTrips === 0
        ? 0
        : ((eventAverageTrips - nonEventAverageTrips) /
            nonEventAverageTrips) *
          100;

    const riskTrafficCorrelation =
      calculateCorrelation(rows, "WeatherRiskScore", "TripDeltaPercent") ?? 0;

    const summary = `I am reviewing ${rows.length} daily rows. Actual traffic finished ${Math.abs(
      stats.totalTripDeltaPercent
    ).toFixed(1)}% ${
      stats.totalTripDeltaPercent >= 0 ? "above" : "below"
    } the expected baseline, a difference of ${formatNumber(
      Math.abs(stats.totalTripDelta)
    )} trips. Average weather risk is ${stats.averageRisk}/100. For ${selectedMetric.label}, the average is ${formatMetricValue(
      metricStats.average,
      selectedMetric.format
    )}, the median is ${formatMetricValue(
      metricStats.median,
      selectedMetric.format
    )}, and the range runs from ${formatMetricValue(
      metricStats.min,
      selectedMetric.format
    )} to ${formatMetricValue(
      metricStats.max,
      selectedMetric.format
    )}. ${describeDistribution(
      metricStats,
      selectedMetric
    )} I would compare high-risk and low-risk days first, then separate event, promotion, and weekend effects before treating weather as the reason traffic changed.`;

    const findings: InterpretationFinding[] = [
      {
        label: "Traffic vs Baseline",
        value: formatPercent(stats.totalTripDeltaPercent),
        text: `${formatNumber(
          Math.abs(stats.totalTripDelta)
        )} trips separate actual traffic from the expected total.`,
        trend: stats.totalTripDeltaPercent >= 0 ? "up" : "down",
      },
      {
        label: "High-Risk Day Delta",
        value:
          highRiskRows.length === 0
            ? "No High-Risk Days"
            : formatPercent(highRiskAverageDelta),
        text:
          highRiskRows.length === 0
            ? "No rows currently meet the 60+ weather-risk threshold."
            : `${highRiskRows.length} high-risk days average this trip variance.`,
        trend:
          highRiskRows.length === 0
            ? "neutral"
            : highRiskAverageDelta >= 0
              ? "up"
              : "down",
      },
      {
        label: "Low-Risk Day Delta",
        value:
          lowRiskRows.length === 0
            ? "No Low-Risk Days"
            : formatPercent(lowRiskAverageDelta),
        text:
          lowRiskRows.length === 0
            ? "No rows currently meet the 30-or-lower weather-risk threshold."
            : `${lowRiskRows.length} low-risk days average this trip variance.`,
        trend:
          lowRiskRows.length === 0
            ? "neutral"
            : lowRiskAverageDelta >= 0
              ? "up"
              : "down",
      },
      {
        label: "Event-Day Lift",
        value:
          eventRows.length === 0 || nonEventRows.length === 0
            ? "Need Both Groups"
            : formatPercent(eventLift),
        text:
          eventRows.length === 0 || nonEventRows.length === 0
            ? "Include both event and non-event days for a comparison."
            : `${formatNumber(
                eventAverageTrips
              )} average trips on event days versus ${formatNumber(
                nonEventAverageTrips
              )} on non-event days. Risk-to-trip-delta correlation is ${formatCorrelation(
                riskTrafficCorrelation
              )}.`,
        trend:
          eventRows.length === 0 || nonEventRows.length === 0
            ? "neutral"
            : eventLift >= 0
              ? "up"
              : "down",
      },
    ];

    return { summary, correlations, findings };
  }, [rows, selectedMetric, stats]);

  async function importWeatherCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const parsed = parseCsvText(text);
    const missing = validateRequiredColumns(
      parsed.headers,
      requiredWeatherColumns
    );

    if (missing.length > 0) {
      setImportMessage(`Missing required columns: ${missing.join(", ")}`);
      event.target.value = "";
      return;
    }

    const importedRows = parsed.records.map((record) =>
      parseWeatherRow(
        normalizeRecordToColumns(record, weatherColumns.map(String))
      )
    );

    setRows(importedRows);
    setImportMessage(
      `Imported ${importedRows.length} weather traffic rows from ${file.name}.`
    );
    event.target.value = "";
  }

  return (
    <div className="space-y-8">
      <div className={`${glassPanel} p-6 md:p-8`}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
              Traffic and Conditions Review
            </p>

            <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">
              See what may be moving traffic
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
              Import daily conditions, traffic, redemption, hotel, and gaming
              results. I use the comparisons to see which patterns are worth
              investigating, what may need an operating response, and what still
              needs a fairer test before I trust it.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <GhostButton
              onClick={() =>
                downloadCsv(
                  "weather-player-traffic-template.csv",
                  [weatherRowsDefault[0] ?? weatherBase],
                  weatherColumns.map(String)
                )
              }
            >
              <FileDown size={15} />
              Download Template
            </GhostButton>

            <ImportButton id="weather-import" onChange={importWeatherCsv} />

            <GhostButton
              onClick={() =>
                downloadCsv("weather-player-traffic-export.csv", rows)
              }
            >
              <Download size={15} />
              Export CSV
            </GhostButton>

            <GhostButton
              onClick={() => {
                setRows(weatherRowsDefault);
                setImportMessage("Reset to demo weather traffic data.");
              }}
            >
              <RefreshCcw size={15} />
              Reset
            </GhostButton>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-black/25 p-4 text-sm text-cyan-100">
          {importMessage}
        </div>

        <div className="mt-7 grid items-start gap-5 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4 rounded-[2rem] border border-cyan-300/15 bg-black/25 p-5">
            <MetricDropdown
              value={selectedMetric}
              options={weatherMetricOptions}
              onChange={setSelectedMetric}
            />

            <RequiredColumnsPanel
              title="Weather traffic import"
              columns={requiredWeatherColumns}
            />
          </div>

          <HistogramCard
            title={`${selectedMetric.label} distribution`}
            rows={rows}
            metric={selectedMetric}
          />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatBox
            label="Avg Risk"
            value={`${stats.averageRisk}/100`}
            accent
          />
          <StatBox
            label="Trip Delta"
            value={formatNumber(stats.totalTripDelta)}
            trend={stats.totalTripDelta >= 0 ? "up" : "down"}
          />
          <StatBox
            label="Trip Delta %"
            value={formatPercent(stats.totalTripDeltaPercent)}
            trend={stats.totalTripDeltaPercent >= 0 ? "up" : "down"}
          />
          <StatBox
            label="Hotel Bookings"
            value={formatNumber(stats.hotelDemandSignal)}
            trend="neutral"
          />
          <StatBox
            label="Best Traffic Day"
            value={`${stats.bestTrafficDay.DayOfWeek || "—"} ${formatNumber(
              stats.bestTrafficDay.TripDelta
            )}`}
            trend="up"
          />
          <StatBox
            label="Worst Traffic Day"
            value={`${stats.worstTrafficDay.DayOfWeek || "—"} ${formatNumber(
              stats.worstTrafficDay.TripDelta
            )}`}
            trend="down"
          />
          <StatBox
            label="Highest Redemption"
            value={stats.highestRedemptionDay.DayOfWeek || "—"}
            accent
          />
          <StatBox
            label="Loaded Days"
            value={rows.length}
            description="Rows currently loaded from demo data or imported CSV."
          />
        </div>
      </div>

      <div className={`${glassPanel} p-5 md:p-6`}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
              Rows Behind the Result
            </p>
            <h3 className="mt-2 text-2xl font-black text-white">
              The daily records and fields behind the summary
            </h3>
          </div>

          <CloudSun className="text-cyan-300" size={24} />
        </div>

        <DataTable
          columns={visibleWeatherColumns}
          rows={rows}
          requiredColumns={requiredWeatherColumns}
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {weatherSchemaGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-3xl border border-cyan-300/15 bg-black/25 p-5"
            >
              <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                {group.title}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {group.fields.map((field) => {
                  const isRequired = requiredWeatherColumns.includes(field);

                  return (
                    <span
                      key={field}
                      className={`rounded-full border px-3 py-1 text-xs font-bold ${
                        isRequired
                          ? "border-yellow-300/35 bg-yellow-300/15 text-yellow-100"
                          : "border-cyan-300/15 bg-cyan-300/10 text-zinc-300"
                      }`}
                    >
                      {field}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <DataInterpretationPanel
        title="Weather, traffic, and demand relationships"
        summary={interpretation.summary}
        rowCount={rows.length}
        correlations={interpretation.correlations}
        findings={interpretation.findings}
        lab="weather"
      />
    </div>
  );
}

export default function DataLabPage() {
  const [activeLab, setActiveLab] = useState<LabKey>("offers");

  const labCards = [
    {
      key: "offers" as LabKey,
      title: "Casino Offer Export",
      eyebrow: "Monthly File Review",
      description:
        "I use this model to check assignment logic, required fields, delivery eligibility, validation status, player value, and post-offer response.",
      icon: ShieldCheck,
    },
    {
      key: "weather" as LabKey,
      title: "Weather vs. Player Traffic",
      eyebrow: "Traffic Investigation",
      description:
        "This model compares daily conditions with traffic, redemptions, hotel demand, and gaming results so I can see what deserves a closer look.",
      icon: CloudSun,
    },
  ];

  const activeLabDetails =
    labCards.find((card) => card.key === activeLab) ?? labCards[0];

  return (
    <main className="relative min-h-screen overflow-hidden px-5 pb-20 pt-28 text-white md:px-10">
      <section className="mx-auto max-w-7xl">
        <div className={`${glassPanel} p-6 md:p-10`}>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
                <Sparkles size={14} />
                Data Lab
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
                I wanted the numbers to explain themselves
              </h1>

              <p className="mt-6 max-w-4xl text-base leading-8 text-zinc-300 md:text-lg">
                A chart can show that two columns move together, but that is not
                the end of the analysis. I built this page to import a file,
                check whether the rows are usable, describe the distribution,
                find the strongest relationships, explain what those patterns
                may mean, and show what I would investigate before making a
                decision.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <PageButton href="/projects">
                View Projects
                <ExternalLink size={15} />
              </PageButton>

              <PageButton href="/playground">
                Open Playground
                <ExternalLink size={15} />
              </PageButton>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {labCards.map((card) => {
              const Icon = card.icon;
              const isActive = activeLab === card.key;

              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => setActiveLab(card.key)}
                  aria-pressed={isActive}
                  className={`group flex h-full flex-col text-left ${glassCard} p-6 ${
                    isActive
                      ? "border-cyan-300/60 bg-cyan-300/[0.11] shadow-[0_0_30px_rgba(34,211,238,0.12)]"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                        {card.eyebrow}
                      </p>

                      <h2 className="mt-3 text-2xl font-black text-white">
                        {card.title}
                      </h2>
                    </div>

                    <div
                      className={`rounded-2xl border p-3 ${
                        isActive
                          ? "border-cyan-200/60 bg-cyan-300 text-black"
                          : "border-cyan-300/25 bg-cyan-300/10 text-cyan-200"
                      }`}
                    >
                      <Icon size={24} />
                    </div>
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-6 text-zinc-400">
                    {card.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="inline-flex rounded-full border border-cyan-300/20 bg-black/25 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-100">
                      {isActive ? "Open now" : "Open model"}
                    </span>

                    {isActive && (
                      <span className="rounded-full bg-cyan-400 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-black">
                        Selected
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.07] p-4">
            <BarChart3 className="mt-0.5 shrink-0 text-cyan-300" size={18} />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                Currently open
              </p>
              <p className="mt-1 text-sm font-bold text-white">
                {activeLabDetails.title}
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {activeLabDetails.description}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {activeLab === "offers" && <OfferExportModel />}
          {activeLab === "weather" && <WeatherTrafficModel />}
        </div>

        <section className={`${glassPanel} mt-8 p-6 md:p-8`}>
          <div className="flex items-start gap-4">
            <BarChart3 className="mt-1 shrink-0 text-cyan-300" size={24} />

            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
                Why I built this page
              </p>

              <h2 className="mt-3 max-w-4xl text-3xl font-black text-white md:text-4xl">
                I wanted to show the part of analysis that happens after the
                export finishes
              </h2>

              <p className="mt-5 max-w-5xl text-sm leading-7 text-zinc-300 md:text-base">
                In my database work, pulling the rows was only the beginning. I
                still had to check IDs, assignment rules, eligibility, dates,
                suppression flags, duplicates, totals, delivery channels, and
                whether the output made sense against the business request. I
                also had to explain what the results meant to people who were
                not looking at the SQL or the raw file.
              </p>

              <p className="mt-4 max-w-5xl text-sm leading-7 text-zinc-300 md:text-base">
                That is what this page is trying to show. It does not stop at an
                average, histogram, or correlation coefficient. It turns the
                result into a working hypothesis, explains what I would compare
                next, suggests a possible action, and keeps the limitations next
                to the recommendation instead of hiding them.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-cyan-300/15 bg-black/25 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                    First: trust the file
                  </p>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">
                    Confirm required columns, data types, flags, IDs, dates,
                    duplicates, and validation status before interpreting the
                    results.
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-300/15 bg-black/25 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                    Then: explain the pattern
                  </p>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">
                    Describe the size and direction of the relationship in plain
                    language and connect it to the actual campaign or operating
                    question.
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-300/15 bg-black/25 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                    Finally: test the decision
                  </p>
                  <p className="mt-3 text-sm leading-6 text-zinc-300">
                    Compare fair groups, inspect outliers, define the success
                    metric, and validate the result on a later period before
                    making it a production rule.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
                  Demo data and privacy
                </p>
                <p className="mt-3 text-sm leading-7 text-yellow-50/85">
                  The records on this page are synthetic examples. They are
                  shaped like the kinds of files and checks I worked with, but
                  they do not contain private player information, internal
                  campaign data, or proprietary business rules.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
