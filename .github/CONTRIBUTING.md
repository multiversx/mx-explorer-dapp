# Contributing to multiversx/mx-explorer-dapp

If you are unfamiliar with the workflow of contributing to github, you can refer to this [this article](https://github.com/firstcontributions/first-contributions/blob/master/README.md)

## Fork & clone this repository

The development should happen in a personal fork, cloned on the local machine.

## Use development branch

Changes should happen against:

- the `development` branch if it is about a new feature
- the `main` branch if the change is a bugfix

## Weapon of choice: Visual Studio Code

We use Visual Studio code internally and have also included some specific settings, such as running ESLint fixes on save, as well as automatic code formatting.

If contributing from other tools such as Jetbrains Webstorm, there might be slight formatting differences which might interfere with later edits from the internal team or from other external contributors.

## Use linter

Before opening a pull request, run `npm run lint` against your local changes to make sure the code adheres to the accepted standards within the repo.

You can also run `npm run lint:fix` to apply automatic fixes to the code.

## Manual testing

Although the nominal use case looks good, the linter runs without issues, some unforeseen bugs may arise.

That's why, every change, however small, should be tested thoroughly with the mindset of "How can I make the code break" by testing its limits, sending unsanitized inputs, trying to extract a lot more data than needed, etc. It will help minimize the friction between the developer and the reviewer. It will also make sure the PR gets approved & deployed faster.
