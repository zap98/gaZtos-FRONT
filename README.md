# gaztos_front

# GUÍA DE ARRANQUE DEL FRONT-END
```
1. Instalación de Node.js: https://nodejs.org/ 
    - Versión: v20.13.1
    - Una vez instalado el node ya podrás utilizar el comando npm

2. (Opcional): Instalar nvm para el control de versiones de node: https://github.com/coreybutler/nvm-windows/releases 
    - Descargar el nvm-setup.zip
    - Listado de las versiones disponibles de node: nvm list
    - Hacer uso de una versión específica: nvm use (Ej: nvm use 20.13.1)

3. Instalación de yarn: npm install -g yarn
    - Verificar si yarn está instalado: yarn --version

4. Instalación de Vue CLI: npm install -g @vue/cli
    - Verificar si Vue CLI está instalado: vue --version
    - Instalar dependencias: yarn add @vue/cli-service --dev
    - Utilizar el comando si es necesario para reinstalar dependencias: yarn install

5. Instalación de las dependencias de axios: yarn add axios
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
