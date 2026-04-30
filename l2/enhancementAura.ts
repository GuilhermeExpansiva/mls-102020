/// <mls fileReference="_102020_/l2/enhancementAura.ts" enhancement="_blank" />

import { convertFileToTag, validateTagName } from '/_102020_/l2/utils.js'
import { getPropierties } from '/_102027_/l2/propiertiesLit.js'
import { setCodeLens } from '/_102027_/l2/codeLensLit.js';
import { injectStyle } from '/_102027_/l2/processCssLit.js'

export const requires: mls.l2.enhancement.IRequire[] = [
    {
        type: 'tspath',
        name: 'lit',
        ref: "file://server/_102027_/l2/litElement.ts"
    },
    {
        type: "cdn",
        name: "lit",
        ref: "https://cdn.jsdelivr.net/npm/lit@3/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/decorators.js',
        ref: "file://server/_102027_/l2/decorators.ts"
    },
    {
        type: "cdn",
        name: "lit/decorators.js",
        ref: "https://cdn.jsdelivr.net/npm/lit@3/decorators.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/unsafe-html.js',
        ref: "file://server/_102027_/l2/unsafeHtml.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/unsafe-html.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/unsafe-html.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/class-map.js',
        ref: "file://server/_102027_/l2/directives/classMap.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/class-map.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/class-map.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/style-map.js',
        ref: "file://server/_102027_/l2/directives/styleMap.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/style-map.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/style-map.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/repeat.js',
        ref: "file://server/_102027_/l2/directives/repeat.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/repeat.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/repeat.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/if-defined.js',
        ref: "file://server/_102027_/l2/directives/ifDefined.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/if-defined.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/if-defined.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/when.js',
        ref: "file://server/_102027_/l2/directives/when.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/when.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/when.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/choose.js',
        ref: "file://server/_102027_/l2/directives/choose.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/choose.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/choose.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/map.js',
        ref: "file://server/_102027_/l2/directives/map.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/map.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/map.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/range.js',
        ref: "file://server/_102027_/l2/directives/range.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/range.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/range.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/join.js',
        ref: "file://server/_102027_/l2/directives/join.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/join.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/join.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/cache.js',
        ref: "file://server/_102027_/l2/directives/cache.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/cache.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/cache.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/keyed.js',
        ref: "file://server/_102027_/l2/directives/keyed.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/keyed.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/keyed.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/ref.js',
        ref: "file://server/_102027_/l2/directives/ref.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/ref.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/ref.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/live.js',
        ref: "file://server/_102027_/l2/directives/live.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/live.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/live.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/until.js',
        ref: "file://server/_102027_/l2/directives/until.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/until.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/until.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/async-append.js',
        ref: "file://server/_102027_/l2/directives/asyncAppend.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/async-append.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/async-append.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/async-replace.js',
        ref: "file://server/_102027_/l2/directives/asyncReplace.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/async-replace.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/async-replace.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/guard.js',
        ref: "file://server/_102027_/l2/directives/guard.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/guard.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/guard.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/template-content.js',
        ref: "file://server/_102027_/l2/directives/templateContent.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/template-content.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/template-content.js/+esm",
    },

    {
        type: 'tspath',
        name: 'lit/directives/unsafe-svg.js',
        ref: "file://server/_102027_/l2/directives/unsafeSvg.ts"
    },
    {
        type: "cdn",
        name: 'lit/directives/unsafe-svg.js',
        ref: "https://cdn.jsdelivr.net/npm/lit@3/directives/unsafe-svg.js/+esm",
    },

    {
        type: "import",
        name: "tailwind.js",
        ref: "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4",
    }
];

export const getDefaultHtmlExamplePreview = (modelTS: mls.editor.IModelTS): string => {
    const { project, shortName, folder } = modelTS.storFile;
    const tag = convertFileToTag({ project, shortName, folder });
    return tag;
}

export const getDesignDetails = (modelTS: mls.editor.IModelTS): Promise<mls.l2.enhancement.IDesignDetailsReturn> => {
    return new Promise<mls.l2.enhancement.IDesignDetailsReturn>((resolve, reject) => {
        try {
            const ret: mls.l2.enhancement.IDesignDetailsReturn = {
                defaultGroupName: "",
                defaultHtmlExamplePreview: getDefaultHtmlExamplePreview(modelTS),
                properties: getPropierties(modelTS),
                webComponentDependencies: []
            }
            resolve(ret);
        } catch (e) {
            reject(e);
        }
    })
}

export const onAfterChange = async (modelTS: mls.editor.IModelTS): Promise<void> => {

    try {
        setCodeLens(modelTS);
        if (validateTagName(modelTS)) {
            mls.events.fireFileAction('statusOrErrorChanged', modelTS.storFile, 'left');
            mls.events.fireFileAction('statusOrErrorChanged', modelTS.storFile, 'right');
            return;
        }
    } catch (e: any) {
        return e.message || e;
    }
};


export const onAfterCompile = async (modelTS: mls.editor.IModelTS): Promise<void> => {
    await injectStyle(modelTS, 'Default', '_102020_/l2/enhancementAura');
    return;
}
