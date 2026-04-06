---
partial_id: docs
artifact: SVC
source: docs
phase: 5
status: done
---

# Documentation Facts: rdservice

## Zrodlo: docs/manpages/rdservice.xml

FAKT-D01: Purpose
  Zrodlo: docs/manpages/rdservice.xml:description
  Tresc: rdservice manages the various background service components of the Rivendell Radio Automation System
  Typ: use_case
  Zmapowany na: MainObject

FAKT-D02: Managed components list (docs)
  Zrodlo: docs/manpages/rdservice.xml:description
  Tresc: Manages caed, rdcatchd, ripcd, rdpadd, rdpadengined, rdvairplayd, rdimport (dropbox mode), rdmaint
  Typ: business_rule
  Zmapowany na: MainObject::Startup()

FAKT-D03: Boot-time invocation
  Zrodlo: docs/manpages/rdservice.xml:description
  Tresc: Normally invoked by the host's boot system (such as systemd) at system boot-time and runs continuously
  Typ: use_case
  Zmapowany na: main()

FAKT-D04: Singleton enforcement (docs)
  Zrodlo: docs/manpages/rdservice.xml:description
  Tresc: Only one instance should run at any time; additional instances terminate with exit code 1
  Typ: constraint
  Zmapowany na: MainObject::MainObject() (RDGetPids check)

FAKT-D05: Partial startup options
  Zrodlo: docs/manpages/rdservice.xml:options
  Tresc: --end-startup-after-{daemon} skips remainder of startup sequence after specified component
  Typ: configuration
  Zmapowany na: MainObject::StartupTarget enum, TargetCommandString()

FAKT-D06: Force maintenance option (DISCREPANCY)
  Zrodlo: docs/manpages/rdservice.xml:options
  Tresc: --force-service-maintenance forces initial maintenance run to include System maintenance
  Typ: configuration
  Zmapowany na: svc_force_system_maintenance flag
  UWAGA: Dokumentacja mowi "--force-service-maintenance", kod uzywa "--force-system-maintenance"

FAKT-D07: Initial maintenance interval option
  Zrodlo: docs/manpages/rdservice.xml:options
  Tresc: --initial-maintenance-interval=interval schedules initial maintenance run after interval ms
  Typ: configuration
  Zmapowany na: initial_maintenance_interval variable in MainObject()

FAKT-D08: Exit values documented
  Zrodlo: docs/manpages/rdservice.xml:exit_values
  Tresc: Exit codes: 0=normal, 1=prior instance, 2=unable to open DB, 3=unable to start component, 4=unknown CLI option
  Typ: constraint
  Zmapowany na: RDApplication exit codes
