import create from "zustand";
import { useUserStore } from "../../../common/state/user-store";
import cpmToWpm from "@/utils/cpmToWpm";
import { getServerUrl } from "@/utils/getServerUrl";

export interface TrendsState {
  tenGameWPM: number | null;
  todayWPM: number | null;
  weekWPM: number | null;
  allTimeWPM: number | null;
}

export const useTrendStore = create<TrendsState>((_set, _get) => ({
  tenGameWPM: null,
  todayWPM: null,
  weekWPM: null,
  allTimeWPM: null,
}));

export const refreshTrends = () => {
  const isAnonymous = useUserStore.getState().isAnonymous;
  if (isAnonymous) {
    return;
  }
  const baseUrl = getServerUrl();
  const url = baseUrl + "/api/results/stats";
  fetch(url, {
    credentials: "include",
  }).then((res) =>
    res.json().then(({ cpmLast10, cpmToday, cpmLastWeek, cpmAllTime }) => {
      useTrendStore.setState(() => ({
        tenGameWPM: cpmToWpm(cpmLast10),
        todayWPM: cpmToWpm(cpmToday),
        weekWPM: cpmToWpm(cpmLastWeek),
        allTimeWPM: cpmToWpm(cpmAllTime),
      }));
    })
  );
};
