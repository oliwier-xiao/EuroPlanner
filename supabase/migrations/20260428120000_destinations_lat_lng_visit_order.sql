alter table if exists "Destinations"
  add column if not exists lat double precision;

alter table if exists "Destinations"
  add column if not exists lng double precision;

alter table if exists "Destinations"
  add column if not exists visit_order smallint;

comment on column "Destinations".lat is 'Latitude from OSM/Nominatim';
comment on column "Destinations".lng is 'Longitude from OSM/Nominatim';
comment on column "Destinations".visit_order is 'Manual or computed order for route display';
