export interface TagTemplate {
  param: string;
  desc: string;
  unit: string;
  type: 'ANALOG' | 'DIGITAL' | 'COUNTER';
  range?: [number, number];
}

export interface SectionTemplate {
  tags: TagTemplate[];
}

export interface SubstationTemplate {
  name: string;
  totalTags: number;
  sections: Record<string, SectionTemplate>;
}

export const SUBSTATION_TAG_TEMPLATES: Record<string, SubstationTemplate> = {
  "33/11kV": {
    name: "33/11kV Distribution Substation",
    totalTags: 250,
    sections: {
      "33kV_INCOMER": {
        tags: [
          // Electrical measurements (14 tags)
          { param: "V_RY", desc: "R-Y Line Voltage", unit: "kV", type: "ANALOG", range: [28, 38] },
          { param: "V_YB", desc: "Y-B Line Voltage", unit: "kV", type: "ANALOG", range: [28, 38] },
          { param: "V_BR", desc: "B-R Line Voltage", unit: "kV", type: "ANALOG", range: [28, 38] },
          { param: "I_R", desc: "R-Phase Current", unit: "A", type: "ANALOG", range: [0, 800] },
          { param: "I_Y", desc: "Y-Phase Current", unit: "A", type: "ANALOG", range: [0, 800] },
          { param: "I_B", desc: "B-Phase Current", unit: "A", type: "ANALOG", range: [0, 800] },
          { param: "P_3PH", desc: "Active Power", unit: "MW", type: "ANALOG", range: [0, 30] },
          { param: "Q_3PH", desc: "Reactive Power", unit: "MVAR", type: "ANALOG", range: [-10, 10] },
          { param: "PF", desc: "Power Factor", unit: "", type: "ANALOG", range: [0.8, 1.0] },
          { param: "FREQ", desc: "Frequency", unit: "Hz", type: "ANALOG", range: [49.5, 50.5] },
          { param: "KWH_IMP", desc: "Import Energy", unit: "MWh", type: "COUNTER" },
          { param: "KWH_EXP", desc: "Export Energy", unit: "MWh", type: "COUNTER" },
          { param: "THD_V", desc: "Voltage THD", unit: "%", type: "ANALOG", range: [0, 10] },
          { param: "THD_I", desc: "Current THD", unit: "%", type: "ANALOG", range: [0, 15] },
          // Switchgear status (8 tags)
          { param: "CB_STATUS", desc: "Circuit Breaker Status", unit: "", type: "DIGITAL" },
          { param: "CB_SPRING", desc: "CB Spring Charged", unit: "", type: "DIGITAL" },
          { param: "CB_TRIP_CNT", desc: "CB Trip Counter", unit: "", type: "COUNTER" },
          { param: "CB_CLOSE_COIL", desc: "Close Coil Healthy", unit: "", type: "DIGITAL" },
          { param: "CB_TRIP_COIL", desc: "Trip Coil Healthy", unit: "", type: "DIGITAL" },
          { param: "ISO1_STATUS", desc: "Line Isolator Status", unit: "", type: "DIGITAL" },
          { param: "ISO2_STATUS", desc: "Bus Isolator Status", unit: "", type: "DIGITAL" },
          { param: "ES_STATUS", desc: "Earth Switch Status", unit: "", type: "DIGITAL" },
          // Protection (5 tags)
          { param: "REL_50", desc: "Instantaneous OC (50) Status", unit: "", type: "DIGITAL" },
          { param: "REL_51", desc: "Time OC (51) Status", unit: "", type: "DIGITAL" },
          { param: "REL_51N", desc: "Earth Fault (51N) Status", unit: "", type: "DIGITAL" },
          { param: "REL_59", desc: "Overvoltage (59) Status", unit: "", type: "DIGITAL" },
          { param: "REL_27", desc: "Undervoltage (27) Status", unit: "", type: "DIGITAL" },
        ]
      },
      "POWER_TRANSFORMER": {
        tags: [
          { param: "V_HV", desc: "HV Side Voltage", unit: "kV", type: "ANALOG" },
          { param: "V_LV", desc: "LV Side Voltage", unit: "kV", type: "ANALOG" },
          { param: "I_HV", desc: "HV Current", unit: "A", type: "ANALOG" },
          { param: "I_LV", desc: "LV Current", unit: "A", type: "ANALOG" },
          { param: "OIL_TEMP", desc: "Oil Temperature", unit: "\u00b0C", type: "ANALOG", range: [20, 95] },
          { param: "WDG_TEMP", desc: "Winding Temperature", unit: "\u00b0C", type: "ANALOG", range: [20, 120] },
          { param: "OIL_LEVEL", desc: "Oil Level", unit: "%", type: "ANALOG", range: [0, 100] },
          { param: "TAP_POS", desc: "Tap Position", unit: "", type: "ANALOG", range: [1, 32] },
          { param: "BUCHHOLZ", desc: "Buchholz Relay", unit: "", type: "DIGITAL" },
          { param: "PRV", desc: "Pressure Relief Valve", unit: "", type: "DIGITAL" },
          { param: "OTI_ALARM", desc: "Oil Temp High Alarm", unit: "", type: "DIGITAL" },
          { param: "OTI_TRIP", desc: "Oil Temp Trip", unit: "", type: "DIGITAL" },
          { param: "WTI_ALARM", desc: "Winding Temp High Alarm", unit: "", type: "DIGITAL" },
          { param: "WTI_TRIP", desc: "Winding Temp Trip", unit: "", type: "DIGITAL" },
          { param: "MOG", desc: "Magnetic Oil Gauge", unit: "", type: "DIGITAL" },
          { param: "SF6_PRESS", desc: "SF6 Gas Pressure", unit: "bar", type: "ANALOG", range: [5.5, 7.0] },
          { param: "COOLING_FAN", desc: "Cooling Fan Status", unit: "", type: "DIGITAL" },
          { param: "COOLING_PUMP", desc: "Oil Pump Status", unit: "", type: "DIGITAL" },
          { param: "LOAD_PCT", desc: "Load Percentage", unit: "%", type: "ANALOG", range: [0, 150] },
          { param: "REL_87", desc: "Differential Protection (87)", unit: "", type: "DIGITAL" },
          { param: "REL_51", desc: "Overcurrent (51)", unit: "", type: "DIGITAL" },
          { param: "REL_49", desc: "Thermal Overload (49)", unit: "", type: "DIGITAL" },
        ]
      },
      "11kV_FEEDER": {
        tags: [
          { param: "V_RY", desc: "R-Y Line Voltage", unit: "kV", type: "ANALOG", range: [9.5, 12.5] },
          { param: "V_YB", desc: "Y-B Line Voltage", unit: "kV", type: "ANALOG", range: [9.5, 12.5] },
          { param: "V_BR", desc: "B-R Line Voltage", unit: "kV", type: "ANALOG", range: [9.5, 12.5] },
          { param: "I_R", desc: "R-Phase Current", unit: "A", type: "ANALOG", range: [0, 400] },
          { param: "I_Y", desc: "Y-Phase Current", unit: "A", type: "ANALOG", range: [0, 400] },
          { param: "I_B", desc: "B-Phase Current", unit: "A", type: "ANALOG", range: [0, 400] },
          { param: "P_3PH", desc: "Active Power", unit: "MW", type: "ANALOG", range: [0, 8] },
          { param: "Q_3PH", desc: "Reactive Power", unit: "MVAR", type: "ANALOG", range: [-3, 3] },
          { param: "PF", desc: "Power Factor", unit: "", type: "ANALOG", range: [0.8, 1.0] },
          { param: "FREQ", desc: "Frequency", unit: "Hz", type: "ANALOG", range: [49.5, 50.5] },
          { param: "KWH_IMP", desc: "Import Energy", unit: "MWh", type: "COUNTER" },
          { param: "CB_STATUS", desc: "Circuit Breaker Status", unit: "", type: "DIGITAL" },
          { param: "CB_SPRING", desc: "CB Spring Charged", unit: "", type: "DIGITAL" },
          { param: "CB_TRIP_CNT", desc: "CB Trip Counter", unit: "", type: "COUNTER" },
          { param: "ISO1_STATUS", desc: "Line Isolator Status", unit: "", type: "DIGITAL" },
          { param: "ISO2_STATUS", desc: "Bus Isolator Status", unit: "", type: "DIGITAL" },
          { param: "ES_STATUS", desc: "Earth Switch Status", unit: "", type: "DIGITAL" },
          { param: "AUTO_RECLOSE", desc: "Auto Recloser Status", unit: "", type: "DIGITAL" },
          { param: "RECLOSE_CNT", desc: "Reclosure Count", unit: "", type: "COUNTER" },
          { param: "FAULT_I", desc: "Fault Current", unit: "A", type: "ANALOG" },
          { param: "FAULT_DIST", desc: "Fault Distance", unit: "km", type: "ANALOG" },
          { param: "REL_50", desc: "Instantaneous OC (50)", unit: "", type: "DIGITAL" },
          { param: "REL_51", desc: "Time OC (51)", unit: "", type: "DIGITAL" },
          { param: "REL_51N", desc: "Earth Fault (51N)", unit: "", type: "DIGITAL" },
          { param: "REL_67", desc: "Directional OC (67) Status", unit: "", type: "DIGITAL" },
          { param: "REL_21", desc: "Distance Protection (21) Status", unit: "", type: "DIGITAL" },
        ]
      },
      "STATION_AUX": {
        tags: [
          { param: "DC_BATT_V", desc: "Battery Voltage", unit: "V", type: "ANALOG", range: [100, 140] },
          { param: "DC_BATT_I", desc: "Battery Current", unit: "A", type: "ANALOG" },
          { param: "CHARGER_STATUS", desc: "Battery Charger Status", unit: "", type: "DIGITAL" },
          { param: "UPS_STATUS", desc: "UPS Status", unit: "", type: "DIGITAL" },
          { param: "UPS_LOAD", desc: "UPS Load", unit: "%", type: "ANALOG" },
          { param: "AC_SUPPLY", desc: "AC Supply Available", unit: "", type: "DIGITAL" },
          { param: "DG_STATUS", desc: "DG Set Status", unit: "", type: "DIGITAL" },
          { param: "DG_FUEL", desc: "DG Fuel Level", unit: "%", type: "ANALOG" },
          { param: "FIRE_ALARM", desc: "Fire Alarm", unit: "", type: "DIGITAL" },
          { param: "INTRUSION", desc: "Security Intrusion", unit: "", type: "DIGITAL" },
          { param: "SCADA_COMM", desc: "SCADA Communication", unit: "", type: "DIGITAL" },
          { param: "GPS_SYNC", desc: "GPS Time Sync", unit: "", type: "DIGITAL" },
          { param: "AMBIENT_TEMP", desc: "Ambient Temperature", unit: "\u00b0C", type: "ANALOG" },
          { param: "HUMIDITY", desc: "Humidity", unit: "%", type: "ANALOG" },
        ]
      }
    }
  },
  "132/33kV": {
    name: "132/33kV Grid Substation",
    totalTags: 400,
    sections: {
      "132kV_INCOMER": {
        tags: [
          { param: "V_RY", desc: "R-Y Line Voltage", unit: "kV", type: "ANALOG", range: [118, 145] },
          { param: "V_YB", desc: "Y-B Line Voltage", unit: "kV", type: "ANALOG", range: [118, 145] },
          { param: "V_BR", desc: "B-R Line Voltage", unit: "kV", type: "ANALOG", range: [118, 145] },
          { param: "I_R", desc: "R-Phase Current", unit: "A", type: "ANALOG", range: [0, 1200] },
          { param: "I_Y", desc: "Y-Phase Current", unit: "A", type: "ANALOG", range: [0, 1200] },
          { param: "I_B", desc: "B-Phase Current", unit: "A", type: "ANALOG", range: [0, 1200] },
          { param: "P_3PH", desc: "Active Power", unit: "MW", type: "ANALOG", range: [0, 200] },
          { param: "Q_3PH", desc: "Reactive Power", unit: "MVAR", type: "ANALOG", range: [-50, 50] },
          { param: "PF", desc: "Power Factor", unit: "", type: "ANALOG", range: [0.8, 1.0] },
          { param: "FREQ", desc: "Frequency", unit: "Hz", type: "ANALOG", range: [49.5, 50.5] },
          { param: "KWH_IMP", desc: "Import Energy", unit: "MWh", type: "COUNTER" },
          { param: "KWH_EXP", desc: "Export Energy", unit: "MWh", type: "COUNTER" },
          { param: "THD_V", desc: "Voltage THD", unit: "%", type: "ANALOG", range: [0, 8] },
          { param: "THD_I", desc: "Current THD", unit: "%", type: "ANALOG", range: [0, 12] },
          { param: "CB_STATUS", desc: "Circuit Breaker Status", unit: "", type: "DIGITAL" },
          { param: "CB_SPRING", desc: "CB Spring Charged", unit: "", type: "DIGITAL" },
          { param: "CB_TRIP_CNT", desc: "CB Trip Counter", unit: "", type: "COUNTER" },
          { param: "CB_CLOSE_COIL", desc: "Close Coil Healthy", unit: "", type: "DIGITAL" },
          { param: "CB_TRIP_COIL", desc: "Trip Coil Healthy", unit: "", type: "DIGITAL" },
          { param: "ISO1_STATUS", desc: "Line Isolator Status", unit: "", type: "DIGITAL" },
          { param: "ISO2_STATUS", desc: "Bus Isolator Status", unit: "", type: "DIGITAL" },
          { param: "ES_STATUS", desc: "Earth Switch Status", unit: "", type: "DIGITAL" },
          { param: "SF6_PRESS", desc: "SF6 Gas Pressure", unit: "bar", type: "ANALOG", range: [5.5, 7.0] },
          { param: "SF6_DENSITY", desc: "SF6 Gas Density", unit: "kg/m\u00b3", type: "ANALOG", range: [35, 45] },
          { param: "REL_21", desc: "Distance Protection (21)", unit: "", type: "DIGITAL" },
          { param: "REL_50", desc: "Instantaneous OC (50)", unit: "", type: "DIGITAL" },
          { param: "REL_51", desc: "Time OC (51)", unit: "", type: "DIGITAL" },
          { param: "REL_51N", desc: "Earth Fault (51N)", unit: "", type: "DIGITAL" },
          { param: "REL_59", desc: "Overvoltage (59)", unit: "", type: "DIGITAL" },
          { param: "REL_27", desc: "Undervoltage (27)", unit: "", type: "DIGITAL" },
          { param: "REL_67", desc: "Directional OC (67)", unit: "", type: "DIGITAL" },
          { param: "REL_79", desc: "Auto Reclosing (79)", unit: "", type: "DIGITAL" },
          { param: "REL_87B", desc: "Bus Differential (87B)", unit: "", type: "DIGITAL" },
        ]
      },
      "132kV_BUS_COUPLER": {
        tags: [
          { param: "CB_STATUS", desc: "Bus Coupler CB Status", unit: "", type: "DIGITAL" },
          { param: "CB_SPRING", desc: "CB Spring Charged", unit: "", type: "DIGITAL" },
          { param: "ISO1_STATUS", desc: "Bus-1 Isolator Status", unit: "", type: "DIGITAL" },
          { param: "ISO2_STATUS", desc: "Bus-2 Isolator Status", unit: "", type: "DIGITAL" },
          { param: "I_R", desc: "R-Phase Current", unit: "A", type: "ANALOG", range: [0, 1200] },
          { param: "I_Y", desc: "Y-Phase Current", unit: "A", type: "ANALOG", range: [0, 1200] },
          { param: "I_B", desc: "B-Phase Current", unit: "A", type: "ANALOG", range: [0, 1200] },
          { param: "REL_50", desc: "Instantaneous OC (50)", unit: "", type: "DIGITAL" },
          { param: "REL_51", desc: "Time OC (51)", unit: "", type: "DIGITAL" },
        ]
      },
      "POWER_TRANSFORMER_132_33": {
        tags: [
          { param: "V_HV", desc: "132kV Side Voltage", unit: "kV", type: "ANALOG", range: [118, 145] },
          { param: "V_LV", desc: "33kV Side Voltage", unit: "kV", type: "ANALOG", range: [28, 38] },
          { param: "I_HV", desc: "HV Current", unit: "A", type: "ANALOG", range: [0, 500] },
          { param: "I_LV", desc: "LV Current", unit: "A", type: "ANALOG", range: [0, 2000] },
          { param: "P_3PH", desc: "Active Power", unit: "MW", type: "ANALOG", range: [0, 100] },
          { param: "Q_3PH", desc: "Reactive Power", unit: "MVAR", type: "ANALOG", range: [-30, 30] },
          { param: "OIL_TEMP", desc: "Oil Temperature", unit: "\u00b0C", type: "ANALOG", range: [20, 95] },
          { param: "WDG_TEMP", desc: "Winding Temperature", unit: "\u00b0C", type: "ANALOG", range: [20, 120] },
          { param: "OIL_LEVEL", desc: "Oil Level", unit: "%", type: "ANALOG", range: [0, 100] },
          { param: "TAP_POS", desc: "Tap Position", unit: "", type: "ANALOG", range: [1, 32] },
          { param: "TAP_MODE", desc: "Tap Change Mode (Auto/Manual)", unit: "", type: "DIGITAL" },
          { param: "BUCHHOLZ", desc: "Buchholz Relay", unit: "", type: "DIGITAL" },
          { param: "PRV", desc: "Pressure Relief Valve", unit: "", type: "DIGITAL" },
          { param: "OTI_ALARM", desc: "Oil Temp High Alarm", unit: "", type: "DIGITAL" },
          { param: "OTI_TRIP", desc: "Oil Temp Trip", unit: "", type: "DIGITAL" },
          { param: "WTI_ALARM", desc: "Winding Temp High Alarm", unit: "", type: "DIGITAL" },
          { param: "WTI_TRIP", desc: "Winding Temp Trip", unit: "", type: "DIGITAL" },
          { param: "MOG", desc: "Magnetic Oil Gauge", unit: "", type: "DIGITAL" },
          { param: "SF6_PRESS", desc: "SF6 Gas Pressure (HV Bushing)", unit: "bar", type: "ANALOG", range: [5.5, 7.0] },
          { param: "COOLING_FAN1", desc: "Cooling Fan Bank 1", unit: "", type: "DIGITAL" },
          { param: "COOLING_FAN2", desc: "Cooling Fan Bank 2", unit: "", type: "DIGITAL" },
          { param: "COOLING_PUMP", desc: "Oil Circulation Pump", unit: "", type: "DIGITAL" },
          { param: "LOAD_PCT", desc: "Load Percentage", unit: "%", type: "ANALOG", range: [0, 150] },
          { param: "REL_87T", desc: "Transformer Differential (87T)", unit: "", type: "DIGITAL" },
          { param: "REL_51", desc: "Overcurrent (51)", unit: "", type: "DIGITAL" },
          { param: "REL_49", desc: "Thermal Overload (49)", unit: "", type: "DIGITAL" },
          { param: "REL_64", desc: "Restricted Earth Fault (64)", unit: "", type: "DIGITAL" },
        ]
      },
      "33kV_FEEDER": {
        tags: [
          { param: "V_RY", desc: "R-Y Line Voltage", unit: "kV", type: "ANALOG", range: [28, 38] },
          { param: "V_YB", desc: "Y-B Line Voltage", unit: "kV", type: "ANALOG", range: [28, 38] },
          { param: "V_BR", desc: "B-R Line Voltage", unit: "kV", type: "ANALOG", range: [28, 38] },
          { param: "I_R", desc: "R-Phase Current", unit: "A", type: "ANALOG", range: [0, 800] },
          { param: "I_Y", desc: "Y-Phase Current", unit: "A", type: "ANALOG", range: [0, 800] },
          { param: "I_B", desc: "B-Phase Current", unit: "A", type: "ANALOG", range: [0, 800] },
          { param: "P_3PH", desc: "Active Power", unit: "MW", type: "ANALOG", range: [0, 30] },
          { param: "Q_3PH", desc: "Reactive Power", unit: "MVAR", type: "ANALOG", range: [-10, 10] },
          { param: "PF", desc: "Power Factor", unit: "", type: "ANALOG", range: [0.8, 1.0] },
          { param: "FREQ", desc: "Frequency", unit: "Hz", type: "ANALOG", range: [49.5, 50.5] },
          { param: "KWH_IMP", desc: "Import Energy", unit: "MWh", type: "COUNTER" },
          { param: "CB_STATUS", desc: "Circuit Breaker Status", unit: "", type: "DIGITAL" },
          { param: "CB_SPRING", desc: "CB Spring Charged", unit: "", type: "DIGITAL" },
          { param: "CB_TRIP_CNT", desc: "CB Trip Counter", unit: "", type: "COUNTER" },
          { param: "ISO1_STATUS", desc: "Line Isolator Status", unit: "", type: "DIGITAL" },
          { param: "ISO2_STATUS", desc: "Bus Isolator Status", unit: "", type: "DIGITAL" },
          { param: "ES_STATUS", desc: "Earth Switch Status", unit: "", type: "DIGITAL" },
          { param: "AUTO_RECLOSE", desc: "Auto Recloser Status", unit: "", type: "DIGITAL" },
          { param: "RECLOSE_CNT", desc: "Reclosure Count", unit: "", type: "COUNTER" },
          { param: "FAULT_I", desc: "Fault Current", unit: "A", type: "ANALOG" },
          { param: "FAULT_DIST", desc: "Fault Distance", unit: "km", type: "ANALOG" },
          { param: "REL_50", desc: "Instantaneous OC (50)", unit: "", type: "DIGITAL" },
          { param: "REL_51", desc: "Time OC (51)", unit: "", type: "DIGITAL" },
          { param: "REL_51N", desc: "Earth Fault (51N)", unit: "", type: "DIGITAL" },
          { param: "REL_67", desc: "Directional OC (67)", unit: "", type: "DIGITAL" },
        ]
      },
      "STATION_AUX": {
        tags: [
          { param: "DC_BATT_V", desc: "Battery Voltage", unit: "V", type: "ANALOG", range: [100, 140] },
          { param: "DC_BATT_I", desc: "Battery Current", unit: "A", type: "ANALOG" },
          { param: "CHARGER1_STATUS", desc: "Battery Charger 1 Status", unit: "", type: "DIGITAL" },
          { param: "CHARGER2_STATUS", desc: "Battery Charger 2 Status", unit: "", type: "DIGITAL" },
          { param: "UPS_STATUS", desc: "UPS Status", unit: "", type: "DIGITAL" },
          { param: "UPS_LOAD", desc: "UPS Load", unit: "%", type: "ANALOG" },
          { param: "AC_SUPPLY_1", desc: "AC Supply Source 1", unit: "", type: "DIGITAL" },
          { param: "AC_SUPPLY_2", desc: "AC Supply Source 2", unit: "", type: "DIGITAL" },
          { param: "DG_STATUS", desc: "DG Set Status", unit: "", type: "DIGITAL" },
          { param: "DG_FUEL", desc: "DG Fuel Level", unit: "%", type: "ANALOG" },
          { param: "DG_RUN_HRS", desc: "DG Running Hours", unit: "hrs", type: "COUNTER" },
          { param: "FIRE_ALARM", desc: "Fire Alarm", unit: "", type: "DIGITAL" },
          { param: "INTRUSION", desc: "Security Intrusion", unit: "", type: "DIGITAL" },
          { param: "SCADA_COMM", desc: "SCADA Communication", unit: "", type: "DIGITAL" },
          { param: "GPS_SYNC", desc: "GPS Time Sync", unit: "", type: "DIGITAL" },
          { param: "AMBIENT_TEMP", desc: "Ambient Temperature", unit: "\u00b0C", type: "ANALOG" },
          { param: "HUMIDITY", desc: "Humidity", unit: "%", type: "ANALOG" },
        ]
      }
    }
  }
};
