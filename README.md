### Requrements

* `node ^14.x`
* `pm2` process manager

### Installation

* Download and unpack
* Create `pm2.yml` and configure with required environment variables from `pm2.yml.example`.
* (optional) Create `timestamp.txt` with timestamp-bound value. If file doesn't exist, it will be created with current timestamp

### Start

Run `npm start` or manually start `pm2 start pm2.yml`

### Management

See [pm2 documentation](https://pm2.keymetrics.io/docs/usage/process-management/) or `pm2 --help`
