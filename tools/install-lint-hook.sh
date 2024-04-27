#!/bin/bash

# File path to the commit-msg hook
HOOKS_DIR=$(git rev-parse --show-toplevel)/.git/hooks
HOOK=$HOOKS_DIR/linting

# Check if the hooks folder exists, if not, create it
if [ ! -d $HOOKS_DIR ]; then
    mkdir $HOOKS_DIR
fi

# Create the linting hooks file and write the script into it
echo '#!/bin/sh

# Run the linter on the frontend code
cd frontend
npm run lint

# Run the linter on the backend code
cd ../backend
npm run lint' > $HOOK

# Make the hook script executable
chmod +x $HOOK

# Output ls of the newly created hook
ls -l $HOOK

echo "linting hook has been installed."