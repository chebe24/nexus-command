# Migration Plan: V6 Naming Standard
**Generated:** 2026-02-19
**Target Directory:** `/data/raw`
**Status:** Directory Currently Empty - Framework Ready for Future Files

---

## Current State Inventory

### Directory Status
- **Location:** `data/raw/`
- **File Count:** 10 (MASTER FILES ONLY)
- **Subdirectories:** None
- **Status:** **UPDATED 2026-02-20 00:42** - Master files ingested via sniff_master_files.py (2 runs)
- **Total Size:** ~1.7 MB

### 🏆 Master Files Inventory (Verified by sniff_master_files.py)

| # | Current Filename | Size | Type | Category |
|---|------------------|------|------|----------|
| 1 | `2026-01-11_EdAssistWeeklyConductGeneratorDB.xlsx` | 26K | Excel | **EBR Conduct Generator** |
| 2 | `WeeklyConductGenerator_Proj_EdAssist_Sheet_2026-01-11 - Google Sheets.pdf` | 71K | PDF | **EBR Conduct Generator** |
| 3 | `2026-01-27_FileOrganizationDB_v3.xlsx` | 477K | Excel | **File Organization System** |
| 4 | `FilenamingMasterDatabase_v3 (1).xlsx` | 352K | Excel | **File Organization System** |
| 5 | `FilenamingMasterDatabase_v3.gsheet` | 176B | GSheet Link | **File Organization System** |
| 6 | `AI Agents Inventory.xlsx` | 4.8K | Excel | **AI Systems** |
| 7 | `AI Index (1).xlsx` | 15K | Excel | **AI Systems** |
| 8 | `AI Index.gsheet` | 176B | GSheet Link | **AI Systems** |
| 9 | `FLAIM Drive Tracker.xlsx` | 674K | Excel | **FLAIM Project** |
| 10 | `00-FLAIMValidationSpec_Admin_Guide_2026-01-21.md` | 17K | Markdown | **FLAIM Project** |

### File Type Breakdown
- **Excel Files (.xlsx):** 6 files (databases and trackers)
- **Google Sheets Links (.gsheet):** 2 files (cloud-based master references)
- **PDF Documents (.pdf):** 1 file (Google Sheets export)
- **Markdown Documentation (.md):** 1 file (FLAIM specification)

### Deprecated Files (Not Copied)
The following files were identified as outdated or duplicates and were NOT copied to data/raw:
- `2026-01-04-EdAssistCurriculumDataBase.xlsx` - OUTDATED (older than 2026-01-11 version)
- `AI Index.xlsx` - OUTDATED (older than AI Index (1).xlsx)
- `ConductChartScript_Proj_EdAssist_2026-01-11.docx` - OUTDATED
- `Proj_EdAssist_MathBellringers.pptx` - OUTDATED
- `Proj_EdAssist_2026-01-02_Doc_EurekaScopeSeq.pdf` - OUTDATED
- `FLAIM_OperationsDashboard_v2.json` - OUTDATED
- `FilenamingMasterDatabase.gsheet` - OUTDATED (older version)
- Various other project-specific files in subdirectories

---

## Project Categorization Analysis

### EBR Conduct Generator Files (2 files)
- ✅ `2026-01-11_EdAssistWeeklyConductGeneratorDB.xlsx` (26K)
  - **Purpose:** Weekly conduct standards generator database (Excel format)
  - **Original Date:** 2026-01-11 (Week 02)
  - **Type:** Database/Config
  - **Priority:** High (40 CAG)

- ✅ `WeeklyConductGenerator_Proj_EdAssist_Sheet_2026-01-11 - Google Sheets.pdf` (71K)
  - **Purpose:** PDF export of Google Sheets conduct generator
  - **Original Date:** 2026-01-11 (Week 02)
  - **Type:** PDF Export
  - **Priority:** High (40 CAG)

### Journal Du Matin Files (0 files)
- ❌ No files currently identified for Journal Du Matin project
- **Note:** May need to check if any AI Index files contain journaling data

### Other Project Files (8 files)
These master files belong to different projects but should still receive V6 naming:

#### Infrastructure/System Files (3 files)
- `2026-01-27_FileOrganizationDB_v3.xlsx` (477K) - File organization system database v3
- `FilenamingMasterDatabase_v3 (1).xlsx` (352K) - Filenaming standards database v3 (Excel)
- `FilenamingMasterDatabase_v3.gsheet` (176B) - Filenaming standards database v3 (Google Sheets link)

#### AI Systems (3 files)
- `AI Agents Inventory.xlsx` (4.8K) - Agent tracking registry
- `AI Index (1).xlsx` (15K) - AI systems master index (Excel, VERIFIED as master)
- `AI Index.gsheet` (176B) - AI systems index (Google Sheets link)

#### FLAIM Project (2 files)
- `FLAIM Drive Tracker.xlsx` (674K) - Drive/resource tracker
- `00-FLAIMValidationSpec_Admin_Guide_2026-01-21.md` (17K) - FLAIM validation specification and admin guide

---

## V6 Naming Standard

### Format Specification
```
WW-Date_Root_Type_Description_Project[Tag].ext
```

### Component Breakdown
| Component | Description | Example |
|-----------|-------------|---------|
| **WW** | ISO Week Number (01-53) | `08` for week 8 |
| **Date** | YYYY-MM-DD or YYYYMMDD | `2026-02-19` or `20260219` |
| **Root** | Primary category/domain | `Journal`, `EBR`, `Analysis` |
| **Type** | Document type | `Entry`, `Report`, `Template`, `Data` |
| **Description** | Brief descriptor (underscores) | `Morning_Reflection`, `Conduct_Rules` |
| **Project** | Project identifier | `JournalDuMatin`, `EBRConductGenerator` |
| **[Tag]** | Optional metadata tag | `[Draft]`, `[Final]`, `[v2]` |
| **ext** | File extension | `.md`, `.json`, `.py`, `.txt` |

---

## Project-Specific Guidelines

### EBR Conduct Generator
**Project ID:** `EBRConductGenerator`
**Common Roots:** `EBR`, `Conduct`, `Rules`
**Common Types:** `Template`, `Output`, `Config`, `Report`
**Energy Tier:** 40 CAG (High Priority)

#### Example V6 Names:
```
08-20260219_EBR_Template_Base_Conduct_Rules_EBRConductGenerator.md
08-20260219_EBR_Output_Weekly_Standards_EBRConductGenerator[Final].txt
08-20260219_EBR_Config_Generator_Settings_EBRConductGenerator.json
08-20260219_EBR_Report_Compliance_Summary_EBRConductGenerator.md
```

#### Typical File Types:
- **Templates:** Base conduct rule structures
- **Outputs:** Generated weekly conduct standards
- **Configs:** Generator configuration files
- **Reports:** Compliance and audit reports

---

### Journal Du Matin
**Project ID:** `JournalDuMatin`
**Common Roots:** `Journal`, `Morning`, `Reflection`
**Common Types:** `Entry`, `Template`, `Summary`, `Analysis`
**Energy Tier:** 40 CAG (High Priority - Morning Sync)

#### Example V6 Names:
```
08-20260219_Journal_Entry_Morning_Reflection_JournalDuMatin.md
08-20260219_Journal_Template_Daily_Structure_JournalDuMatin.md
08-20260219_Journal_Summary_Weekly_Review_JournalDuMatin[Draft].md
08-20260219_Journal_Analysis_Energy_Patterns_JournalDuMatin.md
```

#### Typical File Types:
- **Entries:** Daily morning journal reflections
- **Templates:** Structured prompts and formats
- **Summaries:** Weekly/monthly aggregations
- **Analysis:** Pattern recognition and insights

---

## ACTUAL V6 MIGRATION MAPPINGS

### File 1: EBR Conduct Generator Database
**Current:** `2026-01-11_EdAssistWeeklyConductGeneratorDB.xlsx`
**Analysis:**
- Original Date: 2026-01-11 (Week 02 of 2026)
- Root: `EBR` (Evidence-Based Rules/Conduct)
- Type: `Database`
- Description: `Weekly_Conduct_Generator`
- Project: `EBRConductGenerator`
- Extension: `.xlsx`

**V6 Proposed Name:**
```
02-20260111_EBR_Database_Weekly_Conduct_Generator_EBRConductGenerator.xlsx
```

**Migration Command:**
```bash
git mv "data/raw/2026-01-11_EdAssistWeeklyConductGeneratorDB.xlsx" \
       "data/raw/02-20260111_EBR_Database_Weekly_Conduct_Generator_EBRConductGenerator.xlsx"
```

---

### File 2: File Organization Database
**Current:** `2026-01-27_FileOrganizationDB_v3.xlsx`
**Analysis:**
- Original Date: 2026-01-27 (Week 05 of 2026)
- Root: `System`
- Type: `Database`
- Description: `File_Organization`
- Project: `NexusHub` (Infrastructure)
- Tag: `[v3]`
- Extension: `.xlsx`

**V6 Proposed Name:**
```
05-20260127_System_Database_File_Organization_NexusHub[v3].xlsx
```

**Migration Command:**
```bash
git mv "data/raw/2026-01-27_FileOrganizationDB_v3.xlsx" \
       "data/raw/05-20260127_System_Database_File_Organization_NexusHub[v3].xlsx"
```

---

### File 3: AI Agents Inventory
**Current:** `AI Agents Inventory.xlsx`
**Analysis:**
- Original Date: Unknown - using migration date (2026-02-19, Week 08)
- Root: `AI`
- Type: `Inventory`
- Description: `Agents_Registry`
- Project: `AISystems`
- Extension: `.xlsx`

**V6 Proposed Name:**
```
08-20260219_AI_Inventory_Agents_Registry_AISystems.xlsx
```

**Migration Command:**
```bash
git mv "data/raw/AI Agents Inventory.xlsx" \
       "data/raw/08-20260219_AI_Inventory_Agents_Registry_AISystems.xlsx"
```

---

### File 4: AI Index (Master)
**Current:** `AI Index (1).xlsx`
**Analysis:**
- **Status:** ✅ VERIFIED MASTER (most recently modified vs `AI Index.xlsx`)
- Original Date: Unknown - using migration date (2026-02-19, Week 08)
- Root: `AI`
- Type: `Index`
- Description: `Master_Registry`
- Project: `AISystems`
- Extension: `.xlsx`

**V6 Proposed Name:**
```
08-20260219_AI_Index_Master_Registry_AISystems.xlsx
```

**Migration Command:**
```bash
git mv "data/raw/AI Index (1).xlsx" \
       "data/raw/08-20260219_AI_Index_Master_Registry_AISystems.xlsx"
```

---

### File 5: Filenaming Master Database
**Current:** `FilenamingMasterDatabase_v3 (1).xlsx`
**Analysis:**
- **Status:** ✅ VERIFIED MASTER (most recent version)
- Original Date: Unknown - using migration date (2026-02-19, Week 08)
- Root: `System`
- Type: `Database`
- Description: `Filenaming_Standards`
- Project: `NexusHub`
- Tag: `[v3]`
- Extension: `.xlsx`

**V6 Proposed Name:**
```
08-20260219_System_Database_Filenaming_Standards_NexusHub[v3].xlsx
```

**Migration Command:**
```bash
git mv "data/raw/FilenamingMasterDatabase_v3 (1).xlsx" \
       "data/raw/08-20260219_System_Database_Filenaming_Standards_NexusHub[v3].xlsx"
```

---

### File 6: FLAIM Drive Tracker
**Current:** `FLAIM Drive Tracker.xlsx`
**Analysis:**
- Original Date: Unknown - using migration date (2026-02-19, Week 08)
- Root: `FLAIM`
- Type: `Tracker`
- Description: `Drive_Resources`
- Project: `FLAIM`
- Extension: `.xlsx`

**V6 Proposed Name:**
```
08-20260219_FLAIM_Tracker_Drive_Resources_FLAIM.xlsx
```

**Migration Command:**
```bash
git mv "data/raw/FLAIM Drive Tracker.xlsx" \
       "data/raw/08-20260219_FLAIM_Tracker_Drive_Resources_FLAIM.xlsx"
```

---

### File 7: EBR Conduct Generator PDF Export
**Current:** `WeeklyConductGenerator_Proj_EdAssist_Sheet_2026-01-11 - Google Sheets.pdf`
**Analysis:**
- Original Date: 2026-01-11 (Week 02 of 2026)
- Root: `EBR`
- Type: `Export`
- Description: `Weekly_Conduct_Generator`
- Project: `EBRConductGenerator`
- Tag: `[PDF]`
- Extension: `.pdf`

**V6 Proposed Name:**
```
02-20260111_EBR_Export_Weekly_Conduct_Generator_EBRConductGenerator[PDF].pdf
```

**Migration Command:**
```bash
git mv "data/raw/WeeklyConductGenerator_Proj_EdAssist_Sheet_2026-01-11 - Google Sheets.pdf" \
       "data/raw/02-20260111_EBR_Export_Weekly_Conduct_Generator_EBRConductGenerator[PDF].pdf"
```

---

### File 8: Filenaming Standards (Google Sheets Link)
**Current:** `FilenamingMasterDatabase_v3.gsheet`
**Analysis:**
- Original Date: Unknown - using migration date (2026-02-20, Week 08)
- Root: `System`
- Type: `Link`
- Description: `Filenaming_Standards_Cloud`
- Project: `NexusHub`
- Tag: `[v3][GSheet]`
- Extension: `.gsheet`

**V6 Proposed Name:**
```
08-20260220_System_Link_Filenaming_Standards_Cloud_NexusHub[v3][GSheet].gsheet
```

**Migration Command:**
```bash
git mv "data/raw/FilenamingMasterDatabase_v3.gsheet" \
       "data/raw/08-20260220_System_Link_Filenaming_Standards_Cloud_NexusHub[v3][GSheet].gsheet"
```

---

### File 9: AI Index (Google Sheets Link)
**Current:** `AI Index.gsheet`
**Analysis:**
- Original Date: Unknown - using migration date (2026-02-20, Week 08)
- Root: `AI`
- Type: `Link`
- Description: `Master_Registry_Cloud`
- Project: `AISystems`
- Tag: `[GSheet]`
- Extension: `.gsheet`

**V6 Proposed Name:**
```
08-20260220_AI_Link_Master_Registry_Cloud_AISystems[GSheet].gsheet
```

**Migration Command:**
```bash
git mv "data/raw/AI Index.gsheet" \
       "data/raw/08-20260220_AI_Link_Master_Registry_Cloud_AISystems[GSheet].gsheet"
```

---

### File 10: FLAIM Validation Specification
**Current:** `00-FLAIMValidationSpec_Admin_Guide_2026-01-21.md`
**Analysis:**
- Original Date: 2026-01-21 (Week 04 of 2026)
- Root: `FLAIM`
- Type: `Spec`
- Description: `Validation_Admin_Guide`
- Project: `FLAIM`
- Extension: `.md`

**V6 Proposed Name:**
```
04-20260121_FLAIM_Spec_Validation_Admin_Guide_FLAIM.md
```

**Migration Command:**
```bash
git mv "data/raw/00-FLAIMValidationSpec_Admin_Guide_2026-01-21.md" \
       "data/raw/04-20260121_FLAIM_Spec_Validation_Admin_Guide_FLAIM.md"
```

---

## Migration Workflow (For Future Files)

### Step 1: Identify Files
```bash
# List all files in data/raw
ls -la data/raw/
```

### Step 2: Categorize by Project
- Review file content to determine project association
- Check for keywords: "EBR", "conduct", "journal", "morning"
- Verify with Nexus Hub if uncertain (doc_id: 1qEZUBf...)

### Step 3: Generate V6 Name
1. Determine ISO week number: `date +%V`
2. Use file creation/modification date or current date
3. Assign appropriate Root and Type
4. Create descriptive component (max 3-4 words)
5. Add project identifier
6. Include optional tag if needed

### Step 4: Execute Rename (Git-Safe)
```bash
# ALWAYS use git mv to preserve history
git mv "data/raw/old_filename.ext" "data/raw/WW-Date_Root_Type_Description_Project[Tag].ext"
```

### Step 5: Verify with Integrity Sentinel
```bash
python src/integrity_sentinel.py
```

---

## Example Migration Scenarios

### Scenario A: Legacy Journal Entry
**Current:** `morning_journal_feb19.txt`
**Analysis:**
- Content: Morning reflection
- Project: Journal Du Matin
- Date: February 19, 2026 (Week 08)

**V6 Migration:**
```bash
git mv "data/raw/morning_journal_feb19.txt" \
       "data/raw/08-20260219_Journal_Entry_Morning_Reflection_JournalDuMatin.md"
```

---

### Scenario B: EBR Template File
**Current:** `conduct_template_v2.md`
**Analysis:**
- Content: Conduct rule template
- Project: EBR Conduct Generator
- Version: v2
- Date: Current (2026-02-19, Week 08)

**V6 Migration:**
```bash
git mv "data/raw/conduct_template_v2.md" \
       "data/raw/08-20260219_EBR_Template_Base_Conduct_Rules_EBRConductGenerator[v2].md"
```

---

### Scenario C: Mixed/Ambiguous File
**Current:** `notes_2026.txt`
**Required Actions:**
1. Read file content
2. Identify dominant theme
3. Check Nexus Hub for classification
4. If multi-project, split into separate files
5. Apply V6 naming to each

---

## Automation Scripts

### Batch Renamer (To Be Created)
```bash
# Future: python src/v6_batch_migrator.py --project EBRConductGenerator
# Future: python src/v6_batch_migrator.py --project JournalDuMatin
# Future: python src/v6_batch_migrator.py --interactive
```

### Validation Commands
```bash
# Verify V6 compliance
python src/v6_renamer_engine.py --validate

# Audit file integrity
python src/integrity_sentinel.py

# Generate project status
python src/project_status_aggregator.py
```

---

## Naming Pattern Library

### Common Patterns

#### EBR Conduct Generator
- `WW-YYYYMMDD_EBR_Template_*_EBRConductGenerator.md`
- `WW-YYYYMMDD_EBR_Output_Weekly_*_EBRConductGenerator.txt`
- `WW-YYYYMMDD_Conduct_Rule_*_EBRConductGenerator[Draft].md`
- `WW-YYYYMMDD_EBR_Config_*_EBRConductGenerator.json`

#### Journal Du Matin
- `WW-YYYYMMDD_Journal_Entry_Morning_*_JournalDuMatin.md`
- `WW-YYYYMMDD_Morning_Summary_Weekly_*_JournalDuMatin.md`
- `WW-YYYYMMDD_Journal_Template_*_JournalDuMatin.md`
- `WW-YYYYMMDD_Reflection_Analysis_*_JournalDuMatin[Final].md`

---

## Safety Rules

### Before Any Rename Operation
1. **Verify File ID:** Check Nexus Hub (doc_id: 1qEZUBf...)
2. **Never Delete:** Move or rename only, never delete without verification
3. **Use Git MV:** Always use `git mv` to preserve git history
4. **Backup First:** Consider creating backup branch for large migrations
5. **Test Pattern:** Validate one file before batch operations

### Energy Tier Considerations
- **40 CAG (High):** Both projects - prioritize in Morning Sync Report
- Schedule migrations during low-activity periods
- Update project status reports after completion

---

## Next Steps

### When Files Arrive in data/raw/

1. **Immediate Action:**
   ```bash
   # Inventory new files
   ls -la data/raw/ > logs/raw_inventory_$(date +%Y%m%d).txt
   ```

2. **Classification:**
   - Review file content
   - Categorize by project
   - Determine appropriate V6 components

3. **Migration:**
   - Generate V6 names using this plan
   - Execute `git mv` commands
   - Run integrity sentinel

4. **Verification:**
   ```bash
   python src/integrity_sentinel.py
   python src/project_status_aggregator.py
   ```

5. **Update This Plan:**
   - Document any new patterns discovered
   - Add actual migration examples
   - Refine naming conventions as needed

---

## Migration Checklist Template

For each file batch:
- [ ] Inventory created and saved to `/logs`
- [ ] Files categorized by project
- [ ] V6 names generated and validated
- [ ] Nexus Hub checked for all files
- [ ] Git branch created (if large batch)
- [ ] `git mv` commands executed
- [ ] Integrity sentinel passed
- [ ] Project status updated
- [ ] Migration logged in project documentation

---

## Appendix: Quick Reference

### Date/Week Commands
```bash
# Get current ISO week
date +%V

# Get date in V6 format
date +%Y%m%d
date +%Y-%m-%d

# Get week number for specific date
date -j -f "%Y-%m-%d" "2026-02-19" +%V
```

### File Pattern Searches
```bash
# Find files by project
grep -r "EBR" data/raw/
grep -r "Journal" data/raw/

# Find non-V6 compliant names
find data/raw/ -type f ! -name "[0-9][0-9]-*"
```

---

## BATCH MIGRATION SCRIPT

### Execute All Migrations (Master Files Only)

```bash
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
```

### Save Script to File
```bash
# Create executable migration script
cat > plans/migrate_to_v6.sh << 'EOF'
[Copy content from above]
EOF

chmod +x plans/migrate_to_v6.sh
```

---

## MIGRATION SUMMARY

### Files by Project (After Master Sniffing - 2 Runs)

| Project | File Count | V6 Names (After Migration) |
|---------|------------|----------------------------|
| **EBR Conduct Generator** | 2 | `02-20260111_EBR_Database_Weekly_Conduct_Generator_EBRConductGenerator.xlsx`<br>`02-20260111_EBR_Export_Weekly_Conduct_Generator_EBRConductGenerator[PDF].pdf` |
| **Journal Du Matin** | 0 | None found |
| **NexusHub (Infrastructure)** | 3 | `05-20260127_System_Database_File_Organization_NexusHub[v3].xlsx`<br>`08-20260219_System_Database_Filenaming_Standards_NexusHub[v3].xlsx`<br>`08-20260220_System_Link_Filenaming_Standards_Cloud_NexusHub[v3][GSheet].gsheet` |
| **AISystems** | 3 | `08-20260219_AI_Index_Master_Registry_AISystems.xlsx`<br>`08-20260219_AI_Inventory_Agents_Registry_AISystems.xlsx`<br>`08-20260220_AI_Link_Master_Registry_Cloud_AISystems[GSheet].gsheet` |
| **FLAIM** | 2 | `08-20260219_FLAIM_Tracker_Drive_Resources_FLAIM.xlsx`<br>`04-20260121_FLAIM_Spec_Validation_Admin_Guide_FLAIM.md` |
| **TOTAL** | 10 | All masters verified by sniff_master_files.py |

### Master File Selection Summary

✅ **Duplicates Resolved:**
- `AI Index (1).xlsx` selected as MASTER (most recent modification)
- `AI Index.xlsx` excluded as OUTDATED
- `FilenamingMasterDatabase_v3 (1).xlsx` selected as MASTER (Excel)
- `FilenamingMasterDatabase_v3.xlsx` excluded as OUTDATED
- `FilenamingMasterDatabase_v3.gsheet` selected as MASTER (Google Sheets link)
- `AI Index.gsheet` selected as MASTER (Google Sheets link)

✅ **Files Excluded:**
- `2026-01-04-EdAssistCurriculumDataBase.xlsx` - OUTDATED (older EdAssist version)
- `ConductChartScript_Proj_EdAssist_2026-01-11.docx` - OUTDATED
- `Proj_EdAssist_MathBellringers.pptx` - OUTDATED
- `Proj_EdAssist_2026-01-02_Doc_EurekaScopeSeq.pdf` - OUTDATED
- `FLAIM_OperationsDashboard_v2.json` - OUTDATED
- `FilenamingMasterDatabase.gsheet` - OUTDATED (older version)

### File Type Distribution

| Type | Count | Examples |
|------|-------|----------|
| Excel (.xlsx) | 6 | Databases, trackers, inventories |
| Google Sheets Links (.gsheet) | 2 | Cloud-based master references |
| PDF (.pdf) | 1 | Google Sheets export |
| Markdown (.md) | 1 | Documentation/specifications |

### Pre-Migration Checklist

- [x] Master files identified via sniff_master_files.py (2 runs)
- [x] Duplicates resolved automatically by modification date
- [x] V6 naming patterns defined for all 10 files
- [x] Audit logs generated (02-19 and 02-20)
- [ ] Create git branch for migration (recommended)
- [ ] Execute migration script
- [ ] Run integrity sentinel
- [ ] Update Nexus Hub with new file IDs

### Expected Outcome

After migration, `data/raw/` will contain:
- **10 files** - all V6-compliant
- **Git history preserved** via `git mv`
- **2 files** for EBR Conduct Generator project (Excel + PDF)
- **0 files** for Journal Du Matin project (none found)
- **8 files** for other projects (NexusHub, AISystems, FLAIM)

---

**End of Migration Plan**
**Last Updated:** 2026-02-19 23:49
**Status:** Ready for execution
**Next Action:** Resolve duplicate file and execute migration script
