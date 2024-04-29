import { Bodies, Body, Composite, Engine, Render, Runner } from "matter-js";

document.querySelector("#startButton")?.addEventListener("click", run);

export default function run() {
    const [WIDTH, HEIGHT] = [600, 800];
    const BALL_DIAMETER = 50;
    const NUM_SEPS = document.querySelector("#slots")?.childElementCount ?? 1;

    let start_x = BALL_DIAMETER + Math.random() * (WIDTH - (BALL_DIAMETER * 2))

    const engine = Engine.create();
    const render = Render.create({
        canvas: (document.querySelector("#plinko") as HTMLCanvasElement) ?? undefined,
        engine: engine,
        options: {
            width: WIDTH,
            height: HEIGHT
        }
    })

    const ground = Bodies.rectangle(300, 800, 610, 2, { isStatic: true });
    const wallLeft = Bodies.rectangle(0, 400, 2, 810, { isStatic: true })
    const wallRight = Bodies.rectangle(600, 400, 2, 810, { isStatic: true });
    const ball = Bodies.circle(start_x, 0, BALL_DIAMETER / 2, { restitution: 0.5 });

    const seps = [];
    for (let w = 1; w < NUM_SEPS; w++) {

        let x = WIDTH / NUM_SEPS * w;
        seps.push(
            Bodies.rectangle(x, HEIGHT - (75 / 2), 2, 75, { isStatic: true })
        )
    }

    function pin(x: number, y: number): Body {
        return Bodies.circle(x, y, 5, { isStatic: true })
    }

    const pins: Array<Body> = [];

    let flip = true;
    for (let y = BALL_DIAMETER * 2; y < (HEIGHT - 100); y += BALL_DIAMETER * 1.25) {
        let f = (flip ? 0 : BALL_DIAMETER / 2)
        for (let x = BALL_DIAMETER/2 + f; x <= (WIDTH); x += BALL_DIAMETER * 1.25) {
            pins.push(pin(x, y));
        }
        flip = !flip;
    }

    Composite.add(engine.world, [ground, wallLeft, wallRight, ball, ...pins, ...seps]);

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);
}