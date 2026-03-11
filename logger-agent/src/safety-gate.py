import os
import sys
from pathlib import Path

# Configuration
LOG_DIR = Path.home() / "Documents/AILogbooks/logs"

def run_safety_check():
    # 1. Locate the most recent cleanup log
    logs = sorted(LOG_DIR.glob("*_LOGS_SYS_Cleanup-Audit_AILogbooks.md"))
    if not logs:
        print("❌ Error: No cleanup log found. Run sniff_master_files.py first.")
        return

    latest_log = logs[-1]
    print(f"⚠️  SAFETY CHECK: Reviewing {latest_log.name}")

    # 2. Extract flagged files for display
    flagged_files = []
    with open(latest_log, 'r') as f:
        for line in f:
            if "Flagged for Deletion" in line:
                # Extract filename from the markdown table row
                parts = line.split('|')
                if len(parts) > 1:
                    flagged_files.append(parts[1].strip())

    if not flagged_files:
        print("✅ No files are flagged for deletion. System is clean.")
        return

    # 3. Present findings to User
    print(f"\n🚨 WARNING: The following {len(flagged_files)} files are marked for DELETION:")
    for i, file in enumerate(flagged_files, 1):
        print(f"   {i}. {file}")

    # 4. High-Friction Confirmation
    print("\n--- ACTION REQUIRED ---")
    print("Type 'CONFIRM DELETE' to proceed, or anything else to cancel.")
    user_input = input(">> ")

    if user_input == "CONFIRM DELETE":
        print("🚀 Proceeding with deletion of deprecated files...")
        # Placeholder for the actual deletion loop:
        # for file in flagged_files: os.remove(file_path)
    else:
        print("🛑 Action cancelled. No files were harmed.")

if __name__ == "__main__":
    run_safety_check()
