import World from 'core/world';

const world = new World();

function render(): void {
    world.render();
    requestAnimationFrame(render);
}

render();
