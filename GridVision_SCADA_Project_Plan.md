# GridVision SCADA
## A SCADA Application for MSEDCL Smart Distribution Substations

---

# 1. Problem Statement

## 1.1 Background

Maharashtra State Electricity Distribution Company Limited (MSEDCL) is one of India's largest power distribution utilities, serving over 2.8 crore consumers across Maharashtra. MSEDCL operates thousands of distribution substations ranging from 33/11 kV to 132/33 kV voltage levels.

The modernization of these substations requires a robust, reliable, and intelligent Supervisory Control and Data Acquisition (SCADA) system that can:

- **Monitor** real-time electrical parameters across distribution substations
- **Control** switchgear (circuit breakers, isolators) remotely with safety interlocks
- **Alert** operators to abnormal conditions with prioritized alarm management
- **Record** all events and measurements for historical analysis and regulatory compliance
- **Report** operational metrics (load profiles, energy accounting, equipment performance)

## 1.2 Problem Definition

Currently, many MSEDCL distribution substations rely on:
- Manual monitoring by field staff visiting substations
- Basic RTU-based systems with limited visualization
- Disconnected data silos with no centralized monitoring
- Paper-based event logging and reporting
- Limited remote control capabilities

This results in:
- **Delayed fault detection**: Outages persist longer due to late identification
- **Manual errors**: Human errors in recording and reporting data
- **Lack of visibility**: No real-time overview of grid health
- **Poor load management**: Inability to optimize load distribution across feeders
- **Compliance gaps**: Difficulty meeting MERC (Maharashtra Electricity Regulatory Commission) reporting requirements

## 1.3 Proposed Solution

**GridVision SCADA** is a modern, web-based and desktop-deployable SCADA application specifically designed for MSEDCL's smart distribution substations. It provides:

1. **Real-time Monitoring** via interactive Single Line Diagrams (SLD)
2. **Remote Control** of circuit breakers with Select-Before-Operate (SBO) safety pattern
3. **Intelligent Alarm Management** with priority-based notifications
4. **Data Historian** for long-term trend analysis
5. **Automated Reporting** for regulatory compliance and operational efficiency
6. **Multi-protocol Support** (IEC 61850, Modbus TCP, DNP3) for interoperability with existing IEDs/RTUs
7. **Dual Deployment** as a web application and Electron desktop application

## 1.4 Scope

### In Scope:
- 33/11 kV distribution substations
- 132/33 kV distribution substations
- Real-time monitoring and control
- Alarm management with SOE (Sequence of Events)
- Data historian and trend analysis
- Automated report generation
- User authentication with Role-Based Access Control (RBAC)
- Complete audit trail
- Protocol communication (IEC 61850, Modbus TCP, DNP3)
- Data simulator for development and testing

### Out of Scope (Future Phases):
- 220 kV and above transmission substations
- Integration with billing/CRM systems
- Mobile application
- AI/ML-based predictive analytics
- Geographic Information System (GIS) integration

## 1.5 Target Users

| Role | Description | Key Activities |
|------|-------------|----------------|
| **System Administrator** | IT personnel managing the SCADA system | User management, system configuration, backups |
| **Protection Engineer** | Substation engineers | Configure alarms, edit SLD layouts, analyze events |
| **Control Room Operator** | Operators in the SLDC/DLCC | Monitor SLD, operate CBs, acknowledge alarms |
| **Management/Viewer** | Circle/Division officers | View dashboards, generate reports |

## 1.6 MSEDCL-Specific Requirements

| Parameter | 33/11 kV Substation | 132/33 kV Substation |
|-----------|---------------------|----------------------|
| HV Side Voltage | 33 kV | 132 kV |
| LV Side Voltage | 11 kV | 33 kV |
| Power Transformers | 1-2 (5/8/10 MVA) | 2-3 (20/40 MVA) |
| Outgoing Feeders | 6-12 (11 kV) | 4-8 (33 kV) |
| Bus Configuration | Single bus with bus section | Single/Double bus |
| CB Type | Vacuum (11 kV), SF6 (33 kV) | SF6 |
| Protection Schemes | O/C, E/F, REF | Distance, O/C, E/F, Differential |
| System Frequency | 50 Hz | 50 Hz |
| Standards | IS/IEC 62271, IEC 61850 | IS/IEC 62271, IEC 61850 |

---

# 2. System Architecture

## 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FIELD LEVEL                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │  IED/RTU  │  │  IED/RTU  │  │  IED/RTU  │  │  IED/RTU  │          │
│  │ (Feeder)  │  │(Transformer)│ │(Bus Section)│ │ (Incomer) │          │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘          │
│        │               │               │               │               │
│  ══════╧═══════════════╧═══════════════╧═══════════════╧════════     │
│                    Ethernet / Fiber LAN                              │
│  ═══════════════════════════╤══════════════════════════════════     │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────┐
│                     COMMUNICATION LEVEL                              │
│                    ┌─────────┴─────────┐                            │
│                    │  Protocol Gateway  │                            │
│                    │  IEC 61850/Modbus  │                            │
│                    │      /DNP3        │                            │
│                    └─────────┬─────────┘                            │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────┐
│                     APPLICATION LEVEL                                │
│  ┌───────────────────────────┴───────────────────────────────┐     │
│  │              GridVision SCADA Server (Node.js)             │     │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │     │
│  │  │ Protocol  │ │  Alarm   │ │  Data    │ │ Control  │    │     │
│  │  │ Adapters  │ │  Engine  │ │ Historian│ │ Service  │    │     │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │     │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │     │
│  │  │ WebSocket │ │  REST    │ │  Report  │ │  Auth    │    │     │
│  │  │  Server   │ │   API    │ │  Engine  │ │ + RBAC   │    │     │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │     │
│  └───────────────────────────────────────────────────────────┘     │
│           │                    │                                     │
│  ┌────────┴─────┐    ┌────────┴─────┐                              │
│  │  PostgreSQL   │    │    Redis     │                              │
│  │ + TimescaleDB │    │  (Pub/Sub)   │                              │
│  └──────────────┘    └──────────────┘                              │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                        WebSocket + HTTPS
                               │
┌──────────────────────────────┼──────────────────────────────────────┐
│                     PRESENTATION LEVEL                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │  Web Browser  │    │   Electron   │    │   Electron   │          │
│  │  (Chrome/Edge)│    │  (Control    │    │  (Engineer   │          │
│  │               │    │   Room PC)   │    │   Laptop)    │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
└─────────────────────────────────────────────────────────────────────┘
```

## 2.2 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | UI framework |
| **Build Tool** | Vite | Fast development and production builds |
| **State Management** | Zustand | Lightweight real-time state management |
| **Charts** | Recharts | Trend charts and dashboards |
| **SLD Rendering** | SVG + React Components | Interactive Single Line Diagrams |
| **Backend** | Node.js + TypeScript + Express | API server and real-time engine |
| **Real-time** | Socket.IO | WebSocket-based bidirectional communication |
| **ORM** | Prisma | Database access and migrations |
| **Database** | PostgreSQL 16 | Relational data (config, users, alarms) |
| **Time-Series** | TimescaleDB | High-performance measurement storage |
| **Cache/PubSub** | Redis 7 | Caching and inter-process messaging |
| **Protocol: Modbus** | jsmodbus | Modbus TCP communication |
| **Protocol: DNP3** | node-dnp3 / OpenDNP3 | DNP3 protocol communication |
| **Protocol: IEC 61850** | libiec61850 (FFI) | IEC 61850 MMS/GOOSE communication |
| **Desktop** | Electron 28+ | Desktop application wrapper |
| **Authentication** | JWT + bcrypt | Secure token-based auth |
| **PDF Reports** | @react-pdf/renderer | Automated report generation |
| **Monorepo** | pnpm + Turborepo | Workspace management and build orchestration |
| **Containerization** | Docker Compose | Development and production deployment |
| **Testing** | Jest, Vitest, Playwright | Unit, component, and E2E testing |

## 2.3 Data Flow Architecture

```
IED/RTU (Field)
    │
    ▼
Protocol Adapter (Modbus/DNP3/IEC61850)
    │
    ├──▶ Measurement → TimescaleDB (historian)
    │
    ├──▶ Alarm Engine → Evaluate thresholds
    │         │
    │         ├──▶ alarm_log table (persist)
    │         └──▶ Redis Pub/Sub → WebSocket → Client UI
    │
    ├──▶ Redis Pub/Sub → WebSocket → Client UI (real-time display)
    │
    └──▶ SOE Event → soe_events table
```

---

# 3. Project Structure (Monorepo)

```
gridvision-scada/
├── package.json                          # Root workspace configuration
├── pnpm-workspace.yaml                   # Workspace definitions
├── turbo.json                            # Turborepo build pipeline
├── tsconfig.base.json                    # Shared TypeScript configuration
├── .eslintrc.js                          # Root ESLint configuration
├── .prettierrc                           # Code formatting rules
├── .env.example                          # Environment variables template
├── docker-compose.yml                    # Dev environment (PostgreSQL, TimescaleDB, Redis)
├── docker-compose.prod.yml               # Production deployment
│
├── apps/
│   ├── web/                              # React Web Application (Vite)
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── index.html
│   │   └── src/
│   │       ├── main.tsx                  # Application entry point
│   │       ├── App.tsx                   # Root component with router
│   │       ├── routes/
│   │       │   ├── index.tsx             # Route definitions
│   │       │   └── ProtectedRoute.tsx    # Authentication guard
│   │       ├── pages/
│   │       │   ├── Dashboard.tsx         # System overview dashboard
│   │       │   ├── SLDView.tsx           # Single Line Diagram page
│   │       │   ├── Alarms.tsx            # Alarm management page
│   │       │   ├── Trends.tsx            # Historical trend viewer
│   │       │   ├── Events.tsx            # Event log / SOE viewer
│   │       │   ├── Reports.tsx           # Report generation page
│   │       │   ├── Settings.tsx          # System settings
│   │       │   └── Login.tsx             # Authentication page
│   │       ├── components/
│   │       │   ├── sld/                  # Single Line Diagram components
│   │       │   │   ├── SLDCanvas.tsx     # Main SLD rendering surface
│   │       │   │   ├── SLDViewport.tsx   # Pan/zoom container
│   │       │   │   ├── equipment/        # SVG equipment symbols
│   │       │   │   │   ├── BusBar.tsx
│   │       │   │   │   ├── PowerTransformer.tsx
│   │       │   │   │   ├── CircuitBreaker.tsx
│   │       │   │   │   ├── Isolator.tsx
│   │       │   │   │   ├── CurrentTransformer.tsx
│   │       │   │   │   ├── PotentialTransformer.tsx
│   │       │   │   │   ├── FeederLine.tsx
│   │       │   │   │   ├── EarthSwitch.tsx
│   │       │   │   │   ├── LightningArrester.tsx
│   │       │   │   │   └── CapacitorBank.tsx
│   │       │   │   ├── overlays/         # Data overlays on SLD
│   │       │   │   │   ├── MeasurementLabel.tsx
│   │       │   │   │   ├── PowerFlowArrow.tsx
│   │       │   │   │   └── AlarmBadge.tsx
│   │       │   │   └── layouts/          # Pre-built SLD layouts
│   │       │   │       ├── Layout33_11kV.tsx
│   │       │   │       └── Layout132_33kV.tsx
│   │       │   ├── dashboard/            # Dashboard widgets
│   │       │   │   ├── ParameterCard.tsx
│   │       │   │   ├── LoadDistribution.tsx
│   │       │   │   ├── PowerFactorGauge.tsx
│   │       │   │   └── SubstationOverview.tsx
│   │       │   ├── alarms/               # Alarm components
│   │       │   │   ├── AlarmPanel.tsx
│   │       │   │   ├── AlarmBanner.tsx
│   │       │   │   └── AlarmHistory.tsx
│   │       │   ├── controls/             # Control operation dialogs
│   │       │   │   ├── ControlDialog.tsx  # Select-Before-Operate UI
│   │       │   │   └── CommandConfirm.tsx
│   │       │   ├── trends/               # Trend analysis components
│   │       │   │   ├── TrendViewer.tsx
│   │       │   │   └── TrendSelector.tsx
│   │       │   └── common/               # Shared UI components
│   │       │       ├── Header.tsx
│   │       │       ├── Sidebar.tsx
│   │       │       └── AlarmStatusBar.tsx
│   │       ├── stores/                   # Zustand state stores
│   │       │   ├── realtimeStore.ts      # Live SCADA measurements
│   │       │   ├── alarmStore.ts         # Active alarm state
│   │       │   ├── authStore.ts          # Authentication state
│   │       │   └── sldStore.ts           # SLD configuration state
│   │       ├── hooks/                    # Custom React hooks
│   │       │   ├── useWebSocket.ts       # WebSocket connection manager
│   │       │   ├── useRealTimeData.ts    # Real-time data subscription
│   │       │   └── useControl.ts         # Control operation hook
│   │       ├── services/                 # API client services
│   │       │   ├── api.ts                # REST API client
│   │       │   ├── websocket.ts          # Socket.IO client
│   │       │   └── auth.ts              # Auth service
│   │       └── types/                    # Frontend-specific types
│   │           ├── scada.ts
│   │           ├── equipment.ts
│   │           └── alarm.ts
│   │
│   ├── server/                           # Node.js Backend Application
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts                  # Server entry point
│   │       ├── app.ts                    # Express app configuration
│   │       ├── config/
│   │       │   ├── database.ts           # Database connection config
│   │       │   └── environment.ts        # Environment variable loader
│   │       ├── routes/                   # API route definitions
│   │       │   ├── auth.routes.ts
│   │       │   ├── substation.routes.ts
│   │       │   ├── alarm.routes.ts
│   │       │   ├── trend.routes.ts
│   │       │   ├── report.routes.ts
│   │       │   └── control.routes.ts
│   │       ├── controllers/              # Request handlers
│   │       │   ├── auth.controller.ts
│   │       │   ├── substation.controller.ts
│   │       │   ├── alarm.controller.ts
│   │       │   ├── trend.controller.ts
│   │       │   ├── report.controller.ts
│   │       │   └── control.controller.ts
│   │       ├── services/                 # Business logic services
│   │       │   ├── alarm.service.ts      # Alarm evaluation engine
│   │       │   ├── historian.service.ts  # Data historian service
│   │       │   ├── realtime.service.ts   # WebSocket data publisher
│   │       │   ├── control.service.ts    # SBO command handling
│   │       │   ├── report.service.ts     # Report generation
│   │       │   └── auth.service.ts       # Authentication logic
│   │       ├── protocol/                 # Protocol communication adapters
│   │       │   ├── ProtocolAdapter.ts    # Abstract adapter interface
│   │       │   ├── ModbusAdapter.ts      # Modbus TCP implementation
│   │       │   ├── DNP3Adapter.ts        # DNP3 implementation
│   │       │   ├── IEC61850Adapter.ts    # IEC 61850 implementation
│   │       │   └── SimulatorAdapter.ts   # Mock data simulator
│   │       ├── middleware/               # Express middleware
│   │       │   ├── auth.middleware.ts    # JWT verification
│   │       │   ├── rbac.middleware.ts    # Role-based access control
│   │       │   └── audit.middleware.ts   # Audit trail logging
│   │       └── websocket/               # WebSocket handlers
│   │           ├── socketManager.ts      # Socket.IO server manager
│   │           └── handlers.ts           # Event handlers
│   │
│   └── electron/                         # Electron Desktop Application
│       ├── package.json
│       ├── electron-builder.yml          # Build configuration
│       └── src/
│           ├── main.ts                   # Electron main process
│           ├── preload.ts                # Preload script for IPC
│           └── ipc/
│               └── handlers.ts           # IPC message handlers
│
├── packages/
│   └── shared/                           # Shared Types and Utilities
│       ├── package.json
│       └── src/
│           ├── types/                    # Shared TypeScript types
│           │   ├── substation.ts
│           │   ├── equipment.ts
│           │   ├── measurement.ts
│           │   ├── alarm.ts
│           │   └── control.ts
│           ├── constants/                # Shared constants
│           │   ├── voltage-levels.ts
│           │   ├── alarm-priorities.ts
│           │   └── equipment-types.ts
│           └── utils/                    # Shared utilities
│               ├── tag-naming.ts         # SCADA tag naming convention
│               └── validators.ts
│
├── prisma/
│   ├── schema.prisma                     # Database schema definition
│   ├── migrations/                       # Database migrations
│   └── seed.ts                           # Demo data seeder
│
└── simulator/                            # Data Simulator for Development
    ├── package.json
    └── src/
        ├── index.ts                      # Simulator entry point
        ├── substation-33-11.ts           # 33/11 kV substation simulator
        └── substation-132-33.ts          # 132/33 kV substation simulator
```

---

# 4. Database Design

## 4.1 Tag Naming Convention

All SCADA data points follow the convention: `{SS_CODE}_{VOLTAGE}_{BAY}_{EQUIP}_{PARAM}`

| Segment | Description | Examples |
|---------|-------------|----------|
| SS_CODE | Substation code | WALUJ, CIDCO, PARBHANI |
| VOLTAGE | Voltage level | 132KV, 33KV, 11KV |
| BAY | Bay identifier | INC1, TR1, FDR01, BSC |
| EQUIP | Equipment type | CB, ISO, TR, CT, PT |
| PARAM | Parameter | V_RY, I_R, P_3PH, CB_STATUS, TAP_POS |

**Examples:**
- `WALUJ_33KV_INC1_CB_STATUS` - Waluj 33kV Incomer 1 CB status
- `WALUJ_11KV_FDR03_I_R` - Waluj 11kV Feeder 3 R-phase current
- `CIDCO_132KV_TR1_V_HV` - CIDCO 132kV Transformer 1 HV side voltage
- `PARBHANI_11KV_FDR07_P_3PH` - Parbhani 11kV Feeder 7 three-phase power

## 4.2 Entity-Relationship Overview

```
Substation (1) ──── (N) VoltageLevel (1) ──── (N) Bay (1) ──── (N) Equipment
                                                                      │
                                                                (1)───┤───(1)
                                                                      │
                                                              DataPoint (N)
                                                                      │
                                                          ┌───────────┼───────────┐
                                                          │           │           │
                                                    Measurement  DigitalState  AlarmDef
                                                    (TimescaleDB) (TimescaleDB)    │
                                                                              AlarmLog
```

## 4.3 Core Tables

### Configuration Tables (PostgreSQL)

```sql
-- Substations
CREATE TABLE substations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    code            VARCHAR(20) NOT NULL UNIQUE,
    type            VARCHAR(20) NOT NULL CHECK (type IN ('33/11kV', '132/33kV')),
    location        VARCHAR(200),
    latitude        DECIMAL(10, 7),
    longitude       DECIMAL(10, 7),
    commissioned_at DATE,
    status          VARCHAR(20) DEFAULT 'ACTIVE',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Voltage Levels
CREATE TABLE voltage_levels (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    substation_id   UUID NOT NULL REFERENCES substations(id),
    nominal_kv      DECIMAL(6, 1) NOT NULL,
    level_type      VARCHAR(10) NOT NULL CHECK (level_type IN ('HV', 'LV', 'TV')),
    bus_config      VARCHAR(30) DEFAULT 'SINGLE_BUS'
);

-- Bays
CREATE TABLE bays (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voltage_level_id UUID NOT NULL REFERENCES voltage_levels(id),
    name            VARCHAR(50) NOT NULL,
    bay_type        VARCHAR(20) NOT NULL CHECK (bay_type IN (
                        'INCOMER', 'FEEDER', 'TRANSFORMER', 'BUS_COUPLER',
                        'BUS_SECTION', 'CAPACITOR', 'LINE'
                    )),
    bay_number      INTEGER,
    status          VARCHAR(20) DEFAULT 'ACTIVE'
);

-- Equipment
CREATE TABLE equipment (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bay_id          UUID NOT NULL REFERENCES bays(id),
    type            VARCHAR(30) NOT NULL,
    tag             VARCHAR(80) NOT NULL UNIQUE,
    name            VARCHAR(100) NOT NULL,
    rated_voltage   DECIMAL(8, 2),
    rated_current   DECIMAL(8, 2),
    rated_mva       DECIMAL(8, 2),
    sld_x           INTEGER DEFAULT 0,
    sld_y           INTEGER DEFAULT 0,
    sld_rotation    INTEGER DEFAULT 0,
    metadata        JSONB DEFAULT '{}'
);

-- Data Points (SCADA Tags)
CREATE TABLE data_points (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id    UUID NOT NULL REFERENCES equipment(id),
    tag             VARCHAR(100) NOT NULL UNIQUE,
    name            VARCHAR(150) NOT NULL,
    param_type      VARCHAR(10) NOT NULL CHECK (param_type IN ('ANALOG', 'DIGITAL', 'COUNTER')),
    unit            VARCHAR(20),
    min_value       DECIMAL(12, 4),
    max_value       DECIMAL(12, 4),
    deadband        DECIMAL(8, 4) DEFAULT 0,
    ied_connection_id UUID REFERENCES ied_connections(id),
    register_address INTEGER,
    register_type   VARCHAR(20),
    scale_factor    DECIMAL(10, 6) DEFAULT 1.0,
    offset_value    DECIMAL(10, 4) DEFAULT 0
);

-- IED/RTU Connections
CREATE TABLE ied_connections (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    substation_id   UUID NOT NULL REFERENCES substations(id),
    name            VARCHAR(100) NOT NULL,
    protocol        VARCHAR(20) NOT NULL CHECK (protocol IN ('MODBUS_TCP', 'DNP3', 'IEC61850')),
    ip_address      INET NOT NULL,
    port            INTEGER NOT NULL,
    slave_id        INTEGER,
    polling_interval_ms INTEGER DEFAULT 1000,
    timeout_ms      INTEGER DEFAULT 5000,
    status          VARCHAR(20) DEFAULT 'ACTIVE'
);
```

### Time-Series Tables (TimescaleDB)

```sql
-- Analog Measurements
CREATE TABLE measurements (
    time            TIMESTAMPTZ NOT NULL,
    data_point_id   UUID NOT NULL,
    value           DOUBLE PRECISION NOT NULL,
    quality         SMALLINT DEFAULT 0
);
SELECT create_hypertable('measurements', 'time');
CREATE INDEX idx_measurements_dp ON measurements (data_point_id, time DESC);

-- Digital States
CREATE TABLE digital_states (
    time            TIMESTAMPTZ NOT NULL,
    data_point_id   UUID NOT NULL,
    state           BOOLEAN NOT NULL,
    quality         SMALLINT DEFAULT 0
);
SELECT create_hypertable('digital_states', 'time');

-- Sequence of Events
CREATE TABLE soe_events (
    time            TIMESTAMPTZ NOT NULL,
    data_point_id   UUID NOT NULL,
    old_state       VARCHAR(30),
    new_state       VARCHAR(30),
    cause           VARCHAR(50)
);
SELECT create_hypertable('soe_events', 'time');

-- Continuous Aggregates for faster queries
CREATE MATERIALIZED VIEW measurements_1min
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 minute', time) AS bucket,
    data_point_id,
    AVG(value) AS avg_value,
    MIN(value) AS min_value,
    MAX(value) AS max_value
FROM measurements
GROUP BY bucket, data_point_id;

-- Retention & Compression Policies
SELECT add_retention_policy('measurements', INTERVAL '30 days');
SELECT add_retention_policy('measurements_1min', INTERVAL '1 year');
SELECT add_compression_policy('measurements', INTERVAL '7 days');
```

### User Management Tables

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(50) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    email           VARCHAR(100),
    role            VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'ENGINEER', 'OPERATOR', 'VIEWER')),
    is_active       BOOLEAN DEFAULT TRUE,
    last_login      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    token_hash      VARCHAR(255) NOT NULL,
    ip_address      INET,
    user_agent      TEXT,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Alarm Tables

```sql
CREATE TABLE alarm_definitions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_point_id   UUID NOT NULL REFERENCES data_points(id),
    alarm_type      VARCHAR(20) NOT NULL CHECK (alarm_type IN (
                        'HIGH_HIGH', 'HIGH', 'LOW', 'LOW_LOW',
                        'STATE_CHANGE', 'RATE_OF_CHANGE', 'COMMUNICATION_FAIL'
                    )),
    threshold       DECIMAL(12, 4),
    priority        SMALLINT NOT NULL CHECK (priority BETWEEN 1 AND 4),
    message_template VARCHAR(200) NOT NULL,
    deadband        DECIMAL(8, 4) DEFAULT 0,
    delay_ms        INTEGER DEFAULT 0,
    is_enabled      BOOLEAN DEFAULT TRUE
);

CREATE TABLE alarm_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alarm_def_id    UUID NOT NULL REFERENCES alarm_definitions(id),
    raised_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cleared_at      TIMESTAMPTZ,
    acked_at        TIMESTAMPTZ,
    acked_by        UUID REFERENCES users(id),
    shelved_until   TIMESTAMPTZ,
    value_at_raise  DOUBLE PRECISION,
    priority        SMALLINT NOT NULL,
    message         VARCHAR(300) NOT NULL
);
```

### Operational Tables

```sql
CREATE TABLE control_commands (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id    UUID NOT NULL REFERENCES equipment(id),
    user_id         UUID NOT NULL REFERENCES users(id),
    command_type    VARCHAR(20) NOT NULL CHECK (command_type IN ('OPEN', 'CLOSE', 'RAISE', 'LOWER')),
    sbo_state       VARCHAR(20) NOT NULL CHECK (sbo_state IN (
                        'SELECT_SENT', 'SELECT_CONFIRMED', 'EXECUTE_SENT',
                        'EXECUTE_SUCCESS', 'EXECUTE_FAILED', 'CANCELLED', 'TIMEOUT'
                    )),
    initiated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    result_message  TEXT
);

CREATE TABLE audit_trail (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    action          VARCHAR(50) NOT NULL,
    target_type     VARCHAR(50),
    target_id       UUID,
    details         JSONB DEFAULT '{}',
    ip_address      INET,
    timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

# 5. Feature Specifications

## 5.1 Single Line Diagram (SLD)

### Overview
The SLD is the primary visualization interface, rendering the substation's electrical topology as an interactive SVG diagram with real-time data overlays.

### Equipment Symbols (SVG Components)
Each equipment type is a React SVG component with standardized dimensions and connection points:

| Equipment | Symbol | States | Color Coding |
|-----------|--------|--------|-------------|
| Bus Bar | Horizontal thick line | Energized / De-energized | By voltage level |
| Circuit Breaker | Square with X (closed) or gap (open) | Open, Closed, Tripped, Transitioning | Green/Red/Flashing Red/Yellow |
| Isolator | Two angled lines (open/closed) | Open, Closed | Green/Red |
| Power Transformer | Two interlocking circles | Energized, De-energized, On Load | By voltage level |
| Current Transformer | Small circle on conductor | Normal | By voltage level |
| Potential Transformer | Two small circles | Normal | By voltage level |
| Feeder Line | Line with arrow | Energized, De-energized | By voltage level |
| Earth Switch | Line to ground symbol | Open, Closed | Green/Red |
| Lightning Arrester | Zigzag symbol | Normal | By voltage level |
| Capacitor Bank | Parallel lines symbol | Connected, Disconnected | Green/Grey |

### Color Coding by Voltage Level
| Voltage | Color | Hex Code |
|---------|-------|----------|
| 132 kV | Blue | #1E40AF |
| 33 kV | Red | #DC2626 |
| 11 kV | Green | #16A34A |
| De-energized | Grey | #6B7280 |

### SLD Interactions
- **Pan**: Click + drag on canvas
- **Zoom**: Mouse scroll wheel
- **Click Equipment**: Opens detail popup (measurements, status, control buttons)
- **Right-click**: Context menu (trend, alarms, properties)
- **Double-click CB**: Opens control dialog (for Operator/Admin roles)

### Real-time Overlays
- Measurement labels near equipment (V, I, P values)
- Power flow arrows (direction based on real power sign)
- Alarm badges (colored dots) on alarming equipment
- Communication status indicator per IED

### Pre-built Layouts

**33/11 kV Substation:**
```
     33kV Incoming Line
           │
         [CB] ← Incomer CB
           │
  ═══33kV Bus Section 1═══ ─── [BSC CB] ─── ═══33kV Bus Section 2═══
           │                                          │
         [CB]                                       [CB]
           │                                          │
      ┌────┴────┐                              ┌────┴────┐
      │  TR-1   │                              │  TR-2   │
      │ 33/11kV │                              │ 33/11kV │
      │  8 MVA  │                              │  8 MVA  │
      └────┬────┘                              └────┬────┘
           │                                          │
         [CB]                                       [CB]
           │                                          │
  ═══11kV Bus Section 1═══ ─── [BC CB] ─── ═══11kV Bus Section 2═══
    │    │    │    │    │                      │    │    │    │    │
  [CB] [CB] [CB] [CB] [CB]                 [CB] [CB] [CB] [CB] [CB]
    │    │    │    │    │                      │    │    │    │    │
   F1   F2   F3   F4   F5                    F6   F7   F8   F9   F10
```

**132/33 kV Substation:**
```
  132kV Line 1                              132kV Line 2
       │                                         │
     [CB]                                      [CB]
       │                                         │
  ═══════════════ 132kV Bus ══════════════════════
                    │
                  [CB] ← TR HV CB
                    │
              ┌─────┴─────┐
              │   TR-1     │
              │ 132/33 kV  │
              │  40 MVA    │
              └─────┬─────┘
                    │
                  [CB] ← TR LV CB
                    │
  ═══33kV Bus Sec 1═══ ─── [BSC CB] ─── ═══33kV Bus Sec 2═══
    │     │     │     │                    │     │     │     │
  [CB]  [CB]  [CB]  [CB]                [CB]  [CB]  [CB]  [CB]
    │     │     │     │                    │     │     │     │
   F1    F2    F3    F4                   F5    F6    F7    F8
```

## 5.2 Real-time Monitoring Dashboard

### Overview Cards
- **Substation Status**: Name, type, overall health indicator
- **Total Load**: Sum of all feeder loads (MW/MVAR/MVA)
- **Voltage Profile**: Bar chart showing all bus voltages vs nominal
- **Alarm Summary**: Count by priority (Emergency: red, Urgent: orange, Normal: yellow)

### Parameter Display
For each transformer and feeder:
| Parameter | Unit | Display |
|-----------|------|---------|
| Voltage (R-Y, Y-B, B-R) | kV | Digital readout |
| Current (R, Y, B) | A | Digital readout + bar |
| Active Power (3-phase) | MW | Digital readout |
| Reactive Power (3-phase) | MVAR | Digital readout |
| Apparent Power | MVA | Digital readout |
| Power Factor | - | Gauge (0-1) |
| Frequency | Hz | Digital readout |
| Transformer Temp | °C | Digital readout + trend |
| Tap Position | - | Numeric indicator |

### Load Distribution
- Horizontal bar chart: each feeder's current load as percentage of rated
- Color thresholds: Green (<60%), Yellow (60-80%), Orange (80-100%), Red (>100%)

## 5.3 Control Operations (Select-Before-Operate)

### SBO Flow
```
Operator clicks CB         System validates          Operator confirms
on SLD                     permissions               execution
    │                          │                          │
    ▼                          ▼                          ▼
┌──────────┐            ┌──────────┐            ┌──────────────────┐
│  SELECT   │───────────▶│ VALIDATE │───────────▶│    EXECUTE       │
│  (Click)  │            │  - Role  │            │  - Send command  │
│           │            │  - Lock  │            │  - Wait response │
│           │            │  - Inter │            │  - Log result    │
└──────────┘            └──────────┘            └──────────────────┘
                                                        │
                                                        ▼
                                                ┌──────────────────┐
                                                │    RESULT        │
                                                │  - Success/Fail  │
                                                │  - Audit log     │
                                                │  - SLD update    │
                                                └──────────────────┘
```

### Interlocking Rules
- Cannot open isolator when CB is closed
- Cannot close CB if earth switch is closed
- Cannot close bus coupler if bus voltage difference > threshold
- Configurable per substation via database

### Control Dialog UI
```
┌─────────────────────────────────────────┐
│         CONTROL OPERATION               │
├─────────────────────────────────────────┤
│                                         │
│  Equipment: WALUJ_11KV_FDR03_CB        │
│  Current State: CLOSED                  │
│  Proposed Action: OPEN (Trip)           │
│                                         │
│  Operator: Rajesh Kumar (Operator)      │
│  Timestamp: 2026-02-28 14:30:45 IST    │
│                                         │
│  ⚠ This will disconnect Feeder 3       │
│    from 11kV Bus Section 1             │
│                                         │
│  ┌──────────┐       ┌──────────┐       │
│  │  SELECT   │       │  CANCEL  │       │
│  └──────────┘       └──────────┘       │
│                                         │
│  [After SELECT confirmed:]              │
│  ┌──────────┐       ┌──────────┐       │
│  │ EXECUTE   │       │  CANCEL  │       │
│  │ (30s timeout)     └──────────┘       │
│  └──────────┘                           │
└─────────────────────────────────────────┘
```

## 5.4 Alarm Management

### Alarm Priorities
| Priority | Level | Color | Sound | Example |
|----------|-------|-------|-------|---------|
| 1 | Emergency | Red | Continuous | CB Trip, Protection Operated |
| 2 | Urgent | Orange | Intermittent | Over-voltage, Over-current |
| 3 | Normal | Yellow | Single beep | Tap change, Minor threshold |
| 4 | Info | Blue | None | Communication restored, Login |

### Alarm Lifecycle
```
NORMAL ──▶ RAISED ──▶ ACKNOWLEDGED ──▶ CLEARED
              │              │
              └──────────────┘ (can be cleared before ack)

RAISED ──▶ SHELVED (temporary suppression with timer)
```

### Alarm Types
- **High-High**: Critical high threshold (e.g., voltage > 36 kV on 33 kV bus)
- **High**: Warning high threshold (e.g., voltage > 34.5 kV)
- **Low**: Warning low threshold (e.g., voltage < 31.5 kV)
- **Low-Low**: Critical low threshold (e.g., voltage < 30 kV)
- **State Change**: Equipment state changed (e.g., CB tripped)
- **Rate of Change**: Value changed too rapidly
- **Communication Failure**: IED/RTU communication lost

## 5.5 Data Historian & Trends

### Data Retention Policy
| Level | Resolution | Retention |
|-------|-----------|-----------|
| Raw | 1-2 seconds | 30 days |
| 1-minute average | 1 minute | 1 year |
| 5-minute average | 5 minutes | 2 years |
| 1-hour average | 1 hour | 5 years |

### Trend Viewer Features
- Select up to 8 data points on same chart
- Time range: 1h, 6h, 24h, 7d, 30d, custom
- Auto-resolution selection based on time range
- Zoom into specific time periods
- Export data to CSV
- Cursor readout (crosshair with values)

## 5.6 Reports

### Report Types
| Report | Frequency | Content |
|--------|-----------|---------|
| Daily Load Report | Daily 00:00 | Max/Min/Avg load per feeder, peak time, energy (kWh) |
| Monthly Summary | Monthly 1st | Total energy, max demand, load factor, availability |
| Alarm Summary | Weekly/Monthly | Alarm counts by priority/type, MTTR, top alarming points |
| Tripping Report | On-demand | CB trip events with timestamps, cause, affected feeders |
| Voltage Profile | Daily | Min/Max/Avg voltage per bus, voltage regulation % |

### Report Output
- View in browser
- Export as PDF
- Schedule for automatic generation and email delivery

## 5.7 Authentication & RBAC

### Roles and Permissions
| Permission | Admin | Engineer | Operator | Viewer |
|-----------|-------|----------|----------|--------|
| View SLD & Dashboard | Yes | Yes | Yes | Yes |
| View Trends | Yes | Yes | Yes | Yes |
| View Alarms | Yes | Yes | Yes | Yes |
| Acknowledge Alarms | Yes | Yes | Yes | No |
| Control Operations | Yes | No | Yes | No |
| Edit Alarm Config | Yes | Yes | No | No |
| Edit SLD Layout | Yes | Yes | No | No |
| Manage Users | Yes | No | No | No |
| View Audit Trail | Yes | Yes | No | No |
| Generate Reports | Yes | Yes | Yes | Yes |
| System Settings | Yes | No | No | No |

---

# 6. Communication Protocols

## 6.1 Protocol Adapter Architecture

```typescript
interface ProtocolAdapter {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    readAnalog(address: number, count: number): Promise<number[]>;
    readDigital(address: number, count: number): Promise<boolean[]>;
    writeDigital(address: number, value: boolean): Promise<boolean>;
    onStatusChange(callback: (connected: boolean) => void): void;
    getStatus(): ConnectionStatus;
}
```

## 6.2 Supported Protocols

| Protocol | Library | Use Case | Typical Devices |
|----------|---------|----------|-----------------|
| Modbus TCP | jsmodbus | Meters, basic RTUs | Schneider PM series, ABB REF, L&T meters |
| DNP3 | node-dnp3 | RTUs, older IEDs | GE D20, ABB RTU500 |
| IEC 61850 | libiec61850 (FFI) | Modern IEDs, bay controllers | ABB REL, Siemens 7SJ, Schneider MiCOM |

## 6.3 Data Polling Strategy
- **Analog values**: Poll every 1-2 seconds (configurable per IED)
- **Digital values**: Poll every 500ms OR event-driven (IEC 61850 GOOSE)
- **SOE**: Event-driven with timestamp from IED
- **Timeout**: 5 seconds per request (configurable)
- **Retry**: 3 attempts before marking communication failure

---

# 7. Implementation Phases & Timeline

## Phase 1: Foundation
- Initialize monorepo (pnpm + Turborepo)
- Shared types package
- Docker Compose (PostgreSQL + TimescaleDB + Redis)
- Prisma schema + migrations + seed data
- Backend foundation (Express, JWT auth, RBAC, audit middleware)
- REST API routes (auth, substations, equipment, data points)

## Phase 2: Real-time Engine
- Protocol adapter interface + Simulator adapter
- Data simulator (33/11 kV and 132/33 kV models)
- WebSocket server (Socket.IO) + real-time data publishing
- Alarm engine (threshold evaluation, alarm lifecycle)
- Redis Pub/Sub integration

## Phase 3: Frontend - SLD & Dashboard
- React app setup (Vite, routing, Zustand stores)
- Login page + auth flow
- App shell (header, sidebar, alarm status bar)
- SVG equipment components (all 10 types)
- SLD canvas with pan/zoom
- Pre-built SLD layouts (33/11 kV and 132/33 kV)
- Real-time data overlay on SLD
- Dashboard with parameter cards, gauges, charts

## Phase 4: Advanced Features
- Alarm management page (active, history, acknowledge, shelve)
- Control dialog (Select-Before-Operate)
- Trend viewer with historical queries
- Event logger / SOE viewer
- Report generation (PDF export)
- Audit trail page

## Phase 5: Desktop & Deployment
- Electron wrapper (main process, preload, IPC)
- Electron builder configuration (.exe installer)
- Docker Compose production configuration
- Nginx reverse proxy + SSL
- Testing (Jest, Vitest, Playwright)
- Documentation

---

# 8. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Real-time latency | < 2 seconds from IED to screen |
| Concurrent users | 50+ simultaneous users |
| Data point capacity | 10,000+ tags per substation |
| Historical storage | 5 years (with aggregation) |
| Availability | 99.9% uptime |
| Browser support | Chrome 90+, Edge 90+, Firefox 90+ |
| Desktop OS | Windows 10/11 |
| Response time (UI) | < 500ms for page loads |
| Alarm processing | < 100ms from detection to display |
| Report generation | < 30 seconds for monthly report |

---

# 9. Security Considerations

- JWT tokens with short expiry (15 min access, 7 day refresh)
- bcrypt password hashing (salt rounds: 12)
- Rate limiting on auth endpoints (5 attempts/minute)
- HTTPS/TLS for all communication
- Input validation on all API endpoints
- SQL injection prevention via Prisma ORM
- XSS prevention via React's built-in escaping
- CORS configuration (whitelist allowed origins)
- Control operations require re-authentication for critical commands
- Audit trail is append-only (no deletion)
- Session management with force-logout capability

---

*Document Version: 1.0*
*Created: February 2026*
*For: MSEDCL Smart Distribution Substation SCADA*
