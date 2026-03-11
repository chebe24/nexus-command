#!/bin/bash
# V6 Migration Script - Generated 2026-02-20 00:42
# Execute from repository root: bash plans/migrate_to_v6.sh
# Based on master files identified by sniff_master_files.py (2 runs)

echo "Starting V6 Migration of 10 Master Files..."

# File 1: EBR Conduct Generator Database
git mv "data/raw/2026-01-11_EdAssistWeeklyConductGeneratorDB.xlsx" \
       "data/raw/02-20260111_EBR_Database_Weekly_Conduct_Generator_EBRConductGenerator.xlsx"

# File 2: File Organization DB
git mv "data/raw/2026-01-27_FileOrganizationDB_v3.xlsx" \
       "data/raw/05-20260127_System_Database_File_Organization_NexusHub[v3].xlsx"

# File 3: AI Agents Inventory
git mv "data/raw/AI Agents Inventory.xlsx" \
       "data/raw/08-20260219_AI_Inventory_Agents_Registry_AISystems.xlsx"

# File 4: AI Index Excel (Master - verified by modification date)
git mv "data/raw/AI Index (1).xlsx" \
       "data/raw/08-20260219_AI_Index_Master_Registry_AISystems.xlsx"

# File 5: Filenaming Master Database Excel
git mv "data/raw/FilenamingMasterDatabase_v3 (1).xlsx" \
       "data/raw/08-20260219_System_Database_Filenaming_Standards_NexusHub[v3].xlsx"

# File 6: FLAIM Drive Tracker
git mv "data/raw/FLAIM Drive Tracker.xlsx" \
       "data/raw/08-20260219_FLAIM_Tracker_Drive_Resources_FLAIM.xlsx"

# File 7: EBR Conduct Generator PDF Export
git mv "data/raw/WeeklyConductGenerator_Proj_EdAssist_Sheet_2026-01-11 - Google Sheets.pdf" \
       "data/raw/02-20260111_EBR_Export_Weekly_Conduct_Generator_EBRConductGenerator[PDF].pdf"

# File 8: Filenaming Standards Google Sheets Link
git mv "data/raw/FilenamingMasterDatabase_v3.gsheet" \
       "data/raw/08-20260220_System_Link_Filenaming_Standards_Cloud_NexusHub[v3][GSheet].gsheet"

# File 9: AI Index Google Sheets Link
git mv "data/raw/AI Index.gsheet" \
       "data/raw/08-20260220_AI_Link_Master_Registry_Cloud_AISystems[GSheet].gsheet"

# File 10: FLAIM Validation Specification
git mv "data/raw/00-FLAIMValidationSpec_Admin_Guide_2026-01-21.md" \
       "data/raw/04-20260121_FLAIM_Spec_Validation_Admin_Guide_FLAIM.md"

echo "Migration complete!"
echo "Running integrity check..."

# Verify integrity
python src/integrity_sentinel.py

# Generate status report
python src/project_status_aggregator.py

echo "V6 migration finished. Please review the changes."
