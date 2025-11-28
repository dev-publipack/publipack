name: Build and FTP Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: package-lock.json

      - name: Install deps
        run: npm ci

      - name: Build
        run: npm run build

      - name: Copy .htaccess
        run: |
          if [ -f public/.htaccess ]; then
            cp public/.htaccess dist/.htaccess
            echo ".htaccess copied to dist/"
          else
            echo "Warning: public/.htaccess not found"
          fi

      - name: Deploy to FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_HOST }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: ${{ secrets.FTP_PATH }}
          dangerous-clean-slate: true
          exclude: |
            **/.git*
            **/.git*/**
            **/node_modules/**
            **/.next/**
            **/_next/**
            **/out/**