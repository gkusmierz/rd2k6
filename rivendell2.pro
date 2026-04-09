# rivendell2.pro
#
# Top-level QMake project for Rivendell 2.0
# Hexagonal architecture: domain -> ports -> adapters -> app -> ui
#

TEMPLATE = subdirs

SUBDIRS = \
    src/domain \
    src/ports \
    src/adapters \
    src/app \
    src/ui \
    tests

# Dependency order: inner layers build before outer layers
src/ports.depends = src/domain
src/adapters.depends = src/domain src/ports
src/app.depends = src/domain src/ports
src/ui.depends = src/adapters
tests.depends = src/domain src/ports src/adapters src/app
