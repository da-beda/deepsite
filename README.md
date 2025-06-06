# DeepSite Locally 🚀

![Banner Screenshot](./localconfig.png)

Run **DeepSite** on your own environment, without depending on Hugging Face!
Perfect for those who want to customize, integrate, or simply have full control over the platform.

---

## How to Run DeepSite Locally

### 1. Clone the repository
```bash
git clone https://github.com/MartinsMessias/deepsite-locally.git
```

### 2. Configure environment variables
Copy `.env.example` to `.env` and change `APP_PORT` if you want the server to run
on another port. If not configured, the server defaults to **3000**.
```bash
cp .env.example .env
```

### 3. Install dependencies
(Make sure you have **Node.js** installed)
```bash
npm install
```

### 4. Development commands
* `npm run dev`  - start the Vite dev server.
* `npm run lint` - run ESLint on the codebase.
* `npm run build` - compile TypeScript and build production assets.
* `npm run start` - run the compiled Express server.

### 5. Build the project
```bash
npm run build
```

### 6. Start the server
```bash
npm run start
```

## Docker
You can also run DeepSite using Docker:
```bash
docker build -t deepsite .
docker run -p 3000:3000 deepsite
```

## Deploy to GitHub Pages

The repository includes a workflow to automatically build and publish the site
using **GitHub Pages**. Push changes to the `main` branch and GitHub Actions
will deploy the latest production build to the `gh-pages` environment.

You can also build the static files locally:

```bash
npm run build
```

The generated files in the `dist` folder are what GitHub Pages serves.

## Login and Remix features
`/api/login` and `/api/remix` routes are used when running DeepSite inside the
Hugging Face Hub. They are not implemented in this repository, so those
features will only work when deployed as a Hugging Face Space or if you provide
your own backend endpoints.

## Inference providers
Click the gear icon in the UI to configure which provider is used for AI
requests. You can choose `local` (for services like Ollama) or `openrouter` and
provide the corresponding API key, base URL and model. The settings are stored
locally in your browser.

### keywords
deepsite local hosting, deepsite run locally, deepsite self-hosted, how to run deepsite locally, install deepsite on your machine, deepsite local server setup, deepsite offline mode, deepsite localhost tutorial, deploy deepsite on your own server, deepsite self-install guide, how to host deepsite on localhost step-by-step, can deepsite run offline on my computer, deepsite docker installation guide, full guide to running deepsite locally without internet, deepsite self-host vs cloud hosting comparison, deepsite performance tips when running locally, requirements to run deepsite on local environment, best practices for self-hosting deepsite platform, how to speed up deepsite in a local environment, common errors when running deepsite locally and how to fix, deepsite vs other ai site builders local run comparison, top reasons to run deepsite on your own server, is deepsite open-source and local-friendly


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

