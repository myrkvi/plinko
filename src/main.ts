import { Bodies, Body, Composite, Engine, Render, Runner } from "matter-js";

document.querySelector("#startButton")?.addEventListener("click", run);

export default function run() {
    const [WIDTH, HEIGHT] = [600, 800];
    const BALL_DIAMETER = 50;
    const NUM_SEPS = document.querySelector("#slots")?.childElementCount ?? 1;

    const start_x = BALL_DIAMETER + Math.random() * (WIDTH - (BALL_DIAMETER * 2))
    const bounciness = 0.3 + Math.random() * 0.5;
    const mass = 0.5 + Math.random();


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
    const ball = Bodies.circle(start_x, 0, BALL_DIAMETER / 2, { restitution: bounciness, mass: mass});

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
    for (let y = BALL_DIAMETER * 2; y < (HEIGHT - 100); y += BALL_DIAMETER + 15) {
        let f = (flip ? 0 : BALL_DIAMETER / 2)
        for (let x = BALL_DIAMETER/2 + f; x <= (WIDTH+10); x += BALL_DIAMETER + 15) {
            if (x >= (BALL_DIAMETER + 10) && x <= (WIDTH - (BALL_DIAMETER + 10))) {
                pins.push(pin(x, y));
                continue;
            } /*else if (x <= BALL_DIAMETER/2 || x >= (WIDTH - (BALL_DIAMETER/2))) {
                pins.push(pin(x, y));
                continue;
            }*/
            else if (y <= (HEIGHT - 4*BALL_DIAMETER)) {
                const left = x < WIDTH/2;
                pins.push(Bodies.trapezoid(left ? x - 10 : x + 10, y + BALL_DIAMETER/3 + 5, left ? 35 : -35, 25, 2, { isStatic: true}))
            }
        }
        flip = !flip;
    }

    Composite.add(engine.world, [ground, wallLeft, wallRight, ball, ...pins, ...seps]);

    Render.run(render);

    const runner = Runner.create();
    Runner.run(runner, engine);
}