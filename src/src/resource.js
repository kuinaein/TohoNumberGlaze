export const RESOURCE_MAP = {
  SD_Chillno_json: 'res/erl/chillno/chillno.json',
  SD_Chillno_atlas: 'res/erl/chillno/chillno.atlas',
  SD_Chillno_png: 'res/erl/chillno/chillno.png',
  SD_Chillno2_png: 'res/erl/chillno/chillno2.png',

  Cutin_Chillno_png: 'res/cutin-chillno.png',

  BG_Mari_Sensu_png: 'res/bg-mari-sensu.png',
  Window_Green_png: 'res/window_green.png',
  Spell_Gauge_png: 'res/spell-gauge.png',
  Spell_Gauge_Full_png: 'res/spell-gauge-full.png',

  Particle_snow_png: 'res/snowflake.png',
};

if (!window.gResources) {
  window.gResources = [];
  for (const k of Object.keys(RESOURCE_MAP)) {
    gResources.push(RESOURCE_MAP[k]);
  }
}
