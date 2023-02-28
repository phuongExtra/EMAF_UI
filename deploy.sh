#!/bin/bash

# Stop bash when failer occur
set -e

# Constant
HOST="root@103.75.185.147"
PORT=24700
ROOT_NAME="EMAF UI"
GIT_URL="https://gitlab.com/fpt-capstones/emaf-ui.git"
PATH_PEM_FILE="fstart.pem"

# Script
START_TIME=$(date +%s)
echo "+++ Build +++"

read -p "Source branch: " BRANCH
read -p "Environment (stg/prod): " ENV
if [[ $ENV != "stg" && $ENV != "prod" ]]; then
  echo "[WARN] The value of environment variable must be 'stg' or 'prod'."
  exit 1
fi

echo "\n+++ Connecting to server with ${HOST}..."

SSH_CMD="ssh -i ${PATH_PEM_FILE} -p ${PORT} ${HOST} "
MOVE_CMD="cd ${ROOT_NAME} && "

echo "+++ Fetching new source..."
$SSH_CMD "rm -rf ${ROOT_NAME}"
$SSH_CMD "git clone -b ${BRANCH} ${GIT_URL}"

echo "\n+++ Installing libraries..."
$SSH_CMD "${MOVE_CMD} yarn install"

echo "+++ Checking eslint..."
$SSH_CMD "${MOVE_CMD} yarn fix"

echo "\n+++ Building source code..."
$SSH_CMD "${MOVE_CMD} NODE_ENV=${ENV} yarn build"

echo "\n+++ Starting..."
$SSH_CMD "pm2 delete ${ROOT_NAME}"
$SSH_CMD "pm2 serve ${ROOT_NAME}/dist 3001 --name ${ROOT_NAME} --spa"

echo "\n+++ Starting..."
echo "\n+++ [NOTE] After starting successfully, press Crlt + C to exit."

END_TIME=$(date +%s)
EXEC_TIME=$(($END_TIME-$START_TIME))
echo "\n+++ Finish $EXEC_TIME seconds +++"
