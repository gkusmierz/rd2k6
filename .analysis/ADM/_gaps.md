# Extraction Gaps: ADM (rdadmin)

## Identified Gaps

- Section: Data Models / Physical Data Model
  - Missing: Exact column definitions, data types, and constraints for the 43 tables used by rdadmin
  - Source: Data Model section notes that all tables are defined in LIB artifact, not ADM
  - Impact: Low -- schema details are available in the LIB spec. RDAdmin only consumes the schema.

- Section: Business Rules / Password Verification
  - Missing: Exact password hashing/verification mechanism used by the authentication service
  - Source: Business Rules section references RDUser::checkPassword() but does not detail the algorithm
  - Impact: Low -- implementation detail lives in the LIB artifact's User data access class.

- Section: UI Contracts / Widget State Details
  - Missing: Exact conditional visibility/enable rules for dependent form fields (e.g., which fields in EditRDAirPlay are shown/hidden based on mode selections)
  - Source: UI Contracts section documents widget inventory but not all conditional display logic
  - Impact: Medium -- some complex edit dialogs have field interdependencies that may need re-extraction during implementation.

- Section: Business Rules / Encoder Profile CRUD
  - Missing: Specific validation rules and business constraints for encoder profile management (ListEncoders)
  - Source: Business Rules section does not include encoder-specific rules
  - Impact: Low -- encoder management appears to be simple CRUD without special validation.
