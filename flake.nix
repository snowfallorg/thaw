{
  description = "Snowfall Thaw";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

    snowfall-lib = {
      url = "github:snowfallorg/lib?ref=v3.0.2";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = inputs:
    inputs.snowfall-lib.mkFlake {
      inherit inputs;

      src = ./.;

      snowfall = {
        namespace = "snowfallorg";

        meta = {
          name = "thaw";
          title = "Thaw";
        };
      };
      alias.packages.default = "thaw";
    };
}
