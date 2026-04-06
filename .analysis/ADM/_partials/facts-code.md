# Facts from Code: rdadmin

## Source: rdadmin/*.cpp (84 files, ~36007 LOC)

### Guard Clauses and Validations

FAKT-C001: User cannot delete themselves
  Source: rdadmin/list_users.cpp:180-183
  Rule: if(list_admin_name==item->text(1)) return with warning "You cannot delete yourself!"
  Certainty: confirmed

FAKT-C002: User cannot be deleted if set as default user on any station
  Source: rdadmin/list_users.cpp:196-209
  Rule: SELECT NAME from STATIONS where DEFAULT_NAME=username; if results > 0, block delete with list of stations
  Certainty: confirmed

FAKT-C003: User deletion cascades through 4 tables
  Source: rdadmin/list_users.cpp:227-256
  Rule: DELETE order: FEED_PERMS -> USER_PERMS -> USERS -> WEB_CONNECTIONS
  Certainty: confirmed

FAKT-C004: New user gets permissions to ALL existing groups
  Source: rdadmin/add_user.cpp:130-138
  Rule: After INSERT INTO USERS, SELECT NAME from GROUPS and INSERT INTO USER_PERMS per group
  Certainty: confirmed

FAKT-C005: New user creation rolls back on cancel
  Source: rdadmin/add_user.cpp:141-153
  Rule: If EditUser dialog returns <0, DELETE from USER_PERMS and USERS for new user
  Certainty: confirmed

FAKT-C006: Username must not be empty
  Source: rdadmin/add_user.cpp:114-117
  Certainty: confirmed

FAKT-C007: Username must be unique (SQL INSERT failure)
  Source: rdadmin/add_user.cpp:122-128
  Certainty: confirmed

FAKT-C008: Group cannot be deleted if it has carts (warns about count)
  Source: rdadmin/list_groups.cpp:215-231
  Rule: SELECT NUMBER from CART where GROUP_NAME=name; shows count in warning but ALLOWS delete (with carts)
  Certainty: confirmed

FAKT-C009: Group deletion cascades through member carts + 3 permission tables
  Source: rdadmin/list_groups.cpp:236-274
  Rule: For each CART: cart->remove(); then DELETE from AUDIO_PERMS, USER_PERMS, REPLICATOR_MAP, GROUPS
  Certainty: confirmed

FAKT-C010: New group gets permissions to ALL existing users and services (optional)
  Source: rdadmin/add_group.cpp:164-170
  Rule: Checkbox "Enable Group for All Users" (default checked) => INSERT into USER_PERMS per user
  Rule: Checkbox "Enable Group for All Services" (default checked) => INSERT into AUDIO_PERMS per service
  Certainty: confirmed

FAKT-C011: New group creation rolls back on failure
  Source: rdadmin/add_group.cpp (after EditGroup returns cancel)
  Rule: DELETE from USER_PERMS, AUDIO_PERMS, GROUPS
  Certainty: confirmed

FAKT-C012: Group rename can merge into existing group
  Source: rdadmin/rename_group.cpp:136-148
  Rule: If target group exists, prompts "Do you want to combine the two?"
  Certainty: confirmed

FAKT-C013: Group rename updates 6 tables cascadingly
  Source: rdadmin/rename_group.cpp:155-214
  Rule: UPDATE CART, EVENTS(SCHED_GROUP), REPLICATOR_MAP, DROPBOXES; then if NOT merging: GROUPS, AUDIO_PERMS, USER_PERMS; if merging: DELETE old group + AUDIO_PERMS + USER_PERMS
  Certainty: confirmed

FAKT-C014: Service cannot be deleted if it has logs
  Source: rdadmin/list_svcs.cpp:154-166
  Rule: SELECT NAME from LOGS where SERVICE=name; if exists, warns about count and asks confirmation
  Certainty: confirmed

FAKT-C015: Service deletion delegates to librd RDSvc::remove()
  Source: rdadmin/list_svcs.cpp:168-170
  Certainty: confirmed

FAKT-C016: Station deletion delegates to librd RDStation::remove()
  Source: rdadmin/list_stations.cpp:140
  Rule: Simple confirmation dialog, then RDStation::remove(name)
  Certainty: confirmed

FAKT-C017: Duplicate cart titles check is DEPRECATED
  Source: rdadmin/edit_system.cpp:286-293
  Rule: Warning: "The ability to disallow duplicate cart titles has been deprecated and may be removed from future versions"
  Certainty: confirmed

FAKT-C018: Disabling duplicate titles triggers full library scan
  Source: rdadmin/edit_system.cpp:366-418
  Rule: SELECT NUMBER,TITLE from CART; for each, check duplicates; if found, shows list and blocks disabling
  Certainty: confirmed

FAKT-C019: Dropbox date offset validation: start <= end
  Source: rdadmin/edit_dropbox.cpp:634-639
  Rule: Create StartDate Offset must be <= Create EndDate Offset
  Certainty: confirmed

FAKT-C020: Dropbox reset clears import history
  Source: rdadmin/edit_dropbox.cpp:617-620
  Rule: DELETE from DROPBOX_PATHS where DROPBOX_ID=id; files will be reimported
  Certainty: confirmed

FAKT-C021: Feed deletion is multi-step cascade
  Source: rdadmin/list_feeds.cpp:243-302
  Rule: 1) Delete remote audio per podcast; 2) Delete remote XML; 3) DELETE PODCASTS; 4) removeAllImages + DELETE FEED_IMAGES; 5) DELETE FEED_PERMS; 6) DELETE SUPERFEED_MAPS; 7) DELETE FEEDS
  Certainty: confirmed

FAKT-C022: Feed repost uploads all images, item data, and RSS XML
  Source: rdadmin/list_feeds.cpp:320-392
  Rule: 3-phase: postImage per image -> postPodcast per podcast -> postXml for RSS
  Certainty: confirmed

FAKT-C023: Superfeed must have at least one subfeed
  Source: rdadmin/edit_feed.cpp:658-662
  Rule: if is_superfeed && subfeedNames.size()==0, block save
  Certainty: confirmed

FAKT-C024: Feed purge URL must be supported scheme
  Source: rdadmin/edit_feed.cpp:664-673
  Rule: Both RDDelete and RDUpload must support the URL scheme
  Certainty: confirmed

FAKT-C025: Matrix primary/backup connections must differ
  Source: rdadmin/edit_matrix.cpp:1227-1233
  Rule: If both TCP: addr+port must differ; if both Serial: port must differ
  Certainty: confirmed

FAKT-C026: Matrix serial port must be active
  Source: rdadmin/edit_matrix.cpp:1204-1212
  Rule: RDTty::active() must return true
  Certainty: confirmed

FAKT-C027: Matrix TCP IP address must be valid
  Source: rdadmin/edit_matrix.cpp:1197-1201
  Rule: QHostAddress::setAddress() must succeed
  Certainty: confirmed

FAKT-C028: Scheduler code deletion cascades to DROPBOX_SCHED_CODES
  Source: rdadmin/list_schedcodes.cpp:175-183
  Rule: DELETE from DROPBOX_SCHED_CODES, then DELETE from SCHED_CODES
  Certainty: confirmed

FAKT-C029: Dropbox operations send RIPC notifications
  Source: rdadmin/list_dropboxes.cpp:145-148,175-178,199-202,238-241
  Rule: After Add/Edit/Duplicate/Delete: RDNotification(DropboxType, Add/Modify/Delete) -> sendNotification
  Certainty: confirmed

FAKT-C030: PyPAD operations send RIPC notifications
  Source: rdadmin/list_pypads.cpp:198-200,221-224,247-249
  Rule: After Add/Edit/Delete: RDNotification(PypadType, Add/Modify/Delete) -> sendNotification
  Certainty: confirmed

FAKT-C031: Group cart range: LOW_CART must be <= HIGH_CART
  Source: rdadmin/edit_group.cpp (from inventory)
  Rule: ENFORCE_CART_RANGE blocks creating carts outside range
  Certainty: confirmed

FAKT-C032: Group DEFAULT_CUT_LIFE = -1 means no expiration
  Source: rdadmin/edit_group.cpp (from inventory)
  Certainty: confirmed

FAKT-C033: Admin user types are mutually exclusive with operational rights
  Source: rdadmin/edit_user.cpp (Admin Config/RSS toggles)
  Rule: Administer System right disallows selection of any other rights
  Certainty: confirmed (code + docs)

FAKT-C034: EditStation uses deferred save via 1ms QTimer
  Source: rdadmin/edit_station.cpp (from call-graph)
  Rule: okData() uses okTimerData() with 1ms QTimer for deferred save
  Certainty: confirmed

FAKT-C035: CAE station can differ from host station
  Source: rdadmin/edit_station.cpp (from inventory)
  Rule: Audio processing delegated to different server
  Certainty: confirmed

FAKT-C036: Login dialog returns username/password by reference
  Source: rdadmin/login.cpp
  Rule: Constructor takes QString& for name and password
  Certainty: confirmed

FAKT-C037: Report deletion cascades through REPORT_SERVICES, REPORT_STATIONS
  Source: rdadmin/list_reports.cpp (from inventory)
  Certainty: confirmed

FAKT-C038: EditUser local auth toggle hides/shows PAM service field
  Source: rdadmin/edit_user.cpp (from inventory)
  Rule: LOCAL_AUTH checkbox controls visibility of PAM_SERVICE field
  Certainty: confirmed

FAKT-C039: Hotkeys can be cloned from another host
  Source: rdadmin/edit_hotkeys.cpp (from docs + code)
  Rule: "Set From Host" dropdown + Save copies hotkey assignments
  Certainty: confirmed

FAKT-C040: Dropbox processes files only once (tracked in DROPBOX_PATHS)
  Source: rdadmin/edit_dropbox.cpp:617 (Reset clears DROPBOX_PATHS)
  Certainty: confirmed
