// noinspection JSNonASCIINames

import L from "leaflet";
import { renderToString } from "react-dom/server";
import { GiBowieKnife, GiTrafficCone } from "react-icons/gi";
import { FaGun, FaMasksTheater } from "react-icons/fa6";
import { FaBeer, FaBomb, FaFire, FaFistRaised, FaMask, FaRadiation, FaSkull, FaSyringe } from "react-icons/fa";
import { PiSirenFill } from "react-icons/pi";
import { IoIosWarning } from "react-icons/io";
import React from "react";

type IconComponent = React.FC<{ className: string; }>;

const createDivIcon = (iconComponent: IconComponent) =>
  L.divIcon({
    className: "dummy",
    html: renderToString(React.createElement(iconComponent, { className: "w-[32px] h-[32px]" })),
    iconSize: [32, 32],
  });

export const trafficIcon = createDivIcon(GiTrafficCone);
export const gunIcon = createDivIcon(FaGun);
export const envIcon = createDivIcon(FaRadiation);
export const thiefIcon = createDivIcon(FaMask);
export const bombIcon = createDivIcon(FaBomb);
export const knifeIcon = createDivIcon(GiBowieKnife);
export const fireIcon = createDivIcon(FaFire);
export const beerIcon = createDivIcon(FaBeer);
export const drugIcon = createDivIcon(FaSyringe);
export const fistIcon = createDivIcon(FaFistRaised);
export const deadIcon = createDivIcon(FaSkull);
export const fraudIcon = createDivIcon(FaMasksTheater);
export const sirenIcon = createDivIcon(PiSirenFill);
export const warningIcon = createDivIcon(IoIosWarning);


export const iconMapping: Record<string, L.DivIcon> = {
  //traffic
  "Trafikbrott": trafficIcon,
  "Trafikhinder": trafficIcon,
  "Trafikkontroll": trafficIcon,
  "Trafikolycka": trafficIcon,
  "Trafikolycka, personskada": trafficIcon,
  "Trafikolycka, singel": trafficIcon,
  "Trafikolycka, smitning från": trafficIcon,
  "Trafikolycka, vilt": trafficIcon,
  "Olovlig körning": trafficIcon,
  //gun
  "Vapenlagen": gunIcon,
  "Rån väpnat": thiefIcon,
  "Olaga hot": gunIcon,
  "Skottlossning": gunIcon,
  "Skottlossning, misstänkt": gunIcon,
  //robber
  "Rån": thiefIcon,
  "Rån övrigt": thiefIcon,
  "Rån, försök": thiefIcon,
  "Stöld": thiefIcon,
  "Stöld, försök": thiefIcon,
  "Stöld/inbrott": thiefIcon,
  "Inbrott": thiefIcon,
  "Inbrott, försök": thiefIcon,
  "Motorfordon, anträffat stulet": thiefIcon,
  "Motorfordon, stöld": thiefIcon,
  "Larm inbrott": thiefIcon,
  "Häleri": thiefIcon,
  //environement
  "Spridning smittsamma kemikalier": envIcon,
  "Miljöbrott": envIcon,
  "Naturkatastrof": envIcon,
  //bomb
  "Bombhot": bombIcon,
  "Detonation": bombIcon,
  //knife
  "Knivlagen": knifeIcon,
  //fire
  "Brand": fireIcon,
  "Brand automatlarm": fireIcon,
  //alcohol
  "Alkohollagen": beerIcon,
  "Fylleri/LOB": beerIcon,
  "Rattfylleri": beerIcon,
  //drugs
  "Narkotikabrott": drugIcon,
  //abuse
  "Misshandel": fistIcon,
  "Misshandel, grov": fistIcon,
  "Ofog barn/ungdom": fistIcon,
  "Våld/hot mot tjänsteman": fistIcon,
  "Våldtäkt": fistIcon,
  "Våldtäkt, försök": fistIcon,
  "Vållande till kroppsskada": fistIcon,
  "Larm överfall": fistIcon,
  "Bråk": fistIcon,
  //death
  "Mord/dråp": deadIcon,
  "Mord/dråp, försök": deadIcon,
  "Anträffad död": deadIcon,
  //fraud
  "Berägeri": fraudIcon,
  "Missbruk av urkund": fraudIcon,
  "Förfalskningsbrott": fraudIcon,
  //siren
  "Varningslarm/haveri": sirenIcon,
  "Räddningsinsats": sirenIcon,
  "Polisinsats/kommendering": sirenIcon,
  "Ordningslagen": sirenIcon,
  "Kontroll person/fordon": sirenIcon,
  "Fjällräddning": sirenIcon,
  "Uppdatering": sirenIcon
};