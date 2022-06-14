import { DecimalSource } from "break_eternity.js";
import { metaSave } from "./main";

export interface Version {
  alpha?: string;
  beta?: string;
  release?: string;
}

interface OptData {
  notation: number;
  distanceFormat: number;
  theme: number;
  autoSave: boolean;
  offlineTime: boolean;
  newsticker: boolean;
  hotkeys: boolean;
}

export interface Save {
  tab: string | null;
  version: Version;
  achs: number[];
  saveID: number;
  saveName: string;
  opts: OptData;
  modes: string[];
  lastTime: number;
  timePlayed: number;
  featuresUnl: string[];
  distance: DecimalSource;
  velocity: DecimalSource;
  rank: DecimalSource;
  tier: DecimalSource;
  rockets: DecimalSource;
  rocketFuel: DecimalSource;
}

export interface MetaSave {
  currentSave: number;
  saves: {
    [key: number]: Save;
  };
}

const LOCALSTORAGE_NAME = "dist-inc-rewrite-go-brrrr";

function createSaveID(times = 0) {
  return Math.floor(Math.abs(Math.sin(times * 1e10) * 1e10));
}

export function startingMetaSave(): MetaSave {
  const id = createSaveID();

  return {
    currentSave: id,
    saves: {
      [id]: startingSave(id),
    },
  };
}

export function startingSave(saveID: number, modes: string[] = []): Save {
  return {
    tab: null,
    version: {
      alpha: "1.0",
    },
    achs: [],
    saveID,
    saveName: "Save #" + saveID,
    opts: {
      notation: 0,
      distanceFormat: 0,
      theme: 0,
      autoSave: true,
      offlineTime: true,
      newsticker: true,
      hotkeys: true,
    },
    modes,
    lastTime: new Date().getTime(),
    timePlayed: 0,
    featuresUnl: [],
    distance: 0,
    velocity: 0,
    rank: 1,
    tier: 0,
    rockets: 0,
    rocketFuel: 0,
  };
}

export function versionControl(save: Save) {
  // version control shenanigans here

  save.version = startingSave(0).version;
}

export function loadSave(): MetaSave {
  const data = localStorage.getItem(LOCALSTORAGE_NAME);

  if (data === null) return startingMetaSave();
  else {
    try {
      return JSON.parse(atob(data));
    } catch (e) {
      alert(
        "It seems as though your save cannot be loaded! Please check the console for details!"
      );
      throw e;
    }
  }
}

export function saveGame(metaSave: MetaSave) {
  localStorage.setItem(LOCALSTORAGE_NAME, btoa(JSON.stringify(metaSave)));
}

export function loadSpecificSave(id: number) {
  metaSave.value.currentSave = id;
  saveGame(metaSave.value);

  location.reload();
}

export function deleteSpecificSave(id: number) {
  if (!confirm("Are you sure you want to delete this save?")) return;

  delete metaSave.value.saves[id];
  if (metaSave.value.currentSave == id) {
    metaSave.value.currentSave = Math.max(metaSave.value.currentSave - 1, 0);
    loadSpecificSave(metaSave.value.currentSave);
  }
}

export function getVersionDisplay(v: Version) {
  let display = "";

  if (v.release !== undefined) display += "v" + v.release + " ";
  if (v.beta !== undefined) display += "β" + v.beta + " ";
  if (v.alpha !== undefined) display += "α" + v.alpha;

  return display;
}