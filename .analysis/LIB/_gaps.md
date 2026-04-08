# Extraction Gaps: LIB

## Gap 1: Physical Database Schema
- Section: Data Models > Physical Data Model
- Missing: CREATE TABLE statements with column types, constraints, indexes, and foreign keys for all 62+ tables
- Source: Section C states "LIB does not contain CREATE TABLE statements (those reside in utils/rddbmgr/)"
- Impact: Design document references tables but cannot specify column-level detail. Physical schema must be extracted from the UTL artifact (rddbmgr) separately.

## Gap 2: Report Export Filter Details
- Section: Components > Report Generator
- Missing: Detailed logic for each of the 14+ export filter formats (Deltaflex, TextLog, BMI, Technical, SoundEx, etc.)
- Source: Section A lists "export_*.cpp (x14)" as source files but Section E does not detail each filter's output format
- Impact: Report generation requirements are high-level. Individual filter format specifications would be needed for reimplementation.

## Gap 3: RML Command Catalog
- Section: Components > Macro Execution Engine
- Missing: Full catalog of ~80 RML two-letter command codes with their parameters and behavior
- Source: Section B lists RDMacro::Command enum as "~80 commands" but does not enumerate them
- Impact: Macro execution requirements are generic. Full RML command specification needed for complete reimplementation.

## Gap 4: Livewire Protocol Details
- Section: Components > Networked Audio Client
- Missing: Livewire protocol message format, handshake, and state machine
- Source: Section B covers LivewireClient signals but not the wire protocol
- Impact: Networked audio client reimplementation would need protocol documentation from the vendor.

## Gap 5: Audio File Format Internal Details
- Section: Components > Audio File Processing
- Missing: Detailed codec parameters, header parsing logic, and energy calculation algorithms
- Source: Section B covers WaveFile methods and enums but not internal processing details
- Impact: Low -- standard audio libraries handle codec details. Energy calculation algorithm may need extraction if custom.
