# BunDDNS

A very minimal Dynamic DNS tool to routinely update Cloudflare DNS records with my latest IP address.

## Setup

To see how to setup this tool, see the [setup guide](./SETUP_GUIDE.md).

## Details

- Only updates A records.
- Runs on startup and then every 5 minutes (on the minute).
- For the purposes of efficiency, only the first record is checked when deciding whether to update all of them.

## Why

- Why make this?
  > Because I need a way to handle my IP address changing that doesn't involve a third party service like [no-ip](https://www.noip.com/).

- Why not use an existing tool?
  > That's still a third-party service, plus this is basic enough that I can make it myself, so why not.

- Why TypeScript?
  > I did originally write this as a [bash script](.github/implementation.sh), however I wanted the added monitoring functionality of Docker.
