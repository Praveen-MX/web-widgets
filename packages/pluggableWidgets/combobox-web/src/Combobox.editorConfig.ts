import { Properties, hidePropertiesIn } from "@mendix/pluggable-widgets-tools";
import {
    ContainerProps,
    StructurePreviewProps,
    structurePreviewPalette
} from "@mendix/widget-plugin-platform/preview/structure-preview-api";
import { ComboboxPreviewProps } from "../typings/ComboboxProps";
import { getDatasourcePlaceholderText } from "./helpers/utils";
import IconSVG from "./assets/StructurePreviewIcon.svg";
import IconSVGDark from "./assets/StructurePreviewIconDark.svg";

export function getProperties(values: ComboboxPreviewProps, defaultProperties: Properties): Properties {
    if (["enumeration", "boolean"].includes(values.optionsSourceType)) {
        // hide attribute
        hidePropertiesIn(defaultProperties, values, [
            "attributeAssociation",
            "optionsSourceAssociationCaptionType",
            "optionsSourceAssociationCaptionAttribute",
            "optionsSourceAssociationCaptionExpression",
            "optionsSourceAssociationDataSource",
            "selectedItemsStyle"
        ]);
        if (values.optionsSourceType === "boolean") {
            hidePropertiesIn(defaultProperties, values, ["clearable"]);
            hidePropertiesIn(defaultProperties, values, ["attributeEnumeration"]);
        } else {
            hidePropertiesIn(defaultProperties, values, ["attributeBoolean"]);
        }
    } else if (values.optionsSourceType === "association") {
        hidePropertiesIn(defaultProperties, values, ["attributeEnumeration", "attributeBoolean"]);
        if (values.optionsSourceAssociationCaptionType === "attribute") {
            hidePropertiesIn(defaultProperties, values, ["optionsSourceAssociationCaptionExpression"]);
        } else {
            hidePropertiesIn(defaultProperties, values, ["optionsSourceAssociationCaptionAttribute"]);
        }

        if (values.optionsSourceAssociationDataSource === null) {
            hidePropertiesIn(defaultProperties, values, ["optionsSourceAssociationCaptionType"]);
        }
    }

    return defaultProperties;
}

function getIconPreview(isDarkMode: boolean): ContainerProps {
    return {
        type: "Container",
        children: [
            {
                type: "Container",
                padding: 1
            },
            {
                type: "Image",
                document: decodeURIComponent((isDarkMode ? IconSVGDark : IconSVG).replace("data:image/svg+xml,", "")),
                width: 41,
                height: 16
            }
        ]
    };
}

export function getPreview(_values: ComboboxPreviewProps, isDarkMode: boolean): StructurePreviewProps {
    const palette = structurePreviewPalette[isDarkMode ? "dark" : "light"];

    return {
        type: "RowLayout",
        columnSize: "grow",
        backgroundColor: _values.readOnly ? palette.background.containerDisabled : palette.background.container,
        borders: true,
        borderWidth: 1,
        borderRadius: 2,
        children: [
            {
                type: "Container",
                grow: 1,
                padding: 4,
                children: [
                    {
                        type: "Text",
                        content: getDatasourcePlaceholderText(_values),
                        fontColor: palette.text.data
                    }
                ]
            },
            {
                ...getIconPreview(isDarkMode),
                ...{ grow: 0, padding: 4 }
            }
        ]
    };
}

export function getCustomCaption(values: ComboboxPreviewProps): string {
    return getDatasourcePlaceholderText(values);
}