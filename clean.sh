#!/bin/bash

# Process JavaScript files
echo "Cleaning JavaScript files..."
find frontend -name "*.js" -not -path "*/node_modules/*" | while read file; do
  # Make a backup
  cp "$file" "${file}.bak"
  
  # Remove single-line comments
  sed 's|//.*$||g' "${file}.bak" > "$file"
  
  # Remove empty lines
  grep -v '^[[:space:]]*$' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
  
  # Remove backup
  rm "${file}.bak"
  
  echo "  Processed: $file"
done

# Process Python files
echo "Cleaning Python files..."
find backend -name "*.py" -not -path "*/venv/*" | while read file; do
  # Make a backup
  cp "$file" "${file}.bak"
  
  # Remove Python comments
  sed 's/#.*$//g' "${file}.bak" > "$file"
  
  # Remove empty lines
  grep -v '^[[:space:]]*$' "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
  
  # Remove backup
  rm "${file}.bak"
  
  echo "  Processed: $file"
done

echo "All comments removed. Ready to push to GitHub." 