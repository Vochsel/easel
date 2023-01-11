# Deployment

## FAQ

### Iframes aren't working

Make sure there are no `.htaccess` files enforcing cross origin embedder policy rules.

```
# Cross-Origin-Embedder-Policy: require-corp
<IfModule mod_headers.c>
  Header set Cross-Origin-Embedder-Policy: "require-corp"
</IfModule>

# Cross-Origin-Opener-Policy: same-origin
<IfModule mod_headers.c>
    Header set Cross-Origin-Opener-Policy: "same-origin"
</IfModule>
```