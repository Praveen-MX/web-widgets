import { ElementEntries, EventCaseEntry } from "@mendix/widget-plugin-grid/event-switch/base";
import { CellContext } from "./base";

type ExecuteActionFx = (item: unknown) => void;

const onClick = (execActionFx: ExecuteActionFx): EventCaseEntry<CellContext, HTMLDivElement, "onClick"> => ({
    eventName: "onClick",
    filter: ctx => {
        return ctx.clickTrigger === "single" && (ctx.selectionMethod === "checkbox" || ctx.selectionMethod === "none");
    },
    handler: ({ item }) => execActionFx(item)
});

const onDoubleClick = (
    execActionFx: ExecuteActionFx
): EventCaseEntry<CellContext, HTMLDivElement, "onDoubleClick"> => ({
    eventName: "onDoubleClick",
    filter: ctx => ctx.clickTrigger === "double",
    handler: ({ item }) => execActionFx(item)
});

const onSpaceOrEnter = (execActionFx: ExecuteActionFx): EventCaseEntry<CellContext, HTMLDivElement, "onKeyUp"> => ({
    eventName: "onKeyUp",
    filter: (ctx, event) => {
        return ctx.clickTrigger !== "none" && (event.code === "Space" || event.code === "Enter");
    },
    handler: ({ item }) => execActionFx(item)
});

export function createActionHandlers(
    execActionFx: ExecuteActionFx
): Array<ElementEntries<CellContext, HTMLDivElement>> {
    return [onClick(execActionFx), onDoubleClick(execActionFx), onSpaceOrEnter(execActionFx)];
}