import { ListAttributeValue, ListValue, ObjectItem } from "mendix";
import { FilterTypeEnum } from "../../../typings/ComboboxProps";
import { BaseOptionsProvider } from "../BaseOptionsProvider";
import { datasourceFilter } from "../datasourceFilter";
import { CaptionsProvider, Status, SortOrder } from "../types";
import { DEFAULT_LIMIT_SIZE } from "../utils";

interface Props {
    ds: ListValue;
    filterType: FilterTypeEnum;
    lazyLoading: boolean;
    filterId?: ListAttributeValue["id"];
}

export class DatabaseOptionsProvider extends BaseOptionsProvider<ObjectItem, Props> {
    private ds?: ListValue;
    private filterId?: ListAttributeValue["id"];

    constructor(caption: CaptionsProvider, private valuesMap: Map<string, ObjectItem>) {
        super(caption);
    }

    get sortOrder(): SortOrder {
        let sortDir: SortOrder = "asc";
        if (this.ds) {
            sortDir = (this.ds.sortOrder[0] ?? [])[1];
        }
        return sortDir;
    }

    get status(): Status {
        return this.ds?.status ?? "unavailable";
    }

    get hasMore(): boolean {
        return this.ds?.hasMoreItems ?? false;
    }

    getAll(): string[] {
        if (this.lazyLoading && this.filterId) {
            if (this.searchTerm === "") {
                this.ds?.setFilter(undefined);
            } else {
                const filterCondition = datasourceFilter(this.filterType, this.searchTerm, this.filterId);
                this.ds?.setFilter(filterCondition);
            }

            return this.options;
        } else {
            return this.getAllWithMatchSorter();
        }
    }

    loadMore(): void {
        if (this.ds && this.hasMore) {
            this.ds.setLimit(this.ds.limit + DEFAULT_LIMIT_SIZE);
        }
    }

    _optionToValue(value: string | null): ObjectItem | undefined {
        if (value === null) {
            return undefined;
        }

        return this.valuesMap.get(value);
    }

    _valueToOption(value: ObjectItem | undefined): string | null {
        return (value?.id as string) ?? null;
    }

    _updateProps(props: Props): void {
        this.ds = props.ds;
        this.filterType = props.filterType;
        this.lazyLoading = props.lazyLoading;
        this.filterId = props.filterId;

        const items = this.ds.items ?? [];

        this.valuesMap.clear();

        items.forEach(i => this.valuesMap.set(i.id, i));

        this.options = Array.from(this.valuesMap.keys());
    }
}
