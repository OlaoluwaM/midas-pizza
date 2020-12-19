#!/usr/bin/env bash

if [[ ! -z "$SUBMOD_INIT" ]] || [[ ! -f "./server/entry.js" ]]; then
  echo "Initializing submodule"
  git submodule init
  git submodule update
  export SUBMOD_INIT=true
else
  echo "$SUBMOD_INIT"
fi
