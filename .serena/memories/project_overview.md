# Rivendell (rd2k6)

Rivendell is a complete open-source radio automation system for Linux.
Version: 3.6.7 (based on PACKAGE_VERSION).

## Tech Stack
- C++ with Qt (Qt3/Qt4 compatibility layer)
- Build system: autotools (autoconf/automake) + qmake
- Database: MySQL/MariaDB
- Audio: ALSA, JACK, AudioScience HPI
- IPC: Unix sockets, TCP/UDP
- Web: CGI-based API (rdxport.cgi, webget.cgi)

## Structure
- `lib/` — core library (librd), ~399 files, used by all other components
- `rdhpi/` — AudioScience HPI library
- `cae/`, `ripcd/`, `rdservice/`, `rdcatchd/`, etc. — daemons
- `rdadmin/`, `rdairplay/`, `rdlibrary/`, etc. — GUI applications
- `utils/` — command-line tools
- `web/` — CGI web services
- `apis/` — external APIs (rivwebcapi, pypad)
- `tests/` — test suite

## LOC
~307,000 lines of code across 42 artifacts.
