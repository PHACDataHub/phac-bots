#!/usr/bin/env bash

BASHRC=$HOME/.bashrc

# add a blank line
echo "" >> $BASHRC
echo "###### PHAC .bashrc UPDATES BELOW HERE ######" >> $BASHRC
echo "# New Project ID" >> $BASHRC
#echo "alias npi2=\"curl --silent https://ulid.truestamp.com/ | jq '.[0].ulid' | tr '[:upper:]' '[:lower:]' | cut -c 2-11\"" >> $BASHRC
echo "alias npi=\"$HOME/ulid -sl\"" >> $BASHRC
echo "alias kpt_pkg_get_dflt_prj=\"kpt pkg get https://github.com/PHACDataHub/acm-core/tree/main/templates/default-project\"" >> $BASHRC

# this adds a default flag to cargo so that it intiates rust proejcts with no
# version control (since we are inside a GitHub repo already)
# "cargo new <name>" will not init a default repo.  Just a clean base project.
# CONFIG_TOML=$HOME/.cargo/config.toml
# touch $CONFIG_TOML
# echo "[cargo-new]" >> $CONFIG_TOML
# echo "vcs = \"none\"" >> $CONFIG_TOML
