# Snowfall Thaw

<a href="https://nixos.wiki/wiki/Flakes" target="_blank">
	<img alt="Nix Flakes Ready" src="https://img.shields.io/static/v1?logo=nixos&logoColor=d8dee9&label=Nix%20Flakes&labelColor=5e81ac&message=Ready&color=d8dee9&style=for-the-badge">
</a>
<a href="https://github.com/snowfallorg/lib" target="_blank">
	<img alt="Built With Snowfall" src="https://img.shields.io/static/v1?label=Built%20With&labelColor=5e81ac&message=Snowfall&color=d8dee9&style=for-the-badge">
</a>

<p>
<!--
	This paragraph is not empty, it contains an em space (UTF-8 8195) on the next line in order
	to create a gap in the page.
-->
  
</p>

> Semantic Versioning for Nix Flakes.

## Features

Thaw works by operating directly on the `ref` specified for your flake's inputs. If a ref exists
on the input and is a valid SemVer version, thaw will attempt to upgrade it to the latest version.
Both url querey param and object configuration syntax are supported.

By default, non-major upgrades are allowed, but this can be changed with the `--major` flag. No
additional tools or components are required.

Supported flake input types:

- [x] GitHub
- [ ] GitLab
- [ ] Gitea
- [ ] SourceHut

Need one of these supported? Open an issue or submit a pull request!

## Installation

### Nix Profile

You can install this package imperatively with the following command.

```bash
nix profile install github:snowfallorg/thaw
```

### Nix Configuration

You can install this package by adding it as an input to your Nix Flake.

```nix
{
	description = "My system thaw";

	inputs = {
		nixpkgs.url = "github:nixos/nixpkgs/nixos-23.05";

		# Snowfall Lib is not required, but will make configuration easier for you.
		snowfall-lib = {
			url = "github:snowfallorg/lib";
			inputs.nixpkgs.follows = "nixpkgs";
		};

		snowfall-thaw = {
			url = "github:snowfallorg/thaw";
			inputs.nixpkgs.follows = "nixpkgs";
		};
	};

	outputs = inputs:
		inputs.snowfall-lib.mkFlake {
			inherit inputs;
			src = ./.;

			overlays = with inputs; [
				# Use the overlay provided by this thaw.
				snowfall-thaw.overlays.default

				# There is also a named overlay, though the output is the same.
				snowfall-thaw.overlays."package/thaw"
			];
		};
}
```

If you've added the overlay from this thaw, then in your system configuration you
can add the `snowfallorg.thaw` package.

```nix
{ pkgs }:

{
	environment.systemPackages = with pkgs; [
		snowfallorg.thaw
	];
}
```

## Usage

```
thaw

DESCRIPTION

  Upgrade Nix Flake inputs using SemVer.

USAGE

  $ thaw [options] [...inputs]

OPTIONS

  --flake, -f               Choose a flake other than the current directory
  --major, -M               Allow major version upgrades
  --init, -i                Initialize inputs to the latest version
  --dry-run, -d             Show available upgrades without applying them

  --help, -h                Show this help message
  --verbose                 Increase logging verbosity, up to 3 times
```
