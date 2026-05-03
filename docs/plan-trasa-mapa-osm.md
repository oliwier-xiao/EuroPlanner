# Plan trasy z mapa OSM

## Faza A
- zapis wspolrzednych `lat` i `lng` dla punktow trasy,
- geokodowanie miasta i kraju przez Nominatim,
- podglad punktow na mapie Leaflet/OpenStreetMap.

## Faza B
- pobieranie trasy przejazdu z OSRM,
- prezentacja czasu przejazdu i dystansu,
- automatyczne odswiezanie po zmianie punktow.

## Faza C
- opcjonalna zmiana kolejnosci punktow,
- osobna kolejnosc `visit_order`, niezalezna od samych dat.

## Faza D
- alternatywy trasy dla 2 punktow,
- dla wiekszej liczby punktow wybieranie najszybszego przebiegu dla kazdego odcinka,
- wyswietlenie wynikowej polilinii na mapie.
