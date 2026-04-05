---
partial_id: 185
artifact: LIB
class_name: RDDiscLookupFactory
header_file: lib/rddisclookup_factory.h
source_file: lib/rddisclookup_factory.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDDiscLookupFactory (factory function)

## Typ Qt
Plain C++ (Factory)

## Odpowiedzialność (WHAT)
Factory tworząca odpowiednią instancję RDDiscLookup na podstawie konfiguracji systemowej — zwraca RDMbLookup, RDCddbLookup lub RDDummyLookup.

## Publiczne API
RDDiscLookupFactory(type, ...) → RDDiscLookup*

## Zależności
RDMbLookup, RDCddbLookup, RDDummyLookup
