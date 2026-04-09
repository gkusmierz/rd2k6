-- Rivendell Cart-Based Schema (subset for migration)
-- Based on Rivendell v3.6 schema version 347
-- Adapted for SQLite (test) and PostgreSQL (production)

-- ============================================================
-- CORE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS groups (
    name            VARCHAR(10) PRIMARY KEY,
    description     VARCHAR(255),
    default_cart_type   INTEGER DEFAULT 1,
    default_low_cart    INTEGER DEFAULT 0,
    default_high_cart   INTEGER DEFAULT 0,
    default_cut_life    INTEGER DEFAULT -1,
    cut_shelflife       INTEGER DEFAULT -1,
    delete_empty_carts  VARCHAR(1) DEFAULT 'N',
    default_title       VARCHAR(255) DEFAULT 'Imported from %f.%e',
    enforce_cart_range  VARCHAR(1) DEFAULT 'N',
    report_tfc          VARCHAR(1) DEFAULT 'Y',
    report_mus          VARCHAR(1) DEFAULT 'Y',
    enable_now_next     VARCHAR(1) DEFAULT 'N',
    color               VARCHAR(7)
);

CREATE TABLE IF NOT EXISTS cart (
    number          INTEGER PRIMARY KEY,
    type            INTEGER DEFAULT 1,
    group_name      VARCHAR(10) REFERENCES groups(name),
    title           VARCHAR(255),
    artist          VARCHAR(255),
    album           VARCHAR(255),
    year            DATE,
    conductor       VARCHAR(64),
    label           VARCHAR(64),
    client          VARCHAR(64),
    agency          VARCHAR(64),
    publisher       VARCHAR(64),
    composer        VARCHAR(64),
    user_defined    VARCHAR(255),
    song_id         VARCHAR(32),
    bpm             INTEGER DEFAULT 0,
    usage_code      INTEGER DEFAULT 0,
    forced_length   INTEGER DEFAULT 0,
    average_length  INTEGER DEFAULT 0,
    length_deviation INTEGER DEFAULT 0,
    average_segue_length INTEGER DEFAULT 0,
    average_hook_length INTEGER DEFAULT 0,
    cut_quantity    INTEGER DEFAULT 0,
    last_cut_played INTEGER DEFAULT 0,
    play_order      INTEGER DEFAULT 0,
    validity        INTEGER DEFAULT 2,
    start_datetime  TIMESTAMP,
    end_datetime    TIMESTAMP,
    enforce_length  VARCHAR(1) DEFAULT 'N',
    preserve_pitch  VARCHAR(1) DEFAULT 'N',
    use_weighting   VARCHAR(1) DEFAULT 'Y',
    asyncronous     VARCHAR(1) DEFAULT 'N',
    owner           VARCHAR(64),
    macros          TEXT,
    sched_codes     VARCHAR(255),
    notes           TEXT,
    metadata_datetime TIMESTAMP,
    use_event_length VARCHAR(1) DEFAULT 'N'
);

CREATE INDEX IF NOT EXISTS cart_group_name_idx ON cart(group_name);
CREATE INDEX IF NOT EXISTS cart_title_idx ON cart(title);
CREATE INDEX IF NOT EXISTS cart_artist_idx ON cart(artist);
CREATE INDEX IF NOT EXISTS cart_album_idx ON cart(album);
CREATE INDEX IF NOT EXISTS cart_song_id_idx ON cart(song_id);

CREATE TABLE IF NOT EXISTS cuts (
    cut_name        VARCHAR(12) PRIMARY KEY,
    cart_number     INTEGER REFERENCES cart(number),
    evergreen       VARCHAR(1) DEFAULT 'N',
    description     VARCHAR(64),
    outcue          VARCHAR(64),
    isrc            VARCHAR(12),
    isci            VARCHAR(32),
    length          INTEGER DEFAULT 0,
    sha1_hash       VARCHAR(40),
    origin_datetime TIMESTAMP,
    start_datetime  TIMESTAMP,
    end_datetime    TIMESTAMP,
    sun             VARCHAR(1) DEFAULT 'Y',
    mon             VARCHAR(1) DEFAULT 'Y',
    tue             VARCHAR(1) DEFAULT 'Y',
    wed             VARCHAR(1) DEFAULT 'Y',
    thu             VARCHAR(1) DEFAULT 'Y',
    fri             VARCHAR(1) DEFAULT 'Y',
    sat             VARCHAR(1) DEFAULT 'Y',
    start_daypart   TIME,
    end_daypart     TIME,
    origin_name     VARCHAR(64),
    origin_login_name VARCHAR(255),
    source_hostname VARCHAR(255),
    weight          INTEGER DEFAULT 1,
    play_order      INTEGER DEFAULT 0,
    last_play_datetime TIMESTAMP,
    upload_datetime TIMESTAMP,
    play_counter    INTEGER DEFAULT 0,
    local_counter   INTEGER DEFAULT 0,
    validity        INTEGER DEFAULT 2,
    coding_format   INTEGER DEFAULT 0,
    sample_rate     INTEGER DEFAULT 44100,
    bit_rate        INTEGER DEFAULT 0,
    channels        INTEGER DEFAULT 2,
    play_gain       INTEGER DEFAULT 0,
    start_point     INTEGER DEFAULT -1,
    end_point       INTEGER DEFAULT -1,
    fadeup_point    INTEGER DEFAULT -1,
    fadedown_point  INTEGER DEFAULT -1,
    segue_start_point INTEGER DEFAULT -1,
    segue_end_point INTEGER DEFAULT -1,
    segue_gain      INTEGER DEFAULT 0,
    hook_start_point INTEGER DEFAULT -1,
    hook_end_point  INTEGER DEFAULT -1,
    talk_start_point INTEGER DEFAULT -1,
    talk_end_point  INTEGER DEFAULT -1
);

CREATE INDEX IF NOT EXISTS cuts_cart_number_idx ON cuts(cart_number);
CREATE INDEX IF NOT EXISTS cuts_isrc_idx ON cuts(isrc);

-- ============================================================
-- SCHEDULING TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS services (
    name            VARCHAR(10) PRIMARY KEY,
    description     VARCHAR(255),
    name_template   VARCHAR(255),
    description_template VARCHAR(255),
    program_code    VARCHAR(255),
    chain_log       VARCHAR(1) DEFAULT 'N',
    track_group     VARCHAR(10),
    autospot_group  VARCHAR(10),
    auto_refresh    VARCHAR(1) DEFAULT 'N',
    default_log_shelflife INTEGER DEFAULT -1
);

CREATE TABLE IF NOT EXISTS sched_codes (
    code            VARCHAR(10) PRIMARY KEY,
    description     VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS logs (
    name            VARCHAR(64) PRIMARY KEY,
    log_exists      VARCHAR(1) DEFAULT 'Y',
    type            INTEGER DEFAULT 0,
    service         VARCHAR(10) REFERENCES services(name),
    description     VARCHAR(64),
    origin_user     VARCHAR(255),
    origin_datetime TIMESTAMP,
    link_datetime   TIMESTAMP,
    modified_datetime TIMESTAMP,
    auto_refresh    VARCHAR(1) DEFAULT 'N',
    start_date      DATE,
    end_date        DATE,
    purge_date      DATE,
    import_date     DATE,
    scheduled_tracks INTEGER DEFAULT 0,
    completed_tracks INTEGER DEFAULT 0,
    music_links     INTEGER DEFAULT 0,
    music_linked    VARCHAR(1) DEFAULT 'N',
    traffic_links   INTEGER DEFAULT 0,
    traffic_linked  VARCHAR(1) DEFAULT 'N',
    next_id         INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS logs_service_idx ON logs(service);
CREATE INDEX IF NOT EXISTS logs_start_date_idx ON logs(start_date);

CREATE TABLE IF NOT EXISTS log_lines (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    log_name        VARCHAR(64) REFERENCES logs(name),
    line_id         INTEGER DEFAULT -1,
    count           INTEGER DEFAULT 0,
    cart_number     INTEGER DEFAULT 0,
    start_time      INTEGER DEFAULT -1,
    grace_time      INTEGER DEFAULT -1,
    time_type       INTEGER DEFAULT 0,
    trans_type      INTEGER DEFAULT 0,
    start_point     INTEGER DEFAULT -1,
    end_point       INTEGER DEFAULT -1,
    fadeup_point    INTEGER DEFAULT -1,
    fadeup_gain     INTEGER DEFAULT -1,
    fadedown_point  INTEGER DEFAULT -1,
    fadedown_gain   INTEGER DEFAULT -1,
    segue_start_point INTEGER DEFAULT -1,
    segue_end_point INTEGER DEFAULT -1,
    segue_gain      INTEGER DEFAULT -1,
    type            INTEGER DEFAULT 0,
    comment         TEXT,
    label           VARCHAR(64),
    source          INTEGER DEFAULT 0,
    ext_start_time  TIME,
    ext_length      INTEGER DEFAULT 0,
    ext_cart_name   VARCHAR(32),
    ext_data        VARCHAR(32),
    ext_event_id    VARCHAR(8),
    ext_annc_type   VARCHAR(8)
);

CREATE INDEX IF NOT EXISTS log_lines_log_name_idx ON log_lines(log_name);
CREATE INDEX IF NOT EXISTS log_lines_cart_number_idx ON log_lines(cart_number);

-- ============================================================
-- PLAYBACK LOG (ELR)
-- ============================================================

CREATE TABLE IF NOT EXISTS elr_lines (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    service_name    VARCHAR(10),
    log_name        VARCHAR(64),
    log_id          INTEGER DEFAULT -1,
    cart_number     INTEGER DEFAULT 0,
    cut_number      INTEGER DEFAULT 0,
    title           VARCHAR(255),
    artist          VARCHAR(255),
    album           VARCHAR(255),
    publisher       VARCHAR(64),
    composer        VARCHAR(64),
    song_id         VARCHAR(32),
    usage_code      INTEGER DEFAULT 0,
    start_datetime  TIMESTAMP,
    start_source    INTEGER DEFAULT 0,
    length          INTEGER DEFAULT 0,
    isrc            VARCHAR(12),
    isci            VARCHAR(32),
    station_name    VARCHAR(64),
    event_source    INTEGER DEFAULT 0,
    description     VARCHAR(64),
    outcue          VARCHAR(64),
    onair_flag      VARCHAR(1) DEFAULT 'N',
    ext_start_time  TIME,
    ext_length      INTEGER DEFAULT 0,
    ext_cart_name   VARCHAR(32),
    ext_data        VARCHAR(32),
    ext_event_id    VARCHAR(8),
    ext_annc_type   VARCHAR(8),
    sched_codes     VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS elr_lines_service_idx ON elr_lines(service_name);
CREATE INDEX IF NOT EXISTS elr_lines_start_datetime_idx ON elr_lines(start_datetime);

-- ============================================================
-- MIGRATION TRACKING
-- ============================================================

CREATE TABLE IF NOT EXISTS migration_map (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    source_system       VARCHAR(32) NOT NULL,
    source_id           VARCHAR(64) NOT NULL,
    source_external_id  VARCHAR(64),
    target_cart_number  INTEGER,
    target_cut_name     VARCHAR(12),
    migrated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status              VARCHAR(16) DEFAULT 'pending',
    notes               TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS migration_map_source_idx
    ON migration_map(source_system, source_id);
CREATE INDEX IF NOT EXISTS migration_map_cart_idx
    ON migration_map(target_cart_number);

-- ============================================================
-- SYSTEM CONFIG (minimal)
-- ============================================================

CREATE TABLE IF NOT EXISTS version (
    db              INTEGER PRIMARY KEY,
    last_maint_datetime TIMESTAMP DEFAULT '1970-01-01 00:00:00'
);

INSERT OR IGNORE INTO version (db) VALUES (347);
