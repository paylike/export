# Export

A collection of scripts to export things from Paylike.

This is work in progress, mostly meant as inspiration and a starting point.

## Export accounting lines to a CSV

```shell
PAYLIKE_KEY=<your app private key> node lines-to-csv.js <merchant ID> > statement.csv
```
