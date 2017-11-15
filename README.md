LIMES Web UI
=========================

This repo contains simple web-based user interface for [LIMES](https://github.com/dice-group/LIMES) server.

# Usage

First, you will need a running instance of [LIMES](https://github.com/dice-group/LIMES) server.
It can be started via docker by executing the following command:

```sh
docker run -d -p 8080:8080 dicegroup/limes
```

This will start LIMES server on port 8080.

Then you can simply start web UI via docker by running:

```sh
docker run -d -p 3000:80 -e LIMES_URL=http://localhost:8080 dicegroup/limes-ui
```

Web UI will be available in browser on `http://localhost:3000`
