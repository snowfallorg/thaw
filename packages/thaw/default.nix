{
  lib,
  substituteAll,
  nixos-option,
  nix,
  writeShellApplication,
  inputs,
  bun,
  ...
}: let
  substitute = args: builtins.readFile (substituteAll args);

  src = ./src;
in
  writeShellApplication {
    name = "thaw";
    text = ''
      ${lib.getExe bun} ${src}/index.ts $@
    '';
    checkPhase = "";
    runtimeInputs = [
      nix
    ];
  }
