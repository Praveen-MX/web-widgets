import { InfiniteBodyProps, useInfiniteControl } from "@mendix/widget-plugin-grid/components/InfiniteBody";
import classNames from "classnames";
import { ReactElement, ReactNode, createElement } from "react";
import { StickySentinel } from "./StickySentinel";

type PickProps = "hasMoreItems" | "setPage" | "isInfinite";

export type WidgetContentProps = {
    className?: string;
    children?: ReactNode;
} & Pick<InfiniteBodyProps, PickProps>;

export function WidgetContent({
    children,
    className,
    hasMoreItems,
    isInfinite,
    setPage
}: WidgetContentProps): ReactElement {
    const [trackScrolling, bodySize, containerRef] = useInfiniteControl({
        hasMoreItems,
        isInfinite,
        setPage
    });

    return (
        <div
            className={classNames(
                "widget-datagrid-content",
                "sticky-table-container",
                { "infinite-loading": isInfinite },
                className
            )}
            ref={containerRef}
            onScroll={isInfinite ? trackScrolling : undefined}
            style={isInfinite && bodySize > 0 ? { maxHeight: bodySize } : undefined}
        >
            <StickySentinel />
            {children}
        </div>
    );
}
