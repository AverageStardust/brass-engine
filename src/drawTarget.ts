import p5 from "p5";



export type DrawTarget = p5.Graphics | p5;



export let defaultDrawTarget: DrawTarget;



export function setDefaultDrawTarget(drawTarget: DrawTarget) {
    if(defaultDrawTarget !== undefined) {
        throw Error("Found more than one default draw target");
    }
    defaultDrawTarget = drawTarget;
}