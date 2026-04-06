# Facts from Documentation: rdadmin

## Source: docs/opsguide/rdadmin.xml (~2800 lines DocBook XML)

### Managing Users

FAKT-D001: Two user types exist: administrator and operational
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.managing_users
  Type: business_rule
  Content: Administrator users (Administer System right) can log into RDAdmin. Operational users have specific module rights but NO RDAdmin access. A single user cannot act in both roles.
  Mapped to: EditUser

FAKT-D002: Default database users: "admin" and "user"
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.managing_users
  Type: configuration
  Content: Fresh DB has "admin" (administrator) and "user" (operational). Default login: admin with no password.
  Mapped to: Login

FAKT-D003: PAM authentication delegation
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.managing_users
  Type: business_rule
  Content: If "Authenticate Locally" unticked, authentication delegated to PAM service specified in PAM Service field.
  Mapped to: EditUser

FAKT-D004: WebAPI Timeout and Web Logins
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.managing_users
  Type: configuration
  Content: WebAPI Timeout (seconds) for RDXport. Allow Web Logins permits RDCastManager web access.
  Mapped to: EditUser

### Managing Groups

FAKT-D005: Default Import Title wildcards
  Source: docs/opsguide/rdadmin.xml:table.rdadmin.default_import_title_wildcards
  Type: business_rule
  Content: %f = body part of filename, %e = extension part. Used by dropboxes and rdimport.
  Mapped to: EditGroup

FAKT-D006: Enforce Cart Range blocks carts outside group range
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_groups.editing_group_information
  Type: business_rule
  Content: If Enforce Cart Range ticked, Rivendell will not permit carts to be created in or moved to this group outside the range.
  Mapped to: EditGroup

FAKT-D007: Cut life (Set End Date/Time) auto-sets expiration
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_groups.editing_group_information
  Type: business_rule
  Content: New cuts get end date/time set to N days after creation date.
  Mapped to: EditGroup

FAKT-D008: Purge expired cuts + delete empty cart
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_groups.editing_group_information
  Type: business_rule
  Content: If Purge ticked, cuts deleted N days after expiration. If "Delete cart if empty" also ticked, empty carts deleted too.
  Mapped to: EditGroup

FAKT-D009: Transmit Now & Next is DEPRECATED
  Source: docs/opsguide/rdadmin.xml:note after Transmit Now & Next
  Type: business_rule
  Content: Per-group filtering of PyPAD updates deprecated. Use [NowGroups]/[NextGroups] in PyPAD config instead. Will be removed in v4.x.
  Mapped to: EditGroup

FAKT-D010: Group rename can merge groups
  Source: docs/opsguide/rdadmin.xml:rdadmin.manage_groups.renaming_groups
  Type: business_rule
  Content: If new name already exists, carts in this group will be moved into that group.
  Mapped to: RenameGroup

### Managing Services

FAKT-D011: Inline Event Start/Length: two modes
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_services.general.inline_event_scheduling_parameters
  Type: business_rule
  Content: "From Scheduler File" (explicit values) vs "From Relative Position" (heuristic, DEPRECATED).
  Mapped to: EditSvc

FAKT-D012: From Relative Position is DEPRECATED
  Source: docs/opsguide/rdadmin.xml:note in inline_event_scheduling_parameters
  Type: business_rule
  Content: "From Relative Position" mode deprecated, will be removed. Only one inline event per type per parent Music Event.
  Mapped to: EditSvc

FAKT-D013: Autofill carts algorithm: longest-first recursive fill
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_services.general.configure_autofill_carts
  Type: business_rule
  Content: RDLogManager scans available carts longest-to-shortest, inserts longest that fits. Stops when gap filled or no cart short enough.
  Mapped to: AutofillCarts

FAKT-D014: Import re-import warning for finished logs
  Source: docs/opsguide/rdadmin.xml:warning after Include Import Markers
  Type: business_rule
  Content: If import markers not included in finished logs, re-import of music/traffic data is impossible.
  Mapped to: EditSvc

FAKT-D015: Copy To Custom overwrites prior custom template
  Source: docs/opsguide/rdadmin.xml:warning after Copy To Custom
  Type: constraint
  Content: Copy To Custom action overwrites prior custom import template values.
  Mapped to: EditSvc

FAKT-D016: Log schedule files are column-aligned format
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_services.traffic_music_import_parser_settings
  Type: business_rule
  Content: Each record = single line, fields at fixed column positions. Offset (from 0) + Length. Length=0 disables field.
  Mapped to: ImportFields

### Managing Hosts

FAKT-D017: Module restart required after config change
  Source: docs/opsguide/rdadmin.xml:note in sect.rdadmin.manage_hosts
  Type: constraint
  Content: After changing module configuration, restart of that module is generally necessary.
  Mapped to: EditStation

FAKT-D018: Default report editor fallback to vi in xterm
  Source: docs/opsguide/rdadmin.xml:note after Report Editor
  Type: configuration
  Content: If Report Editor blank, system uses "xterm -e vi".
  Mapped to: EditStation

FAKT-D019: System Services: HTTP Xport and CAE can be on different host
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts
  Type: business_rule
  Content: Host can use HTTP Xport or Core Audio Engine of another host in the network.
  Mapped to: EditStation

FAKT-D020: RDLibrary Max Record Time 00:00:00 = unlimited
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_rdlibrary
  Type: business_rule
  Content: Setting Max Record Time to 00:00:00 allows unlimited recording duration.
  Mapped to: EditRDLibrary

FAKT-D021: CD metadata sources: None, CDDB, MusicBrainz
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_rdlibrary
  Type: configuration
  Content: CD-Text data detected on all discs takes precedence over external lookup.
  Mapped to: EditRDLibrary

FAKT-D022: RDAirPlay dual output alternation
  Source: docs/opsguide/rdadmin.xml:rdadmin.manage_hosts.configure_rdairplay.channel_assignments
  Type: business_rule
  Content: If both Output 1 and Output 2 set to different card/port, rdairplay output alternates between them.
  Mapped to: EditRDAirPlay

FAKT-D023: Exit Password protects against inadvertent shutdown
  Source: docs/opsguide/rdadmin.xml:rdadmin.manage_hosts.configure_rdairplay.start_stop_settings
  Type: business_rule
  Content: Exit Password field prevents accidental rdairplay exits.
  Mapped to: EditRDAirPlay

FAKT-D024: Restart Log After Unclean Shutdown
  Source: docs/opsguide/rdadmin.xml:rdadmin.manage_hosts.configure_rdairplay.start_stop_settings
  Type: business_rule
  Content: If ticked, rdairplay restarts log from the event playing when unclean shutdown occurred.
  Mapped to: EditRDAirPlay

FAKT-D025: RDAirPlay mode control: Unified vs Independent
  Source: docs/opsguide/rdadmin.xml:rdadmin.manage_hosts.configure_rdairplay_start_stop_settings
  Type: business_rule
  Content: Unified = all log machines same mode. Independent = separately settable.
  Mapped to: EditRDAirPlay

FAKT-D026: Sound Panel: Flash Active Buttons + Enable Button Pausing
  Source: docs/opsguide/rdadmin.xml:rdadmin.manage_hosts.configure_rdairplay_sound_panel_settings
  Type: business_rule
  Content: Flash = playing buttons flash. Pausing = touch playing button pauses instead of stops.
  Mapped to: EditRDAirPlay

FAKT-D027: RDPanel is independent from RDAirPlay panels
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_rdpanel
  Type: business_rule
  Content: rdpanel has its own set of system and user panels independent of rdairplay.
  Mapped to: EditRDPanel

FAKT-D028: RDLogEdit Enable 2nd Start Button
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_rdlogedit
  Type: business_rule
  Content: If No, voice tracker waits for Save button after starting track recording.
  Mapped to: EditRDLogedit

### Dropboxes

FAKT-D029: Dropbox PathSpec must include file part
  Source: docs/opsguide/rdadmin.xml:important in configuring_dropboxes.configuration
  Type: constraint
  Content: Path must match full file path, not just directory. "/home/rd/dropbox" or "/home/rd/dropbox/" matches nothing.
  Mapped to: EditDropbox

FAKT-D030: Dropbox requires valid cart range in group
  Source: docs/opsguide/rdadmin.xml:important after basic dropbox operation
  Type: constraint
  Content: Group must have Default Cart Number range set with free number available, else dropbox throws error.
  Mapped to: EditDropbox

FAKT-D031: Dropbox imports file only once
  Source: docs/opsguide/rdadmin.xml:note after dropbox import
  Type: business_rule
  Content: Each file imported once only. Reset button clears history for re-processing.
  Mapped to: EditDropbox

FAKT-D032: Dropbox To Cart mode: add cut to specific cart
  Source: docs/opsguide/rdadmin.xml:varlistentry for To Cart
  Type: business_rule
  Content: Imports to specified cart (not new). Delete cuts before importing option available.
  Mapped to: EditDropbox

FAKT-D033: Dropbox CartChunk CutID determines cart number
  Source: docs/opsguide/rdadmin.xml:varlistentry for CartChunk CutID
  Type: business_rule
  Content: Cart number from CutID field. Cart created if not exists. Must be in valid group range.
  Mapped to: EditDropbox

### Switcher/GPIO Devices

FAKT-D034: Switcher supports primary + backup connections
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.configuring_switcher_gpio_devices
  Type: business_rule
  Content: Certain devices support redundant connections. Connections via TCP/IP or serial.
  Mapped to: EditMatrix

FAKT-D035: Serial port must be configured before use
  Source: docs/opsguide/rdadmin.xml:important in connections section
  Type: constraint
  Content: Serial port must be enabled and configured in Serial Ports dialog before switcher use.
  Mapped to: EditMatrix, EditTtys

FAKT-D036: GPI/GPO macro associations are defaults, can be changed by RML
  Source: docs/opsguide/rdadmin.xml:important in GPIO section
  Type: business_rule
  Content: Configured macro carts are defaults set at service restart. Can be altered dynamically via GI command.
  Mapped to: EditGpi

### System Settings

FAKT-D037: System Sample Rate should be set before ingesting audio
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_system_settings
  Type: constraint
  Content: Should not be altered after audio exists in store. Changing may cause incorrect play-out.
  Mapped to: EditSystem

FAKT-D038: Duplicate cart titles is DEPRECATED
  Source: docs/opsguide/rdadmin.xml:warning in manage_system_settings
  Type: business_rule
  Content: Deprecated feature, included only for existing setups. Causes unreliable behavior. Never use in new setups.
  Mapped to: EditSystem

FAKT-D039: Multicast notification address default: 239.19.255.72
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_system_settings
  Type: configuration
  Content: IPv4 multicast for state/config changes between hosts. Seldom changed.
  Mapped to: EditSystem

FAKT-D040: Temporary Cart Group for rdcartslots
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_system_settings
  Type: configuration
  Content: Group for temporary carts used in rdcartslots direct file play-outs.
  Mapped to: EditSystem

FAKT-D041: RSS processing host designation
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_system_settings
  Type: configuration
  Content: One host designated for processing automatic RSS feed state changes. Can be [none].
  Mapped to: EditSystem

### Replicators

FAKT-D042: Only one replicator type: Citidel X-Digital Portal
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_replicators
  Type: constraint
  Content: Only X-Digital satellite head-end system supported.
  Mapped to: EditReplicator

### PyPAD

FAKT-D043: PyPAD config changes apply without rdairplay restart
  Source: docs/opsguide/rdadmin.xml:note after PyPAD instance editing
  Type: business_rule
  Content: Light turns red briefly then green, indicating changes applied to active instance.
  Mapped to: EditPypad

FAKT-D044: RLM to PyPAD migration: config files unchanged
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.moving_legacy_rlm_configurations_to_pypad
  Type: business_rule
  Content: RLM config can be copy/pasted into PyPAD Configuration box. Must remove sample entries first.
  Mapped to: EditPypad

### Audio Ports

FAKT-D045: Audio port settings only affect AudioScience HPI driver
  Source: docs/opsguide/rdadmin.xml:note in configuring_audio_ports
  Type: constraint
  Content: Audio port type/mode/level settings only work with AudioScience HPI cards.
  Mapped to: EditAudioPorts

FAKT-D046: Audio port modes define L/R routing
  Source: docs/opsguide/rdadmin.xml:table.rdadmin.audio_port_mode_switch_settings
  Type: business_rule
  Content: Normal/Swap/Left Only/Right Only modes with 1 or 2 channels. 8 combinations.
  Mapped to: EditAudioPorts

### JACK

FAKT-D047: JACK and caed must run under same Linux user
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.jack_integration
  Type: constraint
  Content: caed runs as root (UID 0) by default. JACK must also run as root.
  Mapped to: EditJack

FAKT-D048: JACK clients auto-start on Rivendell service restart
  Source: docs/opsguide/rdadmin.xml:sect.rdadmin.manage_hosts.jack_integration
  Type: business_rule
  Content: Clients in JACK Clients list restarted when Rivendell service restarts. Run as same user as caed.
  Mapped to: EditJack

### Host Variables

FAKT-D049: Host variables are %TAG% alphanumeric tags
  Source: docs/opsguide/rdadmin.xml:sec.rdadmin.manage_hosts.configuring_host_variables.overview
  Type: business_rule
  Content: Bracketed by % characters, per-host string values. Auto-substituted in macro cart commands.
  Mapped to: ListHostvars, EditHostvar
