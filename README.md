
# balanceApp

Ayudar a los usuarios a registrar, visualizar y analizar sus ingresos y egresos diarios, con una interfaz intuitiva y accesible desde cualquier dispositivo.


## Authors

- [@mfxrv](https://www.github.com/mfxrv)


## Run Locally

Clone the project

```bash
  git clone https://github.com/mfxrv/balanceApp
```

Go to the project directory

```bash
  cd balanceApp
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Deployment

To deploy this project run

```bash
  npm run build && npm run preview
```


## Features

- week4/
- Implementacion IndexedDB
- Sincronización en segundo plano
- Notificaciones push (desarrollo)


## Documentation

[Documentation](https://deepwiki.com/mfxrv/balanceApp)


La aplicación implementa las siguientes capacidades principales:

- Operación Offline-First
- Persistencia de datos locales. Almacenamiento basado en IndexedDB para registros de gastos
- Sincronización de fondo
- PWA instalable. Instalación nativa similar a la aplicación a través de un manifiesto de aplicación web
- Interfaz de usuario sensible. Aplicación de una sola página con enrutamiento del lado del cliente basado en hash
