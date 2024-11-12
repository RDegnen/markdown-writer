#!/bin/bash

# Activate the Python virtual environment
source venv/bin/activate

yarn run build
yarn run postBuild
node dist/index.js --ifp $1 --ift $2

# Deactivate the virtual environment (optional, as it ends automatically when the script finishes)
deactivate
