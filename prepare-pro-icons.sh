#!/bin/bash

packages='@fortawesome/pro-duotone-svg-icons@6.5.1 @fortawesome/pro-light-svg-icons@6.5.1 @fortawesome/pro-regular-svg-icons@6.5.1 @fortawesome/pro-solid-svg-icons@6.5.1'
if [[ "$(npm list $packages)" =~ "empty" ]]; then
    echo "Installing $packages ..."
    yarn add $packages --registry https://npm.fontawesome.com/ --peer --no-lockfile
else
    echo "Required packages are already installed: $packages"
fi

cp ./src/icons/duotone/fontawesomePro.ts ./src/icons/duotone/index.ts
cp ./src/icons/light/fontawesomePro.ts ./src/icons/light/index.ts
cp ./src/icons/regular/fontawesomePro.ts ./src/icons/regular/index.ts
cp ./src/icons/solid/fontawesomePro.ts ./src/icons/solid/index.ts

echo 'Using Fontawesome Pro Icons'
