/// <mls shortName="enhancementAura" project="102020" enhancement="_blank" />

import { convertFileNameToTag } from '/_100554_/l2/utilsLit.js'
import { getPropierties } from '/_100554_/l2/propiertiesLit.js'
import { getComponentDependencies } from '/_100554_/l2/dependenciesLit.js'
import { validateTagName, validateRender } from '/_100554_/l2/validateLit.js'
import { setCodeLens } from '/_100554_/l2/codeLensLit.js'
import { injectStyle } from '/_100554_/l2/processCssLit.js'

export const requires: mls.l2.enhancement.IRequire[] = [
    {
        type: 'tspath',
        name: 'lit',
        ref: "file://server/_100554_/l2/litElement.ts"
    },
    {
        type: 'tspath',
        name: 'lit/decorators.js',
        ref: "file://server/_100554_/l2/litDecorators.ts"
    },
    {
        type: "cdn",
        name: "lit",
        ref: "https://cdn.jsdelivr.net/gh/lit/dist@3/all/lit-all.min.js",
    },
    {
        type: "cdn",
        name: "lit/decorators.js",
        ref: "https://cdn.jsdelivr.net/npm/lit@3.0.0/decorators/+esm",
    },
        {
        type: "import",
        name: "tailwind.js",
        ref: "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4",
    }

];

export const getDefaultHtmlExamplePreview = (modelTS: mls.editor.IModelTS): string => {
    const { project, shortName, folder } = modelTS.storFile;
    const tag = convertFileNameToTag({ project, shortName, folder });
    return `<${tag}></${tag}>`;
}

export const getDesignDetails = (modelTS: mls.editor.IModelTS): Promise<mls.l2.enhancement.IDesignDetailsReturn> => {
    return new Promise<mls.l2.enhancement.IDesignDetailsReturn>((resolve, reject) => {
        try {
            const ret = {} as mls.l2.enhancement.IDesignDetailsReturn;
            ret.defaultHtmlExamplePreview = getDefaultHtmlExamplePreview(modelTS);
            ret.properties = getPropierties(modelTS);
            ret.webComponentDependencies = getComponentDependencies(modelTS);
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

        if (validateRender(modelTS)) {
            mls.events.fireFileAction('statusOrErrorChanged', modelTS.storFile, 'left');
            mls.events.fireFileAction('statusOrErrorChanged', modelTS.storFile, 'right');
            return;
        }
    } catch (e: any) {
        return e.message || e;
    }
};


export const onAfterCompile = async (modelTS: mls.editor.IModelTS): Promise<void> => {
    await injectStyle(modelTS, 'Default');
    return;
}
