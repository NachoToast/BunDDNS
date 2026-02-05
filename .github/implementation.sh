#!/bin/bash

# Scuffed DDNS implementation via the CloudFlare API
# https://developers.cloudflare.com/api/resources/dns/subresources/records/methods/update/
# https://akashrajpurohit.com/blog/dynamic-dns-made-easy-with-cloudflare-api/
# Run every 5 minutes: 'crontab -e' then '*/5 * * * * /path/to/implementation.sh'

# ====== Setup variables n stuff.

CLOUDFLARE_API_TOKEN=REDACTED

DOMAIN_1_NAME=nachotoast.com
DOMAIN_1_ZONE_ID=c017b2b6a64c4ae11bba9c92a16244f2
DOMAIN_1_RECORD_ID=ea560f1b03083f53fa9c11f6eb00e180

DOMAIN_2_NAME=another-domain
DOMAIN_2_ZONE_ID=36e39ea7ba5099b64299ec65ab5eec15
DOMAIN_2_RECORD_ID=e4b286bba0493d83f2f5d1579046829d

ZONE_NAMES=($DOMAIN_1_NAME $DOMAIN_2_NAME)
ZONE_IDS=($DOMAIN_1_ZONE_ID $DOMAIN_2_ZONE_ID)
DNS_RECORD_IDS=($DOMAIN_1_RECORD_ID $DOMAIN_2_RECORD_ID)

# ===== Get the current IP, to later check if it has changed.
NEW_IP=$(curl --silent https://cloudflare.com/cdn-cgi/trace | grep ip= | cut --delimiter="=" --fields=2)

# ===== Check the first zone's record.

OLD_IP=$(curl --silent https://api.cloudflare.com/client/v4/zones/${ZONE_IDS[0]}/dns_records/${DNS_RECORD_IDS[0]} \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --header "Content-Type: application/json" \
  | jq ".result.content" \
  | tr --delete \")

# ===== If the first zone's record has hanged, assume all zones need updating (and the opposite is also true).

if [ "$NEW_IP" != "$OLD_IP" ]; then
    for i in "${!ZONE_IDS[@]}"; do
        echo "Updating ${ZONE_NAMES[i]}"

        curl --silent https://api.cloudflare.com/client/v4/zones/${ZONE_IDS[i]}/dns_records/${DNS_RECORD_IDS[i]} \
            --request PUT \
            --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            --header "Content-Type: application/json" \
            --data "{
                        \"name\": \"${ZONE_NAMES[i]}\",
                        \"type\": \"A\",
                        \"content\": \"$NEW_IP\",
                        \"proxied\": true,
                        \"comment\": \"Auto-updated on $(date) (previously $OLD_IP)\"
                    }" \
        | jq ".result"
    done
fi

# ===== Helper: This gets the list of all DNS records on a given ZONE_ID.

# curl https://api.cloudflare.com/client/v4/zones/c017b2b6a64c4ae11bba9c92a16244f2/dns_records \
# -H "Authorization: Bearer REDACTED" \
# | jq ".result | map({ id, name, type, content })"
