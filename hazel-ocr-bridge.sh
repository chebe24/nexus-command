#!/bin/bash
# ============================================================
# hazel_ocr_bridge.sh
# Version: 4.0 — Dual Destination Edition
# Updated: 2026-03-01
# Trigger: Hazel drops a PDF into 00_Inbox/ScannedInbox
# Math files: copied to BOTH My Drive + FLAIM Shared Drive
# All other folders: single destination
# ============================================================

# --- CONFIGURATION ---
WEBAPP_URL="https://script.google.com/macros/s/AKfycbxAluWilnJHGljMQAW4gpSsPC6Tci1YxWsy_btxn-ORMJbq8axEMr43tlV4rpnjBwhrjg/exec"
OCR_LANGS="eng+chi_sim"

# --- GOOGLE DRIVE MOUNT ROOTS ---
DRIVE_WORK="$HOME/Library/CloudStorage/GoogleDrive-chebert4@ebrschools.org/My Drive"
DRIVE_SHARED="$HOME/Library/CloudStorage/GoogleDrive-chebert4@ebrschools.org/Shared drives/2025-26 FLAIM First Grade"
DRIVE_PERSONAL="$HOME/Library/CloudStorage/GoogleDrive-cary.hebert@gmail.com/My Drive"

# --- FOLDER ROUTING MAP ---
FOLDER_MATH_PRIVATE="$DRIVE_WORK/33_Math"
FOLDER_MATH_SHARED="$DRIVE_SHARED/3-Maths"
FOLDER_ADMIN="$DRIVE_WORK/30_Administrative"
FOLDER_MANDARIN="$DRIVE_PERSONAL/41_Mandarin"
FOLDER_QUARANTINE="/Users/caryhebert/Library/CloudStorage/GoogleDrive-chebert4@ebrschools.org/My Drive/00_Inbox/Quarantine"
FOLDER_SCIENCE="$DRIVE_WORK/34_Sciences"
FOLDER_SS="$DRIVE_WORK/35_SocialStudies"
FOLDER_FRENCH="$DRIVE_WORK/36_French"
FOLDER_COMM="$DRIVE_WORK/32_Communication"

# --- INPUT ---
FILE_PATH="$1"
FILENAME=$(basename "$FILE_PATH")
FILE_DIR=$(dirname "$FILE_PATH")
OCR_FILENAME="OCR_$FILENAME"
OCR_FILE_PATH="$FILE_DIR/$OCR_FILENAME"

echo "▶ Starting OCR for: $FILENAME"

# --- STEP 1: RUN OCR VIA DOCKER ---
docker run --rm \
  -v "$FILE_DIR:/home/docker" \
  jbarlow83/ocrmypdf \
  -l "$OCR_LANGS" \
  --rotate-pages \
  --deskew --skip-text \
  "/home/docker/$FILENAME" "/home/docker/$OCR_FILENAME"

OCR_EXIT=$?

# --- STEP 2: SMART ROUTING ---
# V6 pattern: ##-####-##-##_SubjectCode_FileType_Description.ext
SUBJECT_CODE=$(echo "$FILENAME" | cut -d'_' -f2)

if [ $OCR_EXIT -eq 0 ]; then
  echo "✅ OCR succeeded. SubjectCode: $SUBJECT_CODE"

  case "$SUBJECT_CODE" in

    Math)
      # Extract module number e.g. _M1_ _M2_ _M5_
      MODULE=$(echo "$FILENAME" | grep -oE '_M[0-9]+_' | tr -d '_')

      if [ -n "$MODULE" ]; then
        # Build module number digit only (e.g. M5 → 5)
        MOD_NUM="${MODULE#M}"

        # Private My Drive destination
        DEST_PRIVATE="$FOLDER_MATH_PRIVATE/$MODULE/CurriculumGuides"

        # Shared Drive destination (uses "Module #" and "M#CurriculumGuides")
        DEST_SHARED="$FOLDER_MATH_SHARED/Module $MOD_NUM/${MODULE}CurriculumGuides"

        PROJECT_TAG="Math-$MODULE-CurriculumGuides"

        echo "📐 Math module detected: $MODULE"

        # Copy to private My Drive
        mkdir -p "$DEST_PRIVATE"
        cp "$OCR_FILE_PATH" "$DEST_PRIVATE/$OCR_FILENAME"
        echo "📁 Private copy → $DEST_PRIVATE/"

        # Move original to Shared Drive
        mkdir -p "$DEST_SHARED"
        mv "$OCR_FILE_PATH" "$DEST_SHARED/$OCR_FILENAME"
        echo "👥 Shared copy → $DEST_SHARED/"

      else
        # Math file but no module number — quarantine
        QUARANTINE_REASON="Math file has no module number detected"
        DEST_FOLDER="$FOLDER_QUARANTINE"
        PROJECT_TAG="Math-NoModule-Quarantine"
        mkdir -p "$DEST_FOLDER"
        mv "$OCR_FILE_PATH" "$DEST_FOLDER/REVIEW_$OCR_FILENAME"
        echo "⚠️  Math file has no module number — sent to Quarantine. ($QUARANTINE_REASON)"
      fi
      ;;

    Mand|mand|MAND|Mandarin|mandarin)
      DEST_FOLDER="$FOLDER_MANDARIN"
      PROJECT_TAG="Mandarin-Study"
      mkdir -p "$DEST_FOLDER"
      mv "$OCR_FILE_PATH" "$DEST_FOLDER/$OCR_FILENAME"
      echo "📁 Moved to: $DEST_FOLDER/"
      ;;

    Admin|admin|ADMIN)
      DEST_FOLDER="$FOLDER_ADMIN"
      PROJECT_TAG="Administration"
      mkdir -p "$DEST_FOLDER"
      mv "$OCR_FILE_PATH" "$DEST_FOLDER/$OCR_FILENAME"
      echo "📁 Moved to: $DEST_FOLDER/"
      ;;

    Sci|sci|SCI)
      DEST_FOLDER="$FOLDER_SCIENCE"
      PROJECT_TAG="Science"
      mkdir -p "$DEST_FOLDER"
      mv "$OCR_FILE_PATH" "$DEST_FOLDER/$OCR_FILENAME"
      echo "📁 Moved to: $DEST_FOLDER/"
      ;;

    SS|ss)
      DEST_FOLDER="$FOLDER_SS"
      PROJECT_TAG="SocialStudies"
      mkdir -p "$DEST_FOLDER"
      mv "$OCR_FILE_PATH" "$DEST_FOLDER/$OCR_FILENAME"
      echo "📁 Moved to: $DEST_FOLDER/"
      ;;

    Fren|fren|FREN|French|french)
      DEST_FOLDER="$FOLDER_FRENCH"
      PROJECT_TAG="FrenchImmersion"
      mkdir -p "$DEST_FOLDER"
      mv "$OCR_FILE_PATH" "$DEST_FOLDER/$OCR_FILENAME"
      echo "📁 Moved to: $DEST_FOLDER/"
      ;;

    Comm|comm|COMM)
      DEST_FOLDER="$FOLDER_COMM"
      PROJECT_TAG="Communications"
      mkdir -p "$DEST_FOLDER"
      mv "$OCR_FILE_PATH" "$DEST_FOLDER/$OCR_FILENAME"
      echo "📁 Moved to: $DEST_FOLDER/"
      ;;

    *)
      QUARANTINE_REASON="No route for subject code: $SUBJECT_CODE"
      DEST_FOLDER="$FOLDER_QUARANTINE"
      PROJECT_TAG="Unmatched-Quarantine"
      mkdir -p "$DEST_FOLDER"
      mv "$OCR_FILE_PATH" "$DEST_FOLDER/NAMING-ERROR_$OCR_FILENAME"
      echo "⚠️  No match for '$SUBJECT_CODE' — sent to Quarantine. ($QUARANTINE_REASON)"
      ;;

  esac

  # Log success to Google Sheet
  REDIRECT=$(curl -s -o /dev/null -w "%{redirect_url}" -X POST \
    "$WEBAPP_URL" \
    -H "Content-Type: application/json" \
    -d "{
      \"filename\": \"$OCR_FILENAME\",
      \"project\": \"$PROJECT_TAG\",
      \"summary\": \"OCR complete. Routed to $PROJECT_TAG.\",
      \"platform\": \"Docker-OCR\"
    }")
  curl -s "$REDIRECT"

else
  # OCR failed — quarantine original file
  echo "❌ OCR failed for: $FILENAME — sending to Quarantine."

  QUARANTINE_REASON="OCR process failed with exit code $OCR_EXIT"
  mkdir -p "$FOLDER_QUARANTINE"
  mv "$FILE_PATH" "$FOLDER_QUARANTINE/FAILED-OCR_$FILENAME"

  REDIRECT=$(curl -s -o /dev/null -w "%{redirect_url}" -X POST \
    "$WEBAPP_URL" \
    -H "Content-Type: application/json" \
    -d "{
      \"filename\": \"$FILENAME\",
      \"project\": \"OCR-Failed\",
      \"summary\": \"OCR failed. Original moved to Quarantine.\",
      \"platform\": \"Docker-OCR\"
    }")
  curl -s "$REDIRECT"

fi

echo "✔ hazel_ocr_bridge.sh complete."
