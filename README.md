# @necraidan/ngx-lightbox - workspace

Angular workspace for the `@necraidan/ngx-lightbox` library and its demo application.

## Structure

```
projects/
├── ngx-lightbox/   # Library source
└── demo/           # Demo application
```

## Development

```bash
npm install

# Build the library (required before serving the demo)
npx ng build ngx-lightbox

# Serve the demo
npx ng serve demo
```

## Release

1. Bump the version in `projects/ngx-lightbox/package.json`
2. Commit and push
3. Create a GitHub Release - the publish workflow triggers automatically
