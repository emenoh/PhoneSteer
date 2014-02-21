# PhoneSteer

Starter project for building a simple Node/Express app w/ websockets to stream motion
data from a mobile device to a paired web page (for example, to use for controlling
a WebGL program on one screen with your mobile device).

------------------------------- RUNNING PROJECT W/ VAGRANT -------------------------------

## General Ruby Box

Basic starting point for building Vagrant boxes for lots of projects - anything from
developing static assets to full Rails apps.

## Whats Included

All the following are available, but not necessarily included in the build by default:

* Redis
* NodeJS (w/ option to auto-install GruntJS)
* Nginx or Apache or no web server
* Base box includes ruby `1.9.3`; specify the version you'd like and it'll be the base
* PostgreSQL, and/or Hstore and PostGIS extensions

## Usage

Clone this repository, and open the Vagrantfile `vagrant/Vagrantfile`. At the very top, there
is a hash called `box_settings`, annotated with instructions. Simple declare whatever you
want to use, and then `$: vagrant up`.

#### Redis

Is installed by default. Change `box_settings[:redis]` to `false` to disable.

#### NodeJS

Is installed by default; GruntJS is not. Change `box_settings[:nodejs][:install]` to `false`
to disable both. Change the `...[:gruntjs]` value to true to install Grunt automatically.

#### Different Web Servers

This repo comes bundled with simple installation methods for both Nginx or Apache, or neither.
If you want to use either server with your project, set `box_settings[:web][:server]` to
either 'nginx' or 'apache' (as a quoted string). Then below, declare where you'd like the
document root of the server to point to. It defaults to the shared folder mounted in your
VM located at `/home/vagrant/app`. Or, the same folder where this Readme file exists.

If you wanted to create a `site` directory and have it act as the web root for the VM, you'd
add it beside the `vagrant` directory (again, same level as this Readme), and then set
the `:doc_root` to `/home/vagrant/app/site`.

If you're using Rails, and you want to use the built-in server for development, you'd change
`box_settings[:web][:server]` to `false`, and then `box_settings[:web][:http_port]` values
`...[:from]` and `...[:to]` to `3000`. This will forward port 3000 from the VM to 3000 on
your machine (http://localhost:3000).

#### Ruby

Is installed by default at version 2.1.0 (stable). The only GEM installed by default is
bundler. Adjust `box_settings[:ruby_settings][:version]` to whichever version you prefer,
and add any gems to the `...[:gems]` array.

#### Postgres Database

Is not installed by default. To enable installation, set `box_settings[:postgres][:install]` to
`true`. If you want to install Hstore or PostGIS extensions, set to true as well.