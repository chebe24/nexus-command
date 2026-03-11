# Project: Nexus Command Hub & AI Logbook

## Organizational Standards
- **Naming (V6)**: WW-Date_Root_Type_Description_Project[Tag].ext
- **Energy Mapping**: Use 'energy_tier' (e.g., 40 CAG) for scheduling logic.
- **Directory Structure**: Separate logic (/src) from raw data (/data/raw).

## Commands
- **Sync**: 'python src/v6_renamer_engine.py'
- **Audit**: 'python src/integrity_sentinel.py'
- **Report**: 'python src/project_status_aggregator.py'

## Rules
- Always use 'git mv' for file reorganization to preserve history.
- Never delete a file without verifying its ID in the Nexus Hub (doc_id: 1qEZUBf...).
- Prioritize high-energy (40 CAG) tasks in the Morning Sync Report.
