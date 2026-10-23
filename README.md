# Hoenn — A Place to Begin

[Play in your browser](https://nickoulos.github.io/hoenn-explorer/)

A single-player 3D exploration prototype of Littleroot Town and Route 101.
The environment was modeled in Blender and adapted for Godot 4.6's web renderer.

## Controls

- WASD or arrow keys: walk
- Shift: run
- Mouse: look; hold the left button and drag if pointer capture is unavailable
- Mouse wheel: zoom
- Escape: pause
- R: return to the village start

Use a desktop browser with WebGL 2 and hardware acceleration enabled.
The initial download includes the engine and both regions. Buildings are
exterior-only; the northern end of Route 101 marks the prototype boundary.
Walk around the ends of steep ledges; jumping is not implemented.

## Hosting and updates

This repository contains the standalone browser release only. GitHub Pages
publishes the root of `main`. Keep the exported filenames together and unchanged
when replacing the build. `.nojekyll` preserves the static export as-is.

## Credits

An unofficial Pokémon fan environment, not affiliated with Nintendo,
Game Freak or The Pokémon Company. Pokémon and related names belong to their
respective owners. Godot's MIT license and third-party notices are included as
`GODOT_LICENSE.txt` and `GODOT_THIRD_PARTY_NOTICES.txt`.
