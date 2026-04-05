---
partial_id: 173
artifact: LIB
class_name: RDImagePickerModel
header_file: lib/rdimagepickermodel.h
source_file: lib/rdimagepickermodel.cpp
phase: 2
status: done
agent_version: 1.1.0
---

# RDImagePickerModel

## Typ Qt
Model (dziedziczy QAbstractListModel)

## Odpowiedzialność (WHAT)
Model obrazków dla combo box picker — ładuje miniatury obrazków (podcastów/feedów) z tabeli FEED_IMAGES i prezentuje jako listę z ikonami.

## Publiczne API
data, rowCount, setFeedId, imageId(row), refresh

## Tabele DB
FEED_IMAGES (READ)

## Zależności
RDSqlQuery
