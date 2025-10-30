# Magistrala

[![license][license]](LICENSE)

This repo collects the collaborative work on Magistrala documentation.
The official documentation is hosted at [Magistrala Docs page][docs].
Documentation is auto-generated from Markdown files in this repo.

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

> Additional practical information about Magistrala system, news and tutorials can be found on the [Magistrala blog][blog].

## Prerequisites

- [Docusaurus](https://docusaurus.io/docs/installation)
- [Node.js](https://nodejs.org/) (version >= 18)
- [pnpm](https://pnpm.io/installation)

We use [`pnpm`](https://pnpm.io/) as our package manager for its speed and efficient dependency caching.

Install `pnpm` globally:

```bash
npm install -g pnpm
```

You can also use Corepack (recommended if you're on Node.js 16.13+):

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

## Installation

Doc repo can be fetched from GitHub:

```bash
git clone https://github.com/absmach/magistrala-docs.git
cd magistrala-docs
```

Install the required dependencies using:

```bash
pnpm install
```

### Local Development

Start a local development server:

```bash
pnpm start
```

This will open the docs in your browser and support live reloading on changes.

## Build

Build the documentation site using the following command:

```bash
pnpm build
```

To preview the built site locally:

```bash
pnpm serve
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Contributing

Thank you for your interest in Magistrala and the desire to contribute!

1. Take a look at our [open issues](https://github.com/absmach/magistrala-docs/issues). The [good-first-issue](https://github.com/absmach/magistrala-docs/labels/good-first-issue) label is specifically for issues that are great for getting started.
2. Check out the [contribution guide](CONTRIBUTING.md) to learn more about our style and conventions.
3. Make your changes compatible with our workflow.

## Community

- [Matrix][matrix]
- [Twitter][twitter]

## License

[Apache-2.0](LICENSE)

[matrix]: https://matrix.to/#/#Mainflux_mainflux:gitter.im
[license]: https://img.shields.io/badge/license-Apache%20v2.0-blue.svg
[blog]: https://medium.com/abstract-machines-blog
[twitter]: https://twitter.com/absmach
[docs]: https://docs.magistrala.absmach.eu
