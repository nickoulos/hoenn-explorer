# Hoenn — A Place to Begin

[Play in your browser](https://nickoulos.github.io/hoenn-explorer/)

A single-player first-person exploration of the connected Hoenn environment.
The environment was modeled in Blender and adapted for Godot 4.6's web renderer.
Visit Littleroot, Oldale, Petalburg, Rustboro, Routes 101–105 and 116,
Petalburg Woods and the warm Rusturf Tunnel. Route 104 includes both halves.

## Controls

- WASD or arrow keys: walk
- Shift: run
- Mouse: look; hold the left button and drag if pointer capture is unavailable
- Escape: pause
- Escape menu: choose a destination and Travel
- Graphics: High, Balanced (default), or Performance; your choice is remembered
- Space: jump
- E: enter a nearby Center/Mart, or return outside
- R: return to the village start

Use a desktop browser with WebGL 2 and hardware acceleration enabled.
Regions download as needed. The six Centers/Marts reuse two furnished interiors.
Water can be crossed in first person. Routes 106, 110 and 115, Dewford and
Verdanturf are not yet built. The fine grass uses shared geometry and distance
levels of detail. Other buildings are exterior-only.

Click **Music**, then Play in the visible YouTube player for the original
Pokémon Ruby/Sapphire soundtrack. Themes follow the current town, route or
shop; areas sharing a theme keep it playing. Closing the player stops playback.
Music streams from Pokémon's official YouTube compilation; no soundtrack
media is included in this repository.

## Hosting and updates

This repository contains the standalone browser release only. GitHub Pages
publishes the root of `main`. Keep the exported filenames together and unchanged
when replacing the build. `.nojekyll` preserves the static export as-is.

## Credits

An unofficial Pokémon fan environment, not affiliated with Nintendo,
Game Freak or The Pokémon Company. Pokémon and related names belong to their
respective owners. Godot's MIT license and third-party notices are included as
`GODOT_LICENSE.txt` and `GODOT_THIRD_PARTY_NOTICES.txt`.
