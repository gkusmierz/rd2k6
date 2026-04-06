---
partial_id: code
artifact: SVC
source: code
phase: 5
status: done
---

# Code Facts: rdservice

## Guard clauses and validations

FAKT-C01: DB connection required at startup
  Zrodlo: rdservice.cpp:70-74
  Regula: If RDApplication::open() fails, exit with ExitNoDb (code 2)
  Pewnosc: potwierdzone

FAKT-C02: Singleton enforcement
  Zrodlo: rdservice.cpp:79-82
  Regula: If RDGetPids("rdservice").size() > 1, exit with ExitPriorInstance (code 1)
  Pewnosc: potwierdzone

FAKT-C03: Unknown CLI option rejection
  Zrodlo: rdservice.cpp:110-113
  Regula: Any unrecognized command-line option causes exit with ExitInvalidOption (code 4)
  Pewnosc: potwierdzone

FAKT-C04: Startup failure causes shutdown + exit
  Zrodlo: rdservice.cpp:126-131
  Regula: If Startup() returns false, Shutdown() is called and exit with ExitSvcFailed (code 3)
  Pewnosc: potwierdzone

FAKT-C05: Invalid maintenance interval causes exit(4)
  Zrodlo: rdservice.cpp:101-106
  Regula: --initial-maintenance-interval with non-integer value exits with code 4
  Pewnosc: potwierdzone

## Startup order and process management

FAKT-C06: Stale process cleanup before startup
  Zrodlo: startup.cpp:43-50
  Regula: Before starting any daemon, KillProgram() is called for each daemon in reverse order (rdrssd, rdrepld, rdvairplayd, rdpadengined, rdpadd, rdcatchd, ripcd, caed)
  Pewnosc: potwierdzone

FAKT-C07: Fixed startup order
  Zrodlo: startup.cpp:55-213
  Regula: Daemons started in exact order: caed(0) -> ripcd(1) -> rdcatchd(2) -> rdpadd(3) -> sleep(1) -> rdpadengined(4) -> rdvairplayd(5) -> rdrepld(6, conditional) -> rdrssd(7, conditional) -> dropboxes
  Pewnosc: potwierdzone

FAKT-C08: Band-aid 1-second delay
  Zrodlo: startup.cpp:120-125 (comment)
  Regula: 1 second sleep() between rdpadd and rdpadengined. Developer comment says socket activation is needed.
  Pewnosc: potwierdzone (explicit band-aid comment)

FAKT-C09: rdrepld conditional on REPLICATORS table
  Zrodlo: startup.cpp:164-178
  Regula: rdrepld started ONLY if SELECT NAME from REPLICATORS WHERE STATION_NAME=current returns at least 1 row
  Pewnosc: potwierdzone

FAKT-C10: rdrssd conditional on RSS_PROCESSOR_STATION
  Zrodlo: startup.cpp:187-206
  Regula: rdrssd started ONLY if SYSTEM.RSS_PROCESSOR_STATION matches current station name (case-insensitive comparison)
  Pewnosc: potwierdzone

FAKT-C11: Partial startup targets
  Zrodlo: startup.cpp:63-66 (and similar per daemon)
  Regula: If svc_startup_target matches current daemon, startup stops and returns true immediately
  Pewnosc: potwierdzone

FAKT-C12: Dropbox processes use rdimport with dynamic CLI args
  Zrodlo: startup.cpp:217-343
  Regula: Each DROPBOXES row for this station generates one rdimport process. 25+ columns are mapped to CLI arguments. Dropbox IDs start at 100 (RDSERVICE_FIRST_DROPBOX_ID).
  Pewnosc: potwierdzone

FAKT-C13: Normalization/autotrim levels divided by 100
  Zrodlo: startup.cpp:270-273
  Regula: DROPBOXES.NORMALIZATION_LEVEL and AUTOTRIM_LEVEL stored as int*100 in DB, divided by 100 for CLI arg
  Pewnosc: potwierdzone

FAKT-C14: Segue level only applied when < 1
  Zrodlo: startup.cpp:280-284
  Regula: --segue-level and --segue-length CLI args only added if SEGUE_LEVEL < 1
  Pewnosc: potwierdzone

## Shutdown

FAKT-C15: LIFO shutdown order
  Zrodlo: shutdown.cpp:30-39
  Regula: Daemons shut down in reverse order (LAST_ID-1 downto 0): SIGTERM first, wait for finish, SIGKILL if timeout
  Pewnosc: potwierdzone

FAKT-C16: Dropboxes killed with SIGKILL (no graceful)
  Zrodlo: shutdown.cpp:43-54
  Regula: Dropbox processes (id >= FIRST_DROPBOX_ID) are killed with process()->kill() (SIGKILL), not terminate() (SIGTERM)
  Pewnosc: potwierdzone

FAKT-C17: Dropboxes shut down before daemons
  Zrodlo: shutdown.cpp:23-25
  Regula: Shutdown() calls ShutdownDropboxes() first, then shuts down daemons
  Pewnosc: potwierdzone

## Signal handling

FAKT-C18: SIGTERM/SIGINT -> graceful shutdown
  Zrodlo: rdservice.cpp:42-46, 189-194
  Regula: SIGTERM or SIGINT sets global_exiting flag, exitData() polls it every 100ms, triggers Shutdown() + exit(0)
  Pewnosc: potwierdzone

FAKT-C19: SIGUSR1 -> dropbox hot-reload
  Zrodlo: rdservice.cpp:48-49, 196-201
  Regula: SIGUSR1 sets global_reload_dropboxes flag, exitData() shuts down all dropboxes then restarts them from DB config
  Pewnosc: potwierdzone

FAKT-C20: Signal handler re-installation
  Zrodlo: rdservice.cpp:199
  Regula: After processing SIGUSR1 reload, signal handler is re-installed with ::signal(SIGUSR1, SigHandler). This is because classic signal() resets to default after delivery on some platforms.
  Pewnosc: potwierdzone

## Maintenance

FAKT-C21: Random maintenance interval with jitter
  Zrodlo: maint_routines.cpp:108-113
  Regula: Interval = RD_MAINT_MIN_INTERVAL + random_fraction * (RD_MAINT_MAX_INTERVAL - RD_MAINT_MIN_INTERVAL). Min=900000ms (15min), Max=3600000ms (60min).
  Pewnosc: potwierdzone

FAKT-C22: Maintenance timer is single-shot
  Zrodlo: rdservice.cpp:138
  Regula: svc_maint_timer->setSingleShot(true) — timer does not auto-repeat, explicitly rescheduled in checkMaintData()
  Pewnosc: potwierdzone

FAKT-C23: Local maintenance always runs
  Zrodlo: maint_routines.cpp:51
  Regula: RunLocalMaintRoutine() is called unconditionally at every maintenance tick
  Pewnosc: potwierdzone

FAKT-C24: System maintenance requires station flag
  Zrodlo: maint_routines.cpp:56-58
  Regula: If !station->systemMaint(), system maintenance is skipped entirely
  Pewnosc: potwierdzone

FAKT-C25: System maintenance uses table lock for coordination
  Zrodlo: maint_routines.cpp:63-75
  Regula: LOCK TABLES VERSION WRITE before reading LAST_MAINT_DATETIME, UNLOCK after. This prevents multiple hosts from running system maintenance simultaneously.
  Pewnosc: potwierdzone

FAKT-C26: System maintenance trigger condition
  Zrodlo: maint_routines.cpp:69-70
  Regula: System maintenance runs if 1000 * secsTo(currentDateTime) > RD_MAINT_MAX_INTERVAL (i.e., more than 60 minutes since last run) OR svc_force_system_maintenance flag is set
  Pewnosc: potwierdzone

FAKT-C27: Maintenance disableable per host
  Zrodlo: rdservice.cpp:141, 151-153
  Regula: config->disableMaintChecks() prevents timer from starting at all
  Pewnosc: potwierdzone

FAKT-C28: Force system maintenance resets after use
  Zrodlo: maint_routines.cpp:82
  Regula: svc_force_system_maintenance is set to false after RunSystemMaintRoutine()
  Pewnosc: potwierdzone

## Process monitoring

FAKT-C29: Crash detection via exit status
  Zrodlo: rdservice.cpp:165-178
  Regula: processFinishedData() distinguishes between crash (exitStatus != NormalExit), non-zero exit code, and normal exit. Each is logged at appropriate syslog level.
  Pewnosc: potwierdzone

FAKT-C30: Ephemeral process cleanup
  Zrodlo: rdservice.cpp:180-181
  Regula: After process finishes, QProcess is deleteLater() and entry removed from svc_processes map
  Pewnosc: potwierdzone

## Constants

FAKT-C31: Process ID assignments
  Zrodlo: rdservice.h:30-41
  Regula: Fixed IDs: caed=0, ripcd=1, rdcatchd=2, rdpadd=3, rdpadengined=4, rdvairplayd=5, rdrepld=6, rdrssd=7, localmaint=8, systemmaint=9, LAST_ID=10, FIRST_DROPBOX_ID=100
  Pewnosc: potwierdzone

FAKT-C32: Maintenance intervals from rd.h
  Zrodlo: lib/rd.h:443-444
  Regula: RD_MAINT_MIN_INTERVAL = 900000 (15 min), RD_MAINT_MAX_INTERVAL = 3600000 (60 min)
  Pewnosc: potwierdzone

FAKT-C33: PID file location
  Zrodlo: lib/rd.h:43
  Regula: RD_PID_DIR = "/var/run", PID file = "/var/run/rdservice.pid"
  Pewnosc: potwierdzone

FAKT-C34: Exit timer polling interval
  Zrodlo: rdservice.cpp:124
  Regula: Exit timer polls every 100ms for signal flags
  Pewnosc: potwierdzone
