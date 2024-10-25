#!/bin/sh
# Replaces envs if defined
if [ -n "$START_NAME_STOP" ]; then
  echo "Name defined: ${START_NAME_STOP}, replacing in config"
  find /usr/share/nginx/html/ -type f -exec sed -i 's|START_NAME_STOP|'${START_NAME_STOP}'|g' {} +
fi

if [ -n "$START_CHAIN_ID_STOP" ]; then
  echo "Chain ID defined: ${START_CHAIN_ID_STOP}, replacing in config"
  find /usr/share/nginx/html/ -type f -exec sed -i 's|START_CHAIN_ID_STOP|'${START_CHAIN_ID_STOP}'|g' {} +
fi

if [ -n "$START_EGLD_LABEL_STOP" ]; then
  echo "egldLabel defined: ${START_EGLD_LABEL_STOP}, replacing in config"
  find /usr/share/nginx/html/ -type f -exec sed -i 's|START_EGLD_LABEL_STOP|'${START_EGLD_LABEL_STOP}'|g' {} +
fi

if [ -n "$START_WALLET_ADDRESS_STOP" ]; then
  echo "WalletAdress defined: ${START_WALLET_ADDRESS_STOP}, replacing in config"
  find /usr/share/nginx/html/ -type f -exec sed -i 's|START_WALLET_ADDRESS_STOP|'${START_WALLET_ADDRESS_STOP}'|g' {} +
fi

if [ -n "$START_EXPLORER_ADDRESS_STOP" ]; then
  echo "Explorer address defined: ${START_EXPLORER_ADDRESS_STOP}, replacing in config"
  find /usr/share/nginx/html/ -type f -exec sed -i 's|START_EXPLORER_ADDRESS_STOP|'${START_EXPLORER_ADDRESS_STOP}'|g' {} +
fi

if [ -n "$START_NFT_EXPLORER_ADDRESS_STOP" ]; then
  echo "NFT Explorer address defined: ${START_NFT_EXPLORER_ADDRESS_STOP}, replacing in config"
  find /usr/share/nginx/html/ -type f -exec sed -i 's|START_NFT_EXPLORER_ADDRESS_STOP|'${START_NFT_EXPLORER_ADDRESS_STOP}'|g' {} +
fi

if [ -n "$START_API_ADDRESS_STOP" ]; then
  echo "API address defined: ${START_API_ADDRESS_STOP}, replacing in config"
  find /usr/share/nginx/html/ -type f -exec sed -i 's|START_API_ADDRESS_STOP|'${START_API_ADDRESS_STOP}'|g' {} +
fi

exec nginx -g 'daemon off;'
