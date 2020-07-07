# crypto_bot

A simple bot for creating transactions using the Waves protocol

# Project setup

### Setup all packages

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Run tests

```
npm run test
```

# Config file

You need to create `.configrc` file in the root directory

### File structure

```
[bot]

botToken = your telegram bot token

[waves]

; The address of the node we are working with
node = https://nodes.wavesnodes.com

assetId = HHnWrJuQL3MxxTXSM4wJJr9weQy2awDESNXjUxExgJN9
assetFeeId = HHnWrJuQL3MxxTXSM4wJJr9weQy2awDESNXjUxExgJN9
minFee = 100000
```
